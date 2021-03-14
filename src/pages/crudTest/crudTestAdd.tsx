import { useEffect, useState } from 'react';
import './style.scss';

import { ReactComponent as LoadingButton } from '../../assets/loading.svg';
import { Firestore } from '../../services/firebase';

interface dadosForm {
  id?: string,
  email: string,
  password: string,
  phone: string,
  endereco: string,
  created?: Date,
}

const inicialForm = {
  email: '',
  password: '',
  phone: '',
  endereco: '',
}

export default function CrudTestAdd(props: any) {
  const [form, setForm] = useState<dadosForm>(inicialForm)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [msgError, setMsgError] = useState('');
  const [success, setSuccess] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState('');

  useEffect(() => {
    if(props.data?.id){
      const valores = {...props.data};
      delete valores.created;
      setForm(props.data);
    }
  },[])

  async function salvar(e: any) {
    e.preventDefault();
    setLoading(true);
    if (
      form.email === '' ||
      form.password === '' ||
      form.phone === '' ||
      form.endereco === ''
    ) {
      setError(true);
      setMsgError('Todos os campos são obrigatórios');
      setLoading(false);
      return false;
    }
    if(form.id){
      await Firestore.collection('crudTest').doc(form.id).update(form).then(response => {
        setSuccess(true);
        setForm(inicialForm);
        setMsgSuccess('Item foi editado com sucesso');
        props.refresh();
      }).catch(erro => {
        setError(true);
        setMsgError('Algo deu errado');
      });
    }else{
      form.created = new Date();
      await Firestore.collection('crudTest').add(form).then(response => {
        setSuccess(true);
        setError(false);
        setForm(inicialForm);
        setMsgSuccess('Item foi registrado com sucesso');
        props.refresh();
      }).catch(erro => {
        setError(true);
        setMsgError('Algo deu errado');
      });
    }
    
    setLoading(false);
  }

  return (
    <section className="page-crud">
      <div className="actions actions-right">
        <button onClick={() => props.back(false)}>Voltar</button>
      </div>
      <div className="card">
        <form action="" className="formGroup-Block-2" onSubmit={salvar}>
          <div className="formGroup">
            <label htmlFor="user">E-mail</label>
            <input
              type="text"
              value={form.email}
              onChange={(val) => setForm({ ...form, email: val.target.value })}
              className="user"
            />
          </div>
          <div className="formGroup formGroup-Block-2">
            <label htmlFor="user">Senha</label>
            <input
              type="password"
              value={form.password}
              onChange={(val) => setForm({ ...form, password: val.target.value })}
              className="user"
            />
          </div>
          <div className="formGroup formGroup-Block-2">
            <label htmlFor="user">Telefone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(val) => setForm({ ...form, phone: val.target.value })}
              className="user"
            />
          </div>
          <div className="formGroup formGroup-Block-2">
            <label htmlFor="user">Endereço</label>
            <input
              type="text"
              value={form.endereco}
              onChange={(val) => setForm({ ...form, endereco: val.target.value })}
              className="user"
            />
          </div>
          {error && <div className='msg-error'>{msgError}</div>}
          {success && !error && <div className='msg-success'>{msgSuccess}</div>}
          <div className="actions">
            {/* <button type="button" className="btn-invert" onClick={() => setStep(2)}>Cadastrar-se</button> */}
            <button type="submit">{loading ? <LoadingButton /> : form.id ? 'Editar': 'Adicionar'}</button>
          </div>
        </form>
      </div>
    </section>
  )
}
