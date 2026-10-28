import React ,{ useState, useEffect }from 'react';
import { Button } from "@/components/ui/button";
import { markets as FKM} from '../fakeData/mockData'; // 一樣把資料引進來
import { useMarketStore } from '../store/useMarketStore'; 

// 用 {} 把需要的工具和函式接過來
// function Welcome({ onSelectMarket }) {

function Welcome() {  // 💡 使用Zustand  直接去金庫把「切換市場」的功能領出來用！
  const handleMarketChange = useMarketStore((state) => state.handleMarketChange);
  const selectedMarketType = useMarketStore(state => state.selectedMarketType);
  const marketsObject = useMarketStore(state => state.marketsObject)

  const marketsType = useMarketStore(state => state.marketsType)
  const markets = useMarketStore(state => state.markets);
  const marketsInfo = useMarketStore(state => state.marketsInfo);
  const isLoading = useMarketStore(state => state.isLoading);
  const loadAllMarkets = useMarketStore((state) => state.loadAllMarkets);

  useEffect(() => {
    loadAllMarkets(selectedMarketType);}, []); // 空陣列代表「這頁一打開，只執行這一次」

  const [ selectedMarketType2, setSelectedMarketType2] = useState("") 
  const [ showMarkets, setShowMarkets] = useState([]) 


  if (isLoading) return <div>🛒 市集小幫手初始化ing...</div>;

  // const marketNames = dbMarketData.filter(market => market.type === targetType)
                                  // .map(market => market.name);

  return (
    <div className="text-center max-w-md w-full mb-[20vh]">
      <h1 className="text-3xl font-extrabold text-slate-950 mb-4 tracking-tight">
        歡迎使用市集小幫手 🛒
      </h1>
      <p className="text-slate-500 mb-8 text-base leading-relaxed">
        專為傳統市場設計的導覽與數位化系統。<br />
        請選擇一個 實體市場 或 電商 逛逛吧！<br />（實體目前只有台北市）
      </p>
      {/* <div>測試目前變數{selectedMarketType}</div> */}

      <div className="flex items-center gap-4">
            <div className="w-1/3">{/* 左邊：文字標題 */}
                { selectedMarketType==='offline' && <label className="block text-sm font-bold text-slate-700">市集位置：</label>}
                { selectedMarketType==='online' && <label className="block text-sm font-bold text-slate-700">產業類別：</label>}
            </div>
            <div className="flex-1">{/* 右邊：下拉選單 */}
            <select
                value={selectedMarketType2}
                onChange={(e) => {setSelectedMarketType2(e.target.value);  
                    const targets = marketsObject.flatMap(m => m.mk_type2 === e.target.value ? [m.name]:[]);
                    console.log("目前要測試的變數是  targets：", targets);
                    if (targets) { setShowMarkets(targets)} 
                } }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none bg-white h-10">
            <option value="">下拉選單...</option>
            {/* 關鍵修改：使用 .map() 將陣列展開成多個 <option> */}
            {marketsType && marketsType.map((marketType2, index) => (
                <option key={index} value={marketType2}>
                    {marketType2}
                </option>         ))}
            </select>
            </div>
      </div>

      <div className="h-4" />

      <div className="grid grid-cols-1 gap-3 w-full">
        {showMarkets.map((market) => (
          <Button 
            key={market} 
            variant="outline" 
            className="py-6 text-base font-medium shadow-sm hover:bg-slate-100 justify-between px-6"
            // onClick={() => onSelectMarket(market)} // 觸發上一層傳下來的動作
            onClick={() => handleMarketChange(market,marketsInfo)} // 👍 直接執行，不需要爸爸傳過來！
          >
            <span>{market}</span>
            <span className="text-slate-400">→</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

export default Welcome;