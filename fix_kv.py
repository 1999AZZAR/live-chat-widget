import os
import subprocess

master_key = "AlphA_00"
os.environ["MEMA_VAULT_MASTER_KEY"] = master_key

def get_secret(service):
    cmd = ["python3", "/home/ubuntu/.agents/skills/mema-vault/scripts/vault.py", "get", service, "--show"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    # The output format is:
    # Service: cloudflare_token
    # User: token
    # Pass: <the_actual_token>
    # Meta: ...
    for line in result.stdout.split('\n'):
        if line.startswith('Pass:'):
            return line.split('Pass:')[1].strip()
    return ""

token = get_secret("cloudflare_token")
account_id = get_secret("cloudflare_account")

os.environ["CLOUDFLARE_API_TOKEN"] = token
os.environ["CLOUDFLARE_ACCOUNT_ID"] = account_id

print("Attempting to create namespace RESPONSE_CACHE_KV...")
cmd = ["npx", "wrangler", "kv", "namespace", "create", "RESPONSE_CACHE_KV"]
subprocess.run(cmd, env=os.environ, check=False)
