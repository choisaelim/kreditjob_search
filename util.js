export function stripTags(html) {
    // some tags effect a result of translationg
    return html
        .replace(/<br>/g, "")
        .replace(/<g-emoji.+?"\s*>/g, "")
        .replace(/<\/g-emoji>/g, "");
}

export function setStorageData(data) {
    new Promise((resolve, reject) =>
        chrome.storage.sync.set(data, () =>
            chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve()
        )
    );
}
export function getStorageData(key) {
    new Promise((resolve, reject) =>
        chrome.storage.sync.get(key, (result) =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve(result)
        )
    );
}

export function regexName(e) {
    e.trim();
    e.replace("(주)", "");
    e.replace(/(.*)/gi, "");
    return e;
}
