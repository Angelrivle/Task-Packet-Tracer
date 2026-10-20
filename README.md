# NetSim Pro LAN - Simulador Interactivo de Redes & Actividad Grupal

Plataforma web interactiva desarrollada con **React + Vite + Tailwind CSS** para el diseño, simulación visual y documentación técnica de una Red de Área Local (LAN) empresarial.

Diseñada especialmente para sustituir capturas estáticas de Cisco Packet Tracer por una **experiencia interactiva en vivo con animación de paquetes en tiempo real**, terminales virtuales por dispositivo, inspector de tramas OSI/TCP-IP e informe formal con exportación a PDF.

---

## 🎯 Cumplimiento de la Consigna de la Actividad

| Requerimiento de la Tarea | Cómo se implementó en esta Web |
| :--- | :--- |
| **Mínimo 10 equipos conectados con 3 Switch, 1 Servidor y 1 Router** | **Topología en Estrella Jerárquica** con 1 Router Cisco ISR 4331, 3 Switches Cisco Catalyst (1 Core de Distribución + 2 de Acceso), 1 Servidor corporativo Dell PowerEdge y 10 Computadoras de trabajo (PCs 01 a 10). |
| **Identificar cada componente, modelo y velocidad del mercado** | Pestaña **"Hardware de Mercado"** con fichas técnicas completas, números de parte comerciales, velocidades (1 Gbps a 10 Gbps) y costos reales en USD. |
| **Tabla comparativa entre Switch, Módem y Router** | Pestaña **"Switch vs Modem vs Router"** con matriz comparativa por Capa OSI, dominios de colisión, dominios de broadcast, tablas CAM vs Routing, etc. |
| **Elección de topología y medios de transmisión (cables)** | Topología en **Estrella Jerárquica** justificada. Cableado horizontal UTP **Cat6** a 1 Gbps y troncales de interconexión con **Cat6A / Fibra OM4** a 10 Gbps bajo estándar ANSI/TIA-568-C.2. |
| **Plan para asignar direcciones Ethernet e IP** | Pestaña **"Plan de Direccionamiento"** con tabla maestra de 15 dispositivos (MAC física, IPv4 privada clase C `192.168.1.0/24`, máscara, gateway y método estático/DHCP). |
| **Explicación detallada de cómo funciona ARP** | Pestaña **"Protocolo ARP"** con guía didáctica paso a paso (RFC 826), estructura de tramas, comando `arp -a` y mitigación de ARP Spoofing (DAI). Además, el simulador anima en vivo el Broadcast y Unicast de ARP. |
| **Configuración de seguridad y mantenimiento** | Pestaña **"Seguridad & Mantenimiento"** con scripts reales Cisco IOS para Port-Security (sticky MAC), SSHv2, bloqueo de puertos sin uso y plan preventivo/correctivo. |
| **Informe formal para entrega** | Pestaña **"Informe para Entrega"** con formato de reporte técnico universitario y botón de **"Imprimir / Guardar como PDF"**. |

---

## 🚀 Despliegue en Vercel (En 1 Minuto)

Para tener el link público en vivo para tu profesor y compañeros:

### Opción 1: Con GitHub (Recomendada)
1. Crea un repositorio nuevo en tu cuenta de GitHub (ej. `red-lan-simulador`).
2. En tu terminal dentro de esta carpeta, ejecuta:
   ```bash
   git init
   git add .
   git commit -m "feat: simulador interactivo de red lan"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/red-lan-simulador.git
   git push -u origin main
   ```
3. Entra a [vercel.com](https://vercel.com), pulsa **"Add New Project"**, selecciona tu repositorio y haz clic en **Deploy**.
4. ¡Listo! Vercel te dará un link automático (ej. `https://red-lan-simulador.vercel.app`) que podrás enviar directamente.

### Opción 2: Con Vercel CLI (Directo desde consola)
```bash
npm install -g vercel
vercel
```
Sigue las 3 preguntas automáticas en la consola y tendrás el link publicado de inmediato.

---

## 💻 Ejecución en Local

Si deseas probarlo o editarlo en tu máquina:

```bash
# 1. Instalar dependencias (ya instaladas)
npm install

# 2. Iniciar servidor de desarrollo local
npm run dev

# 3. Compilar para producción
npm run build
```

---

## 🕹️ Funcionalidades del Simulador

- **Animación interactiva de paquetes**: Observa el pulso amarillo de Broadcast cuando se lanza una consulta ARP y el pulso cian/verde cuando fluye el Unicast e ICMP Ping.
- **Inspector de Tramas (Mini-Wireshark)**: Desglose en tiempo real de Capa 2 (Ethernet MAC Origen/Destino), Capa 3 (IPv4 / ARP Opcode) y Payload.
- **Terminales CLI Virtuales**: Haz clic en cualquier dispositivo o pulsa "Abrir CLI" para interactuar con la consola de comandos (`ping`, `arp -a`, `ipconfig`, `show mac address-table`, `show ip route`).
- **Modo Paso a Paso y Control de Velocidad**: Pausa, avanza fotograma a fotograma o acelera la simulación a 2x.
