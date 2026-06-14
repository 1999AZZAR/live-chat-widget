import os
import subprocess
import requests

master_key = "AlphA_00"
os.environ["MEMA_VAULT_MASTER_KEY"] = master_key

def get_secret(service):
    cmd = ["python3", "/home/ubuntu/.agents/skills/mema-vault/scripts/vault.py", "get", service, "--show"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.stdout.strip()

token = get_secret("cloudflare_token")

url = "https://api.cloudflare.com/client/v4/user/tokens/verify"
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
