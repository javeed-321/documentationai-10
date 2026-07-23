/* ==========================================================================
   Help Center standalone page: dummy search + Ask AI interactions.

   Everything here is a demo. No network calls, no real index, no model.
   The script stays inert on every page that does not contain
   #dai-help-center, and all listeners are delegated off `document` so they
   survive the site's client-side navigation and React re-renders.
   ========================================================================== */

(function () {
  "use strict";

  if (window.__daiHelpCenterReady) return;
  window.__daiHelpCenterReady = true;

  var OVERLAY_ID = "dai-hc-overlay";

  /* ---------------------------------------------------------------- data */

  var ARTICLES = [
    { title: "Quickstart: get set up in under 15 minutes", crumb: "Getting started & account", href: "/guides/getting-started-and-account", icon: "rocket" },
    { title: "Invite teammates and assign roles", crumb: "Workspace", href: "/guides/getting-started-and-account", icon: "users" },
    { title: "Organization settings reference", crumb: "Workspace", href: "/guides/getting-started-and-account", icon: "users" },
    { title: "Compare plans and upgrade", crumb: "Billing & plans", href: "/guides/getting-started-and-account", icon: "card" },
    { title: "Download invoices and receipts", crumb: "Billing & plans", href: "/guides/getting-started-and-account", icon: "card" },
    { title: "Create an OAuth app", crumb: "Developer integrations", href: "/guides/getting-started-and-account", icon: "code" },
    { title: "Register and verify a webhook endpoint", crumb: "Developer integrations", href: "/guides/getting-started-and-account", icon: "code" },
    { title: "Rotate and revoke API keys", crumb: "Developer integrations", href: "/guides/getting-started-and-account", icon: "code" },
    { title: "Connect your CRM", crumb: "Developer integrations", href: "/guides/getting-started-and-account", icon: "code" },
    { title: "Create a project", crumb: "Projects", href: "/guides/product-guides", icon: "grid" },
    { title: "Archive or restore a project", crumb: "Projects", href: "/guides/product-guides", icon: "grid" },
    { title: "Conditions and branches", crumb: "Automation & workflows", href: "/guides/product-guides", icon: "branch" },
    { title: "Tour the editor", crumb: "Interface", href: "/guides/product-guides", icon: "grid" },
    { title: "Fix login and session issues", crumb: "Troubleshooting", href: "/guides/support-and-policies", icon: "wrench" },
    { title: "Diagnose slow page loads", crumb: "Troubleshooting", href: "/guides/support-and-policies", icon: "wrench" },
    { title: "Privacy policy", crumb: "Legal & compliance", href: "/guides/support-and-policies", icon: "scroll" },
    { title: "Terms of service", crumb: "Legal & compliance", href: "/guides/support-and-policies", icon: "scroll" },
    { title: "GDPR and regional data residency", crumb: "Legal & compliance", href: "/guides/support-and-policies", icon: "scroll" },
    { title: "Contact support and check status", crumb: "Support", href: "/guides/support-and-policies", icon: "life" }
  ];

  var ICONS = {
    rocket: 'M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.18 2.18 0 0 0-2.9-.1z|M12 15l-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.9 7.5-6 11a22.4 22.4 0 0 1-4 2z',
    users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z|M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2',
    card: 'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z|M2 10h20',
    code: 'M16 18l6-6-6-6|M8 6l-6 6 6 6',
    grid: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z|M8 10v4|M12 10v2|M16 10v4',
    branch: 'M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z|M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z|M6 9v12|M18 15a9 9 0 0 0-9-6',
    wrench: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
    scroll: 'M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4|M19 17V5a2 2 0 0 0-2-2H4',
    life: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z|M4.9 4.9l4.3 4.3|M14.8 14.8l4.3 4.3',
    search: 'M9 6l6 6-6 6',
    spark: 'M12 3l1.7 4.6L18 9.3l-4.3 1.7L12 15.6l-1.7-4.6L6 9.3l4.3-1.7z|M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z'
  };

  /* Canned answers keyed by the first matching trigger word. */
  var ANSWERS = [
    {
      match: ["invite", "teammate", "role", "member", "workspace", "seat"],
      text: "To invite teammates, open Workspace settings and choose Members, then Invite. Enter one email per line and pick a role before sending.\n\nThere are three roles. Owner controls billing and can delete the workspace. Admin manages members and integrations. Member has read and write access to projects they are added to.\n\nInvites expire after 7 days. Resend one from the same Members screen.",
      sources: ["Invite teammates and assign roles", "Organization settings reference"]
    },
    {
      match: ["bill", "invoice", "plan", "upgrade", "price", "payment", "receipt"],
      text: "Plans are compared side by side under Billing, then Plans. Upgrades take effect immediately and are prorated against the remainder of your current cycle.\n\nInvoices live under Billing, then Invoices. Each one is downloadable as a PDF, and the billing contact receives a copy by email when it is issued.\n\nDowngrades apply at the start of the next cycle so you keep paid features until then.",
      sources: ["Compare plans and upgrade", "Download invoices and receipts"]
    },
    {
      match: ["api", "key", "webhook", "oauth", "integration", "token", "crm"],
      text: "Create an OAuth app under Developer settings, then Apps. You get a client ID and secret, and you set at least one redirect URI before the app can complete a flow.\n\nWebhooks are registered per project. Point them at an HTTPS endpoint that returns 2xx within 5 seconds. Failed deliveries retry with backoff for 24 hours.\n\nAPI keys can be rotated without downtime. Create the new key, deploy it, then revoke the old one.",
      sources: ["Create an OAuth app", "Register and verify a webhook endpoint", "Rotate and revoke API keys"]
    },
    {
      match: ["login", "sign in", "password", "slow", "error", "broken", "trouble", "fix"],
      text: "For login problems, first clear the session cookie and retry in a private window. That resolves most cases where a stale token is being replayed.\n\nIf pages load slowly, check the status page before anything else. When status is green, disable browser extensions one at a time, since content blockers are the usual cause.\n\nStill stuck? Contact support with your workspace ID and the request ID shown in the error banner.",
      sources: ["Fix login and session issues", "Diagnose slow page loads", "Contact support and check status"]
    },
    {
      match: ["privacy", "gdpr", "legal", "data", "terms", "compliance", "retention"],
      text: "The privacy policy covers what is collected, why it is retained, and how long. Deleted workspaces are purged from primary storage within 30 days and from backups within 90.\n\nGDPR requests are handled through the data request form. Export and erasure requests are acknowledged within 72 hours.\n\nRegional residency is available on Enterprise, with EU and US regions selectable at workspace creation.",
      sources: ["Privacy policy", "GDPR and regional data residency", "Terms of service"]
    },
    {
      match: ["project", "workflow", "automation", "branch", "condition", "editor"],
      text: "Projects are created from the dashboard with New project. Each one carries its own members, integrations, and automation rules.\n\nInside a workflow, a condition node splits the run into branches evaluated top to bottom, and the first match wins. Branches rejoin at a merge node, which waits for every inbound path unless you set it to first-arrival.\n\nArchiving a project hides it without deleting data, and you can restore it at any time.",
      sources: ["Create a project", "Conditions and branches", "Tour the editor"]
    }
  ];

  var FALLBACK = {
    text: "Here is what the Help Center covers.\n\nGetting started and account walks through signup, workspace setup, billing, and your first integration. Product guides cover the interface, projects, the editor, and automation. Support and policies collects troubleshooting, status, data handling, and legal.\n\nTry a more specific question, or browse the guides below.",
    sources: ["Quickstart: get set up in under 15 minutes", "Tour the editor", "Contact support and check status"]
  };

  /* ------------------------------------------------------------- helpers */

  function svg(name, size, stroke) {
    var paths = (ICONS[name] || ICONS.search).split("|");
    var out = '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="' + (stroke || 1.8) + '" stroke-linecap="round" stroke-linejoin="round">';
    for (var i = 0; i < paths.length; i++) out += '<path d="' + paths[i] + '"></path>';
    return out + "</svg>";
  }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function onPage() {
    return !!document.getElementById("dai-help-center");
  }

  /* ------------------------------------------------------------- overlay */

  var state = { esc: null, timers: [] };

  function closeOverlay() {
    var el = document.getElementById(OVERLAY_ID);
    if (el) el.remove();
    if (state.esc) {
      document.removeEventListener("keydown", state.esc, true);
      state.esc = null;
    }
    for (var i = 0; i < state.timers.length; i++) clearTimeout(state.timers[i]);
    state.timers = [];
    document.documentElement.style.overflow = "";
  }

  function openOverlay(innerHTML) {
    closeOverlay();
    var el = document.createElement("div");
    el.id = OVERLAY_ID;
    el.innerHTML = innerHTML;
    el.addEventListener("mousedown", function (e) {
      if (e.target === el) closeOverlay();
    });
    document.body.appendChild(el);
    document.documentElement.style.overflow = "hidden";

    state.esc = function (e) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        closeOverlay();
      }
    };
    document.addEventListener("keydown", state.esc, true);
    return el;
  }

  function later(fn, ms) {
    state.timers.push(setTimeout(fn, ms));
  }

  /* -------------------------------------------------------- search modal */

  function renderResults(query) {
    var q = query.trim().toLowerCase();
    var hits = ARTICLES;

    if (q) {
      hits = ARTICLES.filter(function (a) {
        return (a.title + " " + a.crumb).toLowerCase().indexOf(q) !== -1;
      });
    }

    if (!hits.length) {
      return '<div class="hc-empty">No articles match &ldquo;' + esc(query) + '&rdquo;.<br>Try a broader term, or Ask AI instead.</div>';
    }

    hits = hits.slice(0, 8);
    var html = '<div class="hc-modal__label">' + (q ? hits.length + " result" + (hits.length === 1 ? "" : "s") : "Suggested articles") + "</div>";

    for (var i = 0; i < hits.length; i++) {
      html +=
        '<a class="hc-result" href="' + esc(hits[i].href) + '" data-active="' + (i === 0 ? "true" : "false") + '">' +
          '<span class="hc-result__icon">' + svg(hits[i].icon, 17) + "</span>" +
          "<span>" +
            '<span class="hc-result__title">' + esc(hits[i].title) + "</span>" +
            '<span class="hc-result__crumb">' + esc(hits[i].crumb) + "</span>" +
          "</span>" +
        "</a>";
    }
    return html;
  }

  function openSearch(prefill) {
    var el = openOverlay(
      '<div class="hc-modal" role="dialog" aria-modal="true" aria-label="Search the Help Center">' +
        '<div class="hc-modal__head">' +
          '<span style="display:flex;color:#6b746e;flex:none">' +
            '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.5" y2="16.5"></line></svg>' +
          "</span>" +
          '<input class="hc-modal__field" type="text" placeholder="Search for articles" autocomplete="off" spellcheck="false">' +
          '<button class="hc-modal__esc" type="button" data-hc-close>ESC</button>' +
        "</div>" +
        '<div class="hc-modal__body" data-hc-results></div>' +
        '<div class="hc-modal__foot">Demo search. Results are sample data and nothing is sent anywhere.</div>' +
      "</div>"
    );

    var field = el.querySelector(".hc-modal__field");
    var body = el.querySelector("[data-hc-results]");

    function paint() {
      body.innerHTML = renderResults(field.value);
    }

    field.value = prefill || "";
    paint();
    field.focus();
    field.setSelectionRange(field.value.length, field.value.length);

    field.addEventListener("input", paint);

    field.addEventListener("keydown", function (e) {
      var items = Array.prototype.slice.call(body.querySelectorAll(".hc-result"));
      if (!items.length) return;
      var idx = items.findIndex(function (n) { return n.getAttribute("data-active") === "true"; });
      if (idx < 0) idx = 0;

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        items[idx].setAttribute("data-active", "false");
        idx = e.key === "ArrowDown"
          ? (idx + 1) % items.length
          : (idx - 1 + items.length) % items.length;
        items[idx].setAttribute("data-active", "true");
        items[idx].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        e.preventDefault();
        items[idx].click();
      }
    });
  }

  /* --------------------------------------------------------- Ask AI panel */

  function answerFor(question) {
    var q = question.toLowerCase();
    for (var i = 0; i < ANSWERS.length; i++) {
      for (var j = 0; j < ANSWERS[i].match.length; j++) {
        if (q.indexOf(ANSWERS[i].match[j]) !== -1) return ANSWERS[i];
      }
    }
    return FALLBACK;
  }

  function typeOut(node, text, done) {
    var i = 0;
    node.innerHTML = '<span data-hc-typed></span><span class="hc-ai__caret"></span>';
    var target = node.querySelector("[data-hc-typed]");

    function step() {
      // Type in small chunks so long answers stay quick but still feel live.
      i = Math.min(text.length, i + 3);
      target.textContent = text.slice(0, i);
      node.parentNode.scrollTop = node.parentNode.scrollHeight;
      if (i < text.length) {
        later(step, 12);
      } else {
        var caret = node.querySelector(".hc-ai__caret");
        if (caret) caret.remove();
        if (done) done();
      }
    }
    later(step, 12);
  }

  function ask(el, question) {
    var body = el.querySelector(".hc-ai__body");
    var input = el.querySelector(".hc-ai__input");
    var send = el.querySelector(".hc-ai__send");

    send.disabled = true;
    input.value = "";

    body.innerHTML =
      '<div class="hc-ai__question">' + esc(question) + "</div>" +
      '<div class="hc-ai__thinking"><span class="hc-ai__dot"></span><span class="hc-ai__dot"></span><span class="hc-ai__dot"></span> Searching the Help Center</div>';

    later(function () {
      var a = answerFor(question);
      body.innerHTML =
        '<div class="hc-ai__question">' + esc(question) + "</div>" +
        '<div class="hc-ai__answer"></div>';

      typeOut(body.querySelector(".hc-ai__answer"), a.text, function () {
        var chips = '<div class="hc-ai__sources">';
        for (var i = 0; i < a.sources.length; i++) {
          var hit = ARTICLES.filter(function (x) { return x.title === a.sources[i]; })[0];
          chips +=
            '<a class="hc-ai__source" href="' + esc(hit ? hit.href : "/help-center") + '">' +
              svg("search", 12, 2.2) + esc(a.sources[i]) +
            "</a>";
        }
        body.insertAdjacentHTML("beforeend", chips + "</div>");
        body.scrollTop = body.scrollHeight;
        send.disabled = false;
        input.focus();
      });
    }, 900);
  }

  function openAskAI(prefill) {
    var el = openOverlay(
      '<div class="hc-modal hc-modal--ai" role="dialog" aria-modal="true" aria-label="Ask AI">' +
        '<div class="hc-modal__head">' +
          '<span class="hc-ai__badge"><span style="display:flex;color:#166534">' + svg("spark", 16, 2) + "</span>Ask AI</span>" +
          '<button class="hc-modal__esc" type="button" data-hc-close>ESC</button>' +
        "</div>" +
        '<div class="hc-ai__body"></div>' +
        '<div class="hc-ai__composer">' +
          '<input class="hc-ai__input" type="text" placeholder="Ask anything about the product" autocomplete="off">' +
          '<button class="hc-ai__send" type="button" data-hc-send>Ask</button>' +
        "</div>" +
        '<div class="hc-ai__note">Demo assistant. Answers are canned sample text, not a live model.</div>' +
      "</div>"
    );

    var input = el.querySelector(".hc-ai__input");
    var send = el.querySelector(".hc-ai__send");

    el.querySelector(".hc-ai__body").innerHTML =
      '<div class="hc-ai__answer">Ask a question about setup, billing, integrations, workflows, or policies. Try &ldquo;how do I invite teammates?&rdquo; or &ldquo;how do webhooks retry?&rdquo;</div>';

    function submit() {
      var q = input.value.trim();
      if (q) ask(el, q);
    }

    send.addEventListener("click", submit);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      }
    });

    input.focus();
    if (prefill) {
      input.value = prefill;
      submit();
    }
  }

  /* ------------------------------------------------------------ bindings */

  document.addEventListener("click", function (e) {
    var closer = e.target.closest ? e.target.closest("[data-hc-close]") : null;
    if (closer) {
      e.preventDefault();
      closeOverlay();
      return;
    }

    if (!e.target.closest) return;

    if (e.target.closest("#dai-help-center [data-hc-search]")) {
      e.preventDefault();
      openSearch("");
      return;
    }

    if (e.target.closest("#dai-help-center [data-hc-askai]")) {
      e.preventDefault();
      openAskAI("");
      return;
    }

    var tag = e.target.closest("#dai-help-center [data-hc-tag]");
    if (tag) {
      e.preventDefault();
      openSearch(tag.textContent.trim().toLowerCase());
    }
  });

  document.addEventListener("keydown", function (e) {
    if (!onPage()) return;

    // Cmd/Ctrl+K opens search, matching the ⌘K hint in the hero.
    if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault();
      if (document.getElementById(OVERLAY_ID)) closeOverlay();
      openSearch("");
      return;
    }

    // Enter or Space on the focused search box, which is a div not a button.
    if (e.key === "Enter" || e.key === " ") {
      var t = e.target;
      if (t && t.closest && t.closest("#dai-help-center [data-hc-search]")) {
        e.preventDefault();
        openSearch("");
      } else if (t && t.closest && t.closest("#dai-help-center [data-hc-tag]")) {
        e.preventDefault();
        openSearch(t.textContent.trim().toLowerCase());
      }
    }
  });

  // Client-side navigation away from the page should not leave a modal behind.
  window.addEventListener("popstate", closeOverlay);
})();
