import { generateHapticFeedback } from '@apps-in-toss/framework';
import { useCallback, useMemo, useRef } from 'react';

type Stage = 'idle' | 'light' | 'medium' | 'heavy';

const LIGHT_THRESHOLD = 60;
const MEDIUM_THRESHOLD = 160;
const CONTINUOUS_TICK_DISTANCE = 45;

const ORDER: Stage[] = ['idle', 'light', 'medium', 'heavy'];

export function useSquishyHaptic() {
  const stageRef = useRef<Stage>('idle');
  const lastTickDistRef = useRef<number>(0);

  const onGrant = useCallback(() => {
    stageRef.current = 'idle';
    lastTickDistRef.current = 0;
    generateHapticFeedback({ type: 'softMedium' });
  }, []);

  const onMove = useCallback((distance: number) => {
    // 단계 햅틱 — 임계점을 처음 넘을 때만 발사
    const next: Stage =
      distance >= MEDIUM_THRESHOLD ? 'heavy' : distance >= LIGHT_THRESHOLD ? 'medium' : 'light';

    if (next !== stageRef.current) {
      const goingUp = ORDER.indexOf(next) > ORDER.indexOf(stageRef.current);
      stageRef.current = next;
      if (goingUp) {
        if (next === 'light') generateHapticFeedback({ type: 'tickMedium' });
        else if (next === 'medium') generateHapticFeedback({ type: 'softMedium' });
        else if (next === 'heavy') generateHapticFeedback({ type: 'wiggle' });
      }
    }

    // 연속 햅틱 — 일정 거리 변할 때마다 약한 tick (지지직 연속 피드백)
    if (Math.abs(distance - lastTickDistRef.current) >= CONTINUOUS_TICK_DISTANCE) {
      lastTickDistRef.current = distance;
      generateHapticFeedback({ type: 'tickWeak' });
    }
  }, []);

  const onRestoreEnd = useCallback(() => {
    stageRef.current = 'idle';
    lastTickDistRef.current = 0;
    generateHapticFeedback({ type: 'success' });
  }, []);

  return useMemo(() => ({ onGrant, onMove, onRestoreEnd }), [onGrant, onMove, onRestoreEnd]);
}
