# 앱인토스 개발 환경 원칙

말랑말랑은 **앱인토스(Apps in Toss) 미니앱**이다. 일반 React Native 앱이 아니므로 네이티브 빌드·배포 과정이 다르다.

## 핵심 원칙

토스 앱(또는 샌드박스 앱) 컨테이너가 JS 번들을 로드해서 실행한다.  
**네이티브 빌드는 Granite와 토스 인프라가 처리**하므로 로컬에서 Xcode/Android Studio로 빌드할 일이 없다.

## 필요한 것

- Node + npm (Granite 권장 버전 충족)
- `npm run dev` → Metro 개발 서버 (포트 8081)
- 앱인토스 **샌드박스 앱**이 설치된 실기기 (iOS / Android)

### iOS 실기기 연결

- 맥과 iPhone을 **같은 Wi-Fi**에 연결
- `ipconfig getifaddr en0`로 맥 IP 확인 → 샌드박스 앱에 입력
- 스킴 `intoss://mallangmallang` 입력해 앱 실행

### Android 실기기 연결

- Android Platform-Tools(`adb`) 설치 — `brew install --cask android-platform-tools`
- 기기에서 개발자 옵션 + USB 디버깅 활성화
- USB 연결 후:
  ```bash
  adb reverse tcp:8081 tcp:8081 && adb reverse tcp:5173 tcp:5173
  ```
- 샌드박스 앱에서 스킴 입력해 앱 실행

## 필요 없는 것

다음은 일반 RN 앱에는 필요하지만 앱인토스에는 **불필요**하다. 환경 셋업·트러블슈팅·이슈 작성 시 이 항목들을 추가하지 말 것.

- ❌ Xcode 풀 설치, Command Line Tools, CocoaPods
- ❌ Apple Developer 계정, 프로비저닝 프로파일, 코드 서명
- ❌ Android Studio, JDK, full Android SDK
- ❌ `ANDROID_HOME` / `JAVA_HOME` 환경 변수 (adb만 있으면 됨)
- ❌ 시뮬레이터 / 에뮬레이터 (실기기 샌드박스 앱으로만 테스트)
- ❌ `react-native run-ios` / `run-android` 명령

## 배포

```bash
npm run build   # .ait 산출물 생성
```

→ 앱인토스 콘솔에 `.ait` 업로드.  
앱스토어·플레이스토어 등록 절차 없음.

## 라이브러리 호환성

Granite 환경에서 동작 가능한 RN 라이브러리만 사용 가능하다. 네이티브 모듈을 추가할 때는 **반드시 Granite 호환 여부를 먼저 확인**할 것.

- 공식 문서: https://tossmini-docs.toss.im/
- 햅틱은 앱인토스 SDK의 `generateHapticFeedback` 사용
- TDS는 `@toss/tds-react-native` (Granite ≥ 1.0)
