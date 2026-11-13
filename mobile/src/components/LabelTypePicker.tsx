import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { LabelType } from '../types';
import { colors } from '../theme';

const OPTIONS: Array<{
  type: LabelType;
  title: string;
  description: string;
  glyph: string;
}> = [
  {
    type: 'qr',
    title: 'QR code',
    description: 'Scan with a phone to open this device record.',
    glyph: '▣',
  },
  {
    type: 'barcode',
    title: 'Bar code',
    description: 'Code 128 for handheld and desk scanners.',
    glyph: '|||||',
  },
  {
    type: 'rfid',
    title: 'RFID tag',
    description: 'EPC for RFID readers and tag encoding.',
    glyph: ')))',
  },
];

interface Props {
  subtitle?: string;
  onSelect: (type: LabelType) => void;
  onOpenSettings: () => void;
}

export function LabelTypePicker({ subtitle, onSelect, onOpenSettings }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Asset scanner</Text>
        <Text style={styles.title}>Choose label type</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.cards}>
        {OPTIONS.map((option) => (
          <Pressable
            key={option.type}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => onSelect(option.type)}
          >
            <View style={styles.iconWrap}>
              <Text style={styles.icon}>{option.glyph}</Text>
            </View>
            <Text style={styles.cardTitle}>{option.title}</Text>
            <Text style={styles.cardBody}>{option.description}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={onOpenSettings} style={styles.settingsBtn}>
        <Text style={styles.settingsText}>Server connection</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: colors.bg,
  },
  header: {
    marginBottom: 20,
  },
  kicker: {
    color: colors.teal,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  cards: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
  },
  cardPressed: {
    borderColor: colors.teal,
    backgroundColor: colors.tealSoft,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  icon: {
    color: colors.teal,
    fontSize: 18,
    fontWeight: '700',
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  settingsBtn: {
    marginTop: 'auto',
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingsText: {
    color: colors.teal,
    fontSize: 15,
    fontWeight: '600',
  },
});
