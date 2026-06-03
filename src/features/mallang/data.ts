export type MallangId = 'default' | 'mochi' | 'wakppu';

export interface Mallang {
  id: MallangId;
  name: string;
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
    unlockAt: UNLOCK_THRESHOLDS.default,
  },
  {
    id: 'mochi',
    name: '모찌',
    unlockAt: UNLOCK_THRESHOLDS.mochi,
  },
  {
    id: 'wakppu',
    name: '왁뿌',
    unlockAt: UNLOCK_THRESHOLDS.wakppu,
  },
];

export function isUnlocked(mallang: Mallang, totalCount: number): boolean {
  return totalCount >= mallang.unlockAt;
}

export function remainingToUnlock(mallang: Mallang, totalCount: number): number {
  return Math.max(0, mallang.unlockAt - totalCount);
}
