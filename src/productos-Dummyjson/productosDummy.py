import requests
import json

url = 'https://dummyjson.com/products?limit=0&select=title,price,description,category,images,stock,rating'

response = requests.get(url)

if response.status_code == 200:
    try:
        data = response.json()
        # Guardar la respuesta en un archivo JSON
        with open('products.json', 'w') as json_file:
            json.dump(data, json_file, indent=4)
        print("Los datos se han guardado correctamente en products.json")
    except json.JSONDecodeError as e:
        print(f"Error al parsear JSON: {e}")
else:
    print(f"Error: {response.status_code}")