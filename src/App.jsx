// import React, { useState } from 'react';
import { useMarketStore } from './store/useMarketStore'; // 💡 引進金庫
import { Navbar } from './components/Navbar'; // 💡 用花括號引入拆好的 Navbar

// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Welcome from "./pages/Welcome";
import WelcomeII from "./pages/WelcomeII";
import FilterPage from "./pages/FilterPage"; 
import VendorDetail from "./pages/VendorDetail";
// import { markets } from './fakeData/mockData'; // 引進需要的假資料

// function App() {
//   const [step, setStep] = useState(1); // 控管目前在哪一頁 (1: 歡迎, 2: 篩選, 3: 攤販詳情)
//   const [selectedMarket, setSelectedMarket] = useState("");
//   const [selectedVendor, setSelectedVendor] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState("");

//   const handleMarketChange = (value) => {
//     setSelectedMarket(value);
//     setStep(2);
//     setSelectedVendor("");
//     setSelectedProduct("");
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
//       {/* NAVBAR */}
//       <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
//         <div 
//           className="text-xl font-bold text-slate-800 cursor-pointer flex items-center gap-2"
//           onClick={() => { setStep(1); setSelectedMarket(""); }}
//         >
//           🏪 <span className="tracking-wider">市場小幫手</span>
//         </div>
        
//         {step > 1 && (
//           <div className="w-56">
//             <Select value={selectedMarket} onValueChange={handleMarketChange}>
//               <SelectTrigger className="bg-white">
//                 <SelectValue placeholder="切換其它市場..." />
//               </SelectTrigger>
//               <SelectContent>
//                 {markets.map((market) => (
//                   <SelectItem key={market} value={market}>{market}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         )}
//       </nav>

//       {/* 主畫面內容區 */}
//       <main className="flex-1 flex flex-col items-center justify-center p-6">
        
//         {/* 🌟 階段一：歡迎畫面 */}
//         {step === 1 && <Welcome onSelectMarket={handleMarketChange} />}

//         {/* 🌟 階段二：把需要的 Props 通通傳下去 */}
//         {step === 2 && (
//           <FilterPage 
//             selectedMarket={selectedMarket}
//             selectedVendor={selectedVendor}
//             setSelectedVendor={setSelectedVendor}
//             selectedProduct={selectedProduct}
//             setSelectedProduct={setSelectedProduct}
//             onBack={() => { setStep(1); setSelectedMarket(""); }}
//             onSubmit={() => setStep(3)}
//           />
//         )}

//         {/* 🌟 階段三：攤販詳情頁面 */}
//         {step === 3 && (
//           <VendorDetail 
//             vendorName={selectedVendor || (selectedProduct ? "推薦販售 " + selectedProduct + " 的攤販" : "")} 
//             onBack={() => setStep(2)} 
//           />
//         )}

//       </main>
//     </div>
//   );
// }



function App() {  // 💡 使用Zustand 從金庫裡只拿自己需要的 step 變數就好
  const page = useMarketStore((state) => state.page);

  return (
  // <div className="w-screen h-[100dvh] overflow-hidden flex items-center justify-center bg-slate-50">
  // 1. 最外層：牢牢鎖死在手機可視範圍內，絕對禁止外層網頁滑動
  <div className="w-screen h-[100dvh] overflow-hidden flex flex-col bg-slate-50 font-sans">

    {/* NAVBAR 區域（裡面有用到全域變數的元件，等等也直接去金庫拿） */}
    {/* 🌟 超級乾淨！Navbar 自己去跟金庫溝通了，App 完全不用插手 */}{/* NAVBAR 區域：固定在最上方 */}
    <Navbar />
    


    {/* 主要內容區域：        - items-center: 水平置中
        - overflow-y-auto: 這裡就是內部的獨立捲軸！內容超過時會由這裡負責滑動    */}
    <main className="flex-1 flex flex-col items-center p-6 overflow-y-auto">
      
      {/* 🌟 關鍵外包層：
          - min-h-full: 確保內容少時能撐滿高度
          - flex flex-col justify-center: 只有在內容少時才垂直置中
          - w-full max-w-md: 限制最大寬度，維持原本的 UI 比例

        - flex-1: 自動填滿 Navbar 剩下的所有空間
        - overflow-y-auto: 如果元件內容（例如市場按鈕太多）超出範圍，只有這個區域會自己出現捲軸，外層網頁不會滑動        */}
    {/* <div className="min-h-screen bg-slate-50 flex flex-col font-sans"> */}
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        {/* 🌟 乾乾淨淨！再也不用寫 Props 傳功能了 */}
        {page === "Welcome" && <Welcome />}
        {page === "WelcomeII" && <WelcomeII />}
        {page === "FilterPage" && <FilterPage />}
        {page === "VendorDetail" && <VendorDetail />}
    </div>
    </main>
  </div>
  );
}

export default App;