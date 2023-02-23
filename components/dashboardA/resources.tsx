import {
  Anchor,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';

const ResourcesComponent = () => {
  const [Resources, setResources] = useState<any>([]);

  const GetResources = async () => {
    const ress = await fetch('/api/advocate/resources').then((res) =>
      res.json()
    );

    if (ress.data) {
      setResources(ress.data);
    } else {
      showNotification({
        title: 'Error',
        message: ress.message,
      });
    }
  };

  useEffect(() => {
    GetResources();
  }, []);

  return (
    <Container mt="xl">
      <Title>Resources</Title>

      <Stack mt="xl">
        {Resources.map((resource: any) => (
          <Card key={resource.title} py="xs" radius="md">
            <Group position="apart">
              <Text weight="bold" size="xl">
                {resource.title}
              </Text>

              <Anchor
                href={resource.url}
                weight="bold"
                size="sm"
                target="_blank"
                rel="noreferrer noopener"
              >
                Link
              </Anchor>
            </Group>

            <Text color="dimmed" size="sm">
              {resource.des}
            </Text>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default ResourcesComponent;
