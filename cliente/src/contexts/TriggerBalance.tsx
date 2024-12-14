// BalanceTriggerContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface BalanceTriggerContextProps {
  triggerUpdate: () => void;
}

const BalanceTriggerContext = createContext<
  BalanceTriggerContextProps | undefined
>(undefined);

interface BalanceTriggerProviderProps {
  children: React.ReactNode;
}

export const BalanceTriggerProvider: React.FC<BalanceTriggerProviderProps> = ({
  children,
}) => {
  const setUpdateTrigger = useState(false)[1];

  const triggerUpdate = () => {
    setUpdateTrigger((prev) => !prev);
  };

  return (
    <BalanceTriggerContext.Provider value={{ triggerUpdate }}>
      {children}
    </BalanceTriggerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBalanceTrigger = () => {
  const context = useContext(BalanceTriggerContext);
  if (!context) {
    throw new Error(
      'useBalanceTrigger must be used within a BalanceTriggerProvider'
    );
  }
  return context;
};
