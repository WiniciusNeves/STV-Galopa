import React, { createContext, useContext, useMemo } from 'react';
import Toast from 'react-native-toast-message';
import CustomToast from '../components/toast/CustomToast';

const ToastContext = createContext();

interface ToastProviderProps {
  children: React.ReactNode;
}
interface ToastContextType {
  showToast: (type: string, text1: string, text2?: string) => void;
  hideToast: () => void;
}


export const ToastProvider = ({ children }) => {
  const toastConfig = useMemo(() => ({
    success: ({ text1, text2 }) => (
      <CustomToast
        text1={text1}
        text2={text2}
        backgroundColor="#006F45"
        borderColor="#002C1B"
      />
    ),
    error: ({ text1, text2 }) => (
      <CustomToast
        text1={text1}
        text2={text2}
        backgroundColor="#006F45"
        borderColor="#721c24"
      />
    ),
    warning: ({ text1, text2 }) => (
      <CustomToast
        text1={text1}
        text2={text2}
        backgroundColor="#006F45"
        borderColor="#856404"
      />
    ),
    info: ({ text1, text2 }) => (
      <CustomToast
        text1={text1}
        text2={text2}
        backgroundColor="#006F45"
        borderColor="#0c5460"
      />
    ),
  }), []);

  return (
    <ToastContext.Provider value={{ showToast: Toast.show, hideToast: Toast.hide }}>
      {children}
      <Toast config={toastConfig} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
