import { createContext, useContext } from 'react';

// Multi-tenant context — tenantId scopes all Firestore queries
// In production, derive from subdomain: window.location.hostname.split('.')[0]
// For demo, default to 'nextrent-demo'

const DEFAULT_TENANT_ID = 'nextrent-demo';

function deriveTenantId() {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  // If running on localhost or the main domain, use default
  if (!hostname || hostname === 'localhost' || hostname.split('.').length <= 2) {
    return DEFAULT_TENANT_ID;
  }
  // Otherwise use subdomain as tenant ID
  return hostname.split('.')[0];
}

const TenantContext = createContext({ tenantId: DEFAULT_TENANT_ID });

export function TenantProvider({ children, tenantId }) {
  const resolvedId = tenantId || deriveTenantId();
  return (
    <TenantContext.Provider value={{ tenantId: resolvedId }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
