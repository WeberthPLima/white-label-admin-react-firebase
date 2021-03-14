import { useContext, useEffect } from "react";
import { GlobalContext } from "../../../context/globalContext";
import Menu from "../menu/menu";
import './style.scss';

export default function Layout(props: any) {
  const context = useContext<any>(GlobalContext);

  useEffect(() => {
    if(props.data.showMenu){
      document.body.classList.add('showMenu');
    }else{
      document.body.classList.remove('showMenu');
    }
  },[props])

  return (
    <>
      <div className="mainHeader">
        <div className="logo">
          <h1>FullMobi</h1>
        </div>
        <div className="user">
          <span>Bem vindo(a): {context.user?.name} </span>
        </div>
      </div>
      {props.data.showMenu && <Menu />}
    </>
  );
}
