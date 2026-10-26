import { supabase } from './supabaseClient'; // 確保路徑與你的 supabaseClient 一致

/**
 * 專門負責去 Supabase 撈取市場清單的非同步函式
 * @returns {Promise<Array>} 回傳市場資料陣列
 */
export async function fetchMarketsFromDB(marketType) {
  try {    // 核心語法：從 'markets' 資料表撈取所有欄位(*)
    const { data, error } = await supabase
      .from('markets')
    //   .select('*');
      .select('name,mk_type2,introduce,shop_types,map_address') // 只撈取 'name' 欄位
      .eq('mk_type',marketType)
      .order('name', { ascending: false }); // 按照 name 欄位排序

    if (error) {
      throw error;
    }

    // 🌟 成功拿到資料，直接把陣列回傳出去給主檔案用
    return data; 
  } catch (error) {
    console.error('撈取市場資料失敗:', error.message);
    // 如果出錯，回傳空陣列，避免前端程式崩潰
    return []; 
  }
}


/**
 * 根據所選的市場名稱，去 Supabase 撈取該市場限定的攤販清單
 * @param {string} marketName - 被選中的市場名字 (例如: "2C電商")
 * @returns {Promise<Array>} 該市場的攤販陣列
 */
export async function fetchVendorsByMarketFromDB(marketName) {
  if (!marketName) return []; // 安全檢查：如果沒傳市場名字，直接回傳空陣列

//改UID加這行，為了效能應該要在改善DB結構
      const  dataa  = await supabase
      .from('markets') 
      .select('mkuid')
      .eq('name', marketName) 
      .single()

  try {
    const { data, error } = await supabase
      .from('shops')          // 🌟 1. 改找 vendors 資料表
      .select('*')
      .eq('mkuid', dataa.data.mkuid)
      // .eq('mk_name', marketName) // 🌟 2. 核心：篩選出 market_name 欄位「等於」傳進來的市場名字的資料
      // .order('vid', { ascending: true }); // 假設攤販有自己的 id 叫 vid

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`撈取 ${marketName} 的攤販資料失敗:`, error.message);
    return [];
  }
}


export async function fetchVendorInfoFromDB(vendorUID){
    if (!vendorUID) return [];
    try{
      const { data, error } = await supabase
      .from('shops') 
      .select('*')
      // .eq('name', vendorName) 
      .eq('spuid', vendorUID) 

    if (error) throw error;
    return data;
  } catch (error){
          console.error(`撈取 ${vendorUID} 店家資訊失敗:`, error.message);
    return [];
  }
}

export async function fetchOffLineProductsByVendorFromDB(vendorUID){
    if (!vendorUID) return [];
    try{
      const { data, error } = await supabase
      .from('off_line_products')          // 🌟 1. 改找 vendors 資料表
      .select('*')
      // .eq('sp_name', vendorName) // 🌟 2. 核心：篩選出 market_name 欄位「等於」傳進來的市場名字的資料
      .eq('spuid', vendorUID) // 
      .eq('have_stock', true)
      .eq('is_active', true)

    if (error) throw error;
    return data;
  } catch (error){
          console.error(`撈取 ${vendorUID} 的商品資料失敗:`, error.message);
    return [];
  }
}


export async function fetchVendorUIDFromDB(vendorName){
    if (!vendorName) return [];
    try{
      const { data, error } = await supabase
      .from('shops') 
      .select('spuid')
      .eq('name', vendorName) 
      .single()

    if (error) throw error;
    return data;
  } catch (error){
          console.error(`撈取 ${vendorName} 店家的UID資訊失敗:`, error.message);
    return [];
  }

}