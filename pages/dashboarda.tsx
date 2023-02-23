/* eslint-disable no-lonely-if */
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  Button,
  Center,
  Container,
  Group,
  Loader,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { GetUser } from '../lib/funs/user';
import AdvocateDashboard from '../components/dashboardA/main';
import { AdvoDashboardProvider } from '../lib/advocate/context/advo.dashboard.context';

const DashboardA: NextPage = () => {
  const Router = useRouter();

  const [LoggedIn, setLoggedIn] = useState<any>(null);
  const [Intern, setIntern] = useState(false);

  const CheckUser = async () => {
    const Session = await GetUser();

    if (Session) {
      if (Session.status === 'NOTVERIFIED') {
        Router.replace('/otp');
      } else {
        // check session.id startign with 'LDC'
        if (Session.role === 'CLIENT') {
          Router.replace('/dashboardc');
        } else {
          if (Session.intern) {
            setIntern(true);
          }
          setLoggedIn(Session);
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
        Intern ? (
          <Container mt="xl" size="xs">
            <Group grow>
              <Stack spacing="sm">
                <Title>Intern Dashboard</Title>
                <TextInput label="Email" value={LoggedIn.email} readOnly />
                <TextInput
                  label="Phone number"
                  value={LoggedIn.phone}
                  readOnly
                  icon={<Text size="sm">+91</Text>}
                />
                <TextInput label="Name" value={LoggedIn.name} />

                <TextInput label="State" value={LoggedIn.state} />

                <TextInput label="District" value={LoggedIn.city} />
                <NumberInput
                  hideControls
                  label="Pincode"
                  value={LoggedIn.pincode}
                />

                <Button
                  onClick={() => {
                    fetch('/api/auth/logout');
                    Router.push('/');
                  }}
                  color="red"
                >
                  Logout
                </Button>
              </Stack>
            </Group>
          </Container>
        ) : (
          <AdvoDashboardProvider>
            <AdvocateDashboard />
          </AdvoDashboardProvider>
        )
      ) : (
        <Center style={{ height: '100vh' }}>
          <Loader color="yellow" />
        </Center>
      )}
    </>
  );
};

export default DashboardA;
