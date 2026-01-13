import React, { createContext, useContext } from 'react';
import { useSnackbar } from 'notistack';

const NotificationContext = createContext({});

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showNotification = (message, variant = 'info', options = {}) => {
    enqueueSnackbar(message, {
      variant,
      autoHideDuration: 3000,
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      ...options,
    });
  };

  const showSuccess = (message, options = {}) => 
    showNotification(message, 'success', options);
  
  const showError = (message, options = {}) => 
    showNotification(message, 'error', options);
  
  const showWarning = (message, options = {}) => 
    showNotification(message, 'warning', options);
  
  const showInfo = (message, options = {}) => 
    showNotification(message, 'info', options);

  const value = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeSnackbar
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};