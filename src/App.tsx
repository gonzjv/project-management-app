import Layout from './components/layout';
import WelcomePage from './pages/welcome-page';
import 'react-toastify/dist/ReactToastify.css';
import SigninPage from './pages/SigninPage';
import SignupPage from './pages/SignupPage';
import './styles/App.css';
import MainPage from './pages/main-page';
import BoardPage from './pages/board-page';
import EditProfile from './pages/editProfile';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { LOCALES } from './i18n/locales';
import { messages } from './i18n/messages';
import { getCookie } from './helpers/cookie';
import { useCookies } from 'react-cookie';

const App = () => {
  const locale = getCookie('lang') || LOCALES.ENGLISH;
  const [cookie, setCookie] = useCookies(['lang']);
  const handleChange = (e: { target: { value: string } }) => {
    setCookie('lang', e.target.value);
    console.log(cookie);
  };

  return (
    <IntlProvider
      messages={messages[locale]}
      locale={locale}
      defaultLocale={LOCALES.ENGLISH}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                handleChange={handleChange}
                currentLocale={cookie.lang}
              />
            }
          >
            <Route index element={<WelcomePage />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/board" element={<BoardPage />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </IntlProvider>
  );
};

export default App;
