import React from 'react';
import { Network, Router as RouterIcon, Radio, Layers, CheckCircle2, Shield, Cpu, HelpCircle } from 'lucide-react';
import { COMPARISON_TABLE } from '../data/networkData';

export default function ComparativeTable() {
  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-cyan-400 font-mono text-xs font-semibold tracking-wider uppercase">
              Requerimiento de la Actividad
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100 mt-1">
              Tabla Comparativa: Switch vs. Módem vs. Router
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-3xl leading-relaxed">
              Análisis exhaustivo de los tres dispositivos centrales de interconexión en redes de comunicaciones:
              diferencias en capas del modelo OSI, tratamiento de direcciones físicas vs lógicas, segmentación
              de dominios de colisión y broadcast, y sus casos de uso en el mundo real.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950 p-3 rounded-xl border border-slate-800 self-start md:self-auto">
            <div className="text-center px-3 border-r border-slate-800">
              <span className="block text-sky-400 font-bold text-base">Capa 2</span>
              <span className="text-[10px] text-slate-500 uppercase">Switch</span>
            </div>
            <div className="text-center px-3 border-r border-slate-800">
              <span className="block text-purple-400 font-bold text-base">Capa 1</span>
              <span className="text-[10px] text-slate-500 uppercase">Módem</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-amber-400 font-bold text-base">Capa 3</span>
              <span className="text-[10px] text-slate-500 uppercase">Router</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Comparison Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 font-semibold">
                <th className="p-4 w-1/5 min-w-[160px]">Criterio / Característica</th>
                <th className="p-4 w-4/15 min-w-[240px] text-sky-300">
                  <div className="flex items-center space-x-2">
                    <Network className="w-4 h-4 text-sky-400" />
                    <span>SWITCH (Conmutador)</span>
                  </div>
                </th>
                <th className="p-4 w-4/15 min-w-[240px] text-purple-300">
                  <div className="flex items-center space-x-2">
                    <Radio className="w-4 h-4 text-purple-400" />
                    <span>MÓDEM (Modulador/Demod.)</span>
                  </div>
                </th>
                <th className="p-4 w-4/15 min-w-[240px] text-amber-300">
                  <div className="flex items-center space-x-2">
                    <RouterIcon className="w-4 h-4 text-amber-400" />
                    <span>ROUTER (Enrutador)</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300">
              {COMPARISON_TABLE.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-900/40 hover:bg-slate-800/40' : 'bg-slate-950/40 hover:bg-slate-800/40'}>
                  <td className="p-4 font-semibold text-slate-200 bg-slate-950/20">
                    {row.feature}
                  </td>
                  <td className="p-4 leading-relaxed text-slate-300">
                    {row.switch}
                  </td>
                  <td className="p-4 leading-relaxed text-slate-300">
                    {row.modem}
                  </td>
                  <td className="p-4 leading-relaxed text-slate-300">
                    {row.router}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-sky-900/40 rounded-2xl p-5 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3">
            <Network className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-100 text-base mb-1">Switch en la LAN</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Es el corazón local de la empresa. Conecta a alta velocidad (1 Gbps a 10 Gbps) todas las computadoras, servidores e impresoras. Lee la dirección MAC de cada trama para enviarla <strong>únicamente al puerto del destinatario</strong>, evitando colisiones.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-purple-900/40 rounded-2xl p-5 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-100 text-base mb-1">Módem (o ONT / Cablemódem)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Es el traductor físico con el mundo exterior. Convierte las señales analógicas o lumínicas de la línea telefónica, coaxial o fibra óptica (PON) en señales digitales binarias comprensibles para el Router corporativo.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-amber-900/40 rounded-2xl p-5 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
            <RouterIcon className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-100 text-base mb-1">Router en la Frontera</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Es el guardián y director de tráfico entre redes. Aplica NAT para que toda la oficina navegue con una sola IP pública, ejecuta el firewall perimetral, bloquea los broadcasts para no saturar internet y determina la ruta óptima para los paquetes IP.
          </p>
        </div>
      </div>
    </div>
  );
}
