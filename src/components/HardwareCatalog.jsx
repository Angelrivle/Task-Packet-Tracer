import React from 'react';
import { 
  Server, 
  Monitor, 
  Router as RouterIcon, 
  Network as SwitchIcon, 
  Cable, 
  Tag, 
  Gauge, 
  DollarSign, 
  CheckCircle,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { DEVICES, NETWORK_MEDIA } from '../data/networkData';

export default function HardwareCatalog() {
  // Group devices for clear display
  const router = DEVICES.find(d => d.type === 'router');
  const switches = DEVICES.filter(d => d.type === 'switch');
  const server = DEVICES.find(d => d.type === 'server');
  const pcs = DEVICES.filter(d => d.type === 'pc');

  return (
    <div className="space-y-8">
      {/* Catalog Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <span className="text-cyan-400 font-mono text-xs font-semibold tracking-wider uppercase">
          Requerimiento de la Rúbrica
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-slate-100 mt-1">
          Inventario y Fichas Técnicas de Hardware del Mercado Real
        </h2>
        <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-3xl leading-relaxed">
          Cada uno de los componentes empleados en el diseño de esta red LAN corporativa ha sido seleccionado
          con base en estándares industriales vigentes. Se especifica su función, modelo exacto comercial,
          rendimiento/velocidad de transferencia y costo estimado en el mercado actual.
        </p>
      </div>

      {/* Core Infrastructure: Router, Core Switch, Access Switches & Server */}
      <div>
        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Equipos Activos Principales (Infraestructura de Borde y Centro de Datos)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Router Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-amber-500/40 transition-all">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                    <RouterIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/40">
                      Router de Borde
                    </span>
                    <h4 className="font-bold text-slate-100 text-base mt-1">{router.name}</h4>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/40">
                  {router.marketPrice}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div>
                  <span className="text-slate-500">¿Para qué se utiliza?: </span>
                  <span className="text-slate-300 leading-relaxed">
                    Puerta de enlace predeterminada (Default Gateway) de la LAN. Interconecta la red local con el proveedor de Internet (ISP), provee traducción de direcciones de red (NAT/PAT), enrutamiento inter-red y cortafuegos perimetral (Zone-Based Firewall).
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500">Modelo de mercado: </span>
                  <span className="text-cyan-300 font-semibold">{router.model}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500">Velocidad / Throughput: </span>
                  <span className="text-slate-200 font-mono">{router.marketSpeed}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500">Ubicación Física: </span>
                  <span className="text-slate-300">{router.location}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>IP: {router.ip}</span>
              <span>MAC: {router.mac}</span>
            </div>
          </div>

          {/* Server Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-purple-500/40 transition-all">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 font-semibold px-2 py-0.5 rounded bg-purple-950/40 border border-purple-800/40">
                      Servidor Local LAN
                    </span>
                    <h4 className="font-bold text-slate-100 text-base mt-1">{server.name}</h4>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/40">
                  {server.marketPrice}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div>
                  <span className="text-slate-500">¿Para qué se utiliza?: </span>
                  <span className="text-slate-300 leading-relaxed">
                    Aloja servicios corporativos internos: Portal Web Intranet HTTP/HTTPS, resolución de nombres interna (DNS Server), compartición de archivos y backup corporativo (NFS/SMB).
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500">Modelo de mercado: </span>
                  <span className="text-cyan-300 font-semibold">{server.model}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500">Velocidad / Interfaces: </span>
                  <span className="text-slate-200 font-mono">{server.marketSpeed}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500">Hardware base: </span>
                  <span className="text-slate-300">Intel Xeon Silver 4310, 32GB RAM DDR4 ECC, 2x 960GB SSD Enterprise RAID 1</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>IP: {server.ip}</span>
              <span>MAC: {server.mac}</span>
            </div>
          </div>

          {/* Switches (Core + 2 Access Switches = 3 Switches exigidos) */}
          {switches.map((sw, index) => (
            <div key={sw.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-sky-500/40 transition-all">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                      <SwitchIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-sky-400 font-semibold px-2 py-0.5 rounded bg-sky-950/40 border border-sky-800/40">
                        {sw.id === 'SW-CORE' ? 'Switch Core / Distribución' : 'Switch de Acceso'}
                      </span>
                      <h4 className="font-bold text-slate-100 text-base mt-1">{sw.name}</h4>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/40">
                    {sw.marketPrice}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500">¿Para qué se utiliza?: </span>
                    <span className="text-slate-300 leading-relaxed">
                      {sw.id === 'SW-CORE'
                        ? 'Interconecta a velocidad de backplane los dos switches de acceso con el Servidor corporativo y el Router de salida. Opera como la columna vertebral (Backbone) de la LAN.'
                        : 'Conecta físicamente los puestos de trabajo finales (PCs) mediante cableado UTP Cat6, gestiona las tramas Ethernet a velocidad Gigabit y aísla los dominios de colisión en cada puerto.'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500">Modelo de mercado: </span>
                    <span className="text-cyan-300 font-semibold">{sw.model}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500">Velocidad y Puertos: </span>
                    <span className="text-slate-200 font-mono">{sw.marketSpeed}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500">Ubicación Física: </span>
                    <span className="text-slate-300">{sw.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>IP de Gestión: {sw.ip}</span>
                <span>MAC: {sw.mac}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10 Workstations Table */}
      <div>
        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center space-x-2">
          <Monitor className="w-5 h-5 text-emerald-400" />
          <span>10 Equipos Clientes Conectados (Estaciones de Trabajo y Computadoras)</span>
        </h3>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-300 font-semibold font-mono">
                <tr>
                  <th className="p-3">Host ID</th>
                  <th className="p-3">Rol / Departamento</th>
                  <th className="p-3">Modelo Comercial</th>
                  <th className="p-3">Tarjeta de Red (NIC) / Velocidad</th>
                  <th className="p-3">Switch Asignado</th>
                  <th className="p-3">Precio Estimado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {pcs.map((pc, idx) => (
                  <tr key={pc.id} className={idx % 2 === 0 ? 'bg-slate-900/30 hover:bg-slate-800/40' : 'bg-slate-950/30 hover:bg-slate-800/40'}>
                    <td className="p-3 font-mono font-bold text-cyan-300">
                      {pc.id}
                    </td>
                    <td className="p-3 font-medium text-slate-200">
                      {pc.role}
                    </td>
                    <td className="p-3 text-slate-300">
                      {pc.model}
                    </td>
                    <td className="p-3 font-mono text-emerald-400">
                      {pc.marketSpeed}
                    </td>
                    <td className="p-3 font-mono text-sky-400">
                      {pc.connectedTo[0]}
                    </td>
                    <td className="p-3 font-mono text-slate-400">
                      {pc.marketPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Physical Media / Cabling */}
      <div>
        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center space-x-2">
          <Cable className="w-5 h-5 text-indigo-400" />
          <span>Medios de Transmisión Físicos (Cableado Estructurado)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {NETWORK_MEDIA.map((cable, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-semibold">
                  Medio de Red #{idx + 1}
                </span>
                <h4 className="font-bold text-slate-100 text-sm mt-1 mb-2">{cable.type}</h4>
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-500">Uso en la red: </span>
                    <span className="text-slate-300">{cable.usage}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Norma: </span>
                    <span className="text-cyan-300 font-mono">{cable.standard}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Velocidad / Ancho de banda: </span>
                    <span className="text-emerald-400 font-mono font-semibold">{cable.speed}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Conector: </span>
                    <span className="text-slate-300">{cable.connector}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-emerald-400">
                {cable.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
