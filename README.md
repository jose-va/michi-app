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
![Página principal](preview/home-page.gif)

---

### Inicio de sesión con Google
![Inicio de sesión](preview/google-login.gif)

---

### Panel de usuario
![Panel de usuario](preview/user-panel.gif)

---

### Página de productos
![Página de productos](preview/filter-product.gif)

---

### Guardar productos como favoritos
![Guardar productos](preview/favorite-products.gif)

---

### Desactivar productos
![Desactivar productos](preview/deactivate-product.gif)

---

### Página de reservas
![Página de reservas](preview/reservation.gif)

![Página de reservas](preview/reservation2.gif)

---

### Integración de Google Maps
![Google Maps](preview/location.gif)

---

### Panel de administración
![Página de reservas](preview/admin-panel.gif)

---

### Modificar y eliminar productos
![Modificar y eliminar](preview/admin-options.gif)

---

### Productos fuera de stock
![Fuera de stock](preview/deactivate-product.gif)

---

### Sincronización con Uber Eats
Se permite actualizar toda la carta del restaurante con un simple click mediante peticiones a la API de Uber Eats. 
![Uber Eats](preview/uber-sync.gif)

---


