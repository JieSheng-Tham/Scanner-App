import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LabelType, ScanResult, ScanSource } from './types';

const STORAGE_KEY = 'scanner.apiBaseUrl';
export const DEFAULT_API_BASE = 'http://localhost:3001';

export async function getApiBaseUrl(): Promise<string> {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  return (saved?.trim() || DEFAULT_API_BASE).replace(/\/$/, '');
}

export async function setApiBaseUrl(url: string): Promise<string> {
  const cleaned = url.trim().replace(/\/$/, '');
  await AsyncStorage.setItem(STORAGE_KEY, cleaned);
  return cleaned;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const base = await getApiBaseUrl();
  const response = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof payload?.error === 'string'
        ? payload.error
        : `Request failed (${response.status})`;
    throw new Error(message);
  }
  return payload as T;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const data = await request<{ ok: boolean }>('/health');
    return Boolean(data.ok);
  } catch {
    return false;
  }
}

export async function lookupScan(
  code: string,
  labelType: LabelType,
  source: ScanSource
): Promise<ScanResult> {
  return request<ScanResult>('/api/scan', {
    method: 'POST',
    body: JSON.stringify({ code, labelType, source }),
  });
}

export async function fetchDemoCodes(): Promise<
  Array<{
    assetCode: string;
    serial: string;
    qr: string;
    barcode: string;
    rfidEpc: string;
  }>
> {
  const data = await request<{
    codes: Array<{
      assetCode: string;
      serial: string;
      qr: string;
      barcode: string;
      rfidEpc: string;
    }>;
  }>('/api/demo-codes');
  return data.codes;
}
