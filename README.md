# Asset Scanner

Expo mobile app + Node API that scans **QR**, **Code 128 barcode**, and **RFID EPC** labels, then opens the matching device inventory record (identity + posture).

## Stack

- `mobile/` — Expo (React Native) scanner UI
- `server/` — Express API with sample device data

## How scanning works

| Label | How the app reads it |
| --- | --- |
| QR code | Phone camera (`expo-camera`) |
| Bar code | Phone camera, or a USB/Bluetooth handheld scanner in keyboard-wedge mode |
| RFID tag | External RFID reader in keyboard-wedge mode (phones cannot read EPC tags with the camera) |

Scanned values are looked up against asset code, serial, hostname, QR payload, barcode payload, or RFID EPC.

## Quick start

### 1. Start the API

```bash
cd server
npm install
npm run dev
```

Server listens on `http://localhost:3001` and prints LAN IPs for phone use.

Useful endpoints:

- `GET /health`
- `GET /api/demo-codes`
- `POST /api/scan` with `{ "code": "AST-EP-038", "labelType": "qr", "source": "camera" }`

### 2. Start Expo

```bash
cd mobile
npm install
npm start
```

Open with Expo Go.

### 3. Point the app at the server

In the app: **Server connection**

- Emulator / same machine: `http://localhost:3001` (Android emulator may need `http://10.0.2.2:3001`)
- Physical phone: `http://YOUR_PC_LAN_IP:3001` (phone and PC on the same Wi‑Fi)

Tap **Save & test**.

## Demo codes

| Asset | QR / barcode | RFID EPC |
| --- | --- | --- |
| AST-EP-038 | `AST-EP-038` | `E280116060000203ABCD038` |
| AST-EP-039 | `AST-EP-039` | `E280116060000203ABCD039` |
| AST-SG-012 | `AST-SG-012` | `E280116060000203ABCD012` |

`AST-EP-038` matches the sample Lenovo ThinkCentre record (hostname `my-kl-pc-038.my.local`).

## Connecting a hardware scanner

1. Pair or plug in the scanner / RFID reader.
2. Confirm it is in **HID keyboard / keyboard wedge** mode.
3. In the app choose **Bar code** or **RFID tag**, then **Use connected scanner**.
4. Keep the input focused and scan — most readers append Enter, which triggers lookup.

## Project scripts

From the repo root:

```bash
npm run server:dev
npm run mobile
```
