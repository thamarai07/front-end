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
import { useAdvoDashboardContext } from '../../lib/advocate/context/advo.dashboard.context';

const AdvoDashboardHeader = () => {
  const { BigThan800 } = useOwnMedia();
  const Router = useRouter();
  const { setDashState, LoggedAdvo } = useAdvoDashboardContext();

  return (
    <Header
      height={70}
      px="md"
      style={{
        backgroundColor: '#000',
      }}
    >
      <Group position="apart" sx={{ height: '100%' }}>
        <Group>
          <Image src="/images/h-logo-dark.png" alt="LegalDoji" width={150} />
        </Group>

        {BigThan800 && (
          <Group>
            <UnstyledButton onClick={() => setDashState('dash')}>
              <Text size="sm">Dasboard</Text>
            </UnstyledButton>
            <UnstyledButton onClick={() => setDashState('payout')}>
              <Text size="sm">Payout</Text>
            </UnstyledButton>
            <UnstyledButton onClick={() => setDashState('resources')}>
              <Text size="sm">Resources</Text>
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
                src={`/api/auth/user/avatar/${LoggedAdvo?.id}`}
              />
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                onClick={() => setDashState('profile')}
                icon={<Edit size={14} />}
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

              <Menu.Item
                onClick={() => {
                  Router.push('/');
                  fetch('/api/auth/logout');
                }}
                color="red"
                icon={<Logout size={14} />}
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

export default AdvoDashboardHeader;
