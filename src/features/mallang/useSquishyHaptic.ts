import { generateHapticFeedback } from '@apps-in-toss/framework';
import { useCallback, useRef } from 'react';

type Stage = 'idle' | 'light' | 'medium' | 'heavy';

const LIGHT_THRESHOLD = 50;
const MEDIUM_THRESHOLD = 150;

export function useSquishyHaptic() {
  const stageRef = useRef<Stage>('idle');

  const onGrant = useCallback(() => {
    stageRef.current = 'idle';
    generateHapticFeedback({ type: 'tap' });
  }, []);

  const onMove = useCallback((distance: number) => {
    const next: Stage =
      distance >= MEDIUM_THRESHOLD ? 'heavy' : distance >= LIGHT_THRESHOLD ? 'medium' : 'light';

    if (next === stageRef.current) return;

    // 단계가 올라갈 때만 햅틱 발사. 손가락이 다시 줄어들 때는 침묵.
    const order: Stage[] = ['idle', 'light', 'medium', 'heavy'];
    if (order.indexOf(next) <= order.indexOf(stageRef.current)) {
      stageRef.current = next;
      return;
    }

    stageRef.current = next;
    if (next === 'light') generateHapticFeedback({ type: 'tickWeak' });
    else if (next === 'medium') generateHapticFeedback({ type: 'softMedium' });
    else if (next === 'heavy') generateHapticFeedback({ type: 'wiggle' });
  }, []);

  const onRestoreEnd = useCallback(() => {
    stageRef.current = 'idle';
    generateHapticFeedback({ type: 'tickMedium' });
  }, []);

  return { onGrant, onMove, onRestoreEnd };
}
