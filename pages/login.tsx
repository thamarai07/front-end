import React, { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import {
  Button,
  Container,
  Paper,
  PasswordInput,
  SimpleGrid,
  Space,
  Text,
  TextInput,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { ServerGetUSer } from '../lib/funs/user';
import DefaultHeader from '../components/main/header';
import { ServerResStructure } from '../lib/types';
import POST from '../lib/funs/post';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const User = await ServerGetUSer(context);

  if (User) {
    if (User.status === 'NOTVERIFIED') {
      return {
        redirect: {
          destination: '/otp',
          permanent: false,
        },
      };
    }
    if (User.role === 'CLIENT') {
      return {
        redirect: {
          destination: '/dashboardc',
          permanent: false,
        },
      };
    }
    return {
      redirect: {
        destination: '/dashboarda',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Login: NextPage = () => {
  const Router = useRouter();
  const [PriLoading, setPriLoading] = useState(false);

  const HandleSignIn = async (values: any) => {
    setPriLoading(true);
    const loginRes: ServerResStructure = await POST('/api/auth/login', values);

    if (loginRes.statusCode === 200) {
      if (loginRes.data.status === 'NOTVERIFIED') {
        Router.push('/otp');
      } else if (loginRes.data.role === 'CLIENT') {
        Router.push('/dashboardc');
      } else {
        Router.push('/dashboarda');
      }
    } else {
      showNotification({
        title: 'Error',
        message: loginRes.message,
      });
    }
    setPriLoading(false);
  };

  const SignInForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      email: '',
      password: '',
    },
  });

  return (
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
            Welcome Back
          </Text>

          <Space my="md" />
          <form
            onSubmit={SignInForm.onSubmit((values) => HandleSignIn(values))}
          >
            <SimpleGrid>
              <TextInput
                placeholder="Email"
                {...SignInForm.getInputProps('email')}
              />

              <PasswordInput
                placeholder="Password"
                {...SignInForm.getInputProps('password')}
              />

              <Space />

              <Button
                type="submit"
                color="yellow"
                fullWidth
                loading={PriLoading}
              >
                Sign In
              </Button>
            </SimpleGrid>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default Login;
