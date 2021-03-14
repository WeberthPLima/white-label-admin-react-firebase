import { useEffect, useState } from 'react';

import { ReactComponent as Next } from '../../assets/next.svg';
import { ReactComponent as LoadingButton } from '../../assets/loading.svg';

import './style.scss';

interface Props {
  limit: number,
  data: any,
  dataquery: any,
  lastVisible: any,
  loading: (value: boolean) => void,
  setLastVisible: (value: boolean) => void,
  newValues: (value: any) => void
}

export default function Pagination(props: Props) {
  const [visible, setVisible] = useState<boolean>(false);
  const [activeNext, setactiveNext] = useState<boolean>(false);
  const [activePrev, setactivePrev] = useState<boolean>(false);

  useEffect(() => {
    if (!visible && props.data.length) {
      validNextPrev(props.lastVisible, props.data);
    }
    if(props.data.length){
      setVisible(true);
    }
  }, [props.data]);

  async function controlPage(type: string) {
    props.loading(true);
    setactiveNext(false);
    setactivePrev(false);
    let result: any;
    let Query = await props.dataquery.limit(props.limit);
    if (type === 'next') {
      result = await Query.startAfter(props.lastVisible).get();
    } else {
      result = await Query.endAt(props.lastVisible).get();
    }
    if (result?.docs?.length) {
      const registro: any = [];
      result.docs.forEach((element: any) => {
        const save = { id: element.id, ...element.data() }
        registro.push(save);
      });
      await validNextPrev(result.docs[result.docs.length - 1], registro);
    } else {
    }
  }

  async function validNextPrev(lastVisible: any, newRegistros: any) {
    const Query = await props.dataquery.limit(1);
    const consultNext = await Query.startAfter(lastVisible).get();
    const consultPrev: any = await Query.endAt(lastVisible).get();
    const validaPrev = consultPrev.docs[0].id;

    const activeNext = consultNext?.docs?.length ? true : false;
    const activePrev = validaPrev !== newRegistros[0].id ? true : false;

    props.setLastVisible(lastVisible);
    setactiveNext(activeNext);
    setactivePrev(activePrev);
    props.loading(false);
    props.newValues(newRegistros);
  }

  return (
    <>
      {!visible ? <div /> :
        <div className="pagination">
          <button
            onClick={() => controlPage('prev')}
            disabled={!activePrev}
            className="prev"
          >
            <Next />
          </button>
          <button
            onClick={() => controlPage('next')}
            disabled={!activeNext}
          >
            <Next />
          </button>
        </div>
      }
    </>
  );
}
