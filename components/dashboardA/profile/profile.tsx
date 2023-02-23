import {
  Avatar,
  Button,
  Container,
  Divider,
  FileButton,
  Group,
  Loader,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import POST from '../../../lib/funs/post';
import { useAdvoDashboardContext } from '../../../lib/advocate/context/advo.dashboard.context';
import { SpecializationDropData, StateDropData } from '../../../lib/dropdowns';

const AdvocateProfile = () => {
  const { setLoggedAdvo, LoggedAdvo } = useAdvoDashboardContext();
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
      name: LoggedAdvo?.name || '',
      city: LoggedAdvo?.city || '',
      state: LoggedAdvo?.state || '',
      pincode: LoggedAdvo?.pincode || 0,
      country: LoggedAdvo?.country || '',
      experience: LoggedAdvo?.experience || 0,
      speciality: LoggedAdvo?.speciality || '',
      court: LoggedAdvo?.court || '',
      languages: LoggedAdvo?.languages || '',
      designation: LoggedAdvo?.designation || '',
      price: LoggedAdvo?.price || 0,
      accHolder: LoggedAdvo?.accHolder || '',
      accNumber: LoggedAdvo?.accNumber || '',
      accIfsc: LoggedAdvo?.accIfsc || '',
      accbankName: LoggedAdvo?.accbankName || '',
    },
  });

  const updateProfile = async (params: {
    name: string;
    city: string;
    state: string;
    pincode: number;
    country: string;
    experience: number;
    speciality: string;
    court: string;
    languages: string;
    designation: string;
    price: number;
    accHolder: string;
    accNumber: string;
    accIfsc: string;
    accbankName: string;
  }) => {
    setPriLoading(true);
    const updatedUser = await POST('/api/advocate/profile/update', params);

    if (updatedUser.data) {
      setLoggedAdvo(updatedUser.data);
      showNotification({
        title: 'Success',
        message: 'Profile Updated',
      });
    } else {
      showNotification({
        title: 'Error',
        message: updatedUser.message,
      });
    }
    setPriLoading(false);
  };

  return (
    <>
      <Container my="xl" size="xs">
        <SimpleGrid>
          <Group position="apart">
            <Title order={1}>Profile</Title>

            <FileButton onChange={setNewAvatar} accept="image/png,image/jpg">
              {(props) => (
                <Avatar
                  {...props}
                  src={`/api/auth/user/avatar/${LoggedAdvo?.id}`}
                  style={{
                    cursor: 'pointer',
                  }}
                />
              )}
            </FileButton>
          </Group>
          {LoggedAdvo ? (
            <form
              onSubmit={updateForm.onSubmit((values) => updateProfile(values))}
            >
              <Stack>
                <TextInput label="Name" {...updateForm.getInputProps('name')} />

                <NumberInput
                  hideControls
                  placeholder="xxxx"
                  label="Your consultation price"
                  description="Enter final price including gst (18%) and payment gateway charges (2.5%)"
                  {...updateForm.getInputProps('price')}
                />

                <Divider label="Personal details" />

                <Group grow>
                  <Stack>
                    <TextInput
                      label="Email"
                      value={LoggedAdvo.email}
                      readOnly
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
                      label="Pincode"
                      hideControls
                      {...updateForm.getInputProps('pincode')}
                    />

                    <TextInput
                      label="Languages"
                      {...updateForm.getInputProps('languages')}
                    />
                  </Stack>
                  <Stack>
                    <TextInput
                      label="Phone number"
                      value={LoggedAdvo.phone}
                      readOnly
                      icon={<Text size="sm">+91</Text>}
                    />
                    <Select
                      data={SpecializationDropData}
                      label="Practice Area"
                      placeholder="Select Practice Area"
                      searchable
                      nothingFound="No options found"
                      {...updateForm.getInputProps('speciality')}
                    />
                    <TextInput
                      label="Court"
                      {...updateForm.getInputProps('court')}
                    />
                    <NumberInput
                      label="Experience"
                      hideControls
                      {...updateForm.getInputProps('experience')}
                    />
                    <Select
                      data={['Sample', 'Sample 2', 'Sample 3', 'Sample 4']}
                      label="Designation"
                      {...updateForm.getInputProps('designation')}
                    />
                  </Stack>
                </Group>

                <Divider label="Bank details" />
                <TextInput
                  label="Bank Name"
                  placeholder='Eg: "State Bank of India"'
                  {...updateForm.getInputProps('accbankName')}
                />

                <TextInput
                  label="Account Number"
                  placeholder="Enter your account number"
                  {...updateForm.getInputProps('accNumber')}
                />

                <TextInput
                  label="IFSC Code"
                  placeholder="Enter your IFSC code"
                  {...updateForm.getInputProps('accIfsc')}
                />

                <TextInput
                  label="Account Holder Name"
                  placeholder="Enter your account holder name"
                  {...updateForm.getInputProps('accHolder')}
                />
              </Stack>
              <Button
                fullWidth
                mt="md"
                loading={PriLoading}
                color="yellow"
                type="submit"
              >
                Update
              </Button>
            </form>
          ) : (
            <Loader size="sm" mx="auto" />
          )}
        </SimpleGrid>
      </Container>
    </>
  );
};

export default AdvocateProfile;
