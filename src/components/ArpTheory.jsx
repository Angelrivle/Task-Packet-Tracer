import React, { useState } from 'react';
import { 
  Binary, 
  Layers, 
  ShieldAlert, 
  ShieldCheck 
} from 'lucide-react';
import { ARP_EXPLANATION } from '../data/networkData';

export default function ArpTheory() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-black border border-neutral-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
              Requerimiento de la Consigna: Explicación de ARP
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
              Investigación y Funcionamiento del Protocolo ARP (RFC 826)
            </h2>
            <p className="text-neutral-400 text-xs md:text-sm mt-2 max-w-3xl leading-relaxed">
              El <strong>Address Resolution Protocol (ARP)</strong> traduce direcciones lógicas IPv4 (Capa 3 de Red)
              en direcciones físicas MAC (Capa 2 de Enlace de Datos). Sin ARP, ninguna tarjeta Ethernet sabría a qué
              hardware físico enviar la trama dentro de la red local.
            </p>
          </div>

          <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 text-center font-mono text-xs">
            <span className="text-[10px] text-neutral-500 uppercase">Consulta ARP</span>
            <span className="text-sm font-bold text-white mt-1 block">
              "¿Quién tiene la IP X? Díselo a mi MAC"
            </span>
          </div>
        </div>
      </div>

      {/* Why ARP is Essential */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black border border-neutral-800 rounded-xl p-5 shadow-lg">
          <h3 className="font-mono font-bold text-white text-xs uppercase mb-2">
            // ¿POR QUÉ ES INDISPENSABLE EN ETHERNET?
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Las aplicaciones trabajan con direcciones IP (ej. <code>192.168.1.10</code>). Sin embargo, <strong>los cables y las tarjetas de red (NIC) conmutan tramas utilizando direcciones físicas MAC de 48 bits</strong>.
          </p>
          <p className="text-xs text-neutral-400 leading-relaxed mt-2">
            ARP es el protocolo encargado de consultar dinámicamente qué MAC corresponde a qué IP antes de poder ensamblar la trama Ethernet y emitirla por el cable.
          </p>
        </div>

        <div className="bg-black border border-neutral-800 rounded-xl p-5 shadow-lg">
          <h3 className="font-mono font-bold text-white text-xs uppercase mb-2">
            // LA MEMORIA CACHÉ ARP (ARP TABLE)
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Para evitar la saturación de la red con broadcasts constantes, cada equipo almacena en RAM las respuestas aprendidas en su tabla ARP.
          </p>
          <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800 mt-2 font-mono text-xs text-neutral-300">
            <div className="text-neutral-500 mb-0.5"># Inspeccionar tabla en Windows o Linux:</div>
            <div className="text-white font-bold">$ arp -a</div>
            <div className="text-neutral-400 text-[11px] mt-1">
              192.168.1.10&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00-1a-2b-3c-6d-01&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dinámico
            </div>
          </div>
        </div>
      </div>

      {/* Step by step interactive lifecycle */}
      <div className="bg-black border border-neutral-800 rounded-xl p-6 shadow-xl">
        <h3 className="font-mono font-bold text-white text-xs uppercase mb-4">
          // CICLO DE VIDA COMPLETO DE UNA RESOLUCIÓN ARP (PASO A PASO)
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Step buttons */}
          <div className="space-y-1.5 font-mono text-xs">
            {ARP_EXPLANATION.steps.map((st, idx) => (
              <button
                key={st.num}
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start space-x-2.5 ${
                  activeStep === idx
                    ? 'bg-neutral-900 border-white text-white font-semibold'
                    : 'bg-black border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-950'
                }`}
              >
                <span className={`w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold shrink-0 ${
                  activeStep === idx ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-300'
                }`}>
                  {st.num}
                </span>
                <span className="line-clamp-2 text-xs">{st.title}</span>
              </button>
            ))}
          </div>

          {/* Step Detail */}
          <div className="lg:col-span-2 bg-neutral-950 border border-neutral-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">
                Fase {ARP_EXPLANATION.steps[activeStep].num} de 6
              </span>
              <h4 className="text-base font-bold text-white mb-2">
                {ARP_EXPLANATION.steps[activeStep].title}
              </h4>
              <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                {ARP_EXPLANATION.steps[activeStep].desc}
              </p>

              <div className="mt-5 p-3 rounded-lg bg-black border border-neutral-800 font-mono text-xs">
                <div className="text-neutral-500 text-[10px] uppercase mb-1.5 flex justify-between">
                  <span>Estructura de la trama en esta fase:</span>
                  <span className="text-white">
                    {activeStep === 1 || activeStep === 2 ? 'ARP Request (Broadcast)' : activeStep === 4 ? 'ARP Reply (Unicast)' : 'Evaluación Local'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300">
                  <div>
                    <span className="text-neutral-500">MAC Destino: </span>
                    <span className={activeStep === 1 || activeStep === 2 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                      {activeStep === 1 || activeStep === 2 ? 'FF:FF:FF:FF:FF:FF' : '00:50:56:A1:01:01'}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500">EtherType: </span>
                    <span className="text-white">0x0806 (ARP)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-900 font-mono text-xs">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep(prev => prev - 1)}
                className="px-3 py-1 rounded bg-neutral-900 text-neutral-300 disabled:opacity-30 hover:bg-neutral-800"
              >
                ← Anterior
              </button>
              <span className="text-neutral-500">{activeStep + 1} / 6</span>
              <button
                disabled={activeStep === 5}
                onClick={() => setActiveStep(prev => prev + 1)}
                className="px-3 py-1 rounded bg-white text-black font-semibold disabled:opacity-30 hover:bg-neutral-200"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security: ARP Poisoning */}
      <div className="bg-black border border-neutral-800 rounded-xl p-6 shadow-xl">
        <h3 className="font-mono font-bold text-white text-xs uppercase mb-3">
          // SEGURIDAD ARP: AMENAZA Y MITIGACIÓN EN SWITCHES
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
            <h4 className="font-bold text-rose-400 text-xs font-mono uppercase mb-1">
              Ataque: ARP Poisoning / Man-in-the-Middle
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Un host malicioso emite respuestas gratuitas (Gratuitous ARP) falsas asegurando poseer la IP del Router Gateway (192.168.1.1). La víctima actualiza su tabla ARP y todo su tráfico de Internet se desvía al atacante.
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
            <h4 className="font-bold text-emerald-400 text-xs font-mono uppercase mb-1">
              Defensa: Dynamic ARP Inspection (DAI)
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Los switches Cisco Catalyst del proyecto validan cada paquete ARP entrante contra la base de datos de <em>DHCP Snooping</em>. Si la IP no corresponde con la MAC registrada en el puerto, el switch descarta la trama automáticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
