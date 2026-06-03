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
  bodyLight: string;
  bodyBase: string;
  bodyDark: string;
  outline: string;
  cheek: string;
  eye: string;
}

const DESIGN: Record<MallangId, Design> = {
  default: {
    bodyLight: '#FFFFFF',
    bodyBase: '#FFF5E8',
    bodyDark: '#F0DCC2',
    outline: '#E0C8AC',
    cheek: '#FFAEBE',
    eye: '#2A2018',
  },
  mochi: {
    bodyLight: '#FFF6E5',
    bodyBase: '#FFDFB0',
    bodyDark: '#D8A567',
    outline: '#B98A55',
    cheek: '#FF8C8C',
    eye: '#3D2817',
  },
  wakppu: {
    bodyLight: '#F0F8FF',
    bodyBase: '#BEDCFF',
    bodyDark: '#6FA3D8',
    outline: '#5589BD',
    cheek: '#FFA0B5',
    eye: '#1A2B4A',
  },
};

interface Props {
  id: MallangId;
  size: number | `${number}%`;
  locked?: boolean;
}

const BODY_PATH = `
  M 0,-80
  C 46,-80 82,-50 82,-6
  C 82,44 48,82 0,82
  C -48,82 -82,44 -82,-6
  C -82,-50 -46,-80 0,-80
  Z
`;

export function MallangCharacter({ id, size, locked = false }: Props) {
  const d = locked
    ? {
        bodyLight: '#F4F6F8',
        bodyBase: '#DEE3E8',
        bodyDark: '#B6BFC8',
        outline: '#A8B2BC',
        cheek: '#B0B8C0',
        eye: '#7A848E',
      }
    : DESIGN[id];

  // Defs id는 인스턴스마다 고유해야 같은 화면에 여러 캐릭터가 있어도 충돌 안 함
  const uid = `${id}${locked ? '-l' : ''}`;
  const idBody = `mal-body-${uid}`;
  const idHi = `mal-hi-${uid}`;
  const idCheek = `mal-cheek-${uid}`;
  const idShadow = `mal-shadow-${uid}`;

  return (
    <Svg width={size} height={size} viewBox="-100 -100 200 200">
      <Defs>
        {/* 몸 — 위에서 빛이 들어오는 듯한 radial 그라디언트 */}
        <RadialGradient id={idBody} cx="42%" cy="28%" r="78%">
          <Stop offset="0%" stopColor={d.bodyLight} stopOpacity="1" />
          <Stop offset="55%" stopColor={d.bodyBase} stopOpacity="1" />
          <Stop offset="100%" stopColor={d.bodyDark} stopOpacity="1" />
        </RadialGradient>
        {/* 메인 광택 */}
        <RadialGradient id={idHi} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={locked ? '0.4' : '0.85'} />
          <Stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.15" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
        {/* 볼 — 가장자리로 갈수록 부드럽게 퍼짐 */}
        <RadialGradient id={idCheek} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={d.cheek} stopOpacity={locked ? '0.45' : '0.85'} />
          <Stop offset="100%" stopColor={d.cheek} stopOpacity="0" />
        </RadialGradient>
        {/* 바닥 그림자 — 가운데가 진하고 끝이 사라짐 */}
        <RadialGradient id={idShadow} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#000000" stopOpacity="0.22" />
          <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* 바닥 그림자 (그라디언트로 부드럽게) */}
      <Ellipse cx={0} cy={88} rx={70} ry={9} fill={`url(#${idShadow})`} />

      {/* 몸 */}
      <Path
        d={BODY_PATH}
        fill={`url(#${idBody})`}
        stroke={d.outline}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />

      {/* 아래쪽 미세한 음영 — 부피감 강화 */}
      <Ellipse cx={0} cy={50} rx={70} ry={32} fill="#000000" opacity={0.06} />

      {/* 메인 광택 — 좌상단 */}
      <Ellipse cx={-26} cy={-44} rx={32} ry={20} fill={`url(#${idHi})`} />

      {/* 보조 광택 — 작은 반짝 */}
      {!locked && (
        <Ellipse cx={-40} cy={-58} rx={6} ry={4} fill="#FFFFFF" opacity={0.85} />
      )}

      {/* 볼터치 */}
      <Ellipse cx={-42} cy={22} rx={17} ry={12} fill={`url(#${idCheek})`} />
      <Ellipse cx={42} cy={22} rx={17} ry={12} fill={`url(#${idCheek})`} />

      {/* 눈 — 살짝 타원으로 통통한 느낌 */}
      <Ellipse cx={-22} cy={-4} rx={7.5} ry={9} fill={d.eye} />
      <Ellipse cx={22} cy={-4} rx={7.5} ry={9} fill={d.eye} />
      {/* 눈 반짝 */}
      {!locked && (
        <>
          <Circle cx={-19} cy={-8} r={2.8} fill="#FFFFFF" />
          <Circle cx={25} cy={-8} r={2.8} fill="#FFFFFF" />
          {/* 아래쪽 작은 반짝 */}
          <Circle cx={-24} cy={1} r={1.2} fill="#FFFFFF" opacity={0.7} />
          <Circle cx={20} cy={1} r={1.2} fill="#FFFFFF" opacity={0.7} />
        </>
      )}

      {/* 입 — 살짝 미소 */}
      <Path
        d="M -10,22 Q 0,34 10,22"
        stroke={d.eye}
        strokeWidth={3.2}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
