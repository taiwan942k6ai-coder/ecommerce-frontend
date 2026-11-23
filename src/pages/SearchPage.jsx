import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Star, StarHalf, ThumbsUp, ThumbsDown, ArrowLeft, MessageSquare, MapPin } from "lucide-react"; // 引入小圖示
import { useMarketStore } from '../store/useMarketStore'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


function SearchPage() {  // 💡 使用Zustand  直接去金庫把「切換市場」的功能領出來用！
  const marketsObject = useMarketStore(state => state.marketsObject)
  const selectedMarket = useMarketStore((state) => state.selectedMarket);
  const setSelectedMarket = useMarketStore((state) => state.setSelectedMarket);
  const selectedMarketInfo = useMarketStore((state) => state.selectedMarketInfo);
  const marketsInfo = useMarketStore(state => state.marketsInfo);
  const setMarket = useMarketStore((state) => state.setMarket);
  const selectedMarketType = useMarketStore(state => state.selectedMarketType);
  const selectedVendor = useMarketStore((state) => state.selectedVendor);
  // const vendorInfo = useMarketStore((state) => state.selectedVendorInfo);
  const selectedProduct = useMarketStore((state) => state.selectedProduct);
  const marketsType = useMarketStore(state => state.marketsType)
  const productsType = useMarketStore(state => state.productsType);
  const markets = useMarketStore((state) => state.markets);
  // const vendors = useMarketStore(state => state.vendors);
  const products = useMarketStore(state => state.products);
  const isLoading = useMarketStore(state => state.isLoading);
  const handleMarketChange = useMarketStore((state) => state.handleMarketChange);
  const handleVendorChange = useMarketStore((state) => state.handleVendorChange);
  // const setVendor = useMarketStore((state) => state.setVendor);
  // const setProduct = useMarketStore((state) => state.setProduct);
  const resetVendor = useMarketStore((state) => state.resetVendor);

  const selectedMarketType2 = useMarketStore((state) => state.selectedMarketType2);
  const setSelectedMarketType2 = useMarketStore((state) => state.setSelectedMarketType2);
  const showMarkets = useMarketStore((state) => state.showMarkets);
  const setShowMarkets = useMarketStore((state) => state.setShowMarkets);
  const handleSearchChange = useMarketStore((state) => state.handleSearchChange);

    // 💡 只有自己會用到的變數，直接宣告在這裡！
  const [productCategoryB, setProductCategoryB] = useState("");
  const [productCategoryM, setProductCategoryM] = useState("");
  const [selectSubProductCategory, setSelectSubProductCategory] = useState("");


// console.log("【除錯】VendorDetail 接收到的原始 products 陣列是:", products);
// console.log("【除錯】VendorDetail 接收到的 vendorInfo.today_image_url_old:", vendorInfo.today_image_url_old);
return (
    // <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden animate-fade-in">
    <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-md mb-[5vh]">     

      <div className="flex justify-between items-center mb-5">
        <div>
          <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded">網站位置：搜尋實體商品</span>
          {/* <h2 className="text-2xl font-bold text-slate-900 mt-1">{selectedMarketInfo?.name}</h2> */}
          {/* <h3 className="text-sm text-slate-500 mt-1.5 font-medium leading-relaxed">{selectedMarketInfo?.introduce || "暫無介紹"}</h3> */}
        </div>
        <Button variant="secondary" size="sm" onClick={() => resetVendor()}
          className="shrink-0 text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-slate-200 rounded-lg"> 
          ← 返回找攤販
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 block">🏘️ 切換市集</label>
        <div className="grid grid-cols-3 gap-2">
          <Select value={selectedMarketType2 || ""} 
                  onValueChange={(e) => {setSelectedMarketType2(e); setSelectedMarket(""); setProductCategoryB(""); setProductCategoryM(""); setSelectSubProductCategory("")
                    // console.log("【除錯】marketsObject是:", marketsObject);
                    const targets = marketsObject.flatMap(m => m.market_categories.category_name === e ? [m.mk_name]:[]);
                    // console.log("【除錯】targets是:", targets);
                    if (targets) { setShowMarkets(targets)} } }>
            <SelectTrigger><SelectValue placeholder="選擇地區..." /></SelectTrigger>
            <SelectContent position="popper" className="z-[9999]">
              {marketsType && marketsType.map((marketType2) => (
                <SelectItem key={marketType2} value={marketType2}>{marketType2}</SelectItem>))} 
            </SelectContent>
          </Select>

          <Select value={selectedMarketInfo?.name || ""} 
                  onValueChange={(e) => {setSelectedMarket(e); setProductCategoryB(""); setProductCategoryM(""); setSelectSubProductCategory("")
                      handleMarketChange(e,marketsInfo)}}> 
            <SelectTrigger><SelectValue placeholder="選擇市集" /></SelectTrigger>
            <SelectContent position="popper" className="z-[9999]">
              {showMarkets &&  showMarkets.map((market) => (
            <SelectItem key={market} value={market}> {market} </SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2 mt-2">
        <label className="text-sm font-bold text-slate-700 block">🦐 切換商品類別</label>
        <div className="grid grid-cols-3 gap-2">
          <Select value={productCategoryB?.category_id ? String(productCategoryB?.product_categories.category_name.replace(/攤$/, "")) : ""} 
                  onValueChange={(selectedId) => { 
                        const foundCat = productsType.find( (cat) => String(cat.category_id) === selectedId );
                        setProductCategoryB(foundCat || null); setProductCategoryM(""); setSelectSubProductCategory("")}}>
            <SelectTrigger><SelectValue placeholder="選擇大類" /></SelectTrigger>
            <SelectContent position="popper" className="z-[9999]">
              {productsType.map((cat) => (
                <SelectItem key={cat.category_id} value={String(cat.category_id)}>{cat.product_categories.category_name?.replace(/攤$/, "")}</SelectItem>))} 
            </SelectContent>
          </Select>

          <Select value={productCategoryM?.replace(/類$/, "")} 
                  onValueChange={(selectedGroupName) => { setProductCategoryM(selectedGroupName); setSelectSubProductCategory("")}}>
            <SelectTrigger><SelectValue placeholder="選擇中類" /></SelectTrigger>
            <SelectContent position="popper" className="z-[9999]">
              {productCategoryB &&   Array.from(new Set(productCategoryB?.product_categories?.product_subcategories.map((cat) => cat.group_name)))
                                          .map((groupName) => (
            <SelectItem key={groupName} value={String(groupName)}> {groupName?.replace(/類$/, "")} </SelectItem>))}
            </SelectContent>
          </Select>

          <Select value={selectSubProductCategory?.subcategory_id ? String(selectSubProductCategory.subcategory_name) : ""} 
                  disabled={!productCategoryM} onValueChange={(selectedSubId) => { 
                        const foundSubcat = productCategoryB?.product_categories?.product_subcategories?.find( (subcat) => String(subcat.subcategory_id) === selectedSubId );
                        setSelectSubProductCategory(foundSubcat || "")
                        if (foundSubcat?.subcategory_name !== "不指定 / 其他"){handleSearchChange(selectedMarket,String(productCategoryB?.product_categories?.category_name),productCategoryM,selectedSubId)}
                        if (foundSubcat?.subcategory_name === "不指定 / 其他"){handleSearchChange(selectedMarket,String(productCategoryB?.product_categories?.category_name),productCategoryM,null)}
                        }} >
            <SelectTrigger><SelectValue placeholder="選特定分類" /></SelectTrigger>
            <SelectContent position="popper" className="z-[9999]">
              {productCategoryB && productCategoryB?.product_categories?.product_subcategories.filter((subcat) => String(subcat.group_name) === productCategoryM)
              .map((subcat) => (
                <SelectItem key={subcat.subcategory_id} value={String(subcat.subcategory_id)}>{subcat.subcategory_name}</SelectItem>))} 
            </SelectContent>
          </Select>
        </div>
      </div>



      {/* 商品串列區塊 */}
      <div className="p-5">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            { selectedMarketType==='offline' && "🥬 今日商品與物價" }
            { selectedMarketType==='online'  && "❤️ 特色商品與價格"}
          <span className="text-xs font-normal text-slate-400">(排序尚未製作)</span>
        </h3>

        {(isLoading) && (<div className="text-center py-8 text-slate-500"> 正在從資料庫撈取資料...</div>)}
        <div className="space-y-3">
          {(!isLoading && (selectSubProductCategory && (!products || products.length === 0))) && (<div className="text-center py-8 text-slate-500">{selectedMarketInfo?.name}{<br/>}沒有{productCategoryM} {selectSubProductCategory.subcategory_name} 商品... </div>)}
          {products.map((product) => (
            <div key={product.id}   onClick={() => handleVendorChange(product.sellerUID)} 
                className="cursor-pointer flex border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:border-slate-200 transition-all bg-white">
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
                      賣家： {product.seller}
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

export default SearchPage;