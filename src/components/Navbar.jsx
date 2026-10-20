import React from 'react';
import { 
  Network, 
  Activity, 
  Table, 
  Cpu, 
  Binary, 
  ShieldCheck, 
  FileText, 
  BookOpen,
  ExternalLink
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'simulator', label: 'Simulador LAN', icon: Network },
    { id: 'arp-theory', label: 'Protocolo ARP', icon: Binary },
    { id: 'comparative', label: 'Switch vs Modem vs Router', icon: Table },
    { id: 'hardware', label: 'Hardware de Mercado', icon: Cpu },
    { id: 'ip-plan', label: 'Plan de Direccionamiento', icon: Activity },
    { id: 'security', label: 'Seguridad & Mantenimiento', icon: ShieldCheck },
    { id: 'report', label: 'Informe para Entrega (PDF)', icon: FileText, highlight: true },
  ];

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('simulator')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-bold">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  NetSim Pro LAN
                </span>
                <span className="bg-cyan-950 text-cyan-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-cyan-700/50">
                  Actividad Grupal
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Simulador Interactivo de Red Ethernet & Informe Técnico
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? tab.highlight 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm' 
                        : 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-sm shadow-sky-500/10'
                      : tab.highlight
                        ? 'text-emerald-400/90 hover:bg-emerald-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile & Tablet Nav Row */}
        <div className="lg:hidden flex overflow-x-auto py-2 space-x-1 border-t border-slate-800/60 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
