import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  SimpleGrid,
  Space,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { ArrowBarRight, Download, Send } from 'tabler-icons-react';
import { Children, useEffect, useState } from 'react';
import { useAdvoDashboardContext } from '../../../lib/advocate/context/advo.dashboard.context';
import parseDate from '../../../lib/funs/parseDate';

const AdvoDrawerViewTicket = () => {
  const {
    ViewTic,
    SetRightDrawerContent,
    HandleSendMessage,
    HandleTicketClose,
  } = useAdvoDashboardContext();

  const [Message, setMessage] = useState('');

  const [MeetExpired, setMeetExpired] = useState(false);

  useEffect(() => {
    if (ViewTic?.meeting) {
      const createdAt = new Date(ViewTic.meeting.createdAt);
      const now = new Date();
      const diff = now.getTime() - createdAt.getTime();
      const diffHours = Math.floor(diff / (1000 * 60 * 60));
      if (diffHours >= 24) {
        setMeetExpired(true);
      }
    }
  }, [ViewTic]);

  return (
    <>
      {ViewTic && (
        <SimpleGrid>
          <Group position="apart">
            <Title weight="bold" order={3}>
              Ticket
            </Title>

            <ActionIcon
              variant="transparent"
              onClick={() =>
                SetRightDrawerContent({
                  view: 'close',
                  id: null,
                })
              }
              size="sm"
              mt={1}
            >
              <ArrowBarRight />
            </ActionIcon>
          </Group>
          <SimpleGrid>
            <Badge size="xl" color="teal" radius="sm">
              {ViewTic.status}
            </Badge>
            {ViewTic.status === 'OPEN' && (
              <>
                {ViewTic.meeting ? (
                  <>
                    {MeetExpired && (
                      <Button
                        onClick={() => HandleTicketClose(ViewTic.id)}
                        variant="outline"
                        color="red"
                        size="sm"
                        mt="xs"
                      >
                        Close Ticket
                      </Button>
                    )}
                    <Anchor
                      href={`https://meet.jit.si/legaldoji-${ViewTic.meeting.id}`}
                      mx="auto"
                    >
                      Meeting Link
                    </Anchor>
                  </>
                ) : (
                  <Text weight="bold" color="gray" align="center">
                    Meeting Link Not Generated
                  </Text>
                )}
              </>
            )}
            <Group grow>
              <TextInput
                variant="unstyled"
                readOnly
                label="Client"
                value={
                  `LC${ViewTic.clientId.slice(-10)}` ||
                  'Some Problem, Contact Dev'
                }
              />

              <TextInput
                variant="unstyled"
                readOnly
                label="Price"
                value={ViewTic.price || 'Some Problem, Contact Dev'}
              />
            </Group>

            <Group grow>
              <TextInput
                variant="unstyled"
                readOnly
                label="Meet Date"
                value={parseDate(ViewTic.meetDate, 'date') || 'Some Problem'}
              />
            </Group>

            <Textarea
              variant="unstyled"
              readOnly
              label="Client Description"
              value={ViewTic.clientDescription || 'Some Problem, Contact Dev'}
              minRows={5}
            />

            <Divider />

            {ViewTic.status === 'OPEN' && (
              <Stack>
                {ViewTic.documents.length > 0 ? (
                  Children.toArray(
                    ViewTic.documents.map((doc) => (
                      <Card p="xs">
                        <Group position="apart">
                          <Text size="xs" weight="bold">
                            {doc.name}
                          </Text>
                          <Group spacing="xs">
                            <ActionIcon
                              size="xs"
                              component="a"
                              href={`/api/advocate/ticket/doc/download/${ViewTic.id}/${doc.url}`}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              <Download />
                            </ActionIcon>
                          </Group>
                        </Group>
                      </Card>
                    ))
                  )
                ) : (
                  <>
                    <Text size="sm" weight="bold" color="dimmed">
                      No Documents
                    </Text>
                  </>
                )}
              </Stack>
            )}

            <Divider />
            <Text size="lg" weight="bold">
              Chats
            </Text>

            <Stack>
              {ViewTic.advocateMessage && (
                <Group>{ViewTic.advocateMessage}</Group>
              )}
              {ViewTic.clientMessage && (
                <Group position="right">{ViewTic.clientMessage}</Group>
              )}
              {!ViewTic.advocateMessage && !ViewTic.clientMessage && (
                <Text mx="auto" size="xl" weight="bold" color="dimmed">
                  No Chats
                </Text>
              )}
            </Stack>

            <Space />
            {ViewTic.status === 'OPEN' && (
              <TextInput
                style={{
                  border: '1px solid white',
                  borderRadius: '7px',
                }}
                rightSection={
                  <ActionIcon
                    onClick={() => {
                      HandleSendMessage(ViewTic.id, Message);
                      setMessage('');
                    }}
                    variant="transparent"
                  >
                    <Send color="gray" size={18} />
                  </ActionIcon>
                }
                px="xs"
                variant="unstyled"
                placeholder="Type Here"
                value={Message}
                onChange={(e) => setMessage(e.target.value)}
              />
            )}
          </SimpleGrid>
        </SimpleGrid>
      )}
    </>
  );
};

export default AdvoDrawerViewTicket;
