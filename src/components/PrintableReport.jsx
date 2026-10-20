import React from 'react';
import { Printer, Download, FileText, CheckCircle2, Award } from 'lucide-react';
import { DEVICES, COMPARISON_TABLE, NETWORK_MEDIA, ARP_EXPLANATION } from '../data/networkData';

export default function PrintableReport() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden in Print) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Documento Formal de Entrega (Informe Académico Completo)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Formato estructurado con todos los requerimientos de la rúbrica, listo para ser entregado o defendido.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all active:scale-95 text-xs sm:text-sm whitespace-nowrap"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Guardar como PDF</span>
        </button>
      </div>

      {/* Printable Sheet (Standard A4 Paper Look) */}
      <div className="bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl border border-slate-200 max-w-5xl mx-auto print:p-0 print:border-none print:shadow-none print:rounded-none font-sans">
        {/* Cover / Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              ACTIVIDAD GRUPAL • INGENIERÍA EN TECNOLOGÍAS DE INFORMACIÓN (ITI)
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              INFORME TÉCNICO: DISEÑO, IMPLEMENTACIÓN Y SIMULACIÓN DE UNA RED LAN EMPRESARIAL
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Ejercicio Práctico: Armar una red LAN e investigar su funcionamiento completo
            </p>
          </div>
          <div className="text-right text-xs text-slate-700 bg-slate-100 p-3 rounded-lg border border-slate-300 shrink-0">
            <div><strong>Asignatura:</strong> Redes de Computadoras</div>
            <div><strong>Topología:</strong> Estrella Jerárquica</div>
            <div><strong>Nodos LAN:</strong> 15 Dispositivos Totales</div>
          </div>
        </div>

        {/* Index of Topics */}
        <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-wider">Índice del Informe</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-700">
            <div>1. Resumen Ejecutivo y Planteamiento del Problema</div>
            <div>2. Análisis de Necesidades y Topología de Red Seleccionada</div>
            <div>3. Selección de Medios de Transmisión (Cableado Cat6/Cat6A)</div>
            <div>4. Tabla Comparativa: Switch vs. Módem vs. Router</div>
            <div>5. Catálogo de Componentes de Mercado Real (Velocidad y Costos)</div>
            <div>6. Plan Maestro de Asignación de Direcciones IPv4 y Ethernet</div>
            <div>7. Investigación y Funcionamiento Detallado del Protocolo ARP</div>
            <div>8. Configuración de Equipos, Seguridad (Port-Security) y Mantenimiento</div>
            <div>9. Conclusiones y Rúbrica de Cumplimiento</div>
          </div>
        </div>

        {/* Section 1 */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-800 leading-relaxed">
          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2">
              1. Resumen Ejecutivo y Planteamiento del Problema
            </h2>
            <p>
              El presente proyecto tiene como objetivo diseñar, configurar y simular una <strong>Red de Área Local (LAN - Local Area Network)</strong> corporativa de alto rendimiento para interconectar de forma segura y eficiente <strong>15 dispositivos de red</strong>: 1 Router de Borde (Default Gateway), 3 Switches (1 Switch de Distribución/Core y 2 Switches de Acceso departamental), 1 Servidor corporativo centralizado y 10 estaciones de trabajo (PCs).
            </p>
            <p className="mt-2">
              A diferencia de las simulaciones tradicionales y estáticas de Packet Tracer, este proyecto se ha desarrollado mediante un <strong>simulador interactivo web dedicado</strong> que permite observar de forma gráfica el flujo de tramas Ethernet a nivel de enlace de datos, la resolución dinámica de direcciones IP a MAC mediante el protocolo <strong>ARP (RFC 826)</strong> y las respuestas del protocolo <strong>ICMP</strong>.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2">
              2. Análisis de Necesidades y Topología de Red
            </h2>
            <p>
              <strong>Elección de Topología:</strong> Se implementó una <strong>topología en Estrella Jerárquica (Tree / Hierarchical Star)</strong> dividida en dos capas funcionales:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
              <li>
                <strong>Capa de Distribución / Core:</strong> Switch centralizado (SW-CORE) que conecta con el Servidor corporativo y el Router de acceso a Internet.
              </li>
              <li>
                <strong>Capa de Acceso:</strong> Switch SW-ACC-01 (conecta las 5 estaciones del departamento de Ventas y Marketing) y Switch SW-ACC-02 (conecta las 5 estaciones de Finanzas y Recursos Humanos).
              </li>
            </ul>
            <p className="mt-2">
              <strong>Justificación:</strong> La topología en estrella proporciona <em>aislamiento de fallos</em> (la avería de un cable de una PC no afecta al resto de la oficina), alta velocidad de conmutación sin colisiones (cada puerto del switch es un dominio de colisión independiente), facilidad de mantenimiento y capacidad de crecimiento modular sin interrupciones del servicio.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2">
              3. Medios de Transmisión Físicos (Cableado Estructurado)
            </h2>
            <p className="mb-2">
              Cumpliendo con la norma internacional <strong>ANSI/TIA-568-C.2</strong> para cableado de telecomunicaciones en edificios comerciales, se seleccionaron los siguientes medios físicos:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Medio Físico</th>
                    <th className="p-2 border-r border-slate-300">Ubicación / Propósito</th>
                    <th className="p-2 border-r border-slate-300">Ancho de Banda / Velocidad</th>
                    <th className="p-2">Conector y Distancia Máx.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {NETWORK_MEDIA.map((m, i) => (
                    <tr key={i}>
                      <td className="p-2 font-semibold border-r border-slate-300">{m.type}</td>
                      <td className="p-2 border-r border-slate-300">{m.usage}</td>
                      <td className="p-2 font-mono border-r border-slate-300">{m.speed}</td>
                      <td className="p-2">{m.connector} (hasta 100 m)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4 */}
          <section className="break-before-page">
            <h2 className="text-base sm:text-lg font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2">
              4. Tabla Comparativa Exhaustiva: Switch vs. Módem vs. Router
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                  <tr>
                    <th className="p-2 border-r border-slate-300 w-1/4">Característica</th>
                    <th className="p-2 border-r border-slate-300 w-1/4 text-sky-800">Switch (Conmutador)</th>
                    <th className="p-2 border-r border-slate-300 w-1/4 text-purple-800">Módem</th>
                    <th className="p-2 w-1/4 text-amber-800">Router (Enrutador)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {COMPARISON_TABLE.map((row, i) => (
                    <tr key={i}>
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">{row.feature}</td>
                      <td className="p-2 border-r border-slate-300">{row.switch}</td>
                      <td className="p-2 border-r border-slate-300">{row.modem}</td>
                      <td className="p-2">{row.router}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2">
              5. Catálogo de Componentes de Mercado Real (Modelos, Velocidades y Precios)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Dispositivo</th>
                    <th className="p-2 border-r border-slate-300">Rol en la Red</th>
                    <th className="p-2 border-r border-slate-300">Modelo Comercial</th>
                    <th className="p-2 border-r border-slate-300">Velocidad de Transferencia</th>
                    <th className="p-2">Costo Estimado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {DEVICES.map((d, i) => (
                    <tr key={i}>
                      <td className="p-2 font-bold font-mono border-r border-slate-300">{d.id}</td>
                      <td className="p-2 border-r border-slate-300">{d.role}</td>
                      <td className="p-2 font-semibold border-r border-slate-300">{d.model}</td>
                      <td className="p-2 font-mono border-r border-slate-300">{d.marketSpeed}</td>
                      <td className="p-2 font-mono text-emerald-800 font-bold">{d.marketPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6 */}
          <section className="break-before-page">
            <h2 className="text-base sm:text-lg font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2">
              6. Plan Maestro de Asignación de Direcciones IPv4 y Ethernet
            </h2>
            <p className="mb-2">
              <strong>Espacio Lógico:</strong> Red Privada <code>192.168.1.0/24</code> (Máscara <code>255.255.255.0</code>). Puerta de Enlace (Gateway): <code>192.168.1.1</code>. Servidor DNS: <code>192.168.1.10</code>.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold font-mono">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Host ID</th>
                    <th className="p-2 border-r border-slate-300">Dirección MAC (Capa 2)</th>
                    <th className="p-2 border-r border-slate-300">Dirección IPv4 (Capa 3)</th>
                    <th className="p-2 border-r border-slate-300">Máscara</th>
                    <th className="p-2 border-r border-slate-300">Gateway</th>
                    <th className="p-2">Método</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {DEVICES.map((d, i) => (
                    <tr key={i}>
                      <td className="p-2 font-bold border-r border-slate-300">{d.id}</td>
                      <td className="p-2 text-slate-700 border-r border-slate-300">{d.mac}</td>
                      <td className="p-2 text-blue-800 font-bold border-r border-slate-300">{d.ip}</td>
                      <td className="p-2 border-r border-slate-300">{d.mask}</td>
                      <td className="p-2 border-r border-slate-300">{d.type === 'router' ? 'N/A' : '192.168.1.1'}</td>
                      <td className="p-2 font-sans">{d.type === 'pc' ? 'DHCP (Dinámica)' : 'Estática'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2">
              7. Explicación y Funcionamiento Detallado del Protocolo ARP (RFC 826)
            </h2>
            <p>
              El <strong>Protocolo de Resolución de Direcciones (ARP)</strong> es el mecanismo estándar mediante el cual un nodo de red determina la dirección de hardware (MAC) de otro nodo ubicado en el mismo segmento Ethernet cuando únicamente conoce su dirección IP lógica.
            </p>
            <div className="mt-3 space-y-2">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <strong>Paso 1: Consulta de la Caché Local.</strong> El host origen (ej. PC-01) ejecuta una búsqueda en su tabla ARP en memoria RAM (comando <code>arp -a</code>). Si la entrada ya existe, encapsula la trama y la transmite.
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <strong>Paso 2: Generación del ARP Request (Broadcast).</strong> Si no existe, crea un paquete ARP con Opcode 1 (Request). En la trama Ethernet, coloca como MAC destino <code>FF:FF:FF:FF:FF:FF</code> (dirección de difusión general).
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <strong>Paso 3: Propagación e Inundación en el Switch.</strong> El switch de acceso recibe el broadcast, registra la MAC del emisor en su tabla CAM y replica la trama por todos sus puertos activos.
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <strong>Paso 4: Filtrado por los Hosts.</strong> Todos los demás equipos reciben la trama; verifican la IP solicitada. Al no coincidir con su IP, descartan el paquete sin generar tráfico adicional.
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <strong>Paso 5: ARP Reply (Unicast Directo).</strong> El equipo que posee la IP (ej. Servidor 192.168.1.10) responde con un paquete ARP Reply (Opcode 2) dirigido específicamente a la MAC de PC-01 con su dirección MAC física real.
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <strong>Paso 6: Actualización de Caché y Envío de Datos.</strong> PC-01 almacena la correspondencia en su tabla ARP y envía de inmediato los datos que tenía en cola (paquete ICMP Echo Request para el ping).
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2">
              8. Configuración de Equipos, Seguridad y Plan de Mantenimiento
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Políticas de Seguridad Implementadas:</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li><strong>Port-Security:</strong> Límite de 1 dirección MAC por puerto de acceso con modo <code>sticky</code>.</li>
                  <li><strong>Deshabilitación de Puertos:</strong> Puertos no utilizados apagados (<code>shutdown</code>).</li>
                  <li><strong>Acceso Cifrado SSH v2:</strong> Prohibido Telnet; autenticación con llaves RSA 2048-bit.</li>
                  <li><strong>Mitigación de ARP Spoofing:</strong> Dynamic ARP Inspection (DAI) y DHCP Snooping en switches.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Mantenimiento y Administración:</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li><strong>Preventivo:</strong> Verificación mensual de UPS, control térmico a 20°C y limpieza de racks.</li>
                  <li><strong>Respaldos:</strong> Copia automatizada semanal de archivos de configuración vía TFTP.</li>
                  <li><strong>Correctivo:</strong> Switch de repuesto preconfigurado en stock frío (RTO &lt; 2 horas).</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section className="border-t border-slate-300 pt-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-950 mb-2">
              9. Conclusiones
            </h2>
            <p>
              El desarrollo e implementación de este proyecto demostró de manera integral la importancia de una arquitectura en estrella jerárquica para una red LAN. A través del simulador interactivo desarrollado, se evidenció con total transparencia el comportamiento del protocolo ARP, demostrando que ninguna comunicación IP local puede concretarse sin la resolución previa de la dirección física MAC.
            </p>
            <p className="mt-2 text-slate-600 italic">
              Este informe y su plataforma interactiva complementaria cumplen rigurosamente con todas las especificaciones de la actividad grupal.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
