# 이슈 관리 정책

[브랜치 전략](./BRANCHING.md), [PR 전략](./PULL_REQUEST.md)과 짝을 이룬다. GitHub Issues를 백로그·작업 단위 추적용으로 사용한다.

## 이슈 생성 시점

- 작업이 한 번에 끝나지 않고 여러 PR로 쪼개질 가능성이 있을 때
- 버그를 발견했지만 즉시 고치지 않고 백로그에 쌓을 때
- MVP 핵심 기능 중 아직 이슈로 명시되지 않은 것을 발견했을 때

> typo·메모 같은 마이크로 변경은 이슈 없이 바로 PR로 간다.

## 이슈 메타데이터 (PR과 동일)

- **라벨**: 정확히 1개 부여
  - `FEAT` — 신규 기능
  - `FIX` — 버그 수정
  - `CHORE` — 설정·문서·리팩토링
- **Assignee**: `SJ0826` (본인)
- **제목 형식**: `[FEAT] 햅틱 PoC`, `[FIX] 드래그 시 튕김` 처럼 대괄호 prefix + 한글 요약

## 이슈 본문 템플릿

```markdown
## 배경 (Why)
<왜 필요한지 / 어떤 문제를 해결하는지>

## 할 일 (What)
- [ ] 구체적 작업 1
- [ ] 구체적 작업 2

## 완료 기준 (DoD)
<무엇이 충족되면 close할 수 있는지>
```

1인 프로젝트이므로 "6개월 뒤의 본인"이 빠르게 맥락 파악할 수 있게 작성한다.

## 이슈 → 작업 연결

- 이슈 작업 시작 시 **브랜치명에 이슈 번호 포함**: `feat/3-haptic-poc`, `fix/12-drag-bounce`
- PR 본문에 `Closes #<번호>` 자동 삽입 → squash merge 시 이슈 자동 종료
- 작업 시작 전 `gh issue view <num>`으로 컨텍스트 재확인

## 이슈 관리·정리

- 정기 백로그 정리: stale 이슈 검토 후 close·업데이트
- 라벨·assignee 누락 확인
- PR이 너무 커질 것 같을 때 이슈를 쪼개고 PR도 분리

## `gh` CLI 치트시트

```bash
# 생성 (라벨·assignee 자동 부여)
gh issue create --title "[FEAT] 햅틱 PoC" --body "..." --label FEAT --assignee SJ0826

# 조회
gh issue list --label FEAT --state open
gh issue view 3

# 수정·종료
gh issue edit 3 --add-label FIX --remove-label FEAT
gh issue close 3 --comment "..."
gh issue comment 3 --body "..."
```
