import React, { createContext, useContext, useMemo } from 'react';
import Toast, { BaseToast, ErrorToast, SuccessToast, InfoToast, WarningToast } from 'react-native-toast-message';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const toastConfig = useMemo(() => ({
    success: (props) => <SuccessToast {...props} />,
    error: (props) => <ErrorToast {...props} />,
    info: (props) => <InfoToast {...props} />,
    warning: (props) => <WarningToast {...props} />,
  }), []);

  return (
    <ToastContext.Provider value={{ show: Toast.show, hide: Toast.hide }}>
      {children}
      <Toast config={toastConfig} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};

