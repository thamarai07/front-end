import React from 'react';
import { Group, Container, ActionIcon } from '@mantine/core';
import { Cash, Home, User, Wallpaper } from 'tabler-icons-react';
import useOwnMedia from '../../lib/hooks/useOwnMedia';
import { useAdvoDashboardContext } from '../../lib/advocate/context/advo.dashboard.context';

const AdvoDashboardFooter = () => {
  const { BigThan800 } = useOwnMedia();
  const { setDashState, SetRightDrawerContent } = useAdvoDashboardContext();

  return (
    <>
      {!BigThan800 && (
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
                variant="transparent"
                onClick={() => setDashState('dash')}
              >
                <Home />
              </ActionIcon>
              <ActionIcon
                variant="transparent"
                onClick={() =>
                  SetRightDrawerContent({
                    view: 'profile',
                    id: null,
                  })
                }
              >
                <User />
              </ActionIcon>
              <ActionIcon
                variant="transparent"
                onClick={() => setDashState('payout')}
              >
                <Cash />
              </ActionIcon>

              <ActionIcon
                variant="transparent"
                onClick={() => setDashState('resources')}
              >
                <Wallpaper />
              </ActionIcon>
            </Group>
          </Group>
        </Container>
      )}
    </>
  );
};

export default AdvoDashboardFooter;
