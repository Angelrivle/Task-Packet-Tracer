import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Zap, 
  Settings2,
  Trash2,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';

export default function SimulationControls({
  isRunning,
  onStart,
  onPause,
  onReset,
  onNextStep,
  stepMode,
  setStepMode,
  speed,
  setSpeed,
  currentStepData,
  totalSteps,
  currentStepIndex,
  onClearArpTables,
  hasArpEntry
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Playback & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {!isRunning ? (
            <button
              onClick={() => onStart(false)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-sky-500/25 transition-all active:scale-95 text-xs sm:text-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{currentStepIndex > 0 ? 'Reanudar' : 'Simular ARP + Ping'}</span>
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex items-center space-x-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 text-xs sm:text-sm"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pausar</span>
            </button>
          )}

          {/* Quick Direct Ping (If ARP is already resolved) */}
          <button
            onClick={() => onStart(true)}
            title="Envía ping directo asumiendo que las MACs ya están en caché"
            className="flex items-center space-x-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl transition-all text-xs font-medium"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Ping Directo (ICMP)</span>
            <span className="sm:hidden">Ping</span>
          </button>

          {/* Step forward */}
          <button
            onClick={onNextStep}
            disabled={isRunning}
            className={`flex items-center space-x-1.5 px-3 py-2.5 rounded-xl border transition-all text-xs font-medium ${
              isRunning 
                ? 'bg-slate-800/40 text-slate-600 border-slate-800 cursor-not-allowed' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <SkipForward className="w-4 h-4 text-cyan-400" />
            <span>Paso a Paso</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="flex items-center space-x-1 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl transition-all text-xs"
            title="Reiniciar animación"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">Reiniciar</span>
          </button>

          {/* Clear ARP Cache */}
          <button
            onClick={onClearArpTables}
            className="flex items-center space-x-1 px-3 py-2.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 rounded-xl transition-all text-xs"
            title="Vaciar tabla ARP para forzar un nuevo Broadcast"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden md:inline">Vaciar Caché ARP</span>
          </button>
        </div>

        {/* Speed & Mode controls */}
        <div className="flex items-center space-x-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800 text-xs">
          {/* Speed selector */}
          <div className="flex items-center space-x-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <Clock className="w-3.5 h-3.5 text-slate-400 ml-1" />
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors ${
                  speed === s
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Step mode toggle */}
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={stepMode}
              onChange={(e) => setStepMode(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span className="text-slate-300 text-xs">Pausar en cada paso</span>
          </label>
        </div>
      </div>

      {/* Progress & Explanation Banner */}
      {currentStepData && (
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 text-cyan-400 font-mono text-[11px] font-semibold">
                Paso {currentStepIndex + 1} de {totalSteps}
              </span>
              <span className="text-sm font-semibold text-slate-200">
                {currentStepData.title}
              </span>
            </div>
            
            <div className="flex items-center space-x-1.5 text-xs text-slate-400">
              <span className="font-mono text-[11px] text-cyan-300">{currentStepData.protocol}</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-sans">
            {currentStepData.description}
          </p>
        </div>
      )}
    </div>
  );
}
