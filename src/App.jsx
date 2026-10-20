import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  // Generate simulation steps based on Source and Destination
  const generateSteps = useCallback((directPing = false) => {
    const src = getDevice(sourceNode);
    const dst = getDevice(destNode);
    if (!src || !dst) return [];

    const steps = [];
    const srcSwitchId = src.connectedTo[0];
    const dstSwitchId = dst.connectedTo[0];
    const sameSwitch = srcSwitchId === dstSwitchId;

    if (!directPing) {
      // Step 1: ARP cache verification
      steps.push({
        title: 'Verificación de Memoria Caché ARP en Host Origen',
        description: `${src.name} (${src.ip}) desea transmitir a ${dst.name} (${dst.ip}). Al no tener la MAC destino en memoria caché, genera una consulta ARP Request en modo Difusión (Broadcast).`,
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
          { id: 'p1', from: src.id, to: srcSwitchId, protocol: 'ARP-REQ', progress: 0 }
        ],
        onComplete: () => {
          setMacTables(prev => {
            if (prev.some(e => e.mac === src.mac)) return prev;
            return [...prev, { mac: src.mac, port: `Fa0/${src.id.replace('PC-0', '').replace('PC-', '')}`, type: 'Dinámica' }];
          });
        }
      });

      // Step 2: Broadcast Flooding on Access Switch
      const accessNeighbors = DEVICES.filter(d => d.connectedTo.includes(srcSwitchId) && d.id !== src.id);
      steps.push({
        title: `Difusión Broadcast (Flooding) por el Switch de Acceso (${srcSwitchId})`,
        description: `El switch ${srcSwitchId} recibe la trama broadcast (MAC destino FF:FF:FF:FF:FF:FF) y la replica por todos los puertos activos de su segmento.`,
        protocol: 'ARP Flooding',
        packet: {
          etherType: '0x0806',
          srcMac: src.mac,
          dstMac: 'FF:FF:FF:FF:FF:FF',
          srcIp: src.ip,
          dstIp: dst.ip,
          protocol: 'ARP Broadcast Flooding',
          payloadDetail: 'Replicación en todos los puertos activos',
        },
        packetsInTransit: accessNeighbors.map((d, idx) => ({
          id: `bcast-${idx}`,
          from: srcSwitchId,
          to: d.id,
          protocol: 'ARP-REQ',
          progress: 0,
        })),
      });

      // Step 3: Propagation to SW-CORE
      if (!sameSwitch || dstSwitchId === 'SW-CORE') {
        steps.push({
          title: 'Propagación del Broadcast hacia el Switch Principal (SW-CORE)',
          description: `El paquete atraviesa el enlace troncal 10G Cat6A hacia SW-CORE, distribuyéndose hacia el Servidor, Router y switch de acceso secundario.`,
          protocol: 'ARP Trunk',
          packet: {
            etherType: '0x0806',
            srcMac: src.mac,
            dstMac: 'FF:FF:FF:FF:FF:FF',
            srcIp: src.ip,
            dstIp: dst.ip,
            protocol: 'ARP Core Broadcast',
            payloadDetail: `Tránsito troncal hacia ${dst.id}`,
          },
          packetsInTransit: [
            { id: 'core-trunk', from: 'SW-CORE', to: dst.id === 'SRV-01' ? 'SRV-01' : dstSwitchId === 'SW-CORE' ? dst.id : dstSwitchId, protocol: 'ARP-REQ', progress: 0 }
          ],
        });
      }

      // Step 4: Destination host receives ARP Request and recognizes its IP
      steps.push({
        title: `${dst.name} reconoce su dirección IP y genera ARP Reply (Unicast)`,
        description: `El host ${dst.name} (${dst.ip}) reconoce su propia dirección IP (los demás equipos descartaron el paquete). Guarda la MAC de ${src.id} en su tabla y responde con un ARP Reply Unicast directo.`,
        protocol: 'ARP Reply',
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
          { id: 'arp-rep-1', from: dst.id, to: dstSwitchId, protocol: 'ARP-REP', progress: 0 }
        ],
        onComplete: () => {
          setArpTables(prev => ({ ...prev, [dst.ip]: dst.mac }));
        }
      });

      // Step 5: ARP Reply travels Unicast
      if (!sameSwitch) {
        steps.push({
          title: `El Switch reenvía el ARP Reply de forma Unicast Directa`,
          description: `Gracias a que los switches ya aprendieron la MAC de ${src.id} en sus tablas CAM, el paquete fluye directamente sin inundación broadcast.`,
          protocol: 'ARP Unicast Forward',
          packet: {
            etherType: '0x0806',
            srcMac: dst.mac,
            dstMac: src.mac,
            srcIp: dst.ip,
            dstIp: src.ip,
            protocol: 'ARP Reply Forwarding',
            payloadDetail: 'Encaminamiento conmutado L2 por tabla CAM',
          },
          packetsInTransit: [
            { id: 'arp-rep-trunk', from: dstSwitchId, to: 'SW-CORE', protocol: 'ARP-REP', progress: 0 },
            { id: 'arp-rep-access', from: 'SW-CORE', to: srcSwitchId, protocol: 'ARP-REP', progress: 0 }
          ],
        });
      }

      // Step 6: ARP Reply arrives at Source Host
      steps.push({
        title: `${src.name} recibe el ARP Reply y actualiza su Memoria Caché`,
        description: `${src.name} registra la MAC física de ${dst.name} (${dst.mac}) en su tabla ARP. A partir de este momento, las tramas de datos se enviarán directamente.`,
        protocol: 'ARP Cache Updated',
        packet: {
          etherType: '0x0806',
          srcMac: dst.mac,
          dstMac: src.mac,
          srcIp: dst.ip,
          dstIp: src.ip,
          protocol: 'ARP Entry Added',
          payloadDetail: `Caché actualizada: ${dst.ip} -> ${dst.mac}`,
        },
        packetsInTransit: [
          { id: 'arp-rep-final', from: srcSwitchId, to: src.id, protocol: 'ARP-REP', progress: 0 }
        ],
        onComplete: () => {
          setArpTables(prev => ({ ...prev, [dst.ip]: dst.mac }));
        }
      });
    }

    // Ping Steps
    steps.push({
      title: `Envío de ICMP Echo Request (Ping) hacia ${dst.id}`,
      description: `Con la MAC de destino resuelta, ${src.name} transmite el paquete ICMP Echo Request encapsulado en trama Ethernet directa hacia ${dst.mac}.`,
      protocol: 'ICMP Echo Request',
      packet: {
        etherType: '0x0800',
        srcMac: src.mac,
        dstMac: dst.mac,
        srcIp: src.ip,
        dstIp: dst.ip,
        protocol: 'ICMP Echo Request (Type 8)',
        payloadDetail: '32 bytes de datos, TTL=64',
      },
      packetsInTransit: [
        { id: 'icmp-req-1', from: src.id, to: srcSwitchId, protocol: 'ICMP-REQ', progress: 0 }
      ],
    });

    if (!sameSwitch) {
      steps.push({
        title: `Conmutación de Paquete ICMP en Backbone de Red`,
        description: `Tránsito a través de los switches de la topología sin colisiones ni demoras.`,
        protocol: 'ICMP In Transit',
        packet: {
          etherType: '0x0800',
          srcMac: src.mac,
          dstMac: dst.mac,
          srcIp: src.ip,
          dstIp: dst.ip,
          protocol: 'ICMP In Transit',
          payloadDetail: 'Tránsito troncal 10G',
        },
        packetsInTransit: [
          { id: 'icmp-req-core', from: srcSwitchId, to: 'SW-CORE', protocol: 'ICMP-REQ', progress: 0 },
          { id: 'icmp-req-dest-sw', from: 'SW-CORE', to: dstSwitchId, protocol: 'ICMP-REQ', progress: 0 }
        ],
      });
    }

    steps.push({
      title: `${dst.name} recibe el Ping y responde con ICMP Echo Reply`,
      description: `${dst.name} procesa la solicitud y retorna de inmediato la respuesta (ICMP Type 0).`,
      protocol: 'ICMP Echo Reply',
      packet: {
        etherType: '0x0800',
        srcMac: dst.mac,
        dstMac: src.mac,
        srcIp: dst.ip,
        dstIp: src.ip,
        protocol: 'ICMP Echo Reply (Type 0)',
        payloadDetail: 'Respuesta exitosa RTT < 1ms, 0% pérdida',
      },
      packetsInTransit: [
        { id: 'icmp-rep-1', from: dst.id, to: dstSwitchId, protocol: 'ICMP-REP', progress: 0 }
      ],
    });

    steps.push({
      title: `¡Comunicación Exitosa! Ping Completado`,
      description: `${src.name} ha recibido la confirmación. 1 paquete transmitido, 1 recibido, 0% pérdida, latencia RTT < 1ms.`,
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
      packetsInTransit: [
        { id: 'icmp-rep-final', from: srcSwitchId, to: src.id, protocol: 'ICMP-REP', progress: 0 }
      ],
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
      progress += 0.02 * speed;
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
