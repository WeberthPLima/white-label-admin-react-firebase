import { GlobalProvider } from "./context/globalContext";
import Routes from "./routes";
import 'react-confirm-alert/src/react-confirm-alert.css';
import './style.scss'

const App = () => (
  <GlobalProvider>
    <Routes />
  </GlobalProvider>
);
export default App;