import React from 'react';
import { 
  Server, 
  Monitor, 
  Router as RouterIcon, 
  Network as SwitchIcon, 
  HardDrive, 
  Terminal, 
  Info,
  Radio,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DEVICES } from '../data/networkData';

export default function NetworkTopology({ 
  sourceNode, 
  setSourceNode, 
  destNode, 
  setDestNode, 
  currentStep, 
  simulationPackets, 
  onSelectDeviceForTerminal,
  activeDeviceDetails,
  setActiveDeviceDetails
}) {
  // SVG Canvas dimensions
  const viewBoxWidth = 1000;
  const viewBoxHeight = 560;

  // Node lookup map
  const deviceMap = React.useMemo(() => {
    const map = {};
    DEVICES.forEach(d => { map[d.id] = d; });
    return map;
  }, []);

  // Cable links definition
  const links = [
    // Router to Core
    { from: 'R1', to: 'SW-CORE', type: 'uplink', label: 'Gigabit 0/0/0 (1 Gbps)' },
    // Core to Server
    { from: 'SW-CORE', to: 'SRV-01', type: 'server', label: 'Gigabit 0/24 (1 Gbps)' },
    // Core to Access switches (Trunks)
    { from: 'SW-CORE', to: 'SW-ACC-01', type: 'trunk', label: 'Trunk 10G SFP+ / Cat6A' },
    { from: 'SW-CORE', to: 'SW-ACC-02', type: 'trunk', label: 'Trunk 10G SFP+ / Cat6A' },
    // SW-ACC-01 to PCs 1..5
    { from: 'SW-ACC-01', to: 'PC-01', type: 'access', label: 'Fa0/1' },
    { from: 'SW-ACC-01', to: 'PC-02', type: 'access', label: 'Fa0/2' },
    { from: 'SW-ACC-01', to: 'PC-03', type: 'access', label: 'Fa0/3' },
    { from: 'SW-ACC-01', to: 'PC-04', type: 'access', label: 'Fa0/4' },
    { from: 'SW-ACC-01', to: 'PC-05', type: 'access', label: 'Fa0/5' },
    // SW-ACC-02 to PCs 6..10
    { from: 'SW-ACC-02', to: 'PC-06', type: 'access', label: 'Fa0/1' },
    { from: 'SW-ACC-02', to: 'PC-07', type: 'access', label: 'Fa0/2' },
    { from: 'SW-ACC-02', to: 'PC-08', type: 'access', label: 'Fa0/3' },
    { from: 'SW-ACC-02', to: 'PC-09', type: 'access', label: 'Fa0/4' },
    { from: 'SW-ACC-02', to: 'PC-10', type: 'access', label: 'Fa0/5' },
  ];

  // Helper to check if a link is currently transmitting any simulation packet
  const isLinkActive = (fromId, toId) => {
    return simulationPackets.some(p => 
      (p.from === fromId && p.to === toId) || 
      (p.from === toId && p.to === fromId)
    );
  };

  const getDeviceIcon = (type) => {
    switch(type) {
      case 'router':
        return <RouterIcon className="w-5 h-5 text-amber-400" />;
      case 'switch':
        return <SwitchIcon className="w-5 h-5 text-sky-400" />;
      case 'server':
        return <Server className="w-5 h-5 text-purple-400" />;
      case 'pc':
      default:
        return <Monitor className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="relative bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Topology Header & Legend */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-slate-900/70 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-200">Topología LAN Activa</span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">Topología en Estrella Jerárquica (Core & Access)</span>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-slate-400 mt-2 sm:mt-0">
          <div className="flex items-center space-x-1">
            <span className="w-3 h-0.5 bg-amber-400 inline-block"></span>
            <span>ARP Req (B-cast)</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-0.5 bg-cyan-400 inline-block"></span>
            <span>ARP Reply</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-0.5 bg-emerald-400 inline-block"></span>
            <span>ICMP Ping</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas with Interactive Topology */}
      <div className="relative w-full overflow-x-auto bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
        <svg 
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
          className="w-full h-auto min-w-[760px] select-none"
        >
          <defs>
            {/* Cable gradients */}
            <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            
            {/* Filter glow for active packets */}
            <filter id="packetGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
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
                {/* Background cable line */}
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={active ? '#38bdf8' : isTrunk ? '#475569' : '#334155'}
                  strokeWidth={isTrunk ? 3.5 : 2}
                  strokeDasharray={isTrunk ? '4,4' : undefined}
                  className={`transition-all duration-300 ${active ? 'stroke-cyan-400 filter drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]' : ''}`}
                />
                
                {/* Flow animation indicator along active cable */}
                {active && (
                  <line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke="#ffffff"
                    strokeWidth={isTrunk ? 4 : 2.5}
                    strokeDasharray="6,8"
                    className="animate-pulse"
                    opacity="0.9"
                  />
                )}
              </g>
            );
          })}

          {/* Animated packets moving between devices */}
          {simulationPackets.map((pkt) => {
            const start = deviceMap[pkt.from];
            const end = deviceMap[pkt.to];
            if (!start || !end) return null;

            // Compute current interpolated position based on progress (0 to 1)
            const currentX = start.x + (end.x - start.x) * pkt.progress;
            const currentY = start.y + (end.y - start.y) * pkt.progress;

            let color = '#38bdf8';
            if (pkt.protocol === 'ARP-REQ') color = '#fbbf24'; // Yellow
            if (pkt.protocol === 'ARP-REP') color = '#06b6d4'; // Cyan
            if (pkt.protocol === 'ICMP-REQ') color = '#10b981'; // Green
            if (pkt.protocol === 'ICMP-REP') color = '#34d399'; // Emerald

            return (
              <g key={pkt.id} filter="url(#packetGlow)">
                {/* Outer ripple */}
                <circle
                  cx={currentX}
                  cy={currentY}
                  r="12"
                  fill={color}
                  opacity="0.25"
                  className="animate-ping"
                />
                {/* Inner packet dot */}
                <circle
                  cx={currentX}
                  cy={currentY}
                  r="6"
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                {/* Packet label pill */}
                <rect
                  x={currentX - 28}
                  y={currentY - 20}
                  width="56"
                  height="14"
                  rx="4"
                  fill="#0f172a"
                  stroke={color}
                  strokeWidth="1"
                />
                <text
                  x={currentX}
                  y={currentY - 10}
                  fill={color}
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {pkt.protocol}
                </text>
              </g>
            );
          })}

          {/* Nodes (Devices) */}
          {DEVICES.map((dev) => {
            const isSource = sourceNode === dev.id;
            const isDest = destNode === dev.id;
            const isSelected = activeDeviceDetails?.id === dev.id;
            const isSwitch = dev.type === 'switch';
            const isRouter = dev.type === 'router';
            const isServer = dev.type === 'server';

            const width = isSwitch || isRouter || isServer ? 130 : 76;
            const height = isSwitch || isRouter || isServer ? 50 : 54;

            return (
              <g
                key={dev.id}
                transform={`translate(${dev.x - width / 2}, ${dev.y - height / 2})`}
                className="cursor-pointer group"
                onClick={() => setActiveDeviceDetails(dev)}
              >
                {/* Selection / Role glow border */}
                <rect
                  x="-2"
                  y="-2"
                  width={width + 4}
                  height={height + 4}
                  rx="10"
                  fill="none"
                  stroke={
                    isSource
                      ? '#38bdf8'
                      : isDest
                      ? '#10b981'
                      : isSelected
                      ? '#f59e0b'
                      : 'transparent'
                  }
                  strokeWidth="2.5"
                  className={isSource || isDest ? 'animate-pulse' : ''}
                />

                {/* Device Card Body */}
                <rect
                  x="0"
                  y="0"
                  width={width}
                  height={height}
                  rx="8"
                  fill="#0f172a"
                  stroke={
                    isRouter 
                      ? '#d97706' 
                      : isSwitch 
                      ? '#0284c7' 
                      : isServer 
                      ? '#7c3aed' 
                      : '#334155'
                  }
                  strokeWidth="1.5"
                  className="transition-all duration-200 group-hover:fill-slate-800"
                />

                {/* Role Pill Header */}
                <foreignObject x="0" y="0" width={width} height={height}>
                  <div className="w-full h-full p-1.5 flex flex-col justify-between text-left select-none pointer-events-none">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 overflow-hidden">
                        {getDeviceIcon(dev.type)}
                        <span className="font-bold text-[10px] text-slate-100 truncate">
                          {dev.id}
                        </span>
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    </div>

                    <div>
                      <div className="text-[9px] font-mono text-cyan-400 font-medium truncate">
                        {dev.ip}
                      </div>
                      <div className="text-[8px] text-slate-400 truncate">
                        {isSwitch ? `${dev.macTable?.length || 0} MACs` : dev.name.split('(')[0]}
                      </div>
                    </div>
                  </div>
                </foreignObject>

                {/* Quick Action Badges on hover */}
                {isSource && (
                  <g transform={`translate(${width / 2}, -10)`}>
                    <rect x="-24" y="-8" width="48" height="14" rx="4" fill="#0284c7" />
                    <text x="0" y="2" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                      ORIGEN
                    </text>
                  </g>
                )}

                {isDest && (
                  <g transform={`translate(${width / 2}, -10)`}>
                    <rect x="-26" y="-8" width="52" height="14" rx="4" fill="#059669" />
                    <text x="0" y="2" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                      DESTINO
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Quick Select & Interactive Action Bar */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-medium">Emisor (Origen):</span>
            <select
              value={sourceNode}
              onChange={(e) => setSourceNode(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
            >
              {DEVICES.filter(d => d.type === 'pc' || d.type === 'server').map(d => (
                <option key={d.id} value={d.id}>
                  {d.id} - {d.name} ({d.ip})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-medium">Receptor (Destino):</span>
            <select
              value={destNode}
              onChange={(e) => setDestNode(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
            >
              {DEVICES.map(d => (
                <option key={d.id} value={d.id} disabled={d.id === sourceNode}>
                  {d.id} - {d.name} ({d.ip})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {activeDeviceDetails && (
            <button
              onClick={() => onSelectDeviceForTerminal(activeDeviceDetails)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-200 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Abrir CLI: {activeDeviceDetails.id}</span>
            </button>
          )}

          <div className="text-[11px] text-slate-400 hidden sm:block">
            💡 Haz clic en cualquier nodo para ver sus detalles o abrir su terminal
          </div>
        </div>
      </div>
    </div>
  );
}
