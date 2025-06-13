import React, { createContext, useContext, ReactNode } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Notifications } from '@/components/Notifications';


const NotificationContext = createContext<ReturnType<typeof useNotifications> | null>(null);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const notifications = useNotifications();

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
      <Notifications 
        notifications={notifications.notifications} 
        onRemove={notifications.removeNotification} 
      />
    </NotificationContext.Provider>
  );
};

