import { useCallback, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { lookupScan } from './src/api';
import { CameraScanner } from './src/components/CameraScanner';
import { DeviceDetail } from './src/components/DeviceDetail';
import { ExternalScanner } from './src/components/ExternalScanner';
import { LabelTypePicker } from './src/components/LabelTypePicker';
import { SettingsScreen } from './src/components/SettingsScreen';
import { colors } from './src/theme';
import type { Device, LabelType, ScanSource } from './src/types';

type Screen =
  | { name: 'home' }
  | { name: 'settings' }
  | { name: 'camera'; labelType: Exclude<LabelType, 'rfid'> }
  | { name: 'external'; labelType: LabelType }
  | {
      name: 'device';
      labelType: LabelType;
      device: Device;
      code: string;
    };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = useCallback(
    async (code: string, labelType: LabelType, source: ScanSource) => {
      setBusy(true);
      setError(null);
      try {
        const result = await lookupScan(code, labelType, source);
        setScreen({
          name: 'device',
          labelType,
          device: result.device,
          code: result.scan.code,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lookup failed');
      } finally {
        setBusy(false);
      }
    },
    []
  );

  const openLabelType = (labelType: LabelType) => {
    setError(null);
    if (labelType === 'rfid') {
      setScreen({ name: 'external', labelType });
      return;
    }
    setScreen({ name: 'camera', labelType });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {screen.name === 'home' && (
        <LabelTypePicker
          subtitle="Scan QR, Code 128 barcode, or RFID EPC to open a device record."
          onSelect={openLabelType}
          onOpenSettings={() => setScreen({ name: 'settings' })}
        />
      )}

      {screen.name === 'settings' && (
        <SettingsScreen onBack={() => setScreen({ name: 'home' })} />
      )}

      {screen.name === 'camera' && (
        <CameraScanner
          labelType={screen.labelType}
          busy={busy}
          error={error}
          onScanned={(code) => handleScan(code, screen.labelType, 'camera')}
          onUseExternal={() => {
            setError(null);
            setScreen({ name: 'external', labelType: screen.labelType });
          }}
          onBack={() => {
            setError(null);
            setScreen({ name: 'home' });
          }}
        />
      )}

      {screen.name === 'external' && (
        <ExternalScanner
          labelType={screen.labelType}
          busy={busy}
          error={error}
          onSubmit={(code, source) => handleScan(code, screen.labelType, source)}
          onUseCamera={
            screen.labelType === 'rfid'
              ? undefined
              : () => {
                  setError(null);
                  setScreen({
                    name: 'camera',
                    labelType: screen.labelType as Exclude<LabelType, 'rfid'>,
                  });
                }
          }
          onBack={() => {
            setError(null);
            setScreen({ name: 'home' });
          }}
        />
      )}

      {screen.name === 'device' && (
        <DeviceDetail
          device={screen.device}
          scannedCode={screen.code}
          labelType={screen.labelType}
          onHome={() => {
            setError(null);
            setScreen({ name: 'home' });
          }}
          onScanAgain={() => {
            setError(null);
            openLabelType(screen.labelType);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
