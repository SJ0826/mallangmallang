import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSquishyHaptic } from './useSquishyHaptic';

interface Props {
  size: number;
  children: React.ReactNode;
  style?: ViewStyle;
}

const FOLLOW_RATIO = 0.7;
const SCALE_X_DIVISOR = 220; // 작을수록 적은 거리에 크게 늘어남
const SCALE_Y_FLOOR = 0.45; // 너무 얇아지지 않게

// 오버슈트 스프링 — release 후 1-2번 통통 튀는 느낌
const SPRING_CONFIG = {
  damping: 8,
  stiffness: 220,
  mass: 1.0,
  useNativeDriver: false,
} as const;

export function SquishyView({ size, children, style }: Props) {
  const panX = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const scaleX = useRef(new Animated.Value(1)).current;
  const scaleY = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  const haptic = useSquishyHaptic();
  // PanResponder 핸들러를 매 렌더 재생성하지 않도록 ref로 우회
  const hapticRef = useRef(haptic);
  hapticRef.current = haptic;

  // panX/panY 변화에 따라 scale·rotate를 추종시킨다.
  // release 시에는 panX/panY만 spring해도 listener가 자동으로 scale·rotate를 1·0으로 보낸다.
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    const idX = panX.addListener(({ value }) => {
      lastX = value;
      updateDerived(lastX, lastY);
    });
    const idY = panY.addListener(({ value }) => {
      lastY = value;
      updateDerived(lastX, lastY);
    });

    function updateDerived(x: number, y: number) {
      const distance = Math.sqrt(x * x + y * y);
      const dragDistance = distance / FOLLOW_RATIO;
      // 부피 보존 squish: 한쪽 늘어나면 다른 쪽 좁아짐 (scaleY ≈ 1/√scaleX)
      const sx = 1 + dragDistance / SCALE_X_DIVISOR;
      const sy = Math.max(SCALE_Y_FLOOR, 1 / Math.sqrt(sx));
      scaleX.setValue(sx);
      scaleY.setValue(sy);
      if (distance > 0.5) {
        rotate.setValue(Math.atan2(y, x));
      }
    }

    return () => {
      panX.removeListener(idX);
      panY.removeListener(idY);
    };
  }, [panX, panY, scaleX, scaleY, rotate]);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
        onPanResponderGrant: () => {
          panX.stopAnimation();
          panY.stopAnimation();
          scaleX.stopAnimation();
          scaleY.stopAnimation();
          rotate.stopAnimation();
          panX.setValue(0);
          panY.setValue(0);
          // 누르는 즉시 살짝 눌리는 squish 효과 — drag로 곧 덮어쓰임
          scaleX.setValue(0.92);
          scaleY.setValue(1.08);
          hapticRef.current.onGrant();
        },
        onPanResponderMove: (_, g) => {
          panX.setValue(g.dx * FOLLOW_RATIO);
          panY.setValue(g.dy * FOLLOW_RATIO);
          const dragDistance = Math.sqrt(g.dx * g.dx + g.dy * g.dy);
          hapticRef.current.onMove(dragDistance);
        },
        onPanResponderRelease: () => {
          Animated.parallel([
            Animated.spring(panX, { toValue: 0, ...SPRING_CONFIG }),
            Animated.spring(panY, { toValue: 0, ...SPRING_CONFIG }),
          ]).start(({ finished }) => {
            if (finished) {
              // 안전망: listener가 미세 잔차로 정확히 1·0에 못 닿았을 때
              scaleX.setValue(1);
              scaleY.setValue(1);
              rotate.setValue(0);
              hapticRef.current.onRestoreEnd();
            }
          });
        },
        onPanResponderTerminate: () => {
          Animated.parallel([
            Animated.spring(panX, { toValue: 0, ...SPRING_CONFIG }),
            Animated.spring(panY, { toValue: 0, ...SPRING_CONFIG }),
          ]).start(({ finished }) => {
            if (finished) {
              scaleX.setValue(1);
              scaleY.setValue(1);
              rotate.setValue(0);
            }
          });
        },
      }),
    [panX, panY, scaleX, scaleY, rotate],
  );

  const rotateDeg = rotate.interpolate({
    inputRange: [-Math.PI, Math.PI],
    outputRange: ['-180deg', '180deg'],
  });

  return (
    <View
      style={[styles.area, { width: size, height: size }, style]}
      {...responder.panHandlers}
    >
      <Animated.View
        pointerEvents="none"
        style={{
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [
            { translateX: panX },
            { translateY: panY },
            { rotate: rotateDeg },
            { scaleX },
            { scaleY },
          ],
        }}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  area: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
