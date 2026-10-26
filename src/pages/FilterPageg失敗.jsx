// src/pages/FilterPage.jsx
import React, { useState } from 'react'; // 💡 記得 import useState
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { vendorData, productData } from '../fakeData/mockData'; // 引進需要的假資料
import { useMarketStore } from '../store/useMarketStore'; 

// // 用 {} 把老大傳下來的 Props 接過來
// function FilterPage({ 
//   selectedMarket, 
//   selectedVendor, 
//   setSelectedVendor, 
//   selectedProduct, 
//   setSelectedProduct, 
//   onBack, 
//   onSubmit 這兩個功能要實作
// }) {
  

function FilterPage() {  // 💡 使用Zustand  直接去金庫把「切換市場」的功能領出來用！
  // const page = useMarketStore((state) => state.page);
  const selectedMarket = useMarketStore((state) => state.selectedMarket);
  const selectedVendor = useMarketStore((state) => state.selectedVendor);
  const selectedProduct = useMarketStore((state) => state.selectedProduct);
  // const markets = useMarketStore((state) => state.markets);
  const vendors = useMarketStore(state => state.vendors);
  const isLoading = useMarketStore(state => state.isLoading);
 
  // const setPage = useMarketStore((state) => state.setPage);
  const setVendor = useMarketStore((state) => state.setVendor);
  const setProduct = useMarketStore((state) => state.setProduct);
  const resetMarket = useMarketStore((state) => state.resetMarket);
  const handleVendorChange = useMarketStore((state) => state.handleVendorChange);

  // 💡 只有自己會用到的變數，直接宣告在這裡！
  // const [vendorCategory, setVendorCategory] = useState("");
  const [productCategory, setProductCategory] = useState("");

  console.log("【除錯】FilterPage 接收到的原始 vendors 陣列是:", vendors);
//   // ==========================================
//   // 🌟 核心處理：將 Supabase 的扁平陣列，整理成 UI 需要的分類資料
//   // ==========================================
// // 1. 改成用陣列來存分類： [ { id: "虛擬", name: "虛擬", shops: ["測試攤販(賣寶可夢)"] } ]
// const vendorsArray = [];
// vendors.forEach(vendor => {
//   const catName = vendor.sp_type || "未分類";
  
//   // 檢查這個分類是不是已經加進陣列了
//   let existingCat = vendorsArray.find(c => c.name === catName);
  
//   if (!existingCat) {
//     existingCat = { id: catName, name: catName, shops: [] };
//     vendorsArray.push(existingCat);
//   }
  
//   if (!existingCat.shops.includes(vendor.name)) {
//     existingCat.shops.push(vendor.name);
//   }
// });



  if (isLoading) return <div>🛒 正在幫您從資料庫撈取 【{selectedMarket}】 的攤商...</div>;
  return (
    <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-md">
      {/* ... 這裡放原本大坨的 HTML 畫面 ... */}
      {/* 注意：裡面的變數名稱都不用改，因為我們已經在上面宣告或接過來了！ */}
      
      <div className="flex justify-between items-center mb-5">
        <div>
          <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded">當前據點</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{selectedMarket}</h2>
        </div>{/* 💡 使用傳進來的返回功能 */}
        {/* <Button variant="ghost" size="sm" onClick={onBack}>  */}
        <Button variant="ghost" size="sm" onClick={() => { resetMarket(); }}> {/* 💡 改成自己寫?*/}
          返回首頁
        </Button>
      </div>

      {/* 中間的地圖與下拉選單 HTML 保持不變 ... */}
            <div className="w-full h-44 bg-slate-100 rounded-xl overflow-hidden mb-6 border border-slate-200 flex items-center justify-center relative">
              <img src="https://unsplash.com" alt="市場地圖" className="w-full h-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
                <span className="bg-white/95 text-slate-800 px-4 py-2 rounded-xl text-sm font-semibold shadow">
                  🗺️ 「{selectedMarket}」平面地圖位置
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">🔍 找攤販</label>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={vendors} onValueChange={(val) => { setVendor(val); setVendor(""); }}>
                    <SelectTrigger><SelectValue placeholder="選擇分類 (如:熟食)" /></SelectTrigger>
                    {/* <SelectContent>
                      {Object.keys(vendorData).map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent> */}
                    <SelectContent position="popper" className="z-[9999]"> {/* 🌟 加上 popper 防阻擋 */}
                            {/* 🌟 改用剛剛做好的純陣列去 map */}
                      {vendors.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>))} 
                    </SelectContent>
                  </Select>
                  <Select value={selectedVendor} onValueChange={setVendor} disabled={!vendors}>
                    <SelectTrigger><SelectValue placeholder="選擇指定攤販" /></SelectTrigger>
                    {/* <SelectContent>
                      {vendors && vendorData[vendors].map((vendor) => <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>)}
                    </SelectContent> */}
                    <SelectContent position="popper" className="z-[9999]"> {/* 🌟 這裡也加上防阻擋 */}
                            {/* 🌟 修改這裡：從陣列中找出目前選中的分類，再把裡面的攤販名字 map 出來 */}
                      {vendors && vendors
                      .find(c => c.name === vendors)?.shops
                      .map((vendorName) => (
                    <SelectItem key={vendorName} value={vendorName}>{vendorName}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white py-6 text-base rounded-xl font-medium shadow-md"
                disabled={(!vendors || !selectedVendor)}
                // onClick={onSubmit} // 💡 點擊前往第三頁
                // onClick={() => setPage(3)}
                onClick={() => handleVendorChange()}
              >
                🚀 進入攤販頁面
              </Button>


              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">🍎 找商品</label>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={productCategory} onValueChange={(val) => { setProductCategory(val); setProduct(""); }}>
                    <SelectTrigger><SelectValue placeholder="商品類別" /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(productData).map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={selectedProduct} onValueChange={setProduct} disabled={!productCategory}>
                    <SelectTrigger><SelectValue placeholder="商品細項" /></SelectTrigger>
                    <SelectContent>
                      {productCategory && productData[productCategory].map((prod) => <SelectItem key={prod} value={prod}>{prod}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
      <Button 
        className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white py-6 text-base rounded-xl font-medium shadow-md"
        disabled={ (!productCategory || !selectedProduct)}
        // onClick={onSubmit} // 💡 點擊前往第三頁
        onClick={() => setPage(3)}
      >
        🚀 前往看成果 (還沒設計這個頁面)
      </Button>
    </div>
  );
}

export default FilterPage;