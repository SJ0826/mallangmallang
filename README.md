# 말랑말랑 (mallangmallang)

말랑이, 왁뿌볼 같은 촉감 장난감을 모티브로 한 스트레스 해소 토이 앱.  
토스 슈퍼앱 내 미니앱(앱인토스)으로 배포.

## 핵심 기능

- 터치/드래그로 캐릭터 변형 (스프링 물리)
- 변형 시 햅틱 + ASMR 사운드 트리거
- 캐릭터 수집 및 커스터마이징
- 광고 기반 무료 서비스

## 기술 스택

| 분류 | 기술 |
|---|---|
| 플랫폼 | [앱인토스 (Apps in Toss)](https://toss.im/apps-in-toss) |
| 프레임워크 | React Native (Granite) |
| 언어 | TypeScript |
| 햅틱 | `generateHapticFeedback` (앱인토스 SDK) |

## 개발 문서

- [브랜치 전략](./docs/BRANCHING.md)
- 의사결정 과정, 개발 일지, 트러블슈팅은 [Wiki](../../wiki)에서 확인할 수 있습니다.

## 시작하기

미니앱은 로컬 브라우저로 실행되지 않습니다. **앱인토스 [샌드박스 앱](https://developers-apps-in-toss.toss.im/development/test/sandbox)** 을 설치한 뒤 아래 순서로 실행하세요.

```bash
npm install
npm run dev   # Metro 개발 서버 (http://0.0.0.0:8081)
```

샌드박스 앱에서 스킴 `intoss://mallangmallang` 입력 → "스키마 열기".

- iOS 실기기: 맥과 같은 Wi-Fi에 연결, 샌드박스 앱에 맥 IP 입력 (`ipconfig getifaddr en0`)
- Android 실기기: USB 연결 후 `adb reverse tcp:8081 tcp:8081 && adb reverse tcp:5173 tcp:5173`

빌드 산출물(`.ait`) 생성:

```bash
npm run build
```
