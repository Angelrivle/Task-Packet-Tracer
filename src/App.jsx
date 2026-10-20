import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import NetworkTopology from './components/NetworkTopology';
import SimulationControls from './components/SimulationControls';
import PacketInspector from './components/PacketInspector';
import DeviceTerminal from './components/DeviceTerminal';
import ComparativeTable from './components/ComparativeTable';
import HardwareCatalog from './components/HardwareCatalog';
import IpPlanTable from './components/IpPlanTable';
import ArpTheory from './components/ArpTheory';
import SecurityAdmin from './components/SecurityAdmin';
import PrintableReport from './components/PrintableReport';
import { DEVICES } from './data/networkData';
import { findPath, pathToHops, ADJACENCY_MAP } from './utils/networkRouting';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [sourceNode, setSourceNode] = useState('PC-01');
  const [destNode, setDestNode] = useState('SRV-01');

  // Simulation execution state
  const [isRunning, setIsRunning] = useState(false);
  const [stepMode, setStepMode] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [simulationSteps, setSimulationSteps] = useState([]);
  const [simulationPackets, setSimulationPackets] = useState([]);

  // Terminal & device selection
  const [activeTerminalDevice, setActiveTerminalDevice] = useState(null);
  const [activeDeviceDetails, setActiveDeviceDetails] = useState(DEVICES[0]);

  // Dynamic memory states
  const [arpTables, setArpTables] = useState({});
  const [macTables, setMacTables] = useState([
    { mac: '00:1A:2B:3C:4D:01', port: 'Gi0/0/0 (R1)', type: 'Estática' },
    { mac: '00:1A:2B:3C:6D:01', port: 'Gi0/24 (SRV-01)', type: 'Estática' },
  ]);

  // Current packet in transit for the inspector
  const [currentPacketInfo, setCurrentPacketInfo] = useState(null);

  // Lookup helper
  const getDevice = useCallback((id) => DEVICES.find(d => d.id === id), []);

  // Generate simulation steps based strictly on the exact physical topology
  const generateSteps = useCallback((directPing = false) => {
    const src = getDevice(sourceNode);
    const dst = getDevice(destNode);
    if (!src || !dst) return [];

    const forwardPath = findPath(sourceNode, destNode);
    const forwardHops = pathToHops(forwardPath);
    const returnPath = findPath(destNode, sourceNode);
    const returnHops = pathToHops(returnPath);

    const steps = [];

    // --- FASE ARP (RESOLUCIÓN DE MAC) ---
    if (!directPing) {
      // Paso 1: Host emisor consulta su caché ARP y envía ARP Request al primer switch
      const firstHop = forwardHops[0];
      steps.push({
        title: `Host Origen (${src.id}) consulta su Caché ARP y emite ARP Request`,
        description: `${src.name} (${src.ip}) necesita enviar un paquete a ${dst.name} (${dst.ip}), pero desconoce su dirección MAC física. Genera una consulta ARP Request con destino Broadcast (FF:FF:FF:FF:FF:FF) y la transmite hacia su switch de acceso (${firstHop.to}).`,
        protocol: 'ARP Request',
        packet: {
          etherType: '0x0806',
          srcMac: src.mac,
          dstMac: 'FF:FF:FF:FF:FF:FF',
          srcIp: src.ip,
          dstIp: dst.ip,
          protocol: 'ARP Request (Broadcast)',
          payloadDetail: `¿Quién tiene ${dst.ip}? Responder a ${src.ip} (${src.mac})`,
        },
        packetsInTransit: [
          { id: 'arp-req-1', from: firstHop.from, to: firstHop.to, protocol: 'ARP-REQ', progress: 0 }
        ],
        onComplete: () => {
          setMacTables(prev => {
            if (prev.some(e => e.mac === src.mac)) return prev;
            return [...prev, { mac: src.mac, port: `Fa0/${src.id.replace('PC-0', '').replace('PC-', '')}`, type: 'Dinámica' }];
          });
        }
      });

      // Paso 2: El primer switch inunda en Broadcast a todos sus puertos conectados (excepto el de entrada)
      const sw1 = firstHop.to;
      const sw1Neighbors = (ADJACENCY_MAP[sw1] || []).filter(id => id !== firstHop.from);
      steps.push({
        title: `El Switch de Acceso (${sw1}) inunda en Broadcast (Flooding)`,
        description: `El switch ${sw1} recibe la trama con destino FF:FF:FF:FF:FF:FF. Registra la MAC de ${src.id} en su tabla CAM y replica la trama simultáneamente por todos sus demás enlaces físicos directos.`,
        protocol: 'ARP Flooding',
        packet: {
          etherType: '0x0806',
          srcMac: src.mac,
          dstMac: 'FF:FF:FF:FF:FF:FF',
          srcIp: src.ip,
          dstIp: dst.ip,
          protocol: 'ARP Broadcast Flooding',
          payloadDetail: `Inundación en todos los puertos activos de ${sw1}`,
        },
        packetsInTransit: sw1Neighbors.map((neighborId, i) => ({
          id: `sw1-flood-${i}`,
          from: sw1,
          to: neighborId,
          protocol: 'ARP-REQ',
          progress: 0
        }))
      });

      // Paso 3: Si la ruta pasa por SW-CORE, SW-CORE inunda hacia sus enlaces restantes
      if (forwardPath.includes('SW-CORE') && sw1 !== 'SW-CORE') {
        const coreNeighbors = (ADJACENCY_MAP['SW-CORE'] || []).filter(id => id !== sw1);
        steps.push({
          title: 'El Switch Principal (SW-CORE) propaga el Broadcast',
          description: `El paquete atraviesa el enlace troncal 10G hacia SW-CORE. Este replica la consulta ARP hacia sus demás enlaces físicos directos (Router R1, Servidor y el otro Switch de acceso).`,
          protocol: 'ARP Core Flooding',
          packet: {
            etherType: '0x0806',
            srcMac: src.mac,
            dstMac: 'FF:FF:FF:FF:FF:FF',
            srcIp: src.ip,
            dstIp: dst.ip,
            protocol: 'ARP Core Broadcast',
            payloadDetail: `Difusión a través del Backbone hacia enlaces activos`,
          },
          packetsInTransit: coreNeighbors.map((neighborId, i) => ({
            id: `core-flood-${i}`,
            from: 'SW-CORE',
            to: neighborId,
            protocol: 'ARP-REQ',
            progress: 0
          }))
        });
      }

      // Paso 4: Si el destino está en el segundo switch de acceso (ej: SW-ACC-02)
      const lastSwitch = forwardHops[forwardHops.length - 1].from;
      if (lastSwitch !== sw1 && lastSwitch !== 'SW-CORE') {
        const lastSwNeighbors = (ADJACENCY_MAP[lastSwitch] || []).filter(id => id !== 'SW-CORE');
        steps.push({
          title: `El Switch de Acceso (${lastSwitch}) distribuye a sus estaciones`,
          description: `El switch ${lastSwitch} retransmite el broadcast a todas las computadoras de su departamento. Cada host compara la IP solicitada con su propia configuración.`,
          protocol: 'ARP Local Flooding',
          packet: {
            etherType: '0x0806',
            srcMac: src.mac,
            dstMac: 'FF:FF:FF:FF:FF:FF',
            srcIp: src.ip,
            dstIp: dst.ip,
            protocol: 'ARP Access Broadcast',
            payloadDetail: `Difusión a los puestos de trabajo de ${lastSwitch}`,
          },
          packetsInTransit: lastSwNeighbors.map((neighborId, i) => ({
            id: `lastsw-flood-${i}`,
            from: lastSwitch,
            to: neighborId,
            protocol: 'ARP-REQ',
            progress: 0
          }))
        });
      }

      // Paso 5: El host destino reconoce su IP y emite ARP Reply Unicast
      // Hacemos que el ARP Reply viaje salto por salto exactamente por la ruta de retorno
      returnHops.forEach((hop, hopIdx) => {
        steps.push({
          title: hopIdx === 0
            ? `${dst.name} reconoce su IP y responde con ARP Reply (Unicast)`
            : `El Switch reenvía el ARP Reply Unicast hacia ${src.id} [Salto ${hopIdx + 1}]`,
          description: hopIdx === 0
            ? `${dst.name} (${dst.ip}) confirma que es su dirección IP (los demás equipos descartaron el paquete). Guarda la MAC de ${src.id} en su tabla y responde con su dirección física MAC (${dst.mac}) en modo Unicast directo.`
            : `Como los switches intermedios ya aprendieron el puerto donde está conectado ${src.id}, el paquete ARP Reply viaja en línea recta de ${hop.from} a ${hop.to} sin inundar la red.`,
          protocol: 'ARP Reply (Unicast)',
          packet: {
            etherType: '0x0806',
            srcMac: dst.mac,
            dstMac: src.mac,
            srcIp: dst.ip,
            dstIp: src.ip,
            protocol: 'ARP Reply (Unicast)',
            payloadDetail: `Yo tengo ${dst.ip}, mi dirección MAC es ${dst.mac}`,
          },
          packetsInTransit: [
            { id: `arp-rep-hop-${hopIdx}`, from: hop.from, to: hop.to, protocol: 'ARP-REP', progress: 0 }
          ],
          onComplete: () => {
            if (hopIdx === returnHops.length - 1) {
              setArpTables(prev => ({ ...prev, [dst.ip]: dst.mac }));
            }
          }
        });
      });
    }

    // --- FASE ICMP PING (SOLICITUD Y RESPUESTA ECO) ---
    // Envío del ICMP Echo Request salto por salto sobre la ruta física directa
    forwardHops.forEach((hop, hopIdx) => {
      steps.push({
        title: hopIdx === 0 
          ? `Envío de ICMP Echo Request (Ping) desde ${src.id}` 
          : `Tránsito de ICMP Echo Request: ${hop.from} ➔ ${hop.to}`,
        description: hopIdx === 0
          ? `Con la MAC física resuelta, ${src.name} encapsula el paquete ICMP Echo Request dentro de una trama Ethernet directa dirigida a ${dst.mac}.`
          : `La trama Ethernet viaja a velocidad de 1 Gbps / 10 Gbps a través del enlace de ${hop.from} hacia ${hop.to}.`,
        protocol: 'ICMP Echo Request',
        packet: {
          etherType: '0x0800',
          srcMac: src.mac,
          dstMac: dst.mac,
          srcIp: src.ip,
          dstIp: dst.ip,
          protocol: 'ICMP Echo Request (Type 8)',
          payloadDetail: '32 bytes de datos de prueba, TTL=64',
        },
        packetsInTransit: [
          { id: `icmp-req-hop-${hopIdx}`, from: hop.from, to: hop.to, protocol: 'ICMP-REQ', progress: 0 }
        ]
      });
    });

    // Envío del ICMP Echo Reply salto por salto sobre la ruta física de retorno
    returnHops.forEach((hop, hopIdx) => {
      steps.push({
        title: hopIdx === 0 
          ? `${dst.name} recibe el Ping y responde con ICMP Echo Reply` 
          : `Retorno de ICMP Echo Reply: ${hop.from} ➔ ${hop.to}`,
        description: hopIdx === 0
          ? `${dst.name} procesa la solicitud de eco y emite de inmediato la confirmación de recepción (ICMP Echo Reply, Type 0).`
          : `Retorno conmutado directo por tabla CAM de ${hop.from} hacia ${hop.to}.`,
        protocol: 'ICMP Echo Reply',
        packet: {
          etherType: '0x0800',
          srcMac: dst.mac,
          dstMac: src.mac,
          srcIp: dst.ip,
          dstIp: src.ip,
          protocol: 'ICMP Echo Reply (Type 0)',
          payloadDetail: 'Confirmación de recepción RTT < 1ms',
        },
        packetsInTransit: [
          { id: `icmp-rep-hop-${hopIdx}`, from: hop.from, to: hop.to, protocol: 'ICMP-REP', progress: 0 }
        ]
      });
    });

    // Paso Final: Éxito total
    steps.push({
      title: `¡Comunicación Exitosa! Ping Completado con Éxito`,
      description: `${src.name} ha recibido la respuesta. 1 paquete enviado, 1 recibido, 0% de pérdida, tiempo de ida y vuelta RTT < 1ms. La red LAN opera con total integridad.`,
      protocol: 'ICMP Success',
      packet: {
        etherType: '0x0800',
        srcMac: dst.mac,
        dstMac: src.mac,
        srcIp: dst.ip,
        dstIp: src.ip,
        protocol: 'ICMP Success',
        payloadDetail: 'RTT: 0.4 ms | Packet Loss: 0%',
      },
      packetsInTransit: [],
      onComplete: () => {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#ffffff', '#10b981', '#38bdf8']
        });
      }
    });

    return steps;
  }, [sourceNode, destNode, getDevice]);

  const handleStartSimulation = (directPing = false) => {
    const steps = generateSteps(directPing);
    setSimulationSteps(steps);
    setCurrentStepIndex(0);
    setIsRunning(true);
    if (steps.length > 0) {
      setCurrentPacketInfo(steps[0].packet);
      setSimulationPackets(steps[0].packetsInTransit);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStepIndex(-1);
    setSimulationPackets([]);
    setCurrentPacketInfo(null);
  };

  const handleClearArpTables = () => {
    setArpTables({});
    handleReset();
  };

  const handleNextStep = () => {
    if (currentStepIndex < simulationSteps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      const step = simulationSteps[nextIdx];
      setCurrentStepIndex(nextIdx);
      setCurrentPacketInfo(step.packet);
      setSimulationPackets(step.packetsInTransit);
      if (step.onComplete) step.onComplete();
    } else {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (!isRunning || currentStepIndex < 0 || currentStepIndex >= simulationSteps.length) {
      return;
    }

    let progress = 0;
    let animId;

    const animate = () => {
      progress += 0.025 * speed;
      if (progress < 1) {
        setSimulationPackets(prev => prev.map(p => ({ ...p, progress })));
        animId = requestAnimationFrame(animate);
      } else {
        const currentStep = simulationSteps[currentStepIndex];
        if (currentStep && currentStep.onComplete) {
          currentStep.onComplete();
        }

        if (stepMode) {
          setIsRunning(false);
        } else if (currentStepIndex < simulationSteps.length - 1) {
          const nextIdx = currentStepIndex + 1;
          const nextStep = simulationSteps[nextIdx];
          setCurrentStepIndex(nextIdx);
          setCurrentPacketInfo(nextStep.packet);
          setSimulationPackets(nextStep.packetsInTransit.map(p => ({ ...p, progress: 0 })));
        } else {
          setIsRunning(false);
        }
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isRunning, currentStepIndex, simulationSteps, speed, stepMode]);

  const handleSimulatePingFromCLI = (srcId, dstId) => {
    setSourceNode(srcId);
    setDestNode(dstId);
    handleStartSimulation(false);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
      {/* Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* TAB 1: SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-4">
            {/* Minimalist Controls */}
            <SimulationControls
              isRunning={isRunning}
              onStart={handleStartSimulation}
              onPause={handlePause}
              onReset={handleReset}
              onNextStep={handleNextStep}
              stepMode={stepMode}
              setStepMode={setStepMode}
              speed={speed}
              setSpeed={setSpeed}
              currentStepData={currentStepIndex >= 0 ? simulationSteps[currentStepIndex] : null}
              totalSteps={simulationSteps.length}
              currentStepIndex={currentStepIndex}
              onClearArpTables={handleClearArpTables}
            />

            {/* Topology Map */}
            <NetworkTopology
              sourceNode={sourceNode}
              setSourceNode={setSourceNode}
              destNode={destNode}
              setDestNode={setDestNode}
              simulationPackets={simulationPackets}
              onSelectDeviceForTerminal={setActiveTerminalDevice}
              activeDeviceDetails={activeDeviceDetails}
              setActiveDeviceDetails={setActiveDeviceDetails}
            />

            {/* Packet & Tables Inspector */}
            <PacketInspector
              currentPacketInfo={currentPacketInfo}
              activeDevice={getDevice(sourceNode)}
              arpTables={arpTables}
              macTables={macTables}
            />
          </div>
        )}

        {/* TAB 2: ARP THEORY */}
        {activeTab === 'arp-theory' && <ArpTheory />}

        {/* TAB 3: COMPARATIVE */}
        {activeTab === 'comparative' && <ComparativeTable />}

        {/* TAB 4: HARDWARE */}
        {activeTab === 'hardware' && <HardwareCatalog />}

        {/* TAB 5: IP PLAN */}
        {activeTab === 'ip-plan' && <IpPlanTable />}

        {/* TAB 6: SECURITY */}
        {activeTab === 'security' && <SecurityAdmin />}

        {/* TAB 7: REPORT */}
        {activeTab === 'report' && <PrintableReport />}
      </main>

      {/* CLI Terminal Modal */}
      {activeTerminalDevice && (
        <DeviceTerminal
          device={activeTerminalDevice}
          onClose={() => setActiveTerminalDevice(null)}
          onSimulatePingFromCLI={handleSimulatePingFromCLI}
        />
      )}

      {/* Minimal Footer */}
      <footer className="border-t border-neutral-900 bg-black py-4 mt-8 text-center text-xs text-neutral-500 font-mono print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>NETSIM // RED LAN 15 NODOS</span>
          <span className="text-neutral-600">
            Diseño minimalista optimizado para despliegue en Vercel
          </span>
        </div>
      </footer>
    </div>
  );
}
