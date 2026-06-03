import { generateHapticFeedback } from '@apps-in-toss/framework';
import { createRoute } from '@granite-js/react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/poc-haptic', {
  component: Page,
});

const HAPTIC_TYPES = [
  'tickWeak',
  'tap',
  'tickMedium',
  'softMedium',
  'basicWeak',
  'basicMedium',
  'success',
  'error',
  'wiggle',
  'confetti',
] as const;

type HapticType = (typeof HAPTIC_TYPES)[number];

function Page() {
  const navigation = Route.useNavigation();

  const trigger = (type: HapticType) => {
    generateHapticFeedback({ type });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>햅틱 PoC</Text>
      <Text style={styles.subtitle}>버튼을 누르면 해당 타입의 진동이 발생합니다.</Text>

      <View style={styles.grid}>
        {HAPTIC_TYPES.map((type) => (
          <TouchableOpacity key={type} style={styles.button} onPress={() => trigger(type)}>
            <Text style={styles.buttonText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>← 뒤로</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#0064FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 130,
  },
  backButton: {
    backgroundColor: '#718096',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
