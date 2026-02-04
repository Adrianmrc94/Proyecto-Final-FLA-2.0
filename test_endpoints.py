import requests

BASE_URL = "http://localhost:3001"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczNzkwNDA2MCwianRpIjoiZTY3NmU5YmQtMDJjZi00MGMxLTk5MTktZjA4MzZlNDc3ZDc5IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzM3OTA0MDYwLCJjc3JmIjoiNGY1Y2FjZWYtNmMzYi00OTYwLWIzNDAtNjAxOTNhNjg4YjJmIiwiZXhwIjoxNzM3OTExMjYwfQ.o7KrHCHZEV5v-kH1JoIqN2v-w0nN0zEXANgabBzSJAY"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

print("🧪 Probando endpoints del módulo Users...\n")

# Test 1: GET /user/profile
print("1️⃣ GET /api/user/profile")
try:
    response = requests.get(f"{BASE_URL}/api/user/profile", headers=headers)
    print(f"   Status: {response.status_code}")
    if response.ok:
        print(f"   ✅ Funciona - Usuario: {response.json().get('email')}")
    else:
        print(f"   ❌ Error: {response.text}")
except Exception as e:
    print(f"   ❌ Excepción: {e}")

print()

# Test 2: POST /user/scrape-postal-code
print("2️⃣ POST /api/user/scrape-postal-code")
try:
    response = requests.post(
        f"{BASE_URL}/api/user/scrape-postal-code",
        headers=headers,
        json={"postal_code": "28015"}
    )
    print(f"   Status: {response.status_code}")
    if response.ok or response.status_code == 202:
        data = response.json()
        print(f"   ✅ Funciona - needs_scraping: {data.get('needs_scraping')}")
        if data.get('job_id'):
            print(f"   📋 Job ID: {data.get('job_id')}")
    else:
        print(f"   ❌ Error: {response.text}")
except Exception as e:
    print(f"   ❌ Excepción: {e}")

print()

# Test 3: GET /scraping/status (con job fake)
print("3️⃣ GET /api/scraping/status/test-job-id")
try:
    response = requests.get(
        f"{BASE_URL}/api/scraping/status/test-job-id",
        headers=headers
    )
    print(f"   Status: {response.status_code}")
    if response.status_code == 404:
        print(f"   ✅ Endpoint existe (devuelve 404 para job inexistente)")
    elif response.ok:
        print(f"   ✅ Funciona: {response.json()}")
    else:
        print(f"   ❌ Error: {response.text}")
except Exception as e:
    print(f"   ❌ Excepción: {e}")

print("\n✨ Prueba completada")
