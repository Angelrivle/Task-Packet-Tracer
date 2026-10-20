import React, { useState } from 'react';
import { 
  Binary, 
  HelpCircle, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  ShieldAlert, 
  ShieldCheck, 
  Terminal,
  Radio,
  FileCode
} from 'lucide-react';
import { ARP_EXPLANATION } from '../data/networkData';

export default function ArpTheory() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-cyan-400 font-mono text-xs font-semibold tracking-wider uppercase">
                Requerimiento Crítico de la Tarea
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 text-[10px] font-mono">
                RFC 826
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100 mt-1">
              Investigación y Funcionamiento Completo del Protocolo ARP
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-3xl leading-relaxed">
              El <strong>Protocolo de Resolución de Direcciones (Address Resolution Protocol - ARP)</strong> es el
              puente indispensable que enlaza el mundo lógico del direccionamiento IP (Capa 3 de Red) con el mundo
              físico del cableado Ethernet y las tarjetas de red (Capa 2 de Enlace de Datos).
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center min-w-[200px]">
            <span className="text-xs text-slate-500 block uppercase font-mono">Pregunta Central de ARP</span>
            <span className="text-sm font-bold text-amber-400 mt-1 block">
              "¿Quién tiene la IP X? Díselo a mi MAC"
            </span>
          </div>
        </div>
      </div>

      {/* Why ARP is Essential */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h3 className="font-bold text-slate-100 text-base mb-2 flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <span>¿Por qué existe y por qué no basta con la IP?</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Una computadora o aplicación web conoce la dirección IP lógica a la que desea comunicarse (ej. <code>192.168.1.10</code>). Sin embargo, <strong>a nivel físico en el cable de red y en los chips Ethernet, los routers y switches no transmiten IPs directas: transmiten tramas Ethernet</strong>.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed mt-2">
            Cada trama Ethernet requiere obligatoriamente una dirección física MAC de 48 bits de origen y de destino grabada en la tarjeta de red (NIC). Sin ARP, el equipo emisor sabría a qué IP enviar, pero su tarjeta de red <strong>no sabría qué dirección MAC de destino estampar en la cabecera Ethernet</strong>, haciendo imposible la transmisión física.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h3 className="font-bold text-slate-100 text-base mb-2 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>La Memoria Caché ARP (ARP Cache)</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Para no saturar la red Ethernet enviando mensajes broadcast cada milisegundo, cada sistema operativo (Windows, Linux, Cisco IOS) mantiene una <strong>tabla temporal en memoria RAM</strong> llamada Caché ARP.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mt-3 font-mono text-xs text-slate-300">
            <div className="text-slate-500 mb-1"># Ver la tabla en consola Windows / Linux:</div>
            <div className="text-emerald-400 font-bold">$ arp -a</div>
            <div className="text-slate-400 text-[11px] mt-1">
              Dirección IP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dirección física (MAC)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tipo<br/>
              192.168.1.10&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00-1a-2b-3c-6d-01&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dinámica
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            *Las entradas dinámicas expiran automáticamente (TTL típico: 2 a 10 minutos) si no hay tráfico reciente.
          </p>
        </div>
      </div>

      {/* Interactive Step-by-Step Flow */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center space-x-2">
          <Binary className="w-5 h-5 text-cyan-400" />
          <span>Ciclo de Vida de una Resolución ARP (Paso a Paso)</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Step Selector Buttons */}
          <div className="space-y-2">
            {ARP_EXPLANATION.steps.map((st, idx) => (
              <button
                key={st.num}
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-start space-x-3 ${
                  activeStep === idx
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 font-semibold shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                  activeStep === idx ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}>
                  {st.num}
                </span>
                <span className="line-clamp-2">{st.title}</span>
              </button>
            ))}
          </div>

          {/* Active Step Detailed Explanation */}
          <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-semibold mb-2">
                <span>FASE #{ARP_EXPLANATION.steps[activeStep].num} DE 6</span>
              </div>
              <h4 className="text-lg font-bold text-slate-100 mb-3">
                {ARP_EXPLANATION.steps[activeStep].title}
              </h4>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {ARP_EXPLANATION.steps[activeStep].desc}
              </p>

              {/* Technical Frame Spec */}
              <div className="mt-5 p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
                <div className="text-slate-400 font-bold mb-2 text-[11px] flex items-center justify-between">
                  <span>ESTRUCTURA DE TRAMA EN ESTE PASO:</span>
                  <span className="text-cyan-400">
                    {activeStep === 1 || activeStep === 2 ? 'ARP Request (Opcode 1)' : activeStep === 4 ? 'ARP Reply (Opcode 2)' : 'Inspección Interna'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-500">Ethernet MAC Destino: </span>
                    <span className={activeStep === 1 || activeStep === 2 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {activeStep === 1 || activeStep === 2 ? 'FF:FF:FF:FF:FF:FF (Broadcast)' : '00:50:56:A1:01:01 (Unicast)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">EtherType: </span>
                    <span className="text-indigo-400">0x0806 (ARP)</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Hardware Type: </span>
                    <span>1 (Ethernet 10/100/1000)</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Protocol Type: </span>
                    <span>0x0800 (IPv4)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/80">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep(prev => prev - 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700"
              >
                ← Paso Anterior
              </button>
              <span className="text-xs text-slate-500 font-mono">{activeStep + 1} / 6</span>
              <button
                disabled={activeStep === 5}
                onClick={() => setActiveStep(prev => prev + 1)}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 text-slate-950 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-500"
              >
                Paso Siguiente →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security: ARP Spoofing and Protection */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span>Vulnerabilidad Crítica de ARP y Medidas de Seguridad Corporativa</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Dado que el protocolo ARP original fue diseñado en 1982 sin autenticación, es vulnerable por naturaleza.
          A continuación se explica la amenaza y cómo los switches de este proyecto la mitigan:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4">
            <h4 className="font-bold text-rose-300 text-sm mb-1">
              Ataque: ARP Spoofing / ARP Poisoning
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Un atacante en la red LAN envía respuestas falsas no solicitadas (Gratuitous ARP Reply) a una víctima, alegando falsamente que la IP de la Puerta de Enlace (192.168.1.1) tiene la dirección MAC del atacante. La víctima actualiza su caché ARP y todo su tráfico de Internet se redirige al atacante (Ataque Man-in-the-Middle).
            </p>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4">
            <h4 className="font-bold text-emerald-300 text-sm mb-1">
              Solución Empresarial: Dynamic ARP Inspection (DAI) & DHCP Snooping
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              En switches gestionables (como el Cisco Catalyst 2960 de nuestra topología), se activa <strong>DHCP Snooping</strong> para crear una base de datos segura de IPs asignadas a cada puerto MAC. Luego, <strong>DAI</strong> intercepta todos los paquetes ARP en los puertos de acceso e invalida y descarta cualquier paquete ARP cuya MAC no coincida con el enlace real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
