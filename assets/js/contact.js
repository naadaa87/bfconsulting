/* ==========================================================================
   BFC 상담 신청 폼
   ---------------------------------------------------------------------------
   FORM_ENDPOINT 를 비워두면 메일 앱을 열어 내용을 채워주는 방식으로 동작합니다.
   (별도 서버 없이 바로 쓸 수 있는 기본값입니다.)

   폼을 받은 내용이 메일함으로 자동 전송되게 하려면 아래 한 줄만 바꾸세요.
     · Formspree  : https://formspree.io  →  "https://formspree.io/f/xxxxxxx"
     · Web3Forms  : https://web3forms.com →  "https://api.web3forms.com/submit"
       (Web3Forms 사용 시 WEB3FORMS_KEY 에 발급받은 access key 를 넣어주세요)
   ========================================================================== */
var FORM_ENDPOINT = "";
var WEB3FORMS_KEY = "";
var BFC_EMAIL = "bfc0118@gmail.com";

(function () {
  "use strict";
  var form = document.getElementById("inquiry");
  if (!form) return;

  var status = form.querySelector(".formstatus");
  var submit = form.querySelector("[data-submit]");
  var dxField = form.querySelector("[name='diagnosis']");
  var dxNote = document.getElementById("dxNote");

  /* ---- 진단 결과 이어받기 (URL 파라미터 우선, 없으면 세션) ---- */
  (function attachDiagnosis() {
    var val = "";
    try {
      var q = new URLSearchParams(window.location.search).get("d");
      if (q) val = q;
      if (!val) {
        var raw = sessionStorage.getItem("bfc_dx");
        if (raw) val = (JSON.parse(raw) || {}).summary || "";
      }
    } catch (e) { /* ignore */ }
    if (val && dxField) {
      dxField.value = val;
      if (dxNote) {
        dxNote.style.display = "block";
        dxNote.innerHTML = '<strong>자가진단 결과가 함께 전달됩니다.</strong><br>' + val;
      }
    }
  })();

  /* ---- validation ---- */
  function setErr(field, on, msg) {
    var wrap = field.closest(".field") || field.parentNode;
    wrap.classList.toggle("err", on);
    var m = wrap.querySelector(".errmsg");
    if (m && msg) m.textContent = msg;
  }

  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function validate() {
    var ok = true;
    var name = form.querySelector("[name='name']");
    var phone = form.querySelector("[name='phone']");
    var email = form.querySelector("[name='email']");
    var msg = form.querySelector("[name='message']");
    var agree = form.querySelector("[name='agree']");

    if (!name.value.trim()) { setErr(name, true, "성함을 입력해 주세요."); ok = false; } else setErr(name, false);
    if (!phone.value.trim()) { setErr(phone, true, "연락처를 입력해 주세요."); ok = false; } else setErr(phone, false);
    if (email.value.trim() && !validEmail(email.value.trim())) {
      setErr(email, true, "이메일 형식을 확인해 주세요."); ok = false;
    } else setErr(email, false);
    if (!msg.value.trim()) { setErr(msg, true, "어떤 상황인지 한 줄이라도 적어주세요."); ok = false; } else setErr(msg, false);
    if (!agree.checked) { setErr(agree, true, "개인정보 수집 · 이용에 동의해 주셔야 접수할 수 있습니다."); ok = false; }
    else setErr(agree, false);
    return ok;
  }

  function gather() {
    var fd = new FormData(form);
    var areas = fd.getAll("areas");
    return {
      name: (fd.get("name") || "").trim(),
      phone: (fd.get("phone") || "").trim(),
      email: (fd.get("email") || "").trim(),
      company: (fd.get("company") || "").trim(),
      btype: fd.get("btype") || "",
      track: fd.get("track") || "",
      areas: areas.join(", "),
      when: fd.get("when") || "",
      message: (fd.get("message") || "").trim(),
      diagnosis: (fd.get("diagnosis") || "").trim()
    };
  }

  function asText(d) {
    return [
      "[BFC 종합경영자문 상담 신청]",
      "",
      "성함: " + d.name,
      "연락처: " + d.phone,
      "이메일: " + (d.email || "-"),
      "상호 · 기관명: " + (d.company || "-"),
      "사업 유형: " + (d.btype || "-"),
      "관심 트랙: " + (d.track || "-"),
      "관심 영역: " + (d.areas || "-"),
      "희망 연락 시간대: " + (d.when || "-"),
      "자가진단 결과: " + (d.diagnosis || "-"),
      "",
      "현재 가장 답답한 문제",
      "---------------------------------",
      d.message
    ].join("\n");
  }

  function show(kind, html) {
    status.className = "formstatus " + kind;
    status.innerHTML = html;
    status.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) {
      var bad = form.querySelector(".field.err");
      if (bad) bad.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    var d = gather();
    submit.disabled = true;
    submit.textContent = "보내는 중…";

    /* --- 1) 엔드포인트가 설정된 경우: 바로 전송 --- */
    if (FORM_ENDPOINT) {
      var payload = Object.assign({}, d, {
        subject: "[BFC 상담신청] " + d.name + " · " + (d.company || d.btype || "")
      });
      if (WEB3FORMS_KEY) payload.access_key = WEB3FORMS_KEY;

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error("bad response");
        form.reset();
        if (dxNote) dxNote.style.display = "none";
        show("ok", "<strong>상담 신청이 접수되었습니다.</strong><br>영업일 기준 1일 이내에 담당자가 연락드립니다. 급한 사안이면 010-2384-9580으로 바로 전화 주셔도 됩니다.");
      }).catch(function () {
        show("no", "<strong>전송에 실패했습니다.</strong><br>잠시 후 다시 시도하시거나, " +
          '<a href="mailto:' + BFC_EMAIL + '">' + BFC_EMAIL + "</a> 또는 010-2384-9580으로 연락 주세요.");
      }).then(function () {
        submit.disabled = false;
        submit.textContent = "상담 신청하기";
      });
      return;
    }

    /* --- 2) 기본값: 메일 앱으로 내용 채워 열기 --- */
    var subject = "[BFC 상담신청] " + d.name + (d.company ? " · " + d.company : "");
    var href = "mailto:" + BFC_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(asText(d));

    window.location.href = href;

    window.setTimeout(function () {
      submit.disabled = false;
      submit.textContent = "상담 신청하기";
      show("ok",
        "<strong>메일 앱에 신청 내용을 채워 두었습니다.</strong><br>" +
        "열린 메일에서 <b>보내기</b>만 누르시면 접수됩니다. 창이 열리지 않았다면 아래 내용을 복사해 " +
        '<a href="mailto:' + BFC_EMAIL + '">' + BFC_EMAIL + '</a> 로 보내주세요.' +
        '<textarea readonly style="width:100%;min-height:190px;margin-top:12px;padding:12px;border:1px solid var(--line);' +
        'border-radius:10px;font-family:inherit;font-size:14px;line-height:1.6;background:#fff;color:var(--body)">' +
        asText(d).replace(/</g, "&lt;") + "</textarea>");
    }, 700);
  });
})();
