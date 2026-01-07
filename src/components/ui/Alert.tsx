
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertOptions {
  title: string;
  message: string;
  type?: AlertType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isConfirm?: boolean;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  showConfirm: (options: Omit<AlertOptions, 'isConfirm'>) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [activeAlert, setActiveAlert] = useState<AlertOptions | null>(null);

  const showAlert = (options: AlertOptions) => {
    setActiveAlert({ ...options, isConfirm: false });
  };

  const showConfirm = (options: Omit<AlertOptions, 'isConfirm'>) => {
    setActiveAlert({ ...options, isConfirm: true });
  };

  const closeAlert = () => {
    setActiveAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {activeAlert && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
            onClick={closeAlert}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-full ${
                  activeAlert.type === 'error' ? 'bg-red-50 text-red-600' :
                  activeAlert.type === 'success' ? 'bg-green-50 text-green-600' :
                  activeAlert.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                  'bg-indigo-50 text-indigo-600'
                }`}>
                  {activeAlert.type === 'error' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  ) : activeAlert.type === 'success' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-none">{activeAlert.title}</h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {activeAlert.message}
              </p>
              <div className="flex items-center justify-end gap-3">
                {activeAlert.isConfirm && (
                  <button
                    onClick={() => {
                        activeAlert.onCancel?.();
                        closeAlert();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {activeAlert.cancelText || 'Cancel'}
                  </button>
                )}
                <button
                  onClick={() => {
                    activeAlert.onConfirm?.();
                    closeAlert();
                  }}
                  className={`px-4 py-2 text-sm font-bold text-white rounded-lg shadow-sm transition-all active:scale-95 ${
                    activeAlert.type === 'error' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' :
                    'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                  }`}
                >
                  {activeAlert.confirmText || (activeAlert.isConfirm ? 'Confirm' : 'OK')}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlert must be used within an AlertProvider');
  return context;
}
