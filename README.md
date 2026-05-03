# Stayke Frontend

Bienvenido al repositorio del Frontend de Stayke. Este proyecto es la interfaz principal (DApp) que interactúa con la blockchain de Solana y el ecosistema híbrido que da vida a los alquileres a corto plazo ("Decentralized stays secured by staking on Solana").

Está diseñado bajo Next.js utilizando `App Router` e incorpora interacciones potentes como Privy para un onboarding amigable y sin fricción a la web3.

## 💡 Idea General del Proyecto

Stayke plantea resolver el problema de confianza en cualquier marketplace de hospedaje utilizando primitivos de blockchain. El frontend sirve de puente a los usuarios para que, mediante la conexión de sus wallets o un login tradicional que oculta una wallet detrás (vía Privy), puedan:

1. Validar su identidad (KYC de Didit) y crear un perfil infalsificable cuyo reputación residirá `on-chain`.
2. Fungir como Hosts listando propiedades para alquilar (reservaciones respaldadas por Escrow de fondos en cadena).
3. Ser inquilinos o Guests buscando en el área los espacios y reservándolos de forma segura.

El objetivo principal es entregar una interfaz `Web2` pulida y veloz pero que transacciona `Web3` debajo del capó de manera descentralizada y transparente.

## 🚀 Comandos de Ejecución

Este repositorio está construido en TypeScript y utiliza `pnpm` como su administrador de paquetes. En la raíz del Frontend, dispones de los siguientes comandos nativos de Next.js:

- `pnpm run dev`: Lanza el entorno de desarrollo en [http://localhost:3000](http://localhost:3000) con recarga en vivo de módulos.
- `pnpm run build`: Genera la compilación para producción optimizando tu aplicación.
- `pnpm run start`: Inicia el servidor usando el empaquetado optimizado generado por `build`.
- `pnpm run lint`: Ejecuta ESLint sobre todo el código buscando y verificando reglas.
- `pnpm run format`: Formatea todo el código (TypeScript, CSS, etc.) con Prettier.
- `pnpm run ci`: Realiza el pipeline completo: `build`, ejecuta lints y verifica el formateo de cara a PRs.
- `pnpm run build:client`: Transpila y autogenera clientes a través de los IDL codificados desde la carpeta `@codama` de los Anchor smart contracts hacia el frontend local en `/idls/`.

## 🗺 Rutas Desarrolladas y Funcionalidades Actuales

Actualmente el ecosistema de páginas creadas (`src/app`) presenta lo siguiente:

- **`/` (Index / Home):**
  Ruta de presentación (Landing page / Home). Exalta la búsqueda inicial, cuenta con la descripción del ecosistema, un mapa para explorar locaciones y listados dinámicos con componentes de alta fidelidad visual.
- **`/register`:**
  Permite al usuario recién logueado (via Privy Auth) crear su perfil unificado y que este firme internamente para calcular y registrar sus direcciones `IdentityAccount` / `UserProfile` y guardarlas al backend.
- **`/profile`:**
  Dashboard personal del usuario. Muestra su dirección, estatus, configuraciones y el panel de Verificación KYC alojado donde transiciona con el modelo o widget de **Didit**.
- **`/add-properties` / `/list-properties` / `/listing`:**
  Formularios interactivos y visualizadores para incorporar lugares nuevos en el protocolo y revisar catálogos con precios y reglas. Se integran con mapas interactivos a través de Leaflet.
- **`/bookings`:**
  Espacio de chequeo de histórico y estado actual de las reservaciones y escrows creados.
- **`/admin`:**
  Panel en desarrollo restringido para el manejo y monitoreo por partes intervinientes o el DAO principal de Stayke.

## ⏳ Rutas y Funciones por Desarrollar (Roadmap)

Con base en la visión y arquitectura planteada formalmente (revisar `stayke-project-details.md` en backend):

1. **Flujo Cripto Nativo del Escrow**: Faltan integraciones completas donde el proceso de `/bookings` y de reserva genere en tiempo real las transacciones nativas y envíen/bloqueen exitosamente los USD/USDC on-chain (contrato de depósito).
2. **Sistema de Lending y Yield Yielding**: Crear una UI/Dashboard para que el usuario controle/visualice sus balances y depósitos "Bond" requeridos con el APR% visualmente indicativo generado por el vault de Kamino Finance.
3. **Módulo Web3 de Disputas y Resolución:** Formularios dentro del ecosistema de Profile y Booking para crear apelaciones e invocar el contrato Anchor de Disputas (`DisputeAccount`), adjuntando off-chain (desde UI) la evidencia/daños.
4. **Chat Integrado**: Lógica e interfaz para las mensajerías peer-to-peer (entre el arrendador y el locatario) en base al match y el booking activo. Todo sin comprometer identidades web2 externas.
5. **Autenticación (Middleware y SIWS)**: Potenciar el flujo en frontend del SIWS frente al backend uniendo las sesion variables.

## 🔐 Variables de Entorno

Puedes fijarte en el archivo `.env.example` local o el actual `.env`.

- **`NEXT_PUBLIC_PRIVY_APP_ID`**
  - **Uso:** El identificador del cliente Web para instanciar el SDK the Privy Client (`PrivyProvider`). Controla la pantalla y el modal de autenticación.
  - **Obligatoria:** Sí.
  - **Valor por defecto:** Proveído en la app real (`cmnjykcbo00h90cjr6up603na`).

- **`NEXT_PUBLIC_API_URL`**
  - **Uso:** Indica la dirección raiz/endpoint a los que todos los fetch/axios internos de la aplicación apuntarán para interactuar con la Base de datos y API unificada en Express (tu backend híbrido).
  - **Obligatoria:** Sí.
  - **Valor por defecto:** `http://localhost:3030`.

- **`NEXT_PUBLIC_MINT_ADDRESS`**
  - **Uso:** Dirección de Mint/Contrato del Token base para la economía general de transacciones, escrow y fees dentro del Frontend (probablemente USDC u otro token).
  - **Obligatoria:** Sí.
  - **Valor por defecto:** `DUBLsUaezbXtcQtSsScX8LnT2WeNjdcqRBbR9QDtTmtG`.
