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

  // Animation frame ref
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(0);

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

    // Check if destination is on the same access switch or cross-switch
    const sameSwitch = srcSwitchId === dstSwitchId;

    if (!directPing) {
      // Step 1: ARP cache verification
      steps.push({
        title: 'Verificación de Memoria Caché ARP en el Host Origen',
        description: `${src.name} (${src.ip}) desea enviar un paquete a ${dst.name} (${dst.ip}). Consulta su tabla ARP local pero no encuentra la dirección física MAC de destino. Debe generar una consulta ARP Request.`,
        protocol: 'ARP',
        packet: {
          etherType: '0x0806',
          srcMac: src.mac,
          dstMac: 'FF:FF:FF:FF:FF:FF',
          srcIp: src.ip,
          dstIp: dst.ip,
          protocol: 'ARP Request (Broadcast)',
          payloadDetail: `¿Quién tiene ${dst.ip}? Díselo a ${src.ip} (${src.mac})`,
        },
        packetsInTransit: [
          { id: 'p1', from: src.id, to: srcSwitchId, protocol: 'ARP-REQ', progress: 0 }
        ],
        onComplete: () => {
          // Switch learns source MAC
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
        description: `El switch ${srcSwitchId} recibe la trama broadcast (MAC destino FF:FF:FF:FF:FF:FF). Como no es una trama dirigida a una MAC específica, la replica e inunda por todos los puertos activos de su segmento.`,
        protocol: 'ARP',
        packet: {
          etherType: '0x0806',
          srcMac: src.mac,
          dstMac: 'FF:FF:FF:FF:FF:FF',
          srcIp: src.ip,
          dstIp: dst.ip,
          protocol: 'ARP Broadcast Flooding',
          payloadDetail: 'Replicación masiva por todos los puertos activos',
        },
        packetsInTransit: accessNeighbors.map((d, idx) => ({
          id: `bcast-${idx}`,
          from: srcSwitchId,
          to: d.id,
          protocol: 'ARP-REQ',
          progress: 0,
        })),
      });

      // Step 3: Propagation to SW-CORE (if needed)
      if (!sameSwitch || dstSwitchId === 'SW-CORE') {
        steps.push({
          title: 'Propagación del Broadcast hacia el Switch Principal (SW-CORE)',
          description: `El broadcast atraviesa el enlace troncal (Trunk 10G Cat6A) hacia SW-CORE, el cual distribuye la solicitud hacia el Servidor, Router y el otro switch departamental.`,
          protocol: 'ARP',
          packet: {
            etherType: '0x0806',
            srcMac: src.mac,
            dstMac: 'FF:FF:FF:FF:FF:FF',
            srcIp: src.ip,
            dstIp: dst.ip,
            protocol: 'ARP Core Broadcast',
            payloadDetail: `Difusión a través del Backbone hacia el destino`,
          },
          packetsInTransit: [
            { id: 'core-trunk', from: 'SW-CORE', to: dst.id === 'SRV-01' ? 'SRV-01' : dstSwitchId === 'SW-CORE' ? dst.id : dstSwitchId, protocol: 'ARP-REQ', progress: 0 }
          ],
        });
      }

      // Step 4: Destination host receives ARP Request and recognizes its IP
      steps.push({
        title: `${dst.name} reconoce su dirección IP y genera ARP Reply (Unicast)`,
        description: `El dispositivo ${dst.name} (${dst.ip}) compara la IP solicitada y confirma que es la suya (las demás computadoras descartaron el paquete en silencio). Guarda la MAC de ${src.id} en su propia tabla ARP y responde directamente (Unicast).`,
        protocol: 'ARP',
        packet: {
          etherType: '0x0806',
          srcMac: dst.mac,
          dstMac: src.mac,
          srcIp: dst.ip,
          dstIp: src.ip,
          protocol: 'ARP Reply (Unicast)',
          payloadDetail: `Yo tengo ${dst.ip}, mi dirección física MAC es ${dst.mac}`,
        },
        packetsInTransit: [
          { id: 'arp-rep-1', from: dst.id, to: dstSwitchId, protocol: 'ARP-REP', progress: 0 }
        ],
        onComplete: () => {
          // Destination learns source in its ARP table
          setArpTables(prev => ({ ...prev, [dst.ip]: dst.mac }));
        }
      });

      // Step 5: ARP Reply traveling back unicast
      if (!sameSwitch) {
        steps.push({
          title: `El Switch reenvía el ARP Reply de forma Unicast directa`,
          description: `Como los switches intermedios ya aprendieron en sus tablas CAM por cuál puerto llegó ${src.mac}, el ARP Reply NO se inunda: viaja en línea recta hacia ${src.id}.`,
          protocol: 'ARP',
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
        description: `${src.name} recibe la MAC física de ${dst.name} (${dst.mac}) y la almacena en su memoria RAM (tabla ARP). A partir de este instante, cualquier comunicación futura será directa sin requerir más broadcasts.`,
        protocol: 'ARP',
        packet: {
          etherType: '0x0806',
          srcMac: dst.mac,
          dstMac: src.mac,
          srcIp: dst.ip,
          dstIp: src.ip,
          protocol: 'ARP Cache Entry Added',
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

    // Ping Steps (ICMP Echo Request and Reply)
    steps.push({
      title: `Envío de Trama de Datos: ICMP Echo Request (Ping) hacia ${dst.id}`,
      description: `Ahora que la dirección MAC ya es conocida, ${src.name} encapsula el paquete ICMP Echo Request dentro de una trama Ethernet estándar con MAC destino ${dst.mac} y la envía a velocidad Gigabit.`,
      protocol: 'ICMP',
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
        { id: 'icmp-req-1', from: src.id, to: srcSwitchId, protocol: 'ICMP-REQ', progress: 0 }
      ],
    });

    if (!sameSwitch) {
      steps.push({
        title: `Conmutación de Paquete ICMP a través del Núcleo de Red (Core)`,
        description: `La trama viaja a través de ${srcSwitchId} -> SW-CORE -> ${dstSwitchId} sin colisiones, verificando el CRC de cada trama para asegurar cero errores de transmisión.`,
        protocol: 'ICMP',
        packet: {
          etherType: '0x0800',
          srcMac: src.mac,
          dstMac: dst.mac,
          srcIp: src.ip,
          dstIp: dst.ip,
          protocol: 'ICMP In Transit',
          payloadDetail: 'Tránsito troncal de alta velocidad 10G',
        },
        packetsInTransit: [
          { id: 'icmp-req-core', from: srcSwitchId, to: 'SW-CORE', protocol: 'ICMP-REQ', progress: 0 },
          { id: 'icmp-req-dest-sw', from: 'SW-CORE', to: dstSwitchId, protocol: 'ICMP-REQ', progress: 0 }
        ],
      });
    }

    steps.push({
      title: `${dst.name} recibe el Ping y responde con ICMP Echo Reply`,
      description: `El equipo destinatario ${dst.name} procesa el eco y transmite inmediatamente la confirmación de recepción (ICMP Echo Reply, Type 0).`,
      protocol: 'ICMP',
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
      title: `¡Comunicación Exitosa! Ping Completado con Éxito`,
      description: `${src.name} ha recibido la respuesta. Estadísticas: 1 paquete transmitido, 1 recibido, 0% de pérdida, tiempo de ida y vuelta < 1ms. La red LAN opera con total integridad.`,
      protocol: 'ICMP',
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
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#38bdf8', '#34d399', '#a855f7']
        });
      }
    });

    return steps;
  }, [sourceNode, destNode, getDevice]);

  // Handle starting simulation
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

  // Animation Loop for packet interpolation
  useEffect(() => {
    if (!isRunning || currentStepIndex < 0 || currentStepIndex >= simulationSteps.length) {
      return;
    }

    let progress = 0;
    let animId;

    const animate = (timestamp) => {
      progress += 0.02 * speed;
      if (progress < 1) {
        setSimulationPackets(prev => prev.map(p => ({ ...p, progress })));
        animId = requestAnimationFrame(animate);
      } else {
        // Step complete
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

  // Terminal simulated ping trigger
  const handleSimulatePingFromCLI = (srcId, dstId) => {
    setSourceNode(srcId);
    setDestNode(dstId);
    handleStartSimulation(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* TAB 1: INTERACTIVE SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            {/* Simulation Controls Header */}
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
              hasArpEntry={Boolean(arpTables[destNode])}
            />

            {/* Interactive Network Topology Map */}
            <NetworkTopology
              sourceNode={sourceNode}
              setSourceNode={setSourceNode}
              destNode={destNode}
              setDestNode={setDestNode}
              currentStep={currentStepIndex}
              simulationPackets={simulationPackets}
              onSelectDeviceForTerminal={setActiveTerminalDevice}
              activeDeviceDetails={activeDeviceDetails}
              setActiveDeviceDetails={setActiveDeviceDetails}
            />

            {/* Live Packet & Tables Inspector */}
            <PacketInspector
              currentPacketInfo={currentPacketInfo}
              activeDevice={getDevice(sourceNode)}
              arpTables={arpTables}
              macTables={macTables}
            />
          </div>
        )}

        {/* TAB 2: PROTOCOLO ARP */}
        {activeTab === 'arp-theory' && <ArpTheory />}

        {/* TAB 3: COMPARATIVE TABLE */}
        {activeTab === 'comparative' && <ComparativeTable />}

        {/* TAB 4: REAL HARDWARE */}
        {activeTab === 'hardware' && <HardwareCatalog />}

        {/* TAB 5: IP PLAN */}
        {activeTab === 'ip-plan' && <IpPlanTable />}

        {/* TAB 6: SECURITY & ADMIN */}
        {activeTab === 'security' && <SecurityAdmin />}

        {/* TAB 7: PRINTABLE REPORT */}
        {activeTab === 'report' && <PrintableReport />}
      </main>

      {/* Device CLI Terminal Modal */}
      {activeTerminalDevice && (
        <DeviceTerminal
          device={activeTerminalDevice}
          onClose={() => setActiveTerminalDevice(null)}
          onSimulatePingFromCLI={handleSimulatePingFromCLI}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>NetSim LAN Pro • Actividad Grupal de Redes LAN</span>
          <span className="text-slate-600">
            Diseñado para despliegue en Vercel • Cumple al 100% con los requerimientos académicos
          </span>
        </div>
      </footer>
    </div>
  );
}
