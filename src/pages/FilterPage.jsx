import React, { useState } from 'react'; // 💡 記得 import useState
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { vendorData, productData } from '../fakeData/mockData'; // 引進需要的假資料
import { useMarketStore } from '../store/useMarketStore'; 

function FilterPage() {  // 💡 使用Zustand  直接去金庫把「切換市場」的功能領出來用！
  // const page = useMarketStore((state) => state.page);
  const selectedMarketType = useMarketStore(state => state.selectedMarketType);
  const selectedMarket = useMarketStore((state) => state.selectedMarket);
  const selectedMarketInfo = useMarketStore((state) => state.selectedMarketInfo);
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
  const [vendorCategory, setVendorCategory] = useState("");
  const [productCategory, setProductCategory] = useState("");

  console.log("【除錯】FilterPage 接收到的原始 vendors 陣列是:", vendors[0]?.vendors);
  if (isLoading) return <div>🛒 正在從資料庫撈取<br /> 【{selectedMarket}】 的攤商資料ing...</div>;
  
  if (selectedMarketType==='offline') return (
    <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-md mb-[5vh]">      
      <div className="flex justify-between items-center mb-5">
        <div>
          <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded">當前據點</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{selectedMarket}</h2>
          <h3 className="text-sm text-slate-500 mt-1.5 font-medium leading-relaxed">
                                          {selectedMarketInfo?.introduce || "暫無介紹"}</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { resetMarket(); }}> 
          返回首頁
        </Button>
      </div>

      {/* 中間的地圖與下拉選單 HTML 保持不變 ... */}
            <div className="w-full h-44 bg-slate-100 rounded-xl overflow-hidden mb-6 border border-slate-200 flex items-center justify-center relative">
              {/* <img src="https://unsplash.com" alt="市場地圖" className="w-full h-full object-cover opacity-70" /> */}
              <iframe src={selectedMarketInfo.url} width="600" height="450" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="strict-origin-when-cross-origin"></iframe>  
              
              {/* <img src={selectedMarketInfo.url} alt="市場地圖" className="w-full h-full object-cover opacity-70" /> */}
              {/* <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4 "></div> */}
              <div className="absolute inset-0 bg-black/1 flex items-end justify-center pb- p-4 pointer-events-none">
                <span className="bg-white/95 text-slate-800 px-4 py-2 rounded-xl text-sm font-semibold shadow">
                  🗺️ 「{selectedMarket}」地圖位置
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">🔍 找攤販</label>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={vendorCategory} onValueChange={(val) => { setVendorCategory(val); setVendor(""); }}>
                    <SelectTrigger><SelectValue placeholder="選擇分類 (如:熟食)" /></SelectTrigger>
                    <SelectContent position="popper" className="z-[9999]"> {/* 🌟 加上 popper 防阻擋 */}
                            {/* 🌟 改用純陣列去 map */}
                      {vendors.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>))} 
                    </SelectContent>
                  </Select>
                  <Select value={selectedVendor} onValueChange={setVendor} disabled={!vendorCategory}>
                    <SelectTrigger><SelectValue placeholder="選擇指定攤販" /></SelectTrigger>
                    <SelectContent position="popper" className="z-[9999]"> {/* 🌟 這裡也加上防阻擋 */}
                            {/* 🌟 修改這裡：從陣列中找出目前選中的分類，再把裡面的攤販名字 map 出來 */}
                      {vendorCategory && vendors
                      .find(c => c.name === vendorCategory)?.vendors
                      .map((vendorName) => (
                            <SelectItem key={vendorName} value={vendorName}>{vendorName}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                className="w-full mt-0 bg-slate-900 hover:bg-slate-800 text-white py-6 text-base rounded-xl font-medium shadow-md"
                disabled={(!vendors || !selectedVendor)}
                onClick={() => handleVendorChange(selectedVendor)}>
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
        className="w-full mt-0 bg-slate-900 hover:bg-slate-800 text-white py-6 text-base rounded-xl font-medium shadow-md"
        disabled={ (!productCategory || !selectedProduct)}
        // onClick={onSubmit} // 💡 點擊前往第三頁
        onClick={() => setPage(3)}
      >
        🚀 查詢 (還沒設計這個頁面)
      </Button>
    </div>
  );




    if (selectedMarketType==='online') return (
    <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-md">      
      <div className="flex justify-between items-center mb-5">
        <div>
          <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded">當前據點</span>

          <h2 className="text-2xl font-bold text-slate-900 mt-1">{selectedMarket}</h2>
          <h3 className="text-sm text-slate-500 mt-1.5 font-medium leading-relaxed">
                                          {selectedMarketInfo?.introduce || "暫無介紹"}</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { resetMarket(); }}> {/* 💡 改成自己寫?*/}
          返回首頁
        </Button>
      </div>

        <div className="w-full h-44 bg-slate-100 rounded-xl overflow-hidden mb-6 border border-slate-200 flex items-center justify-center relative">
          <img src={selectedMarketInfo.url} alt={"電商產業類別_"+selectedMarketInfo.name+"_形像照"} className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
          </div>
        </div>

      <div className="grid grid-cols-1 gap-3 w-full">
        {vendors[0]?.vendors.map((vendor) => (
          <Button 
            key={vendor} 
            variant="outline" 
            className="py-6 text-base font-medium shadow-sm hover:bg-slate-100 justify-between px-6"
            // onClick={() => onSelectMarket(market)} // 觸發上一層傳下來的動作
            onClick={() => handleVendorChange(vendor)}
          >
            <span>{vendor}</span>
            <span className="text-slate-400">→</span>
          </Button>
        ))}
      </div>



    </div>
  );
}

export default FilterPage;