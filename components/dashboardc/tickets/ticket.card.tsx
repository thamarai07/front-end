import React from 'react';
import { Badge, Box, Button, Divider, Group, Text } from '@mantine/core';
import { TicketTypes } from '../../../lib/client/context/client.context.types';
import parseDate from '../../../lib/funs/parseDate';

const TicketsCard = ({
  ticket,
  SetRightDrawerContent,
}: {
  ticket: TicketTypes;
  SetRightDrawerContent: ({ view, id }: { view: string; id: any }) => void;
}) => (
  <>
    <Box
      style={{
        display: 'inline-block',
      }}
      sx={{
        backgroundColor: 'rgba(250,250,250,0.1)',
        borderRadius: '7px',
        width: '100%',
      }}
      p="xs"
    >
      <Group position="apart">
        {/* TIC + 6 starting digits */}
        <Text size="xs" weight="bold">
          TIC{ticket.id.slice(-6)}
        </Text>
        <Badge
          size="sm"
          color={ticket.status === 'OPEN' ? 'teal' : 'yellow'}
          radius="sm"
        >
          {ticket.status}
        </Badge>
      </Group>
      <Divider my={5} />

      <Group position="apart" mt="xs">
        <Text size="xs" weight="bold">
          {parseDate(ticket.meetDate, 'date')}
        </Text>
      </Group>

      <Group position="apart" mt="xs">
        <Text size="xs" weight="bold">
          RS {ticket.price}
        </Text>

        <Button
          onClick={() =>
            SetRightDrawerContent({
              view: 'ticket',
              id: ticket,
            })
          }
          size="xs"
          compact
          variant="light"
          color="dark"
        >
          view
        </Button>
      </Group>
    </Box>
  </>
);

export default TicketsCard;
