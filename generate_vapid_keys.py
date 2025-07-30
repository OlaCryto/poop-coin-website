from cryptography.hazmat.primitives import serialization
# VAPID Key Generation Script for $POOP Alerts
"""
VAPID Key Generation Script for $POOP Alerts
Usage: python generate_vapid_keys.py
"""
from cryptography.hazmat.primitives.asymmetric import ec
import base64

def generate_vapid_keys():
    # Generate private key
    private_key = ec.generate_private_key(ec.SECP256R1())
    private_bytes = private_key.private_numbers().private_value.to_bytes(32, 'big')
    private_key_b64 = base64.urlsafe_b64encode(private_bytes).rstrip(b'=').decode('utf-8')

    # Generate public key
    public_key = private_key.public_key()
    public_bytes = public_key.public_bytes(
        encoding=serialization.Encoding.X962,
        format=serialization.PublicFormat.UncompressedPoint
    )
    public_key_b64 = base64.urlsafe_b64encode(public_bytes).rstrip(b'=').decode('utf-8')

    print("VAPID_PRIVATE_KEY:", private_key_b64)
    print("VAPID_PUBLIC_KEY:", public_key_b64)

if __name__ == "__main__":
    generate_vapid_keys()
