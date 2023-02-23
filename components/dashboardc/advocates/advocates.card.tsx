import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Group,
  SimpleGrid,
  Text,
} from '@mantine/core';
import { AdvocateTypes } from '../../../lib/client/context/client.context.types';
import { useClientDashboardContext } from '../../../lib/client/context/client.dashboard.context';

const AdvocateCard = ({ advocate }: { advocate: AdvocateTypes }) => {
  const { SetRightDrawerContent } = useClientDashboardContext();

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'rgba(250,250,250,0.1)',
          borderRadius: '7px',
          width: '100%',
        }}
        p="xs"
      >
        <Group>
          <Avatar
            style={{
              border:
                advocate.status === 'VERIFIED'
                  ? '3px solid green'
                  : '3px solid transparent',
            }}
            size="md"
            radius="xl"
            src={`/api/auth/user/avatar/${advocate?.id}`}
          />
          <SimpleGrid spacing={0}>
            {/* if too long, truncate */}
            <Text
              weight="bold"
              size="sm"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100px',
              }}
            >
              {advocate.name}
            </Text>
            <Text weight="bold" size="xs">
              LA{advocate.id.slice(-6)}
            </Text>
          </SimpleGrid>
        </Group>
        <Divider my={5} />

        <Group position="apart">
          <Text size="sm" weight="bold">
            {advocate.experience} Years
          </Text>
          <Text size="sm" weight="bold">
            RS {advocate.price}
          </Text>
        </Group>

        <SimpleGrid spacing="xs" mt="xs">
          <Button
            onClick={() =>
              SetRightDrawerContent({
                view: 'advocate',
                id: advocate,
              })
            }
            size="xs"
            compact
            variant="light"
            color="dark"
            fullWidth
          >
            view
          </Button>
          <Button
            onClick={() =>
              SetRightDrawerContent({
                view: 'book',
                id: advocate,
              })
            }
            size="xs"
            variant="filled"
            color="green"
            fullWidth
          >
            book
          </Button>
        </SimpleGrid>
      </Box>
    </>
  );
};

export default AdvocateCard;
