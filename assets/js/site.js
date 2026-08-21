/* ==========================================================================
   BFC — shared behaviour: mobile nav, scroll reveal, linkage widget, accordion
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- mobile nav ---------- */
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("nav--open", !open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && window.innerWidth <= 980) {
        burger.setAttribute("aria-expanded", "false");
        nav.classList.remove("nav--open");
      }
    });
  }

  /* ---------- year ---------- */
  var y = document.querySelectorAll("[data-year]");
  for (var i = 0; i < y.length; i++) y[i].textContent = new Date().getFullYear();

  /* ---------- scroll reveal ---------- */
  var rv = document.querySelectorAll(".rv");
  if (rv.length) {
    if (!("IntersectionObserver" in window)) {
      for (var j = 0; j < rv.length; j++) rv[j].classList.add("in");
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
      for (var k = 0; k < rv.length; k++) io.observe(rv[k]);
    }
  }
})();

/* ==========================================================================
   Linkage widget — pick a request, see which domains must move together.
   This is the site's argument for integrated advisory, made operable.
   ========================================================================== */
(function () {
  "use strict";
  var box = document.getElementById("linkage");
  if (!box) return;

  // domain keys: S=경영·전략, F=재무·자금, G=성장·마케팅, O=조직·운영·리스크
  var CASES = [
    {
      id: "open",
      label: "개원 · 신규 출점을 준비 중입니다",
      surface: "인테리어 견적부터 받아보려 합니다",
      on: ["S", "F", "G", "O"],
      body: "공사 견적은 마지막 순서입니다. 먼저 <strong>상권과 손익</strong>으로 규모가 타당한지 검증하고(경영·전략), 필요한 <strong>자금의 조달 구조</strong>를 짠 뒤(재무·자금), 그 위에서 공간 설계와 개원 마케팅을 붙이고(성장·마케팅), 인허가 일정과 채용을 맞춥니다(조직·운영). 순서가 뒤집히면 공사비가 사업계획을 결정하게 됩니다."
    },
    {
      id: "sales",
      label: "매출이 몇 달째 제자리입니다",
      surface: "광고를 더 돌려야 할까요",
      on: ["G", "F", "O"],
      body: "광고를 늘리기 전에 <strong>문의가 계약으로 이어지는 비율</strong>부터 봅니다(성장·마케팅). 전환이 낮다면 원인은 상담 동선과 인력 배치일 수 있고(조직·운영), 팔릴수록 손해인 <strong>가격·원가 구조</strong>가 문제일 수도 있습니다(재무·자금). 새는 그릇에 물을 더 붓는 일부터 막습니다."
    },
    {
      id: "labor",
      label: "인건비 부담이 너무 큽니다",
      surface: "인원을 줄여야 할 것 같습니다",
      on: ["O", "S", "F"],
      body: "감원은 가장 마지막 수단입니다. 먼저 <strong>직무와 역할</strong>을 다시 그려 중복을 걷어내고(조직·운영), 반복 업무를 자동화로 대체할 수 있는지 봅니다. 그래도 남는 부담은 <strong>수익구조와 가격</strong>에서 풀어야 하고(재무·자금), 애초에 그 인력이 필요한 사업 범위였는지도 함께 점검합니다(경영·전략)."
    },
    {
      id: "cash",
      label: "운영 자금이 부족합니다",
      surface: "대출을 알아보려 합니다",
      on: ["F", "S", "O"],
      body: "조달 조건은 신청 직전이 아니라 <strong>평소의 재무 상태</strong>가 결정합니다(재무·자금). 가지급금과 부채 구조를 정리하고, 활용 가능한 <strong>정책자금·보증·기업인증</strong>을 검토합니다. 동시에 자금이 필요한 이유가 일시적 부족인지 구조적 적자인지 가려야 하고(경영·전략), 계약과 정산 주기도 함께 봅니다(조직·운영)."
    },
    {
      id: "succ",
      label: "승계나 매각을 생각하고 있습니다",
      surface: "세무사와 상담해보려 합니다",
      on: ["S", "F", "O", "G"],
      body: "세금은 결과이지 출발점이 아닙니다. <strong>기업가치를 좌우하는 항목</strong>(가지급금·자산·지분 구조)을 먼저 정리하고(재무·자금), 지배구조와 승계 시점을 설계합니다(경영·전략). 대표가 빠져도 돌아가도록 <strong>조직과 매뉴얼</strong>을 남기는 일(조직·운영), 실적과 브랜드를 안정적으로 유지하는 일(성장·마케팅)이 결국 가치를 만듭니다."
    },
    {
      id: "ad",
      label: "병의원 광고가 규제에 걸릴까 걱정입니다",
      surface: "대행사에 맡기면 되지 않나요",
      on: ["G", "O", "F"],
      body: "대행사는 광고 효과를 책임지지만, <strong>법적 책임은 원장의 면허</strong>에 남습니다. 매체와 문구가 사전심의 기준에 맞는지 확인하고(성장·마케팅), 비급여 고지와 기록 관리를 정비하며(조직·운영·리스크), 광고비가 실제 수익으로 돌아오는지 <strong>진료과목별 손익</strong>으로 검증합니다(재무·자금)."
    }
  ];

  var DOMAIN_NAMES = { S: "경영 · 전략", F: "재무 · 자금", G: "성장 · 마케팅", O: "조직 · 운영 · 리스크" };

  var chips = box.querySelectorAll(".chip");
  var out = box.querySelector(".linkout");
  var svg = box.querySelector(".linkdiag");

  function apply(id) {
    var c = null;
    for (var i = 0; i < CASES.length; i++) if (CASES[i].id === id) c = CASES[i];
    if (!c) return;

    for (var a = 0; a < chips.length; a++) {
      chips[a].setAttribute("aria-pressed", String(chips[a].dataset.case === id));
    }

    var nodes = svg.querySelectorAll(".node");
    for (var n = 0; n < nodes.length; n++) {
      var key = nodes[n].dataset.k;
      var active = c.on.indexOf(key) > -1;
      nodes[n].classList.toggle("on", active);
      nodes[n].classList.toggle("dim", !active);
    }
    var edges = svg.querySelectorAll(".edge");
    for (var e = 0; e < edges.length; e++) {
      var pair = edges[e].dataset.e.split("-");
      var lit = c.on.indexOf(pair[0]) > -1 && c.on.indexOf(pair[1]) > -1;
      edges[e].classList.toggle("on", lit);
      edges[e].classList.toggle("off", !lit);
    }

    var tags = c.on.map(function (k) { return '<span class="tag">' + DOMAIN_NAMES[k] + "</span>"; }).join("");
    out.innerHTML =
      '<div style="margin-bottom:9px">' + tags + "</div>" +
      '<p style="margin:0 0 8px;color:var(--mut);font-size:13.5px">흔한 접근 — “' + c.surface + '”</p>' +
      "<p style=\"margin:0\">" + c.body + "</p>";
  }

  for (var i = 0; i < chips.length; i++) {
    (function (chip) {
      chip.addEventListener("click", function () { apply(chip.dataset.case); });
    })(chips[i]);
  }

  apply(CASES[0].id);
})();
