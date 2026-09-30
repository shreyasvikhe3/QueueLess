import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const QueueContext = createContext(null);

export const QueueProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeToken, setActiveToken] = useState(null);
  const [loadingActiveToken, setLoadingActiveToken] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState(null);

  const fetchActiveToken = useCallback(async () => {
    if (!user) {
      setActiveToken(null);
      return;
    }

    try {
      const res = await api.get('/tokens/active');
      if (res.success) {
        const prevStatus = activeToken?.status;
        const newStatus = res.data?.status;

        if (prevStatus && prevStatus !== newStatus) {
          if (newStatus === 'CALLED' || newStatus === 'SERVING') {
            setNotificationMsg(`🔥 ALERT: Token ${res.data.tokenNumber} is NOW BEING SERVED at Counter ${res.data.counterNumber || 1}!`);
          } else if (newStatus === 'SKIPPED') {
            setNotificationMsg(`⚠️ Your token was marked SKIPPED. Please speak with staff for recall.`);
          }
        }

        setActiveToken(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch active token:', err);
    }
  }, [user, activeToken]);

  useEffect(() => {
    fetchActiveToken();
    const interval = setInterval(fetchActiveToken, 3000); // Live snapshot poll every 3s
    return () => clearInterval(interval);
  }, [fetchActiveToken]);

  const cancelActiveToken = async (tokenId) => {
    const res = await api.put(`/tokens/${tokenId}/cancel`);
    if (res.success) {
      await fetchActiveToken();
    }
    return res;
  };

  const checkInToken = async (tokenId) => {
    const res = await api.post(`/tokens/${tokenId}/checkin`);
    if (res.success) {
      await fetchActiveToken();
    }
    return res;
  };

  return (
    <QueueContext.Provider value={{
      activeToken,
      loadingActiveToken,
      fetchActiveToken,
      cancelActiveToken,
      checkInToken,
      notificationMsg,
      clearNotification: () => setNotificationMsg(null)
    }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => useContext(QueueContext);
