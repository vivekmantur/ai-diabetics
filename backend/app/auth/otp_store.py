import time

otp_db = {}


def store_otp(phone: str, otp: str, expire_seconds: int):
    otp_db[phone] = {
        "otp": otp,
        "expires": time.time() + expire_seconds,
    }


def verify_otp(phone: str, otp: str) -> bool:
    data = otp_db.get(phone)

    if not data:
        return False

    if time.time() > data["expires"]:
        return False

    return data["otp"] == otp
