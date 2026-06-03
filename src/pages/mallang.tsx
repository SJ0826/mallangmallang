import { createRoute } from '@granite-js/react-native';
import { Txt } from '@toss/tds-react-native';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MALLANGS } from '../features/mallang/data';
import type { MallangId } from '../features/mallang/data';

interface Params {
  id: MallangId;
}

export const Route = createRoute('/mallang', {
  validateParams: (params): Params => {
    const id = (params as { id?: unknown })?.id;
    if (id !== 'default' && id !== 'mochi' && id !== 'wakppu') {
      throw new Error(`Invalid mallang id: ${String(id)}`);
    }
    return { id };
  },
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();
  const { id } = Route.useParams();
  const mallang = MALLANGS.find((m) => m.id === id);

  if (mallang == null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image source={mallang.asset} style={styles.image} resizeMode="contain" />
      <Txt typography="t7" fontWeight="bold">
        {mallang.name}
      </Txt>
      <Txt typography="t3" color="#718096" textAlign="center">
        상세 인터랙션은 다음 이슈에서 구현돼요
      </Txt>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Txt typography="t4" fontWeight="bold" color="white">
          ← 뒤로
        </Txt>
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
    gap: 12,
  },
  image: {
    width: 240,
    height: 240,
    marginBottom: 16,
  },
  backButton: {
    marginTop: 32,
    backgroundColor: '#718096',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});
