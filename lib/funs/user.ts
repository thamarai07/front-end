import { GetServerSidePropsContext } from 'next';
import { ServerResStructure } from '../types';

// fetch user from /api/auth/user
export const GetUser = async () =>
  fetch('/api/auth/user')
    .then((res) => res.json())
    .then((data) => {
      if (data.data) {
        return data.data;
      }
      return null;
    });

export const ServerGetUSer = async (CTX: GetServerSidePropsContext) => {
  const SessionCookie = CTX.req.cookies.session;

  if (!SessionCookie) {
    return null;
  }

  const User: ServerResStructure = await fetch(
    `${process.env.BACK}/api/auth/user`,
    {
      method: 'GET',
      headers: {
        cookie: `session=${SessionCookie}`,
      },
    }
  ).then((res) => res.json());

  if (!User.data) {
    return null;
  }

  return User.data;
};
