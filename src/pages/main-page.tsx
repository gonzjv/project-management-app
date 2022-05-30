import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import BoardContainer from '../components/main-route/boardContainer';
import Spinner from '../components/Spinner';
import { getBoards } from '../store/boards/boardsSlice';
import {
  AppState,
  useAppDispatch,
  useAppSelector,
} from '../store/store';

const MainPage = () => {
  const { loading } = useAppSelector(
    (state: AppState) => state.boards
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [cookie] = useCookies(['user']);

  useEffect(() => {
    cookie.user === undefined && navigate('/');
    if (cookie.user) {
      dispatch(getBoards());
    }
  }, [cookie.user, navigate, dispatch]);

  return (
    <main className="min-h-[65vh] items-center text-gray-300 justify-start flex flex-col gap-5 relative">
      <h1 className="text-3xl  ">
        <FormattedMessage id="titleBoardPage" />
      </h1>
      {loading ? <Spinner /> : <BoardContainer />}
    </main>
  );
};

export default MainPage;
