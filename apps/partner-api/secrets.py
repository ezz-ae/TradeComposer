
import os, base64, json
from typing import Optional, Dict, Any
from google.cloud import secretmanager, kms_v1
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

PROJECT_ID = os.getenv('FIREBASE_PROJECT_ID') or os.getenv('GCLOUD_PROJECT')
GSM_PREFIX = os.getenv('GSM_PREFIX', 'tradecomposer')
KMS_KEY = os.getenv('KMS_KEY', '')  # projects/.../locations/.../keyRings/.../cryptoKeys/...

def _gsm_client():
    return secretmanager.SecretManagerServiceClient()

def _kms_client():
    return kms_v1.KeyManagementServiceClient()

def gsm_access(name: str) -> Optional[str]:
    # name: logical name, e.g., "conn-binance-UID-ORGID"
    client = _gsm_client()
    sec_name = f'projects/{PROJECT_ID}/secrets/{GSM_PREFIX}-{name}/versions/latest'
    try:
        resp = client.access_secret_version(name=sec_name)
        return resp.payload.data.decode('utf-8')
    except Exception:
        return None

def gsm_store(name: str, value: str) -> str:
    client = _gsm_client()
    sec_name = f'projects/{PROJECT_ID}/secrets/{GSM_PREFIX}-{name}'
    try:
        client.get_secret(name=sec_name)
    except Exception:
        client.create_secret(parent=f'projects/{PROJECT_ID}', secret_id=f'{GSM_PREFIX}-{name}', secret={'replication': {'automatic': {}}})
    ver = client.add_secret_version(parent=sec_name, payload={'data': value.encode('utf-8')})
    return ver.name

def kms_encrypt(plaintext: bytes, aad: bytes=b'') -> Dict[str, str]:
    if not KMS_KEY:
        # fallback to local AESGCM with derived key
        key = AESGCM.generate_key(bit_length=256)
        aes = AESGCM(key)
        nonce = os.urandom(12)
        ct = aes.encrypt(nonce, plaintext, aad)
        return {
            'alg':'AESGCM-local',
            'nonce': base64.b64encode(nonce).decode(),
            'key': base64.b64encode(key).decode(),  # store only in local dev!
            'ct': base64.b64encode(ct).decode()
        }
    client = _kms_client()
    resp = client.encrypt(request={'name': KMS_KEY, 'plaintext': plaintext, 'additional_authenticated_data': aad})
    return {'alg':'KMS', 'ct': base64.b64encode(resp.ciphertext).decode()}

def kms_decrypt(obj: Dict[str, str], aad: bytes=b'') -> bytes:
    if obj.get('alg') == 'AESGCM-local':
        aes = AESGCM(base64.b64decode(obj['key']))
        nonce = base64.b64decode(obj['nonce'])
        ct = base64.b64decode(obj['ct'])
        return aes.decrypt(nonce, ct, aad)
    client = _kms_client()
    ct = base64.b64decode(obj['ct'])
    resp = client.decrypt(request={'name': os.getenv('KMS_KEY'), 'ciphertext': ct, 'additional_authenticated_data': aad})
    return resp.plaintext
