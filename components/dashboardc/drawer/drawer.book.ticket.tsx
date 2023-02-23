import {
  ActionIcon,
  Button,
  Divider,
  Group,
  SimpleGrid,
  Space,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { ArrowBarRight } from 'tabler-icons-react';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useWorldStyles } from '../../../styles/world';
import { useClientDashboardContext } from '../../../lib/client/context/client.dashboard.context';

const DrawerBookTicket = () => {
  const { classes } = useWorldStyles();
  const { BookTic, SetRightDrawerContent, HandleBookTicket } =
    useClientDashboardContext();

  const [PriLoading, setPriLoading] = useState(false);
  const [Err, setErr] = useState<string | null>();

  const BookTicketForm = useForm({
    initialValues: {
      meetDate: '',
      description: '',
    },
  });

  return (
    <>
      {BookTic && (
        <SimpleGrid>
          <Group position="apart">
            <Title weight="bold" order={2}>
              Book Ticket
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
          <Divider />
          <form
            onSubmit={BookTicketForm.onSubmit(async (values) => {
              setPriLoading(true);
              const res = await HandleBookTicket(values);
              if (res.success) {
                SetRightDrawerContent({
                  view: 'close',
                  id: null,
                });
              } else {
                setErr(res.message);
              }
              setPriLoading(false);
            })}
          >
            <SimpleGrid>
              <TextInput
                className={classes.Input}
                label="Advocate Name"
                variant="unstyled"
                readOnly
                value={BookTic.name}
                disabled={PriLoading}
              />

              <DatePicker
                className={classes.Input}
                variant="unstyled"
                placeholder="Pick date"
                required
                disabled={PriLoading}
                minDate={dayjs(new Date()).toDate()}
                maxDate={dayjs(new Date()).endOf('month').toDate()}
                // for each day in V
                excludeDate={(date) =>
                  BookTic.AvailabelDates[0]?.days.includes(date.getDate())
                }
                {...BookTicketForm.getInputProps('meetDate')}
              />

              <Textarea
                className={classes.Input}
                variant="unstyled"
                placeholder="Case description"
                autosize
                required
                minLength={50}
                minRows={5}
                disabled={PriLoading}
                maxRows={7}
                {...BookTicketForm.getInputProps('description')}
              />

              {Err && (
                <Text color="red" size="sm">
                  {Err}
                </Text>
              )}
              <Space />
              <Button
                type="submit"
                color="green"
                fullWidth
                loading={PriLoading}
              >
                <Text>Pay</Text>
              </Button>
            </SimpleGrid>
          </form>
        </SimpleGrid>
      )}
    </>
  );
};

export default DrawerBookTicket;
