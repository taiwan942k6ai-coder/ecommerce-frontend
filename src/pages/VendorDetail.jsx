import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Star, StarHalf, ThumbsUp, ThumbsDown, ArrowLeft, MessageSquare, MapPin, Share2, Check } from "lucide-react"; // 引入小圖示
import { useMarketStore } from '../store/useMarketStore'; 
import  SeeReview  from '../components/SeeReview'; 
import  GiveReview  from '../components/GiveReview'; 

function VendorDetail() {  // 💡 使用Zustand  直接去金庫把「切換市場」的功能領出來用！
  // const page = useMarketStore((state) => state.page);
  const selectedMarket = useMarketStore((state) => state.selectedMarket);
  const selectedMarketType = useMarketStore(state => state.selectedMarketType);
  const selectedVendor = useMarketStore((state) => state.selectedVendor);
  const selectedVendorUID = useMarketStore((state) => state.selectedVendorUID);
  const vendorInfo = useMarketStore((state) => state.selectedVendorInfo);
  // const selectedProduct = useMarketStore((state) => state.selectedProduct);
  // const markets = useMarketStore((state) => state.markets);
  // const vendors = useMarketStore(state => state.vendors);
  const products = useMarketStore(state => state.products);
  const isLoading = useMarketStore(state => state.isLoading);
  // const setPage = useMarketStore((state) => state.setPage);
  // const setVendor = useMarketStore((state) => state.setVendor);
  // const setProduct = useMarketStore((state) => state.setProduct);
  const resetVendor = useMarketStore((state) => state.resetVendor);
  const handleVendorChange = useMarketStore((state) => state.handleVendorChange);
  const handleMarketChange = useMarketStore((state) => state.handleMarkerChange);
  
  useEffect(() => {
  // 條件：網址有帶 ID (selectedVendorUID 有值)，而且目前還沒有商店資料 (!selectedVendor 或為空字串)
  // if (selectedVendorUID && (!selectedVendor || selectedVendor === "")) {
    // handleMarketChange(selectedMarket,null);
    if (selectedVendorUID && (!selectedMarket || selectedMarket === "")) {
    handleVendorChange(selectedVendorUID);
  }
}, [selectedVendorUID]);

  // 處理點擊事件的函式
  const handleLineClick = (event) => {
    if (!vendorInfo.isLineValid) {// 如果不合格，直接阻擋（其實按鈕反灰後本來就點不到了，這層是雙重防護）
      event.preventDefault();  alert("店家未設定合格 LINE 連結！");  return;}
    event.preventDefault();// 合格就正常開啟新分頁
    window.open(vendorInfo.line, '_blank', 'noopener,noreferrer');
  };

 const [isGiveReviewOpen, setIsGiveReviewOpen] = useState(false)
 const [isSeeReviewOpen, setIsSeeReviewOpen] = useState(false)
 const [selectedProduct, setSelectedProduct] = useState("")

  const TAG_LABELS = {      tag1_count: '🥬高品質',
  tag2_count: '💰公道價',  tag3_count: '🤝阿莎力',
  tag4_count: '🏃必買',    tag7_count: '⚠️聽我說'
};
  const topThreeTags = Object.entries(vendorInfo.tagCount || {}) // 轉成 [['tag1_count', 0], ['tag2_count', 1], ...]
  .filter(([key, count]) => count > 0)              // 過濾掉數量為 0 的項目
  .sort((a, b) => b[1] - a[1])                      // 依數量由大到小排序（降冪）
  .slice(0, 3)                                      // 只取前 3 名
  .map(([key, count]) => ({                         // 整理成好用的物件格式
    key,
    label: TAG_LABELS[key] || key,
    count,
  }));

const [copied, setCopied] = useState(false);
const [fallbackUrl, setFallbackUrl] = useState(''); // 萬一自動複製全失敗，顯示可反白的輸入框

// 通用強制複製函式（相容 LINE / FB 內建瀏覽器）
const copyToClipboard = async (text) => {
  // 方法 A：現代 Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // 失敗則繼續往下走方法 B
    }
  }

  // 方法 B：建立隱藏 textarea 強制選取複製（專治 LINE / iOS WebView 權限阻擋）
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // 避免手機畫面因為 focus 突然放大或捲動
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999); // 相容 iOS Safari

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) return true;
  } catch (err) {
    // 兩種都失敗才回傳 false
  }
  return false;
};

const handleShare = async (pd_name) => {
  const shareUrl = window.location.href;
  const shareData = {
    title: selectedVendor || '推薦攤商',
    text: `推薦你商品：${pd_name || ''}！快來看看吧 👇`,
    url: shareUrl,
  };

  // 1. 優先嘗試手機原生分享選單（需在手機 Chrome / Safari 等外部瀏覽器開啟）
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return; // 分享成功直接結束
    } catch (err) {
      // 如果是使用者自己按取消關閉選單，直接結束，不要跳複製提示
      if (err.name === 'AbortError') return;
    }
  }

  // 2. 不支援原生分享時（如電腦版、或 LINE 內建瀏覽器），執行強制複製
  const isCopied = await copyToClipboard(shareUrl);
  if (isCopied) {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  } else {
    // 3. 極端情況下自動複製仍被擋，打開可反白選取的複製小視窗（取代 alert）
    setFallbackUrl(shareUrl);
  }
};



console.log("【除錯】VendorDetail 接收到的原始 selectedVendor 陣列是:", selectedVendor);
console.log("【除錯】VendorDetail 接收到的 selectedVendorUID:", selectedVendorUID);
if (isLoading) return <div>🛒 正在從資料庫撈取<br /> 【{ selectedVendor}】 的店家資訊和商品...</div>;
return (
    <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden animate-fade-in">
      
      {/* 頂部橫幅與返回按鈕 */}
      <div className="relative h-48 bg-slate-800">
        <img 
          src={vendorInfo.today_image_url_old } 
          alt="攤位實照" 
          className="w-full h-full object-cover opacity-60"/>
        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute top-4 left-4 bg-white/90 hover:bg-white text-slate-800 shadow"
          onClick={() =>{resetVendor();}}> <ArrowLeft className="w-4 h-4 mr-1" /> 返回篩選
        </Button>
        <div className="absolute bottom-4 left-4 text-white">
                { selectedMarketType==='offline' && <span className="text-xs font-bold bg-green-600 text-white px-2 py-0.5 rounded-full">現場實照</span>}
                { selectedMarketType==='online'  && <span className="text-xs font-bold bg-green-600 text-white px-2 py-0.5 rounded-full">官網形象照</span>}
          <h2 className="text-2xl font-bold mt-1 shadow-sm">{vendorInfo.name}</h2>
          <h3 className="text-sm text-slate-500 mt-1.5 font-medium leading-relaxed">
                                                 {vendorInfo.introduce || "暫無介紹"}</h3>
        </div>
      </div>

      {/* 攤販基本資料區塊 */}
      <div className="p-5 pb-2 border-b border-slate-100 bg-slate-50/50">
        <div className="grid grid-cols-5 gap-y-2 text-sm text-slate-600">
          <div className="col-span-2">聯絡人👨‍🌾：<span className="shrink-0 font-medium text-slate-900">{vendorInfo.poc}</span></div>
          <div className="col-span-3">　電話📞：<span className="whitespace-nowrap font-medium text-slate-900">{vendorInfo.phone}</span></div>

          { selectedMarketType==='offline' && (<>
          <div className="col-span-2">攤販位置：<span className="shrink-0 font-medium text-slate-900">{vendorInfo.other}</span></div> 
          <div className="col-span-3">　營業⏱️：<span className="whitespace-nowrap font-medium text-slate-900">{vendorInfo.open_time}</span></div>
          </>)}
          { selectedMarketType==='online'  && 
          <div className="col-span-5">官網連結：<a className="hover:underline" href={vendorInfo.other} target="_blank" rel="noopener noreferrer">
                                      <span className="shrink-0 font-medium text-slate-900">{vendorInfo.other}</span></a></div> }
                    
          <div className="col-span-5 flex items-center gap-2 mt-1">
            <span className="shrink-0">更新⏱️：</span>
            <span className={`font-medium ${vendorInfo.isUpdatedToday ? 'text-green-600' : 'text-rose-500'}`}>
              {vendorInfo.updatedAt}　<br />　{vendorInfo.isUpdatedToday ? '(今日已更新 ✅)' : '(⚠️ 今日尚未更新)'}　
            </span>
              {/* <Button size="sm" className="text-xs h-6 bg-blue-600 hover:bg-blue-700 text-white">
                <MapPin className="w-3.5 h-3.5 mr-1" /> 攤位導航
              </Button> */}

                  {/* LINE 按鈕：直接把 handleLineClick 綁在 onClick 上，拿掉原本的class屬性 target="_blank" rel="noopener"  */}
                  {/* <a  className="line-button" href={vendorInfo.line || "#"}  title="加入LINE好友" 
                      onClick={handleLineClick}> */}{/* 所有樣式直接寫在 style 屬性裡，透過 isLineValid 動態切換 */}
                  <a className="line-button"  href={vendorInfo.isLineValid ? vendorInfo.line : '#'} 
                    onClick={handleLineClick} title={vendorInfo.isLineValid ? "加 LINE好友" : "店家未設定正確的 LINE"}
                    style={{  display: 'inline-block',  transition: 'opacity 0.2s ease',
                      //  如果不合格：變淡 (35% 透明度)、變黑白、徹底鎖死滑鼠事件
                      opacity: vendorInfo.isLineValid ? 1 : 0.35,
                      filter: vendorInfo.isLineValid ? 'none' : 'grayscale(100%)',
                      pointerEvents: vendorInfo.isLineValid ? 'auto' : 'none',
                      cursor: vendorInfo.isLineValid ? 'pointer' : 'not-allowed'
                    }}>
                  <img src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png" alt="加 LINE好友" 
                  border="0" width="90"></img>
                  </a>
          </div>
        </div>

        {/* <div className="tag-list">
          {topThreeTags.length > 0 ? (  topThreeTags.map((tag) => (
              <span key={tag.key} className="tag-badge">  {tag.label} ({tag.count})  </span>))
          ) : (  <span className="no-tags">近 10 天尚無標籤評價</span>)}
        </div> */}
      </div>

      {/* 評論區塊 */}
      <div className="flex items-center justify-between gap-2 w-full  mt-2 mx-3 ">
        <div className="flex flex-wrap items-center gap-1.5">
          {topThreeTags.map((tag, index) => (
            <span  key={tag.key}  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] leading-tight font-medium border ${
                index === 0  ? 'bg-amber-50 text-amber-700 border-amber-200'  : 'bg-amber-50/40 text-amber-700/80 border-amber-200/60'}`}>
            <span>{tag.label}</span>
            <span className="py-0.5 font-bold opacity-80">{tag.count}</span>
            </span>))}
        </div>
        <Button variant="outline" size="sm" className="text-xs h-6 mr-6"  onClick={() => {setIsSeeReviewOpen(true); }}>
          <MessageSquare className="w-3 h-3" />看評論
        </Button>
      </div>

      {/* 商品串列區塊 */}
      <div className="p-5">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            { selectedMarketType==='offline' && "🥬 今日商品與物價" }
            { selectedMarketType==='online'  && "❤️ 特色商品與價格"}
          <span className="text-xs font-normal text-slate-400">(自動辨識，尚未製作)</span>
        </h3>
        
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="flex border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:border-slate-200 transition-all bg-white">
              {/* 左圖 */}
              <div className="w-24 h-24 flex-shrink-0 bg-slate-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              {/* 右說明 */}
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{product.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{product.note}</p>
                  </div>
                  {/* <div className="text-right">修改成固定左右 不會被拆成上下 */}
                  <div className="flex items-center justify-end whitespace-nowrap">
                    <span className="text-base font-extrabold text-rose-600">${product.price}</span>
                    <span className="text-xs text-slate-400"> /{product.unit}</span>
                  </div>
                </div>

                {/* 讚、倒讚與品質分 */}
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-1 border-t border-slate-50">
                  <div className="flex items-center gap-1">
                    <span className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-[10px] font-medium">
                      品質 {product.quality}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1 hover:text-green-600 transition-colors"
                            onClick={() => {setIsGiveReviewOpen(true); setSelectedProduct(product)}}>
                      <ThumbsUp className="w-3.5 h-3.5" /> <span>評論</span>
                    </button>
                    <button   type="button"   onClick={()=>handleShare(product.name)}
                        className="flex items-center gap-1 hover:text-rose-600 transition-colors">
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-medium">已複製連結</span>
                          </>       ) : ( 
                          <><Share2 className="w-3.5 h-3.5" /> <span>分享</span>  </>)}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

       {/* 獨立彈窗 */}
      <GiveReview isOpen={isGiveReviewOpen} onClose={() => {setIsGiveReviewOpen(false)}}  selectedProduct={selectedProduct}/>
      <SeeReview  isOpen={isSeeReviewOpen} onClose={() => setIsSeeReviewOpen(false)}   venderName={vendorInfo.name}  />
      
    </div>
  );
}

export default VendorDetail;





{/* 評分與按鈕行 */}
        // <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60">
          // <div className="flex items-center gap-1">
            {/* <Star className="w-5 h-5 fill-amber-400 text-amber-400" /> */}
                  {/* 迴圈產生 5 顆星 */}
                  // {Array.from({ length: 5 }).map((_, index) => {
                    // const starValue = index + 1; // 目前這顆星代表的分數（1 到 5）
                    // if (vendorInfo.rating >= starValue) {// 1. 如果分數大於等於目前星星數，顯示「滿星」
                      // return (<Star key={index} className="w-5 h-5 fill-amber-400 text-amber-400" />);}
                    // if (vendorInfo.rating > starValue - 1 && vendorInfo.rating < starValue) {// 2. 如果分數剛好介於中間（例如 3.5，目前檢查到第 4 顆星），顯示「半星」
                      // return (<StarHalf key={index} className="w-5 h-5 fill-amber-400 text-amber-400" />);}
                    // return (// 3. 剩下的顯示「空心星」（不填滿顏色，只留邊框色或灰色）
                      // <Star key={index} className="w-5 h-5 text-slate-300" /> // 這裡不加 fill
                    // );
                  // })}
            // <span className="font-bold text-slate-900 text-base">{vendorInfo.rating}　</span>
            {/* <span className="text-xs text-slate-400">({vendorInfo.reviewCount} 則評論)</span> */}
          // </div>
          // <div className="flex gap-2">
            // <Button variant="outline" size="sm" className="text-xs h-8">
              // <MessageSquare className="w-3..5 h-3.5 mr-1" />看評論({vendorInfo.reviewCount})
            // </Button>
            // <Button variant="outline" size="sm" className="text-xs h-8 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
              // ⭐ 評分
            // </Button>
            {/* <Button size="sm" className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white">
              <MapPin className="w-3.5 h-3.5 mr-1" /> 攤位導航
            </Button> */}
          // </div>
        // </div>