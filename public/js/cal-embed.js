// Cal.com floating button - Loaded on all pages
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
            if(typeof namespace === "string"){
                cal.ns[namespace] = cal.ns[namespace] || api;
                p(cal.ns[namespace], ar);
                p(cal, ["initNamespace", namespace]);
            } else p(cal, ar); 
            return;
        } 
        p(cal, ar); 
    }; 
})(window, "https://app.cal.com/embed/embed.js", "init");

Cal("init", "15min", {origin:"https://app.cal.com"});

// Floating button with French text
Cal.ns["15min"]("floatingButton", {
    "calLink":"ouzefi-automaciouz-yugozj/15min",
    "config":{"layout":"month_view"},
    "buttonText":"Réserver un appel",
    "hideButtonIcon":false
}); 

Cal.ns["15min"]("ui", {
    "hideEventTypeDetails":false,
    "layout":"month_view"
});
