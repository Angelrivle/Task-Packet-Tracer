import React from 'react';
import { 
  Radio, 
  Layers, 
  Database, 
  Terminal, 
  Cpu, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function PacketInspector({
  currentPacketInfo,
  activeDevice,
  arpTables,
  macTables
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Mini-Wireshark Packet Inspector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm text-slate-100">
              Inspector de Trama en Tránsito (Modelo OSI / TCP/IP)
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Wireshark View
          </span>
        </div>

        {currentPacketInfo ? (
          <div className="mt-3 space-y-2.5 font-mono text-xs">
            {/* Layer 2: Ethernet Frame */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-sky-900/40">
              <div className="flex items-center justify-between text-sky-400 font-bold text-[11px] mb-1">
                <span>[Capa 2] Enlace de Datos (Trama Ethernet II)</span>
                <span>EtherType: {currentPacketInfo.etherType || '0x0800'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                <div>
                  <span className="text-slate-500">MAC Origen: </span>
                  <span className="text-cyan-300 font-bold">{currentPacketInfo.srcMac}</span>
                </div>
                <div>
                  <span className="text-slate-500">MAC Destino: </span>
                  <span className={currentPacketInfo.dstMac === 'FF:FF:FF:FF:FF:FF' ? 'text-amber-400 font-bold' : 'text-emerald-300 font-bold'}>
                    {currentPacketInfo.dstMac}
                  </span>
                </div>
              </div>
            </div>

            {/* Layer 3: Network Packet */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-indigo-900/40">
              <div className="flex items-center justify-between text-indigo-400 font-bold text-[11px] mb-1">
                <span>[Capa 3] Red (Paquete IPv4 / ARP)</span>
                <span>TTL: 64</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                <div>
                  <span className="text-slate-500">IP Origen: </span>
                  <span className="text-indigo-300 font-bold">{currentPacketInfo.srcIp}</span>
                </div>
                <div>
                  <span className="text-slate-500">IP Destino: </span>
                  <span className="text-purple-300 font-bold">{currentPacketInfo.dstIp}</span>
                </div>
              </div>
            </div>

            {/* Layer 4 / Payload info */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-900/40">
              <div className="flex items-center justify-between text-emerald-400 font-bold text-[11px] mb-1">
                <span>[Capa 4 / Payload] Protocolo de Aplicación / Control</span>
                <span>{currentPacketInfo.protocol}</span>
              </div>
              <div className="text-[11px] text-slate-300">
                <span className="text-slate-500">Detalle Operación: </span>
                <span className="text-emerald-300">{currentPacketInfo.payloadDetail}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 py-8 text-center text-slate-500 text-xs">
            <Radio className="w-8 h-8 mx-auto text-slate-600 mb-2 animate-pulse" />
            <p>No hay tramas en tránsito en este instante.</p>
            <p className="text-[11px] text-slate-600 mt-1">Presiona "Simular ARP + Ping" para observar el desglose de tramas.</p>
          </div>
        )}
      </div>

      {/* Tables Inspector (ARP Table & Switch CAM Table) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-sm text-slate-100">
                Estado de Tablas (ARP y Switch CAM)
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Memoria Dinámica
            </span>
          </div>

          <div className="mt-3 space-y-3">
            {/* Active Switch CAM Table */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
                <span className="text-sky-400">Tabla CAM de Switch (SW-ACC-01 / SW-CORE):</span>
                <span className="text-[10px] text-slate-500 font-mono">VLAN 1</span>
              </div>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-2 max-h-32 overflow-y-auto">
                <table className="w-full text-left font-mono text-[10px] text-slate-300">
                  <thead className="text-slate-500 border-b border-slate-800">
                    <tr>
                      <th className="pb-1">Dirección MAC</th>
                      <th className="pb-1">Puerto</th>
                      <th className="pb-1">Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {macTables && macTables.length > 0 ? (
                      macTables.map((entry, i) => (
                        <tr key={i} className="border-b border-slate-900/60 hover:bg-slate-900/50">
                          <td className="py-1 text-cyan-300">{entry.mac}</td>
                          <td className="py-1 text-slate-300">{entry.port}</td>
                          <td className="py-1 text-emerald-400">{entry.type}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="py-3 text-center text-slate-600">
                          Tabla CAM inicializada (se aprenderá al fluir tráfico)
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Active Device ARP Cache */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
                <span className="text-amber-400">
                  Caché ARP del Host Origen ({activeDevice ? activeDevice.id : 'PC-01'}):
                </span>
                <span className="text-[10px] text-slate-500 font-mono">arp -a</span>
              </div>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-2 max-h-32 overflow-y-auto">
                <table className="w-full text-left font-mono text-[10px] text-slate-300">
                  <thead className="text-slate-500 border-b border-slate-800">
                    <tr>
                      <th className="pb-1">Dirección IP</th>
                      <th className="pb-1">Dirección MAC Física</th>
                      <th className="pb-1">Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {arpTables && Object.keys(arpTables).length > 0 ? (
                      Object.entries(arpTables).map(([ip, mac], i) => (
                        <tr key={i} className="border-b border-slate-900/60 hover:bg-slate-900/50">
                          <td className="py-1 text-indigo-300">{ip}</td>
                          <td className="py-1 text-emerald-300 font-bold">{mac}</td>
                          <td className="py-1 text-amber-400">Dinámica</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="py-3 text-center text-slate-600">
                          Caché ARP vacía (requerirá consulta ARP Broadcast)
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>💡 Las entradas de la tabla CAM y ARP expiran tras inactividad (Aging time: 300s).</span>
        </div>
      </div>
    </div>
  );
}
