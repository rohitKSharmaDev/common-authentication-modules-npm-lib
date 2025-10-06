import React, { createContext, useContext, useMemo } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ config = {}, features = {}, authAdapter, children }) => {
  if (!authAdapter) {
    throw new Error("AuthProvider requires an authAdapter from the consuming app");
  }

  const value = useMemo(
    () => ({
      config,
      features,
      authAdapter
    }),
    [config, features, authAdapter]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Full context consumer
 */
export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside <AuthProvider>");
  return ctx;
};

export const useAuthAdapter = () => {
  return useAuthContext().authAdapter;
};

/**
 * Shortcut to state + actions together
 * Example usage inside library:
 *   const { isLoggedIn, user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const adapter = useAuthAdapter();

  const state = typeof adapter.useAuthState === "function"
    ? adapter.useAuthState()
    : { 
      token: null,
      sessionAgreementData: null,
    };

  const actions = typeof adapter.useAuthActions === "function"
    ? adapter.useAuthActions()
    : {
        onAuthSuccess: () => {},
        logout: async () => {},
      };

  return { ...state, ...actions };
};
