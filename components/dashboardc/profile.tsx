import {
  Avatar,
  Button,
  Container,
  FileButton,
  Group,
  Loader,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import POST from '../../lib/funs/post';
import { useClientDashboardContext } from '../../lib/client/context/client.dashboard.context';
import { StateDropData } from '../../lib/dropdowns';

const ClientProfile = () => {
  const { LoggedClient, setLoggedClient } = useClientDashboardContext();
  const [PriLoading, setPriLoading] = useState(false);
  const [NewAvatar, setNewAvatar] = useState<File | null>(null);

  const uploadAvatar = async () => {
    if (NewAvatar) {
      setPriLoading(true);
      const formData = new FormData();
      formData.append('avatar', NewAvatar);
      const updatedUser = await fetch('/api/auth/user/avatar', {
        method: 'POST',
        body: formData,
      }).then((res) => res.json());

      if (updatedUser.statusCode === 201) {
        showNotification({
          title: 'Success',
          message: 'Avatar Updated',
        });
      } else {
        showNotification({
          title: 'Error',
          message: updatedUser.message,
        });
      }

      setNewAvatar(null);
      setPriLoading(false);
    }
  };

  useEffect(() => {
    if (NewAvatar) {
      uploadAvatar();
    }
  }, [NewAvatar]);

  const updateForm = useForm({
    initialValues: {
      name: LoggedClient?.name || '',
      city: LoggedClient?.city || '',
      state: LoggedClient?.state || '',
      pincode: LoggedClient?.pincode || 0,
      country: LoggedClient?.country || '',
    },
  });

  const updateProfile = async (params: {
    name: string;
    city: string;
    state: string;
    pincode: number;
    country: string;
  }) => {
    setPriLoading(true);
    const updatedUser = await POST('/api/client/profile/update', params);

    if (updatedUser.data) {
      setLoggedClient(updatedUser.data);
      alert('Profile Updated');
    } else {
      alert(updatedUser.message);
    }
    setPriLoading(false);
  };

  return (
    <>
      <Container my="xl" size="xs">
        <Stack>
          <Group position="apart">
            <Title order={1}>Profile</Title>

            <FileButton onChange={setNewAvatar} accept="image/png,image/jpg">
              {(props) => (
                <Avatar
                  {...props}
                  src={`/api/auth/user/avatar/${LoggedClient?.id}`}
                  style={{
                    cursor: 'pointer',
                  }}
                />
              )}
            </FileButton>
          </Group>
          {LoggedClient ? (
            <form
              onSubmit={updateForm.onSubmit((values) => updateProfile(values))}
            >
              <Group grow>
                <Stack spacing="sm">
                  <TextInput
                    label="Email"
                    value={LoggedClient.email}
                    readOnly
                  />
                  <TextInput
                    label="Phone number"
                    value={LoggedClient.phone}
                    readOnly
                    icon={<Text size="sm">+91</Text>}
                  />
                  <TextInput
                    label="Name"
                    {...updateForm.getInputProps('name')}
                  />
                  <Select
                    data={StateDropData.map((state) => state.state)}
                    label="State"
                    placeholder="Select State"
                    searchable
                    nothingFound="No state found"
                    {...updateForm.getInputProps('state')}
                  />
                  <Select
                    data={
                      StateDropData.filter(
                        (state) => state.state === updateForm.values.state
                      )[0]?.districts || []
                    }
                    label="District"
                    placeholder="Select District"
                    searchable
                    nothingFound="No district found"
                    {...updateForm.getInputProps('city')}
                  />
                  <NumberInput
                    hideControls
                    label="Pincode"
                    {...updateForm.getInputProps('pincode')}
                  />
                  {/* <TextInput
                    label="country"
                    {...updateForm.getInputProps('country')}
                  /> */}

                  <Button loading={PriLoading} color="yellow" type="submit">
                    Update
                  </Button>
                </Stack>
              </Group>
            </form>
          ) : (
            <Loader size="sm" mx="auto" />
          )}
        </Stack>
      </Container>
    </>
  );
};

export default ClientProfile;
