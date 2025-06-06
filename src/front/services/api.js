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
        throw new Error(error.msg || error.error || "Credenciales inválidas");
      }

      const data = await response.json();
      // Guardar token en localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      return data;
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
  static async getUserProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error obteniendo perfil de usuario:", error);
      throw new Error("No se pudo cargar el perfil de usuario");
    }
  }

  //  Cambiar contraseña
  static async changePassword(oldPassword, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "Error al cambiar contraseña");
      }

      return await response.json();
    } catch (error) {
      console.error("Error cambiando contraseña:", error);
      throw error;
    }
  }

  //  Eliminar cuenta de usuario
  static async deleteAccount(password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/delete-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "Error al eliminar cuenta");
      }

      return await response.json();
    } catch (error) {
      console.error("Error eliminando cuenta:", error);
      throw error;
    }
  }

  //  Solicitar recuperación de contraseña
  static async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al enviar solicitud");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en forgot password:", error);
      throw error;
    }
  }

  //  Restablecer contraseña con token
  static async resetPassword(token, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ new_password: newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "Error al actualizar contraseña");
      }

      return await response.json();
    } catch (error) {
      console.error("Error restableciendo contraseña:", error);
      throw error;
    }
  }

  //  Buscar productos por categoría
  static async searchProductsByCategory(category) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/search?category=${encodeURIComponent(category)}`,
        { headers: this.getAuthHeaders() }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error buscando por categoría:", error);
      throw new Error("Error en la búsqueda por categoría");
    }
  }

  //  Buscar productos por query
  static async searchProductsByQuery(query) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/search?query=${encodeURIComponent(query)}`,
        { headers: this.getAuthHeaders() }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error buscando por query:", error);
      throw new Error("Error en la búsqueda por query");
    }
  }

  //  Verificar salud de la API
  static async checkApiHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error verificando salud de API:", error);
      throw new Error("API no disponible");
    }
  }
  static async getSimilarProductsByCategory(category, excludeId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/search?category=${encodeURIComponent(category)}`,
        { headers: this.getAuthHeaders() }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const products = await response.json();
      return products.filter(p => p.id !== excludeId);
    } catch (error) {
      console.error("Error obteniendo productos similares por categoría:", error);
      throw new Error("Error al buscar productos similares");
    }
  }

  //  Buscar productos similares por título/nombre
  static async getSimilarProductsByTitle(title, category, excludeId) {
    try {
      const keywords = title.split(' ').slice(0, 2).join(' ');
      const response = await fetch(
        `${API_BASE_URL}/api/search?query=${encodeURIComponent(keywords)}`,
        { headers: this.getAuthHeaders() }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const products = await response.json();
      return products.filter(p => 
        p.id !== excludeId && 
        p.category === category
      );
    } catch (error) {
      console.error("Error obteniendo productos similares por título:", error);
      throw new Error("Error al buscar productos por título");
    }
  }

  //  Obtener productos de una categoría específica
  static async getProductsByCategory(category, excludeId) {
    try {
      const allProducts = await this.fetchProducts();
      return allProducts.filter(p => 
        p.id !== excludeId && 
        p.category === category
      );
    } catch (error) {
      console.error("Error obteniendo productos por categoría:", error);
      throw new Error("Error al obtener productos de la categoría");
    }
  }
}

export default ApiService;