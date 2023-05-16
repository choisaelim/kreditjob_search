let companyList = [
  {id: '1', company: "금병영 / 서울, 강동구", link : ""},
  {id: '2', company: "테스트 / 서울, 강북구", link : ""}
]

import { tldLocales } from './locales.js';

// Add a listener to create the initial context menu items,
// context menu items only need to be created at runtime.onInstalled
chrome.runtime.onInstalled.addListener(async () => {
  for (var i = 0 ; i < companyList.length ; i++) {
    chrome.contextMenus.create({
      id: companyList[i].id,
      title: companyList[i].company,
      type: 'normal',
      contexts: ['selection']
    });
  }
});

// Open a new search tab when the user clicks a context menu
chrome.contextMenus.onClicked.addListener((item, tab) => {
  const tld = item.menuItemId;
  const url = new URL(`https://google.com/search`);
  url.searchParams.set('q', item.selectionText);
  chrome.tabs.create({ url: url.href, index: tab.index + 1 });
});

