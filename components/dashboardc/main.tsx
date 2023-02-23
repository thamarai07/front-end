import {
  ActionIcon,
  Box,
  Collapse,
  Container,
  Group,
  Select,
  NumberInput,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Space,
  Tooltip,
} from '@mantine/core';
import { Filter, Search, Ticket } from 'tabler-icons-react';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import DashboardFooter from './footer';
import DashboardHeader from './header';
import TicketsFullPanel from './tickets/ticket.full.panel';
import SomeAdvocatesPanel from './advocates/some.panel';
import RighDrawer from './drawer/drawer.main';
import { useClientDashboardContext } from '../../lib/client/context/client.dashboard.context';
import SearchAdvoPanel from './advocates/search.show.panel';
import ClientProfile from './profile';
import useOwnMedia from '../../lib/hooks/useOwnMedia';
import {
  ExperienceDropData,
  RatingDropData,
  SpecializationDropData,
  StateDropData,
} from '../../lib/dropdowns';
import StampMainComponent from './stamp/stamp.main';
import SupportComponent from './support';

const ClientDashboard = () => {
  const { SearchAdvocates, SearchAdvo, DashState, LoggedClient, setDashState } =
    useClientDashboardContext();
  const [FilterPanel, setFilterPanel] = useState(false);

  const { BigThan920, BigThan540 } = useOwnMedia();

  const AdvoSearchForm = useForm({
    initialValues: {
      name: '',
      experience: '0+',
      priceMin: 0,
      priceMax: 10000,
      rating: '0+',
      language: '',
      court: '',
      designation: '',
      state: LoggedClient?.state || '',
      city: LoggedClient?.city || '',
      speciality: '',
    },
  });

  return (
    <>
      <div className="layout">
        <div className="row header">
          <DashboardHeader />
        </div>
        <div
          className="layout content"
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            position: 'relative',
          }}
        >
          <RighDrawer />

          <div
            style={{
              flexGrow: 1,
              height: '100%',
              flexFlow: 'column',
              display: 'flex',
            }}
          >
            <div
              className="row content"
              style={{ overflow: 'scroll', scrollbarWidth: 'none' }}
            >
              <TicketsFullPanel />

              {DashState === 'dash' && (
                <Tooltip label="Recent appointments" position="top-end">
                  <ActionIcon
                    onClick={() => setDashState('tics')}
                    variant="filled"
                    radius="xl"
                    color="blue"
                    size="xl"
                    style={{
                      bottom: BigThan540 ? '20px' : '80px',
                      right: BigThan920 ? '320px' : '20px',
                      position: 'fixed',
                      zIndex: 100,
                    }}
                  >
                    <Ticket />
                  </ActionIcon>
                </Tooltip>
              )}

              {DashState === 'profile' && <ClientProfile />}

              {DashState === 'stamp' && <StampMainComponent />}

              {DashState === 'support' && <SupportComponent />}

              {DashState === 'dash' && (
                <>
                  <Container pt={30} size="xl">
                    <SimpleGrid>
                      <form
                        onSubmit={AdvoSearchForm.onSubmit(async (values) => {
                          SearchAdvocates({
                            ...values,
                            experience: parseInt(
                              AdvoSearchForm.values.experience.split('')[0],
                              10
                            ),

                            rating: parseInt(
                              AdvoSearchForm.values.rating.split('')[0],
                              10
                            ),
                          });
                        })}
                      >
                        <TextInput
                          size="xs"
                          sx={() => ({
                            backgroundColor: '#161616',
                            padding: '0px 20px 0px 20px',
                            borderRadius: '7px',
                            border: '5px solid rgba(24, 24, 24, 0.7)',
                          })}
                          placeholder="Search advocate"
                          variant="unstyled"
                          color="light"
                          {...AdvoSearchForm.getInputProps('name')}
                          rightSection={
                            <ActionIcon variant="transparent" type="submit">
                              <Search color="gray" strokeWidth={3} size={19} />
                            </ActionIcon>
                          }
                        />

                        <Space my="md" />

                        <Paper
                          sx={() => ({
                            backgroundColor: '#161616',
                            padding: '5px 25px 5px 25px',
                            borderRadius: '7px',
                            border: '3px solid rgba(24, 24, 24, 0.7)',
                          })}
                        >
                          <Group position="apart">
                            <Text weight="bold" size="xs">
                              Filter
                            </Text>

                            <ActionIcon
                              onClick={() => setFilterPanel(!FilterPanel)}
                              variant="transparent"
                            >
                              <Filter color="gray" />
                            </ActionIcon>
                          </Group>

                          <Collapse in={FilterPanel}>
                            <Group position="apart" grow>
                              <Stack spacing="xs">
                                <Select
                                  data={ExperienceDropData}
                                  label="Experience"
                                  placeholder="0+"
                                  {...AdvoSearchForm.getInputProps(
                                    'experience'
                                  )}
                                />
                                <Select
                                  label="Rating"
                                  data={RatingDropData}
                                  {...AdvoSearchForm.getInputProps('rating')}
                                />
                                <Group grow align="end">
                                  <NumberInput
                                    hideControls
                                    defaultValue={0}
                                    label="Price range"
                                    {...AdvoSearchForm.getInputProps(
                                      'priceMin'
                                    )}
                                  />

                                  <NumberInput
                                    hideControls
                                    defaultValue={0}
                                    {...AdvoSearchForm.getInputProps(
                                      'priceMax'
                                    )}
                                  />
                                </Group>
                              </Stack>
                              <Stack spacing="xs">
                                <Select
                                  data={['', 'SomeCourt', 'CourtSome']}
                                  label="Court"
                                  {...AdvoSearchForm.getInputProps('court')}
                                />

                                <Select
                                  data={SpecializationDropData}
                                  label="Practice Area"
                                  placeholder="Select Practice Area"
                                  searchable
                                  nothingFound="No options found"
                                  {...AdvoSearchForm.getInputProps(
                                    'speciality'
                                  )}
                                />
                                <Select
                                  data={['', 'Goat', 'Sup']}
                                  label="Designation"
                                  {...AdvoSearchForm.getInputProps(
                                    'designation'
                                  )}
                                />
                              </Stack>
                              <Stack spacing="xs">
                                <Select
                                  data={StateDropData.map(
                                    (state) => state.state
                                  )}
                                  label="State"
                                  placeholder="Select State"
                                  searchable
                                  nothingFound="No state found"
                                  {...AdvoSearchForm.getInputProps('state')}
                                />
                                <Select
                                  data={
                                    StateDropData.filter(
                                      (state) =>
                                        state.state ===
                                        AdvoSearchForm.values.state
                                    )[0]?.districts || []
                                  }
                                  label="District"
                                  placeholder="Select District"
                                  searchable
                                  nothingFound="No district found"
                                  {...AdvoSearchForm.getInputProps('city')}
                                />
                                <Select
                                  data={['', 'English', 'Hindi']}
                                  label="Language"
                                  {...AdvoSearchForm.getInputProps('language')}
                                />
                              </Stack>
                            </Group>
                          </Collapse>
                        </Paper>
                      </form>

                      {SearchAdvo.length === 0 ? (
                        <SomeAdvocatesPanel />
                      ) : (
                        <SearchAdvoPanel />
                      )}
                    </SimpleGrid>
                  </Container>
                </>
              )}
            </div>

            <div style={{ flex: '0 1 auto' }}>
              <DashboardFooter />
            </div>
          </div>
          {BigThan920 && (
            <Box
              style={{
                flexShrink: 1,
                minWidth: '300px',
                backgroundColor: 'rgba(250,250,250,0.1)',
              }}
              p="xl"
            >
              <Text size="xl" weight="bold">
                Recent Blogs
              </Text>
            </Box>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientDashboard;
