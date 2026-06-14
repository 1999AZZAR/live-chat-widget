import os
import subprocess
import json

master_key = "AlphA_00"
os.environ["MEMA_VAULT_MASTER_KEY"] = master_key

def get_secret(service):
    cmd = ["python3", "/home/ubuntu/.agents/skills/mema-vault/scripts/vault.py", "get", service, "--show"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    for line in result.stdout.split('\n'):
        if line.startswith('Pass:'):
            return line.split('Pass:')[1].strip()
    return ""

token = get_secret("cloudflare_token")
account_id = get_secret("cloudflare_account")

os.environ["CLOUDFLARE_API_TOKEN"] = token
os.environ["CLOUDFLARE_ACCOUNT_ID"] = account_id

print("Reading systemInstruction.txt...")
with open("src/systemInstruction.txt", "r") as f:
    persona_content = f.read()

print("Writing persona to SYSTEM_PROMPT KV namespace...")
# The SYSTEM_PROMPT KV id from wrangler.toml is c5b17d99100540cab8837900b61d9c76
cmd = [
    "npx", "wrangler", "kv", "key", "put",
    "--binding=SYSTEM_PROMPT",
    "persona:default",
    persona_content
]
subprocess.run(cmd, env=os.environ, check=False)
