import { createRoute } from '@granite-js/react-native';
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/poc-reanimated', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.4,
      damping: 8,
      stiffness: 120,
      mass: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      damping: 12,
      stiffness: 150,
      mass: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Animated PoC</Text>
      <Text style={styles.subtitle}>원을 길게 눌러보세요 (스프링으로 1.4배 확대 → 복원)</Text>
      <Text style={styles.note}>※ Reanimated 4.x 호환 불가 → RN 내장 Animated 사용</Text>

      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.pressArea}>
        <Animated.View style={[styles.circle, { transform: [{ scale }] }]} />
      </Pressable>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>← 뒤로</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 8,
  },
  note: {
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 32,
  },
  pressArea: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0064FF',
  },
  backButton: {
    backgroundColor: '#718096',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
