import os
import subprocess

master_key = "AlphA_00"
os.environ["MEMA_VAULT_MASTER_KEY"] = master_key

def get_secret(service):
    cmd = ["python3", "/home/ubuntu/.agents/skills/mema-vault/scripts/vault.py", "get", service, "--show"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.stdout.strip()

token = get_secret("cloudflare_token")
account_id = get_secret("cloudflare_account")

os.environ["CLOUDFLARE_API_TOKEN"] = token
os.environ["CLOUDFLARE_ACCOUNT_ID"] = account_id

# Let's try listing first to test the connection and credentials
print("Testing credentials by listing KV namespaces...")
cmd_list = ["npx", "wrangler", "kv", "namespace", "list"]
result_list = subprocess.run(cmd_list, env=os.environ, capture_output=True, text=True)
print(f"List result code: {result_list.returncode}")
print(f"List stdout:\n{result_list.stdout}")
print(f"List stderr:\n{result_list.stderr}")

if result_list.returncode == 0:
    print("\nAttempting to create namespace...")
    cmd = ["npx", "wrangler", "kv", "namespace", "create", "RESPONSE_CACHE_KV"]
    subprocess.run(cmd, env=os.environ, check=False)
