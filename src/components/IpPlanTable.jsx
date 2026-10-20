import React from 'react';
import { DEVICES } from '../data/networkData';

export default function IpPlanTable() {
  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-black border border-neutral-800 rounded-xl p-6 shadow-xl">
        <span className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
          Diseño Lógico & Direccionamiento
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
          Plan de Asignación de Direcciones IPv4 y Ethernet
        </h2>
        <p className="text-neutral-400 text-xs md:text-sm mt-2 max-w-3xl leading-relaxed">
          Segmento de red clase C privada RFC 1918 (192.168.1.0/24) con asignación estática para infraestructura
          crítica (Router, Switches, Servidor) y pool DHCP dinámico para estaciones de trabajo.
        </p>

        {/* Network Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 font-mono text-xs">
          <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
            <span className="text-[10px] text-neutral-500 uppercase">Red Principal (CIDR)</span>
            <div className="text-sm font-bold text-white mt-1">192.168.1.0/24</div>
            <span className="text-[10px] text-neutral-500">Prefijo 24 bits</span>
          </div>

          <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
            <span className="text-[10px] text-neutral-500 uppercase">Máscara de Subred</span>
            <div className="text-sm font-bold text-white mt-1">255.255.255.0</div>
            <span className="text-[10px] text-neutral-500">254 hosts utilizables</span>
          </div>

          <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
            <span className="text-[10px] text-neutral-500 uppercase">Puerta de Enlace</span>
            <div className="text-sm font-bold text-cyan-400 mt-1">192.168.1.1</div>
            <span className="text-[10px] text-neutral-500">Router R1</span>
          </div>

          <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
            <span className="text-[10px] text-neutral-500 uppercase">Topología Lógica</span>
            <div className="text-sm font-bold text-emerald-400 mt-1">Estrella Jerárquica</div>
            <span className="text-[10px] text-neutral-500">Núcleo y Acceso</span>
          </div>
        </div>
      </div>

      {/* Justification of Network Topology */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black border border-neutral-800 rounded-xl p-5 shadow-lg">
          <h3 className="font-mono font-bold text-white text-xs uppercase mb-2">
            // JUSTIFICACIÓN: TOPOLOGÍA EN ESTRELLA JERÁRQUICA
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Se optó por una topología en estrella jerárquica de dos niveles:
          </p>
          <ul className="mt-2 space-y-1.5 text-xs text-neutral-400 list-disc list-inside">
            <li>
              <strong className="text-neutral-200">Nivel de Distribución / Core:</strong> Centraliza el switch SW-CORE, enlazando el Servidor corporativo y el Router de borde.
            </li>
            <li>
              <strong className="text-neutral-200">Nivel de Acceso:</strong> Dos switches (SW-ACC-01 y SW-ACC-02) que conectan directamente los puestos de trabajo.
            </li>
            <li>
              <strong className="text-neutral-200">Beneficios:</strong> Aislamiento total de fallos de cableado, escalabilidad modular, cada puerto es un dominio de colisión independiente y prevención de bucles mediante Spanning Tree Protocol (STP).
            </li>
          </ul>
        </div>

        <div className="bg-black border border-neutral-800 rounded-xl p-5 shadow-lg">
          <h3 className="font-mono font-bold text-white text-xs uppercase mb-2">
            // POLÍTICA DE ASIGNACIÓN DE DIRECCIONES
          </h3>
          <div className="space-y-2 font-mono text-xs">
            <div className="bg-neutral-950 p-2 rounded border border-neutral-800 flex justify-between items-center">
              <span className="text-cyan-400">192.168.1.1</span>
              <span className="text-neutral-400 text-[11px]">Estática: Router Gateway</span>
            </div>
            <div className="bg-neutral-950 p-2 rounded border border-neutral-800 flex justify-between items-center">
              <span className="text-white">192.168.1.2 - 192.168.1.4</span>
              <span className="text-neutral-400 text-[11px]">Estática: Switches Gestión (VLAN 1)</span>
            </div>
            <div className="bg-neutral-950 p-2 rounded border border-neutral-800 flex justify-between items-center">
              <span className="text-emerald-400">192.168.1.10</span>
              <span className="text-neutral-400 text-[11px]">Estática: Servidor Local (Web/DNS)</span>
            </div>
            <div className="bg-neutral-950 p-2 rounded border border-neutral-800 flex justify-between items-center">
              <span className="text-neutral-300">192.168.1.101 - 192.168.1.110</span>
              <span className="text-neutral-400 text-[11px]">DHCP Dinámico: Estaciones de Trabajo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Table */}
      <div className="bg-black border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-3.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="font-mono font-bold text-xs text-white uppercase tracking-wider">
            Tabla Maestra de Direcciones IP y MAC (15 Dispositivos)
          </h3>
          <span className="text-xs font-mono text-neutral-500">192.168.1.0/24</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400">
              <tr>
                <th className="p-3">Dispositivo</th>
                <th className="p-3">Interfaz</th>
                <th className="p-3">Dirección MAC (Capa 2)</th>
                <th className="p-3">Dirección IPv4 (Capa 3)</th>
                <th className="p-3">Máscara</th>
                <th className="p-3">Gateway</th>
                <th className="p-3">Método</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-neutral-300">
              {DEVICES.map((dev, idx) => (
                <tr key={dev.id} className={idx % 2 === 0 ? 'bg-black hover:bg-neutral-950' : 'bg-neutral-950/40 hover:bg-neutral-950'}>
                  <td className="p-3 font-bold text-white">
                    {dev.id}
                    <span className="text-neutral-500 text-[10px] block font-sans">{dev.name}</span>
                  </td>
                  <td className="p-3 text-neutral-400">
                    {dev.type === 'router' ? 'Gi0/0/0' : dev.type === 'switch' ? 'Vlan1 Mgmt' : 'Ethernet0'}
                  </td>
                  <td className="p-3 text-white">
                    {dev.mac}
                  </td>
                  <td className="p-3 text-cyan-400 font-bold">
                    {dev.ip}
                  </td>
                  <td className="p-3 text-neutral-400">
                    {dev.mask}
                  </td>
                  <td className="p-3 text-neutral-400">
                    {dev.type === 'router' ? 'N/A' : '192.168.1.1'}
                  </td>
                  <td className="p-3">
                    {dev.type === 'pc' ? (
                      <span className="px-1.5 py-0.5 rounded bg-neutral-900 text-emerald-400 border border-neutral-800 text-[10px]">
                        DHCP
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-neutral-900 text-white border border-neutral-800 text-[10px]">
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
