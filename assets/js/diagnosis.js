/* ==========================================================================
   BFC 자가진단 — 16문항 · 4도메인
   점수를 매기는 것이 목적이 아니라, 어느 영역부터 손대야 하는지와
   그 영역이 어떤 영역을 함께 흔드는지를 보여주는 것이 목적입니다.
   ========================================================================== */
(function () {
  "use strict";
  var root = document.getElementById("dg");
  if (!root) return;

  /* ---------------- data ---------------- */
  var TYPES = [
    { k: "clinic", t: "병원 · 의원 · 한의원", d: "개원 · 진료 · 원무 운영" },
    { k: "corp", t: "중소기업 · 법인", d: "제조 · 유통 · 서비스 법인" },
    { k: "solo", t: "개인사업자 · 예비창업", d: "매장 운영 또는 창업 준비" }
  ];

  var DOMAINS = [
    {
      k: "S", name: "경영 · 전략", en: "STRATEGY",
      desc: "방향과 우선순위, 그리고 무엇을 하지 않을지에 대한 판단",
      qs: [
        "올해와 내년의 목표가 숫자로 정리되어 있고, 함께 일하는 사람이 그 목표를 알고 있다",
        "무엇을 줄이거나 그만둘지가 정해져 있다 (늘릴 것만이 아니라)",
        "새로운 투자나 확장을 결정할 때 손익과 회수 기간을 먼저 계산한다",
        "중요한 결정을 검토하는 회의나 보고 주기가 정해져 있다"
      ]
    },
    {
      k: "F", name: "재무 · 자금", en: "FINANCE",
      desc: "숫자를 보는 눈과, 필요한 자금을 제때 확보하는 준비",
      qs: [
        "매달 매출뿐 아니라 이익률과 현금 잔고를 확인한다",
        "고정비를 항목별로 점검하고, 계약을 다시 협상해본 적이 있다",
        "앞으로 6개월 안에 필요한 자금 규모와 조달 방법이 정리되어 있다",
        "활용 가능한 정책자금 · 지원사업 · 기업인증을 검토해본 적이 있다"
      ]
    },
    {
      k: "G", name: "성장 · 마케팅", en: "GROWTH",
      desc: "고객이 들어오는 경로와, 들어온 고객이 남는 구조",
      qs: [
        "고객이 어느 경로로 들어오는지 숫자로 파악하고 있다",
        "문의가 실제 계약(예약)으로 이어지는 비율을 관리한다",
        "광고 · 홍보 문구가 관련 법규에 어긋나지 않는지 사전에 확인한다",
        "기존 고객의 재방문 · 재구매를 관리하는 방법이 있다"
      ]
    },
    {
      k: "O", name: "조직 · 운영 · 리스크", en: "OPERATIONS",
      desc: "계획이 실제로 굴러가게 만드는 사람과 절차, 그리고 안전장치",
      qs: [
        "직원별 역할과 평가 기준이 문서로 정리되어 있다",
        "근로계약서 · 취업규칙이 최신 법령에 맞게 정비되어 있다",
        "반복되는 업무 중 자동화하거나 도구로 대체한 것이 있다",
        "주요 계약서를 체결 전에 검토하는 절차가 있다"
      ]
    }
  ];

  var OPTS = [
    { v: 2, t: "잘 되어 있다" },
    { v: 1, t: "보통이다" },
    { v: 0, t: "미흡하다" }
  ];

  /* 취약 도메인별 권고 — 업종에 따라 첫 항목을 바꿔 끼웁니다 */
  var ADVICE = {
    S: {
      title: "방향부터 다시 세워야 합니다",
      why: "목표와 우선순위가 흐리면 나머지 영역의 노력이 서로 다른 곳을 향합니다. 마케팅과 채용, 투자 결정이 각각 따로 놀기 시작하는 지점이 여기입니다.",
      items: {
        clinic: ["진료과목별 손익과 목표 환자 수를 숫자로 정리", "확장 · 장비 도입 결정 기준 세우기", "월간 경영회의 도입"],
        corp: ["연간 · 분기 목표를 숫자로 확정하고 공유", "중단 · 축소할 사업 정리", "의사결정 회의체와 보고 체계 정비"],
        solo: ["月 손익 목표와 손익분기점 계산", "확장 판단 기준 정하기", "주간 점검 루틴 만들기"]
      },
      chain: "전략이 흔들리면 재무(투자 판단)와 조직(인력 계획)이 함께 흔들립니다."
    },
    F: {
      title: "돈의 흐름을 먼저 잡아야 합니다",
      why: "매출은 보이지만 이익과 현금은 보이지 않는 상태입니다. 이 상태에서는 좋은 기회가 와도 잡을 수 없고, 나쁜 신호도 늦게 발견됩니다.",
      items: {
        clinic: ["급여 · 비급여 등 매출 축별 비중과 원가 파악", "고정비 · 장비 리스 조건 점검", "정책자금 · 지원제도 활용 여지 확인"],
        corp: ["월간 손익 · 현금흐름 관리표 도입", "고정비 항목별 재협상", "정책자금 · 보증 · 기업인증 로드맵 수립"],
        solo: ["월 고정비와 손익분기 매출 확정", "카드 · 임대 · 구독 지출 정리", "소상공인 지원제도 확인"]
      },
      chain: "재무가 약하면 자금조달 조건이 나빠지고, 승계나 매각 시점의 기업가치까지 영향을 받습니다."
    },
    G: {
      title: "유입보다 전환을 먼저 봐야 합니다",
      why: "광고비를 늘려도 성과가 오르지 않는 전형적인 구조입니다. 새는 그릇을 고치기 전에 물을 더 붓고 있는 상태일 수 있습니다.",
      items: {
        clinic: ["유입 경로별 문의 수와 예약 전환율 측정", "의료광고 심의 기준에 따른 콘텐츠 점검", "상담 스크립트와 재방문 관리 체계"],
        corp: ["채널별 유입 · 상담 · 계약 전환율 측정", "영업 단계 정의와 고객관리(CRM) 정비", "재구매 · 이탈 관리 설계"],
        solo: ["유입 경로 파악과 기록 시작", "상담 · 응대 방식 정리", "단골 관리 방법 만들기"]
      },
      chain: "마케팅만 손대면 공간 · 인력 · 가격이 받쳐주지 못해 성과가 나오지 않습니다."
    },
    O: {
      title: "실행 기반과 안전장치가 필요합니다",
      why: "사람과 절차가 정리되지 않으면 대표가 모든 일을 붙잡게 됩니다. 노무와 계약은 평소에는 조용하다가 한 번에 큰 비용으로 돌아옵니다.",
      items: {
        clinic: ["직무별 역할 · 평가 기준 문서화", "근로계약서 · 취업규칙 최신 법령 반영", "예약 · 접수 · 정산 업무 자동화 검토"],
        corp: ["역할과 권한 정의, 평가 기준 수립", "근로계약 · 취업규칙 정비 (노무 전문가 연계)", "반복 업무 자동화와 매뉴얼화"],
        solo: ["업무 매뉴얼 만들기", "근로계약서 정비", "예약 · 정산 도구 도입"]
      },
      chain: "조직이 약하면 아무리 좋은 전략도 실행 단계에서 멈춥니다."
    }
  };

  var TRACKS = {
    check: { k: "CHECK 진단형", d: "2–4주 동안 전 영역을 훑어 문제와 우선순위를 확정합니다. 가장 부담 없이 시작하는 방법입니다." },
    project: { k: "PROJECT 프로젝트형", d: "진단 후, 가장 급한 과제부터 2–6개월 단위로 실행을 총괄합니다." },
    office: { k: "OFFICE 상시자문형", d: "월간 경영회의로 숫자와 과제를 계속 점검하며 구조를 유지 · 고도화합니다." }
  };

  /* ---------------- state ---------------- */
  var state = { type: null, ans: {}, step: 0 };
  var TOTAL_STEPS = 5; // 0: type, 1-4: domains

  /* ---------------- build ---------------- */
  var fill = root.querySelector(".dg__fill");
  var stepLabel = root.querySelector("[data-steplabel]");
  var countLabel = root.querySelector("[data-countlabel]");
  var panels = root.querySelector("[data-panels]");

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /* step 0 — business type */
  var p0 = el("div", "dg__panel on");
  p0.setAttribute("data-panel", "0");
  p0.appendChild(el("div", "dg__stephd",
    "<h2>어떤 사업을 하고 계신가요?</h2><p>업종에 따라 먼저 살펴야 할 항목이 달라집니다.</p>"));
  var pr = el("div", "pickrow");
  TYPES.forEach(function (t) {
    var lab = el("label", "pick");
    lab.innerHTML = '<input type="radio" name="btype" value="' + t.k + '"><span>' + t.t +
      "<small>" + t.d + "</small></span>";
    pr.appendChild(lab);
  });
  p0.appendChild(pr);
  panels.appendChild(p0);

  /* steps 1-4 — domains */
  DOMAINS.forEach(function (d, di) {
    var p = el("div", "dg__panel");
    p.setAttribute("data-panel", String(di + 1));
    p.appendChild(el("div", "dg__stephd",
      '<p class="eyebrow eyebrow--plain mono" style="margin-bottom:8px">' + d.en + "</p>" +
      "<h2>" + d.name + "</h2><p>" + d.desc + "</p>"));
    d.qs.forEach(function (q, qi) {
      var id = d.k + qi;
      var box = el("div", "q");
      box.innerHTML = '<div class="q__t"><i>' + (qi + 1) + "</i><span>" + q + "</span></div>";
      var og = el("div", "opts");
      OPTS.forEach(function (o) {
        var lab = el("label", "opt");
        lab.innerHTML = '<input type="radio" name="' + id + '" value="' + o.v + '"><span>' + o.t + "</span>";
        og.appendChild(lab);
      });
      box.appendChild(og);
      p.appendChild(box);
    });
    panels.appendChild(p);
  });

  /* result panel */
  var pr5 = el("div", "dg__panel");
  pr5.setAttribute("data-panel", "5");
  pr5.id = "dgResult";
  panels.appendChild(pr5);

  /* ---------------- navigation ---------------- */
  var btnPrev = root.querySelector("[data-prev]");
  var btnNext = root.querySelector("[data-next]");
  var hint = root.querySelector(".dg__hint");

  function updateChrome() {
    var pct = (state.step / TOTAL_STEPS) * 100;
    fill.style.width = pct + "%";
    if (state.step >= TOTAL_STEPS) {
      stepLabel.textContent = "진단 결과";
      countLabel.textContent = "COMPLETE";
      root.querySelector(".dg__nav").style.display = "none";
      fill.style.width = "100%";
      return;
    }
    stepLabel.textContent = state.step === 0 ? "시작하기" : DOMAINS[state.step - 1].name;
    countLabel.textContent = "STEP " + (state.step + 1) + " / " + TOTAL_STEPS;
    btnPrev.style.visibility = state.step === 0 ? "hidden" : "visible";
    btnNext.textContent = state.step === TOTAL_STEPS - 1 ? "결과 보기" : "다음";
  }

  function show(n) {
    var all = panels.querySelectorAll(".dg__panel");
    for (var i = 0; i < all.length; i++) all[i].classList.toggle("on", Number(all[i].dataset.panel) === n);
    state.step = n;
    updateChrome();
    var top = root.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({ top: top, behavior: "smooth" });
  }

  function collect() {
    var t = root.querySelector('input[name="btype"]:checked');
    state.type = t ? t.value : null;
    DOMAINS.forEach(function (d) {
      d.qs.forEach(function (_, qi) {
        var sel = root.querySelector('input[name="' + d.k + qi + '"]:checked');
        state.ans[d.k + qi] = sel ? Number(sel.value) : null;
      });
    });
  }

  function validate() {
    collect();
    if (state.step === 0) {
      if (!state.type) { hint.textContent = "사업 유형을 선택해 주세요."; hint.style.color = "#C8503F"; return false; }
    } else {
      var d = DOMAINS[state.step - 1];
      for (var i = 0; i < d.qs.length; i++) {
        if (state.ans[d.k + i] === null) {
          hint.textContent = "답하지 않은 문항이 있습니다. " + (i + 1) + "번 문항을 확인해 주세요.";
          hint.style.color = "#C8503F";
          return false;
        }
      }
    }
    hint.textContent = "";
    return true;
  }

  btnNext.addEventListener("click", function () {
    if (!validate()) return;
    if (state.step === TOTAL_STEPS - 1) { render(); show(TOTAL_STEPS); }
    else show(state.step + 1);
  });
  btnPrev.addEventListener("click", function () { if (state.step > 0) show(state.step - 1); });

  /* auto-advance hint clearing */
  panels.addEventListener("change", function () { hint.textContent = ""; });

  /* ---------------- scoring ---------------- */
  function render() {
    collect();
    var scores = {}, total = 0;
    DOMAINS.forEach(function (d) {
      var s = 0;
      d.qs.forEach(function (_, qi) { s += state.ans[d.k + qi] || 0; });
      scores[d.k] = Math.round((s / (d.qs.length * 2)) * 100);
      total += s;
    });
    var overall = Math.round((total / (DOMAINS.length * 4 * 2)) * 100);

    var band, bandCls, bandMsg, track;
    if (overall >= 80) {
      band = "안정적"; bandCls = "band--good"; track = TRACKS.office;
      bandMsg = "기본 체계는 갖춰져 있습니다. 지금 필요한 것은 새로 만드는 일이 아니라, 흔들리지 않게 유지하고 한 단계 끌어올리는 일입니다.";
    } else if (overall >= 55) {
      band = "점검 필요"; bandCls = "band--mid"; track = TRACKS.check;
      bandMsg = "돌아가고는 있지만 빈 곳이 보입니다. 지금 정리해두면 큰 비용 없이 넘어갈 수 있는 단계입니다.";
    } else {
      band = "개선 시급"; bandCls = "band--low"; track = TRACKS.project;
      bandMsg = "여러 영역이 동시에 비어 있습니다. 한꺼번에 손대기보다 순서를 정해 하나씩 세우는 편이 빠릅니다.";
    }

    /* 취약 도메인 2개 */
    var ranked = DOMAINS.slice().sort(function (a, b) { return scores[a.k] - scores[b.k]; });
    var weak = ranked.slice(0, 2);
    var typeKey = state.type || "corp";

    /* ---- markup ---- */
    var circ = 2 * Math.PI * 86;
    var dash = circ * (overall / 100);

    var html = "";
    html += '<div class="dg__stephd" style="text-align:center;margin-bottom:34px">' +
      '<p class="eyebrow eyebrow--plain mono" style="justify-content:center;margin-bottom:10px">YOUR RESULT</p>' +
      "<h2>진단 결과가 나왔습니다</h2>" +
      "<p>정답을 매기는 점수가 아니라, 어디부터 손대야 할지를 가리키는 지표입니다.</p></div>";

    html += '<div class="card" style="padding:32px;margin-bottom:20px">';
    html += '<div class="score"><div class="score__ring">' +
      '<svg width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">' +
      '<circle cx="100" cy="100" r="86" fill="none" stroke="#E3EDE3" stroke-width="15"/>' +
      '<circle cx="100" cy="100" r="86" fill="none" stroke="#2FA84F" stroke-width="15" stroke-linecap="round" ' +
      'stroke-dasharray="' + dash.toFixed(1) + " " + circ.toFixed(1) + '"/></svg>' +
      '<div class="score__val"><b>' + overall + '</b><span>종합 점수 / 100</span></div></div>';
    html += '<div><span class="band ' + bandCls + '">' + band + "</span>" +
      '<p style="font-size:16.5px;line-height:1.8;margin:0">' + bandMsg + "</p></div></div></div>";

    /* domain bars */
    html += '<div class="card" style="padding:30px;margin-bottom:20px"><h3 style="font-size:18px;margin-bottom:20px">영역별 진단</h3><div class="bars">';
    DOMAINS.forEach(function (d) {
      var v = scores[d.k];
      var cls = v < 50 ? "weak" : (v >= 80 ? "strong" : "");
      html += '<div class="barrow"><div class="barrow__hd"><b>' + d.name + "</b><span>" + v + "</span></div>" +
        '<div class="barrow__t"><div class="barrow__f ' + cls + '" data-w="' + v + '"></div></div></div>';
    });
    html += "</div></div>";

    /* priorities */
    html += '<div class="card" style="padding:30px;margin-bottom:20px">' +
      '<h3 style="font-size:18px;margin-bottom:8px">먼저 손대야 할 두 영역</h3>' +
      '<p class="small muted" style="margin-bottom:20px">점수가 낮은 순서입니다. 모든 것을 동시에 고칠 수는 없습니다.</p>';
    weak.forEach(function (d, i) {
      var adv = ADVICE[d.k];
      var items = adv.items[typeKey] || adv.items.corp;
      html += '<div class="reco" style="margin-bottom:' + (i === 0 ? "16px" : "0") + '">' +
        '<h4>' + (i + 1) + ". " + d.name + " — " + adv.title + "</h4>" +
        "<p>" + adv.why + "</p><ul>";
      items.forEach(function (it) { html += "<li>" + it + "</li>"; });
      html += '</ul><p class="tiny" style="margin-top:10px;margin-bottom:0"><b>연계 —</b> ' + adv.chain + "</p></div>";
    });
    html += "</div>";

    /* track */
    html += '<div class="card card--deep" style="padding:30px;margin-bottom:24px">' +
      '<p class="eyebrow" style="color:var(--lime)">RECOMMENDED TRACK</p>' +
      '<h3 style="font-size:20px;margin-bottom:8px">' + track.k + "</h3>" +
      '<p style="margin:0;color:#B9D5C0">' + track.d + "</p></div>";

    /* CTA */
    var summary = "종합 " + overall + "점 (" + band + ") · 취약 영역: " +
      weak[0].name + "(" + scores[weak[0].k] + "), " + weak[1].name + "(" + scores[weak[1].k] + ") · 추천: " + track.k;

    html += '<div class="btn-row noprint" style="justify-content:center;margin-bottom:16px">' +
      '<a class="btn btn--primary btn--lg" href="contact.html?d=' + encodeURIComponent(summary) +
      '">이 결과로 상담 신청하기</a>' +
      '<button class="btn btn--ghost btn--lg" type="button" data-print>결과 인쇄 · PDF 저장</button>' +
      '<button class="btn btn--ghost btn--lg" type="button" data-restart>다시 진단하기</button></div>';

    html += '<p class="tiny noprint" style="text-align:center;max-width:560px;margin:0 auto">' +
      "이 진단은 일반적인 점검 항목을 기준으로 한 참고 자료입니다. 실제 진단은 손익과 계약, 현장 확인을 거쳐야 하며 " +
      "BFC의 첫 상담은 무료이고 계약을 전제로 하지 않습니다.</p>";

    pr5.innerHTML = html;

    /* animate bars */
    window.setTimeout(function () {
      var bars = pr5.querySelectorAll(".barrow__f");
      for (var i = 0; i < bars.length; i++) bars[i].style.width = bars[i].dataset.w + "%";
    }, 120);

    /* actions */
    var pb = pr5.querySelector("[data-print]");
    if (pb) pb.addEventListener("click", function () { window.print(); });
    var rb = pr5.querySelector("[data-restart]");
    if (rb) rb.addEventListener("click", function () {
      var inputs = root.querySelectorAll('input[type="radio"]');
      for (var i = 0; i < inputs.length; i++) inputs[i].checked = false;
      state = { type: null, ans: {}, step: 0 };
      root.querySelector(".dg__nav").style.display = "";
      show(0);
    });

    /* keep for the contact form */
    try {
      sessionStorage.setItem("bfc_dx", JSON.stringify({
        overall: overall, band: band, scores: scores, type: typeKey,
        weak: [weak[0].name, weak[1].name], track: track.k, summary: summary
      }));
    } catch (e) { /* storage blocked — the URL parameter still carries the result */ }
  }

  updateChrome();
})();
