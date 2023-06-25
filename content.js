function faviconURL(u) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u); // this encodes the URL as well
    url.searchParams.set("size", "16");
    return url.toString();
}
//wanted 됨
chrome.runtime.onMessage.addListener(function (msg) {
    const SEARCH_SVG =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"></path></svg>';

    console.log(msg);
    if (msg.action === "run") {
        // if (msg.url === location.href) {
        //   enableTranslation(API_KEY, LANGUAGE);
        // }
        //.body
        const compNames = document.querySelectorAll(".body"); //document.querySelectorAll(".list_item");
        if (compNames.length > 0) {
            compNames.forEach((el) => {
                //.job-card-company-name
                const commentActions = el.querySelectorAll(".job-card-company-name"); //el.querySelectorAll(".company_nm");
                commentActions.forEach((action) => {
                    if (!action.querySelector("button.translate")) {
                        const btn = document.createElement("button");
                        btn.className = "btn-link timeline-comment-action translate";
                        btn.setAttribute("title", "Search Company");
                        btn.innerHTML = SEARCH_SVG;
                        action.prepend(btn);
                    }
                });
            });
        }
    }
});

// document.body.appendChild(imageOverlay);
