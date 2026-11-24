import React, { useState } from 'react';

export default function SeeReview({ isOpen, onClose, children }) {
  return (
    <>
      {/* 黑色背景遮罩（點擊可關閉） */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* 底部抽屜本體 */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-5 transition-transform duration-300 ease-out max-h-[85vh] overflow-y-auto ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
        {children}
      </div>
    </>
  );
}