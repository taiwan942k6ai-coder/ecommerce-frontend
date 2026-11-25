import React, { useState } from 'react';
import { supabase } from './db/supabaseClient'; // 確保路徑與你的 supabaseClient 一致
import { useMarketStore } from '../store/useMarketStore'; 

export default function GiveReview({ isOpen, onClose, selectedProduct }) {
    // console.log('目前抽屜狀態：', isOpen);
  const handleVendorChange = useMarketStore((state) => state.handleVendorChange);
  const selectedVendorUID = useMarketStore((state) => state.selectedVendorUID);
  // 表單狀態管理
  const [status, setStatus] = useState(''); // 1. 今日戰況 (單選)
  const [tags, setTags] = useState([]);     // 2. 攤位標籤 (複選)
  const [recommended, setRecommended] = useState([]); // 3. 推薦必買 (複選)
  const [comment, setComment] = useState(''); // 4. 一句話補充


  const statusOptions = [
    { id: 'plenty', label: '🟢 貨還很多' },
    { id: 'low', label: '🟡 快賣完了' },
    { id: 'closed', label: '🔴 今天沒開' },
  ];

  const tagOptions = [
    {id:1, label:'🥬 新鮮、高品質'}, {id:2, label:'💰 便宜、公道'},
    {id:3, label:'🤝 老闆阿莎力～'}, {id:4, label:'🏃 推薦必買！'},
    {id:5, label:'🧅 賣相不佳'}, {id:6, label:'⚠️ 價格偏高'},
    {id:7, label:'⚠️ 有話要說！'},
    // '🥬 新鮮、高品質', '💰 便宜、公道', '🤝 老闆阿莎力', 
    // '🧅 賣相不佳', '⚠️ 價格偏高', '🏃 推薦必買'
  ];

 // 至少要選一個標籤，或是有輸入文字才能送出
  const canSubmit = (tags.length > 0 || comment.trim().length > 0) && tags.length < 3;

  // 切換複選陣列（改用 id 判斷，最不會出錯）
  const toggleSelection = (id) => {
    setTags((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    // const payload = {
    //   storeName,
    //   uid,
    //   productId: selectedProduct?.pdid,
    //   productName: selectedProduct?.name,
    //   tags,      // 例如: [1, 4]
    //   comment,
    // };
    // console.log('送出商品評價給後端：', payload);

    // 這裡接你的 API 送出資料...
    saveReview();
    // 送出後清空表單並關閉抽屜
    setTags([]);setComment('');onClose();
  };


async function saveReview () {
  try {    // 核心語法：從 'markets' 資料表撈取所有欄位(*)
    // console.log(selectedProduct);
    const { error } = await supabase
        .from('pd_reviews')
        .insert([{ pduid:selectedProduct.id, comment: comment, tag1: tags.includes(1), tag2: tags.includes(2), 
            tag3: tags.includes(3), tag4: tags.includes(4), tag5: tags.includes(5), tag6: tags.includes(6), tag7: tags.includes(7) }])
      if (error) throw error
      console.log('評論送出成功：');
      handleVendorChange(selectedVendorUID)
  } catch (error) {
    console.error('評論送出失敗:', error.message);
    return []; 
  }
}


  return (
    <>  {/* 黑色背景遮罩（點擊可關閉） */}
      <div onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${  isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      /> {/* 底部抽屜本體 */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-5 transition-transform duration-300 ease-out max-h-[85vh] overflow-y-auto ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}>
        
                {/* 頂部小橫槓 */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3" />

        <div className="text-xl font-bold text-center text-gray-800">
              你覺得「{selectedProduct?.name}」怎樣？
        </div>
                   
        <div > {/* （複選） */}
            <p className="text-sm font-bold text-gray-700 mb-2">　評論標籤　（最多選兩項）</p>
            <div className="flex flex-wrap gap-2">
            {tagOptions.map((tag) => {
                const isSelected = tags.includes(tag.id);
                const isWarning = tag.id >= 5;
                const activeStyle = isWarning
                ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold'
                : 'border-green-600 bg-green-50 text-green-700 font-bold';

                return ( <button  key={tag.id}  type="button"
                    onClick={() => toggleSelection(tag.id)}
                    className={`py-2 px-3.5 rounded-full border text-sm transition ${
                    isSelected  ? activeStyle   : 'border-gray-200 text-gray-600'
                    }`}>  {tag.label} </button>);})}
            </div>
        </div>

        <div>  <input  type="text"  value={comment}
            onChange={(e) => setComment(e.target.value)}
            // placeholder="留一句話給其他買菜族（選填，如：高麗菜很甜）"
            placeholder={ tags.includes(7)
                ? '請告訴大家你想說什麼（必填或補充說明）...'
                : '留一句話給其他買菜族（選填，如：高麗菜很甜）'
            }
            className="w-full mt-4 p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-orange-500"/>
        </div>

        <button  type="button"  disabled={!canSubmit}
            onClick={handleSubmit}
            className="w-full py-3.5 my-4 rounded-xl bg-orange-500 text-white font-bold text-base shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed">
            {(tags.length > 2)? "選超過 2個標籤" : "送出反饋（+10 積分）"}
        </button>
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3" />
      </div>
    </>
  );
}