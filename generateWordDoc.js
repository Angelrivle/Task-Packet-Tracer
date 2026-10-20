import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, ShadingType } from 'docx';
import fs from 'fs';

async function generateDoc() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header / Title
          new Paragraph({
            text: "ACTIVIDAD GRUPAL • INGENIERÍA EN TECNOLOGÍAS DE INFORMACIÓN (ITI)",
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            style: "Subtitle"
          }),
          new Paragraph({
            text: "GUÍA RÁPIDA DE EXPOSICIÓN Y DEFENSA: RED LAN Y SIMULADOR INTERACTIVO",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          }),
          new Paragraph({
            text: "Este documento contiene el guión estratégico y las explicaciones breves y contundentes divididas equitativamente entre los 3 integrantes del equipo para exponer el proyecto ante el docente y responder preguntas.",
            spacing: { after: 300 }
          }),

          // INTEGRANTE 1
          new Paragraph({
            text: "INTEGRANTE 1: ARQUITECTURA, TOPOLOGÍA Y HARDWARE DE MERCADO",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Rol en la exposición: ", bold: true }),
              new TextRun("Introducir la red, justificar la topología elegida y defender el hardware físico y cableado.")
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Puntos clave que debe decir (1 a 2 minutos):\n", bold: true }),
              new TextRun("  1. Presentación: En lugar de capturas estáticas de Packet Tracer, desarrollamos un simulador interactivo web en tiempo real para visualizar exactamente cómo viajan los paquetes.\n"),
              new TextRun("  2. Topología en Estrella Jerárquica: Elegimos una arquitectura de 2 niveles: un Switch Core central (SW-CORE) que conecta al Servidor Corporativo y al Router de salida, y 2 Switches de acceso (SW-ACC-01 para Ventas y SW-ACC-02 para Finanzas).\n"),
              new TextRun("  3. Medios físicos de red: Cable UTP Categoría 6 (1 Gbps) para estaciones de trabajo y enlaces troncales Cat6A / Fibra (10 Gbps) bajo norma ANSI/TIA-568-C.2.\n"),
              new TextRun("  4. Hardware real del mercado: Cumplimos con los 15 equipos exigidos: Router Cisco ISR 4331 ($1,850 USD), 3 Switches Cisco Catalyst 2960/1000 ($480-$920 USD), Servidor Dell PowerEdge R450 ($2,450 USD) y 10 computadoras de trabajo HP/Dell.")
            ],
            spacing: { after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Pregunta típica del profesor y respuesta:\n", bold: true, color: "0066CC" }),
              new TextRun({ text: "Pregunta: ", bold: true }),
              new TextRun("¿Por qué usaron 3 switches en vez de poner 1 solo switch grande de 48 puertos?\n"),
              new TextRun({ text: "Respuesta: ", bold: true }),
              new TextRun("Por diseño jerárquico y contención de fallos. Separar en dos switches de acceso departamental reduce el tendido masivo de cables entre plantas, permite aislar averías por piso y mejora la administración y seguridad por VLANs.")
            ],
            spacing: { after: 300 }
          }),

          // INTEGRANTE 2
          new Paragraph({
            text: "INTEGRANTE 2: TABLA COMPARATIVA (SWITCH VS MÓDEM VS ROUTER) Y PLAN IP",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Rol en la exposición: ", bold: true }),
              new TextRun("Explicar las diferencias fundamentales de los 3 dispositivos de red y el plan de direccionamiento IPv4.")
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Puntos clave que debe decir (1 a 2 minutos):\n", bold: true }),
              new TextRun("  1. Switch (Capa 2): Dispositivo de red local que conmuta tramas usando direcciones físicas MAC de 48 bits. Microsegmenta la red creando dominios de colisión independientes en cada puerto.\n"),
              new TextRun("  2. Módem (Capa 1/Física): Modulador/Demodulador. Convierte la señal física del proveedor (luz en fibra o radiofrecuencia en coaxial) en bits digitales para el router.\n"),
              new TextRun("  3. Router (Capa 3): Enrutador que conecta redes lógicas distintas (la LAN privada con Internet WAN). Trabaja con direcciones IP y rompe los dominios de broadcast.\n"),
              new TextRun("  4. Plan IP: Subred privada Clase C (192.168.1.0/24). Asignación estática para Router (192.168.1.1), Switches (.2 a .4) y Servidor (.10). Asignación dinámica DHCP para las 10 PCs (.101 a .110).")
            ],
            spacing: { after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Pregunta típica del profesor y respuesta:\n", bold: true, color: "0066CC" }),
              new TextRun({ text: "Pregunta: ", bold: true }),
              new TextRun("¿Por qué el switch propaga el broadcast y el router lo detiene?\n"),
              new TextRun({ text: "Respuesta: ", bold: true }),
              new TextRun("Porque el switch opera en capa 2; al ver la dirección de broadcast FF:FF:FF:FF:FF:FF está obligado a replicarla por todos los puertos de la LAN. El router opera en capa 3 y su función principal es delimitar la red local, evitando que el tráfico broadcast inunde Internet.")
            ],
            spacing: { after: 300 }
          }),

          // INTEGRANTE 3
          new Paragraph({
            text: "INTEGRANTE 3: PROTOCOLO ARP, SIMULACIÓN EN VIVO Y SEGURIDAD",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Rol en la exposición: ", bold: true }),
              new TextRun("Mostrar la simulación interactiva, explicar el protocolo ARP (RFC 826) y las políticas de seguridad Cisco IOS.")
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Puntos clave que debe decir (1 a 2 minutos):\n", bold: true }),
              new TextRun("  1. ¿Qué es ARP?: Es el puente entre Capa 3 y Capa 2. Las aplicaciones usan IPs, pero las tarjetas de red Ethernet solo transmiten con direcciones físicas MAC.\n"),
              new TextRun("  2. Demostración en el simulador: Muestra en la web el botón 'Simular ARP + Ping':\n"),
              new TextRun("     - Paso Broadcast: La PC origen no tiene la MAC en caché, envía ARP Request a FF:FF:FF:FF:FF:FF ('¿Quién tiene la IP X?'). El switch inunda todos los puertos.\n"),
              new TextRun("     - Paso Unicast: El destino reconoce su IP y responde directamente con su MAC (ARP Reply). Las demás PCs descartan el paquete.\n"),
              new TextRun("     - Paso ICMP: Con la MAC ya en caché (arp -a), viaja el paquete Ping de ida y vuelta con 0% pérdida y RTT < 1ms.\n"),
              new TextRun("  3. Seguridad aplicada: En los switches Cisco configuramos Port-Security (modo sticky limitando a 1 sola MAC por puerto), deshabilitación de puertos no usados y mitigación de ARP Poisoning con Dynamic ARP Inspection (DAI).")
            ],
            spacing: { after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Pregunta típica del profesor y respuesta:\n", bold: true, color: "0066CC" }),
              new TextRun({ text: "Pregunta: ", bold: true }),
              new TextRun("¿Qué ocurre si un atacante envía respuestas ARP falsas (ARP Spoofing)?\n"),
              new TextRun({ text: "Respuesta: ", bold: true }),
              new TextRun("Engaña a la víctima haciéndole creer que el router tiene la MAC del atacante (Man-in-the-Middle). Por eso en nuestros switches Catalyst activamos DHCP Snooping y DAI, para validar que la correspondencia IP-MAC sea verídica.")
            ],
            spacing: { after: 300 }
          }),

          // RESUMEN GENERAL
          new Paragraph({
            text: "CONSEJOS GENERALES PARA LA DEFENSA",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 150 }
          }),
          new Paragraph({
            text: "1. Abran el link de la web en el navegador del proyector o pantalla compartida.\n2. Hagan clic en un host (ej. PC-01) y abran la terminal CLI para escribir 'ping 192.168.1.10' o 'arp -a' en vivo para impresionar al profesor.\n3. Si el profesor pide el informe impreso, pulsen el botón 'Descargar Informe PDF' en la pestaña correspondiente.",
            spacing: { after: 200 }
          })
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('Guia_Exposicion_3_Integrantes.docx', buffer);
  console.log('Document created: Guia_Exposicion_3_Integrantes.docx');
}

generateDoc();
