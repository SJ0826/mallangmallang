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

// 앱인토스는 require() 로컬 리소스 미지원 → URI 방식만 가능.
// 임시로 GitHub raw URL 사용. main 머지 후 ASSET_BRANCH만 'main'으로 변경하면 됨.
// 정식 호스팅 결정은 후속 이슈에서 (사운드 자산 호스팅과 묶어 처리 예정).
const ASSET_BRANCH = 'feat/7-mallang-list';
const assetUri = (id: MallangId) =>
  `https://raw.githubusercontent.com/SJ0826/mallangmallang/${ASSET_BRANCH}/src/assets/mallang/${id}.png`;

export const MALLANGS: Mallang[] = [
  {
    id: 'default',
    name: '말랑이',
    asset: { uri: assetUri('default') },
    unlockAt: UNLOCK_THRESHOLDS.default,
  },
  {
    id: 'mochi',
    name: '모찌',
    asset: { uri: assetUri('mochi') },
    unlockAt: UNLOCK_THRESHOLDS.mochi,
  },
  {
    id: 'wakppu',
    name: '왁뿌',
    asset: { uri: assetUri('wakppu') },
    unlockAt: UNLOCK_THRESHOLDS.wakppu,
  },
];

export function isUnlocked(mallang: Mallang, totalCount: number): boolean {
  return totalCount >= mallang.unlockAt;
}

export function remainingToUnlock(mallang: Mallang, totalCount: number): number {
  return Math.max(0, mallang.unlockAt - totalCount);
}
