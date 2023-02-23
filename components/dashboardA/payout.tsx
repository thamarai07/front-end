import {
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useAdvoDashboardContext } from '../../lib/advocate/context/advo.dashboard.context';
import parseDate from '../../lib/funs/parseDate';

const PayoutComponent = () => {
  const { LoggedAdvo, HandlePayoutRequest } = useAdvoDashboardContext();

  return (
    <Container mt="xl">
      <Stack>
        <Group position="apart" align="end">
          <Title>Payout</Title>

          <Button
            size="xs"
            variant="outline"
            color="yellow"
            onClick={() => HandlePayoutRequest()}
          >
            Request
          </Button>
        </Group>

        <Text color="dimmed" size="xs">
          You can only request if your verified balance is over 1000 INR
        </Text>

        <Divider />

        <Card p="xs">
          <Stack>
            {LoggedAdvo?.PayoutRequest ? (
              <>
                <Group position="apart">
                  <Text size="xs">
                    {parseDate(LoggedAdvo?.PayoutRequest?.createdAt, 'date')}
                  </Text>

                  <Badge color="gray">
                    {LoggedAdvo?.PayoutRequest?.status}
                  </Badge>
                </Group>

                <Group position="apart">
                  <Text size="xs">
                    LA{LoggedAdvo?.PayoutRequest?.advocateId.slice(-6)}
                  </Text>

                  <Text weight="bold" size="xs" mr="xs">
                    {LoggedAdvo?.PayoutRequest?.price} INR
                  </Text>
                </Group>
              </>
            ) : (
              <Text size="xs" color="dimmed">
                No request is made yet
              </Text>
            )}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};

export default PayoutComponent;
