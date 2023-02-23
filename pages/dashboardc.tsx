/* eslint-disable no-lonely-if */
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Center, Loader } from '@mantine/core';
import ClientDashboard from '../components/dashboardc/main';
import { GetUser } from '../lib/funs/user';
import { ClientDashboardProvider } from '../lib/client/context/client.dashboard.context';

const DashboardC: NextPage = () => {
  const Router = useRouter();

  const [LoggedIn, setLoggedIn] = useState(false);

  const CheckUser = async () => {
    const Session = await GetUser();

    if (Session) {
      if (Session.status === 'NOTVERIFIED') {
        Router.replace('/otp');
      } else {
        // check session.id startign with 'LDC'
        if (Session.role === 'ADVOCATE') {
          Router.replace('/dashboarda');
        } else {
          setLoggedIn(true);
        }
      }
    } else {
      Router.replace('/login');
    }
  };

  useEffect(() => {
    CheckUser();
  }, []);

  return (
    <>
      {LoggedIn ? (
        <ClientDashboardProvider>
          <ClientDashboard />
        </ClientDashboardProvider>
      ) : (
        <Center style={{ height: '100vh' }}>
          <Loader color="yellow" />
        </Center>
      )}
    </>
  );
};

export default DashboardC;
