import { useState, useEffect } from 'react';
import ApiService from '../services/api';

/**
 * Hook personalizado para gestionar comparativas favoritas
 */
export default function useComparativeFavorites() {
    const [comparisons, setComparisons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Obtener todas las comparativas favoritas del usuario
     */
    const fetchComparisons = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay sesión activa');
            }

            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${BACKEND_URL}/api/favorite-comparisons`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar comparativas');
            }

            const data = await response.json();
            setComparisons(data);
            return data;
        } catch (err) {
            setError(err.message);
            console.error('Error fetching comparisons:', err);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Guardar una nueva comparativa favorita
     * @param {string} name - Nombre de la comparativa
     * @param {Array<number>} productIds - IDs de los productos a comparar
     */
    const addComparison = async (name, productIds, showToast = null) => {
        try {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Debes iniciar sesión para guardar comparativas');
            }

            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${BACKEND_URL}/api/favorite-comparisons`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    product_ids: productIds
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Error al guardar comparativa');
            }

            // Actualizar la lista de comparativas
            setComparisons(prev => [...prev, data.comparison]);

            if (showToast) {
                showToast('✅ Comparativa guardada en favoritos', 'success');
            }

            return data.comparison;
        } catch (err) {
            setError(err.message);
            console.error('Error adding comparison:', err);

            if (showToast) {
                showToast(`❌ ${err.message}`, 'error');
            }

            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Eliminar una comparativa favorita
     * @param {number} comparisonId - ID de la comparativa a eliminar
     */
    const deleteComparison = async (comparisonId, showToast = null) => {
        try {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay sesión activa');
            }

            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${BACKEND_URL}/api/favorite-comparisons/${comparisonId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.msg || 'Error al eliminar comparativa');
            }

            // Actualizar la lista de comparativas
            setComparisons(prev => prev.filter(comp => comp.id !== comparisonId));

            if (showToast) {
                showToast('✅ Comparativa eliminada', 'success');
            }

            return true;
        } catch (err) {
            setError(err.message);
            console.error('Error deleting comparison:', err);

            if (showToast) {
                showToast(`❌ ${err.message}`, 'error');
            }

            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Actualizar el nombre de una comparativa
     * @param {number} comparisonId - ID de la comparativa
     * @param {string} newName - Nuevo nombre
     */
    const updateComparison = async (comparisonId, newName, showToast = null) => {
        try {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay sesión activa');
            }

            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${BACKEND_URL}/api/favorite-comparisons/${comparisonId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newName })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Error al actualizar comparativa');
            }

            // Actualizar la lista de comparativas
            setComparisons(prev => prev.map(comp =>
                comp.id === comparisonId ? data.comparison : comp
            ));

            if (showToast) {
                showToast('✅ Comparativa actualizada', 'success');
            }

            return data.comparison;
        } catch (err) {
            setError(err.message);
            console.error('Error updating comparison:', err);

            if (showToast) {
                showToast(`❌ ${err.message}`, 'error');
            }

            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        comparisons,
        isLoading,
        error,
        fetchComparisons,
        addComparison,
        deleteComparison,
        updateComparison
    };
}
