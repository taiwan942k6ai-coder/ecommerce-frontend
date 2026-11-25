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
  const selectedVendorUID = useMarketStore((state) => state.selectedVendorUID);//不確定會不會用到
  // const selectedProduct = useMarketStore((state) => state.selectedProduct);
  // const markets = useMarketStore((state) => state.markets);

  const productsType = useMarketStore(state => state.productsType);
  const vendors = useMarketStore(state => state.vendors);
  const isLoading = useMarketStore(state => state.isLoading);
  const setPage = useMarketStore((state) => state.setPage);
  const setVendor = useMarketStore((state) => state.setVendor);
  const setVendorUID = useMarketStore((state) => state.setVendorUID);
  const setProduct = useMarketStore((state) => state.setProduct);
  const resetMarket = useMarketStore((state) => state.resetMarket);
  const handleVendorChange = useMarketStore((state) => state.handleVendorChange);
  const handleSearchChange = useMarketStore((state) => state.handleSearchChange);

  console.log("【除錯】FilterPage 接收到的原始 productData 陣列是:", productData);
  console.log("【除錯】FilterPage 接收到的原始 productsType 陣列是:", productsType);


  // 💡 只有自己會用到的變數，直接宣告在這裡！
  const [vendorCategory, setVendorCategory] = useState("");
  const [productCategoryB, setProductCategoryB] = useState("");
  const [productCategoryM, setProductCategoryM] = useState("");
  const [selectSubProductCategory, setSelectSubProductCategory] = useState("");

  const handleSelectVendorChange = (value) => {
  if (!value) {  setVendor("");  setVendorUID("");  return;}
  setVendor(value.name);
  setVendorUID(value.uid); 
  //有些UI不知原VALUE是物件，需要根據選到的 value 找出對應的 UID// const found = vendorList.find(item => item.name === value); // setVendorUID(found?.uid);
};

// const handleSelectVendorChange = (selectedUid) => {
//   setVendorUID(selectedUid);//   // 1. 先存下 UID（讓 Select 元件能正確比對並顯示目前選中的項目）
//   const currentCat = vendors?.find((c) => c.name === vendorCategory);//   // 2. 從目前分類的 vendors 陣列中，用 uid 找出完整的攤販物件
//   const targetVendor = currentCat?.vendors?.find((v) => String(v.uid) === selectedUid);
//   if (targetVendor) {//   // 3. 如果有找到，就把「名稱」也存起來
//     setVendor(targetVendor.name); // 這裡存名稱（若你的 state 叫 setVendor 請自行替換）
//   }
// };

  console.log("【除錯】FilterPage 接收到的原始 vendors 陣列是:", vendors);
  if (isLoading) return <div>🛒 正在從資料庫撈取<br /> 【{selectedMarketInfo?.name}】 的攤商資料ing...</div>;
  
  if (selectedMarketType==='offline') return (
    <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-md mb-[5vh]">      
      <div className="flex justify-between items-center mb-5">
        <div>
          <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded">網站位置：實體市集</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{selectedMarketInfo?.name}</h2>
          <h3 className="text-sm text-slate-500 mt-1.5 font-medium leading-relaxed">
                                          {selectedMarketInfo?.introduce || "暫無介紹"}</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { resetMarket(); }}> {/* 💡 要改成回上一頁*/}
          返回首頁
        </Button>
      </div>

      {/* 中間的地圖與下拉選單 HTML 保持不變 ... */}
            <div className="w-full h-44 bg-slate-100 rounded-xl overflow-hidden mb-6 border border-slate-200 flex items-center justify-center relative">
              {/* <img src="https://unsplash.com" alt="市場地圖" className="w-full h-full object-cover opacity-70" /> */}
              {selectedMarketInfo?.url?.trim() ? (
              <iframe src={selectedMarketInfo.url.trim()}  className="w-full h-[300px] sm:h-[450px] rounded-xl border-0"
                      allowFullScreen  loading="lazy"  referrerPolicy="strict-origin-when-cross-origin"/>) : (
              <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-[#f6efe8]">
                <img  src="https://yxshqhkjfkljnnhwgbod.supabase.co/storage/v1/object/public/shop-images/NoMarketImage.jpg"
                      alt="此市集地圖尚未建立"  className="w-full h-auto object-cover"/></div>)}
              {/* <iframe src={selectedMarketInfo.url || "https://yxshqhkjfkljnnhwgbod.supabase.co/storage/v1/object/public/shop-images/NoMarketImage.jpg"} width="600" height="450" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="strict-origin-when-cross-origin"></iframe>   */}
              {/* <img src={selectedMarketInfo.url} alt="市場地圖" className="w-full h-full object-cover opacity-70" /> */}
              {/* <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4 "></div> */}
              <div className="absolute inset-0 bg-black/1 flex items-end justify-center pb- p-4 pointer-events-none">
                <span className="bg-white/95 text-slate-800 px-4 py-2 rounded-xl text-sm font-semibold shadow">
                  🗺️ 「{selectedMarketInfo?.name}」地圖位置
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">🔍 找攤販</label>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={vendorCategory} onValueChange={(val) => { setVendorCategory(val); setVendor(""); setVendorUID("");}}>
                    <SelectTrigger><SelectValue placeholder=" (如:蔬菜攤)" /></SelectTrigger>
                    <SelectContent position="popper" className="z-[9999]"> {/* 🌟 加上 popper 防阻擋 */}
                      {/* 🌟 改用純陣列去 map */}
                      {vendors.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>))} 
                    </SelectContent>
                  </Select>
                  {/* 右邊的標籤，難呀!!! */}
                  <Select value={selectedVendor} onValueChange={handleSelectVendorChange} disabled={!vendorCategory}>
                    <SelectTrigger><SelectValue placeholder="選擇指定攤販" /></SelectTrigger>
                    <SelectContent position="popper" className="z-">
                      {vendorCategory && vendors?.find((c) => c.name === vendorCategory)
                        ?.vendors?.map((v) => (<SelectItem key={v.uid} value={v}> {v.name} </SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                className="w-full mt-0 bg-slate-900 hover:bg-slate-800 text-white py-6 text-base rounded-xl font-medium shadow-md"
                disabled={(!vendors || !selectedVendor)}
                onClick={() => handleVendorChange(selectedVendorUID)} >
                🚀 進入攤販頁面
              </Button>
              </div>


              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">🍎 找商品</label>
                <div className="grid grid-cols-3 gap-2">
                  <Select value={productCategoryB?.category_id ? String(productCategoryB?.product_categories.category_name.replace(/攤$/, "")) : ""} 
                          onValueChange={(selectedId) => { //foundCat ||null
                                const foundCat = productsType.find( (cat) => String(cat.category_id) === selectedId );
                                setProductCategoryB(foundCat || ""); setProductCategoryM(""); setSelectSubProductCategory(""); setVendor(""); setVendorUID("");}}>
                    <SelectTrigger className="col-span-1  w-full"><SelectValue placeholder="選擇大類" /></SelectTrigger>
                    <SelectContent position="popper" className="z-[9999]">
                      {productsType.map((cat) => (
                        <SelectItem key={cat.category_id} value={String(cat.category_id)}>{cat.product_categories.category_name?.replace(/攤$/, "")}</SelectItem>))} 
                    </SelectContent>
                  </Select>

                  <Select value={productCategoryM ?? ""} 
                          onValueChange={(selectedGroupName) => { setProductCategoryM(selectedGroupName); setSelectSubProductCategory(""); setVendor(""); setVendorUID("");}}>
                    <SelectTrigger className="col-span-1  w-full"><SelectValue placeholder="選擇中類" /></SelectTrigger>
                    <SelectContent position="popper" className="z-[9999]">
                      {productCategoryB &&   Array.from(new Set(productCategoryB?.product_categories?.product_subcategories.map((cat) => cat.group_name)))
                                                  .map((groupName) => (
                    <SelectItem key={groupName} value={String(groupName)}> {groupName} </SelectItem>))}
                    </SelectContent>
                  </Select>

                  <Select value={selectSubProductCategory?.subcategory_id ? String(selectSubProductCategory?.subcategory_name) : ""} 
                          onValueChange={(selectedSubId) => { 
                                const foundSubcat = productCategoryB?.product_categories?.product_subcategories?.find( (subcat) => String(subcat.subcategory_id) === selectedSubId );
                                setSelectSubProductCategory(foundSubcat || null)}} disabled={!productCategoryM}>
                    <SelectTrigger className="col-span-1  w-full"><SelectValue placeholder="選特定分類" /></SelectTrigger>
                    <SelectContent position="popper" className="z-[9999]">
                      {productCategoryB && productCategoryB?.product_categories?.product_subcategories.filter((subcat) => String(subcat.group_name) === productCategoryM)
                      .map((subcat) => (
                        <SelectItem key={subcat.subcategory_id} value={String(subcat.subcategory_id)}>{subcat.subcategory_name}</SelectItem>))} 
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                className="w-full mt-0 bg-slate-900 hover:bg-slate-800 text-white py-6 text-base rounded-xl font-medium shadow-md"
                disabled={ (!productCategoryB || !productCategoryM)}    onClick={()=>{
                        if (selectSubProductCategory?.subcategory_name !== "不指定 / 其他"){handleSearchChange(selectedMarket,String(productCategoryB?.product_categories?.category_name),productCategoryM,selectSubProductCategory.subcategory_id)}
                        if (selectSubProductCategory?.subcategory_name === "不指定 / 其他"){handleSearchChange(selectedMarket,String(productCategoryB?.product_categories?.category_name),productCategoryM,null)}
                  
                        if(!selectSubProductCategory.subcategory_id){ console.log("【除錯】不是NULL是?", selectSubProductCategory.subcategory_id);
                    handleSearchChange(selectedMarket,String(productCategoryB?.product_categories.category_name),productCategoryM,null)}
                  setPage("SearchPage")}} >
                🚀 查詢 (還沒做完)
                </Button>
              </div>
            </div>
            

                              {/* <Select value={productCategory} onValueChange={(val) => { setProductCategory(val); setProduct(""); }}>
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
                  </Select> */}

    </div>
  );




    if (selectedMarketType==='online') return (
    <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-md mb-[20vh]">      
      <div className="flex justify-between items-center mb-5">
        <div>
          <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded">網站位置：線上電商</span>

          <h2 className="text-2xl font-bold text-slate-900 mt-1">{selectedMarketInfo?.name}</h2>
          <h3 className="text-sm text-slate-500 mt-1.5 font-medium leading-relaxed">
                                          {selectedMarketInfo?.introduce || "暫無介紹"}</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { resetMarket(); }}> {/* 💡 要改成回上一頁*/}
          返回首頁
        </Button>
      </div>

        <div className="w-full h-44 bg-slate-100 rounded-xl overflow-hidden mb-6 border border-slate-200 flex items-center justify-center relative">
          <img src={selectedMarketInfo.url} alt={"電商產業類別_"+selectedMarketInfo.name+"_形像照"} className="w-full h-full object-cover opacity-70" />
          {/* <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4"></div> */}
        </div>

      <div className="grid grid-cols-1 gap-3 w-full">
        {vendors[0]?.vendors.map((vendor) => (
          <Button 
            key={vendor.uid} 
            variant="outline" 
            className="py-6 text-base font-medium shadow-sm hover:bg-slate-100 justify-between px-6"
            onClick={() => {handleVendorChange(vendor.uid);setVendor(vendor.name)}}
          >
            <span>{vendor.name}</span>
            <span className="text-slate-400">→</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

export default FilterPage;