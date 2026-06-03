import { createRoute } from '@granite-js/react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Sound from 'react-native-sound';

export const Route = createRoute('/poc-sound', {
  component: Page,
});

const SAMPLE_URL = 'https://www.kozco.com/tech/piano2.wav';

function Page() {
  const navigation = Route.useNavigation();
  const [status, setStatus] = useState<string>('대기');
  const [sound, setSound] = useState<Sound | null>(null);

  useEffect(() => {
    setStatus('로딩 중...');
    const instance = new Sound(SAMPLE_URL, undefined, (error) => {
      if (error) {
        setStatus(`로드 실패: ${error.message ?? String(error)}`);
        return;
      }
      setStatus(`로드 완료 (duration ${instance.getDuration().toFixed(1)}s)`);
      setSound(instance);
    });

    return () => {
      instance.release();
    };
  }, []);

  const play = () => {
    if (!sound) return;
    setStatus('재생 중...');
    sound.play((success) => {
      setStatus(success ? '재생 완료' : '재생 실패');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>사운드 PoC</Text>
      <Text style={styles.subtitle}>react-native-sound + HTTPS URL 검증</Text>

      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, !sound && styles.buttonDisabled]}
        onPress={play}
        disabled={!sound}
      >
        <Text style={styles.buttonText}>재생</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
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
    marginBottom: 24,
  },
  statusBox: {
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    minWidth: 240,
  },
  statusText: {
    fontSize: 14,
    color: '#1A202C',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0064FF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginVertical: 6,
    minWidth: 200,
  },
  buttonDisabled: {
    backgroundColor: '#CBD5E0',
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
