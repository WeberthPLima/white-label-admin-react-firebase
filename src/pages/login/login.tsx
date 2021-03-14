import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/globalContext";
import './style.scss';

import { useHistory } from "react-router-dom";
import { auth } from "../../services/firebase";
import { ReactComponent as LoadingButton } from '../../assets/loading.svg';

interface dadosUser {
  email: string,
  password: string,
}

const inicialForm = {
  email: '',
  password: '',
}

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<dadosUser>(inicialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [msgError, setMsgError] = useState('');

  const context = useContext<any>(GlobalContext);
  const history = useHistory();

  useEffect(() => {
    if (context.user && context.user.name) {
      history.push('/');
    }
  }, [context.user, history]);
  
  useEffect(() => {
    setError(false);
    setMsgError('');
    setForm(inicialForm);
  }, [step]);

  function logar(e: any) {
    e.preventDefault();
    e.preventDefault();
    setLoading(true);
    setError(false);
    if (form.email === '') {
      setError(true);
      setMsgError('Digite o seu e-mail');
      setLoading(false);
      return false;
    }
    if (form.password === '') {
      setError(true);
      setMsgError('Digite sua senha');
      setLoading(false);
      return false;
    }
    auth()
      .signInWithEmailAndPassword(form?.email, form?.password)
      .then(() => {
        setTimeout(() => {
          setError(true);
          setLoading(false);
          setMsgError('Não foi possível efetuar login, verifique seu usuário ou senha!');
        }, 1000);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
        setMsgError('Não foi possível efetuar login, verifique seu usuário ou senha!');
      });
  }

  function register(e: any) {
    e.preventDefault();
  }

  function showMsgError(){
    if(error){
      return <div className='msg-error'>{msgError}</div>;
    }
  }

  return (
    <div className="page-login">
      <div className="apresentation">
        <div className="description">
          <h1>Painel Administrativo</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium fugit molestiae reiciendis reprehenderit totam enim.</p>
        </div>
      </div>
      <div className="formLogin">
        {step === 1 &&
          <div className="boxLogin">
            <h2>Faça login para começar</h2>
            <form onSubmit={logar}>
              <div className="formGroup">
                <label htmlFor="user">Usuário</label>
                <input
                  type="text"
                  value={form.email}
                  onChange={(val) => setForm({ ...form, email: val.target.value })}
                  className="user"
                />
              </div>
              <div className="formGroup">
                <label htmlFor="user">Senha</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(val) => setForm({ ...form, password: val.target.value })}
                  className="pass"
                />
              </div>
              {showMsgError()}
              <div className="actions">
                {/* <button type="button" className="btn-invert" onClick={() => setStep(2)}>Cadastrar-se</button> */}
                <button type="submit">{loading ? <LoadingButton /> : 'Entrar'}</button>
              </div>
            </form>
          </div>
        }

        {step === 2 &&
          <div className="boxLogin">
            <h2>Cadastre-se</h2>
            <form onSubmit={register}>
              <div className="formGroup">
                <label htmlFor="user">Usuário</label>
                <input type="text" className="user" />
              </div>
              <div className="formGroup">
                <label htmlFor="user">Senha</label>
                <input type="text" className="pass" />
              </div>
              {showMsgError()}
              <div className="actions">
                <button type="button" className="btn-invert" onClick={() => setStep(1)}>Já tenho conta</button>
                <button>{loading ? <LoadingButton /> : 'Cadastrar'}</button>
              </div>
            </form>
          </div>
        }
      </div>
    </div>
  );
}
