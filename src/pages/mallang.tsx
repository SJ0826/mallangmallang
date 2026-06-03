import { createRoute } from '@granite-js/react-native';
import { Txt } from '@toss/tds-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MallangCharacter } from '../features/mallang/MallangCharacter';
import { SquishyView } from '../features/mallang/SquishyView';
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, left: 12, right: 12, bottom: 12 }}
        >
          <Txt typography="t4" fontWeight="bold" color="#4A5568">
            ← 리스트로 돌아가기
          </Txt>
        </TouchableOpacity>
      </View>

      <View style={styles.stage}>
        <SquishyView size={240}>
          <MallangCharacter id={mallang.id} size={240} />
        </SquishyView>
      </View>

      <View style={styles.caption}>
        <Txt typography="t7" fontWeight="bold" textAlign="center">
          {mallang.name}
        </Txt>
        <Txt typography="t3" color="#718096" textAlign="center">
          잡고 늘려보세요
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  caption: {
    paddingBottom: 48,
    gap: 6,
  },
});
