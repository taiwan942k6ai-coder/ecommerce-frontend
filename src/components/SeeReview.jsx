import React, { useState, useEffect } from 'react';
import { supabase } from './db/supabaseClient'; // 確保路徑與你的 supabaseClient 一致
import { useMarketStore } from '../store/useMarketStore'; 

export default function GiveReview({ isOpen, onClose, venderName}) {
    // console.log('目前抽屜狀態：', isOpen);
  const selectedVendorUID = useMarketStore((state) => state.selectedVendorUID);
  const selectedVendor = useMarketStore((state) => state.selectedVendor);
  // 表單狀態管理
  const [tags, setTags] = useState([]);     // 2. 攤位標籤 (複選)
  const [comment, setComment] = useState(''); // 4. 一句話補充
  const [reviews, setReviews] = useState([]); // 4. 一句話補充

  useEffect(() => {
    if (!selectedVendorUID) return;

    const loadReviews  = async () => { 
        const result = await getReviews(selectedVendorUID); 
        console.log("【除錯】 result:", result)
        setReviews(result || []);};
    loadReviews();

    },[selectedVendorUID])


  async function getReviews(UID){
    try {   //console.log("UID:",UID);
    const { data,error } = await supabase
        .from('pd_reviews')
        .select('*,pduid!inner(pd_name,image_url,spuid)')
        .eq('pduid.spuid', UID)
        .eq('is_visible',true).eq('is_active',true)
      if (error) throw error
      console.log('查看評論成功：');
      return data;
  } catch (error) {
    console.error('查看評論失敗:', error.message);
    return []; }
  }

// 1. 放在元件外面的 Tag 英文欄位對應中文名稱（可依你的實際名稱修改）
const REVIEW_TAG_MAP = {
  tag1: '🥬 新鮮、高品質',
  tag2: '💰 便宜、公道',
  tag3: '🤝 老闆阿莎力～',
  tag4: '🏃 推薦必買！',
  tag5: '🧅 賣相不佳',
  tag6: '⚠️ 價格偏高',
  tag7: '⚠️ 有話要說！',
};



  const handleSubmit = () => {
    // saveReview();
    // 送出後清空表單並關閉抽屜
    setTags([]);setComment('');onClose();
  };



  return (
    <>  {/* 黑色背景遮罩（點擊可關閉） */}
      <div onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${  isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      /> {/* 底部抽屜本體 */}
        <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-5 transition-transform duration-300 ease-out max-h-[85vh] overflow-y-auto ${
                    isOpen ? 'translate-y-0' : 'translate-y-full'
                  }`}>{/* 頂部小橫槓 */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3" />

            <div className="text-xl font-bold text-center text-gray-800">
                  {venderName}　近期評論
            </div>



                  <div className="w-full space-y-3 mt-4">
                      {reviews && reviews.length > 0 ? (
                        reviews.filter((item) => item.comment && item.comment.trim() !== '').map((item) => {
                          // 篩選出這則評論有勾選（為 true）的標籤
                          const activeTags = Object.keys(REVIEW_TAG_MAP).filter((key) => item[key] === true);

                          // 格式化時間（例如：2026/11/23）
                          const dateStr = new Date(item.created_at).toLocaleDateString('zh-TW', {
                            year: 'numeric', month: '2-digit', day: '2-digit' });

                          return (
                            <div key={item.rwuid} className="flex gap-2 p-2 pb-0 pr-0 bg-white border border-gray-100 rounded-xl shadow-xs space-y-0" >
                                  <div className=" flex-1">
                                    {/* 上排：匿名買家名稱 + 評論日期 */}
                                    <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
                                      <span className="font-medium text-gray-600">
                                        {item.user_uid ? '認證顧客' : '熱心顧客'}
                                      </span>
                                      <span>{dateStr}</span>
                                      <span>對 {item.pduid.pd_name} 的評論：</span>
                                    </div>

                                    {/* 中排：這則評論勾選的 Tag 標籤（有勾選才顯示） */}
                                    {activeTags.length > 0 && (
                                      <div className="flex flex-wrap gap-1.5">
                                        {activeTags.map((tagKey) => (
                                          <span
                                            key={tagKey}
                                            className="px-2 py-0.5 text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/70 rounded-full"
                                          >
                                            {REVIEW_TAG_MAP[tagKey]}
                                          </span>
                                        ))}
                                      </div>
                                    )}

                                    {/* 下排：文字留言內容（若使用者只點標籤沒打字，顯示預設文字或隱藏） */}
                                    {item.comment ? (
                                      <p className="mt-1 mb-0 pb-0 leading-snug text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                        {item.comment.trim()}
                                      </p> ) : ( <p className="mt-2 text-xs text-gray-400 italic">（此顧客僅給予標籤評價）</p> )}
                                  </div>
                                  <div className="  w-20 h-20 flex-shrink-0 bg-slate-100">
                                    <img src={item.pduid.image_url} alt={item.pduid.pd_name} className="w-full h-full object-cover" />
                                  </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-sm text-gray-400">
                          目前尚無任何顧客評論
                        </div>
                      )}
            
                  </div>

                            
              
        </div>
    </>
  );
}