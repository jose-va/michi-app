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

Michi Sushi Granada es una plataforma para digitalizar la gestión interna de un bar de sushi en Granada. Este repositorio contiene el front-end, que se comunica con un back-end REST.

- Los **clientes** pueden explorar la carta, guardar sus platos favoritos y reservar mesa en el bar.
- Los **administradores** gestionan todas las reservas y los productos desde su panel de administrador.
- Los **usuarios** pueden ingresar en su cuenta de Google, teniendo acceso a nuevas funcionalidades.
- La página incluye la ubicación del bar en Google Maps y una sección de reseñas obtenida mediante conexion a la API de Maps Grounding Lite.

## Funcionalidades


- Reserva de mesa en dos pasos con un calendario, número de comensales (primer paso) y comprobación de disponibilidad en el bar (segundo paso).
- Carta con filtros por búsqueda, categoría y alérgenos. Incluye paginación y productos favoritos.
- Inicio de sesión con Google (OAuth 2.0) y perfiles con distintos roles.
- Perfil de usuario con sus reservas y productos agregados como favoritos.
- Panel de administración para gestión de reservas y productos (crear, editar, activar/desactivar y eliminar).
- Ubicación del bar con Google Maps interactivo y conexión a Google Maps Grounding Lite.

## Objetivos

- Digitalizar el sistema de reservas.
- Digitalizar la carta del bar.
- Digitalizar la gestión interna de los productos de la carta.
- Permitir el registro y la gestión de distintos perfiles de usuario con roles.
- Mostrar la ubicación del bar.

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
- El back-end en funcionamiento. Requiere Java 21 y conexión con la base de datos MongoDB.

### Pasos

1. Clona el repositorio:

   ```bash
   git clone https://github.com/jose-va/michi-app
   cd michi-app
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env.local` en la raíz del proyecto con las variables de entorno.

4. Arranca el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en el navegador.

### Variables de entorno

Ejemplo de `.env.local`:

```env
# URL del back-end REST
NEXT_PUBLIC_API_URL=http://localhost:8080

# Google OAuth 2.0
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu_client_id

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key
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

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jose-va)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jose-manuel-vilchez-arenas-937b87435)
