/**
 * Sample inventory records.
 * Labels encode one of: assetCode, serial, qrPayload, barcodePayload, or rfidEpc.
 */
export const devices = [
  {
    id: 'dev-038',
    identity: {
      hostname: 'my-kl-pc-038.my.local',
      assetName: 'Lenovo ThinkCentre M70q',
      ip: '10.60.1.57',
      mac: '2C:11:DF:97:3C:FE',
      serial: 'SN-EP-0520638',
      assetCode: 'AST-EP-038',
      sku: 'M70Q-G5',
      assigned: 'LongHao Xu',
    },
    posture: {
      os: 'Windows 11 24H2',
      build: null,
      severity: 'Info (1) · N/A',
      severityLevel: 'info',
      lastPatch: '10 Nov 2026',
      version: '25H2',
      sla: null,
      countryCampus: 'Malaysia / Kuala Lumpur Campus',
      cia: '10 (C4/I3/A3)',
    },
    labels: {
      qr: 'AST-EP-038',
      barcode: 'AST-EP-038',
      rfidEpc: 'E280116060000203ABCD038',
    },
  },
  {
    id: 'dev-039',
    identity: {
      hostname: 'my-kl-pc-039.my.local',
      assetName: 'Dell OptiPlex 7090',
      ip: '10.60.1.58',
      mac: 'A4:BB:6D:12:44:01',
      serial: 'SN-EP-0520639',
      assetCode: 'AST-EP-039',
      sku: 'OPX-7090',
      assigned: 'Aisha Rahman',
    },
    posture: {
      os: 'Windows 11 23H2',
      build: '22631.4317',
      severity: 'Low (2) · N/A',
      severityLevel: 'low',
      lastPatch: '02 Nov 2026',
      version: '23H2',
      sla: 'P2',
      countryCampus: 'Malaysia / Kuala Lumpur Campus',
      cia: '8 (C3/I3/A2)',
    },
    labels: {
      qr: 'AST-EP-039',
      barcode: 'AST-EP-039',
      rfidEpc: 'E280116060000203ABCD039',
    },
  },
  {
    id: 'dev-040',
    identity: {
      hostname: 'my-sg-lt-012.my.local',
      assetName: 'Lenovo ThinkPad T14 Gen 5',
      ip: '10.70.2.14',
      mac: '3C:58:C2:88:10:AA',
      serial: 'SN-SG-8812012',
      assetCode: 'AST-SG-012',
      sku: 'T14-G5',
      assigned: 'Wei Chen',
    },
    posture: {
      os: 'Windows 11 24H2',
      build: '26100.2033',
      severity: 'Medium (4) · Open',
      severityLevel: 'medium',
      lastPatch: '28 Oct 2026',
      version: '24H2',
      sla: 'P1',
      countryCampus: 'Singapore / Marina Campus',
      cia: '12 (C4/I4/A4)',
    },
    labels: {
      qr: 'AST-SG-012',
      barcode: 'AST-SG-012',
      rfidEpc: 'E280116060000203ABCD012',
    },
  },
];
