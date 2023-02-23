/* eslint-disable no-lonely-if */
import { useForm } from '@mantine/form';
import { NextPage } from 'next';
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
  Tabs,
  TextInput,
} from '@mantine/core';
import { useEffect, useState } from 'react';

import { showNotification } from '@mantine/notifications';
import DefaultHeader from '../components/main/header';
import { GetUser } from '../lib/funs/user';

const SignupAdvo: NextPage = () => {
  const Router = useRouter();

  const [LoggedOut, setLoggedOut] = useState(false);
  const [PriLoading, setPriLoading] = useState(false);

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
          Router.replace('/dashboarda');
        }
      }
    } else {
      setLoggedOut(true);
    }
  };

  useEffect(() => {
    CheckUser();
  }, []);

  const HandleSignUp = async (values: any) => {
    // remove confirmPassword from values
    setPriLoading(true);
    const { confirmPassword, ...rest } = values;

    // fetch request to /api/auth/register
    // statusCode: HttpStatus;
    // message?: any;
    // error?: any;
    // data?: T;
    const registerRes = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rest),
    });

    const registerData = await registerRes.json();

    // if statusCode is 201, redirect to /otp
    if (registerData.statusCode === 201) {
      Router.push('/otp');
    } else {
      showNotification({
        title: 'Error',
        message: registerData.message,
      });
    }
    setPriLoading(false);
  };

  const SignUpForm = useForm({
    validateInputOnChange: true,

    initialValues: {
      who: 'advocate',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '12/12/2012',
      phoneNumber: '',
      state: 'somecity',
      city: 'samesame',
      pincode: '123123',
      confirmPassword: '',
    },

    validate: {
      email: (value) => {
        if (!value) {
          return 'Email is required';
        }

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          return 'Invalid email address';
        }

        return null;
      },

      password: (value) => {
        if (!value) {
          return 'Password is required';
        }

        if (value.length < 8) {
          return 'Password must be at least 8 characters long';
        }

        return null;
      },

      phoneNumber: (value) => {
        if (!value) {
          return 'Phone number is required';
        }

        // use regex /^[6-9]\d{9}$/
        if (!/^[6-9]\d{9}$/.test(value)) {
          return 'Invalid phone number';
        }

        return null;
      },

      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
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
              <Tabs
                value={SignUpForm.values.who}
                onTabChange={(WHO) =>
                  SignUpForm.setFieldValue('who', WHO as string)
                }
              >
                <Tabs.List>
                  <Tabs.Tab value="advocate">I am Advocate</Tabs.Tab>
                  <Tabs.Tab value="intern">I am Intern</Tabs.Tab>
                </Tabs.List>
              </Tabs>

              <Space my="md" />
              <form
                onSubmit={SignUpForm.onSubmit((values) => HandleSignUp(values))}
              >
                <SimpleGrid>
                  <TextInput
                    placeholder="First name"
                    {...SignUpForm.getInputProps('firstName')}
                  />

                  <TextInput
                    placeholder="Last name"
                    {...SignUpForm.getInputProps('lastName')}
                  />

                  <TextInput
                    placeholder="Email"
                    {...SignUpForm.getInputProps('email')}
                  />

                  <TextInput
                    placeholder="Phone Number"
                    {...SignUpForm.getInputProps('phoneNumber')}
                  />

                  <PasswordInput
                    placeholder="Password"
                    {...SignUpForm.getInputProps('password')}
                  />

                  <PasswordInput
                    placeholder="Confirm Password"
                    {...SignUpForm.getInputProps('confirmPassword')}
                  />

                  <Space />

                  <Button
                    type="submit"
                    color="yellow"
                    fullWidth
                    loading={PriLoading}
                  >
                    Join Legaldoji
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

export default SignupAdvo;
