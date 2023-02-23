import React from 'react';
import { Box, Group, SimpleGrid, Text } from '@mantine/core';
import AdvocateCard from './advocates.card';
import { useClientDashboardContext } from '../../../lib/client/context/client.dashboard.context';

const SomeAdvocatesPanel = () => {
  const { SomeAdvo } = useClientDashboardContext();

  return (
    <>
      <Box mx="md" mt="md">
        <SimpleGrid>
          <Group>
            <Text weight="bold" size="xl">
              Popular Advocates
            </Text>
          </Group>
          <SimpleGrid
            breakpoints={[
              { maxWidth: 450, cols: 1, spacing: 'md' },
              { maxWidth: 630, cols: 2, spacing: 'md' },
              { maxWidth: 820, cols: 3, spacing: 'md' },
              { maxWidth: 1300, cols: 4, spacing: 'md' },
              { maxWidth: 1500, cols: 5, spacing: 'md' },
              { maxWidth: 2500, cols: 6, spacing: 'md' },
              { maxWidth: 3000, cols: 7, spacing: 'md' },
            ]}
          >
            {React.Children.toArray(
              SomeAdvo.map((advocate) => (
                <>
                  <AdvocateCard advocate={advocate} />
                </>
              ))
            )}
          </SimpleGrid>
        </SimpleGrid>
      </Box>
    </>
  );
};

export default SomeAdvocatesPanel;
