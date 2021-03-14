import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import MaskLoading from "./components/maskLoading";

import Layout from "./components/theme/layout/layout";

import { GlobalContext } from "./context/globalContext";
import CrudTest from "./pages/crudTest/crudTest";

import HomePage from "./pages/home/home";
import LoginPage from "./pages/login/login";
import { auth, Firestore } from "./services/firebase";

export default function Routes(props: any) {
  const [initializing, setInitializing] = useState(true);
  const context = useContext<any>(GlobalContext);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  async function onAuthStateChanged(user: any) {
    if (user && user.uid) {
      Firestore.collection('users')
        .doc(user.uid)
        .onSnapshot(async (snap) => {
          if (snap.exists) {
            const userAuth = await snap.data();
            if(userAuth?.profile && userAuth.profile === "admin"){
              context.setUser({ ...userAuth, id: snap.id });
            }else{
              context.onLogout();
            }
          }
          setInitializing(false);
        });
    } else if (initializing) {
      setInitializing(false);
    }
  }

  if (initializing) {
    return <MaskLoading />
  }

  if (!context.user) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <Switch>
        <CustomRoute showMenu exact path="/" component={() => <HomePage />} />
        <CustomRoute exact path="/login" singlePage component={() => <LoginPage />} />
        <CustomRoute exact showMenu path="/CrudTest" component={() => <CrudTest />} />
        <CustomRoute showMenu exact path="*" component={() => <div>Pagina não encontrada</div>} />
      </Switch>
    </BrowserRouter>
  );
};

const CustomRoute = ({ ...rest }) => {

  return (
    <>
      {!rest.singlePage && <Layout data={rest} />}
      <Route {...rest} />
    </>
  );
};