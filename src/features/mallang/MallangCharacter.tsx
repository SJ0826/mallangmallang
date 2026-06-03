import React from 'react';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import type { MallangId } from './data';

interface Design {
  bodyTop: string;
  bodyBase: string;
  bodyEdge: string;
  outline: string;
  cheek: string;
  eye: string;
}

const DESIGN: Record<MallangId, Design> = {
  default: {
    bodyTop: '#FFFFFF',
    bodyBase: '#FFF8EC',
    bodyEdge: '#F4DFC0',
    outline: '#D8B98F',
    cheek: '#FFAEBE',
    eye: '#2A2018',
  },
  mochi: {
    bodyTop: '#FFF8E8',
    bodyBase: '#FFDFAF',
    bodyEdge: '#E8B070',
    outline: '#B88345',
    cheek: '#FF9494',
    eye: '#3D2817',
  },
  wakppu: {
    bodyTop: '#F8FCFF',
    bodyBase: '#C9E2FF',
    bodyEdge: '#8FBDEB',
    outline: '#6FA3D8',
    cheek: '#FFA0B5',
    eye: '#1F3056',
  },
};

const LOCKED: Design = {
  bodyTop: '#F8FAFC',
  bodyBase: '#DCE2E8',
  bodyEdge: '#B8C2CC',
  outline: '#A0AAB4',
  cheek: '#B0B8C0',
  eye: '#7A848E',
};

interface Props {
  id: MallangId;
  size: number | `${number}%`;
  locked?: boolean;
}

// 통통한 모찌형 — 위가 살짝 좁고 아래가 살짝 넓적
const BODY_PATH = `
  M 0,-78
  C 44,-78 78,-50 78,-6
  C 78,46 48,82 0,82
  C -48,82 -78,46 -78,-6
  C -78,-50 -44,-78 0,-78
  Z
`;

export function MallangCharacter({ id, size, locked = false }: Props) {
  const d = locked ? LOCKED : DESIGN[id];
  const uid = `${id}${locked ? '-l' : ''}`;
  const idBody = `mb-${uid}`;
  const idHi = `mh-${uid}`;
  const idCheek = `mc-${uid}`;

  return (
    <Svg width={size} height={size} viewBox="-100 -100 200 200">
      <Defs>
        {/* 몸 — 위에서 빛이 들어오는 듯한 부드러운 그라디언트 */}
        <RadialGradient id={idBody} cx="45%" cy="22%" r="88%">
          <Stop offset="0%" stopColor={d.bodyTop} />
          <Stop offset="55%" stopColor={d.bodyBase} />
          <Stop offset="100%" stopColor={d.bodyEdge} />
        </RadialGradient>
        {/* 메인 광택 */}
        <RadialGradient id={idHi} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={locked ? '0.3' : '0.75'} />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
        {/* 볼 — 가장자리로 자연스럽게 페이드 */}
        <RadialGradient id={idCheek} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={d.cheek} stopOpacity={locked ? '0.4' : '0.8'} />
          <Stop offset="100%" stopColor={d.cheek} stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* 몸 — 외곽선은 거의 안 보이게, 그라디언트로 입체감 */}
      <Path
        d={BODY_PATH}
        fill={`url(#${idBody})`}
        stroke={d.outline}
        strokeOpacity={0.5}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* 메인 광택 — 좌상단 */}
      <Ellipse cx={-28} cy={-42} rx={30} ry={20} fill={`url(#${idHi})`} />

      {/* 윗머리 작은 반짝 */}
      {!locked && (
        <Circle cx={-8} cy={-60} r={3.2} fill="#FFFFFF" opacity={0.9} />
      )}

      {/* 볼터치 */}
      <Ellipse cx={-40} cy={24} rx={15} ry={11} fill={`url(#${idCheek})`} />
      <Ellipse cx={40} cy={24} rx={15} ry={11} fill={`url(#${idCheek})`} />

      {/* 눈 — 살짝 세로로 통통한 동그란 눈 */}
      <Ellipse cx={-20} cy={-2} rx={7} ry={8.5} fill={d.eye} />
      <Ellipse cx={20} cy={-2} rx={7} ry={8.5} fill={d.eye} />
      {/* 반짝 */}
      {!locked && (
        <>
          <Circle cx={-17.5} cy={-6} r={2.8} fill="#FFFFFF" />
          <Circle cx={22.5} cy={-6} r={2.8} fill="#FFFFFF" />
        </>
      )}

      {/* 입 — 작고 부드러운 미소 */}
      <Path
        d="M -7,17 Q 0,25 7,17"
        stroke={d.eye}
        strokeWidth={2.8}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
