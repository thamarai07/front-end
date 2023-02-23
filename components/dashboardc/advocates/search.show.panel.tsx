import React from 'react';
import { Box, Button, Group, SimpleGrid, Text } from '@mantine/core';
import AdvocateCard from './advocates.card';
import { useClientDashboardContext } from '../../../lib/client/context/client.dashboard.context';

const SearchAdvoPanel = () => {
  const { SearchAdvo, SearchAdvoHandler } = useClientDashboardContext();

  return (
    <>
      <Box mx="md" mt="md">
        <SimpleGrid>
          <Group position="apart">
            <Text weight="bold" size="xl">
              Search Result
            </Text>

            <Button
              onClick={() => SearchAdvoHandler.setState([])}
              variant="outline"
              compact
              color="yellow"
            >
              Clear
            </Button>
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
              SearchAdvo.map((advocate) => (
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

export default SearchAdvoPanel;
