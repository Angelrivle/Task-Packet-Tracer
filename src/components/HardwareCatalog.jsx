import React from 'react';
import { 
  Server, 
  Monitor, 
  Router as RouterIcon, 
  Network as SwitchIcon, 
  Cable, 
  Layers 
} from 'lucide-react';
import { DEVICES, NETWORK_MEDIA } from '../data/networkData';

export default function HardwareCatalog() {
  const router = DEVICES.find(d => d.type === 'router');
  const switches = DEVICES.filter(d => d.type === 'switch');
  const server = DEVICES.find(d => d.type === 'server');
  const pcs = DEVICES.filter(d => d.type === 'pc');

  const getIcon = (type) => {
    switch(type) {
      case 'router': return <RouterIcon className="w-5 h-5 text-neutral-300" />;
      case 'switch': return <SwitchIcon className="w-5 h-5 text-neutral-300" />;
      case 'server': return <Server className="w-5 h-5 text-neutral-300" />;
      default: return <Monitor className="w-5 h-5 text-neutral-300" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-black border border-neutral-800 rounded-xl p-6 shadow-xl">
        <span className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
          Rúbrica de Evaluación
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
          Inventario y Fichas Técnicas de Hardware Real
        </h2>
        <p className="text-neutral-400 text-xs md:text-sm mt-2 max-w-3xl leading-relaxed">
          Identificación detallada de cada componente de la red LAN: su función específica, modelo real disponible
          en el mercado, rendimiento/velocidad de transmisión y costos estimados en USD.
        </p>
      </div>

      {/* Core Infrastructure */}
      <div>
        <h3 className="text-base font-bold text-white mb-4 font-mono flex items-center space-x-2">
          <span>// INFRAESTRUCTURA PRINCIPAL (1 ROUTER, 3 SWITCHES, 1 SERVIDOR)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Router */}
          <div className="bg-black border border-neutral-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    {getIcon('router')}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">
                      Default Gateway
                    </span>
                    <h4 className="font-bold text-white text-base mt-0.5">{router.name}</h4>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-white bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                  {router.marketPrice}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div>
                  <span className="text-neutral-500">Función en la LAN: </span>
                  <span className="text-neutral-300">
                    Puerta de enlace predeterminada. Interconexión con el ISP, enrutamiento inter-red, NAT/PAT y firewall perimetral.
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-neutral-500">Modelo comercial: </span>
                  <span className="text-white font-mono">{router.model}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-neutral-500">Velocidad: </span>
                  <span className="text-neutral-300 font-mono">{router.marketSpeed}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-neutral-500">Ubicación: </span>
                  <span className="text-neutral-400">{router.location}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>IP: {router.ip}</span>
              <span>MAC: {router.mac}</span>
            </div>
          </div>

          {/* Server */}
          <div className="bg-black border border-neutral-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    {getIcon('server')}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">
                      Servidor LAN
                    </span>
                    <h4 className="font-bold text-white text-base mt-0.5">{server.name}</h4>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-white bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                  {server.marketPrice}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div>
                  <span className="text-neutral-500">Función en la LAN: </span>
                  <span className="text-neutral-300">
                    Servicios corporativos internos: Portal Web Intranet HTTP/HTTPS, resolución interna de nombres DNS y almacenamiento compartido NFS/SMB.
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-neutral-500">Modelo comercial: </span>
                  <span className="text-white font-mono">{server.model}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-neutral-500">Velocidad: </span>
                  <span className="text-neutral-300 font-mono">{server.marketSpeed}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-neutral-500">Ubicación: </span>
                  <span className="text-neutral-400">{server.location}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>IP: {server.ip}</span>
              <span>MAC: {server.mac}</span>
            </div>
          </div>

          {/* 3 Switches */}
          {switches.map((sw) => (
            <div key={sw.id} className="bg-black border border-neutral-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                      {getIcon('switch')}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">
                        {sw.id === 'SW-CORE' ? 'Switch de Núcleo (Core)' : 'Switch de Acceso'}
                      </span>
                      <h4 className="font-bold text-white text-base mt-0.5">{sw.name}</h4>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-white bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                    {sw.marketPrice}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div>
                    <span className="text-neutral-500">Función en la LAN: </span>
                    <span className="text-neutral-300">
                      {sw.id === 'SW-CORE'
                        ? 'Interconecta los dos switches de acceso con el servidor corporativo y el router a velocidad de backplane.'
                        : 'Conecta físicamente los puestos de trabajo finales (PCs) mediante cableado Cat6 a velocidad Gigabit.'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-neutral-500">Modelo comercial: </span>
                    <span className="text-white font-mono">{sw.model}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-neutral-500">Velocidad / Puertos: </span>
                    <span className="text-neutral-300 font-mono">{sw.marketSpeed}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-neutral-500">Ubicación: </span>
                    <span className="text-neutral-400">{sw.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>IP de Gestión: {sw.ip}</span>
                <span>MAC: {sw.mac}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10 Workstations Table */}
      <div>
        <h3 className="text-base font-bold text-white mb-4 font-mono">
          // 10 EQUIPOS CLIENTES CONECTADOS (ESTACIONES DE TRABAJO)
        </h3>

        <div className="bg-black border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400">
                <tr>
                  <th className="p-3">Host ID</th>
                  <th className="p-3">Rol / Departamento</th>
                  <th className="p-3">Modelo Comercial</th>
                  <th className="p-3">NIC / Velocidad</th>
                  <th className="p-3">Switch Conectado</th>
                  <th className="p-3">Precio Estimado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 text-neutral-300">
                {pcs.map((pc, idx) => (
                  <tr key={pc.id} className={idx % 2 === 0 ? 'bg-black hover:bg-neutral-950' : 'bg-neutral-950/40 hover:bg-neutral-950'}>
                    <td className="p-3 font-bold text-white">
                      {pc.id}
                    </td>
                    <td className="p-3 text-neutral-300 font-sans">
                      {pc.role}
                    </td>
                    <td className="p-3 text-neutral-400">
                      {pc.model}
                    </td>
                    <td className="p-3 text-emerald-400">
                      {pc.marketSpeed}
                    </td>
                    <td className="p-3 text-neutral-400">
                      {pc.connectedTo[0]}
                    </td>
                    <td className="p-3 text-white">
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
        <h3 className="text-base font-bold text-white mb-4 font-mono">
          // MEDIOS FÍSICOS DE RED (CABLEADO ESTRUCTURADO)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {NETWORK_MEDIA.map((cable, idx) => (
            <div key={idx} className="bg-black border border-neutral-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase">
                  Cable #{idx + 1}
                </span>
                <h4 className="font-bold text-white text-sm mt-1 mb-2">{cable.type}</h4>
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-neutral-500">Uso: </span>
                    <span className="text-neutral-300">{cable.usage}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Norma: </span>
                    <span className="text-white font-mono">{cable.standard}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Velocidad: </span>
                    <span className="text-emerald-400 font-mono">{cable.speed}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Conector: </span>
                    <span className="text-neutral-400">{cable.connector}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-900 text-[11px] font-mono text-white">
                {cable.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
