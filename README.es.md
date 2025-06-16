# Proyecto Final FLA 2.0 🛍️

Un comparador de precios de productos que permite a los usuarios buscar, comparar y gestionar productos de múltiples tiendas desde una sola plataforma.

## 🚀 Características Principales

- **🔍 Búsqueda Avanzada**: Sistema de búsqueda con filtros por categoría, precio y tienda
- **💰 Comparación de Precios**: Compara precios de productos entre diferentes tiendas
- **❤️ Favoritos**: Guarda productos favoritos para un acceso rápido
- **👤 Gestión de Usuarios**: Sistema completo de autenticación y perfiles de usuario
- **🏪 Múltiples Tiendas**: Integración con múltiples fuentes de productos
- **📱 Responsive**: Interfaz adaptable para dispositivos móviles y desktop
- **🌙 Modo Oscuro**: Interfaz con soporte para tema claro/oscuro

## 🛠️ Tecnologías Utilizadas

### Backend
- **Python 3.10+**
- **Flask** - Framework web
- **SQLAlchemy** - ORM para base de datos
- **Flask-JWT-Extended** - Autenticación JWT
- **Pipenv** - Gestión de dependencias

### Frontend
- **React.js** - Librería de interfaz de usuario
- **React Router** - Navegación
- **Context API** - Gestión de estado global
- **CSS3** - Estilos personalizados
- **Responsive Design**

### Base de Datos
- **PostgreSQL** 
- Soporte para SQLite y MySQL

## 📁 Estructura del Proyecto

```
src/
├── api/                    # API backend en Flask
│   ├── admin.py             # Funcionalidades para administradores
│   ├── commands.py          # Comandos personalizados de Flask
│   ├── models.py            # Modelos de base de datos
│   ├── routes.py            # Rutas principales de la API
│   ├── scripts/             # Scripts utilitarios
│   └── utils.py             # Funciones utilitarias
├── api_modular/            # Rutas modulares de la API
│   ├── auth.py              # Rutas de autenticación
│   ├── favorites.py         # Gestión de favoritos
│   ├── products.py          # Rutas relacionadas con productos
│   ├── users.py             # Gestión de usuarios
│   └── routes.py            # Rutas modulares consolidadas
├── app.py                  # Aplicación principal de Flask
├── extensions.py           # Extensiones de Flask
├── front/                  # Frontend en React
│   ├── assets/              # Recursos estáticos (e.g., imágenes)
│   ├── components/          # Componentes reutilizables de React
│   ├── context/             # Contexto de React para gestión de estado
│   ├── hooks/               # Hooks personalizados de React
│   ├── pages/               # Componentes de páginas
│   ├── services/            # Capa de servicios para la API
│   ├── index.css            # Estilos globales
│   ├── main.jsx             # Punto de entrada de React
│   ├── routes.jsx           # Enrutamiento del frontend
│   └── store.js             # Configuración del store del frontend
└── wsgi.py                 # Punto de entrada WSGI para despliegue
```

## 🚀 Instalación y Configuración

### Prerequisitos
- Python 3.10+
- Node.js 20+
- PostgreSQL (recomendado)
- Pipenv

### Configuración del Backend

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/Adrianmrc94/Proyecto-Final-FLA-2.0.git
   cd Proyecto-Final-FLA-2.0
   ```

2. **Instala las dependencias de Python**
   ```bash
   pipenv install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` con tu configuración:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   JWT_SECRET_KEY=tu_clave_secreta_jwt
   FLASK_ENV=development
   ```

4. **Configura la base de datos**
   ```bash
   # Ejecuta las migraciones
   pipenv run migrate
   pipenv run upgrade
   ```

5. **Inicia el servidor backend**
   ```bash
   pipenv run start
   ```

### Configuración del Frontend

1. **Instala las dependencias de Node.js**
   ```bash
   npm install
   ```

2. **Inicia el servidor de desarrollo**
   ```bash
   npm run start
   ```

La aplicación estará disponible en:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 📊 Funcionalidades Detalladas

### Sistema de Productos
- Importación automática de productos desde fuentes externas
- Categorización inteligente de productos
- Actualización periódica de precios
- Sistema de comparación de precios en tiempo real

### Gestión de Usuarios
- Registro e inicio de sesión seguro
- Perfiles de usuario personalizables
- Restablecimiento de contraseña
- Eliminación de cuenta

### Sistema de Favoritos
- Agregar/quitar productos de favoritos
- Lista personalizada de productos guardados
- Notificaciones de cambios de precio (próximamente)

### Búsqueda y Filtros
- Búsqueda por texto libre
- Filtros por categoría, precio y tienda
- Paginación de resultados
- Ordenamiento personalizable

## 🗄️ Comandos Útiles

### Backend
```bash

# Limpiar productos y tiendas
python src/api/scripts/clear_products_and_stores.py

# Importar productos externos
python src/api/scripts/import_external_products.py

# Rollback de migración
pipenv run downgrade
```

### Frontend
```bash
# Compilar para producción
npm run build

# Ejecutar tests
npm test

# Analizar bundle
npm run analyze
```

## 🚀 Despliegue

Este proyecto está configurado para despliegue fácil en:

- **Render.com** (recomendado)
- **Heroku**
- **Vercel** (frontend)

## 🤝 Contribución

Este proyecto está en desarrollo activo. Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📋 Próximas Funcionalidades

- [ ] Notificaciones de cambios de precio
- [ ] Sistema de reviews y ratings
- [ ] Integración con más tiendas
- [ ] API pública para desarrolladores
- [ ] Aplicación móvil nativa
- [ ] Sistema de alertas personalizables
- [ ] Histórico de precios con gráficos

## 🐛 Reporte de Errores

Si encuentras algún error o tienes sugerencias, por favor abre un [issue](https://github.com/Adrianmrc94/Proyecto-Final-FLA-2.0/issues) en GitHub.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo "bundle.js.LICENSE.txt" para más detalles.

## 🙏 Agradecimientos

- [4Geeks Academy](https://4geeksacademy.com/) por el template base
- [Alejandro Sanchez](https://twitter.com/alesanchezr) y contribuidores del template React-Flask
- Comunidad de desarrolladores por las librerías utilizadas

---

**⚠️ Nota**: Este proyecto está en desarrollo activo y puede experimentar cambios significativos. Se recomienda revisar la documentación regularmente para actualizaciones.