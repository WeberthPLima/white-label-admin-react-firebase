import { NavLink } from "react-router-dom";
import './style.scss';

export default function Menu() {
  return (
    <div className="mainMenu">
      <ul>
        <li>
          <NavLink activeClassName="active" exact to="/" >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" exact to="/CrudTest" >
            CrudTest
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" exact to="/contato" >
            Contato
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
