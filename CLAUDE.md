# Claude 작업 가이드

이 파일은 Claude Code가 매 세션 자동 로드한다. 말랑말랑 프로젝트의 정책·원칙을 요약하고, 본문 문서로 안내한다.

> 개인 글로벌 설정(언어, 커밋 메시지 등)은 `~/.claude/CLAUDE.md`에 별도로 있다. 이 파일은 **프로젝트 한정**.

## 프로젝트 한 줄 요약

말랑이·왁뿌볼 모티브의 스트레스 해소 토이 앱. **앱인토스(Apps in Toss) 미니앱**으로 배포 예정. 1인 개발.

기술 스택, 핵심 기능은 [README.md](./README.md) 참고.

## 정책 문서 (먼저 읽을 것)

| 주제 | 본문 |
|---|---|
| 브랜치 전략 | [docs/BRANCHING.md](./docs/BRANCHING.md) |
| PR 전략 | [docs/PULL_REQUEST.md](./docs/PULL_REQUEST.md) |
| 이슈 관리 | [docs/ISSUE.md](./docs/ISSUE.md) |
| 앱인토스 개발 환경 원칙 | [docs/APPS_IN_TOSS.md](./docs/APPS_IN_TOSS.md) |

## Claude 행동 요약

### 1. 자동 커밋 + push

의미 있는 작업 단위가 끝나면 **사용자 요청 없이도 자동으로 커밋 + push**한다 (1인 프로젝트, 사용자 사전 승인).

- 단순 탐색·읽기·실패한 시도만 있는 턴은 커밋하지 않음
- 커밋 메시지: `feat:` / `fix:` / `chore:` / `docs:` / `refactor:` prefix
- `Co-Authored-By:` 줄은 절대 추가하지 않음 (글로벌 규칙)
- **`main` 브랜치에는 절대 직접 push 금지** — feature 브랜치에서만
- 첫 push 시 `git push -u origin <branch>`

### 2. 브랜치

- 사용자가 작업을 요청했는데 현재 브랜치가 `main`이면 **새 브랜치 생성을 먼저 제안**
- 형식: `{type}/{kebab-case-요약}` (예: `feat/squishy-physics`)
- 이슈 작업이면 번호 포함: `feat/3-haptic-poc`
- 자세한 규칙: [docs/BRANCHING.md](./docs/BRANCHING.md)

### 3. PR 생성

`gh pr create` 직후 반드시:

- `--base main`
- `--assignee SJ0826`
- 라벨 1개: `FEAT` / `FIX` / `CHORE` (브랜치 prefix 기준)
- 본문에 `Closes #<이슈번호>` (이슈 작업인 경우)

PR 생성을 능동적으로 제안할 시점:
- 의미 있는 작업 단위가 끝나고 다음 작업의 성격이 다를 때
- 배포·태깅 직전
- 위험한 변경(메이저 업그레이드, config 구조 변경 등) 머지 직전
- 브랜치가 main에서 5커밋 이상 벌어졌을 때

자세한 규칙: [docs/PULL_REQUEST.md](./docs/PULL_REQUEST.md)

### 4. 이슈 관리

- 작업이 여러 PR로 쪼개질 가능성이 있거나 백로그성 항목은 **이슈로 먼저 생성 제안**
- 메타데이터: `[FEAT|FIX|CHORE]` prefix + 라벨 1개 + assignee=SJ0826
- 본문 템플릿: 배경(Why) / 할 일(What) / 완료 기준(DoD)
- 자세한 규칙: [docs/ISSUE.md](./docs/ISSUE.md)

### 5. 앱인토스 개발 환경 (자주 실수하는 영역)

말랑말랑은 앱인토스 미니앱이다. **일반 RN 앱처럼 다루지 말 것**:

- ❌ Xcode/Android Studio 네이티브 빌드 도구 제안 금지
- ❌ Apple Developer 계정/서명, 시뮬레이터·에뮬레이터 제안 금지
- ✅ 필요한 건 Node + npm + adb(Android만) + 샌드박스 앱 실기기

자세한 원칙: [docs/APPS_IN_TOSS.md](./docs/APPS_IN_TOSS.md)

### 6. 라이브러리 추가

네이티브 모듈을 추가할 때는 **Granite 호환 여부를 먼저 확인**한다 (`@granite-js/*` 문서 또는 호환성 PoC 참고).
