from flask import Blueprint, send_file, abort
import requests
from io import BytesIO

images_bp = Blueprint("images", __name__)

@images_bp.route('/image-proxy', methods=['GET'])
def proxy_image():
    """
    Proxy endpoint para servir imágenes de Mercadona evitando problemas de CORS.
    Uso: /api/image-proxy?url=https://prod-mercadona.imgix.net/images/...
    """
    from flask import request
    
    image_url = request.args.get('url')
    if not image_url:
        abort(400, 'URL parameter is required')
    
    # Validar que la URL sea de Mercadona
    if 'mercadona.imgix.net' not in image_url:
        abort(403, 'Only Mercadona images are allowed')
    
    try:
        # Hacer petición a la URL de la imagen
        response = requests.get(image_url, timeout=10, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        response.raise_for_status()
        
        # Devolver la imagen
        return send_file(
            BytesIO(response.content),
            mimetype=response.headers.get('Content-Type', 'image/jpeg'),
            as_attachment=False
        )
    except requests.RequestException as e:
        print(f"Error fetching image: {e}")
        abort(500, 'Error fetching image')
