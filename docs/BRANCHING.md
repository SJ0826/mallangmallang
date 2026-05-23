# 브랜치 전략

1인 개발 + 미니앱 프로젝트라서 **GitHub Flow 단순화 버전**을 사용합니다.

## 원칙

- `main`은 **항상 배포 가능한 상태**를 유지한다.
- `main`에는 **직접 push하지 않는다**. 모든 변경은 PR 경유.
- 작업은 짧게 살아있는 **feature 브랜치**에서 진행하고, 머지 후 삭제한다.
- 브랜치명은 `{type}/{kebab-case-요약}` 형식.

## 브랜치 종류

| 브랜치 | 용도 |
|--------|------|
| `main` | 배포(릴리스) 가능한 코드. 직접 커밋·push 금지 |
| `feat/*` | 신규 기능 (예: `feat/squishy-physics`) |
| `fix/*` | 버그 수정 (예: `fix/haptic-not-firing`) |
| `chore/*` | 설정·빌드·패키지·리브랜딩 등 (예: `chore/rebrand-mallangmallang`) |
| `docs/*` | 문서만 변경 (예: `docs/onboarding-guide`) |
| `refactor/*` | 동작 변화 없는 구조 개선 (예: `refactor/extract-character-store`) |
| `release/*` | 출시 직전 릴리스 후보 (예: `release/v0.1.0`) — 선택 |

## 작업 흐름

```bash
# 1. 최신 main에서 분기
git checkout main && git pull
git switch -c feat/squishy-physics

# 2. 작업 + 커밋 (의미 있는 단위로)
git add .
git commit -m "feat: 캐릭터 스프링 물리 적용"

# 3. 원격에 push
git push -u origin feat/squishy-physics

# 4. GitHub에서 PR 생성 → main으로 머지
gh pr create --base main --fill

# 5. 머지 후 로컬·원격 브랜치 정리
git checkout main && git pull
git branch -d feat/squishy-physics
git push origin --delete feat/squishy-physics
```

## 머지 방식

- **Squash and merge 권장** — main 히스토리를 깔끔하게 유지.
- PR 제목이 그대로 squash 커밋 메시지가 되므로, **PR 제목을 커밋 컨벤션에 맞춰 작성**한다.

## 커밋 메시지 컨벤션

타입 prefix를 사용한다. 한국어 본문 OK.

```
feat: 캐릭터 변형 스프링 물리 추가
fix: iOS 햅틱이 첫 탭에서 무시되는 문제 해결
chore: granite 1.0.27 → 1.0.28 업그레이드
docs: README 시작하기 섹션 보강
refactor: 캐릭터 상태를 store로 분리
```

`Co-Authored-By:` 줄은 사용하지 않는다.

## 출시 / 태깅 (예정)

- 첫 라이브 출시 전까지는 `v0.x.x`로 사전 태깅.
- 라이브 출시는 `v1.0.0`부터.
- 태그 푸시는 콘솔 업로드 시점에 맞춰 수동.
