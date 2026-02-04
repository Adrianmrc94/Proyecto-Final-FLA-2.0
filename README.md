# Final Project FLA 2.0 🛍️

A smart product price comparison platform that allows users to search, compare, and manage products from multiple stores in one place.

> **Latest Update**: Application optimized with intelligent category mapping and unified search experience (Feb 2026)

## 🚀 Key Features

- **🔍 Advanced Search**: Search system with filters by category, price, and store
- **💰 Price Comparison**: Compare product prices across different stores
- **❤️ Favorites**: Save favorite products for quick access
- **👤 User Management**: Complete authentication and user profile system
- **🏪 Multiple Stores**: Integration with multiple product sources
- **📱 Responsive**: Mobile and desktop adaptive interface
- **🌙 Dark Mode**: Interface with light/dark theme support

## 🛠️ Technologies Used

### Backend
- **Python 3.10+**
- **Flask** - Web framework
- **SQLAlchemy** - Database ORM
- **Flask-JWT-Extended** - JWT Authentication
- **Pipenv** - Dependency management

### Frontend
- **React.js** - User interface library
- **React Router** - Navigation
- **Context API** - Global state management
- **CSS3** - Custom styles
- **Responsive Design**

### Database
- **PostgreSQL** 
- Support for SQLite and MySQL

## 📁 Project Structure

```
src/
├── api/                    # Flask backend API
│   ├── admin.py             # Administrator functionalities
│   ├── commands.py          # Custom Flask commands
│   ├── models.py            # Database models
│   ├── routes.py            # Main API routes
│   ├── scripts/             # Utility scripts
│   └── utils.py             # Utility functions
├── api_modular/            # Modular API routes
│   ├── auth.py              # Authentication routes
│   ├── favorites.py         # Favorites management
│   ├── products.py          # Product-related routes
│   ├── users.py             # User management
│   └── routes.py            # Consolidated modular routes
├── app.py                  # Main Flask application
├── extensions.py           # Flask extensions
├── front/                  # React frontend
│   ├── assets/              # Static resources (e.g., images)
│   ├── components/          # Reusable React components
│   ├── context/             # React context for state management
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── services/            # API service layer
│   ├── index.css            # Global styles
│   ├── main.jsx             # React entry point
│   ├── routes.jsx           # Frontend routing
│   └── store.js             # Frontend store configuration
└── wsgi.py                 # WSGI entry point for deployment
```

## 🚀 Installation and Setup

### Prerequisites
- Python 3.10+
- Node.js 20+
- PostgreSQL (recommended)
- Pipenv

### Backend Configuration

1. **Clone the repository**
   ```bash
   git clone https://github.com/Adrianmrc94/Proyecto-Final-FLA-2.0.git
   cd Proyecto-Final-FLA-2.0
   ```

2. **Install Python dependencies**
   ```bash
   pipenv install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   JWT_SECRET_KEY=your_jwt_secret_key
   FLASK_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Run migrations
   pipenv run migrate
   pipenv run upgrade
   ```

5. **Start the backend server**
   ```bash
   pipenv run start
   ```

### Frontend Configuration

1. **Install Node.js dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run start
   ```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 📊 Detailed Features

### Product System
- Automatic product import from external sources
- Smart product categorization
- Periodic price updates
- Real-time price comparison system

### User Management
- Secure registration and login
- Customizable user profiles
- Password reset functionality
- Account deletion

### Favorites System
- Add/remove products from favorites
- Personalized saved product list
- Price change notifications (coming soon)

### Search and Filters
- Free text search
- Filters by category, price, and store
- Result pagination
- Customizable sorting

## 🗄️ Useful Commands

### Backend
```bash
# Clear products and stores
python src/api/scripts/clear_products_and_stores.py

# Import external products
python src/api/scripts/import_external_products.py

# Migration rollback
pipenv run downgrade
```

### Frontend
```bash
# Build for production
npm run build

# Run tests
npm test

# Analyze bundle
npm run analyze
```

## 🚀 Deployment

This project is configured for easy deployment on:

- **Render.com** (recommended)
- **Heroku**
- **Vercel** (frontend)

## 🤝 Contributing

This project is in active development. Contributions are welcome:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📋 Upcoming Features

- [ ] Price change notifications
- [ ] Reviews and ratings system
- [ ] Integration with more stores
- [ ] Public API for developers
- [ ] Native mobile application
- [ ] Customizable alert system
- [ ] Price history with charts

## 🐛 Bug Reports

If you find any bugs or have suggestions, please open an [issue](https://github.com/Adrianmrc94/Proyecto-Final-FLA-2.0/issues) on GitHub.

## 📄 License

This project is licensed under the MIT License. See the "bundle.js.LICENSE.txt" file for more details.

## 🙏 Acknowledgments

- [4Geeks Academy](https://4geeksacademy.com/) for the base template
- [Alejandro Sanchez](https://twitter.com/alesanchezr) and contributors to the React-Flask template
- Developer community for the libraries used

---

**⚠️ Note**: This project is in active development and may experience significant changes. It is recommended to check the documentation regularly for updates.