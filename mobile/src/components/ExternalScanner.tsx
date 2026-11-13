import { useEffect, useRef, useState, type ElementRef } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { LabelType } from '../types';
import { colors } from '../theme';

interface Props {
  labelType: LabelType;
  busy: boolean;
  error: string | null;
  onSubmit: (code: string, source: 'external-scanner' | 'manual') => void;
  onUseCamera?: () => void;
  onBack: () => void;
}

export function ExternalScanner({
  labelType,
  busy,
  error,
  onSubmit,
  onUseCamera,
  onBack,
}: Props) {
  const [value, setValue] = useState('');
  const inputRef = useRef<ElementRef<typeof TextInput> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(timer);
  }, []);

  const title =
    labelType === 'rfid'
      ? 'Read RFID tag'
      : labelType === 'barcode'
        ? 'Connect bar code scanner'
        : 'Connect scanner';

  const help =
    labelType === 'rfid'
      ? 'Pair or plug in an RFID reader that acts as a keyboard wedge. Tap the field, then scan the EPC tag.'
      : 'Most handheld scanners send Code 128 as keyboard input ending with Enter. Keep this field focused and scan.';

  const submit = (source: 'external-scanner' | 'manual') => {
    const code = value.trim();
    if (!code || busy) return;
    onSubmit(code, source);
    setValue('');
  };

  return (
    <View style={styles.wrap}>
      <Pressable onPress={onBack}>
        <Text style={styles.link}>Back</Text>
      </Pressable>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{help}</Text>

      <View style={styles.panel}>
        <Text style={styles.label}>Scanner input</Text>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={setValue}
          onSubmitEditing={() => submit('external-scanner')}
          autoCapitalize="characters"
          autoCorrect={false}
          blurOnSubmit={false}
          editable={!busy}
          placeholder={
            labelType === 'rfid' ? 'E280116060000203ABCD038' : 'AST-EP-038'
          }
          placeholderTextColor="#9AA8B5"
          style={styles.input}
          returnKeyType="done"
        />
        <Text style={styles.hint}>
          Hardware scanners usually finish with Enter. You can also type a code and tap Look up.
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.primaryBtn, busy && styles.disabled]}
        disabled={busy || !value.trim()}
        onPress={() => submit(value.includes(' ') ? 'manual' : 'external-scanner')}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryText}>Look up device</Text>
        )}
      </Pressable>

      {onUseCamera ? (
        <Pressable style={styles.secondaryBtn} onPress={onUseCamera}>
          <Text style={styles.secondaryText}>Use camera instead</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 20,
    gap: 12,
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
  },
  body: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    marginTop: 8,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    backgroundColor: '#FAFBFC',
  },
  hint: {
    marginTop: 10,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  error: {
    color: colors.danger,
    fontWeight: '600',
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
  secondaryBtn: {
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
});
