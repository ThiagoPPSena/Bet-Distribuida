import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define o tipo para o contexto
interface AccountContextType {
  account: string;
  setAccount: React.Dispatch<React.SetStateAction<string>>;
}

// Cria o contexto com valor inicial como `undefined`
const AccountContext = createContext<AccountContextType | undefined>(undefined);

// Provedor do contexto
export const AccountProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [account, setAccount] = useState<string>('');

  return (
    <AccountContext.Provider value={{ account, setAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

// Hook para usar o contexto de conta
// eslint-disable-next-line react-refresh/only-export-components
export const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount deve ser usado dentro de um AccountProvider');
  }
  return context;
};
