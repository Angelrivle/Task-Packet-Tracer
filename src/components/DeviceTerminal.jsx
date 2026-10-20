import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, CornerDownLeft } from 'lucide-react';
import { DEVICES } from '../data/networkData';

export default function DeviceTerminal({ device, onClose, onSimulatePingFromCLI }) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([]);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (!device) return;

    let banner = [];
    if (device.type === 'pc') {
      banner = [
        `Microsoft Windows [Version 10.0.19045]`,
        `Terminal Host: ${device.name} [IPv4: ${device.ip} | MAC: ${device.mac}]`,
        `Escribe "help" para ver comandos disponibles (ipconfig, ping, arp -a, tracert).`,
        ``,
      ];
    } else if (device.type === 'switch') {
      banner = [
        `Cisco IOS Software, C2960X Software (C2960X-UNIVERSALK9-M), Version 15.2(2)E7`,
        `Switch de Red: ${device.name}`,
        `Escribe "help" o "?" para listar comandos Cisco IOS (show mac address-table, ping, show int).`,
        ``,
      ];
    } else if (device.type === 'router') {
      banner = [
        `Cisco IOS XE Software, Version 16.09.04`,
        `Gateway Router: ${device.name} [IP: ${device.ip}]`,
        `Escribe "help" para ver comandos (show ip route, show ip int brief, ping).`,
        ``,
      ];
    } else {
      banner = [
        `Linux srv-corp-01 5.15.0-89-generic x86_64`,
        `Servidor Corporativo: ${device.name} [IP: ${device.ip}]`,
        `Escribe "help" para ver comandos (ifconfig, ping, arp -n).`,
        ``,
      ];
    }

    setHistory(banner.map((text) => ({ type: 'output', text })));
  }, [device]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const getPrompt = () => {
    if (!device) return '>';
    if (device.type === 'pc') return `C:\\Users\\Admin-${device.id}>`;
    if (device.type === 'switch') return `${device.id}#`;
    if (device.type === 'router') return `${device.id}#`;
    return `root@${device.id.toLowerCase()}:~#`;
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const rawCmd = inputVal.trim();
      if (!rawCmd) return;

      const newHistory = [...history, { type: 'input', prompt: getPrompt(), text: rawCmd }];
      setInputVal('');

      const parts = rawCmd.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const arg1 = parts[1];

      let output = [];

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
              '  show mac address-table  - Muestra la tabla CAM de direcciones MAC',
              '  show interfaces status  - Muestra el estado físico de los puertos',
              '  show vlan brief         - Muestra las VLANs configuradas',
              '  ping <ip>               - Envía paquetes ICMP desde el switch',
              '  clear / cls             - Limpia la pantalla',
            ];
          } else if (device.type === 'router') {
            output = [
              'Comandos Cisco IOS Router disponibles:',
              '  show ip route           - Muestra la tabla de enrutamiento IPv4',
              '  show ip int brief       - Muestra el estado de interfaces IP',
              '  ping <ip>               - Realiza ping desde el router',
              '  clear / cls             - Limpia la pantalla',
            ];
          } else {
            output = [
              'Comandos Linux Server disponibles:',
              '  ifconfig o ip addr  - Muestra la configuración de red',
              '  ping -c 4 <ip>      - Envía pings al host',
              '  arp -n              - Muestra la tabla ARP',
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
          output = [
            `Ethernet adapter Ethernet0:`,
            `   Descripción. . . . . . . . . . . . : ${device.model}`,
            `   Dirección física (MAC) . . . . . . : ${device.mac}`,
            `   Dirección IPv4. . . . . . . . . . : ${device.ip}`,
            `   Máscara de subred . . . . . . . . : ${device.mask}`,
            `   Puerta de enlace predeterminada . : 192.168.1.1`,
            `   Servidor DNS. . . . . . . . . . . : 192.168.1.10`,
          ];
          break;

        case 'arp':
          if (arg1 === '-a' || arg1 === '-n' || !arg1) {
            output = [
              `Interfaz: ${device.ip} --- 0x2`,
              `  Dirección IP         Dirección física      Tipo`,
              `  192.168.1.1          00-1a-2b-3c-4d-01     dinámico (Gateway)`,
              `  192.168.1.10         00-1a-2b-3c-6d-01     dinámico (Server)`,
              `  192.168.1.255        ff-ff-ff-ff-ff-ff     estático (Broadcast)`,
            ];
          } else if (arg1 === '-d') {
            output = ['Caché ARP eliminada. Próximo envío requerirá ARP Request Broadcast.'];
          } else {
            output = ['Sintaxis: arp -a o arp -d'];
          }
          break;

        case 'show':
          const sub = parts.slice(1).join(' ').toLowerCase();
          if (sub.includes('mac') || sub.includes('address-table')) {
            output = [
              'Mac Address Table',
              '-------------------------------------------',
              'Vlan    Mac Address       Type        Ports',
              '   1    001a.2b3c.4d01    DYNAMIC     Gi0/0/0 (Uplink R1)',
              '   1    001a.2b3c.6d01    DYNAMIC     Gi0/24 (SRV-01)',
              '   1    0050.56a1.0101    DYNAMIC     Fa0/1 (PC-01)',
              '   1    0050.56a1.0102    DYNAMIC     Fa0/2 (PC-02)',
              'Total Mac Addresses: 4',
            ];
          } else if (sub.includes('route')) {
            output = [
              'Gateway of last resort is not set',
              'C  192.168.1.0/24 is directly connected, GigabitEthernet0/0/0',
            ];
          } else if (sub.includes('int') || sub.includes('interfaces')) {
            output = [
              'Interface              IP-Address      OK? Method Status  Protocol',
              'GigabitEthernet0/0/0   192.168.1.1     YES NVRAM  up      up',
              'Vlan1                  192.168.1.2     YES manual up      up',
            ];
          } else {
            output = [`% Incomplete command: show ${sub}`];
          }
          break;

        case 'ping':
          if (!arg1) {
            output = ['Uso: ping <ip_destino> (ej: ping 192.168.1.10)'];
          } else {
            const target = DEVICES.find(d => d.ip === arg1 || d.id.toLowerCase() === arg1.toLowerCase());
            if (target) {
              output = [
                `Haciendo ping a ${target.name} [${target.ip}] con 32 bytes de datos:`,
                `Respuesta desde ${target.ip}: bytes=32 tiempo<1ms TTL=64`,
                `Respuesta desde ${target.ip}: bytes=32 tiempo<1ms TTL=64`,
                `Respuesta desde ${target.ip}: bytes=32 tiempo<1ms TTL=64`,
                `Respuesta desde ${target.ip}: bytes=32 tiempo<1ms TTL=64`,
                `Estadísticas: Enviados = 4, Recibidos = 4, Perdidos = 0 (0% pérdida)`,
              ];
              if (onSimulatePingFromCLI) {
                onSimulatePingFromCLI(device.id, target.id);
              }
            } else {
              output = [
                `Haciendo ping a ${arg1} con 32 bytes de datos:`,
                `Tiempo de espera agotado para esta solicitud.`,
                `Estadísticas: Enviados = 4, Recibidos = 0, Perdidos = 4 (100% pérdida)`,
              ];
            }
          }
          break;

        default:
          output = [`Comando no reconocido: "${rawCmd}". Escribe "help" para ver comandos.`];
          break;
      }

      setHistory([...newHistory, ...output.map(text => ({ type: 'output', text }))]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-black border border-neutral-800 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-950 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-700"></span>
            <span className="text-xs font-mono font-medium text-neutral-300">
              CLI: {device.name} [{device.ip}]
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Screen */}
        <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 bg-black text-neutral-300 select-text">
          {history.map((line, idx) => (
            <div key={idx} className="leading-relaxed">
              {line.type === 'input' ? (
                <div className="flex items-center space-x-2 text-white font-semibold">
                  <span className="text-neutral-500">{line.prompt}</span>
                  <span>{line.text}</span>
                </div>
              ) : (
                <div className="text-neutral-300 whitespace-pre-wrap">{line.text}</div>
              )}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Input */}
        <div className="flex items-center space-x-2 px-4 py-2.5 bg-neutral-950 border-t border-neutral-800 font-mono text-xs">
          <span className="text-neutral-400 font-bold whitespace-nowrap">
            {getPrompt()}
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleCommand}
            autoFocus
            placeholder="Escribe comando (ej: ping 192.168.1.10, arp -a, ipconfig)..."
            className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-neutral-600 font-mono"
          />
          <CornerDownLeft className="w-3.5 h-3.5 text-neutral-600" />
        </div>
      </div>
    </div>
  );
}
