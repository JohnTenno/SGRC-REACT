# SGRC — Frontend

Aplicación web del **Sistema de Gestión de Recursos (SGRC)** de la Universidad Autónoma de Chihuahua. Permite reservar cubículos, solicitar renta de equipo y consultar reservas, con interfaz alineada a la identidad visual UACH.

Stack: **React 19**, **Vite 8**, **React Router**, **Tailwind CSS 4**.

## Requisitos previos

- [Node.js](https://nodejs.org/) **18 o superior** (recomendado: 20 LTS)
- [pnpm](https://pnpm.io/installation) **9 o superior**

Comprueba las versiones:

```bash
node -v
pnpm -v
```

## Clonar e instalar

```bash
git clone <url-del-repositorio>
cd SGRC-REACT
pnpm install
```

Si `pnpm install` falla por scripts de compilación ignorados (`core-js`), el proyecto ya declara el permiso en `pnpm-workspace.yaml`. Vuelve a ejecutar:

```bash
pnpm install
```

## Poner en marcha (desarrollo)

```bash
pnpm dev
```

Abre en el navegador la URL que muestre la terminal (por defecto [http://localhost:5173](http://localhost:5173)).

## Otros comandos

| Comando        | Descripción                          |
|----------------|--------------------------------------|
| `pnpm dev`     | Servidor de desarrollo con recarga   |
| `pnpm build`   | Build de producción en `dist/`       |
| `pnpm preview` | Vista previa del build de producción |
| `pnpm lint`    | Revisión con ESLint                  |

## Modo desarrollo (mocks)

Sin backend, la app usa datos simulados por defecto. No hace falta archivo `.env` para empezar.

Opcionalmente puedes crear un `.env` en la raíz del proyecto:

```env
# Usar mocks (por defecto si no defines el archivo o no pones 'false')
VITE_USE_MOCK_LOGIN=true
VITE_USE_MOCK_RESERVATIONS=true
```

Para conectar con API real, pon ambas en `false` y configura el proxy o la URL del backend según tu entorno.

### Credenciales de prueba (login mock)

| Campo      | Valor    |
|-----------|----------|
| Matrícula | `367651` |
| Contraseña | `uach123` |

## Estructura del proyecto

```
src/
├── pages/          Pantallas de rutas
├── forms/          Formularios (p. ej. reserva de cubículo)
├── components/
│   ├── layout/     Navbar, HeroHeader
│   ├── cards/      Tarjetas de cubículo, equipo, home
│   ├── auth/       Carrusel de login
│   ├── animations/ Overlays de éxito y error
│   ├── equipment/  Renta de equipo
│   └── reservation/ Reservas y cubículos
├── lib/            APIs, sesión, utilidades
└── data/           Datos mock
```

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/login` | Inicio de sesión |
| `/home` | Inicio |
| `/reserva-de-cubiculo` | Selección de cubículo |
| `/reserva-de-cubiculo/:id` | Formulario de reserva |
| `/mis-reservas` | Reservas del usuario |
| `/renta-de-equipo` | Catálogo y solicitud de equipo |
| `/renta-de-equipo/orden` | Comprobante de solicitud |

## Problemas frecuentes

**`pnpm dev` falla tras clonar**  
Ejecuta `pnpm install` de nuevo. Si persiste el error de `core-js`, revisa que exista `pnpm-workspace.yaml` con `allowBuilds: core-js: true`.

**Puerto 5173 ocupado**  
Vite usará otro puerto automáticamente o puedes indicar uno:

```bash
pnpm dev -- --port 3000
```
