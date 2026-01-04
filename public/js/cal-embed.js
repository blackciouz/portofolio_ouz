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

// Floating button with French text and custom styling
Cal.ns["15min"]("floatingButton", {
    "calLink":"ouzefi-automaciouz-yugozj/15min",
    "config":{"layout":"month_view","theme":"dark"},
    "buttonText":"Réserver un appel",
    "hideButtonIcon":false
}); 

Cal.ns["15min"]("ui", {
    "hideEventTypeDetails":false,
    "layout":"month_view",
    "theme":"dark",
    "styles":{
        "branding":{
            "brandColor":"#0ea5e9"
        }
    }
});

// Apply custom glassmorphism styles to Cal.com button after it loads
setTimeout(() => {
    const calButton = document.querySelector('[data-cal-namespace="15min"]');
    if (calButton) {
        calButton.style.cssText = `
            background: rgba(15, 23, 42, 0.7) !important;
            backdrop-filter: blur(20px) saturate(180%) !important;
            -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
            border: 1px solid rgba(14, 165, 233, 0.3) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 40px rgba(14, 165, 233, 0.2), inset 0 0 20px rgba(14, 165, 233, 0.1) !important;
            color: #38bdf8 !important;
            font-weight: 600 !important;
            border-radius: 12px !important;
            padding: 14px 24px !important;
            font-size: 15px !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        `;
        
        // Add hover effect
        calButton.addEventListener('mouseenter', () => {
            calButton.style.background = 'rgba(15, 23, 42, 0.85) !important';
            calButton.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(14, 165, 233, 0.4), inset 0 0 30px rgba(14, 165, 233, 0.2) !important';
            calButton.style.transform = 'translateY(-2px)';
            calButton.style.borderColor = 'rgba(14, 165, 233, 0.5) !important';
        });
        
        calButton.addEventListener('mouseleave', () => {
            calButton.style.background = 'rgba(15, 23, 42, 0.7) !important';
            calButton.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 40px rgba(14, 165, 233, 0.2), inset 0 0 20px rgba(14, 165, 233, 0.1) !important';
            calButton.style.transform = 'translateY(0)';
            calButton.style.borderColor = 'rgba(14, 165, 233, 0.3) !important';
        });
    }
}, 1000);
