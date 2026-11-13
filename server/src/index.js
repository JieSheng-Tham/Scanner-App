import cors from 'cors';
import express from 'express';
import os from 'os';
import { devices } from './data/devices.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

const scanLog = [];

function normalizeCode(raw) {
  return String(raw ?? '')
    .trim()
    .replace(/^https?:\/\/[^\s]+\/(asset|device)\//i, '')
    .toUpperCase();
}

function findDevice(rawCode) {
  const code = normalizeCode(rawCode);
  if (!code) return null;

  return (
    devices.find((device) => {
      const { identity, labels } = device;
      const candidates = [
        identity.assetCode,
        identity.serial,
        identity.hostname,
        labels.qr,
        labels.barcode,
        labels.rfidEpc,
      ]
        .filter(Boolean)
        .map((value) => String(value).toUpperCase());

      return candidates.includes(code);
    }) ?? null
  );
}

function publicDevice(device) {
  const { labels, ...rest } = device;
  return {
    ...rest,
    labels: {
      hasQr: Boolean(labels.qr),
      hasBarcode: Boolean(labels.barcode),
      hasRfid: Boolean(labels.rfidEpc),
    },
  };
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'scanner-server', deviceCount: devices.length });
});

app.get('/api/devices', (_req, res) => {
  res.json({ devices: devices.map(publicDevice) });
});

app.get('/api/devices/:code', (req, res) => {
  const device = findDevice(req.params.code);
  if (!device) {
    return res.status(404).json({
      error: 'Device not found',
      code: normalizeCode(req.params.code),
    });
  }
  return res.json({ device: publicDevice(device) });
});

app.post('/api/scan', (req, res) => {
  const { code, source = 'unknown', labelType = 'unknown' } = req.body ?? {};
  const normalized = normalizeCode(code);

  if (!normalized) {
    return res.status(400).json({ error: 'Missing scan code' });
  }

  const device = findDevice(normalized);
  const entry = {
    id: `scan-${Date.now()}`,
    code: normalized,
    source,
    labelType,
    found: Boolean(device),
    deviceId: device?.id ?? null,
    scannedAt: new Date().toISOString(),
  };

  scanLog.unshift(entry);
  if (scanLog.length > 200) scanLog.length = 200;

  if (!device) {
    return res.status(404).json({
      error: 'No device matched this scan',
      scan: entry,
    });
  }

  return res.json({
    scan: entry,
    device: publicDevice(device),
  });
});

app.get('/api/scans', (_req, res) => {
  res.json({ scans: scanLog.slice(0, 50) });
});

app.get('/api/demo-codes', (_req, res) => {
  res.json({
    tip: 'Use these values with camera, barcode scanner, or RFID reader keyboard-wedge input',
    codes: devices.map((device) => ({
      assetCode: device.identity.assetCode,
      serial: device.identity.serial,
      qr: device.labels.qr,
      barcode: device.labels.barcode,
      rfidEpc: device.labels.rfidEpc,
      hostname: device.identity.hostname,
    })),
  });
});

function lanAddresses() {
  const nets = os.networkInterfaces();
  const results = [];
  for (const entries of Object.values(nets)) {
    for (const entry of entries ?? []) {
      if (entry.family === 'IPv4' && !entry.internal) {
        results.push(entry.address);
      }
    }
  }
  return results;
}

app.listen(PORT, '0.0.0.0', () => {
  const addresses = lanAddresses();
  console.log(`Scanner API listening on http://localhost:${PORT}`);
  for (const ip of addresses) {
    console.log(`  phone / LAN: http://${ip}:${PORT}`);
  }
  console.log('Demo codes: GET /api/demo-codes');
});
