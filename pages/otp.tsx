/* eslint-disable no-lonely-if */
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import {
  Button,
  Center,
  Container,
  Loader,
  Paper,
  PasswordInput,
  SimpleGrid,
  Space,
  Text,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { GetUser } from '../lib/funs/user';
import DefaultHeader from '../components/main/header';

const OTPPage: NextPage = () => {
  const Router = useRouter();

  const [LoggedOut, setLoggedOut] = useState(false);
  const [PriLoading, setPriLoading] = useState(false);

  const CheckUser = async () => {
    const Session = await GetUser();

    if (Session) {
      if (Session.status === 'NOTVERIFIED') {
        setLoggedOut(true);
      } else {
        // check session.id startign with 'LDC'
        if (Session.role === 'CLIENT') {
          Router.replace('/dashboardc');
        } else {
          Router.replace('/dashboarda');
        }
      }
    } else {
      Router.replace('/login');
    }
  };

  useEffect(() => {
    CheckUser();
  }, []);

  const ResendCode = async () => {
    setPriLoading(true);
    const resendCodeRes = await fetch('/api/auth/register/newcode');

    const resendCodeData = await resendCodeRes.json();

    // if statusCode is 200, alert success
    if (resendCodeData.statusCode === 200) {
      showNotification({
        title: 'Success',
        message: resendCodeData.message,
      });
    } else {
      showNotification({
        title: 'Error',
        message: resendCodeData.message,
      });
    }
    setPriLoading(false);
  };

  const HandleSubmit = async (otp: string) => {
    const verifyRes = await fetch('/api/auth/register/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: parseInt(otp, 10) }),
    });

    const verifyData = await verifyRes.json();

    // if statusCode is 200, redirect to /dashboard
    if (verifyData.statusCode === 200) {
      Router.push('/dashboardc');
    } else {
      showNotification({
        title: 'Error',
        message: verifyData.message,
      });
    }
  };

  const OtpForm = useForm({
    validateInputOnChange: true,

    initialValues: {
      otp: '',
    },
  });

  return (
    <>
      {LoggedOut ? (
        <>
          <DefaultHeader />

          <Container
            style={{
              height: '70vh',
            }}
          >
            <Paper
              style={{
                maxWidth: '400px',
                minWidth: '300px',
                flexGrow: 1,
              }}
              mx="auto"
              my={70}
            >
              <Text size="xl" weight="bold" align="center">
                Verify your account
              </Text>

              <Space my="md" />
              <form
                onSubmit={OtpForm.onSubmit((values) =>
                  HandleSubmit(values.otp)
                )}
              >
                <SimpleGrid>
                  <PasswordInput
                    placeholder="OTP"
                    {...OtpForm.getInputProps('otp')}
                  />

                  <Space />

                  <Button
                    type="button"
                    color="yellow"
                    variant="outline"
                    fullWidth
                    onClick={() => ResendCode()}
                  >
                    Resend Code
                  </Button>

                  <Button
                    type="submit"
                    color="yellow"
                    fullWidth
                    loading={PriLoading}
                  >
                    Submit
                  </Button>

                  <Button
                    onClick={() => {
                      fetch('/api/auth/logout');
                      Router.push('/');
                    }}
                    color="red"
                    fullWidth
                  >
                    cancel
                  </Button>
                </SimpleGrid>
              </form>
            </Paper>
          </Container>
        </>
      ) : (
        <Center style={{ height: '100vh' }}>
          <Loader color="yellow" />
        </Center>
      )}
    </>
  );
};

export default OTPPage;
