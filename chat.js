/* ============================================================
   Ready Set Site - Customer Service Chat Widget
   Self-contained: injects its own styles, markup and logic.
   Add to any page with:  <script src="chat.js" defer></script>
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Knowledge base (edit these answers freely) ---------- */
  var RULES = [
    {
      k: ["hi", "hello", "hey", "start", "help"],
      a: "Hi! 👋 I'm the Ready Set Site assistant. I can help with our <b>services</b>, <b>pricing</b>, and getting your website started. What would you like to know?"
    },
    {
      k: ["price", "pricing", "cost", "how much", "quote", "budget", "£", "cheap"],
      a: "Our websites start from <b>£100</b> for a Starter (one-page) site. Business (multi-page) websites and SEO are priced on what you need. For an exact quote, tap the green <b>WhatsApp</b> button or visit our <a href='contact.html'>contact page</a>. You can also see packages on our <a href='pricing.html'>pricing page</a>."
    },
    {
      k: ["service", "services", "what do you do", "offer", "make", "build"],
      a: "We build:<br>• <a href='starter-website.html'>Starter Websites</a> (from £100)<br>• <a href='business-website.html'>Business Websites</a> (multi-page)<br>• <a href='seo.html'>SEO setup</a> to get you found on Google<br>Want details on any of these?"
    },
    {
      k: ["starter", "one page", "one-page", "simple site", "basic"],
      a: "A <a href='starter-website.html'>Starter Website</a> is a clean one-page site from <b>£100</b> — your services, contact details and an enquiry form, live in days."
    },
    {
      k: ["business website", "multi", "full website", "bigger site", "multiple pages"],
      a: "A <a href='business-website.html'>Business Website</a> is a full multi-page site — homepage, services, about, reviews and contact — with built-in SEO to build trust and win enquiries."
    },
    {
      k: ["seo", "google", "rank", "search", "found online", "keywords"],
      a: "Our <a href='seo.html'>SEO service</a> gets you found on Google with keyword research, on-page optimisation and Google Business setup so local customers find you first."
    },
    {
      k: ["sector", "industry", "trade", "plumber", "electrician", "builder", "restaurant", "cafe", "café", "startup", "shop", "salon", "local"],
      a: "We design websites for:<br>• <a href='sector-trades.html'>Trades</a> (plumbers, electricians, builders)<br>• <a href='sector-restaurants.html'>Restaurants & Cafés</a><br>• <a href='sector-startups.html'>Startups</a><br>• <a href='sector-local-businesses.html'>Local Businesses</a><br>Which one are you?"
    },
    {
      k: ["how long", "time", "timescale", "when", "fast", "quick", "turnaround", "deadline"],
      a: "Most Starter sites go live in a <b>few days</b>. Larger business websites take a little longer depending on pages and content — we'll give you a clear timeline once we know what you need."
    },
    {
      k: ["contact", "phone", "call", "email", "reach", "talk", "speak", "whatsapp", "number"],
      a: "The quickest way to reach us is the green <b>WhatsApp</b> button (bottom-right) — we usually reply the same day. You can also use our <a href='contact.html'>contact page</a>."
    },
    {
      k: ["portfolio", "examples", "work", "gallery", "demo", "previous"],
      a: "Take a look at our <a href='portfolio.html'>portfolio</a> and <a href='demo-gallery.html'>demo gallery</a> to see the kind of clean, modern designs we build."
    },
    {
      k: ["thanks", "thank you", "cheers", "great", "perfect", "ok", "okay"],
      a: "You're welcome! 😊 Anything else I can help with? If you're ready to start, tap <b>WhatsApp</b> or head to our <a href='contact.html'>contact page</a>."
    }
  ];

  var FALLBACK =
    "Great question! For that one it's best to chat with the team directly — tap the green <b>WhatsApp</b> button or visit our <a href='contact.html'>contact page</a> and we'll get right back to you.";

  var GREETING =
    "Hi! 👋 Welcome to Ready Set Site. Ask me about our <b>services</b>, <b>pricing</b> or <b>sectors</b> — or tap a button below.";

  var CHIPS = ["Pricing", "Services", "Sectors", "Contact"];

  function reply(text) {
    var t = (" " + text.toLowerCase() + " ");
    var best = null, bestScore = 0;
    for (var i = 0; i < RULES.length; i++) {
      var score = 0;
      for (var j = 0; j < RULES[i].k.length; j++) {
        if (t.indexOf(RULES[i].k[j].toLowerCase()) !== -1) score++;
      }
      if (score > bestScore) { bestScore = score; best = RULES[i]; }
    }
    return best ? best.a : FALLBACK;
  }

  /* ---------- Styles ---------- */
  var css = `
  .rs-chat-launch{position:fixed;bottom:24px;left:24px;width:60px;height:60px;border-radius:50%;
    background:linear-gradient(180deg,#3474e8,#2b60cf);border:none;cursor:pointer;z-index:99998;
    box-shadow:0 10px 30px rgba(52,116,232,.45);display:flex;align-items:center;justify-content:center;
    transition:transform .2s ease}
  .rs-chat-launch:hover{transform:scale(1.08)}
  .rs-chat-launch svg{width:28px;height:28px;fill:#fff}
  .rs-chat-badge{position:absolute;top:-4px;right:-4px;width:16px;height:16px;background:#14dea0;
    border-radius:50%;border:2px solid #001b35}
  .rs-chat-panel{position:fixed;bottom:96px;left:24px;width:340px;max-width:calc(100vw - 48px);
    height:480px;max-height:calc(100vh - 130px);background:linear-gradient(180deg,#0a1830,#071427);
    border:1px solid rgba(76,100,126,.5);border-radius:18px;z-index:99999;display:none;
    flex-direction:column;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.55),0 0 40px rgba(52,116,232,.18);
    font-family:Arial,Helvetica,sans-serif}
  .rs-chat-panel.rs-open{display:flex}
  .rs-chat-head{display:flex;align-items:center;gap:12px;padding:16px 18px;
    background:linear-gradient(180deg,#12305a,#0d233f);border-bottom:1px solid rgba(76,100,126,.4)}
  .rs-chat-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(180deg,#3474e8,#2b60cf);
    display:grid;place-items:center;font-weight:800;color:#fff;font-size:15px}
  .rs-chat-head h4{color:#fff;font-size:15px;margin:0}
  .rs-chat-head p{color:#9ff5d3;font-size:11px;margin:2px 0 0;display:flex;align-items:center;gap:6px}
  .rs-chat-head p span{width:8px;height:8px;background:#14dea0;border-radius:50%;display:inline-block}
  .rs-chat-close{margin-left:auto;background:none;border:none;color:#c4d5e9;font-size:22px;cursor:pointer;line-height:1}
  .rs-chat-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
  .rs-msg{max-width:82%;padding:11px 14px;border-radius:14px;font-size:14px;line-height:1.5}
  .rs-msg a{color:#7fb0ff;font-weight:700;text-decoration:none}
  .rs-msg a:hover{text-decoration:underline}
  .rs-bot{align-self:flex-start;background:#1b3454;color:#e6f0ff;border-bottom-left-radius:4px}
  .rs-user{align-self:flex-end;background:linear-gradient(180deg,#3474e8,#2b60cf);color:#fff;border-bottom-right-radius:4px}
  .rs-chips{display:flex;flex-wrap:wrap;gap:8px;padding:0 16px 12px}
  .rs-chip{background:rgba(52,116,232,.16);border:1px solid rgba(76,100,126,.5);color:#c8e0ff;
    font-size:12px;font-weight:700;padding:8px 12px;border-radius:20px;cursor:pointer}
  .rs-chip:hover{background:rgba(52,116,232,.3);color:#fff}
  .rs-chat-foot{display:flex;gap:8px;padding:12px 14px;border-top:1px solid rgba(76,100,126,.4)}
  .rs-chat-foot input{flex:1;background:#001f3d;border:1px solid rgba(76,100,126,.6);border-radius:22px;
    padding:11px 15px;color:#fff;font-size:14px;outline:none}
  .rs-chat-foot input::placeholder{color:#7d95b0}
  .rs-chat-send{background:linear-gradient(180deg,#3474e8,#2b60cf);border:none;border-radius:50%;
    width:42px;height:42px;cursor:pointer;display:grid;place-items:center;flex:none}
  .rs-chat-send svg{width:18px;height:18px;fill:#fff}
  @media (max-width:600px){.rs-chat-panel{left:12px;bottom:88px}.rs-chat-launch{left:16px}}
  `;

  /* ---------- Build DOM ---------- */
  function el(html) {
    var d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstChild;
  }

  function init() {
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var launch = el(
      '<button class="rs-chat-launch" aria-label="Open chat">' +
      '<span class="rs-chat-badge"></span>' +
      '<svg viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM7 9h10v2H7V9zm6 4H7v-2h6v2zm4-6H7V5h10v2z"/></svg>' +
      "</button>"
    );

    var panel = el(
      '<div class="rs-chat-panel" role="dialog" aria-label="Customer service chat">' +
        '<div class="rs-chat-head">' +
          '<div class="rs-chat-avatar">RS</div>' +
          "<div><h4>Ready Set Assistant</h4><p><span></span>Online now</p></div>" +
          '<button class="rs-chat-close" aria-label="Close chat">&times;</button>' +
        "</div>" +
        '<div class="rs-chat-body"></div>' +
        '<div class="rs-chips"></div>' +
        '<div class="rs-chat-foot">' +
          '<input type="text" placeholder="Type your message..." aria-label="Message" />' +
          '<button class="rs-chat-send" aria-label="Send">' +
          '<svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>' +
          "</button>" +
        "</div>" +
      "</div>"
    );

    document.body.appendChild(launch);
    document.body.appendChild(panel);

    var body = panel.querySelector(".rs-chat-body");
    var chips = panel.querySelector(".rs-chips");
    var input = panel.querySelector("input");
    var greeted = false;

    function scroll() { body.scrollTop = body.scrollHeight; }

    function addMsg(html, who) {
      var m = document.createElement("div");
      m.className = "rs-msg " + (who === "user" ? "rs-user" : "rs-bot");
      m.innerHTML = html;
      body.appendChild(m);
      scroll();
    }

    function botReply(text) {
      var typing = document.createElement("div");
      typing.className = "rs-msg rs-bot";
      typing.textContent = "…";
      body.appendChild(typing);
      scroll();
      setTimeout(function () {
        typing.innerHTML = reply(text);
        scroll();
      }, 500);
    }

    function send(text) {
      text = (text || input.value).trim();
      if (!text) return;
      addMsg(text.replace(/</g, "&lt;"), "user");
      input.value = "";
      botReply(text);
    }

    function buildChips() {
      chips.innerHTML = "";
      CHIPS.forEach(function (c) {
        var b = document.createElement("button");
        b.className = "rs-chip";
        b.textContent = c;
        b.onclick = function () { send(c); };
        chips.appendChild(b);
      });
    }

    function open() {
      panel.classList.add("rs-open");
      if (!greeted) {
        greeted = true;
        addMsg(GREETING, "bot");
        buildChips();
      }
      input.focus();
    }
    function close() { panel.classList.remove("rs-open"); }

    launch.onclick = function () {
      panel.classList.contains("rs-open") ? close() : open();
    };
    panel.querySelector(".rs-chat-close").onclick = close;
    panel.querySelector(".rs-chat-send").onclick = function () { send(); };
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") send();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
