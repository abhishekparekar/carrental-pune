import { createContext, useContext, useState, useEffect } from 'react';
import { subscribeToTenantSettings, updateTenantSettings, DEFAULT_TENANT_SETTINGS } from '../firebase/firestore';

const DEFAULT_TENANT_ID = 'nextrent-demo';

function deriveTenantId() {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  if (!hostname || hostname === 'localhost' || hostname.split('.').length <= 2) {
    return DEFAULT_TENANT_ID;
  }
  return hostname.split('.')[0];
}

const TenantContext = createContext({
  tenantId: DEFAULT_TENANT_ID,
  settings: DEFAULT_TENANT_SETTINGS,
  updateSettings: async () => {},
});

export function TenantProvider({ children, tenantId }) {
  const resolvedId = tenantId || deriveTenantId();
  const [settings, setSettings] = useState(DEFAULT_TENANT_SETTINGS);

  useEffect(() => {
    const unsub = subscribeToTenantSettings(resolvedId, (data) => {
      setSettings(data);
    });
    return () => unsub();
  }, [resolvedId]);

  const handleUpdateSettings = async (newSettings, adminUid) => {
    await updateTenantSettings(resolvedId, newSettings, adminUid);
  };

  return (
    <TenantContext.Provider value={{
      tenantId: resolvedId,
      settings,
      updateSettings: handleUpdateSettings,
    }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
