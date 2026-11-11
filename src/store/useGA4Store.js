import { create } from 'zustand'

export const useMarketStore = create((set) => ({
  // 這裡是你原本的其他狀態（例如 markets, page...）

  // 💡 成功打包成一個叫做 testTag 的方法，並把 marketType 當作參數傳進來
  testTag: (marketType) => {
    // 1. 先確認瀏覽器有沒有載入過 GA4 (防呆)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag("event", "generate_lead", {
        currency: "TWD", // 建議改成標準 ISO 代碼 "TWD"，沒用到也可以整行刪除
        value: 777, 
        market_selection: marketType === "offline" ? "實體市集" : "線上電商", 
        page_location: window.location.href 
      });
    }
  }

}))