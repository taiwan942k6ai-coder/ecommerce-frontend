import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Star, StarHalf, ThumbsUp, ThumbsDown, ArrowLeft, MessageSquare, MapPin } from "lucide-react"; // 引入小圖示
import { useMarketStore } from '../store/useMarketStore'; 

// function VendorDetail({ vendorName, onBack }) {
  // 模擬從資料庫撈出的攤販詳細資料
//   // 模擬該攤販的商品列表
//   const [products] = useState([
//     { id: 1, name: "有機高麗菜", price: 65, unit: "斤", note: "梨山脆甜", quality: 4.8, likes: 45, dislikes: 2, image: "https://unsplash.com" },
//     { id: 2, name: "本地黑葉白菜", price: 35, unit: "把", note: "今日剛採收", quality: 4.5, likes: 22, dislikes: 0, image: "https://unsplash.com" },
//     { id: 3, name: "網室溫室番茄", price: 90, unit: "斤", note: "微酸帶甜", quality: 4.2, likes: 18, dislikes: 4, image: "https://unsplash.com" },
//   ]);
  // const vendorInfo = {
  //   name:  "陳家有機蔬菜",
  //   // name: vendorName || "陳家有機蔬菜",
  //   owner: "陳大明",
  //   phone: "0912-345-678",
  //   updatedAt: "2026-09-27 08:30", // 模擬今天日期
  //   isUpdatedToday: true, // 是否為今日更新
  //   rating: 4.7,
  //   reviewCount: 128,  
  // };

function VendorDetail() {  // 💡 使用Zustand  直接去金庫把「切換市場」的功能領出來用！
  // const page = useMarketStore((state) => state.page);
  // const selectedMarket = useMarketStore((state) => state.selectedMarket);
  const selectedMarketType = useMarketStore(state => state.selectedMarketType);
  const selectedVendor = useMarketStore((state) => state.selectedVendor);
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

  // 處理點擊事件的函式
  const handleLineClick = (event) => {
    if (!vendorInfo.isLineValid) {// 如果不合格，直接阻擋（其實按鈕反灰後本來就點不到了，這層是雙重防護）
      event.preventDefault();
      alert("店家未設定合格 LINE 連結！");
      return;}
    event.preventDefault();// 合格就正常開啟新分頁
    window.open(vendorInfo.line, '_blank', 'noopener,noreferrer');
  };

console.log("【除錯】VendorDetail 接收到的原始 products 陣列是:", products);
console.log("【除錯】VendorDetail 接收到的 vendorInfo.today_image_url_old:", vendorInfo.today_image_url_old);
 if (isLoading) return <div>🛒 正在從資料庫撈取<br /> 【{selectedVendor}】 的店家資訊和商品...</div>;

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
          <h2 className="text-2xl font-bold mt-1 shadow-sm">{selectedVendor}</h2>
          <h3 className="text-sm text-slate-500 mt-1.5 font-medium leading-relaxed">
                                                 {vendorInfo.introduce || "暫無介紹"}</h3>
        </div>
      </div>

      {/* 攤販基本資料區塊 */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
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
                      onClick={handleLineClick}> */}
                  {/* 所有樣式直接寫在 style 屬性裡，透過 isLineValid 動態切換 */}
                  <a className="line-button"  href={vendorInfo.isLineValid ? vendorInfo.line : '#'} 
                    onClick={handleLineClick} title={vendorInfo.isLineValid ? "加 LINE好友" : "店家未設定正確的 LINE"}
                    style={{
                      display: 'inline-block',
                      transition: 'opacity 0.2s ease',
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

        {/* 評分與按鈕行 */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60">
          <div className="flex items-center gap-1">
            {/* <Star className="w-5 h-5 fill-amber-400 text-amber-400" /> */}
                  {/* 迴圈產生 5 顆星 */}
                  {Array.from({ length: 5 }).map((_, index) => {
                    const starValue = index + 1; // 目前這顆星代表的分數（1 到 5）
                    if (vendorInfo.rating >= starValue) {// 1. 如果分數大於等於目前星星數，顯示「滿星」
                      return (<Star key={index} className="w-5 h-5 fill-amber-400 text-amber-400" />);}
                    if (vendorInfo.rating > starValue - 1 && vendorInfo.rating < starValue) {// 2. 如果分數剛好介於中間（例如 3.5，目前檢查到第 4 顆星），顯示「半星」
                      return (<StarHalf key={index} className="w-5 h-5 fill-amber-400 text-amber-400" />);}
                    return (// 3. 剩下的顯示「空心星」（不填滿顏色，只留邊框色或灰色）
                      <Star key={index} className="w-5 h-5 text-slate-300" /> // 這裡不加 fill
                    );
                  })}
            <span className="font-bold text-slate-900 text-base">{vendorInfo.rating}　</span>
            {/* <span className="text-xs text-slate-400">({vendorInfo.reviewCount} 則評論)</span> */}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs h-8">
              <MessageSquare className="w-3..5 h-3.5 mr-1" />看評論({vendorInfo.reviewCount})
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-8 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
              ⭐ 評分
            </Button>
            {/* <Button size="sm" className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white">
              <MapPin className="w-3.5 h-3.5 mr-1" /> 攤位導航
            </Button> */}
          </div>
        </div>
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
                    <button className="flex items-center gap-1 hover:text-green-600 transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" /> <span>{product.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-rose-600 transition-colors">
                      <ThumbsDown className="w-3.5 h-3.5" /> <span>{product.dislikes}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default VendorDetail;