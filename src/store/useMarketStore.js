import { create } from 'zustand'
import {  fetchMarketsFromDB2, fetchVendorInfoFromDB, fetchVendorsByMarketFromDB, fetchProductsTypeByMarketFromDB, fetchOffLineProductsByVendorFromDB, fetchProductsBySearch, fetchProductsBySearchNoSubID, fetchReviewsTagCount } from '../components/db/MarketList'; 

// 輔助小工具：讀取目前網址上的 ?seller=xxx
const getParamsFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
 return {
    vendorId: params.get('vendor') || null,   // 讀取 ?vendor=...
    marketType: params.get('market') || null,   // 讀取 &market=...
    // marketId: params.get('market') || null,   // 讀取 &market=...
    // tab: params.get('tab') || 'products',     // 讀取 &tab=...（可給預設值）
  };
};


// export const useMarketStore = create((set, get) => ({
  export const useMarketStore = create((set, get) => {
    // 檢查剛進網站時，網址是否已經帶有 ?seller=xxx
  const { vendorId, marketType } = getParamsFromUrl();
  
  return {
  // #region       💰 1. 這裡放所有的全域變數 (State)
  // page:  'Welcome',
  page: vendorId ? 'VendorDetail' : 'Welcome',
  selectedMarketType: vendorId ? marketType : "",

  selectedMarket: "",
  // selectedMarket: vendorId ? marketId : "",
  selectedMarketInfo:{
    uid:"",
    name:"",
    introduce:"",
    vendors: [],//目前是前端運算，看是否要改成DB直接給
    url:"",
  },
  selectedVendor: "",
  selectedVendorUID:  vendorId ? vendorId : "",
  selectedVendorInfo:{
      name: "",
      introduce:  "",
      owner: "",
      poc: "",
      phone: "",
      line: "",
      updatedAt: "", 
      isUpdatedToday: false , 
      rating: 0,
      reviewCount: 0,
      uid: "",
  },
  selectedProduct: "",
  selectedMarketType2:"",
  showMarkets:[],

  // 💰 DB資料池//底下是否要清空這些質，待思考
  marketsObject:{},
  marketsType:  [],
  markets:      [],
  marketsInfo:  {},
  vendors:      [], 
  productsType: [],
  products:     [],
  isLoading: false,
  // #endregion

  // 🛠️ 2. 底下放所有修改變數的功能 (Actions)
  // setPage: (nextPage) => set({ page: nextPage }),
     setPage: (newPage) => {
      const url = new URL(window.location.href);
      // 如果不是去詳細頁，就把網址上的 ?seller=xxx 清掉
      if (newPage !== 'VendorDetail') {
        url.searchParams.delete('vendor');
        url.searchParams.delete('market');
        window.history.pushState({}, '', url);
      }
      set({ page: newPage });
    },
  setMarketType:(selectType) => set({ selectedMarketType: selectType}),
  setVendor:(userSelectVendor) => set({selectedVendor: userSelectVendor}),
  setVendorUID:(userSelectVendorUID) => set({selectedVendorUID: userSelectVendorUID}),
  setProduct:(userSelectProduct) => set({selectedProduct: userSelectProduct}),
  setSelectedMarketType2:(userSelected) => set({selectedMarketType2: userSelected}),
  setSelectedMarket:(userSelected) => set({selectedMarket: userSelected}),
  setShowMarkets:(userSelected) => set({showMarkets: userSelected}),
//   setShowMarkets: (newMarkets) => {
//   console.log("誰改了 showMarkets:", newMarkets);
//   console.trace(); // 這行會直接在瀏覽器 Console 告訴你是哪一行程式碼呼叫它的！
//   set({ showMarkets: newMarkets });
// },
  // handleMarketChange: (marketName) => set({
  //   selectedMarket: marketName,
  //   page: "FilterPage",
  //   selectedVendor: "",
  //   selectedProduct: "",
  // }),  // DB功能 B：使用者點擊市場時觸發
  handleMarketChange: async (marketUID,marketsInfo) => {
    // if (marketsInfo===null){}

    const marketInfo = {
      uid:      marketsInfo[marketUID]?.uid,
      name:       marketsInfo[marketUID]?.name,
      introduce:  marketsInfo[marketUID]?.introduce,
      url:        marketsInfo[marketUID]?.url,
      // vendors:    marketsInfo[marketName].vendors,
      // vendorUIDs: marketsInfo[marketName].vendorUIDs,
    };
    
    set({ 
    selectedMarket: marketUID, 
    selectedMarketInfo:marketInfo,
    selectedVendor: "",
    selectedProduct: "",
    // page: "FilterPage",
    isLoading: true,
    });

    console.log("選定的市集資料：", marketInfo);
    // ➔ 順便直接去 DB 撈出這個市場專屬的攤販清單！
    console.log("當前查詢的市集名稱為:", JSON.stringify(marketInfo.name));
    const dbVendorsData = await fetchVendorsByMarketFromDB(marketsInfo[marketUID]?.uid, marketUID); // 傳入剛剛選的市場名字
    console.log("抓攤販資料，資料庫回傳的原始資料是：", dbVendorsData);
    const dbProductsTypeData = await fetchProductsTypeByMarketFromDB(marketsInfo[marketUID]?.uid, marketUID);
console.log("抓商品資料，資料庫回傳的原始資料是：", dbProductsTypeData);
    // ==========================================
    // 🌟 核心處理：將 Supabase 的扁平陣列，整理成 UI 需要的分類資料
    // ==========================================
    // 1. 改成用陣列來存分類： [ { id: "虛擬", name: "虛擬", shops: ["測試攤販(賣寶可夢)"] } ]
    const vendorsArray = [];
    dbVendorsData.forEach(vendor => {
      const catName = vendor.product_categories.category_name || "未分類";
  
      // 檢查這個分類是不是已經加進陣列了
      let existingCat = vendorsArray.find(c => c.name === catName); 
      if (!existingCat) {
        existingCat = { id: catName, name: catName, vendors: [] };
        vendorsArray.push(existingCat);}
      if (!existingCat.vendors.includes(vendor.sp_name)) { existingCat.vendors.push({
      uid: vendor.spuid,   // 這裡請確認你的欄位名稱是 uid 還是 id
      name: vendor.sp_name
      });                 }});

    set({ 
      productsType:dbProductsTypeData,
      vendors: vendorsArray, // 把整理好的資料塞進金庫
      isLoading: false 
    });
  },

  // handleVendorChange:() => set({
  //   page: "VendorDetail",
  //   selectedProduct: "",
  // }),
  handleVendorChange: async (vendorUID) => {
          // 更新網址列，不重新整理網頁
      const url = new URL(window.location.href);
      url.searchParams.set('vendor', vendorUID);
      url.searchParams.set('market', get().selectedMarketType);
      window.history.pushState({}, '', url);
    
    
    set({ 
    selectedProduct: "",
    page: "VendorDetail",
    isLoading: true,
    });
    
    // const UIDData = await fetchVendorUIDFromDB(vendorName);

    // ➔ 順便直接去 DB 撈出這個市場專屬的攤販清單！
    // console.log("當前查詢的商店為:", JSON.stringify(UIDData.spuid));
    // const dbProductsData = await fetchOffLineProductsByVendorFromDB(vendorName); // 傳入剛剛選的市場名字
    const [dbVendorInfoData, dbProductsData, dbReviewsTagCount] = await Promise.all([
      fetchVendorInfoFromDB(vendorUID),
      fetchOffLineProductsByVendorFromDB(vendorUID),
      fetchReviewsTagCount(vendorUID)
    ]);
    console.log("資料庫回傳的店家資訊原始資料是：", dbVendorInfoData);
    console.log("資料庫回傳的所有商品原始資料是：", dbProductsData);
    console.log("資料庫回傳的TagCount是：", dbReviewsTagCount);

    if (!dbVendorInfoData || dbVendorInfoData.length === 0) {
      //dbProductsData 還是會被顯示出來
      console.error(`找不到 ${vendorUID} 的攤販資訊`);
      set({ products: [],
        isLoading: false });
      return;
    }

    // 2.定義合法的 LINE 網址格式
    const lineUrlPattern = /^https:\/\/(lin\.ee|line\.me)\/.+/;
    // // 1. 取得今天的日期（並將時分秒設為 0，只保留日期）
    //   const today = new Date();
    //   today.setHours(0, 0, 0, 0);
    // // 2. 將資料庫的更新時間轉為 Date 物件，同樣將時分秒設為 0
    //   const updatedDate = new Date(dbVendorInfoData[0].updatedAt);
    //   updatedDate.setHours(0, 0, 0, 0);
    // 1. 取得今天的台灣日期字串 (格式: "2026-10-12")
    // const todayString = new Date().toLocaleDateString('zh-TW', {
    //   year: 'numeric',
    //   month: '2-digit',
    //   day: '2-digit'
    // }).replace(/\//g, '-'); 

    // // 2. 將資料庫的 UTC 時間，轉換為台灣當地的日期字串 (格式: "2026-10-13" 依此類推)
    // const updatedDateString = new Date(dbVendorInfoData.updatedAt).toLocaleDateString('zh-TW', {
    //   year: 'numeric',
    //   month: '2-digit',
    //   day: '2-digit'
    // }).replace(/\//g, '-');
    // 1. 取得今天 UTC 時間的 YYYY-MM-DD (例如 "2026-10-12")
    const todayUTCString = new Date().toISOString().split('T')[0];

    // 2. 直接用 slice(0, 10) 擷取資料庫字串的前 10 個字
    // 確保 dbVendorInfoData.updatedAt 存在才執行，避免報錯
    const dbDateString =  (dbVendorInfoData[0] && dbVendorInfoData[0].updated_at) ?
      dbVendorInfoData[0].updated_at.slice(0, 10):undefined;

    //評分 計算方式
      const originalScore = (dbVendorInfoData[0] && dbVendorInfoData[0].score_good) ?
       (dbVendorInfoData[0].score_good / dbVendorInfoData[0].score_total):undefined;
    // 定義分數界線（必須由大到小排）
      const thresholds = [
        { limit: 0.8,  score: 5 },
        { limit: 0.7,  score: 4 },
        { limit: 0.55, score: 3 },
        { limit: 0.3,  score: 2 },
        { limit: 0.01, score: 1 }
      ];
    // 尋找第一個符合分數大於臨界值的項目，找不到就給 0
      const matched = thresholds.find(t => originalScore > t.limit);
      const rate = matched ? matched.score : 0;

    const vendorInfoObject = {
      name: dbVendorInfoData[0].name || "沒有名子",
      introduce:  dbVendorInfoData[0].sp_introduce || "沒有介紹",
      // owner: dbVendorInfoData[0].owner || "沒有擁有者資訊",
      poc: dbVendorInfoData[0].poc || dbVendorInfoData[0].owner || "沒有聯絡人資訊",
      phone: dbVendorInfoData[0].phone || "沒有連絡電話",
      other: dbVendorInfoData[0].other || "沒有資訊",
      open_time: dbVendorInfoData[0].open_time || "沒有營業時間",
      updatedAt: dbVendorInfoData[0].updated_at?.slice(0, 10) +" "+ dbVendorInfoData[0].updated_at?.slice(11, 19)   || "沒有更新時間", // 模擬今天日期
      // isUpdatedToday: (updatedDate.getTime() === today.getTime()) , // 3. 進行比較，相同即為 true，不同則為 false
      isUpdatedToday: dbDateString === todayUTCString,
      line: dbVendorInfoData[0].line || "沒有Line資訊",
      isLineValid: dbVendorInfoData[0].line && dbVendorInfoData[0].line.trim() !== "" && lineUrlPattern.test(dbVendorInfoData[0].line),
      rating: rate || "計算、畫面待調整",
      reviewCount: dbVendorInfoData[0].reviewCount || "未做",
      today_image_url_old: dbVendorInfoData[0].today_image_url_old || "https://unsplash.com",
      tagCount: dbReviewsTagCount
    };
    set({selectedVendorInfo:vendorInfoObject});

console.log('今天 UTC 日期:', todayUTCString);
console.log('DB轉換資料:', dbDateString);
    // ==========================================
    // 🌟 核心處理：將 Supabase 的扁平陣列，整理成 UI 需要的分類資料
    // ==========================================
//  { id: 3, name: "網室溫室番茄", price: 90, unit: "斤", note: "微酸帶甜", quality: 4.2, likes: 18, dislikes: 4, image: "https://unsplash.com" },
    const productsArray = [];
    dbProductsData.forEach(product => {
      const productUID = product.pduid || "沒UID";
      const productType = product.subcategory_id || "未分類";
      const productName = product.pd_name || "沒名稱";
      const productPrice = product.price_origin || "沒價格";
      const productUnit = product.unit || "沒單位";
      const productNote = product.pd_introduce || "沒介紹";
      const productSeller = product.sellers.sp_name || "沒店家名稱";
      const productSellerUID = product.sellers.spuid || "沒店家UID";
      const productQuality = (product.score_good/product.score_totalXXX) || "會拿掉或修改";
      const productLikes = product.score_good || "沒讚數";
      const productDislikes = (product.score_total-product.score_good) || "要拿掉";
      const productImage = product.image_url || "沒照片";

      let thisProduct = { id:productUID, name:productName, price:productPrice, unit:productUnit, note:productNote, quality:productQuality, likes:productLikes, dislikes:productDislikes, image:productImage, seller:productSeller, sellerUID:productSellerUID, subtype:productType,}
      productsArray.push(thisProduct);});

    set({ 
      products: productsArray, // 把整理好的資料塞進金庫
      isLoading: false 
    });
  },

  resetMarket: () => set({
    page: "Welcome",
    selectedMarketType:"",
    marketsObject:{},
    marketsType:  [],
    markets:      [],
    showMarkets:  [],
    marketsInfo:  {},//sellected
    vendors:      [],
    productsType: [], 
    products:     [],

    selectedMarket: "",
    selectedMarketInfo:{
      name:"",
      introduce:"",
      vendors: [],},
    selectedVendor: "",
    selectedVendorUID: "",
    selectedVendorInfo:{
      name: "",
      introduce:  "",
      owner: "",
      poc: "",
      phone: "",
      line: "",
      updatedAt: "", 
      isUpdatedToday: false , 
      rating: 0,
      reviewCount: 0,
      uid: "",},
    selectedProduct: "",
    selectedMarketType2:"",
  }),



  resetVendor: () => set({
    page: "FilterPage",
    selectedVendor: "",
    selectedVendorInfo:{
      name: "",
      introduce:  "",
      owner: "",
      poc: "",
      phone: "",
      updatedAt: "", 
      isUpdatedToday: false , 
      rating: 0,
      reviewCount: 0,
    },
    selectedProduct: "",
  }),



  
  resetVendor: () => {  // 2. 使用 set((state) => ...) 讀取目前的市場狀態，決定返回哪一頁
  set((state) => ({
    // 💡 貼心判斷：如果使用者是從「列表」點進來的（有 selectedMarket），就退回 FilterPage；
    // 如果是朋友「直接點分享連結」空降進來的（沒有選過市場），就退回 Welcome 首頁！
    page: state.selectedMarket ? 'FilterPage' : 'Welcome',
    
    selectedVendor: '',
    selectedVendorUID: '', // 如果你有存 UID 記得也一併清空
    selectedVendorInfo: {
      name: '',
      introduce: '',
      owner: '',
      poc: '',
      phone: '',
      updatedAt: '',
      isUpdatedToday: false,
      rating: 0,
      reviewCount: 0,
    },
    selectedProduct: '',
  }));
},

  //   // DB功能 A：一打開網頁，去撈所有市場清單(尚未做錯誤處理)(正規化，沒BUG就可以刪了)
  // loadAllMarkets: async (marketType) => {
  //   set({ isLoading: true });
  //   const dbMarketData = await fetchMarketsFromDB(marketType); // 👈 await 等待號碼牌震動，拿到真實資料
  //   console.log("初始化市集資料，原始資料是：", dbMarketData);

  //     // 🌟 核心轉換：因為 Supabase 撈出來是物件陣列 (如 [{mkid:1, name:"南門市場"}, ...])
  //     // 必須轉換成你原本 UI 需要的「純字串陣列」 (如 ["南門市場", "士林市場"])
  //   const marketObjects = dbMarketData;
  //   const marketNames = dbMarketData.map(market => market.name); 
  //   const marketsTypeSet = [...new Set(dbMarketData.map(market => market.mk_type2))]; 
  //   set({ marketsObject: marketObjects, marketsType: marketsTypeSet, markets: marketNames, isLoading: false });

  //   const marketsInfoObject = {};// 核心改動：直接用市場名稱當 Key 塞進物件裡
  //   dbMarketData.forEach(info =>{
  //     const marketName = info.name  || "沒市集名稱";
  //     const marketIntroduce = info.introduce  || "沒市集介紹";
  //     const marketShopTypes = info.shop_types  || "沒預設子項目陣列";
  //     const marketURL = info.map_address  || "沒地圖url";
  //     // 2. 核心改動：直接用市場名稱當 Key 塞進物件裡
  //     marketsInfoObject[marketName] = { name:marketName, introduce:marketIntroduce, vendors:marketShopTypes, url:marketURL};
  //   })
  //   set({ marketsInfo: marketsInfoObject });
  // },


    handleSearchChange: async (selectedMarketUID,B,M,S) => {set({ 
    selectedProduct: "",//這個變數從來沒用到?
    isLoading: true,
    });
console.log(" selectedMarketUID:", selectedMarketUID);
    var dbProductsData;
    if (S !== null){  const [ dbProductsData1] = await Promise.all([
      fetchProductsBySearch(selectedMarketUID,B,M,S)
    ]);  dbProductsData = dbProductsData1}
    if (S === null){  const [ dbProductsData2] = await Promise.all([
      fetchProductsBySearchNoSubID(selectedMarketUID,B,M)
    ]);  dbProductsData = dbProductsData2}


    console.log("資料庫回傳的所有商品原始資料是：", dbProductsData);
    if ( dbProductsData?.length === 0) {
      console.error(`搜尋資訊為零`);
      set({ products: [],
        isLoading: false });
      return;
    }
    // ==========================================
    // 🌟 核心處理：將 Supabase 的扁平陣列，整理成 UI 需要的分類資料
    // ==========================================
//  { id: 3, name: "網室溫室番茄", price: 90, unit: "斤", note: "微酸帶甜", quality: 4.2, likes: 18, dislikes: 4, image: "https://unsplash.com" },
    const productsArray = [];
    dbProductsData?.forEach(product => {
      const productType = product.pd_type || "未分類";//正規化後可以加進來，以後搜尋用
      const productName = product.pd_name || "沒名稱";
      const productPrice = product.price_origin || "沒價格";
      const productUnit = product.unit || "沒單位";
      const productNote = product.pd_introduce || "沒介紹";
      const productSeller = product.sellers.sp_name || "沒店家名稱";
      const productSellerUID = product.sellers.spuid || "沒店家UID";
      const productQuality = (product.score_good/product.score_totalXXX) || "這欄位會拿掉或修改";
      const productLikes = product.score_good || "沒讚數";
      const productDislikes = (product.score_total-product.score_good) || "要拿掉";
      const productImage = product.image_url || "沒照片";

      let thisProduct = { id:productName, name:productName, price:productPrice, unit:productUnit, note:productNote, quality:productQuality, likes:productLikes, dislikes:productDislikes, image:productImage, seller:productSeller, sellerUID:productSellerUID}
      productsArray.push(thisProduct);});

    set({ 
      products: productsArray, // 把整理好的資料塞進金庫
      isLoading: false 
    });
  },


    // 資料庫正規化，重構 (好像不需要改這裡)
  loadAllMarketsByType: async (marketType) => {
    set({ isLoading: true });
    const dbMarketData = await fetchMarketsFromDB2(marketType); // 👈 await 等待號碼牌震動，拿到真實資料
    console.log("正規化市集資料，原始資料是：", dbMarketData);

      // 🌟 核心轉換：因為 Supabase 撈出來是物件陣列 (如 [{mkid:1, name:"南門市場"}, ...])
      // 必須轉換成你原本 UI 需要的「純字串陣列」 (如 ["南門市場", "士林市場"])
    const marketObjects = dbMarketData;
    const marketNames = dbMarketData.map(market => market.mk_name); 
    const marketsTypeSet = [...new Set(dbMarketData.map(market => market.market_categories.category_name))]; 
    set({ marketsObject: marketObjects, marketsType: marketsTypeSet, markets: marketNames, isLoading: false });

    const marketsInfoObject = {};// 核心改動：直接用市場名稱當 Key 塞進物件裡
    dbMarketData.forEach(info =>{
      const marketUID = info.mkuid  || "沒市集UID";
      const marketName = info.mk_name  || "沒市集名稱";
      const marketIntroduce = info.mk_introduce  || "沒市集介紹";
      const marketShopTypes = info.shop_types  || "沒子項目陣列";
      const marketURL = info.map_address  || "";//拿掉字串沒地圖
      // 2. 核心改動：直接用市場名稱當 Key 塞進物件裡
      console.log("正規化DEBUG，原始資料 marketShopTypes是：", info.shop_types  || "沒子項目陣列");
      marketsInfoObject[marketUID] = { name:marketName, introduce:marketIntroduce, vendors:marketShopTypes, url:marketURL  , uid:marketUID
      };  })
    set({ marketsInfo: marketsInfoObject });
  },

// }))

}})