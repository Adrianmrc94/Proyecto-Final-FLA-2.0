import useGlobalReducer from "../context/useGlobalReducer";

export default function useFilters() {
    const { store, dispatch } = useGlobalReducer();

    const filters = store.filters;

    const setFilters = (newFilters) => {
        dispatch({ type: "SET_FILTERS", payload: newFilters });
    };

    return { filters, setFilters };
}