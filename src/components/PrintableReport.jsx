import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Check, Loader2 } from 'lucide-react';
import { DEVICES, COMPARISON_TABLE, NETWORK_MEDIA, ARP_EXPLANATION } from '../data/networkData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PrintableReport() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Genera y descarga directamente el archivo PDF sin abrir la ventana de impresión
  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      const reportElem = document.getElementById('report-document-sheet');
      if (!reportElem) return;

      const canvas = await html2canvas(reportElem, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;

      // Primera página
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      // Páginas adicionales si el documento es largo
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      // Descarga directa del archivo en el navegador
      pdf.save('Informe_Tecnico_Red_LAN_Actividad_Grupal.pdf');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Hubo un error al generar el PDF. Por favor intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (Minimalist Dark) */}
      <div className="bg-black border border-neutral-800 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center space-x-2 font-mono">
            <FileText className="w-4 h-4 text-neutral-400" />
            <span>INFORME TÉCNICO FORMAL & GUÍA DE EXPOSICIÓN</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Descarga directa de los entregables para el profesor y la guía para los 3 integrantes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Botón Descargar Word */}
          <a
            href="/Guia_Exposicion_3_Integrantes.docx"
            download="Guia_Exposicion_3_Integrantes.docx"
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-medium rounded-lg shadow-sm transition-all text-xs font-mono"
            title="Descarga documento de Word con los temas divididos para 3 integrantes"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Guía en Word (.docx)</span>
          </a>

          {/* Botón Descargar PDF Directo */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-neutral-200 text-black font-semibold rounded-lg shadow-sm transition-all text-xs font-mono disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generando PDF...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>¡Descargado!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Informe PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Guide Banner for 3 Team Members */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs font-mono">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800">
          <span className="font-bold text-white uppercase">
            // REPARTO DE EXPOSICIÓN PARA LOS 3 INTEGRANTES (RESUMEN RÁPIDO)
          </span>
          <span className="text-neutral-500 text-[10px]">Documento Word disponible arriba</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-neutral-300">
          <div className="bg-black p-3 rounded border border-neutral-850">
            <span className="text-cyan-400 font-bold block mb-1">INTEGRANTE 1</span>
            <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
              <strong>Tema:</strong> Topología en Estrella Jerárquica, cables Cat6/Cat6A y catálogo de hardware real (Router Cisco ISR 4331, 3 Switches Catalyst, Server Dell y 10 PCs).
            </p>
          </div>
          <div className="bg-black p-3 rounded border border-neutral-850">
            <span className="text-emerald-400 font-bold block mb-1">INTEGRANTE 2</span>
            <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
              <strong>Tema:</strong> Tabla comparativa (Switch Capa 2 vs Módem Capa 1 vs Router Capa 3) y Plan maestro de direccionamiento IP (192.168.1.0/24 estáticas y DHCP).
            </p>
          </div>
          <div className="bg-black p-3 rounded border border-neutral-850">
            <span className="text-amber-400 font-bold block mb-1">INTEGRANTE 3</span>
            <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
              <strong>Tema:</strong> Demostración en vivo en el simulador, explicación técnica del protocolo ARP (RFC 826 Broadcast/Unicast), ICMP Ping y seguridad Port-Security/DAI.
            </p>
          </div>
        </div>
      </div>

      {/* Printable Sheet (Clean Minimalist White Sheet for PDF generation) */}
      <div 
        id="report-document-sheet" 
        className="bg-white text-slate-900 rounded-xl p-8 sm:p-12 shadow-2xl border border-neutral-200 max-w-5xl mx-auto font-sans"
      >
        {/* Cover / Header */}
        <div className="border-b-2 border-slate-900 pb-5 mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-600 font-mono block">
              ACTIVIDAD GRUPAL • INGENIERÍA EN TECNOLOGÍAS DE INFORMACIÓN (ITI)
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              INFORME TÉCNICO: RED LAN EMPRESARIAL Y FUNCIONAMIENTO DE ARP
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Ejercicio Práctico: Armar una red LAN e investigar su funcionamiento completo
            </p>
          </div>
          <div className="text-right text-xs text-slate-700 bg-slate-100 p-2.5 rounded border border-slate-300 shrink-0 font-mono">
            <div><strong>Topología:</strong> Estrella Jerárquica</div>
            <div><strong>Nodos:</strong> 15 Dispositivos Totales</div>
            <div><strong>Subred:</strong> 192.168.1.0/24</div>
          </div>
        </div>

        {/* Index of Topics */}
        <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
          <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-wider font-mono text-[11px]">
            Índice de Contenido
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-700">
            <div>1. Planteamiento del Problema y Justificación</div>
            <div>2. Análisis de Necesidades y Topología de Red (Estrella Jerárquica)</div>
            <div>3. Selección de Medios de Transmisión (Norma ANSI/TIA-568-C.2)</div>
            <div>4. Tabla Comparativa: Switch vs. Módem vs. Router</div>
            <div>5. Catálogo de Componentes de Mercado Real (Velocidad y Costos)</div>
            <div>6. Plan Maestro de Asignación de Direcciones IPv4 y Ethernet</div>
            <div>7. Investigación y Funcionamiento Detallado del Protocolo ARP (RFC 826)</div>
            <div>8. Configuración de Seguridad Cisco IOS y Plan de Mantenimiento</div>
            <div>9. Conclusiones</div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-800 leading-relaxed">
          {/* Section 1 */}
          <section>
            <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 font-mono">
              1. Planteamiento del Problema y Justificación
            </h2>
            <p>
              El presente trabajo describe el diseño e implementación de una <strong>Red de Área Local (LAN)</strong> empresarial que interconecta de manera segura y eficiente <strong>15 dispositivos activos</strong>: 1 Router de Borde (Default Gateway), 3 Switches (1 Switch Core de Distribución y 2 Switches de Acceso departamental), 1 Servidor corporativo centralizado (DNS, Web y Archivos) y 10 computadoras personales de trabajo (PCs).
            </p>
            <p className="mt-2">
              En lugar de limitarse a diagramas estáticos de Packet Tracer, se diseñó e implementó un simulador web interactivo en tiempo real para visualizar con exactitud la propagación de tramas Ethernet, el proceso de difusión broadcast del protocolo <strong>ARP (RFC 826)</strong> y el flujo bidireccional del protocolo <strong>ICMP (Ping)</strong>.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 font-mono">
              2. Análisis de Necesidades y Topología de Red
            </h2>
            <p>
              <strong>Topología Seleccionada: Estrella Jerárquica (Hierarchical Star).</strong>
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
              <li>
                <strong>Capa de Distribución / Core:</strong> Switch central SW-CORE que enlaza el Servidor local y el Router Gateway hacia Internet.
              </li>
              <li>
                <strong>Capa de Acceso:</strong> Switch SW-ACC-01 (conecta las estaciones de trabajo de Ventas) y Switch SW-ACC-02 (conecta las estaciones de Finanzas y RRHH).
              </li>
            </ul>
            <p className="mt-2">
              <strong>Justificación:</strong> La topología en estrella proporciona aislamiento de fallas de cableado (la avería en una PC no interrumpe el resto de la red), microsegmentación de dominios de colisión en cada puerto del switch y alta escalabilidad modular.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 font-mono">
              3. Medios de Transmisión Físicos (Cableado Estructurado)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300 font-mono">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Medio Físico</th>
                    <th className="p-2 border-r border-slate-300">Uso en la Red</th>
                    <th className="p-2 border-r border-slate-300">Velocidad / Ancho de Banda</th>
                    <th className="p-2">Conector y Distancia</th>
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
          <section>
            <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 font-mono">
              4. Tabla Comparativa: Switch vs. Módem vs. Router
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold font-mono">
                  <tr>
                    <th className="p-2 border-r border-slate-300 w-1/4">Característica</th>
                    <th className="p-2 border-r border-slate-300 w-1/4">Switch</th>
                    <th className="p-2 border-r border-slate-300 w-1/4">Módem</th>
                    <th className="p-2 w-1/4">Router</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {COMPARISON_TABLE.map((row, i) => (
                    <tr key={i}>
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300 font-mono text-[11px]">{row.feature}</td>
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
            <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 font-mono">
              5. Catálogo de Componentes de Mercado Real (Velocidad y Costos)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold font-mono">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Host ID</th>
                    <th className="p-2 border-r border-slate-300">Rol</th>
                    <th className="p-2 border-r border-slate-300">Modelo Comercial</th>
                    <th className="p-2 border-r border-slate-300">Velocidad / Interfaces</th>
                    <th className="p-2">Precio USD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {DEVICES.map((d, i) => (
                    <tr key={i}>
                      <td className="p-2 font-bold font-mono border-r border-slate-300">{d.id}</td>
                      <td className="p-2 border-r border-slate-300">{d.role}</td>
                      <td className="p-2 border-r border-slate-300 font-semibold">{d.model}</td>
                      <td className="p-2 font-mono border-r border-slate-300">{d.marketSpeed}</td>
                      <td className="p-2 font-mono font-bold">{d.marketPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 font-mono">
              6. Plan Maestro de Asignación de Direcciones IPv4 y Ethernet
            </h2>
            <p className="mb-2 font-mono text-xs">
              Espacio Lógico: 192.168.1.0/24 | Máscara: 255.255.255.0 | Gateway: 192.168.1.1 | DNS: 192.168.1.10
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300 font-mono">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Dispositivo</th>
                    <th className="p-2 border-r border-slate-300">Dirección MAC (Capa 2)</th>
                    <th className="p-2 border-r border-slate-300">Dirección IPv4 (Capa 3)</th>
                    <th className="p-2 border-r border-slate-300">Máscara</th>
                    <th className="p-2 border-r border-slate-300">Gateway</th>
                    <th className="p-2">Método</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {DEVICES.map((d, i) => (
                    <tr key={i}>
                      <td className="p-2 font-bold border-r border-slate-300">{d.id}</td>
                      <td className="p-2 border-r border-slate-300">{d.mac}</td>
                      <td className="p-2 font-bold border-r border-slate-300 text-blue-900">{d.ip}</td>
                      <td className="p-2 border-r border-slate-300">{d.mask}</td>
                      <td className="p-2 border-r border-slate-300">{d.type === 'router' ? 'N/A' : '192.168.1.1'}</td>
                      <td className="p-2 font-sans">{d.type === 'pc' ? 'DHCP' : 'Estática'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 font-mono">
              7. Explicación y Funcionamiento Detallado del Protocolo ARP (RFC 826)
            </h2>
            <div className="space-y-2 mt-2">
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <strong>1. Verificación de Caché:</strong> El emisor consulta su tabla ARP local (<code>arp -a</code>). Si la MAC no está presente, genera un paquete ARP Request.
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <strong>2. Emisión Broadcast:</strong> La trama se envía con dirección MAC destino <code>FF:FF:FF:FF:FF:FF</code> (difusión general).
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <strong>3. Inundación en el Switch:</strong> El switch de acceso replica la trama por todos sus puertos activos excepto el de entrada.
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <strong>4. Filtrado en Hosts:</strong> Las computadoras con IP distinta descartan el paquete en silencio.
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <strong>5. ARP Reply Unicast:</strong> El host con la IP solicitada responde de forma directa (Unicast) indicando su dirección física MAC.
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <strong>6. Actualización y Transmisión:</strong> El origen registra la MAC en su tabla y envía la trama de datos retenida (ping ICMP).
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 font-mono">
              8. Configuración de Equipos, Seguridad y Plan de Mantenimiento
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-slate-900 mb-1 font-mono text-xs uppercase">Seguridad Aplicada:</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li><strong>Port-Security:</strong> Límite de 1 MAC por puerto de acceso con modo <code>sticky</code>.</li>
                  <li><strong>Deshabilitación de Puertos:</strong> Puertos sobrantes apagados (<code>shutdown</code>).</li>
                  <li><strong>Acceso Cifrado SSH v2:</strong> Prohibido Telnet; autenticación con llaves RSA 2048-bit.</li>
                  <li><strong>Mitigación ARP:</strong> Dynamic ARP Inspection (DAI) y DHCP Snooping.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1 font-mono text-xs uppercase">Mantenimiento:</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li><strong>Preventivo:</strong> Verificación mensual de UPS APC 3000VA y climatización a 20°C.</li>
                  <li><strong>Respaldos:</strong> Copia automatizada de <code>running-config</code> vía servidor TFTP.</li>
                  <li><strong>Correctivo:</strong> Switch en frío preconfigurado para reemplazo en menos de 2 horas.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section className="border-t border-slate-300 pt-3">
            <h2 className="text-base font-bold text-slate-950 mb-1 font-mono">
              9. Conclusiones
            </h2>
            <p>
              El diseño e implementación de esta red demostró de manera empírica que la resolución de direcciones mediante el protocolo ARP es un eslabón fundamental para cualquier comunicación Ethernet. La plataforma web desarrollada sustituye con éxito simuladores cerrados como Cisco Packet Tracer, ofreciendo un entorno visual transparente, interactivo y accesible desde cualquier navegador.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
