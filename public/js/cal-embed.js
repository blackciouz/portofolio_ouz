// Cal.com embed - Custom floating button (fixed left, all pages)
(function (C, A, L) {
    let p = function (a, ar) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
        }
        if (ar[0] === L) {
            const api = function () { p(api, arguments); };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
                cal.ns[namespace] = cal.ns[namespace] || api;
                p(cal.ns[namespace], ar);
                p(cal, ["initNamespace", namespace]);
            } else p(cal, ar);
            return;
        }
        p(cal, ar);
    };
})(window, "https://app.cal.com/embed/embed.js", "init");

Cal("init", "15min", { origin: "https://app.cal.com" });

Cal.ns["15min"]("ui", {
    "hideEventTypeDetails": false,
    "layout": "month_view",
    "theme": "dark",
    "styles": {
        "branding": {
            "brandColor": "#0ea5e9"
        }
    }
});

// ─── Custom floating button (left side, fixed) ───────────────────────────────
(function createCalButton() {
    // Avoid duplicates
    if (document.getElementById('cal-custom-btn')) return;

    var btn = document.createElement('button');
    btn.id = 'cal-custom-btn';
    btn.setAttribute('aria-label', 'Réserver un appel');
    btn.innerHTML =
        '<span class="cal-btn-icon">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>' +
                '<line x1="16" y1="2" x2="16" y2="6"></line>' +
                '<line x1="8" y1="2" x2="8" y2="6"></line>' +
                '<line x1="3" y1="10" x2="21" y2="10"></line>' +
            '</svg>' +
        '</span>' +
        '<span class="cal-btn-label">Réserver un appel</span>';

    btn.onclick = function () {
        Cal.ns["15min"]("modal", {
            calLink: "ouzefi-automaciouz-yugozj/15min",
            config: { layout: "month_view", theme: "dark" }
        });
    };

    document.body.appendChild(btn);
})();
