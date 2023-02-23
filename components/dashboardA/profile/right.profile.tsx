import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Divider,
  Group,
  NumberInput,
  Popover,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { ArrowBarRight, InfoCircle, Star } from 'tabler-icons-react';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';
import { useAdvoDashboardContext } from '../../../lib/advocate/context/advo.dashboard.context';
import POST from '../../../lib/funs/post';
import useOwnMedia from '../../../lib/hooks/useOwnMedia';

const RightProfile = () => {
  const { LoggedAdvo, setLoggedAdvo, SetRightDrawerContent } =
    useAdvoDashboardContext();
  const { BigThan800 } = useOwnMedia();
  const [PriLoading, setPriLoading] = useState(false);
  const [DaysFree, setDaysFree] = useState<number[]>([]);

  useEffect(() => {
    if (LoggedAdvo) {
      if (LoggedAdvo.AvailabelDates.length > 0) {
        setDaysFree(LoggedAdvo.AvailabelDates[0].days);
      }
    }
  }, [LoggedAdvo]);

  const HandleUpdate = async () => {
    setPriLoading(true);
    const updatedAdvo = await POST('/api/advocate/profile/update', {
      dates: DaysFree,
    });

    if (updatedAdvo.statusCode === 200) {
      setLoggedAdvo(updatedAdvo.data);
      alert('Profile Updated');
    } else {
      alert(updatedAdvo.message);
    }

    setPriLoading(false);
  };

  return (
    <>
      {!BigThan800 && (
        <Group position="right">
          <ActionIcon
            variant="transparent"
            onClick={() =>
              SetRightDrawerContent({
                view: 'close',
                id: null,
              })
            }
            size="sm"
          >
            <ArrowBarRight />
          </ActionIcon>
        </Group>
      )}

      {LoggedAdvo ? (
        <SimpleGrid>
          <Group position="left">
            <Avatar
              size="xl"
              radius={50}
              src={`/api/auth/user/avatar/${LoggedAdvo?.id}`}
            />

            <SimpleGrid spacing={0}>
              <Text
                weight="bold"
                size="xl"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '150px',
                }}
              >
                {LoggedAdvo.name}
              </Text>
              <Text
                size="sm"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '150px',
                }}
              >
                LA{LoggedAdvo.id.slice(-6)}
              </Text>
            </SimpleGrid>
          </Group>
          <Group position="apart">
            {/* <Text weight="bold">
              {LoggedAdvo.city} - {LoggedAdvo.state}
            </Text> */}
            <Badge>{LoggedAdvo?.status}</Badge>

            <Group spacing="xs">
              <Text size="sm">{LoggedAdvo.rating}</Text>
              <Star size={17} />
            </Group>
          </Group>

          <Group grow>
            <NumberInput
              variant="unstyled"
              readOnly
              label="verified balance"
              value={LoggedAdvo.verifiedBallance}
              styles={() => ({
                input: {
                  color: 'green',
                },
              })}
            />

            <TextInput
              variant="unstyled"
              readOnly
              label="unverified balance"
              value={LoggedAdvo.unverifiedBallance}
              styles={() => ({
                input: {
                  color: 'red',
                },
              })}
            />
          </Group>

          <Divider />

          <Stack>
            <Calendar
              // today date
              minDate={dayjs(new Date()).toDate()}
              maxDate={dayjs(new Date()).endOf('month').toDate()}
              multiple
              // current month date
              value={DaysFree.map((day) => dayjs().date(day).toDate())}
              onChange={(value) => {
                setDaysFree(value.map((day) => dayjs(day).get('date')));
              }}
              mx="auto"
              size="xs"
            />

            <Group>
              <Button
                style={{ flexGrow: 1 }}
                loading={PriLoading}
                onClick={() => HandleUpdate()}
              >
                Update
              </Button>
              <Popover
                width={200}
                position="top-end"
                withArrow
                shadow="md"
                closeOnClickOutside
              >
                <Popover.Target>
                  <ActionIcon size="sm">
                    <InfoCircle />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown p="xs">
                  <Text size="sm">
                    Select dates on which you are not available for consultation
                  </Text>
                </Popover.Dropdown>
              </Popover>
            </Group>
          </Stack>
        </SimpleGrid>
      ) : (
        <Text mt="xl">loading...</Text>
      )}
    </>
  );
};

export default RightProfile;
