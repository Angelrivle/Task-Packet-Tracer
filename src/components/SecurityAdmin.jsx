import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Wrench, 
  Lock, 
  Key, 
  AlertTriangle, 
  CheckCircle2, 
  Server, 
  FileText,
  Copy,
  Check
} from 'lucide-react';

export default function SecurityAdmin() {
  const [copiedScript, setCopiedScript] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(id);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  const switchConfigScript = `! ==========================================
! CONFIGURACIÓN DE SEGURIDAD - CISCO CATALYST
! SWITCH DE ACCESO (SW-ACC-01)
! ==========================================
enable
configure terminal
hostname SW-ACC-01

! 1. Seguridad de Contraseñas y Cifrado
service password-encryption
enable secret C1sc0$ecure2026!
banner motd # ACCESO RESTRINGIDO - SOLO PERSONAL AUTORIZADO #

! 2. Deshabilitar Telnet y Habilitar SSH v2 Cifrado
ip domain-name empresa.lan
crypto key generate rsa modulus 2048
ip ssh version 2
line vty 0 4
 transport input ssh
 login local
 exec-timeout 5 0
 exit

username admin privilege 15 secret AdminPass#2026!

! 3. Configuración de Port-Security en Puertos de Acceso (Fa0/1 a Fa0/5)
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

! 5. Mitigación contra ARP Spoofing (DAI & DHCP Snooping)
ip dhcp snooping
ip dhcp snooping vlan 1
interface GigabitEthernet 0/1
 ip dhcp snooping trust
 exit
ip arp inspection vlan 1
end
write memory`;

  const routerConfigScript = `! ==========================================
! CONFIGURACIÓN DE SEGURIDAD - CISCO ISR 4331
! ROUTER DE BORDE / GATEWAY (R1-GATEWAY)
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

! 2. Configuración de Interfaz LAN (GigabitEthernet 0/0/0)
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <span className="text-cyan-400 font-mono text-xs font-semibold tracking-wider uppercase">
          Requerimiento de la Consigna: Creación & Operación
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-slate-100 mt-1">
          Seguridad, Configuración de Equipos y Mantenimiento de la Red LAN
        </h2>
        <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-3xl leading-relaxed">
          Estrategia integral de blindaje de infraestructura (Port Security, autenticación SSHv2,
          aislamiento de puertos, mitigación ARP) y plan formal de mantenimiento preventivo y correctivo.
        </p>
      </div>

      {/* Security Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-100 text-base mb-1">Port Security (Seguridad de Puerto)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Se restringe cada puerto de los switches a <strong>una única dirección MAC</strong> mediante el parámetro <code>sticky</code>. Si un intruso desconecta una PC corporativa y conecta su laptop personal, el puerto entra en violación, descarta el tráfico no autorizado y envía una alerta SNMP al administrador.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
            <Key className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-100 text-base mb-1">Gestión Cifrada (SSH v2 & AAA)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Queda estrictamente prohibido el uso del protocolo Telnet debido a que transmite contraseñas en texto plano por la LAN. La administración de routers y switches se realiza exclusivamente vía <strong>SSH v2 con llaves RSA de 2048 bits</strong> y tiempos de espera automáticos por inactividad.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-100 text-base mb-1">Deshabilitación de Puertos No Usados</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Los puertos sobrantes en los switches que no tienen ninguna estación de trabajo conectada son forzados al estado <code>shutdown</code> administrativo. Esto previene que terceros conecten dispositivos no autorizados en tomas de red de pasillos o salas vacías.
          </p>
        </div>
      </div>

      {/* Cisco IOS Configurations for Switches & Router */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Switch Config */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-sm text-slate-100">
                  Script de Configuración Cisco IOS: Switch de Acceso
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(switchConfigScript, 'switch')}
                className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
              >
                {copiedScript === 'switch' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar CLI</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[380px] leading-relaxed">
              {switchConfigScript}
            </pre>
          </div>
          <div className="mt-3 text-[11px] text-slate-500">
            Aplica a SW-ACC-01 y SW-ACC-02 (Cisco Catalyst).
          </div>
        </div>

        {/* Router Config */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-slate-100">
                  Script de Configuración Cisco IOS: Router de Borde
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(routerConfigScript, 'router')}
                className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
              >
                {copiedScript === 'router' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar CLI</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[380px] leading-relaxed">
              {routerConfigScript}
            </pre>
          </div>
          <div className="mt-3 text-[11px] text-slate-500">
            Aplica a R1-GATEWAY (Cisco ISR 4331).
          </div>
        </div>
      </div>

      {/* Maintenance & Administration Plan */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center space-x-2">
          <Wrench className="w-5 h-5 text-cyan-400" />
          <span>Plan de Mantenimiento y Administración de la Infraestructura LAN</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
          {/* Preventative Maintenance */}
          <div className="space-y-3">
            <h4 className="font-bold text-cyan-400 text-sm flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Mantenimiento Preventivo (Programado)</span>
            </h4>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>Monitoreo de Energía y UPS:</strong> Verificación mensual de baterías del sistema ininterrumpido de energía (UPS APC Smart-UPS 3000VA en rack central) para evitar apagones de red.
              </li>
              <li>
                <strong>Gestión Térmica:</strong> Control de climatización en el Data Center manteniendo la temperatura ambiente constante entre 18°C y 22°C con 45% de humedad relativa.
              </li>
              <li>
                <strong>Limpieza Física y Cableado:</strong> Aspirado semestral con aire comprimido electrostático de los ventiladores de switches y routers para evitar sobrecalentamiento.
              </li>
              <li>
                <strong>Actualizaciones de Firmware / Parcheo:</strong> Ventana de mantenimiento trimestral fuera de horario laboral para aplicar parches de seguridad recomendados por Cisco (IOS-XE).
              </li>
            </ul>
          </div>

          {/* Corrective Maintenance & Backup */}
          <div className="space-y-3">
            <h4 className="font-bold text-amber-400 text-sm flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Mantenimiento Correctivo & Planes de Contingencia</span>
            </h4>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>Respaldos Automáticos de Configuración:</strong> Servidor TFTP/FTP que realiza copias diarias automatizadas del archivo <code>running-config</code> de todos los switches y routers.
              </li>
              <li>
                <strong>Repuestos en Frío (Cold Spares):</strong> Contar con un switch de 16 puertos en stock preconfigurado para reemplazo inmediato en caso de avería de hardware.
              </li>
              <li>
                <strong>Certificación de Enlaces Físicos:</strong> En caso de pérdida de paquetes o degradación de velocidad, diagnóstico con reflectómetro óptico (OTDR) o probador de cable Fluke Networks para identificar roturas en Cat6.
              </li>
              <li>
                <strong>SLA y Tiempos de Respuesta:</strong> Tiempo máximo de recuperación ante fallos de switch de distribución: menor a 2 horas (RTO &lt; 2h).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
