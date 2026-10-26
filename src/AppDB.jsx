import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Welcome from "./pages/Welcome";
import FilterPage from "./pages/FilterPage"; 
import VendorDetail from "./pages/VendorDetail";
import { markets as mockMarkets } from './fakeData/mockData'; 

// 🌟 引入剛剛改寫好的純工具函式
import { fetchMarketsFromDB , fetchShopsByMarketFromDB } from './components/db/MarketList'; 

function App() {
  const [step, setStep] = useState(1); 
  const [selectedMarket, setSelectedMarket] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  // 🌟 狀態一：用來存放從 Supabase 撈出來的市場陣列
  const [markets, setMarkets] = useState([]);
  const [vendors, setVendors] = useState([]);
  // 🌟 狀態二：用來控管是不是正在載入中（預設為 true）
  const [loading, setLoading] = useState(true);

  // 🌟 當 App 組件一打開，立刻去 Supabase 拿資料
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const dbMarketData = await fetchMarketsFromDB(); // 呼叫工具箱
          console.log("初始化抓市集資料，Supabase 回傳的原始資料是：", dbMarketData);
//      
      // 🌟 核心轉換：因為 Supabase 撈出來是物件陣列 (如 [{mkid:1, name:"南門市場"}, ...])
      // 必須轉換成你原本 UI 需要的「純字串陣列」 (如 ["南門市場", "士林市場"])
      const marketNames = dbMarketData.map(market => market.name); 

      // 萬一資料庫是空的，就拿假資料頂替，確保開發順利
      if (marketNames.length === 0) {
        setMarkets(mockMarkets);
      } else {
        setMarkets(marketNames); // 把處理好的字串陣列存進 state
      }
      
      setLoading(false); // 撈完資料了，關閉載入狀態
    };

    loadData();
  }, []);







  const handleMarketChange = async (value) => {
    setSelectedMarket(value);
    setStep(2);
    setSelectedVendor("");
    setSelectedProduct("");
        // 🌟 開始撈取該市場的專屬攤販
    setLoading(true);

         console.log("當前查詢的市場名稱為:", JSON.stringify(value));
    const dbVendorsData = await fetchShopsByMarketFromDB(value); // 傳入剛剛選的市場名字
         console.log("抓攤販資料，Supabase 回傳的原始資料是：", dbVendorsData);
    
    setVendors(dbVendorsData); // 存進 State 中
    setLoading(false);
  };

  // 🌟 如果資料還在撈，直接在最前面攔截，顯示載入畫面（避免畫面空白或出錯）
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-slate-500">
        🏪 正在與資料庫連線中，請稍候...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div 
          className="text-xl font-bold text-slate-800 cursor-pointer flex items-center gap-2"
          onClick={() => { setStep(1); setSelectedMarket(""); }}
        >
          🏪 <span className="tracking-wider">市集小幫手</span>
        </div>
        
        {step > 1 && (
          <div className="w-56">
            <Select value={selectedMarket} onValueChange={handleMarketChange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="切換其它市場..." />
              </SelectTrigger>
              <SelectContent>
                {/* 🌟 這裡會自動使用上面已經存好 Supabase 資料的 markets 陣列 */}
                {markets.map((market) => (
                  <SelectItem key={market} value={market}>{market}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </nav>

      {/* 主畫面內容區 */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        
        {/* 🌟 階段一：歡迎畫面（將撈好的 markets 傳下去給 Welcome 用） */}
        {step === 1 && <Welcome onSelectMarket={handleMarketChange} markets={markets} />}

        {/* 🌟 階段二：篩選頁面（同樣把最新的 markets 傳下去） */}
        {step === 2 && (
          <FilterPage 
            markets={markets}
            vendors={vendors}               // 🌟 傳遞篩選好的真實攤販資料
            loading={loading}               // 🌟 傳遞攤販載入狀態
            selectedMarket={selectedMarket}
            selectedVendor={selectedVendor}
            setSelectedVendor={setSelectedVendor}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            onBack={() => { setStep(1); setSelectedMarket(""); }}
            onSubmit={() => setStep(3)}
          />
        )}

        {/* 🌟 階段三：攤販詳情頁面 */}
        {step === 3 && (
          <VendorDetail 
            vendorName={selectedVendor || (selectedProduct ? "推薦販售 " + selectedProduct + " 的攤販" : "")} 
            onBack={() => setStep(2)} 
          />
        )}

      </main>
    </div>
  );
}

export default App;