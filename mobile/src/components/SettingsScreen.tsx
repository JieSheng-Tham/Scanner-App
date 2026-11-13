import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  checkHealth,
  DEFAULT_API_BASE,
  fetchDemoCodes,
  getApiBaseUrl,
  setApiBaseUrl,
} from '../api';
import { colors } from '../theme';

interface Props {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: Props) {
  const [url, setUrl] = useState(DEFAULT_API_BASE);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [demo, setDemo] = useState<string[]>([]);

  useEffect(() => {
    getApiBaseUrl().then(setUrl);
  }, []);

  const saveAndTest = async () => {
    setBusy(true);
    setStatus(null);
    try {
      const saved = await setApiBaseUrl(url);
      setUrl(saved);
      const ok = await checkHealth();
      if (!ok) {
        setStatus('Saved, but server health check failed. Use your PC LAN IP on a physical phone.');
        setDemo([]);
        return;
      }
      const codes = await fetchDemoCodes();
      setDemo(codes.map((c) => `${c.assetCode}  |  RFID ${c.rfidEpc}`));
      setStatus('Connected. Demo codes loaded below.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Connection failed');
      setDemo([]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Pressable onPress={onBack}>
        <Text style={styles.link}>Back</Text>
      </Pressable>

      <Text style={styles.title}>Server connection</Text>
      <Text style={styles.body}>
        Expo Go on a real phone cannot reach localhost. Start the Node server on your PC, then
        paste that machine's LAN address, for example http://192.168.1.20:3001
      </Text>

      <Text style={styles.label}>API base URL</Text>
      <TextInput
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        placeholder="http://192.168.x.x:3001"
        placeholderTextColor="#9AA8B5"
        style={styles.input}
      />

      <Pressable
        style={[styles.primaryBtn, busy && styles.disabled]}
        disabled={busy}
        onPress={saveAndTest}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryText}>Save & test</Text>
        )}
      </Pressable>

      {status ? <Text style={styles.status}>{status}</Text> : null}

      {demo.length > 0 ? (
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Try scanning</Text>
          {demo.map((line) => (
            <Text key={line} style={styles.demoLine}>
              {line}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 20,
    gap: 10,
  },
  link: {
    color: colors.teal,
    fontWeight: '700',
    fontSize: 15,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 8,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.ink,
    backgroundColor: colors.surface,
  },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: colors.teal,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
  status: {
    color: colors.ink,
    fontWeight: '600',
    marginTop: 4,
  },
  demoBox: {
    marginTop: 12,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    gap: 8,
  },
  demoTitle: {
    fontWeight: '700',
    color: colors.ink,
  },
  demoLine: {
    color: colors.muted,
    fontSize: 13,
  },
});
