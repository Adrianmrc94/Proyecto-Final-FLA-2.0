import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApiService from '../services/api';

const useProductFavorites = (product, isOpen, onFavoriteRemoved = null, showToast = null) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Verificar si está en favoritos al abrir
    useEffect(() => {
        if (!isOpen || !product) return;

        const checkFavorite = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const favorites = await ApiService.fetchFavorites();
                const found = favorites.find(fav => fav.product.id === product.id);
                setIsFavorite(!!found);
                setFavoriteId(found ? found.id : null);
            } catch (error) {
                console.error('Error checking favorites:', error);
            }
        };

        checkFavorite();
    }, [isOpen, product]);

    const handleToggleFavorite = async () => {
        // Verificar si el usuario está autenticado
        const token = localStorage.getItem('token');
        if (!token) {
            toast.warning('Debes iniciar sesión para agregar productos a favoritos');
            return;
        }

        setIsProcessing(true);

        try {
            if (isFavorite && favoriteId) {
                // Quitar de favoritos
                await ApiService.removeFavorite(favoriteId);
                setIsFavorite(false);
                toast.info('Eliminado de favoritos');

                // ✅ Notificar al padre cuando se elimina un favorito
                if (onFavoriteRemoved) {
                    onFavoriteRemoved(favoriteId);
                }

                setFavoriteId(null);
            } else {
                // Agregar a favoritos
                const favoriteData = {
                    product_id: product.id,
                    store_id: product.store_id || 1,
                    date_ad: new Date().toISOString().slice(0, 10)
                };

                console.log('🔍 Adding favorite with data:', favoriteData);

                const response = await ApiService.addFavorite(favoriteData);
                setIsFavorite(true);
                setFavoriteId(response.favorite_id);
                toast.success('Agregado a favoritos');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            const errorMessage = error.message || 'Error al actualizar favoritos';
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const buttonConfig = {
        className: `btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'} me-2`,
        content: (
            <>
                {isProcessing && <div className="spinner-border spinner-border-sm me-2"></div>}
                <i className={`bi ${isFavorite ? "bi-heart-fill" : "bi-heart"} me-2`}></i>
                {isFavorite ? 'Quitar' : 'Agregar'}
            </>
        ),
        disabled: isProcessing
    };

    return { isFavorite, handleToggleFavorite, buttonConfig };
};

export default useProductFavorites;