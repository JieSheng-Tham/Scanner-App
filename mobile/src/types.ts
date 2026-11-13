export type LabelType = 'qr' | 'barcode' | 'rfid';

export type ScanSource = 'camera' | 'external-scanner' | 'manual';

export interface DeviceIdentity {
  hostname: string;
  assetName: string;
  ip: string;
  mac: string;
  serial: string;
  assetCode: string;
  sku: string;
  assigned: string;
}

export interface DevicePosture {
  os: string;
  build: string | null;
  severity: string;
  severityLevel: 'info' | 'low' | 'medium' | 'high' | string;
  lastPatch: string;
  version: string;
  sla: string | null;
  countryCampus: string;
  cia: string;
}

export interface Device {
  id: string;
  identity: DeviceIdentity;
  posture: DevicePosture;
  labels?: {
    hasQr?: boolean;
    hasBarcode?: boolean;
    hasRfid?: boolean;
  };
}

export interface ScanResult {
  scan: {
    id: string;
    code: string;
    source: string;
    labelType: string;
    found: boolean;
    deviceId: string | null;
    scannedAt: string;
  };
  device: Device;
}
