
import click
from api.models import db, User

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass

    @app.cli.command("import-mercadona")
    @click.option("--postal-code", "-p", default="28020", help="Código postal para la búsqueda de productos")
    @click.option("--limit", "-l", default=None, type=int, help="Límite de categorías a procesar (recomendado 5-10 para pruebas)")
    def import_mercadona_command(postal_code, limit):
        """Importa productos desde la API de Mercadona
        
        Ejemplos:
        flask import-mercadona                          # Madrid (28020), todas las categorías
        flask import-mercadona -p 28001                 # Madrid centro
        flask import-mercadona -p 08001                 # Barcelona
        flask import-mercadona -p 28020 -l 5           # Solo 5 categorías (prueba rápida)
        """
        from api.scripts.import_mercadona_products import import_mercadona_products
        print(f"🛒 Iniciando importación de productos de Mercadona (CP: {postal_code})...")
        if limit:
            print(f"📊 Procesando solo {limit} categorías")
        import_mercadona_products(postal_code=postal_code, limit_categories=limit)
        print("✅ Importación de Mercadona completada!")

    @app.cli.command("import-simulated-stores")
    @click.option("--postal-code", "-p", default="28020", help="Código postal para las tiendas simuladas")
    def import_simulated_stores_command(postal_code):
        """Genera productos simulados para DIA, Carrefour y Alcampo basándose en Mercadona
        
        Este comando toma los productos reales de Mercadona y crea versiones con precios
        variados para otros supermercados, permitiendo demostrar la funcionalidad de comparación.
        
        Ejemplos:
        flask import-simulated-stores                   # Madrid (28020)
        flask import-simulated-stores -p 28001          # Madrid centro
        flask import-simulated-stores -p 08001          # Barcelona
        """
        from api.scripts.import_simulated_stores import generate_simulated_products
        print(f"🎨 Iniciando generación de tiendas y productos simulados (CP: {postal_code})...")
        generate_simulated_products(postal_code=postal_code)
        print("✅ Generación de productos simulados completada!")