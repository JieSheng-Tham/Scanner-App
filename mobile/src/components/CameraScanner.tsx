import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  CameraView,
  scanFromURLAsync,
  useCameraPermissions,
  type BarcodeType,
} from 'expo-camera';
import type { LabelType } from '../types';
import { colors } from '../theme';

interface Props {
  labelType: LabelType;
  busy: boolean;
  error: string | null;
  onScanned: (code: string) => void;
  onUseExternal: () => void;
  onBack: () => void;
}

const DEMO_CODE = 'AST-EP-038';

const QR_TYPES: BarcodeType[] = ['qr'];
const BARCODE_TYPES: BarcodeType[] = [
  'qr',
  'code128',
  'code39',
  'code93',
  'ean13',
  'ean8',
  'upc_a',
  'upc_e',
  'itf14',
];

export function CameraScanner({
  labelType,
  busy,
  error,
  onScanned,
  onUseExternal,
  onBack,
}: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [locked, setLocked] = useState(false);
  const [facing, setFacing] = useState<'front' | 'back'>(
    Platform.OS === 'web' ? 'front' : 'back'
  );
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [scanHint, setScanHint] = useState<string | null>(null);
  const cooldown = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (cooldown.current) clearTimeout(cooldown.current);
    };
  }, []);

  const barcodeTypes = labelType === 'qr' ? QR_TYPES : BARCODE_TYPES;
  const title = labelType === 'qr' ? 'Scan QR code' : 'Scan bar code';

  const handleDetected = (data: string) => {
    const code = data.trim();
    if (!code) return;
    setLastSeen(code);
    setScanHint(null);
    if (locked || busy) return;
    setLocked(true);
    onScanned(code);
    cooldown.current = setTimeout(() => setLocked(false), 2200);
  };

  const onPickImage = async (file: File) => {
    try {
      setScanHint('Reading image…');
      const url = URL.createObjectURL(file);
      const results = await scanFromURLAsync(url, barcodeTypes);
      URL.revokeObjectURL(url);
      if (!results.length) {
        setScanHint('No QR/barcode found in that image. Try a sharper photo or Use demo code.');
        return;
      }
      handleDetected(results[0].data);
    } catch (err) {
      setScanHint(err instanceof Error ? err.message : 'Could not read image');
    }
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.teal} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>
          Camera access is needed to scan {labelType === 'qr' ? 'QR codes' : 'barcodes'}.
        </Text>
        <Pressable style={styles.primaryBtn} onPress={requestPermission}>
          <Text style={styles.primaryText}>Allow camera</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => handleDetected(DEMO_CODE)}
        >
          <Text style={styles.secondaryText}>Use demo code instead</Text>
        </Pressable>
        <Pressable onPress={onBack} style={styles.linkBtn}>
          <Text style={styles.link}>Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={styles.link}>Back</Text>
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>
          Laptop webcams struggle with barcodes shown on another phone screen (glare + low
          contrast). Use a printed label, a QR on paper, upload a clear photo, or tap demo.
        </Text>
      </View>

      <View style={styles.cameraShell}>
        <CameraView
          key={facing}
          style={styles.camera}
          facing={facing}
          barcodeScannerSettings={{ barcodeTypes }}
          onCameraReady={() => setCameraReady(true)}
          onBarcodeScanned={({ data }) => handleDetected(data)}
        />
        <View pointerEvents="none" style={styles.frame} />
        {(busy || locked) && (
          <View style={styles.overlay}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.overlayText}>Looking up device…</Text>
          </View>
        )}
      </View>

      <Text style={styles.status}>
        {!cameraReady
          ? 'Starting camera…'
          : lastSeen
            ? `Detected: ${lastSeen}`
            : 'Camera ready — no code detected yet'}
      </Text>
      {scanHint ? <Text style={styles.hint}>{scanHint}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.actions}>
        <Pressable
          style={styles.primaryBtn}
          disabled={busy}
          onPress={() => handleDetected(DEMO_CODE)}
        >
          <Text style={styles.primaryText}>Use demo code ({DEMO_CODE})</Text>
        </Pressable>

        {Platform.OS === 'web' ? (
          <Pressable
            style={styles.secondaryBtn}
            onPress={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = () => {
                const file = input.files?.[0];
                if (file) void onPickImage(file);
              };
              input.click();
            }}
          >
            <Text style={styles.secondaryText}>Upload image to scan</Text>
          </Pressable>
        ) : null}

        <View style={styles.row}>
          <Pressable
            style={styles.secondaryBtn}
            onPress={() => {
              setCameraReady(false);
              setFacing((current) => (current === 'front' ? 'back' : 'front'));
            }}
          >
            <Text style={styles.secondaryText}>Flip ({facing})</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={onUseExternal}>
            <Text style={styles.secondaryText}>Type code</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 20,
  },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  header: {
    marginBottom: 12,
    gap: 6,
  },
  title: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: '700',
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  cameraShell: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#111',
    minHeight: Platform.OS === 'web' ? 360 : 320,
    position: 'relative',
  },
  camera: {
    width: '100%',
    height: '100%',
    minHeight: Platform.OS === 'web' ? 360 : 320,
  },
  frame: {
    position: 'absolute',
    top: '18%',
    left: '15%',
    right: '15%',
    bottom: '18%',
    borderWidth: 2,
    borderColor: colors.teal,
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  overlayText: {
    color: '#fff',
    fontWeight: '600',
  },
  status: {
    marginTop: 10,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  hint: {
    marginTop: 6,
    color: colors.ink,
    fontSize: 13,
  },
  error: {
    marginTop: 8,
    color: colors.danger,
    fontWeight: '600',
  },
  actions: {
    marginTop: 12,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: colors.teal,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryBtn: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryText: {
    color: colors.ink,
    fontWeight: '700',
  },
  linkBtn: {
    padding: 8,
  },
  link: {
    color: colors.teal,
    fontWeight: '700',
    fontSize: 15,
  },
});
