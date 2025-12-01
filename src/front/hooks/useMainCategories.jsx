import { useState, useEffect } from 'react';
import ApiService from '../services/api';

/**
 * Hook para manejar categorías principales y subcategorías
 */
const useMainCategories = () => {
    const [mainCategories, setMainCategories] = useState([]);
    const [loadingMainCategories, setLoadingMainCategories] = useState(false);
    const [selectedMainCategory, setSelectedMainCategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [loadingSubcategories, setLoadingSubcategories] = useState(false);

    // Cargar categorías principales
    useEffect(() => {
        const loadMainCategories = async () => {
            setLoadingMainCategories(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/main-categories`);
                const data = await response.json();
                setMainCategories(data);
            } catch (error) {
                console.error('Error loading main categories:', error);
            } finally {
                setLoadingMainCategories(false);
            }
        };

        loadMainCategories();
    }, []);

    // Cargar subcategorías cuando se selecciona una categoría principal
    useEffect(() => {
        if (!selectedMainCategory) {
            setSubcategories([]);
            return;
        }

        const loadSubcategories = async () => {
            setLoadingSubcategories(true);
            try {
                const categorySlug = selectedMainCategory.replace(/\s+/g, '-');
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/main-categories/${categorySlug}/subcategories`
                );
                const data = await response.json();
                setSubcategories(data);
            } catch (error) {
                console.error('Error loading subcategories:', error);
            } finally {
                setLoadingSubcategories(false);
            }
        };

        loadSubcategories();
    }, [selectedMainCategory]);

    return {
        mainCategories,
        loadingMainCategories,
        selectedMainCategory,
        setSelectedMainCategory,
        subcategories,
        loadingSubcategories
    };
};

export default useMainCategories;
