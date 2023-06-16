Objetivo

Este proyecto contiene la API para una aplicacion de gestion de inventario para empresas. Esta aplicación recibe todas las solicitudes de la aplicación frontend y las maneja según corresponda.

Se realizo una plataforma para la gestion de productos de empresas que venden a clientes y compran a proveedores.

Descripción
Para esta primera versión del sistema, se ha determinado construir una arquitectura monolítica nativa en la nube. Donde el lenguaje utilizado es JavaScript, siendo lo que para el FrontEnd se utilizó la biblioteca React, que es una biblioteca JavaScript de código abierto para desarrollar interfaces de usuario. Por su parte, para el BackEnd se utiliza Typescript y NestJS como entorno de ejecución de Node.

La aplicacion permite:
- El registro de un usuario de rol Administrador. 
- El registro de otros usiarios mediante una invitacion.
- La autenticacion de usuarios. 
- La gestion de productos (alta, baja y modificacion).
- La gestion de proveedores (alta, baja y modificacion).
- El registro de compras.
- El registro de ventas. 
- La gestion de inventario luego de ventas y compras. 
- La visualizacion de los 3 productos mas vendidos. 
- La consultas de compras a proveedores especificos. 

Instalación
Primero, debe clonar o descargar el repositorio de GitHub en su computadora. Los enlaces para el repositorio se encuentran en la documentación.

En la carpeta raíz, agregue un archivo .env. Este archivo se utiliza para configurar las variables de entorno. Debe agregar las siguientes variables, con los valores correspondientes (puede encontrarlas en el archivo .env.example):

```
MONGO_URI=
COMPANY_BD_URL=
APP_PORT=
SECRET_JWT=
MAIL_AUTH_USER = 
MAIL_AUTH_PASS = 
QUEUE_HOST=
QUEUE_PORT= 
REDIS_USER =
REDIS_PASSWORD = 
RELIC_LICENSE_KEY=
AWS_S3_KEY_ID = 
AWS_S3_ACCESS_KEY_SECRET = 
AWS_SESSION_TOKEN = 
AWS_S3_BUCKET = 
URL_BASE=
```

- Para ejecutar esta aplicación en el FrontEnd:

```
yarn start:dev
```
