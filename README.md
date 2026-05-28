# SGRC — Frontend (React)

Interfaz web del **Sistema de Gestión de Recursos del Centro de Cómputo — UACH**.  
En producción, este código se compila y sirve desde el backend Spring Boot.  
Este repositorio es el entorno de **desarrollo** del frontend.

Stack: **React 19**, **Vite 8**, **React Router 7**, **Tailwind CSS 4**.  
Se comunica con el backend vía API REST y **WebSocket (STOMP)** para notificaciones en tiempo real.

---

## Requisitos previos

| Herramienta | Versión mínima | Cómo instalar |
|-------------|---------------|---------------|
| Node.js | 20 LTS | [nodejs.org](https://nodejs.org/) |
| pnpm | 9 | `npm install -g pnpm` |

Verifica que estén instalados:

```bash
node -v    # debe mostrar v20.x.x o superior
pnpm -v    # debe mostrar 9.x.x o superior
```

---

## Instalación

```bash
git clone <url-del-repositorio>
cd SGRC-REACT
pnpm install
```

---

## Modo desarrollo

Requiere tener el backend **SGRC-SPRING corriendo** en `https://localhost:3000` (ver su README).

```bash
pnpm dev
```

Abre **`https://localhost:5173`** en el navegador.  
Acepta el certificado autofirmado si el browser lo pide.

El servidor de desarrollo hace proxy automático:
- `/api/*` → `https://localhost:3000` (API REST)
- `/ws/*` → `wss://localhost:3000` (WebSocket — notificaciones en tiempo real)

---

## Build para producción

Este comando compila el frontend y deposita los archivos directamente en Spring Boot:

```bash
pnpm build
```

Los archivos van a `../SGRC-SPRING/src/main/resources/static/`.  
Spring Boot los sirve automáticamente en `https://localhost:3000`.

> **Nota:** `./restart.sh` del proyecto Spring Boot ya ejecuta este build automáticamente antes de arrancar. Solo necesitas correrlo manualmente si modificas el frontend sin querer reiniciar toda la infraestructura.

---

## Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo con hot-reload |
| `pnpm build` | Build de producción → `../SGRC-SPRING/src/main/resources/static/` |
| `pnpm preview` | Vista previa del build (sin proxy al backend) |
| `pnpm lint` | Revisión con ESLint |

---

## Usuarios de prueba

| Matrícula | Contraseña | Rol |
|-----------|------------|-----|
| `ADM001` | `password123` | Administrador |
| `367886` | `password123` | Alumno activo |
| `EMP001` | `password123` | Docente |

---

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/login` | Inicio de sesión |
| `/home` | Pantalla de inicio |
| `/cubicle-reservation` | Selección de cubículo |
| `/cubicle-reservation/:id` | Formulario de reserva |
| `/my-reservations` | Reservas del usuario |
| `/check-in/:id` | Check-in por QR |
| `/equipment-rental` | Catálogo de equipo |
| `/equipment-rental/order/:requestId` | Comprobante de solicitud |
| `/admin` | Dashboard de administración |
| `/admin/cubiculos-panel` | Gestión de cubículos (CRUD + filtros + paginación) |
| `/admin/equipo-panel` | Catálogo de equipo (admin) |
| `/admin/equipo-solicitudes` | Solicitudes de renta (admin) |
| `/my-equipment-requests` | Historial de solicitudes de equipo del alumno |
| `/lobby/:cubicleId` | Lobby de check-in QR para un cubículo específico |

---

## Estructura del proyecto

```
src/
├── App.jsx                    Rutas principales
├── app/
│   ├── components/
│   │   ├── auth/              Login
│   │   ├── common/            Componentes reutilizables, iconos
│   │   ├── cubicles/          Reservas y check-in
│   │   ├── dashboard/         Shell de admin y home
│   │   ├── equipment/         Renta de equipo (usuario y admin)
│   │   └── layout/            Navbar, cards, menú rápido
│   └── services/
│       ├── auth.service.js    Sesión JWT en localStorage
│       ├── equipment/         Servicios de equipo
│       └── reservations/      Servicios de reservas
└── assets/                    Imágenes y fuentes
```

---

## Probar desde el celular

1. Mac y celular en la misma red Wi-Fi.
2. Corre `pnpm dev` — Vite publica la URL de red local en la terminal.
3. En el celular abre esa URL (ej. `https://192.168.1.x:5173`).
4. Acepta el certificado autofirmado en el browser del celular.
