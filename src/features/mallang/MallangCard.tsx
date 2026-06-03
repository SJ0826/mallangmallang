import { Txt } from '@toss/tds-react-native';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import type { Mallang } from './data';
import { isUnlocked, remainingToUnlock } from './data';

interface Props {
  mallang: Mallang;
  totalCount: number;
  onPress: (mallang: Mallang) => void;
}

export function MallangCard({ mallang, totalCount, onPress }: Props) {
  const unlocked = isUnlocked(mallang, totalCount);
  const remaining = remainingToUnlock(mallang, totalCount);

  return (
    <Pressable
      onPress={() => onPress(mallang)}
      style={({ pressed }) => [styles.card, pressed && unlocked && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={unlocked ? mallang.name : `${mallang.name} 잠금. ${remaining}회 더 터뜨리면 해제`}
      accessibilityState={{ disabled: !unlocked }}
    >
      <View style={styles.imageWrap}>
        <Image
          source={mallang.asset}
          style={[styles.image, !unlocked && styles.imageLocked]}
          resizeMode="contain"
        />
      </View>
      <View style={styles.labelWrap}>
        {unlocked ? (
          <Txt typography="t6" fontWeight="bold">
            {mallang.name}
          </Txt>
        ) : (
          <>
            <Txt typography="t6" fontWeight="bold" color="#A0AEC0">
              ???
            </Txt>
            <Txt typography="t2" color="#A0AEC0">
              {remaining}회 더 터뜨리면 해제
            </Txt>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 0.85,
    backgroundColor: '#F7F8FA',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPressed: {
    opacity: 0.7,
  },
  imageWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageLocked: {
    opacity: 0.18,
    tintColor: '#1A202C',
  },
  labelWrap: {
    marginTop: 8,
    alignItems: 'center',
    gap: 2,
  },
});
