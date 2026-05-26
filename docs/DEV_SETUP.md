# 개발 환경 세팅

말랑말랑은 **앱인토스 미니앱**이다. Xcode/Android Studio 같은 네이티브 빌드 도구는 필요 없다. Metro 개발 서버 + 실기기 샌드박스 앱으로 개발한다.

> 앱인토스 개발 환경의 기본 원칙은 [APPS_IN_TOSS.md](./APPS_IN_TOSS.md) 참고.

## 사전 요건

- Node.js (LTS 권장)
- npm
- Android 실기기 연결 시: [Android Platform-Tools](https://developer.android.com/tools/releases/platform-tools) (`adb`)

```bash
brew install --cask android-platform-tools   # adb 설치 (macOS)
adb version                                   # 설치 확인
```

## 최초 세팅

```bash
npm install
```

## 개발 서버 실행

```bash
npm run dev   # Metro 개발 서버 (http://0.0.0.0:8081)
```

## 실기기 연결

### iOS

1. iPhone에 [앱인토스 샌드박스 앱](https://developers-apps-in-toss.toss.im/development/test/sandbox) 설치
2. Mac과 iPhone을 **같은 Wi-Fi**에 연결
3. Mac IP 확인:
   ```bash
   ipconfig getifaddr en0
   ```
4. 샌드박스 앱 실행 → IP 입력 → 스킴 `intoss://mallangmallang` 입력 → "스키마 열기"

### Android

1. Android 기기에 [앱인토스 샌드박스 앱](https://developers-apps-in-toss.toss.im/development/test/sandbox) 설치
2. 기기 설정 → 개발자 옵션 활성화 → USB 디버깅 ON
3. USB로 Mac에 연결 후 포트 포워딩:
   ```bash
   adb reverse tcp:8081 tcp:8081 && adb reverse tcp:5173 tcp:5173
   ```
4. 샌드박스 앱 실행 → 스킴 `intoss://mallangmallang` 입력 → "스키마 열기"

## 핫 리로드 확인

코드 수정 후 샌드박스 앱에서 자동으로 반영되면 정상.

## 빌드 (배포용 `.ait` 생성)

```bash
npm run build
```

산출물은 앱인토스 콘솔에서 업로드.

## 트러블슈팅

| 증상 | 해결 |
|---|---|
| iOS에서 앱이 안 열림 | Mac/iPhone 같은 Wi-Fi 확인, `npm run dev` 실행 여부 확인 |
| Android adb 연결 안 됨 | USB 디버깅 ON 확인, `adb devices`로 기기 인식 여부 확인 |
| 포트 충돌 | Metro 서버 이미 실행 중 여부 확인 (`lsof -i :8081`) |
| 번들 에러 | `npm install` 재실행 후 서버 재시작 |
