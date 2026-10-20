import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Zap, 
  Trash2,
  Clock
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
  onClearArpTables
}) {
  return (
    <div className="bg-black border border-neutral-800 rounded-xl p-4 shadow-2xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Main Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {!isRunning ? (
            <button
              onClick={() => onStart(false)}
              className="flex items-center space-x-2 px-5 py-2 bg-white hover:bg-neutral-200 text-black font-semibold rounded-lg shadow-sm transition-all active:scale-95 text-xs font-mono"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>{currentStepIndex > 0 ? 'Continuar' : 'Simular ARP + Ping'}</span>
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex items-center space-x-2 px-5 py-2 bg-neutral-200 hover:bg-white text-black font-semibold rounded-lg shadow-sm transition-all active:scale-95 text-xs font-mono"
            >
              <Pause className="w-3.5 h-3.5 fill-black" />
              <span>Pausar</span>
            </button>
          )}

          {/* Direct Ping button */}
          <button
            onClick={() => onStart(true)}
            title="Envía ping directo cuando las MACs ya están aprendidas en caché"
            className="flex items-center space-x-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-lg transition-all text-xs font-mono"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ping Directo (ICMP)</span>
          </button>

          {/* Next Step */}
          <button
            onClick={onNextStep}
            disabled={isRunning}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg border transition-all text-xs font-mono ${
              isRunning 
                ? 'bg-neutral-950 text-neutral-600 border-neutral-800 cursor-not-allowed' 
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-700'
            }`}
          >
            <SkipForward className="w-3.5 h-3.5 text-neutral-300" />
            <span>Paso a Paso</span>
          </button>

          {/* Reset button */}
          <button
            onClick={onReset}
            className="flex items-center space-x-1 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-all text-xs font-mono"
            title="Reiniciar animación"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>

          {/* Clear Cache */}
          <button
            onClick={onClearArpTables}
            className="flex items-center space-x-1 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-rose-400 rounded-lg transition-all text-xs font-mono"
            title="Vaciar tabla ARP para obligar a un nuevo broadcast"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vaciar ARP</span>
          </button>
        </div>

        {/* Speed & Mode toggles */}
        <div className="flex items-center space-x-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-neutral-800 text-xs">
          {/* Speed Pills */}
          <div className="flex items-center space-x-1 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800">
            <Clock className="w-3.5 h-3.5 text-neutral-500 ml-1.5 mr-0.5" />
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  speed === s
                    ? 'bg-white text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Step mode toggle */}
          <label className="flex items-center space-x-2 cursor-pointer select-none text-xs text-neutral-400 hover:text-neutral-200">
            <input
              type="checkbox"
              checked={stepMode}
              onChange={(e) => setStepMode(e.target.checked)}
              className="rounded bg-neutral-900 border-neutral-700 text-white focus:ring-0"
            />
            <span>Pausar en cada paso</span>
          </label>
        </div>
      </div>

      {/* High-Contrast Explanation Banner */}
      {currentStepData && (
        <div className="mt-4 pt-3.5 border-t border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2.5">
              <span className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-700 font-mono text-[10px] uppercase tracking-wider">
                Paso {currentStepIndex + 1} de {totalSteps}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white">
                {currentStepData.title}
              </span>
            </div>
            
            <span className="font-mono text-[11px] text-emerald-400">
              {currentStepData.protocol}
            </span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-3 rounded-lg border border-neutral-800/80 font-sans">
            {currentStepData.description}
          </p>
        </div>
      )}
    </div>
  );
}
