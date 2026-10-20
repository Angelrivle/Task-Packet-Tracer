import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

export default function SecurityAdmin() {
  const [copiedScript, setCopiedScript] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(id);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  const switchConfigScript = `! ==========================================
! CONFIGURACIÓN CISCO IOS: SWITCH DE ACCESO
! ==========================================
enable
configure terminal
hostname SW-ACC-01

! 1. Seguridad de Contraseñas y Cifrado
service password-encryption
enable secret C1sc0$ecure2026!
banner motd # ACCESO RESTRINGIDO - SOLO ADMINISTRADORES #

! 2. Acceso Administrativo Cifrado SSH v2 (Deshabilitar Telnet)
ip domain-name empresa.lan
crypto key generate rsa modulus 2048
ip ssh version 2
line vty 0 4
 transport input ssh
 login local
 exec-timeout 5 0
 exit

username admin privilege 15 secret AdminPass#2026!

! 3. Port-Security en Puertos de Acceso (Fa0/1 a Fa0/5)
interface range FastEthernet 0/1 - 5
 switchport mode access
 switchport port-security
 switchport port-security maximum 1
 switchport port-security mac-address sticky
 switchport port-security violation restrict
 no shutdown
 exit

! 4. Deshabilitar puertos sin uso para evitar intrusiones
interface range FastEthernet 0/6 - 16
 shutdown
 exit

! 5. Protección contra ARP Spoofing (DAI & DHCP Snooping)
ip dhcp snooping
ip dhcp snooping vlan 1
interface GigabitEthernet 0/1
 ip dhcp snooping trust
 exit
ip arp inspection vlan 1
end
write memory`;

  const routerConfigScript = `! ==========================================
! CONFIGURACIÓN CISCO IOS: ROUTER DE BORDE
! ==========================================
enable
configure terminal
hostname R1-GATEWAY

! 1. Cifrado y Protección de Acceso
service password-encryption
enable secret R0uter$ecure2026!
line con 0
 exec-timeout 5 0
 password ConsolePass#1
 login
 exit

! 2. Configuración Interfaz LAN (GigabitEthernet 0/0/0)
interface GigabitEthernet 0/0/0
 description ENLACE_LAN_HACIA_CORE_SWITCH
 ip address 192.168.1.1 255.255.255.0
 no shutdown
 exit

! 3. Servidor DHCP con Reserva para Servidores y Switches
ip dhcp excluded-address 192.168.1.1 192.168.1.50
ip dhcp excluded-address 192.168.1.200 192.168.1.254

ip dhcp pool POOL_LAN_CORPORATIVA
 network 192.168.1.0 255.255.255.0
 default-router 192.168.1.1
 dns-server 192.168.1.10 8.8.8.8
 domain-name empresa.lan
 lease 8
 exit

! 4. Bloqueo de ICMP Ping Broadcast (Mitigación Smurf Attack)
interface GigabitEthernet 0/0/0
 no ip directed-broadcast
 exit
end
write memory`;

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-black border border-neutral-800 rounded-xl p-6 shadow-xl">
        <span className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
          Creación & Administración
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
          Seguridad, Configuración de Equipos y Mantenimiento de la LAN
        </h2>
        <p className="text-neutral-400 text-xs md:text-sm mt-2 max-w-3xl leading-relaxed">
          Políticas aplicadas de endurecimiento (Port Security, autenticación SSHv2 con RSA 2048-bit,
          apagado de puertos no utilizados) y plan estructurado de mantenimiento preventivo y correctivo.
        </p>
      </div>

      {/* Security Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black border border-neutral-800 rounded-xl p-5 shadow-lg">
          <span className="text-[10px] font-mono text-neutral-500 uppercase">Seguridad L2</span>
          <h3 className="font-bold text-white text-base mt-1 mb-2">Port Security (Sticky MAC)</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Se restringe cada puerto de los switches a <strong>una sola dirección MAC</strong> aprendida dinámicamente. Si un equipo no autorizado se conecta en un puerto asignado, el switch bloquea el tráfico de inmediato.
          </p>
        </div>

        <div className="bg-black border border-neutral-800 rounded-xl p-5 shadow-lg">
          <span className="text-[10px] font-mono text-neutral-500 uppercase">Gestión Segura</span>
          <h3 className="font-bold text-white text-base mt-1 mb-2">SSH v2 Cifrado (Sin Telnet)</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Queda prohibido Telnet para evitar contraseñas en texto claro. La gestión remota del router y los switches se ejecuta exclusivamente vía <strong>SSH v2 con claves RSA de 2048 bits</strong>.
          </p>
        </div>

        <div className="bg-black border border-neutral-800 rounded-xl p-5 shadow-lg">
          <span className="text-[10px] font-mono text-neutral-500 uppercase">Defensa Pasiva</span>
          <h3 className="font-bold text-white text-base mt-1 mb-2">Puertos Deshabilitados</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Todos los puertos de switch que no tienen estaciones de trabajo conectadas son configurados en estado <code>shutdown</code> administrativo, impidiendo accesos clandestinos desde tomas de red desocupadas.
          </p>
        </div>
      </div>

      {/* Cisco IOS Configurations for Switches & Router */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Switch Config */}
        <div className="bg-black border border-neutral-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-neutral-400" />
                <h3 className="font-mono font-bold text-xs text-white uppercase">
                  Script Cisco IOS: Switch de Acceso (SW-ACC-01)
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(switchConfigScript, 'switch')}
                className="flex items-center space-x-1 px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-mono rounded border border-neutral-800 transition-colors"
              >
                {copiedScript === 'switch' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-neutral-950 p-3.5 rounded border border-neutral-900 text-[11px] font-mono text-neutral-300 overflow-x-auto max-h-[380px] leading-relaxed">
              {switchConfigScript}
            </pre>
          </div>
        </div>

        {/* Router Config */}
        <div className="bg-black border border-neutral-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-neutral-400" />
                <h3 className="font-mono font-bold text-xs text-white uppercase">
                  Script Cisco IOS: Router de Borde (R1-GATEWAY)
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(routerConfigScript, 'router')}
                className="flex items-center space-x-1 px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-mono rounded border border-neutral-800 transition-colors"
              >
                {copiedScript === 'router' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-neutral-950 p-3.5 rounded border border-neutral-900 text-[11px] font-mono text-neutral-300 overflow-x-auto max-h-[380px] leading-relaxed">
              {routerConfigScript}
            </pre>
          </div>
        </div>
      </div>

      {/* Maintenance Plan */}
      <div className="bg-black border border-neutral-800 rounded-xl p-6 shadow-xl">
        <h3 className="font-mono font-bold text-white text-xs uppercase mb-4">
          // PLAN DE MANTENIMIENTO PREVENTIVO Y CORRECTIVO
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-300 leading-relaxed font-sans">
          <div>
            <h4 className="font-bold text-white text-sm mb-2 font-mono">
              Mantenimiento Preventivo (Programado):
            </h4>
            <ul className="space-y-2 list-disc list-inside text-neutral-400">
              <li>
                <strong className="text-neutral-200">Inspección de Energía:</strong> Revisión mensual de bancos de baterías del UPS APC Smart-UPS 3000VA en rack central.
              </li>
              <li>
                <strong className="text-neutral-200">Control Térmico:</strong> Climatización mantenida entre 18°C y 22°C con sensores de temperatura SNMP.
              </li>
              <li>
                <strong className="text-neutral-200">Limpieza Física:</strong> Limpieza semestral con aire comprimido antiestático de ventiladores de switches y servidores.
              </li>
              <li>
                <strong className="text-neutral-200">Actualizaciones:</strong> Aplicación programada de parches de seguridad para Cisco IOS-XE fuera de horario laboral.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-2 font-mono">
              Mantenimiento Correctivo & Planes de Contingencia:
            </h4>
            <ul className="space-y-2 list-disc list-inside text-neutral-400">
              <li>
                <strong className="text-neutral-200">Respaldos Automáticos:</strong> Servidor TFTP que guarda copia diaria de la configuración <code>running-config</code> de cada equipo.
              </li>
              <li>
                <strong className="text-neutral-200">Repuesto en Frío (Cold Spare):</strong> Un switch de 16 puertos en stock preconfigurado para reemplazo inmediato en menos de 2 horas.
              </li>
              <li>
                <strong className="text-neutral-200">Diagnóstico de Cableado:</strong> Certificación de enlaces físicos con probador Fluke Networks en caso de atenuación o pérdida de paquetes.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
