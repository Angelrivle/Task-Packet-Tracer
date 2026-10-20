import React, { useState } from 'react';
import { Download, FileText, Check, Loader2 } from 'lucide-react';
import { DEVICES, COMPARISON_TABLE, NETWORK_MEDIA, ARP_EXPLANATION } from '../data/networkData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PrintableReport() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Genera y descarga el PDF página por página evitando cualquier corte de texto o tablas
  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      const pageElements = document.querySelectorAll('.pdf-a4-page');
      if (!pageElements || pageElements.length === 0) return;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i];

        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 1024,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.96);

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }

      // Generar nombre con fecha y hora actual (formato seguro para Windows/SO)
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      // En sistemas operativos no se permite '/' ni ':', usamos guiones y puntos equivalentes
      const fileName = `test_${day}-${month}-${year}_${hours}-${minutes}.pdf`;

      pdf.save(fileName);
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
      <div className="bg-black border border-neutral-800 rounded-xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center space-x-2 font-mono">
            <FileText className="w-4 h-4 text-neutral-400" />
            <span>INFORME TÉCNICO FORMAL (ENTREGA ACADÉMICA)</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Documento maquetado en páginas A4 independientes. Cero cortes de filas o textos.
          </p>
        </div>

        {/* Botón Descargar PDF Directo */}
        <button
          onClick={handleDownloadPdf}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-neutral-200 text-black font-semibold rounded-lg shadow-sm transition-all text-xs font-mono disabled:opacity-50 shrink-0"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generando PDF...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>¡PDF Descargado!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Informe PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Container of Individual A4 Pages (Each page is a dedicated, unclipped A4 sheet) */}
      <div id="report-document-sheet" className="space-y-8 max-w-4xl mx-auto">
        
        {/* ================= PÁGINA 1: PORTADA, ÍNDICE Y TOPOLOGÍA ================= */}
        <div className="pdf-a4-page bg-white text-slate-900 p-10 sm:p-12 shadow-2xl border border-neutral-300 rounded-xl font-sans min-h-[1100px] flex flex-col justify-between">
          <div>
            {/* Header / Cover */}
            <div className="border-b-2 border-slate-900 pb-5 mb-6 flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-600 font-mono block">
                  ACTIVIDAD GRUPAL • INGENIERÍA EN TECNOLOGÍAS DE INFORMACIÓN (ITI)
                </span>
                <h1 className="text-2xl font-black text-slate-950 mt-1 uppercase tracking-tight">
                  INFORME TÉCNICO: RED LAN EMPRESARIAL Y FUNCIONAMIENTO DE ARP
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  Ejercicio Práctico: Armar una red LAN e investigar su funcionamiento completo
                </p>
              </div>
              <div className="text-right text-[11px] text-slate-700 bg-slate-100 p-2.5 rounded border border-slate-300 shrink-0 font-mono">
                <div><strong>Topología:</strong> Estrella Jerárquica</div>
                <div><strong>Nodos:</strong> 15 Dispositivos Totales</div>
                <div><strong>Subred:</strong> 192.168.1.0/24</div>
              </div>
            </div>

            {/* Índice */}
            <div className="mb-6 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <h3 className="font-bold text-slate-900 mb-1.5 uppercase tracking-wider font-mono text-[10px]">
                Índice de Contenido
              </h3>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700">
                <div>1. Planteamiento del Problema y Justificación</div>
                <div>2. Análisis de Necesidades y Topología de Red</div>
                <div>3. Medios de Transmisión (Norma ANSI/TIA-568-C)</div>
                <div>4. Tabla Comparativa: Switch vs. Módem vs. Router</div>
                <div>5. Catálogo de Hardware Real de Mercado</div>
                <div>6. Plan Maestro de Direccionamiento IPv4 y MAC</div>
                <div>7. Investigación y Funcionamiento de ARP (RFC 826)</div>
                <div>8. Configuración Cisco IOS, Seguridad y Mantenimiento</div>
              </div>
            </div>

            {/* Sección 1 */}
            <div className="space-y-5 text-xs text-slate-800 leading-relaxed">
              <section>
                <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 font-mono">
                  1. Planteamiento del Problema y Justificación
                </h2>
                <p>
                  El presente trabajo describe el diseño e implementación de una <strong>Red de Área Local (LAN)</strong> empresarial que interconecta de manera segura y eficiente <strong>15 dispositivos activos</strong>: 1 Router de Borde (Default Gateway), 3 Switches (1 Switch Core de Distribución y 2 Switches de Acceso departamental), 1 Servidor corporativo centralizado (DNS, Web y Archivos) y 10 computadoras personales de trabajo (PCs).
                </p>
                <p className="mt-2">
                  En lugar de limitarse a diagramas estáticos de Packet Tracer, se diseñó e implementó un simulador web interactivo en tiempo real para visualizar con exactitud la propagación de tramas Ethernet, el proceso de difusión broadcast del protocolo <strong>ARP (RFC 826)</strong> y el flujo bidireccional del protocolo <strong>ICMP (Ping)</strong>.
                </p>
              </section>

              {/* Sección 2 */}
              <section>
                <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 font-mono">
                  2. Análisis de Necesidades y Topología de Red
                </h2>
                <p>
                  <strong>Topología Seleccionada: Estrella Jerárquica (Hierarchical Star).</strong>
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1.5 pl-2">
                  <li>
                    <strong>Capa de Distribución / Core:</strong> Switch central SW-CORE que enlaza el Servidor local y el Router Gateway hacia Internet.
                  </li>
                  <li>
                    <strong>Capa de Acceso:</strong> Switch SW-ACC-01 (conecta las 5 estaciones de trabajo de Ventas) y Switch SW-ACC-02 (conecta las 5 estaciones de Finanzas y RRHH).
                  </li>
                </ul>
                <p className="mt-2">
                  <strong>Justificación:</strong> La topología en estrella proporciona aislamiento de fallas de cableado (la avería en una PC no interrumpe el resto de la red), microsegmentación de dominios de colisión en cada puerto del switch y alta escalabilidad modular.
                </p>
              </section>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 text-right text-[10px] text-slate-400 font-mono">
            Página 1 de 5
          </div>
        </div>

        {/* ================= PÁGINA 2: CABLES Y TABLA COMPARATIVA ================= */}
        <div className="pdf-a4-page bg-white text-slate-900 p-10 sm:p-12 shadow-2xl border border-neutral-300 rounded-xl font-sans min-h-[1100px] flex flex-col justify-between">
          <div className="space-y-6">
            {/* Sección 3 */}
            <section>
              <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 font-mono">
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

            {/* Sección 4: Tabla Comparativa */}
            <section>
              <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 font-mono">
                4. Tabla Comparativa: Switch vs. Módem vs. Router
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] border border-slate-300">
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
                        <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300 font-mono text-[10px]">{row.feature}</td>
                        <td className="p-2 border-r border-slate-300">{row.switch}</td>
                        <td className="p-2 border-r border-slate-300">{row.modem}</td>
                        <td className="p-2">{row.router}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="border-t border-slate-200 pt-3 text-right text-[10px] text-slate-400 font-mono">
            Página 2 de 5
          </div>
        </div>

        {/* ================= PÁGINA 3: CATÁLOGO DE HARDWARE REAL ================= */}
        <div className="pdf-a4-page bg-white text-slate-900 p-10 sm:p-12 shadow-2xl border border-neutral-300 rounded-xl font-sans min-h-[1100px] flex flex-col justify-between">
          <div className="space-y-4">
            <section>
              <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 font-mono">
                5. Catálogo de Componentes de Mercado Real (Modelos, Velocidades y Precios)
              </h2>
              <p className="text-xs text-slate-600 mb-3">
                Inventario técnico con modelos reales en el mercado para los 15 dispositivos de la red:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] border border-slate-300">
                  <thead className="bg-slate-100 border-b border-slate-300 font-bold font-mono">
                    <tr>
                      <th className="p-2 border-r border-slate-300">Host ID</th>
                      <th className="p-2 border-r border-slate-300">Rol en la Red</th>
                      <th className="p-2 border-r border-slate-300">Modelo Comercial</th>
                      <th className="p-2 border-r border-slate-300">Velocidad / Interfaces</th>
                      <th className="p-2">Precio USD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {DEVICES.map((d, i) => (
                      <tr key={i}>
                        <td className="p-1.5 font-bold font-mono border-r border-slate-300">{d.id}</td>
                        <td className="p-1.5 border-r border-slate-300">{d.role}</td>
                        <td className="p-1.5 border-r border-slate-300 font-semibold">{d.model}</td>
                        <td className="p-1.5 font-mono border-r border-slate-300 text-[10px]">{d.marketSpeed}</td>
                        <td className="p-1.5 font-mono font-bold text-emerald-800">{d.marketPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="border-t border-slate-200 pt-3 text-right text-[10px] text-slate-400 font-mono">
            Página 3 de 5
          </div>
        </div>

        {/* ================= PÁGINA 4: PLAN IP Y TABLA MAESTRA ================= */}
        <div className="pdf-a4-page bg-white text-slate-900 p-10 sm:p-12 shadow-2xl border border-neutral-300 rounded-xl font-sans min-h-[1100px] flex flex-col justify-between">
          <div className="space-y-4">
            <section>
              <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 font-mono">
                6. Plan Maestro de Asignación de Direcciones IPv4 y Ethernet
              </h2>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs font-mono mb-3 grid grid-cols-2 gap-2">
                <div><strong>Red Privada:</strong> 192.168.1.0/24</div>
                <div><strong>Máscara de Subred:</strong> 255.255.255.0</div>
                <div><strong>Default Gateway:</strong> 192.168.1.1</div>
                <div><strong>Servidor DNS Local:</strong> 192.168.1.10</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] border border-slate-300 font-mono">
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
                        <td className="p-1.5 font-bold border-r border-slate-300">{d.id}</td>
                        <td className="p-1.5 border-r border-slate-300">{d.mac}</td>
                        <td className="p-1.5 font-bold border-r border-slate-300 text-blue-900">{d.ip}</td>
                        <td className="p-1.5 border-r border-slate-300">{d.mask}</td>
                        <td className="p-1.5 border-r border-slate-300">{d.type === 'router' ? 'N/A' : '192.168.1.1'}</td>
                        <td className="p-1.5 font-sans">{d.type === 'pc' ? 'DHCP' : 'Estática'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="border-t border-slate-200 pt-3 text-right text-[10px] text-slate-400 font-mono">
            Página 4 de 5
          </div>
        </div>

        {/* ================= PÁGINA 5: ARP, SEGURIDAD Y CONCLUSIONES ================= */}
        <div className="pdf-a4-page bg-white text-slate-900 p-10 sm:p-12 shadow-2xl border border-neutral-300 rounded-xl font-sans min-h-[1100px] flex flex-col justify-between">
          <div className="space-y-5 text-xs text-slate-800 leading-relaxed">
            {/* Sección 7: ARP */}
            <section>
              <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 font-mono">
                7. Explicación y Funcionamiento Detallado del Protocolo ARP (RFC 826)
              </h2>
              <div className="space-y-1.5">
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

            {/* Sección 8: Seguridad */}
            <section>
              <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 font-mono">
                8. Configuración de Equipos, Seguridad y Plan de Mantenimiento
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <h3 className="font-bold text-slate-900 mb-1 font-mono text-[11px] uppercase">Seguridad Aplicada:</h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                    <li><strong>Port-Security:</strong> Límite de 1 MAC por puerto de acceso (modo <code>sticky</code>).</li>
                    <li><strong>Apagado de Puertos:</strong> Puertos sin uso en <code>shutdown</code>.</li>
                    <li><strong>SSH v2 Cifrado:</strong> Llaves RSA 2048-bit (sin Telnet).</li>
                    <li><strong>Mitigación ARP:</strong> Dynamic ARP Inspection (DAI) y DHCP Snooping.</li>
                  </ul>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <h3 className="font-bold text-slate-900 mb-1 font-mono text-[11px] uppercase">Mantenimiento:</h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                    <li><strong>Preventivo:</strong> UPS APC 3000VA mensual y sala a 20°C.</li>
                    <li><strong>Respaldos:</strong> Copia automatizada semanal vía TFTP.</li>
                    <li><strong>Correctivo:</strong> Switch en frío preconfigurado (RTO &lt; 2h).</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Sección 9: Conclusiones */}
            <section className="border-t border-slate-300 pt-3">
              <h2 className="text-sm font-bold text-slate-950 mb-1 font-mono">
                9. Conclusiones
              </h2>
              <p>
                El diseño e implementación de esta red demostró de manera empírica que la resolución de direcciones mediante el protocolo ARP es un eslabón fundamental para cualquier comunicación Ethernet. La plataforma web desarrollada sustituye con éxito simuladores cerrados como Cisco Packet Tracer, ofreciendo un entorno visual transparente, interactivo y accesible desde cualquier navegador.
              </p>
            </section>
          </div>

          <div className="border-t border-slate-200 pt-3 text-right text-[10px] text-slate-400 font-mono">
            Página 5 de 5
          </div>
        </div>

      </div>
    </div>
  );
}
