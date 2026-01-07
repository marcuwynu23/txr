
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  eventTitle: string;
}

export default function PaymentModal({ isOpen, onClose, onSuccess, amount, eventTitle }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
        <div className="p-1 bg-indigo-600"></div>
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Secure Checkout</h3>
              <p className="text-sm text-gray-500 mt-1">{eventTitle}</p>
            </div>
            <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
              ${amount.toFixed(2)}
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ticket Type</span>
                <span className="font-medium text-gray-900 font-mono">General Admission</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Quantity</span>
                <span className="font-medium text-gray-900">1x</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-indigo-600">${amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Card Details (Mock)</label>
              <div className="p-4 border border-gray-200 rounded-xl flex items-center gap-3 bg-white shadow-sm">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="flex-1 text-sm font-medium text-gray-700">•••• •••• •••• 4242</div>
                <div className="text-xs text-gray-400">12/26</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                isProcessing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
              }`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                `Pay $${amount.toFixed(2)}`
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-full py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
            >
              Cancel Payment
            </button>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.9L9.032 1.567a2 2 0 011.936 0L17.834 4.9A2 2 0 0119 6.684V11a8 8 0 01-5 7.41l-4 1.59a1 1 0 01-.74 0l-4-1.59A8 8 0 011 11V6.684a2 2 0 011.166-1.784zM10 3a1 1 0 00-.447.106L3.106 6.306a1 1 0 00-.106.141V11a6 6 0 003.75 5.558L10 17.838l3.25-1.28A6 6 0 0017 11V6.447a1 1 0 00-.106-.141L10.447 3.106A1 1 0 0010 3z" clipRule="evenodd" />
          </svg>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">SSL Secured Mock Payment</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
