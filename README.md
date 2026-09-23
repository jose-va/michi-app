# Michi Sushi Granada 🍣

## Descripción
Michi Sushi Granada es una aplicación API REST diseñada para digitalizar la experiencia de los cliente y la gestión interna de un restaurante de sushi situado en Granada. Los clientes pueden explorar la carta y realizar reservas de forma sencilla. Los administradores podrán gestionar las reservas, agregar, editar y eliminar productos de la carta.
Se han integrado distintas herramientas de Google como el inicio de sesión para identificar al administrador del sistema y garantizar la seguridad e integridad de los datos. También se ha implementado una sección con Google Maps para ubicar el restaurante.

La plataforma incluye herramientas específicas para la sincronización de los productos con la aplicación de Uber Eats mediante diferentes peticiones API. 

## Objetivos
* **General:**
    * Digitalizar el sistema de reservas y la gestión interna de los productos.
    * Sincronización con la API de Uber Eats v2.
    * Inicio de sesión OAuth 2.0

* **Específicos:**
    * Permitir el registro y gestión de  distintos perfiles de usuario con roles.
    * Mostrar la ubicación del bar mediante Google Maps.

## Tecnologías
* **Frontend:** Typescript + Next.js con componentes Shadcn UI y estilos Tailwind CSS.
* **Backend:** Java + Spring Boot con base de datos no relacional MongoDB.

## Estado del proyecto
La plataforma sigue en desarrollo.

## Vista previa
### Página principal
Página de bienvenida donde se muestra un carrusel de fotos del restaurante y un acceso rápido a la carta.
![Página principal](preview/home-page.gif)

---

### Inicio de sesión con Google
Nos redirigirá a la página de Google para identificarnos en Michi Sushi sin necesidad de registrar un nuevo usuario
![Inicio de sesión](preview/google-login.gif)

---

### Panel de usuario
Los usuarios identificados podrán acceder a una sección donde se muestran todos sus productos favoritos y reservas realizadas
![Panel de usuario](preview/user-panel.gif)

---

### Página de productos
Vista previa de toda la carta del restaurante, así como información relevante (alérgenos, precio...)
![Página de productos](preview/filter-product.gif)

---

### Guardar productos como favoritos
Se permite a los usuarios identificados marcar todos sus productos favoritos
![Guardar productos](preview/favorite-products.gif)

---

### Desactivar productos
El administrador puede marcar como fuera de stock cualquiera de los productos de la carta
![Desactivar productos](preview/deactivate-product.gif)

---

### Página de reservas
Formulario para crear una nueva reserva en el sistema, introduciendo tus datos personales y preferencias de la reserva
![Página de reservas](preview/reservation.gif)

![Página de reservas](preview/reservation2.gif)

---

### Integración de Google Maps
Mapa de google interactivo en el que podrás ubicar el restaurante de forma sencilla
![Google Maps](preview/location.gif)

---

### Panel de administración
Panel exclusivo del administrador para gestionar las reservas activas y todos los produtos de la carta
![Página de reservas](preview/admin-panel.gif)

---

### Modificar y eliminar productos
Botones para acceder al formulario de modificación y a la eliminación de algún producto de la carta
![Modificar y eliminar](preview/admin-options.gif)

---

### Activación de todos los productos
Exclusivo para administradores, permite activar de forma sencilla todos aquellos productos que hayamos marcado como fuera de stock
![Fuera de stock](preview/deactivate-product.gif)

---

### Sincronización con Uber Eats
Actualizar toda la carta del restaurante en la aplicación de Uber con un simple click mediante peticiones a la API v2 de Uber Eats.
![Uber Eats](preview/uber-sync.gif)

---


