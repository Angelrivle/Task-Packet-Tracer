import React from 'react';
import { 
  Server, 
  Monitor, 
  Router as RouterIcon, 
  Network as SwitchIcon, 
  Terminal, 
  ArrowRight,
  Info
} from 'lucide-react';
import { DEVICES } from '../data/networkData';

export default function NetworkTopology({ 
  sourceNode, 
  setSourceNode, 
  destNode, 
  setDestNode, 
  simulationPackets, 
  onSelectDeviceForTerminal,
  activeDeviceDetails,
  setActiveDeviceDetails
}) {
  const viewBoxWidth = 1000;
  const viewBoxHeight = 550;

  // Node map
  const deviceMap = React.useMemo(() => {
    const map = {};
    DEVICES.forEach(d => { map[d.id] = d; });
    return map;
  }, []);

  // Cable links
  const links = [
    { from: 'R1', to: 'SW-CORE', type: 'uplink' },
    { from: 'SW-CORE', to: 'SRV-01', type: 'server' },
    { from: 'SW-CORE', to: 'SW-ACC-01', type: 'trunk' },
    { from: 'SW-CORE', to: 'SW-ACC-02', type: 'trunk' },
    { from: 'SW-ACC-01', to: 'PC-01', type: 'access' },
    { from: 'SW-ACC-01', to: 'PC-02', type: 'access' },
    { from: 'SW-ACC-01', to: 'PC-03', type: 'access' },
    { from: 'SW-ACC-01', to: 'PC-04', type: 'access' },
    { from: 'SW-ACC-01', to: 'PC-05', type: 'access' },
    { from: 'SW-ACC-02', to: 'PC-06', type: 'access' },
    { from: 'SW-ACC-02', to: 'PC-07', type: 'access' },
    { from: 'SW-ACC-02', to: 'PC-08', type: 'access' },
    { from: 'SW-ACC-02', to: 'PC-09', type: 'access' },
    { from: 'SW-ACC-02', to: 'PC-10', type: 'access' },
  ];

  const isLinkActive = (fromId, toId) => {
    return simulationPackets.some(p => 
      (p.from === fromId && p.to === toId) || 
      (p.from === toId && p.to === fromId)
    );
  };

  const getDeviceIcon = (type) => {
    switch(type) {
      case 'router':
        return <RouterIcon className="w-4 h-4 text-neutral-300" />;
      case 'switch':
        return <SwitchIcon className="w-4 h-4 text-neutral-300" />;
      case 'server':
        return <Server className="w-4 h-4 text-neutral-300" />;
      case 'pc':
      default:
        return <Monitor className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  return (
    <div className="bg-black rounded-xl border border-neutral-800 shadow-2xl overflow-hidden">
      
      {/* Top Bar: Super Intuitive Source & Destination Selection */}
      <div className="flex flex-wrap items-center justify-between p-3.5 bg-neutral-950 border-b border-neutral-800 text-xs gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Source Selector */}
          <div className="flex items-center space-x-2 bg-neutral-900 px-2.5 py-1.5 rounded-lg border border-neutral-800">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="text-neutral-400 font-mono text-[11px] uppercase">Origen:</span>
            <select
              value={sourceNode}
              onChange={(e) => setSourceNode(e.target.value)}
              className="bg-black border border-neutral-700 rounded px-2 py-0.5 text-white font-mono text-xs focus:outline-none focus:border-white"
            >
              {DEVICES.filter(d => d.type === 'pc' || d.type === 'server').map(d => (
                <option key={d.id} value={d.id}>
                  {d.id} ({d.ip}) - {d.role.split('-')[0]}
                </option>
              ))}
            </select>
          </div>

          <ArrowRight className="w-4 h-4 text-neutral-600 hidden sm:block" />

          {/* Dest Selector */}
          <div className="flex items-center space-x-2 bg-neutral-900 px-2.5 py-1.5 rounded-lg border border-neutral-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-neutral-400 font-mono text-[11px] uppercase">Destino:</span>
            <select
              value={destNode}
              onChange={(e) => setDestNode(e.target.value)}
              className="bg-black border border-neutral-700 rounded px-2 py-0.5 text-white font-mono text-xs focus:outline-none focus:border-white"
            >
              {DEVICES.map(d => (
                <option key={d.id} value={d.id} disabled={d.id === sourceNode}>
                  {d.id} ({d.ip}) - {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Node quick info and CLI action */}
        <div className="flex items-center space-x-2">
          {activeDeviceDetails && (
            <button
              onClick={() => onSelectDeviceForTerminal(activeDeviceDetails)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg text-white font-mono text-xs transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Consola CLI: {activeDeviceDetails.id}</span>
            </button>
          )}

          <div className="text-[11px] text-neutral-500 font-mono hidden md:block">
            Estrella Jerárquica (15 Nodos)
          </div>
        </div>
      </div>

      {/* SVG Canvas - Pure Minimalist Dark Look */}
      <div className="relative w-full overflow-x-auto bg-black">
        <svg 
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
          className="w-full h-auto min-w-[760px] select-none"
        >
          <defs>
            <filter id="packetGlowMin" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Links / Cables */}
          {links.map((link, idx) => {
            const start = deviceMap[link.from];
            const end = deviceMap[link.to];
            if (!start || !end) return null;

            const active = isLinkActive(link.from, link.to);
            const isTrunk = link.type === 'trunk';

            return (
              <g key={`link-${idx}`}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={active ? '#ffffff' : isTrunk ? '#262626' : '#171717'}
                  strokeWidth={active ? 2.5 : isTrunk ? 2 : 1.5}
                  strokeDasharray={isTrunk ? '4,4' : undefined}
                  className="transition-colors duration-200"
                />
                
                {/* Active pulse */}
                {active && (
                  <line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="4,6"
                    className="animate-pulse"
                  />
                )}
              </g>
            );
          })}

          {/* Animated Packets */}
          {simulationPackets.map((pkt) => {
            const start = deviceMap[pkt.from];
            const end = deviceMap[pkt.to];
            if (!start || !end) return null;

            const currentX = start.x + (end.x - start.x) * pkt.progress;
            const currentY = start.y + (end.y - start.y) * pkt.progress;

            let color = '#ffffff';
            if (pkt.protocol === 'ARP-REQ') color = '#eab308'; // Amber
            if (pkt.protocol === 'ARP-REP') color = '#06b6d4'; // Cyan
            if (pkt.protocol === 'ICMP-REQ') color = '#10b981'; // Green
            if (pkt.protocol === 'ICMP-REP') color = '#34d399'; // Emerald

            return (
              <g key={pkt.id} filter="url(#packetGlowMin)">
                <circle
                  cx={currentX}
                  cy={currentY}
                  r="5"
                  fill={color}
                  stroke="#000000"
                  strokeWidth="1"
                />
                <rect
                  x={currentX - 26}
                  y={currentY - 18}
                  width="52"
                  height="12"
                  rx="3"
                  fill="#0a0a0a"
                  stroke={color}
                  strokeWidth="0.8"
                />
                <text
                  x={currentX}
                  y={currentY - 9}
                  fill={color}
                  fontSize="7.5"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {pkt.protocol}
                </text>
              </g>
            );
          })}

          {/* Device Nodes */}
          {DEVICES.map((dev) => {
            const isSource = sourceNode === dev.id;
            const isDest = destNode === dev.id;
            const isSelected = activeDeviceDetails?.id === dev.id;
            const isSwitch = dev.type === 'switch';
            const isRouter = dev.type === 'router';
            const isServer = dev.type === 'server';

            const width = isSwitch || isRouter || isServer ? 124 : 74;
            const height = isSwitch || isRouter || isServer ? 46 : 50;

            let borderColor = '#262626';
            if (isSource) borderColor = '#06b6d4';
            else if (isDest) borderColor = '#10b981';
            else if (isSelected) borderColor = '#ffffff';

            return (
              <g
                key={dev.id}
                transform={`translate(${dev.x - width / 2}, ${dev.y - height / 2})`}
                className="cursor-pointer group"
                onClick={() => setActiveDeviceDetails(dev)}
              >
                {/* Node Box */}
                <rect
                  x="0"
                  y="0"
                  width={width}
                  height={height}
                  rx="6"
                  fill="#0a0a0a"
                  stroke={borderColor}
                  strokeWidth={isSource || isDest || isSelected ? '1.8' : '1'}
                  className="transition-all duration-150 group-hover:stroke-neutral-400"
                />

                {/* Node Content */}
                <foreignObject x="0" y="0" width={width} height={height}>
                  <div className="w-full h-full p-1.5 flex flex-col justify-between text-left select-none pointer-events-none">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 truncate">
                        {getDeviceIcon(dev.type)}
                        <span className="font-mono font-bold text-[10px] text-white tracking-tight truncate">
                          {dev.id}
                        </span>
                      </div>
                      <span className={`w-1.5 h-1.5 rounded-full ${isSource ? 'bg-cyan-400' : isDest ? 'bg-emerald-400' : 'bg-neutral-600'}`}></span>
                    </div>

                    <div>
                      <div className="text-[9px] font-mono text-neutral-300 font-semibold truncate">
                        {dev.ip}
                      </div>
                      <div className="text-[8px] font-mono text-neutral-500 truncate">
                        {isSwitch ? 'L2 Switch' : isRouter ? 'Gateway' : isServer ? 'DNS/Web' : 'Host PC'}
                      </div>
                    </div>
                  </div>
                </foreignObject>

                {/* Badge for Origen / Destino */}
                {isSource && (
                  <g transform={`translate(${width / 2}, -8)`}>
                    <rect x="-22" y="-6" width="44" height="12" rx="3" fill="#06b6d4" />
                    <text x="0" y="3" fill="#000000" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      ORIGEN
                    </text>
                  </g>
                )}

                {isDest && (
                  <g transform={`translate(${width / 2}, -8)`}>
                    <rect x="-24" y="-6" width="48" height="12" rx="3" fill="#10b981" />
                    <text x="0" y="3" fill="#000000" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      DESTINO
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer bar with tip */}
      <div className="p-2.5 bg-neutral-950 border-t border-neutral-900 flex items-center justify-between text-[11px] font-mono text-neutral-400 px-4">
        <span>💡 Selecciona un equipo emisor y receptor para probar la resolución ARP y Ping ICMP.</span>
        <span className="hidden sm:inline text-neutral-600">Subred: 192.168.1.0/24 (Máscara 255.255.255.0)</span>
      </div>
    </div>
  );
}
