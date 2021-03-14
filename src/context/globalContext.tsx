import React, { useState, FunctionComponent } from 'react';
import { auth } from '../services/firebase';

export interface dataUser {
  email: string;
  password: string;
  token?: string;
}

export interface LayoutProps {
  user: any;
  setUser: (value: any) => void;
  onLogout: () => void;
  onLogin: (value: dataUser) => void
}

export const GlobalContext = React.createContext({} as LayoutProps);

function useProvideLayout(): LayoutProps {
  const [user, setUser] = useState<any>();

  function onLogout() {
    auth()
      .signOut()
      .then(() => {
        setUser(null);
        document.body.classList.remove('showMenu');
      })
      .catch(() => {
        alert('Ops... Houve um erro ao tentar fazer logout, tente novamente!');
      });
  }

  function onLogin(valueUser: dataUser) {
    setUser(valueUser);
  }
  return {
    user,
    setUser,
    onLogout,
    onLogin,
  };
}

export const GlobalProvider: FunctionComponent = ({ children }) => {
  const layout: LayoutProps = useProvideLayout();
  return <GlobalContext.Provider value={layout}>{children}</GlobalContext.Provider>;
};