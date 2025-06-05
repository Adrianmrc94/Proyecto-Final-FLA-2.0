// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL?.replace(/['"]/g,"").replace(/\/$/, "");

class ApiService {
   //Obtiene headers de autenticación
  static getAuthHeaders() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }


   //Obtiene todos los productos
  static async fetchProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error obteniendo productos:", error);
      throw new Error("No se pudieron cargar los productos");
    }
  }

   //Obtiene favoritos del usuario
  static async fetchFavorites() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/favorites`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error obteniendo favoritos:", error);
      throw new Error("No se pudieron cargar los favoritos");
    }
  }

   //Agrega un producto a favoritos
  static async addFavorite(favoriteData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(favoriteData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error agregando favorito:", error);
      throw new Error("No se pudo agregar el favorito");
    }
  }

   //Elimina un favorito por ID
  static async removeFavorite(favoriteId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/favorites/${favoriteId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error eliminando favorito:", error);
      throw new Error("No se pudo eliminar el favorito");
    }
  }


   //Elimina un favorito por producto ID
  static async removeFavoriteByProduct(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/favorites/product/${productId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error eliminando favorito por producto:", error);
      throw new Error("No se pudo eliminar el favorito");
    }
  }


   // Inicia sesión de usuario
  static async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || error.error || "Error al iniciar sesión");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  }


   // Registra un nuevo usuario

  static async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al registrar usuario");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  }


   // Busca productos

  static async searchProducts(query, filters = {}) {
    try {
      const params = new URLSearchParams({
        q: query,
        ...filters,
      });

      const response = await fetch(`${API_BASE_URL}/api/search?${params}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error en búsqueda:", error);
      throw new Error("Error en la búsqueda de productos");
    }
  }
}

export default ApiService;