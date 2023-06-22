function faviconURL(u) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u); // this encodes the URL as well
    url.searchParams.set("size", "16");
    return url.toString();
}
console.log("test");

chrome.runtime.onMessage.addListener(function (msg) {
    console.log(msg);
    debugger;
    if (msg.action === "rerun") {
        // if (msg.url === location.href) {
        //   enableTranslation(API_KEY, LANGUAGE);
        // }
        const imageOverlay = document.createElement("img");
        imageOverlay.src = faviconURL("https://www.google.com");
        imageOverlay.alt = "Google's favicon";
        imageOverlay.classList.add("favicon-overlay");
        //.body
        const compNames = document.querySelectorAll(".list_item");
        //document.querySelectorAll('.job-card-company-name');
        if (compNames.length > 0) {
            compNames.forEach((el) => {
                //.job-card-company-name
                const commentActions = el.querySelectorAll(".company_nm");
                commentActions.forEach((action) => {
                    if (!action.querySelector("span.translate")) {
                        const span = document.createElement("span");
                        span.innerHTML = "test";
                        span.className = "translate";
                        action.appendChild(span);
                    }
                    // if (!action.querySelector('button.translate')) {
                    //   const btn = document.createElement('button');
                    //   btn.className = 'btn-link timeline-comment-action translate';
                    //   btn.setAttribute('title', 'Translate to Korean');
                    //   btn.innerHTML = 't';

                    //   action.prepend(btn);
                    // }
                });
            });
        }
    }
});

// document.body.appendChild(imageOverlay);
