import React ,{ useEffect }from 'react';
import { Button } from "@/components/ui/button";
import { markets as FKM} from '../fakeData/mockData'; // 一樣把資料引進來
import { useMarketStore } from '../store/useMarketStore'; 

// 用 {} 把需要的工具和函式接過來
// function Welcome({ onSelectMarket }) {

function Welcome() {  // 💡 使用Zustand  直接去金庫把「切換市場」的功能領出來用！
  const handleMarketChange = useMarketStore((state) => state.handleMarketChange);
  const markets = useMarketStore(state => state.markets);
  const marketsInfo = useMarketStore(state => state.marketsInfo);
  const isLoading = useMarketStore(state => state.isLoading);
  const setPage = useMarketStore(state => state.setPage)
  const setMarketType = useMarketStore(state => state.setMarketType)
  // const loadAllMarkets = useMarketStore((state) => state.loadAllMarkets);

  // useEffect(() => {
    // loadAllMarkets();}, []); // 空陣列代表「這頁一打開，只執行這一次」

  function handleOption(marketType){
    setMarketType(marketType)
    setPage("WelcomeII")
  }


  if (isLoading) return <div>🛒 市集小幫手初始化ing...</div>;
  // 請先選擇一個 實體市場 或 電商 逛逛吧！
  return (
    <div className="text-center max-w-md w-full mb-[20vh]">
      <h1 className="text-3xl font-extrabold text-slate-950 mb-4 tracking-tight">
        歡迎使用市集小幫手 🛒
      </h1>
      <p className="text-slate-500 mb-8 text-base leading-relaxed">
        專為傳統市場設計的導覽與數位化系統。<br />
        請先選擇您要查找的 市集 吧！
      </p>
      <div className="grid grid-cols-1 gap-3 w-full">
        <Button 
            key="實體市集"
            variant="outline" 
            className="py-6 text-base font-medium shadow-sm hover:bg-slate-100 justify-between px-6"
            onClick={() => handleOption("offline")} >
            <span>實體市集/菜市場</span>
            <span className="text-slate-400">→</span>
        </Button>
      </div>

      <div className="h-4" /> 

      <div className="grid grid-cols-1 gap-3 w-full">
        <Button 
            key="線上電商"
            variant="outline" 
            className="py-6 text-base font-medium shadow-sm hover:bg-slate-100 justify-between px-6"
            onClick={() => handleOption("online")} >
            <span>線上電商</span>
            <span className="text-slate-400">→</span>
        </Button>
      </div>

    </div>
  );
}

export default Welcome;