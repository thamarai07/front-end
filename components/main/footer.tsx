import { Container, Footer, Group, Image } from '@mantine/core';

const DefaultFooter = () => (
  <>
    <Footer style={{ backgroundColor: '#000' }} height="100%">
      <Container py="xl">
        <Group>
          <Image width={100} src="/images/main-logo.png" />
        </Group>
      </Container>
    </Footer>
  </>
);

export default DefaultFooter;
