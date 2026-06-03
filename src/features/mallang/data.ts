/* eslint-disable @typescript-eslint/no-require-imports */
import type { ImageSourcePropType } from 'react-native';

export type MallangId = 'default' | 'mochi' | 'wakppu';

export interface Mallang {
  id: MallangId;
  name: string;
  asset: ImageSourcePropType;
  unlockAt: number;
}

export const UNLOCK_THRESHOLDS = {
  default: 0,
  mochi: 10,
  wakppu: 30,
} as const satisfies Record<MallangId, number>;

export const MALLANGS: Mallang[] = [
  {
    id: 'default',
    name: '말랑이',
    asset: require('../../assets/mallang/default.png'),
    unlockAt: UNLOCK_THRESHOLDS.default,
  },
  {
    id: 'mochi',
    name: '모찌',
    asset: require('../../assets/mallang/mochi.png'),
    unlockAt: UNLOCK_THRESHOLDS.mochi,
  },
  {
    id: 'wakppu',
    name: '왁뿌',
    asset: require('../../assets/mallang/wakppu.png'),
    unlockAt: UNLOCK_THRESHOLDS.wakppu,
  },
];

export function isUnlocked(mallang: Mallang, totalCount: number): boolean {
  return totalCount >= mallang.unlockAt;
}

export function remainingToUnlock(mallang: Mallang, totalCount: number): number {
  return Math.max(0, mallang.unlockAt - totalCount);
}
