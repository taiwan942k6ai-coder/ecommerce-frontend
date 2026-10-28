import { useMarketStore } from '../store/useMarketStore'; 
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select'; 
import { markets as fakeMarketsData } from '../fakeData/mockData'; // 引進需要的假資料

// 右上角還沒寫onclick

export function Navbar() {  // 💡 使用 Named Export
  // 從金庫裡精準領取 Navbar 需要的所有寶物
  const page = useMarketStore((state) => state.page);
  const selectedMarket = useMarketStore((state) => state.selectedMarket);
  const markets = useMarketStore((state) => state.markets);
  
  // 從金庫領取修改資料的功能（對應你原本舊的 setStep 等等）
  const setPage = useMarketStore((state) => state.setPage);
  const handleMarketChange = useMarketStore((state) => state.handleMarketChange);
//   const resetMarket = useMarketStore((state) => state.resetMarket); 
  const resetMarket = useMarketStore((state) => state.resetMarket); 

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-2 flex justify-between items-center shadow-sm">
      <div 
        className="text-xl font-bold text-slate-800 cursor-pointer flex items-center gap-2"
        // onClick={() => { setPage(1); resetMarket(); }} //  呼叫金庫的功能
        onClick={() => { resetMarket(); }} 
      >
      <img  src="/市集小幫手.jpg"  alt="市集小幫手 LOGO" 
            style={{ width: '200px', height: 'auto' }} />
        {/* 🏪 <span className="tracking-wider">市集小幫手</span> */}
      </div>
   
      {page > 1 && (
        <div className="w-56">
          <Select value={selectedMarket} onValueChange={handleMarketChange}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="切換其它市場..." />
            </SelectTrigger>
            <SelectContent>
              {fakeMarketsData.map((market) => (
                <SelectItem key={market} value={market}>{market}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </nav>
  );
}