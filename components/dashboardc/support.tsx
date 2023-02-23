import {
  Button,
  Container,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';

const SupportComponent = () => {
  const SupportForm = useForm({
    initialValues: {
      subject: '',
      message: '',
    },
  });

  const [PriLoading, setPriLoading] = useState(false);

  const handleSupport = async (values: any) => {
    setPriLoading(true);
    const ress = await fetch('/api/auth/support/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    }).then((res) => res.json());

    if (ress.data) {
      SupportForm.reset();
      showNotification({
        title: 'Success',
        message: 'Your message has been sent successfully',
      });
    } else {
      showNotification({
        title: 'Error',
        message: 'An error occurred while sending your message',
      });
    }

    setPriLoading(false);
  };

  return (
    <Container size="xs" mt="xl">
      <Title>Support</Title>
      <Text color="dimmed" size="sm" mb="md">
        Send us a message, we will get back to you as soon as possible.
      </Text>

      <form onSubmit={SupportForm.onSubmit((values) => handleSupport(values))}>
        <Stack>
          <TextInput
            label="Subject"
            placeholder="Enter subject"
            required
            {...SupportForm.getInputProps('subject')}
          />

          <Textarea
            label="Message"
            placeholder="Enter message"
            required
            minRows={5}
            {...SupportForm.getInputProps('message')}
          />

          <Button type="submit" loading={PriLoading}>Submit</Button>
        </Stack>
      </form>
    </Container>
  );
};

export default SupportComponent;
