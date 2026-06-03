# PoC 결과: 햅틱·Reanimated·사운드

말랑말랑 MVP의 핵심 인터랙션(터치 변형 + 햅틱 + ASMR 사운드)을 위해 Granite 1.0.27 + RN 0.84 환경에서 세 의존성의 호환성을 검증한 결과를 정리한다.

검증 환경:
- `@apps-in-toss/framework` 2.5.1
- `@granite-js/react-native` 1.0.27
- `react` 19.2.3, `react-native` 0.84.0
- 번들링 검증: `npm run dev` 후 `http://localhost:8081/index.bundle?platform=ios&dev=true`로 iOS 번들 직접 요청해 빌드 성공 확인
- 실기기 동작 검증: **별도 진행 필요** (아래 "실기기 체크리스트" 참고)

PoC 페이지 진입 경로:
- `/poc-haptic`
- `/poc-reanimated`
- `/poc-sound`

---

## 햅틱

- **사용 라이브러리**: 앱인토스 SDK (`@apps-in-toss/framework`)
- **import**: `import { generateHapticFeedback } from '@apps-in-toss/framework'` (내부적으로 `@apps-in-toss/native-modules`를 re-export)
- **권한 설정**: `granite.config.ts`의 `permissions` 배열에 별도 추가 불필요
- **지원 타입 10종**:
  `tickWeak` · `tap` · `tickMedium` · `softMedium` · `basicWeak` · `basicMedium` · `success` · `error` · `wiggle` · `confetti`
- **번들링**: 별도 의존성 추가 없음 (SDK 내장)

말랑말랑 인터랙션 후보 매핑 (실기기 체감 후 확정):
- 변형 시작(터치다운): `tickWeak` 또는 `tap`
- 변형 최대치 도달: `softMedium`
- 복원 완료: `tickMedium`
- 특수 모드(왁뿌볼 등): `wiggle` / `confetti`

## Reanimated → ❌ 사용 불가 (RN Animated로 확정)

**검증 결과 (2026-06-03 실기기)**:
- 샌드박스 앱 진입 시 `TypeError: Cannot read property 'loadUnpackers' of undefined` (in `react-native-reanimated/src/index.ts`)
- `@granite-js/native/dist` 화이트리스트에 `react-native-reanimated`/`react-native-worklets`가 없음 → 워클릿 네이티브 모듈이 사전 포함되지 않아 import 시점에 즉시 크래시
- 페이지 진입뿐 아니라 `require.context` 기반 라우터가 모든 페이지를 훑는 과정에서 동반 실패 → 앱 전체가 뜨지 않음

**결정**: `react-native-reanimated` + `react-native-worklets` 의존성 **제거**, RN 내장 `Animated` API로 진행.
- `babel.config.js`의 `react-native-worklets/plugin` 제거
- `src/pages/poc-reanimated.tsx`를 `Animated.spring` + `useNativeDriver: true`로 재작성 (페이지 라우트명은 `/poc-reanimated` 유지)
- 토이 인터랙션 수준에서는 충분. 게임 수준 60fps가 필요한 시점에 다시 평가.

**향후 재검토 조건**: Granite 컨테이너가 reanimated/worklets 네이티브 모듈을 사전 포함하는 버전을 릴리스할 경우.

## 사운드

- **사용 라이브러리**: `react-native-sound@^0.13.0`
- **번들링**: ✅ 정상. 번들 사이즈 영향 미미
- **자산 통합 문제**: react-native-sound는 `require()` 기반 asset bundling을 지원하지 않고, iOS Main Bundle / Android `res/raw` 폴더에 사운드 파일을 직접 넣어야 함. **Granite는 네이티브 빌드 도구(Xcode/Android Studio)를 직접 사용하지 않으므로 로컬 mp3/m4a를 번들에 포함시키는 표준 방법이 없다.** 현재 PoC는 검증을 위해 외부 HTTPS URL로 우회 재생
- **PoC 동작**: `/poc-sound`에서 외부 URL의 wav 파일 로드 → 재생 버튼으로 1회 재생
- **런타임 동작**: ⚠️ 실기기 검증 필요. reanimated와 동일 리스크 (네이티브 모듈 사전 포함 여부)

**후속 작업으로 분리할 항목**:
1. 로컬 효과음 자산 번들링 방식 결정 (앱인토스 문서에 가이드 요청, 또는 CDN 배포)
2. `expo-audio` / `react-native-track-player` 대안 평가 (require 지원 여부 + Granite 호환 여부)
3. ASMR 효과음 라이선스 정리 (Freesound CC0, Pixabay 등)

## 공통 주의사항

- `@granite-js/native/dist`에 사전 포함된 네이티브 모듈 화이트리스트:
  `@react-native-async-storage`, `@react-navigation`, `@shopify/...`, `lottie-react-native`, `react-native-fast-image`, `react-native-gesture-handler`, `react-native-pager-view`, `react-native-safe-area-context`, `react-native-screens`, `react-native-svg`, `react-native-video`, `react-native-webview`
- 위 목록 밖의 네이티브 모듈은 번들링은 되어도 런타임 크래시 가능성이 있으므로 **실기기 검증을 반드시 거칠 것**
- 새 라이브러리 추가 시 `npm run dev` 후 `curl http://localhost:8081/index.bundle?platform=ios&dev=true -o /tmp/b.js`로 번들링 통과 여부를 먼저 확인 (실기기 없이도 가능한 1차 검증)

## 실기기 체크리스트

이 PoC가 DoD를 만족하려면 아래를 별도로 확인해야 한다:

### iOS
- [ ] 샌드박스 앱에서 `intoss://mallangmallang` 진입
- [ ] `/poc-haptic` 10개 버튼 진동 차이 체감 후 매핑 노트 갱신
- [ ] `/poc-reanimated` (Animated 버전) 원 터치 시 스프링 동작 확인
- [ ] `/poc-sound` 로드 성공 후 재생 확인 (외부 URL 네트워크 권한 필요)

### Android
- [ ] `adb reverse tcp:8081 tcp:8081 && adb reverse tcp:5173 tcp:5173`
- [ ] iOS와 동일 항목 확인

### 빌드
- [ ] `npm run build`로 `.ait` 산출 성공 여부 (production 환경 변수에서도 worklets babel plugin 작동하는지)
