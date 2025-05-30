// --- Acciones disponibles ---
export const actionTypes = {
  SET_PRODUCTS: "SET_PRODUCTS",
  SET_LOADING_PRODUCTS: "SET_LOADING_PRODUCTS",
  SET_ERROR_LOADING_PRODUCTS: "SET_ERROR_LOADING_PRODUCTS",
  SET_FEATURED_PRODUCTS: "SET_FEATURED_PRODUCTS",
  SET_RANDOM_PRODUCT: "SET_RANDOM_PRODUCT",
  SET_FILTERS: "SET_FILTERS",
};

// --- Estado inicial ---
export const initialStore = () => ({
  products: [],
  loadingProducts: false,
  errorLoadingProducts: null,
  featuredProducts: [],
  randomProduct: null,
  filters: {
    category: "",
    minPrice: 0,
    maxPrice: 1000,
    searchQuery: "",
    rating: 0,
    inStock: null,
  },
});

// --- Reducer ---
export default function storeReducer(store, action) {
  switch (action.type) {
    case actionTypes.SET_PRODUCTS:
      return { ...store, products: action.payload };

    case actionTypes.SET_LOADING_PRODUCTS:
      return { ...store, loadingProducts: action.payload };

    case actionTypes.SET_ERROR_LOADING_PRODUCTS:
      return { ...store, errorLoadingProducts: action.payload };

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

    default:
      throw new Error(`Acción desconocida: ${action.type}`);
  }
}
