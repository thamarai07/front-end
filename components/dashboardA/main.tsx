import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Container,
  Group,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Space,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { Filter, Search } from 'tabler-icons-react';
import { Children, useState } from 'react';
import { useForm } from '@mantine/form';
import AdvoDashboardHeader from './header';
import { useAdvoDashboardContext } from '../../lib/advocate/context/advo.dashboard.context';
import AdvoRighDrawer from './drawer/drawer.main';
import TicketsCard from '../dashboardc/tickets/ticket.card';
import AdvocateProfile from './profile/profile';
import RightProfile from './profile/right.profile';
import useOwnMedia from '../../lib/hooks/useOwnMedia';
import AdvoDashboardFooter from './footer';
import PayoutComponent from './payout';
import ResourcesComponent from './resources';
import SupportComponent from '../dashboardc/support';

const AdvocateDashboard = () => {
  const {
    AdvoTic,
    SetRightDrawerContent,
    SearchedTic,
    SearchTicket,
    SearchedTicHandler,
    DashState,
  } = useAdvoDashboardContext();

  const { BigThan800 } = useOwnMedia();

  const [FilterPanel, setFilterPanel] = useState(false);

  const TicSearchForm = useForm({
    initialValues: {
      id: '',
      status: 'All',
      price: 0,
    },
  });

  return (
    <>
      <div className="layout">
        <div className="row header">
          <AdvoDashboardHeader />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            position: 'relative',
          }}
          className="row content"
        >
          <AdvoRighDrawer />
          <div
            style={{
              flexGrow: 1,
              height: '100%',
              flexFlow: 'column',
              display: 'flex',
            }}
          >
            <div className="row content">
              {DashState === 'profile' && <AdvocateProfile />}

              {DashState === 'payout' && <PayoutComponent />}

              {DashState === 'resources' && <ResourcesComponent />}

              {DashState === 'support' && <SupportComponent />}

              {DashState === 'dash' && (
                <div>
                  <Container pt={80}>
                    <SimpleGrid>
                      <form
                        onSubmit={TicSearchForm.onSubmit(async (values) => {
                          SearchTicket(values);
                        })}
                      >
                        <TextInput
                          sx={() => ({
                            backgroundColor: '#161616',
                            padding: '0px 20px 0px 20px',
                            borderRadius: '7px',
                            border: '5px solid rgba(24, 24, 24, 0.7)',
                          })}
                          placeholder="Search tickets"
                          variant="unstyled"
                          color="light"
                          rightSection={
                            <ActionIcon type="submit" variant="transparent">
                              <Search color="gray" strokeWidth={3} size={19} />
                            </ActionIcon>
                          }
                          {...TicSearchForm.getInputProps('id')}
                        />

                        <Space my="md" />

                        <Paper
                          sx={() => ({
                            backgroundColor: '#161616',
                            padding: '5px 20px 5px 20px',
                            borderRadius: '7px',
                            border: '5px solid rgba(24, 24, 24, 0.7)',
                          })}
                        >
                          <Group position="apart">
                            <Text weight="bold" size="sm">
                              Filter
                            </Text>

                            <ActionIcon
                              onClick={() => setFilterPanel(!FilterPanel)}
                              variant="transparent"
                              type="button"
                            >
                              <Filter color="gray" />
                            </ActionIcon>
                          </Group>

                          <Collapse in={FilterPanel}>
                            <Group>
                              <NumberInput
                                label="Price below"
                                {...TicSearchForm.getInputProps('price')}
                              />

                              <Select
                                label="Status"
                                data={[
                                  'All',
                                  'UNDERREVIEW',
                                  'OPEN',
                                  'CLOSE',
                                  'REFUNDED',
                                ]}
                                {...TicSearchForm.getInputProps('status')}
                              />
                            </Group>
                          </Collapse>
                        </Paper>
                      </form>
                      <Group grow>
                        {SearchedTic.length > 0 ? (
                          <Stack style={{ width: '100%' }}>
                            <Group position="apart">
                              <Text weight="bold">Search result</Text>
                              <Button
                                color="yellow"
                                variant="outline"
                                compact
                                onClick={() => SearchedTicHandler.setState([])}
                              >
                                Clear
                              </Button>
                            </Group>
                            <Group>
                              {Children.toArray(
                                SearchedTic.map((ticket) => (
                                  <TicketsCard
                                    ticket={ticket}
                                    SetRightDrawerContent={
                                      SetRightDrawerContent as any
                                    }
                                  />
                                ))
                              )}
                            </Group>
                          </Stack>
                        ) : (
                          <SimpleGrid>
                            <Text weight="bold">All Tickets</Text>
                            <SimpleGrid
                              breakpoints={[
                                { maxWidth: 385, cols: 1, spacing: 'md' },
                                { maxWidth: 557, cols: 2, spacing: 'md' },
                                { maxWidth: 1100, cols: 3, spacing: 'md' },
                                { maxWidth: 2000, cols: 4, spacing: 'md' },
                                { maxWidth: 3000, cols: 5, spacing: 'md' },
                                { maxWidth: 4000, cols: 6, spacing: 'md' },
                              ]}
                              style={{ overflow: 'auto' }}
                            >
                              {Children.toArray(
                                AdvoTic.map((ticket) => (
                                  <TicketsCard
                                    ticket={ticket}
                                    SetRightDrawerContent={
                                      SetRightDrawerContent as any
                                    }
                                  />
                                ))
                              )}
                            </SimpleGrid>
                          </SimpleGrid>
                        )}
                      </Group>
                    </SimpleGrid>
                  </Container>
                </div>
              )}
            </div>
            <div style={{ flex: '0 1 auto' }}>
              <AdvoDashboardFooter />
            </div>
          </div>
          {BigThan800 && (
            <Box
              style={{
                flexShrink: 1,
                maxWidth: '350px',
                backgroundColor: 'rgba(250,250,250,0.1)',
                overflow: 'auto',
                scrollbarWidth: 'none',
              }}
              p="xl"
            >
              <RightProfile />
            </Box>
          )}
        </div>
      </div>
    </>
  );
};

export default AdvocateDashboard;
