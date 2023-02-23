import {
  ActionIcon,
  Avatar,
  Button,
  Divider,
  Group,
  SimpleGrid,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { ArrowBarRight } from 'tabler-icons-react';
import { useClientDashboardContext } from '../../../lib/client/context/client.dashboard.context';

const DrawerViewAdvocate = () => {
  const { ViewAdvo, SetRightDrawerContent } = useClientDashboardContext();

  return (
    <>
      {ViewAdvo && (
        <SimpleGrid>
          <Group position="apart">
            <Title weight="bold" order={4}>
              Advocate
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
          <SimpleGrid>
            <Group position="left">
              <Avatar size="lg" radius={50} src={`/api/auth/user/avatar/${ViewAdvo?.id}`} />

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
                  {ViewAdvo.name}
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
                  LA{ViewAdvo.id.slice(-6)}
                </Text>
              </SimpleGrid>
            </Group>
            <Group position="apart">
              <Text size="sm" weight="bold">
                {ViewAdvo.city} - {ViewAdvo.state} - {ViewAdvo.country}
              </Text>

              {/* <Group spacing="xs">
                <Text size="sm">{ViewAdvocate.rating}</Text>
                <Star size={17} />
              </Group> */}
            </Group>

            <Group grow>
              <TextInput
                variant="unstyled"
                readOnly
                label="Court"
                value={ViewAdvo.court || 'Not Available'}
              />

              <TextInput
                variant="unstyled"
                readOnly
                label="Designation"
                value={ViewAdvo.designation || 'Not Available'}
              />
            </Group>
            <Group>
              <TextInput
                variant="unstyled"
                readOnly
                label="Speciality"
                value={ViewAdvo.speciality || 'Not Available'}
              />

              <TextInput
                variant="unstyled"
                readOnly
                label="Experience"
                value={ViewAdvo.experience || 'Not Available'}
              />
            </Group>

            <Button
              onClick={() =>
                SetRightDrawerContent({
                  view: 'book',
                  id: ViewAdvo,
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
        </SimpleGrid>
      )}
    </>
  );
};

export default DrawerViewAdvocate;
