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
  bodyHi: string;
  bodyBase: string;
  bodyMid: string;
  bodyEdge: string;
  cheek: string;
  eye: string;
  eyeHi: string;
}

const DESIGN: Record<MallangId, Design> = {
  default: {
    bodyTop: '#FFFFFF',
    bodyHi: '#FFFCF6',
    bodyBase: '#FFF1DD',
    bodyMid: '#F4DAB4',
    bodyEdge: '#E2BC90',
    cheek: '#FFA8B8',
    eye: '#231A12',
    eyeHi: '#4A3826',
  },
  mochi: {
    bodyTop: '#FFFAE8',
    bodyHi: '#FFEAC8',
    bodyBase: '#FFCE92',
    bodyMid: '#E8AA68',
    bodyEdge: '#B87C3E',
    cheek: '#FF8585',
    eye: '#2E1C0D',
    eyeHi: '#5D3E27',
  },
  wakppu: {
    bodyTop: '#FAFDFF',
    bodyHi: '#E5F1FF',
    bodyBase: '#B5D5FF',
    bodyMid: '#7DB1E6',
    bodyEdge: '#4F86BE',
    cheek: '#FF9FB5',
    eye: '#16264A',
    eyeHi: '#3A4A76',
  },
};

const LOCKED: Design = {
  bodyTop: '#FAFCFD',
  bodyHi: '#EEF2F5',
  bodyBase: '#D8DEE4',
  bodyMid: '#B8C0C8',
  bodyEdge: '#92A0AC',
  cheek: '#B0B8C0',
  eye: '#6C7680',
  eyeHi: '#8E98A2',
};

interface Props {
  id: MallangId;
  size: number | `${number}%`;
  locked?: boolean;
}

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
  const idRim = `mr-${uid}`;
  const idCheek = `mc-${uid}`;
  const idEye = `me-${uid}`;

  return (
    <Svg width={size} height={size} viewBox="-100 -100 200 200">
      <Defs>
        {/* 몸 — 5단 그라디언트로 자연스러운 부피감 */}
        <RadialGradient id={idBody} cx="42%" cy="18%" r="92%">
          <Stop offset="0%" stopColor={d.bodyTop} />
          <Stop offset="25%" stopColor={d.bodyHi} />
          <Stop offset="55%" stopColor={d.bodyBase} />
          <Stop offset="82%" stopColor={d.bodyMid} />
          <Stop offset="100%" stopColor={d.bodyEdge} />
        </RadialGradient>

        {/* 메인 광택 — 부드럽게 페이드 */}
        <RadialGradient id={idHi} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={locked ? '0.25' : '0.78'} />
          <Stop offset="55%" stopColor="#FFFFFF" stopOpacity={locked ? '0.08' : '0.22'} />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>

        {/* 림라이트 — 우하단 가장자리 살짝 반사광 */}
        <RadialGradient id={idRim} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={locked ? '0.12' : '0.38'} />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>

        {/* 볼 — 중심 진하고 부드럽게 페이드 */}
        <RadialGradient id={idCheek} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={d.cheek} stopOpacity={locked ? '0.4' : '0.88'} />
          <Stop offset="55%" stopColor={d.cheek} stopOpacity={locked ? '0.18' : '0.42'} />
          <Stop offset="100%" stopColor={d.cheek} stopOpacity="0" />
        </RadialGradient>

        {/* 눈동자 — 위쪽 살짝 밝게 (구체감) */}
        <RadialGradient id={idEye} cx="42%" cy="35%" r="65%">
          <Stop offset="0%" stopColor={d.eyeHi} />
          <Stop offset="100%" stopColor={d.eye} />
        </RadialGradient>
      </Defs>

      {/* 몸 — 외곽선 없음, 그라디언트만으로 형태 */}
      <Path d={BODY_PATH} fill={`url(#${idBody})`} />

      {/* 림라이트 — 우하단 (광원 반대편) */}
      <Ellipse cx={40} cy={56} rx={38} ry={20} fill={`url(#${idRim})`} />

      {/* 메인 광택 — 좌상단 */}
      <Ellipse cx={-24} cy={-40} rx={42} ry={28} fill={`url(#${idHi})`} />

      {/* 작은 핫스팟 — 가장 밝은 점 */}
      {!locked && (
        <Ellipse cx={-22} cy={-52} rx={9} ry={4.5} fill="#FFFFFF" opacity={0.92} />
      )}

      {/* 볼터치 */}
      <Ellipse cx={-40} cy={26} rx={17} ry={12} fill={`url(#${idCheek})`} />
      <Ellipse cx={40} cy={26} rx={17} ry={12} fill={`url(#${idCheek})`} />

      {/* 눈 */}
      <Ellipse cx={-20} cy={-2} rx={8} ry={9.5} fill={`url(#${idEye})`} />
      <Ellipse cx={20} cy={-2} rx={8} ry={9.5} fill={`url(#${idEye})`} />

      {/* 큰 반짝 */}
      {!locked && (
        <>
          <Ellipse cx={-17.5} cy={-6} rx={3.4} ry={4} fill="#FFFFFF" />
          <Ellipse cx={22.5} cy={-6} rx={3.4} ry={4} fill="#FFFFFF" />
          {/* 아래쪽 작은 반사광 */}
          <Circle cx={-22} cy={2.5} r={1.3} fill="#FFFFFF" opacity={0.75} />
          <Circle cx={18} cy={2.5} r={1.3} fill="#FFFFFF" opacity={0.75} />
        </>
      )}

      {/* 입 — 작고 부드러운 미소 */}
      <Path
        d="M -8,17 Q 0,26 8,17"
        stroke={d.eye}
        strokeWidth={2.8}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
