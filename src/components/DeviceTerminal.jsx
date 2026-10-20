import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft } from 'lucide-react';
import { DEVICES } from '../data/networkData';

export default function DeviceTerminal({ device, onClose, onSimulatePingFromCLI }) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [commandHistory, setCommandHistory] = useState([]);
  const terminalEndRef = useRef(null);

  // Initialize terminal banner
  useEffect(() => {
    if (!device) return;

    let banner = [];
    if (device.type === 'pc') {
      banner = [
        `Microsoft Windows [Versión 10.0.19045.3803]`,
        `(c) Microsoft Corporation. Todos los derechos reservados.`,
        ``,
        `Estación de trabajo: ${device.name} [IP: ${device.ip}]`,
        `Escribe "help" para ver los comandos disponibles (ipconfig, ping, arp -a, tracert).`,
        ``,
      ];
    } else if (device.type === 'switch') {
      banner = [
        `Cisco IOS Software, C2960X Software (C2960X-UNIVERSALK9-M), Version 15.2(2)E7`,
        `Switch de Red Empresarial: ${device.name}`,
        `Escribe "help" o "?" para listar comandos Cisco IOS (show mac address-table, show interfaces, ping).`,
        ``,
      ];
    } else if (device.type === 'router') {
      banner = [
        `Cisco IOS XE Software, Version 16.09.04`,
        `Cisco ISR 4331 Gateway Router: ${device.name}`,
        `Escribe "help" para ver comandos de enrutamiento (show ip route, show ip int brief, ping).`,
        ``,
      ];
    } else {
      banner = [
        `Linux srv-corp-01 5.15.0-89-generic #99-Ubuntu SMP x86_64`,
        `Ubuntu Server 22.04 LTS (GNU/Linux)`,
        `Servidor Corporativo: ${device.name} [IP: ${device.ip}]`,
        `Escribe "help" para ver comandos (ifconfig, ping, arp -n, netstat).`,
        ``,
      ];
    }

    setHistory(banner.map((text) => ({ type: 'output', text })));
  }, [device]);

  // Auto-scroll to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const getPrompt = () => {
    if (!device) return '>';
    if (device.type === 'pc') return `C:\\Users\\Usuario-${device.id}>`;
    if (device.type === 'switch') return `${device.id}#`;
    if (device.type === 'router') return `${device.id}#`;
    return `root@${device.id.toLowerCase()}:~#`;
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const rawCmd = inputVal.trim();
      if (!rawCmd) return;

      const newHistory = [...history, { type: 'input', prompt: getPrompt(), text: rawCmd }];
      setCommandHistory(prev => [...prev, rawCmd]);
      setHistoryIdx(-1);
      setInputVal('');

      const parts = rawCmd.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const arg1 = parts[1];

      let output = [];

      // Command processing
      switch (cmd) {
        case 'help':
        case '?':
          if (device.type === 'pc') {
            output = [
              'Comandos disponibles:',
              '  ipconfig /all     - Muestra configuración IP, Máscara, Gateway y MAC',
              '  ping <ip>         - Envía paquetes de eco ICMP al destino',
              '  arp -a            - Muestra la tabla de correspondencia IP a MAC',
              '  arp -d            - Limpia la memoria caché ARP',
              '  tracert <ip>      - Traza la ruta hacia el equipo de destino',
              '  cls o clear       - Limpia la pantalla',
              '  exit              - Cierra la ventana de terminal',
            ];
          } else if (device.type === 'switch') {
            output = [
              'Comandos Cisco IOS disponibles:',
              '  show mac address-table  - Muestra la tabla CAM de direcciones MAC aprendidas',
              '  show interfaces status  - Muestra el estado físico de los puertos',
              '  show vlan brief         - Muestra las VLANs configuradas',
              '  ping <ip>               - Envía paquetes ICMP desde el switch',
              '  clear mac address-table - Vacía la tabla CAM dinámica',
              '  clear / cls             - Limpia la pantalla de la consola',
            ];
          } else if (device.type === 'router') {
            output = [
              'Comandos Cisco IOS Router disponibles:',
              '  show ip route           - Muestra la tabla de enrutamiento IPv4',
              '  show ip int brief       - Muestra el estado de interfaces IP',
              '  show arp                - Muestra la tabla ARP del router',
              '  ping <ip>               - Realiza ping desde el router',
              '  clear / cls             - Limpia la pantalla',
            ];
          } else {
            output = [
              'Comandos Linux Server disponibles:',
              '  ifconfig o ip addr  - Muestra la configuración de red',
              '  ping -c 4 <ip>      - Envía pings al host',
              '  arp -n              - Muestra la tabla ARP',
              '  netstat -tuln       - Puertos y servicios en escucha (HTTP, DNS)',
              '  clear               - Limpia la pantalla',
            ];
          }
          break;

        case 'clear':
        case 'cls':
          setHistory([]);
          return;

        case 'exit':
          onClose();
          return;

        case 'ipconfig':
        case 'ifconfig':
        case 'ip':
          output = [
            `Adaptador de Ethernet Ethernet0:`,
            `   Estado de los medios . . . . . . . : Conectado`,
            `   Descripción. . . . . . . . . . . . : ${device.model}`,
            `   Dirección física (MAC) . . . . . . : ${device.mac}`,
            `   DHCP habilitado. . . . . . . . . . : Sí`,
            `   Dirección IPv4. . . . . . . . . . : ${device.ip}`,
            `   Máscara de subred . . . . . . . . : ${device.mask}`,
            `   Puerta de enlace predeterminada . : 192.168.1.1`,
            `   Servidor DNS principal . . . . . . : 192.168.1.10`,
          ];
          break;

        case 'arp':
          if (arg1 === '-a' || arg1 === '-n' || !arg1) {
            output = [
              `Interfaz: ${device.ip} --- 0x2`,
              `  Dirección de Internet      Dirección física      Tipo`,
              `  192.168.1.1                00-1a-2b-3c-4d-01     dinámico (Gateway)`,
              `  192.168.1.10               00-1a-2b-3c-6d-01     dinámico (Server)`,
              `  192.168.1.255              ff-ff-ff-ff-ff-ff     estático (Broadcast)`,
            ];
          } else if (arg1 === '-d') {
            output = ['Caché ARP eliminada con éxito. Próximo envío requerirá ARP Request Broadcast.'];
          } else {
            output = ['Sintaxis: arp -a (para listar) o arp -d (para limpiar)'];
          }
          break;

        case 'show':
          const sub = parts.slice(1).join(' ').toLowerCase();
          if (sub.includes('mac') || sub.includes('address-table')) {
            output = [
              '          Mac Address Table',
              '-------------------------------------------',
              'Vlan    Mac Address       Type        Ports',
              '----    -----------       --------    -----',
              '   1    001a.2b3c.4d01    DYNAMIC     Gi0/0/0 (Uplink R1)',
              '   1    001a.2b3c.6d01    DYNAMIC     Gi0/24 (SRV-01)',
              '   1    0050.56a1.0101    DYNAMIC     Fa0/1 (PC-01)',
              '   1    0050.56a1.0102    DYNAMIC     Fa0/2 (PC-02)',
              '   1    0050.56a1.0103    DYNAMIC     Fa0/3 (PC-03)',
              'Total Mac Addresses for this criterion: 5',
            ];
          } else if (sub.includes('route')) {
            output = [
              'Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP',
              'Gateway of last resort is not set',
              '',
              '      192.168.1.0/24 is variably subnetted, 2 subnets, 2 masks',
              'C        192.168.1.0/24 is directly connected, GigabitEthernet0/0/0',
              'L        192.168.1.1/32 is directly connected, GigabitEthernet0/0/0',
            ];
          } else if (sub.includes('int') || sub.includes('interfaces')) {
            output = [
              'Interface              IP-Address      OK? Method Status                Protocol',
              'GigabitEthernet0/0/0   192.168.1.1     YES NVRAM  up                    up',
              'GigabitEthernet0/0/1   unassigned      YES unset  administratively down down',
              'Vlan1                  192.168.1.2     YES manual up                    up',
            ];
          } else {
            output = [`% Incomplete or unrecognized command: show ${sub}`];
          }
          break;

        case 'ping':
          if (!arg1) {
            output = ['Uso: ping <dirección_ip> (Ejemplo: ping 192.168.1.10)'];
          } else {
            const targetDev = DEVICES.find(d => d.ip === arg1 || d.id.toLowerCase() === arg1.toLowerCase());
            if (targetDev) {
              output = [
                `Haciendo ping a ${targetDev.name} [${targetDev.ip}] con 32 bytes de datos:`,
                `Respuesta desde ${targetDev.ip}: bytes=32 tiempo=1ms TTL=64`,
                `Respuesta desde ${targetDev.ip}: bytes=32 tiempo<1ms TTL=64`,
                `Respuesta desde ${targetDev.ip}: bytes=32 tiempo<1ms TTL=64`,
                `Respuesta desde ${targetDev.ip}: bytes=32 tiempo<1ms TTL=64`,
                ``,
                `Estadísticas de ping para ${targetDev.ip}:`,
                `    Paquetes: enviados = 4, recibidos = 4, perdidos = 0`,
                `    (0% perdidos),`,
                `Tiempos aproximados de ida y vuelta en milisegundos:`,
                `    Mínimo = 0ms, Máximo = 1ms, Media = 0ms`,
              ];
              // Trigger visual animation in simulator if requested
              if (onSimulatePingFromCLI) {
                onSimulatePingFromCLI(device.id, targetDev.id);
              }
            } else {
              output = [
                `Haciendo ping a ${arg1} con 32 bytes de datos:`,
                `Tiempo de espera agotado para esta solicitud.`,
                `Tiempo de espera agotado para esta solicitud.`,
                `Tiempo de espera agotado para esta solicitud.`,
                `Tiempo de espera agotado para esta solicitud.`,
                `Estadísticas de ping para ${arg1}: Paquetes: enviados = 4, recibidos = 0, perdidos = 4 (100% perdidos)`,
              ];
            }
          }
          break;

        case 'tracert':
        case 'traceroute':
          if (!arg1) {
            output = ['Uso: tracert <ip_destino>'];
          } else {
            output = [
              `Traza a la dirección ${arg1} sobre un máximo de 30 saltos:`,
              `  1    <1 ms    <1 ms    <1 ms  192.168.1.2 (SW-CORE)`,
              `  2    <1 ms    <1 ms    <1 ms  ${arg1}`,
              `Traza completa.`,
            ];
          }
          break;

        default:
          output = [
            `"${rawCmd}" no se reconoce como un comando interno o externo,`,
            `programa o archivo por lotes ejecutable. Escribe "help" para ver la lista de comandos.`,
          ];
          break;
      }

      setHistory([...newHistory, ...output.map(text => ({ type: 'output', text }))]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-950 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <TerminalIcon className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-semibold text-slate-200">
              Terminal CLI: {device.name} [{device.ip}]
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Content Screen */}
        <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 bg-black/90 text-slate-300 select-text">
          {history.map((line, idx) => (
            <div key={idx} className="leading-relaxed">
              {line.type === 'input' ? (
                <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                  <span className="text-slate-500">{line.prompt}</span>
                  <span>{line.text}</span>
                </div>
              ) : (
                <div className="text-slate-300 whitespace-pre-wrap">{line.text}</div>
              )}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Input Row */}
        <div className="flex items-center space-x-2 px-4 py-3 bg-slate-900/90 border-t border-slate-800 font-mono text-xs">
          <span className="text-cyan-400 font-bold whitespace-nowrap">
            {getPrompt()}
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleCommand}
            autoFocus
            placeholder="Escribe un comando (ej: ping 192.168.1.10, arp -a, ipconfig)..."
            className="flex-1 bg-transparent border-none text-slate-100 focus:outline-none placeholder:text-slate-600"
          />
          <CornerDownLeft className="w-3.5 h-3.5 text-slate-500" />
        </div>
      </div>
    </div>
  );
}
