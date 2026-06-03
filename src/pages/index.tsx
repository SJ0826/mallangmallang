import { createRoute } from '@granite-js/react-native';
import { Top, Txt } from '@toss/tds-react-native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MallangCard } from '../features/mallang/MallangCard';
import { MALLANGS } from '../features/mallang/data';
import { isUnlocked } from '../features/mallang/data';
import type { Mallang } from '../features/mallang/data';
import { useSquishCounts } from '../features/mallang/storage';

export const Route = createRoute('/', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();
  const { totalCount, isLoading } = useSquishCounts();

  const handleSelect = (mallang: Mallang) => {
    if (!isUnlocked(mallang, totalCount)) return;
    navigation.navigate('/mallang', { id: mallang.id });
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <Top
        title="말랑이"
        subtitle1={
          <Txt typography="t3" color="#4A5568">
            꾸준히 만지면 모여요
          </Txt>
        }
      />

      <View style={styles.grid}>
        {MALLANGS.map((mallang) => (
          <View key={mallang.id} style={styles.cell}>
            <MallangCard
              mallang={mallang}
              totalCount={isLoading ? 0 : totalCount}
              onPress={handleSelect}
            />
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Txt typography="t2" color="#A0AEC0" textAlign="center">
          누적 {isLoading ? '...' : totalCount}회 터뜨림
        </Txt>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  cell: {
    width: '47.5%',
  },
  footer: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
});
