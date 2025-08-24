
"""
VAPID Key Generation Script for OHSHIT Alerts
Usage:
  python generate_vapid_keys.py           # Saves to .env by default
  python generate_vapid_keys.py output.env  # Saves to output.env
"""

import sys
import base64
import os

def check_cryptography():
    """Check if cryptography is installed, else suggest installing it."""
    try:
        import cryptography
    except ImportError:
        print("[ERROR] The 'cryptography' package is required. Please add it to requirements.txt and install it:")
        print("    pip install cryptography")
        sys.exit(1)

def generate_vapid_keys():
    """Generate VAPID public/private keys and return as base64url strings (no padding)."""
    from cryptography.hazmat.primitives import serialization
    from cryptography.hazmat.primitives.asymmetric import ec
    try:
        private_key = ec.generate_private_key(ec.SECP256R1())
        private_bytes = private_key.private_numbers().private_value.to_bytes(32, 'big')
        private_key_b64 = base64.urlsafe_b64encode(private_bytes).rstrip(b'=').decode('utf-8')

        public_key = private_key.public_key()
        public_bytes = public_key.public_bytes(
            encoding=serialization.Encoding.X962,
            format=serialization.PublicFormat.UncompressedPoint
        )
        public_key_b64 = base64.urlsafe_b64encode(public_bytes).rstrip(b'=').decode('utf-8')
        return private_key_b64, public_key_b64
    except Exception as e:
        raise RuntimeError(f"Failed to generate VAPID keys: {e}")

def save_keys_to_file(private_key, public_key, filename):
    """Save VAPID keys to a file in .env format."""
    try:
        with open(filename, 'a', encoding='utf-8') as f:
            f.write(f"VAPID_PRIVATE_KEY={private_key}\n")
            f.write(f"VAPID_PUBLIC_KEY={public_key}\n")
        print(f"[INFO] VAPID keys saved to {filename}")
    except Exception as e:
        print(f"[ERROR] Could not write to {filename}: {e}")

def main():
    """Main entry point: generate VAPID keys and save to .env or specified file."""
    check_cryptography()
    try:
        private_key, public_key = generate_vapid_keys()
    except Exception as e:
        print(f"[ERROR] {e}")
        sys.exit(1)

    output_file = sys.argv[1] if len(sys.argv) > 1 else '.env'
    save_keys_to_file(private_key, public_key, output_file)

if __name__ == "__main__":
    main()
