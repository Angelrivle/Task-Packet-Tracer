import React from 'react';
import { Network, Router as RouterIcon, Radio } from 'lucide-react';
import { COMPARISON_TABLE } from '../data/networkData';

export default function ComparativeTable() {
  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-black border border-neutral-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
              Requerimiento de la Actividad
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
              Tabla Comparativa: Switch vs. Módem vs. Router
            </h2>
            <p className="text-neutral-400 text-xs md:text-sm mt-2 max-w-3xl leading-relaxed">
              Diferencias clave en capas del modelo OSI, tratamiento de direcciones físicas vs lógicas, segmentación
              de dominios de colisión y broadcast, y sus funciones específicas en la red corporativa.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 self-start md:self-auto font-mono text-xs">
            <div className="text-center px-3 border-r border-neutral-800">
              <span className="block text-white font-bold">Capa 2</span>
              <span className="text-[10px] text-neutral-500">SWITCH</span>
            </div>
            <div className="text-center px-3 border-r border-neutral-800">
              <span className="block text-white font-bold">Capa 1</span>
              <span className="text-[10px] text-neutral-500">MÓDEM</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-white font-bold">Capa 3</span>
              <span className="text-[10px] text-neutral-500">ROUTER</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-black border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800 text-neutral-200 font-semibold font-mono">
                <th className="p-4 w-1/5 min-w-[160px] text-neutral-400">Criterio</th>
                <th className="p-4 w-4/15 min-w-[240px] text-white">
                  <div className="flex items-center space-x-2">
                    <Network className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Switch (Conmutador)</span>
                  </div>
                </th>
                <th className="p-4 w-4/15 min-w-[240px] text-white">
                  <div className="flex items-center space-x-2">
                    <Radio className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Módem</span>
                  </div>
                </th>
                <th className="p-4 w-4/15 min-w-[240px] text-white">
                  <div className="flex items-center space-x-2">
                    <RouterIcon className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Router (Enrutador)</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-neutral-300">
              {COMPARISON_TABLE.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-black hover:bg-neutral-950' : 'bg-neutral-950/60 hover:bg-neutral-950'}>
                  <td className="p-4 font-semibold text-white font-mono text-xs">
                    {row.feature}
                  </td>
                  <td className="p-4 leading-relaxed text-neutral-300 text-xs">
                    {row.switch}
                  </td>
                  <td className="p-4 leading-relaxed text-neutral-300 text-xs">
                    {row.modem}
                  </td>
                  <td className="p-4 leading-relaxed text-neutral-300 text-xs">
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
        <div className="bg-black border border-neutral-800 rounded-xl p-5 shadow-lg">
          <span className="text-[10px] font-mono text-neutral-500 uppercase">Dispositivo L2</span>
          <h3 className="font-bold text-white text-base mt-1 mb-2">Switch en la LAN</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Interconecta a velocidad de Gigabit las PCs y servidores dentro de la oficina. Lee la dirección física MAC de cada trama para enviarla únicamente al puerto del receptor, aislando dominios de colisión.
          </p>
        </div>

        <div className="bg-black border border-neutral-800 rounded-xl p-5 shadow-lg">
          <span className="text-[10px] font-mono text-neutral-500 uppercase">Dispositivo L1</span>
          <h3 className="font-bold text-white text-base mt-1 mb-2">Módem (o ONT / GPON)</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Modulador y demodulador físico. Convierte las señales analógicas o pulsos de luz provenientes del ISP en señales digitales binarias aptas para el router de borde.
          </p>
        </div>

        <div className="bg-black border border-neutral-800 rounded-xl p-5 shadow-lg">
          <span className="text-[10px] font-mono text-neutral-500 uppercase">Dispositivo L3</span>
          <h3 className="font-bold text-white text-base mt-1 mb-2">Router en la Frontera</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Enruta paquetes IP entre redes lógicas diferentes (la red privada 192.168.1.0/24 e Internet pública). Aplica NAT/PAT, aísla dominios de broadcast y filtra tráfico con firewall.
          </p>
        </div>
      </div>
    </div>
  );
}
