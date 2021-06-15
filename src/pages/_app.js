import { Provider } from 'react-redux';
import NextNprogress from 'nextjs-progressbar';
import { store } from '../app/store';
import '../styles/globals.css';
import { Provider as AuthProvider } from 'next-auth/client';
import Layout from '../components/Layout';

const MyApp = ({ Component, pageProps }) => {
  return (
    <AuthProvider session={pageProps.session}>
      <Provider store={store}>
        <NextNprogress color='#B40404' />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </AuthProvider>
  );
};

export default MyApp;
