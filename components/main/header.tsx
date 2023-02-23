import React from 'react';
import {
  Header,
  Group,
  Image,
  UnstyledButton,
  Text,
  Button,
} from '@mantine/core';
import Link from 'next/link';
import useOwnMedia from '../../lib/hooks/useOwnMedia';

const DefaultHeader = () => {
  const { BigThan920 } = useOwnMedia();

  return (
    <Header
      height={70}
      px="md"
      style={{
        backgroundColor: '#000',
      }}
    >
      <Group grow position="apart" sx={{ height: '100%' }}>
        <Group>
          <Image src="/images/h-logo-dark.png" alt="LegalDoji" width={150} />
        </Group>

        {BigThan920 && (
          <Group position="center" spacing="xl">
            <UnstyledButton component={Link} href="/">
              <Text size="xs">Home</Text>
            </UnstyledButton>
            <UnstyledButton>
              <Text size="xs">About us</Text>
            </UnstyledButton>
            <UnstyledButton>
              <Text size="xs">FAQs</Text>
            </UnstyledButton>
            <UnstyledButton>
              <Text size="xs" component={Link} href="/signupa">
                Join us
              </Text>
            </UnstyledButton>
          </Group>
        )}

        <Group position="right" mx="auto">
          <Button
            component={Link}
            href="/login"
            radius="xl"
            variant="filled"
            color="yellow"
          >
            Sign in
          </Button>
          <Button
            component={Link}
            href="/signup"
            radius="xl"
            variant="outline"
            color="yellow"
          >
            Sign up
          </Button>
        </Group>
      </Group>
    </Header>
  );
};

export default DefaultHeader;
