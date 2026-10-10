# RetailVoice AI - Database (browser localStorage, no server)

All data is stored as JSON in the browser's localStorage. Backup / Restore (Settings) exports all keys to one JSON file.

| Key | Type | Fields |
|---|---|---|
| rv_store | object | name, vendor, addr, gst, phone, photo, qrPhoto |
| rv_products_v2 | array | id, name, brand, category, unit, costPerUnit, sellPrice, gst, stock, tanglish, ta, hi, kn, photo |
| rv_bills_v2 | array | id, items[], total, gstTotal, profit, lang, paymentMethod, dateISO, date |
| rv_counter_v2 | number | next bill number |
| rv_kadan | array | id, name, amount, product, date |

bill.items[] = name, qtyBase, qtyDisplay, unitLabel, sellPrice, gst, costPerUnit, productId

Save: saveJSON(key, value) -> localStorage.setItem. Load: loadJSON(key, fallback) -> JSON.parse.
Data stays on the device/browser; clearing browser data deletes it, so use Backup regularly.
