# Shimmer Strip, set up for Roshan (India)

Changes from the original:
- Weather: Chandrapur (IST). For Hyderabad weeks, edit `WEATHER_LATITUDE/LONGITUDE` in `src/config.js` to 17.45 / 78.38 and set `WEATHER_PLACE`.
- Temperature bands for India: Hot >= 32C, Warm >= 26C, Mild >= 20C, Cold below. Rain likely (>= 60%) makes the day "Rainy".
- Categories, vibes and storage locations suited to Indian menswear (kurta = Top, kurta-pyjama/sherwani = Matching Set, blazer/Nehru jacket = Jacket).
- Security: random per-install unlock token instead of the fixed public one; server listens only on this Mac by default.
- Tool descriptions no longer reference the original owner.

Install: `bash install-mac.sh`, then quit and reopen Claude.
Phone access on home Wi-Fi (optional): run with `HOST=0.0.0.0` - anyone on that Wi-Fi could then edit the wardrobe.

## Wishlist (pieces to buy)
Three extra Claude tools: `get_wishlist`, `add_to_wishlist`, `update_wishlist_item`.
Wishlist pieces are stored separately from your real clothes, so they never show up in outfit suggestions until you mark them bought.
