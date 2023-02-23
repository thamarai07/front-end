import { ActionIcon, Box, Group, SimpleGrid, Text } from '@mantine/core';
import { ArrowBarToDown } from 'tabler-icons-react';
import React from 'react';
import TicketsCard from './ticket.card';
import { useClientDashboardContext } from '../../../lib/client/context/client.dashboard.context';

const TicketsFullPanel = () => {
  const { SetRightDrawerContent, DashState, setDashState, ClientTic } =
    useClientDashboardContext();
  return (
    <>
      {DashState === 'tics' && (
        <Box
          sx={{
            height: '100%',
            position: 'relative',
            overflow: 'auto',
            backgroundColor: 'rgba(0,0,0,0.8)',
          }}
        >
          <Group position="apart" px="xl" p="md">
            <Text size="lg" weight="bold">
              Recent Tickets
            </Text>
            <ActionIcon
              onClick={() => setDashState('dash')}
              size="sm"
              variant="transparent"
            >
              <ArrowBarToDown />
            </ActionIcon>
          </Group>
          <SimpleGrid
            px="xl"
            mt="sm"
            breakpoints={[
              { maxWidth: 450, cols: 1, spacing: 'md' },
              { maxWidth: 630, cols: 2, spacing: 'md' },
              { maxWidth: 1123, cols: 3, spacing: 'md' },
              { maxWidth: 1300, cols: 4, spacing: 'md' },
              { maxWidth: 1500, cols: 5, spacing: 'md' },
              { maxWidth: 2500, cols: 6, spacing: 'md' },
              { maxWidth: 3000, cols: 7, spacing: 'md' },
            ]}
          >
            {ClientTic.length <= 0 ? (
              <Text size="xl" my="xl" weight="bold" color="gray">
                No tickets
              </Text>
            ) : (
              React.Children.toArray(
                ClientTic.map((ticket) => (
                  <TicketsCard
                    ticket={ticket}
                    SetRightDrawerContent={SetRightDrawerContent as any}
                  />
                ))
              )
            )}
          </SimpleGrid>
        </Box>
      )}
    </>
  );
};

export default TicketsFullPanel;
