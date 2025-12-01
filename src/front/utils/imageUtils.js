/**
 * Construye la URL completa de la imagen para el proxy del backend
 * @param {string} image - URL de la imagen (puede ser relativa o completa)
 * @returns {string} - URL completa de la imagen
 */
export const getImageUrl = (image) => {
    if (!image) return 'https://via.placeholder.com/300?text=Sin+Imagen';
    
    // Si la imagen es una ruta relativa (del proxy), agregarle el backend URL
    if (image.startsWith('/api/image-proxy')) {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
        // Asegurarse de que backendUrl no termine con /
        const cleanUrl = backendUrl.replace(/\/$/, '');
        return `${cleanUrl}${image}`;
    }
    
    // Si es una URL completa, devolverla tal cual
    return image;
};

/**
 * Obtiene la URL de imagen de un producto normalizando diferentes formatos
 * @param {object} product - Objeto del producto
 * @returns {string} - URL de la imagen
 */
export const getProductImageUrl = (product) => {
    const image = (product.images && product.images[0]) || 
                  product.image || 
                  product.img ||
                  null;
    
    return getImageUrl(image);
};
