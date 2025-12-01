// --- Acciones disponibles ---
export const actionTypes = {
  SET_PRODUCTS: "SET_PRODUCTS",
  SET_LOADING_PRODUCTS: "SET_LOADING_PRODUCTS",
  SET_ERROR_LOADING_PRODUCTS: "SET_ERROR_LOADING_PRODUCTS",
  SET_FEATURED_PRODUCTS: "SET_FEATURED_PRODUCTS",
  SET_RANDOM_PRODUCT: "SET_RANDOM_PRODUCT",
  SET_FILTERS: "SET_FILTERS",
  
  // ✅ Acciones de autenticación
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  SET_USER: "SET_USER",
  SET_TOKEN: "SET_TOKEN",
};

// --- Estado inicial ---
export const initialStore = () => {
  // Intentar recuperar datos del localStorage
  const savedUser = localStorage.getItem('user');
  const savedToken = localStorage.getItem('token');

  return {
    products: [],
    loadingProducts: false,
    errorLoadingProducts: null,
    featuredProducts: [],
    randomProduct: null,
    filters: {
      price_min: 0,
      price_max: 100000,
      searchQuery: "",
      rating: 0,
      inStock: null,
    },
    
    // ✅ Estado de autenticación
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null,
    isAuthenticated: !!(savedUser && savedToken),
    favorites: [],
  };
};

// --- Reducer ---
export default function storeReducer(store, action) {
  switch (action.type) {
    case actionTypes.SET_PRODUCTS:
      return { ...store, products: action.payload };

    case actionTypes.SET_LOADING_PRODUCTS:
      return { ...store, loadingProducts: action.payload };

    case actionTypes.SET_ERROR_LOADING_PRODUCTS:
      return { 
        ...store, 
        errorLoadingProducts: action.payload,
        loadingProducts: false
      };

    case actionTypes.SET_FEATURED_PRODUCTS:
      return { ...store, featuredProducts: action.payload };

    case actionTypes.SET_RANDOM_PRODUCT:
      return { ...store, randomProduct: action.payload };

    case actionTypes.SET_FILTERS:
      return {
        ...store,
        filters: {
          ...store.filters,
          ...action.payload,
        },
      };

    // ✅ Casos de autenticación
    case actionTypes.LOGIN_SUCCESS:
      const { user, token } = action.payload;
      
      // Guardar en localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      return {
        ...store,
        user,
        token,
        isAuthenticated: true,
      };

    case actionTypes.LOGOUT:
      // Limpiar localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      return {
        ...store,
        user: null,
        token: null,
        isAuthenticated: false,
        favorites: [],
      };

    case actionTypes.SET_USER:
      return { ...store, user: action.payload };

    case actionTypes.SET_TOKEN:
      return { ...store, token: action.payload };

    default:
      console.error(`❌ Acción desconocida: ${action.type}`);
      return store;
  }
}