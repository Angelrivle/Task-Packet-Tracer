import React from 'react';
import { Layers, Database, Radio } from 'lucide-react';

export default function PacketInspector({
  currentPacketInfo,
  activeDevice,
  arpTables,
  macTables
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Mini-Wireshark Packet Inspector */}
      <div className="bg-black border border-neutral-800 rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5 text-neutral-400" />
            <h3 className="font-mono font-semibold text-xs text-neutral-200 uppercase tracking-wider">
              Inspector de Trama en Tránsito (Modelo OSI)
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
            Wireshark View
          </span>
        </div>

        {currentPacketInfo ? (
          <div className="mt-3 space-y-2 font-mono text-xs">
            {/* Layer 2: Ethernet Frame */}
            <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
              <div className="flex items-center justify-between text-neutral-300 font-bold text-[10px] mb-1 uppercase tracking-wider">
                <span>[Capa 2] Enlace de Datos (Ethernet II)</span>
                <span className="text-neutral-500">EtherType: {currentPacketInfo.etherType || '0x0800'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-neutral-300 text-[11px]">
                <div>
                  <span className="text-neutral-500">MAC Origen: </span>
                  <span className="text-white font-mono">{currentPacketInfo.srcMac}</span>
                </div>
                <div>
                  <span className="text-neutral-500">MAC Destino: </span>
                  <span className={currentPacketInfo.dstMac === 'FF:FF:FF:FF:FF:FF' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-mono'}>
                    {currentPacketInfo.dstMac}
                  </span>
                </div>
              </div>
            </div>

            {/* Layer 3: Network Packet */}
            <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
              <div className="flex items-center justify-between text-neutral-300 font-bold text-[10px] mb-1 uppercase tracking-wider">
                <span>[Capa 3] Red (IPv4 / ARP)</span>
                <span className="text-neutral-500">TTL: 64</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-neutral-300 text-[11px]">
                <div>
                  <span className="text-neutral-500">IP Origen: </span>
                  <span className="text-white font-mono">{currentPacketInfo.srcIp}</span>
                </div>
                <div>
                  <span className="text-neutral-500">IP Destino: </span>
                  <span className="text-cyan-400 font-mono">{currentPacketInfo.dstIp}</span>
                </div>
              </div>
            </div>

            {/* Layer 4 / Payload info */}
            <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
              <div className="flex items-center justify-between text-neutral-300 font-bold text-[10px] mb-1 uppercase tracking-wider">
                <span>[Capa 4 / Payload]</span>
                <span className="text-emerald-400">{currentPacketInfo.protocol}</span>
              </div>
              <div className="text-[11px] text-neutral-300">
                <span className="text-neutral-500">Detalle: </span>
                <span>{currentPacketInfo.payloadDetail}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 py-8 text-center text-neutral-600 text-xs font-mono">
            <Radio className="w-6 h-6 mx-auto text-neutral-700 mb-2" />
            <p>No hay tramas en tránsito en este instante.</p>
            <p className="text-[10px] text-neutral-600 mt-1">Presiona "Simular ARP + Ping" para iniciar.</p>
          </div>
        )}
      </div>

      {/* Dynamic Tables: Switch CAM & ARP Cache */}
      <div className="bg-black border border-neutral-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center space-x-2">
              <Database className="w-3.5 h-3.5 text-neutral-400" />
              <h3 className="font-mono font-semibold text-xs text-neutral-200 uppercase tracking-wider">
                Tablas Dinámicas (CAM Switch & ARP Host)
              </h3>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">
              RAM Volátil
            </span>
          </div>

          <div className="mt-3 space-y-3">
            {/* Switch CAM Table */}
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1 font-mono">
                <span>Tabla CAM del Switch (SW-CORE / SW-ACC-01):</span>
                <span className="text-[10px] text-neutral-600">VLAN 1</span>
              </div>
              <div className="bg-neutral-950 rounded-lg border border-neutral-800 p-2 max-h-32 overflow-y-auto">
                <table className="w-full text-left font-mono text-[10px] text-neutral-300">
                  <thead className="text-neutral-500 border-b border-neutral-900">
                    <tr>
                      <th className="pb-1">Dirección MAC</th>
                      <th className="pb-1">Puerto</th>
                      <th className="pb-1">Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {macTables && macTables.length > 0 ? (
                      macTables.map((entry, i) => (
                        <tr key={i} className="border-b border-neutral-900/60">
                          <td className="py-1 text-white">{entry.mac}</td>
                          <td className="py-1 text-neutral-400">{entry.port}</td>
                          <td className="py-1 text-emerald-400">{entry.type}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="py-2 text-center text-neutral-600">
                          Tabla CAM inicializada
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Host ARP Cache */}
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1 font-mono">
                <span>Caché ARP del Host ({activeDevice ? activeDevice.id : 'PC-01'}):</span>
                <span className="text-[10px] text-neutral-600 font-mono">arp -a</span>
              </div>
              <div className="bg-neutral-950 rounded-lg border border-neutral-800 p-2 max-h-32 overflow-y-auto">
                <table className="w-full text-left font-mono text-[10px] text-neutral-300">
                  <thead className="text-neutral-500 border-b border-neutral-900">
                    <tr>
                      <th className="pb-1">Dirección IP</th>
                      <th className="pb-1">Dirección MAC Física</th>
                      <th className="pb-1">Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {arpTables && Object.keys(arpTables).length > 0 ? (
                      Object.entries(arpTables).map(([ip, mac], i) => (
                        <tr key={i} className="border-b border-neutral-900/60">
                          <td className="py-1 text-cyan-400">{ip}</td>
                          <td className="py-1 text-white">{mac}</td>
                          <td className="py-1 text-neutral-400">Dinámica</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="py-2 text-center text-neutral-600">
                          Caché ARP vacía (requiere consulta Broadcast)
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-neutral-900 text-[10px] font-mono text-neutral-500 flex items-center justify-between">
          <span>Las entradas CAM y ARP tienen envejecimiento automático (Aging Timer).</span>
        </div>
      </div>
    </div>
  );
}
