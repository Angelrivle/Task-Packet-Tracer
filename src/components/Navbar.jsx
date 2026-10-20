import React from 'react';
import { 
  Network, 
  Activity, 
  Table, 
  Cpu, 
  Binary, 
  ShieldCheck, 
  FileText
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'simulator', label: 'Simulador', icon: Network },
    { id: 'arp-theory', label: 'ARP (RFC 826)', icon: Binary },
    { id: 'comparative', label: 'Switch / Módem / Router', icon: Table },
    { id: 'hardware', label: 'Hardware Real', icon: Cpu },
    { id: 'ip-plan', label: 'Direccionamiento IP', icon: Activity },
    { id: 'security', label: 'Seguridad & Cisco IOS', icon: ShieldCheck },
    { id: 'report', label: 'Informe PDF', icon: FileText, isBadge: true },
  ];

  return (
    <header className="bg-black/90 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Minimalist Typographic Logo (No graphical logo drawing) */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer select-none group"
            onClick={() => setActiveTab('simulator')}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:bg-white transition-colors"></span>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-mono text-sm tracking-widest font-black text-white uppercase">
                NETSIM
              </span>
              <span className="text-neutral-500 font-mono text-xs">/</span>
              <span className="text-neutral-400 font-mono text-xs tracking-wider">LAN.15</span>
            </div>
          </div>

          {/* Desktop Minimalist Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-neutral-900 text-white border border-neutral-700 shadow-sm'
                      : tab.isBadge
                      ? 'text-neutral-300 hover:text-white hover:bg-neutral-900/60 border border-neutral-800'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-70" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action indicator */}
          <div className="hidden lg:flex items-center space-x-2 text-[11px] font-mono text-neutral-500">
            <span>Red LAN 192.168.1.0/24</span>
          </div>
        </div>

        {/* Mobile Tabs Row */}
        <div className="md:hidden flex overflow-x-auto py-2 space-x-1 border-t border-neutral-900 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-neutral-900 text-white border border-neutral-700'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
