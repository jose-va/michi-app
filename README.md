<div align="center">

# Michi Sushi Granada 🍣

Plataforma web para gestionar las reservas y la carta de un bar de sushi en Granada.

🌐 **[www.michisushigranada.es](https://www.michisushigranada.es)**

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

---

## Descripción

Michi Sushi Granada es una plataforma para digitalizar la gestión interna de un bar de sushi en Granada. Este repositorio contiene la aplicación web (front-end), que se comunica con un back-end REST.

- Los **clientes** pueden explorar la carta, guardar sus platos favoritos y reservar mesa.
- Los **administradores** gestionan las reservas y los productos, accediendo con su cuenta de Google.
- La web incluye la ubicación del bar en Google Maps y una sección de reseñas.

## Funcionalidades

- Reserva de mesa en dos pasos, con calendario, número de comensales y comprobación de disponibilidad.
- Carta con filtros por categoría y alérgenos, paginación y favoritos.
- Perfil de usuario con sus reservas y productos favoritos.
- Panel de administración para gestionar reservas (por turnos de comida y cena) y productos (crear, editar, activar/desactivar y eliminar).
- Inicio de sesión con Google (OAuth 2.0) y perfiles con distintos roles.
- Ubicación del bar con Google Maps interactivo.

## Objetivos

- Digitalizar el sistema de reservas.
- Digitalizar la gestión interna de los productos de la carta.
- Permitir el registro y la gestión de distintos perfiles de usuario con roles.
- Mostrar la ubicación del bar mediante Google Maps.

## Tecnologías

| Capa | Tecnologías |
|------|-------------|
| **Frontend** | TypeScript, Next.js, shadcn/ui, Tailwind CSS |
| **Backend** | Java, Spring Boot |
| **Base de datos** | MongoDB (no relacional) |
| **Autenticación** | Google OAuth 2.0 |

## Estado del proyecto

✅ **Proyecto terminado.**

## Instalación y ejecución

### Requisitos previos

- [Node.js](https://nodejs.org/) 18.18 o superior
- npm
- El back-end en marcha (ver [repositorio del back-end]([ENLACE_AL_REPO_BACKEND])), que requiere Java [VERSIÓN] y MongoDB

### Pasos

1. Clona el repositorio:

   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd [NOMBRE_DE_LA_CARPETA]
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env.local` en la raíz del proyecto con tus variables de entorno (ver siguiente sección).

4. Arranca el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en el navegador.

### Variables de entorno

Ejemplo de `.env.local` (ajusta los nombres a los que use tu proyecto):

```env
# URL del back-end REST
NEXT_PUBLIC_API_URL=http://localhost:8080

# Google OAuth 2.0
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu_client_id

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key
```

> ⚠️ No subas nunca tu `.env.local` al repositorio. Incluye un `.env.example` con los nombres de las variables y sin valores reales.

### Otros comandos

```bash
npm run build   # Genera la versión de producción
npm run start   # Arranca la versión de producción
npm run lint    # Revisa el código con el linter
```

## Vista previa

### Página principal
Portada con carrusel de imágenes, secciones informativas y botones de acceso directo a la carta y a las reservas.

<video src="preview/demo-home.mp4" controls width="600"></video>

---

### Carta de productos
Carta en cuadrícula con filtros por categoría y alérgenos, paginación y la opción de guardar platos favoritos.

<video src="preview/demo-products.mp4" controls width="600"></video>

---

### Reserva · Paso 1
Elección de fecha en el calendario y número de comensales, con validación del formulario.

<video src="preview/demo-reservation1.mp4" controls width="600"></video>

---

### Reserva · Paso 2
Consulta de la disponibilidad, datos de contacto y confirmación de la reserva con aviso en pantalla.

<video src="preview/demo-reservation2.mp4" controls width="600"></video>

---

### Ubicación
Mapa interactivo con la localización del bar y sección de reseñas.

<video src="preview/demo-location.mp4" controls width="600"></video>

---

### Perfil de usuario
Panel lateral con las reservas organizadas por día y los productos favoritos.

<video src="preview/demo-userprofile.mp4" controls width="600"></video>

---

### Panel de administrador
Panel lateral con el resumen de las reservas del día y accesos rápidos a la gestión.

<video src="preview/demo-admin.mp4" controls width="600"></video>

---

### Gestión de reservas
Listado de reservas por turnos de comida y cena, ordenado por hora y con opción de cancelar.

<video src="preview/demo-adminreservations.mp4" controls width="600"></video>

---

### Gestión de productos
Carta con acciones de administrador: activar o desactivar, editar y eliminar productos.

<video src="preview/demo-adminproducts.mp4" controls width="600"></video>

---

### Creación de productos
Formulario para añadir un producto nuevo con foto, categoría y alérgenos, con validación de los datos.

<video src="preview/demo-adminform.mp4" controls width="600"></video>

---

### Footer y About
Pie de página con secciones, contacto y enlaces legales, y página "Sobre nosotros" con animaciones.

<video src="preview/demo-footer.mp4" controls width="600"></video>

---

## Autor

**Jose Manuel Vilchez Arenas [VILARE]**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)]([TU_GITHUB])
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)]([TU_LINKEDIN])
