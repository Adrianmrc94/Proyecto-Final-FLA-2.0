import useGlobalReducer from "../context/useGlobalReducer";

export default function useGlobalProducts() {
    const { store, dispatch } = useGlobalReducer();

    const setProducts = (products) =>
        dispatch({
            type: "SET_PRODUCTS",
            payload: products,
        });

    const setLoadingProducts = (loading) =>
        dispatch({
            type: "SET_LOADING_PRODUCTS",
            payload: loading,
        });

    const setErrorLoadingProducts = (error) =>
        dispatch({
            type: "SET_ERROR_LOADING_PRODUCTS",
            payload: error,
        });

    const setFeaturedProducts = (featured) =>
        dispatch({
            type: "SET_FEATURED_PRODUCTS",
            payload: featured,
        });

    const setRandomProduct = (random) =>
        dispatch({
            type: "SET_RANDOM_PRODUCT",
            payload: random,
        });

    const setFilters = (filters) =>
        dispatch({
            type: "SET_FILTERS",
            payload: filters,
        });

    return {
        products: store.products,
        loadingProducts: store.loadingProducts,
        errorLoadingProducts: store.errorLoadingProducts,
        featuredProducts: store.featuredProducts,
        randomProduct: store.randomProduct,
        filters: store.filters,

        setProducts,
        setLoadingProducts,
        setErrorLoadingProducts,
        setFeaturedProducts,
        setRandomProduct,
        setFilters,
    };
}