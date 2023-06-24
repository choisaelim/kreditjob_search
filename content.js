function faviconURL(u) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u); // this encodes the URL as well
    url.searchParams.set("size", "16");
    return url.toString();
}
console.log("test");

//wanted 됨
chrome.runtime.onMessage.addListener(function (msg) {
    console.log(msg);
    if (msg.action === "run") {
        // if (msg.url === location.href) {
        //   enableTranslation(API_KEY, LANGUAGE);
        // }
        const imageOverlay = document.createElement("img");
        imageOverlay.src = faviconURL("https://www.google.com");
        imageOverlay.alt = "Google's favicon";
        imageOverlay.classList.add("favicon-overlay");
        //.body
        const compNames = document.querySelectorAll(".body"); //document.querySelectorAll(".list_item");
        if (compNames.length > 0) {
            compNames.forEach((el) => {
                //.job-card-company-name
                const commentActions = el.querySelectorAll(".job-card-company-name"); //el.querySelectorAll(".company_nm");
                commentActions.forEach((action) => {
                    if (!action.querySelector("img")) {
                        // const span = document.createElement("span");
                        // span.innerHTML = "test";
                        // span.className = "translate";
                        // action.appendChild(span);
                        action.appendChild(imageOverlay);
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
