import time
import requests

def bot_simulator():
    count = 1
    while True:
        alert = {
            "header": "🧠 PROFILE BASED LAUNCH",
            "name": f"TestToken{count}",
            "symbol": f"TT{count}",
            "contract": f"0x{count:03x}...abc",
            "creator": f"0x{count:03x}...def",
            "tokens_created": count,
            "bonding": 10 + count,
            "liquidity": 5 + count,
            "avax_used": 2.5 + count,
            "market_cap": f"${10000 + count*100}",
            "deployer_balance": 1.2 + count,
            "profile_linked": True,
            "twitter": f"testuser{count}",
            "followers_arena": 100 + count,
            "followers_twitter": 500 + count,
            "arena_volume": 20 + count,
            "ticket_price_avax": 0.01 + count/100,
            "arena_buys": 5 + count,
            "arena_sells": 2 + count,
            "badges": ["OG", "Whale"] if count % 2 == 0 else ["Newbie"],
            "tier": "green" if count % 3 == 0 else "red",
            "reasons": ["Reason 1", "Reason 2"] if count % 2 == 0 else [],
            "watchlisted": count % 5 == 0,
            "arena_link": "https://arena.trade/",
            "arenapro_link": "https://arenapro.io",
            "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
        }
        try:
            requests.post("http://127.0.0.1:5000/api/alerts", json=alert, timeout=3)
        except Exception as e:
            print(f"[BotSim] Failed to send alert: {e}")
        count += 1
        time.sleep(10)
