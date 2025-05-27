import React, { useEffect, useState } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import ComparativeModal1 from "../components/ComparativeModal1"; 
import ComparativeModal3 from "../components/ComparativeModal3"; 

export const Home = () => {
    const { store, dispatch } = useGlobalReducer();
    const [modal1Open, setModal1Open] = useState(false); // Estado para modal 1
    const [modal3Open, setModal3Open] = useState(false); // Estado para modal 3

    const loadMessage = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

            const response = await fetch(backendUrl + "/api/hello");
            const data = await response.json();

            if (response.ok) dispatch({ type: "set_hello", payload: data.message });

            return data;
        } catch (error) {
            if (error.message) throw new Error(
                `Could not fetch the message from the backend.
                Please check if the backend is running and the backend port is public.`
            );
        }
    };

    useEffect(() => {
        loadMessage();
    }, []);

    return (
        <div className="text-center mt-5">
            <h1 className="display-4">Hello Rigo!!</h1>
            <p className="lead">
                <img src={rigoImageUrl} className="img-fluid rounded-circle mb-3" alt="Rigo Baby" />
            </p>
            <div className="alert alert-info">
                {store.message ? (
                    <span>{store.message}</span>
                ) : (
                    <span className="text-danger">
                        Loading message from the backend (make sure your python 🐍 backend is running)...
                    </span>
                )}
            </div>

            <button className="btn btn-primary mt-3 me-2" onClick={() => setModal1Open(true)}>
                Abrir ComparativeModal1
            </button>
            <button className="btn btn-success mt-3" onClick={() => setModal3Open(true)}>
                Abrir ComparativeModal3
            </button>

            <ComparativeModal1 isOpen={modal1Open} onClose={() => setModal1Open(false)} />
            <ComparativeModal3 isOpen={modal3Open} onClose={() => setModal3Open(false)} />
        </div>
    );
};