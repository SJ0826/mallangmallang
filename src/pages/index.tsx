import { createRoute } from '@granite-js/react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';

export const Route = createRoute('/', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>말랑말랑 PoC</Text>
      <Text style={styles.subtitle}>Granite 호환성 검증용 페이지</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('/poc-haptic')}>
        <Text style={styles.buttonText}>햅틱 PoC</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('/poc-reanimated')}>
        <Text style={styles.buttonText}>Animated PoC</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('/poc-sound')}>
        <Text style={styles.buttonText}>사운드 PoC</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => navigation.navigate('/about')}>
        <Text style={styles.buttonText}>About</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#0064FF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 6,
    minWidth: 220,
  },
  secondaryButton: {
    backgroundColor: '#718096',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
