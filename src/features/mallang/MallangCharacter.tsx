import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import type { MallangId } from './data';

interface Design {
  body: string;
  outline: string;
  cheek: string;
  eye: string;
}

const DESIGN: Record<MallangId, Design> = {
  default: {
    body: '#FFFAF2',
    outline: '#E8D5C0',
    cheek: '#FFB3C1',
    eye: '#1A202C',
  },
  mochi: {
    body: '#FFE5C9',
    outline: '#D4A574',
    cheek: '#FF9494',
    eye: '#3D2817',
  },
  wakppu: {
    body: '#CCE6FF',
    outline: '#7DB8E8',
    cheek: '#FF9FB5',
    eye: '#1A2B4A',
  },
};

interface Props {
  id: MallangId;
  size: number | `${number}%`;
  locked?: boolean;
}

export function MallangCharacter({ id, size, locked = false }: Props) {
  const d = DESIGN[id];
  const body = locked ? '#E2E8F0' : d.body;
  const outline = locked ? '#CBD5E0' : d.outline;
  const cheek = locked ? '#CBD5E0' : d.cheek;
  const eye = locked ? '#A0AEC0' : d.eye;

  return (
    <Svg width={size} height={size} viewBox="-100 -100 200 200">
      {/* 그림자 */}
      <Ellipse cx={0} cy={82} rx={62} ry={6} fill="rgba(0,0,0,0.08)" />

      {/* 몸 — 살짝 비대칭 blob */}
      <Path
        d="
          M 0,-78
          C 44,-78 78,-46 78,-4
          C 78,42 46,78 0,78
          C -46,78 -78,42 -78,-4
          C -78,-46 -44,-78 0,-78
          Z
        "
        fill={body}
        stroke={outline}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />

      {/* 하이라이트 */}
      <Ellipse cx={-30} cy={-38} rx={18} ry={12} fill="rgba(255,255,255,0.55)" />

      {/* 볼터치 */}
      <Ellipse cx={-38} cy={20} rx={14} ry={10} fill={cheek} opacity={locked ? 0.4 : 0.7} />
      <Ellipse cx={38} cy={20} rx={14} ry={10} fill={cheek} opacity={locked ? 0.4 : 0.7} />

      {/* 눈 */}
      <Circle cx={-24} cy={-8} r={7} fill={eye} />
      <Circle cx={24} cy={-8} r={7} fill={eye} />
      {/* 눈 반짝 */}
      {!locked && (
        <>
          <Circle cx={-21} cy={-11} r={2.2} fill="#FFFFFF" />
          <Circle cx={27} cy={-11} r={2.2} fill="#FFFFFF" />
        </>
      )}

      {/* 입 — 살짝 미소 */}
      <Path
        d="M -9,22 Q 0,32 9,22"
        stroke={eye}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
