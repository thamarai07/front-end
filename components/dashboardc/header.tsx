import React from 'react';
import {
  Header,
  Group,
  Image,
  Avatar,
  SimpleGrid,
  ActionIcon,
  UnstyledButton,
  Text,
  Menu,
} from '@mantine/core';
import { Bell, Edit, Lifebuoy, Logout, News } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import useOwnMedia from '../../lib/hooks/useOwnMedia';
import { useClientDashboardContext } from '../../lib/client/context/client.dashboard.context';

const DashboardHeader = () => {
  const { BigThan540 } = useOwnMedia();
  const Router = useRouter();
  const { setDashState, LoggedClient } = useClientDashboardContext();

  return (
    <Header
      height={65}
      px="md"
      style={{
        backgroundColor: '#000',
      }}
    >
      <Group position="apart" sx={{ height: '100%' }}>
        <Group>
          <Image src="/images/h-logo-dark.png" alt="LegalDoji" width={150} />
        </Group>

        {BigThan540 && (
          <Group>
            <UnstyledButton>
              <Text onClick={() => setDashState('dash')} size="sm">
                Dasboard
              </Text>
            </UnstyledButton>
            <UnstyledButton>
              <Text size="sm">Documents</Text>
            </UnstyledButton>
            <UnstyledButton onClick={() => setDashState('stamp')}>
              <Text size="sm">Stamp paper</Text>
            </UnstyledButton>
          </Group>
        )}

        <SimpleGrid cols={2}>
          <Group m="auto" mt={6} spacing={3}>
            <ActionIcon variant="transparent">
              <News />
            </ActionIcon>
            <ActionIcon variant="transparent">
              <Bell />
            </ActionIcon>
          </Group>
          <Menu position="bottom-end" width={200}>
            <Menu.Target>
              <Avatar
                style={{ cursor: 'pointer' }}
                radius="xl"
                src={`/api/auth/user/avatar/${LoggedClient?.id}`}
              />
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                onClick={() => setDashState('profile')}
                icon={<Edit size={15} />}
              >
                Profile
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                onClick={() => setDashState('support')}
                icon={<Lifebuoy size={15} />}
              >
                Support
              </Menu.Item>

              {/* <Menu.Label>Danger zone</Menu.Label> */}
              <Menu.Item
                onClick={() => {
                  fetch('/api/auth/logout');
                  Router.push('/');
                }}
                color="red"
                icon={<Logout size={15} />}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </SimpleGrid>
      </Group>
    </Header>
  );
};

export default DashboardHeader;
