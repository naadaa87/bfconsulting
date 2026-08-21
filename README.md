# BFC 종합경영자문서비스 홈페이지

정적 사이트입니다. 빌드 과정이 없어 GitHub에 올리면 Cloudflare Pages가 그대로 배포합니다.

---

## 1. 폴더 구조

```
├─ index.html          홈 (연계 인터랙션 위젯)
├─ about.html          BFC 소개 · 4대 핵심 · 리드 컨설턴트 · 역할 경계
├─ services.html       4대 도메인 20개 자문 영역 · 연계 매트릭스 · 이용 모델 · 산출물
├─ approach.html       BFC 360 · 효과 극대화 6장치 · 측정 체계 · 프로세스 · 비용 구조
├─ clinic.html         병의원 특화 솔루션 (개원 · 수익구조 · 의료광고 · 원무 · 세무)
├─ diagnosis.html      3분 자가진단 (16문항, 결과 즉시 산출)
├─ contact.html        상담 신청 폼
├─ faq.html            자주 묻는 질문 12개
├─ privacy.html        개인정보처리방침
├─ 404.html            없는 페이지
├─ robots.txt / sitemap.xml / _headers
└─ assets/
   ├─ css/site.css
   ├─ js/site.js        공통 (모바일 메뉴 · 스크롤 등장 · 연계 위젯)
   ├─ js/diagnosis.js   자가진단 문항 · 채점 · 결과
   ├─ js/contact.js     상담 폼 검증 · 전송
   └─ img/              로고 · 파비콘
```

---

## 2. GitHub에 올리기

GitHub 웹에서 하는 방법이 가장 간단합니다.

1. github.com 로그인 → 오른쪽 위 **＋** → **New repository**
2. 이름 예: `bfc-website` / **Public** 또는 **Private** 선택 → **Create repository**
3. 만들어진 화면에서 **uploading an existing file** 클릭
4. 이 폴더 안의 **파일과 폴더를 전부** 끌어다 놓기
   - ⚠️ `site` 폴더 자체가 아니라, **폴더 안의 내용물**을 올려야 합니다.
     (`index.html`이 저장소 최상단에 보여야 정상입니다)
5. 아래 **Commit changes** 클릭

---

## 3. Cloudflare Pages 연결

1. Cloudflare 로그인 → 좌측 **Workers & Pages** → **Create** → **Pages** 탭
   → **Connect to Git**
2. GitHub 계정 연결 후 방금 만든 저장소 선택
3. 빌드 설정 — **아무것도 입력하지 않습니다**
   | 항목 | 값 |
   |---|---|
   | Framework preset | None |
   | Build command | (비워둠) |
   | Build output directory | `/` |
4. **Save and Deploy** → 1분 내 배포 완료

이후에는 GitHub 파일을 수정할 때마다 자동으로 다시 배포됩니다.

### 기존 주소(bfconsulting.pages.dev)를 그대로 쓰려면
기존 Pages 프로젝트의 **Settings → Builds & deployments**에서 연결된 저장소를
이 저장소로 바꾸거나, 기존 프로젝트를 삭제한 뒤 같은 이름(`bfconsulting`)으로
새로 만들면 동일한 주소가 유지됩니다.

---

## 4. 상담 폼 — 메일로 바로 받기 (선택)

기본값은 **방문자의 메일 앱이 열리고 내용이 자동으로 채워지는 방식**입니다.
별도 설정 없이 바로 동작하지만, 방문자가 '보내기'를 눌러야 접수됩니다.

폼 내용이 **자동으로 메일함에 도착**하게 하려면 무료 서비스를 연결하면 됩니다.

**Web3Forms (가입만 하면 끝, 추천)**
1. https://web3forms.com 접속 → 이메일 입력 → Access Key 발급 (무료)
2. `assets/js/contact.js` 파일 맨 위 두 줄을 아래처럼 수정

```js
var FORM_ENDPOINT = "https://api.web3forms.com/submit";
var WEB3FORMS_KEY = "여기에-발급받은-키-붙여넣기";
```

**Formspree를 쓰는 경우**
```js
var FORM_ENDPOINT = "https://formspree.io/f/발급받은코드";
var WEB3FORMS_KEY = "";
```

저장 후 GitHub에 올리면 자동 반영됩니다.

---

## 5. 자주 바꾸게 되는 내용

| 바꿀 내용 | 위치 |
|---|---|
| 연락처 · 주소 | 각 HTML 하단 `footer`, `contact.html`, `assets/js/contact.js`의 `BFC_EMAIL` |
| 자가진단 문항 · 점수 기준 | `assets/js/diagnosis.js` 상단 `DOMAINS`, `ADVICE`, `TRACKS` |
| 연계 위젯 사례 | `assets/js/site.js` 의 `CASES` |
| 자문 영역 · 표 내용 | 해당 HTML 파일에서 직접 수정 |
| 색상 · 글꼴 | `assets/css/site.css` 최상단 `:root` |

---

## 6. 참고

- 글꼴(Pretendard, IBM Plex Mono)은 CDN에서 불러옵니다. 인터넷이 되는 환경에서만 정상 표시됩니다.
- 자가진단은 방문자의 브라우저 안에서만 계산되며, 상담을 신청하지 않으면 어디로도 전송되지 않습니다.
- `_headers` 파일은 Cloudflare Pages 전용 설정입니다(보안 헤더 · 캐시). 지우지 마세요.
- 도메인을 따로 구입해 연결하려면 Cloudflare Pages → **Custom domains**에서 추가하면 됩니다.
  이때 각 HTML의 `canonical` / `og:url` 주소와 `sitemap.xml`도 새 도메인으로 바꿔주세요.
