import { useContext } from "react";
import { GlobalContext } from "../../context/globalContext";
import './style.scss';

export default function HomePage() {
  const context = useContext<any>(GlobalContext)

  return (
    <section className="page-home">
        <div className="card">
          <div className="actions">
            <button onClick={() => context.onLogout()} >Sair</button>
          </div>
        </div>
    </section>
  )
}
