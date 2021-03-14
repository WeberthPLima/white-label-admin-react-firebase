import { useEffect, useState } from 'react';
import MaskLoading from '../../components/maskLoading';
import Pagination from '../../components/pagination/pagination';
import { Firestore } from '../../services/firebase';
import CrudTestAdd from './crudTestAdd';
import { confirmAlert } from 'react-confirm-alert';

import './style.scss';

interface dataCrud {
  id?: string,
  email?: string,
  endereco?: string,
  password?: string,
  phone?: string,
}
type valuesCrud = dataCrud[];

const limit = 6;
const dataquery = Firestore.collection('crudTest').orderBy('created', 'desc')

export default function CrudTest() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [data, setData] = useState<valuesCrud>([]);
  const [dataEdit, setDataEdit] = useState<valuesCrud>([]);
  const [lastVisible, setlastVisible] = useState<any>();

  useEffect(() => {
      setData([]);
      getData();
  }, []);

  async function getData() {
    setLoading(true);
    setError(false);
    const result =
      await dataquery
        .limit(limit)
        .get();

    if (result?.docs?.length) {
      const registro: valuesCrud = [];
      result.docs.forEach((element: any) => {
        const save = { id: element.id, ...element.data() }
        registro.push(save);
      });
      setlastVisible(result.docs[result.docs.length - 1]);
      setData(registro);
    } else {
      setError(true);
      setData([])
    }
    setLoading(false);
  }

  function confirmDelete(id: string){
    confirmAlert({
      title: 'Remover item',
      message: 'Tem certeza que deseja remover este item?',
      overlayClassName: "overlay-custom-danger",
      buttons: [
        {
          label: 'Sim',
          className: 'btn-danger',
          onClick: () => remove(id)
        },
        {
          label: 'Não',
          className: 'btn-primary',
          onClick: () => console.log('cancel')
        }
      ]
    });
  };

  async function remove(uid: string) {
    setLoading(true);
    Firestore.collection('crudTest').doc(uid).delete().then(() => {
      getData();
      confirmAlert({
        title: 'Item removido com sucesso',
        buttons: [{
            label: 'Ok',
            onClick: () => console.log('removido')
          }]
      });
    }).catch((error) => {
      confirmAlert({
        title: 'Erro ao remover item',
        buttons: [
          {
            label: 'Cancelar',
            onClick: () => console.log('removido')
          },
          {
            label: 'Tentar novamente',
            onClick: () => remove(uid)
          }
        ]
      });
    });
    setLoading(false);
  }

  function editOrADD(data: any, edit: boolean){
    setDataEdit(edit ? data : []);
    setShowAdd(true);
  }

  return (
    <section className="page-crud">
      {loading && <MaskLoading />}

      {!showAdd ?
        <>
          <div className="actions actions-right">
            <button onClick={() =>  editOrADD([], false)}>Adicionar</button>
          </div>
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>E-mail</th>
                  <th>Endereço</th>
                  <th>Senha</th>
                  <th>Telefone</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  !error ?
                    data.map((val: any) =>
                      <tr>
                        <td>{val.email}</td>
                        <td>{val.endereco}</td>
                        <td>{val.password}</td>
                        <td>{val.phone}</td>
                        <td width={100}>
                          <div  className='actions'>
                          <button className="edit" onClick={() => editOrADD(val, true)}>Editar</button>
                          <button className="danger" onClick={() => confirmDelete(val.id)}>Excluir</button>
                          </div>
                        </td>
                      </tr>
                    )
                    : <tr> <td colSpan={20}> <div className='msg-error'>Erro ao buscar registros</div> </td></tr>
                }
              </tbody>
            </table>

            <Pagination
              limit={limit}
              data={data}
              lastVisible={lastVisible}
              setLastVisible={(val) => setlastVisible(val)}
              dataquery={dataquery}
              newValues={(val) => setData(val)}
              loading={(val) => setLoading(val)}
            />
          </div>
        </>
        :
        <CrudTestAdd data={dataEdit} refresh={getData} back={(event: boolean) => setShowAdd(event)} />
      }
    </section>
  )
}
