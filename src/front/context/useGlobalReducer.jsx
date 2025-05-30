import { useContext } from "react";
import StoreContext from "../context/StoreContext";

export default function useGlobalReducer() {
    const { store, dispatch } = useContext(StoreContext);
    return { store, dispatch };
}