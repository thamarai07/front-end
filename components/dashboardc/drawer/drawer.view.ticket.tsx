import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Card,
  Divider,
  FileInput,
  Group,
  Modal,
  NumberInput,
  SimpleGrid,
  Space,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { ArrowBarRight, Download, Send, Star } from 'tabler-icons-react';
import { useState, Children, useEffect } from 'react';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useClientDashboardContext } from '../../../lib/client/context/client.dashboard.context';
import parseDate from '../../../lib/funs/parseDate';

const DrawerViewTicket = () => {
  const {
    ViewTic,
    SetRightDrawerContent,
    RefundTicket,
    HandlePayForTicket,
    HandleMeetGen,
    HandleSendMessage,
    HandleTicFileUpload,
    HandleRating,
  } = useClientDashboardContext();

  const [Pass, setPass] = useState('');
  const [RefundConfirm, setRefundConfirm] = useState(false);
  const [Message, setMessage] = useState('');

  const [UploadingDoc, setUploadingDoc] = useState(false);

  const [Rating, setRating] = useState(0);
  const [RateLoading, setRateLoading] = useState(false);

  const uploadForm = useForm<{
    file: File | null;
  }>({
    initialValues: {
      file: null,
    },

    validate: {
      file: (value) => {
        if (!value) {
          return 'File is required';
        }

        // check smaller then 10mb
        if (value.size > 10000000) {
          return 'File must be smaller then 10mb';
        }

        return null;
      },
    },
  });

  useEffect(() => {
    if (ViewTic?.rating) {
      setRating(ViewTic.rating);
    }
  }, [ViewTic]);

  return (
    <>
      <Modal
        centered
        opened={RefundConfirm}
        onClose={() => setRefundConfirm(false)}
        title="Refund Confirmation"
      >
        <Text>To confirm your ticket refund, please enter your password</Text>

        <TextInput
          mt="md"
          label="Password"
          value={Pass}
          onChange={(e) => setPass(e.target.value)}
        />

        <Button
          onClick={() => {
            if (ViewTic?.id) {
              RefundTicket(ViewTic.id, Pass);
            } else {
              showNotification({
                title: 'Error',
                message: 'Some Problem, Contact Dev',
                color: 'red',
              });
            }
          }}
          color="green"
          mt="md"
          fullWidth
        >
          Refund
        </Button>
      </Modal>
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
            <Badge size="lg" color="teal" radius="sm">
              {ViewTic.status}
            </Badge>

            {ViewTic.status === 'CLOSED' && (
              <>
                <Divider label="Rating" />
                <Group position="center">
                  {Children.toArray(
                    Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <ActionIcon
                          variant="transparent"
                          onClick={() => setRating(i + 1)}
                        >
                          <Star fill={i < Rating ? '#FFD700' : '#000'} />
                        </ActionIcon>
                      ))
                  )}
                </Group>

                {Rating > 0 && ViewTic.rating === 0 && (
                  <Button
                    onClick={async () => {
                      setRateLoading(true);
                      await HandleRating({
                        ticketId: ViewTic.id,
                        rating: Rating,
                      });
                      setRateLoading(false);
                    }}
                    color="green"
                    mt="md"
                    fullWidth
                    size="xs"
                    loading={RateLoading}
                  >
                    Rate
                  </Button>
                )}

                <Divider />
              </>
            )}

            {ViewTic.status === 'OPEN' && (
              <>
                <Button onClick={() => setRefundConfirm(true)} color="red">
                  Refund
                </Button>
                {ViewTic.meeting ? (
                  <Anchor
                    href={`https://meet.jit.si/legaldoji-${ViewTic.meeting.id}`}
                    mx="auto"
                  >
                    Meeting Link
                  </Anchor>
                ) : (
                  <Button onClick={() => HandleMeetGen(ViewTic.id)}>
                    Meeting
                  </Button>
                )}
              </>
            )}
            {ViewTic.status === 'UNPAID' && (
              <Button
                onClick={() => HandlePayForTicket(ViewTic.id)}
                color="green"
              >
                Pay
              </Button>
            )}

            <Group grow>
              <TextInput
                variant="unstyled"
                readOnly
                label="Advocate"
                value={
                  `LA${ViewTic.advocateId.slice(-6)}` ||
                  'Some Problem, Contact Dev'
                }
              />

              <NumberInput
                variant="unstyled"
                readOnly
                label="Price"
                value={ViewTic.price}
                rightSection={<Text size="sm">INR</Text>}
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

            {ViewTic.status === 'OPEN' && (
              <>
                <Divider />
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
                                href={`/api/client/ticket/doc/download/${ViewTic.id}/${doc.url}`}
                                target="_blank"
                                rel="noreferrer noopener"
                              >
                                <Download />
                              </ActionIcon>
                              {/* <ActionIcon size="xs">
                                <Trash color="red" />
                              </ActionIcon> */}
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
                <form
                  onSubmit={uploadForm.onSubmit(async (values) => {
                    if (values.file) {
                      setUploadingDoc(true);
                      await HandleTicFileUpload({
                        doc: values.file,
                        ticketId: ViewTic.id,
                      });
                      uploadForm.reset();
                      setUploadingDoc(false);
                    } else {
                      showNotification({
                        title: 'Error',
                        message: 'No file selected',
                      });
                    }
                  })}
                >
                  <FileInput
                    {...uploadForm.getInputProps('file')}
                    description="Max 10MB"
                    placeholder="Select Doc to upload"
                    size="xs"
                    clearable
                    disabled={UploadingDoc}
                  />

                  {uploadForm.values.file && !uploadForm.errors.file && (
                    <Button
                      type="submit"
                      loading={UploadingDoc}
                      size="xs"
                      fullWidth
                      mt="md"
                    >
                      Upload
                    </Button>
                  )}
                </form>
              </>
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
                <Text mx="auto" size="sm" weight="bold" color="dimmed">
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

export default DrawerViewTicket;
