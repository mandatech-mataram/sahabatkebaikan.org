import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from 'components/Header';
import Layout from 'components/Layout';
import DonationList from 'modules/kebaikanku/donation-list/screen';
import React from 'react';
// import { validateToken } from 'services/auth.service';

const KebaikankuPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    if (localStorage.getItem('token') && localStorage.getItem('data_login')) {
      // handleValidateToken();
      const data_login = JSON.parse(localStorage.getItem('data_login'));
      setUser(data_login.user);
    } else {
      router.push('/login?redirect=/kebaikanku');
    }
  }, []);

  return (
    <>
      <Layout menu={0} withBottomNav header={<Header title="Kebaikanku" />}>
        <DonationList user={user} />
      </Layout>
    </>
  );
};

export default KebaikankuPage;
