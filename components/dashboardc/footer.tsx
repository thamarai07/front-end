import React from 'react';
import { Group, Container, ActionIcon } from '@mantine/core';
import { Files, Home, Notebook } from 'tabler-icons-react';
import useOwnMedia from '../../lib/hooks/useOwnMedia';
import { useClientDashboardContext } from '../../lib/client/context/client.dashboard.context';

const DashboardFooter = () => {
  const { BigThan540 } = useOwnMedia();
  const { setDashState } = useClientDashboardContext();

  return (
    <>
      {!BigThan540 && (
        <Container
          h={70}
          style={{
            backgroundColor: '#000',
            borderRadius: '0',
          }}
        >
          <Group position="center" sx={{ height: '100%' }}>
            <Group spacing="xl">
              <ActionIcon
                onClick={() => setDashState('dash')}
                variant="transparent"
              >
                <Home />
              </ActionIcon>
              <ActionIcon variant="transparent">
                <Files />
              </ActionIcon>

              <ActionIcon
                variant="transparent"
                onClick={() => setDashState('dash')}
              >
                <Notebook />
              </ActionIcon>
            </Group>
          </Group>
        </Container>
      )}
    </>
  );
};

export default DashboardFooter;
