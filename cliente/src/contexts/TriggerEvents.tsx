// EventsTriggerContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface EventsTriggerContextProps {
  eventsTriggerUpdate: () => void;
}

const EventsTriggerContext = createContext<
  EventsTriggerContextProps | undefined
>(undefined);

interface EventsTriggerProviderProps {
  children: React.ReactNode;
}

export const EventsTriggerProvider: React.FC<EventsTriggerProviderProps> = ({
  children,
}) => {
  const setUpdateTrigger = useState(false)[1];

  const eventsTriggerUpdate = () => {
    setUpdateTrigger((prev) => !prev);
  };

  return (
    <EventsTriggerContext.Provider value={{ eventsTriggerUpdate }}>
      {children}
    </EventsTriggerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useEventsTrigger = () => {
  const context = useContext(EventsTriggerContext);
  if (!context) {
    throw new Error(
      'useEventsTrigger must be used within a EventsTriggerProvider'
    );
  }
  return context;
};
