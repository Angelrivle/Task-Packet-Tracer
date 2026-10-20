import React from 'react';
import { Network, Activity, Globe, CheckCircle2, Shield, Share2, Layers } from 'lucide-react';
import { DEVICES } from '../data/networkData';

export default function IpPlanTable() {
  return (
    <div className="space-y-6">
      {/* Topology & Subnetting Architecture */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <span className="text-cyan-400 font-mono text-xs font-semibold tracking-wider uppercase">
          Diseño Lógico & Direccionamiento
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-slate-100 mt-1">
          Plan de Direccionamiento IPv4 y Topología de Red
        </h2>
        <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-3xl leading-relaxed">
          Diseño del espacio de direccionamiento lógico clase C privada bajo el estándar RFC 1918,
          con asignación estática para infraestructura crítica (Router, Switches, Servidor) y
          segmento dinámico DHCP para las estaciones de trabajo cliente.
        </p>

        {/* Network Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Red Principal (CIDR)</span>
            <div className="text-base font-bold font-mono text-cyan-400 mt-1">192.168.1.0 /24</div>
            <span className="text-[10px] text-slate-400">Prefijo de 24 bits</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Máscara de Subred</span>
            <div className="text-base font-bold font-mono text-slate-200 mt-1">255.255.255.0</div>
            <span className="text-[10px] text-slate-400">254 hosts utilizables</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Gateway por Defecto</span>
            <div className="text-base font-bold font-mono text-amber-400 mt-1">192.168.1.1</div>
            <span className="text-[10px] text-slate-400">Router Cisco ISR 4331</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Topología Lógica/Física</span>
            <div className="text-base font-bold font-mono text-emerald-400 mt-1">Estrella Jerárquica</div>
            <span className="text-[10px] text-slate-400">Núcleo y Acceso</span>
          </div>
        </div>
      </div>

      {/* Justification of Network Topology */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-sm md:text-base">
              Elección y Justificación de la Topología: Estrella Jerárquica
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed space-y-2">
            Para este proyecto se seleccionó una <strong>topología en estrella jerárquica (o árbol distribuido)</strong> basada en dos niveles:
          </p>
          <ul className="mt-2 space-y-1.5 text-xs text-slate-300 list-disc list-inside">
            <li>
              <strong>Capa de Distribución / Core:</strong> Un switch central (SW-CORE) que centraliza el tráfico hacia el servidor corporativo y la puerta de enlace a internet.
            </li>
            <li>
              <strong>Capa de Acceso:</strong> Dos switches de acceso (SW-ACC-01 y SW-ACC-02) que conectan directamente los puestos de trabajo departamentales.
            </li>
            <li>
              <strong>Ventajas Clave:</strong> Alta tolerancia a fallos (si un cable de PC falla, el resto de la red sigue operando), facilidad para aislar averías, escalabilidad modular y ausencia de bucles físicos mediante Spanning Tree Protocol (STP).
            </li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-slate-100 text-sm md:text-base">
              Estrategia de Asignación de Direcciones IP
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Se implementa una política estructurada de direccionamiento para garantizar la predictibilidad y seguridad de la red:
          </p>
          <div className="mt-3 space-y-2 font-mono text-xs">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex justify-between items-center">
              <span className="text-amber-400">192.168.1.1</span>
              <span className="text-slate-400 text-[11px]">Estática: Router Gateway</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex justify-between items-center">
              <span className="text-sky-400">192.168.1.2 - 192.168.1.4</span>
              <span className="text-slate-400 text-[11px]">Estática: Gestión de Switches (VLAN 1)</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex justify-between items-center">
              <span className="text-purple-400">192.168.1.10</span>
              <span className="text-slate-400 text-[11px]">Estática: Servidor Corporativo (DNS/Web)</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex justify-between items-center">
              <span className="text-emerald-400">192.168.1.101 - 192.168.1.110</span>
              <span className="text-slate-400 text-[11px]">Dinámica DHCP: PCs de Usuarios (Reserva MAC)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete IP & MAC Allocation Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-200">
            Tabla Maestra de Asignación de Direcciones Ethernet e IPv4
          </h3>
          <span className="text-xs font-mono text-cyan-400">Total: 15 Dispositivos</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono">
              <tr>
                <th className="p-3">Dispositivo</th>
                <th className="p-3">Interfaz / Puerto</th>
                <th className="p-3">Dirección MAC (Capa 2)</th>
                <th className="p-3">Dirección IPv4 (Capa 3)</th>
                <th className="p-3">Máscara Subred</th>
                <th className="p-3">Gateway</th>
                <th className="p-3">Tipo Asignación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {DEVICES.map((dev, idx) => (
                <tr key={dev.id} className={idx % 2 === 0 ? 'bg-slate-900/30 hover:bg-slate-800/40' : 'bg-slate-950/30 hover:bg-slate-800/40'}>
                  <td className="p-3 font-bold text-slate-100">
                    <span className="text-cyan-300">{dev.id}</span>
                    <span className="text-slate-500 font-sans text-[11px] block">{dev.name}</span>
                  </td>
                  <td className="p-3 text-slate-400">
                    {dev.type === 'router' ? 'Gi0/0/0' : dev.type === 'switch' ? 'Vlan1 Mgmt' : 'Ethernet0'}
                  </td>
                  <td className="p-3 text-emerald-400 font-semibold">
                    {dev.mac}
                  </td>
                  <td className="p-3 text-cyan-300 font-semibold">
                    {dev.ip}
                  </td>
                  <td className="p-3 text-slate-400">
                    {dev.mask}
                  </td>
                  <td className="p-3 text-amber-400">
                    {dev.type === 'router' ? 'N/A (Borde)' : '192.168.1.1'}
                  </td>
                  <td className="p-3 font-sans">
                    {dev.type === 'pc' ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-[10px]">
                        DHCP
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 text-[10px]">
                        Estática
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
