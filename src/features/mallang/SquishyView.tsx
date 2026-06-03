import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { useSquishyHaptic } from './useSquishyHaptic';

interface Props {
  source: ImageSourcePropType;
  size?: number;
}

const FOLLOW_RATIO = 0.6;
const SCALE_X_DIVISOR = 400;
const SCALE_Y_DIVISOR = 800;
const SCALE_Y_FLOOR = 0.7;

const SPRING_CONFIG = {
  damping: 12,
  stiffness: 180,
  mass: 1.2,
  useNativeDriver: false,
} as const;

export function SquishyView({ source, size = 240 }: Props) {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scaleX = useRef(new Animated.Value(1)).current;
  const scaleY = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const haptic = useSquishyHaptic();

  useEffect(() => {
    const id = pan.addListener(({ x, y }) => {
      const distance = Math.sqrt(x * x + y * y);
      // FOLLOW_RATIO를 되돌려 실제 손가락 변위 기준으로 변형
      const dragDistance = distance / FOLLOW_RATIO;
      scaleX.setValue(1 + dragDistance / SCALE_X_DIVISOR);
      scaleY.setValue(Math.max(SCALE_Y_FLOOR, 1 - dragDistance / SCALE_Y_DIVISOR));
      if (distance > 0.5) {
        rotate.setValue(Math.atan2(y, x));
      }
    });
    return () => {
      pan.removeListener(id);
    };
  }, [pan, scaleX, scaleY, rotate]);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          pan.stopAnimation();
          scaleX.stopAnimation();
          scaleY.stopAnimation();
          rotate.stopAnimation();
          pan.setValue({ x: 0, y: 0 });
          haptic.onGrant();
        },
        onPanResponderMove: (_, g) => {
          pan.setValue({ x: g.dx * FOLLOW_RATIO, y: g.dy * FOLLOW_RATIO });
          const dragDistance = Math.sqrt(g.dx * g.dx + g.dy * g.dy);
          haptic.onMove(dragDistance);
        },
        onPanResponderRelease: () => {
          Animated.parallel([
            Animated.spring(pan, { toValue: { x: 0, y: 0 }, ...SPRING_CONFIG }),
            Animated.spring(scaleX, { toValue: 1, ...SPRING_CONFIG }),
            Animated.spring(scaleY, { toValue: 1, ...SPRING_CONFIG }),
            Animated.spring(rotate, { toValue: 0, ...SPRING_CONFIG }),
          ]).start(({ finished }) => {
            if (finished) haptic.onRestoreEnd();
          });
        },
        onPanResponderTerminate: () => {
          Animated.parallel([
            Animated.spring(pan, { toValue: { x: 0, y: 0 }, ...SPRING_CONFIG }),
            Animated.spring(scaleX, { toValue: 1, ...SPRING_CONFIG }),
            Animated.spring(scaleY, { toValue: 1, ...SPRING_CONFIG }),
            Animated.spring(rotate, { toValue: 0, ...SPRING_CONFIG }),
          ]).start();
        },
      }),
    [pan, scaleX, scaleY, rotate, haptic],
  );

  const rotateDeg = rotate.interpolate({
    inputRange: [-Math.PI, Math.PI],
    outputRange: ['-180deg', '180deg'],
  });

  return (
    <View
      style={[styles.area, { width: size, height: size }]}
      {...responder.panHandlers}
    >
      <Animated.Image
        source={source}
        resizeMode="contain"
        style={{
          width: size,
          height: size,
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { rotate: rotateDeg },
            { scaleX },
            { scaleY },
          ],
        }}
      />
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
