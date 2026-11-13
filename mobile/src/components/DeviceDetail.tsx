import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Device } from '../types';
import { colors } from '../theme';

interface Props {
  device: Device;
  scannedCode: string;
  labelType: string;
  onScanAgain: () => void;
  onHome: () => void;
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value?.trim() ? value : '—'}</Text>
    </View>
  );
}

function severityStyle(level: string) {
  switch (level) {
    case 'high':
      return { bg: colors.dangerSoft, fg: colors.danger };
    case 'medium':
      return { bg: colors.warnSoft, fg: colors.warn };
    case 'low':
      return { bg: colors.infoSoft, fg: colors.info };
    default:
      return { bg: colors.successSoft, fg: colors.success };
  }
}

export function DeviceDetail({
  device,
  scannedCode,
  labelType,
  onScanAgain,
  onHome,
}: Props) {
  const { identity, posture } = device;
  const badge = severityStyle(posture.severityLevel);

  return (
    <View style={styles.wrap}>
      <View style={styles.topBar}>
        <Pressable onPress={onHome}>
          <Text style={styles.link}>Home</Text>
        </Pressable>
        <Text style={styles.topMeta}>
          {identity.hostname} · {identity.assetCode}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>Overview</Text>
        <Text style={styles.title}>{identity.assetName}</Text>
        <Text style={styles.scanMeta}>
          Scanned {labelType.toUpperCase()}: {scannedCode}
        </Text>

        <View style={styles.columns}>
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Identity</Text>
            <Field label="Hostname" value={identity.hostname} />
            <Field label="Asset name" value={identity.assetName} />
            <Field label="IP" value={identity.ip} />
            <Field label="MAC" value={identity.mac} />
            <Field label="Serial" value={identity.serial} />
            <Field label="Asset code" value={identity.assetCode} />
            <Field label="SKU" value={identity.sku} />
            <Field label="Assigned" value={identity.assigned} />
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Posture</Text>
            <Field label="OS" value={posture.os} />
            <Field label="Build" value={posture.build} />
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Severity</Text>
              <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.badgeText, { color: badge.fg }]}>
                  {posture.severity}
                </Text>
              </View>
            </View>
            <Field label="Last patch" value={posture.lastPatch} />
            <Field label="Version" value={posture.version} />
            <Field label="SLA" value={posture.sla} />
            <Field label="Country / campus" value={posture.countryCampus} />
            <Field label="CIA" value={posture.cia} />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.secondaryBtn} onPress={onHome}>
          <Text style={styles.secondaryText}>Close</Text>
        </Pressable>
        <Pressable style={styles.primaryBtn} onPress={onScanAgain}>
          <Text style={styles.primaryText}>Scan again</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 6,
  },
  link: {
    color: colors.teal,
    fontWeight: '700',
    fontSize: 15,
  },
  topMeta: {
    color: colors.muted,
    fontSize: 13,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  title: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
  },
  scanMeta: {
    color: colors.muted,
    marginBottom: 18,
    fontSize: 13,
  },
  columns: {
    gap: 12,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
  },
  panelTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  field: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 2,
  },
  fieldValue: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '600',
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.surface,
  },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryText: {
    color: colors.ink,
    fontWeight: '700',
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: colors.teal,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
});
