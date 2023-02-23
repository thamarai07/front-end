import React, { useState } from 'react';
import {
  Anchor,
  Badge,
  Button,
  Card,
  Center,
  Checkbox,
  Collapse,
  Container,
  Divider,
  FileInput,
  Group,
  Select,
  SimpleGrid,
  SimpleGridBreakpoint,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDidUpdate } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import useRazorpay from 'react-razorpay';
import { useRouter } from 'next/router';
import { useClientDashboardContext } from '../../../lib/client/context/client.dashboard.context';
import parseDate from '../../../lib/funs/parseDate';
import { StateDropData, ePaperData } from '../../../lib/dropdowns';
import POST from '../../../lib/funs/post';
import { ServerResStructure } from '../../../lib/types';

const FormBreakpoints: SimpleGridBreakpoint[] = [
  { maxWidth: 600, cols: 1, spacing: 'xs' },
  { maxWidth: 3000, cols: 2, spacing: 'xs' },
];

const dutyDropdownData = [
  {
    label: '10',
    value: '10',
  },
  {
    label: '20',
    value: '20',
  },
  {
    label: '50',
    value: '50',
  },
  {
    label: '101',
    value: '101',
  },
  {
    label: '150',
    value: '150',
  },
  {
    label: '200',
    value: '200',
  },
  {
    label: '250',
    value: '250',
  },
  {
    label: '300',
    value: '300',
  },
  {
    label: '500',
    value: '500',
  },
  {
    label: '600 (Available only for Karnataka)',
    value: '600',
  },
];

const pagesDropdownData = [
  {
    label: '1 - 5 Pages - Rs. 210',
    value: '210',
  },
  {
    label: 'Upto 10 Pages - Rs. 230',
    value: '230',
  },
  {
    label: 'Upto 15 Pages - Rs. 260',
    value: '260',
  },
  {
    label: 'Upto 20 Pages - Rs. 300',
    value: '300',
  },
];

const StampMainComponent = () => {
  const Razorpay = useRazorpay();
  const Router = useRouter();

  const { StampOrders } = useClientDashboardContext();

  const [OrderNewForm, setOrderNewForm] = useState(false);
  const [PolicyAccepted, setPolicyAccepted] = useState(false);
  const [OrderPrice, setOrderPrice] = useState(214);
  const [PriLoading, setPriLoading] = useState(false);

  const StampOrderForm = useForm<{
    document: File | null;
    adhar: File | null;
    signature: File | null;
    state: string;
    firstParty: string;
    secondParty: string;
    stampType: string;
    duty: string;
    whoPay: string;
    notarial: boolean;
    pagesPrice: string;
  }>({
    initialValues: {
      document: null,
      adhar: null,
      signature: null,
      state: '',
      firstParty: '',
      secondParty: '',
      stampType: '',
      duty: '10',
      whoPay: '1',
      notarial: false,
      pagesPrice: '210',
    },

    validate: (values) => {
      const errors: any = {};

      // check for document, is under 10MB
      if (values.document && values.document.size > 10000000) {
        errors.document = 'Document size should be under 10MB';
      }

      // check fist party name, is not empty and under 50 characters
      if (!values.firstParty) {
        errors.firstParty = 'First party name is required';
      } else if (values.firstParty.length > 50) {
        errors.firstParty = 'First party name should be under 50 characters';
      }

      // if notarial is true, check for adhar and signature
      if (values.notarial) {
        if (!values.adhar) {
          errors.adhar = 'Adhar card is required';
        } else if (values.adhar.size > 500000) {
          errors.adhar = 'Adhar card size should be under 500KB';
        }

        if (!values.signature) {
          errors.signature = 'Signature is required';
        } else if (values.signature.size > 500000) {
          errors.signature = 'Signature size should be under 500KB';
        }
      }

      return errors;
    },
  });

  // every time the duty, notarial, pages changes, update the price
  useDidUpdate(() => {
    let price = 214;

    // check duty value is in dutyDropdownData
    const dutyValue = dutyDropdownData.find(
      (duty) => duty.value === StampOrderForm.values.duty
    );

    // if duty value is in dutyDropdownData, add it to price
    if (dutyValue) {
      price += parseInt(dutyValue.value, 10);
    }

    // if notarial is true, add page price to price
    if (StampOrderForm.values.notarial) {
      price += parseInt(StampOrderForm.values.pagesPrice, 10);
    }

    // set the price
    setOrderPrice(price);
  }, [
    StampOrderForm.values.duty,
    StampOrderForm.values.notarial,
    StampOrderForm.values.pagesPrice,
  ]);

  const handleStampOrder = async () => {
    setPriLoading(true);
    const stampClientOrder: ServerResStructure = await POST(
      '/api/client/stamp/order/create',
      {
        duty: StampOrderForm.values.duty,
        notarial: StampOrderForm.values.notarial,
        pagesPrice: StampOrderForm.values.pagesPrice,
      }
    );

    if (stampClientOrder.statusCode === 200) {
      const options = {
        ...stampClientOrder.data,
        handler: async (response: any) => {
          const data = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            order_id: stampClientOrder?.data?.order_id,
          };

          const paymentRes: ServerResStructure = await POST(
            '/api/client/stamp/order/callback',
            {
              state: StampOrderForm.values.state,
              firstParty: StampOrderForm.values.firstParty,
              secondParty: StampOrderForm.values.secondParty,
              stampType: StampOrderForm.values.stampType,
              duty: StampOrderForm.values.duty,
              whoPay: StampOrderForm.values.whoPay,
              notarial: StampOrderForm.values.notarial,
              pagesPrice: StampOrderForm.values.pagesPrice,
              // stampDoc: StampOrderForm.values.document,
              // aadhaarDoc: StampOrderForm.values.adhar,
              // signatureDoc: StampOrderForm.values.signature,
              payment: data,
            }
          );

          if (paymentRes.statusCode === 200) {
            console.log(paymentRes);

            showNotification({
              title: 'success',
              message: paymentRes.message,
            });

            Router.reload();
          } else {
            showNotification({
              title: 'error',
              message: paymentRes.message,
            });
          }
        },
      };

      const rzp1 = new Razorpay(options);
      rzp1.open();
    } else {
      showNotification({
        title: 'error',
        message: stampClientOrder.message,
      });
    }
    setPriLoading(false);
  };

  return (
    <>
      {OrderNewForm ? (
        <>
          <Container pt="xl" pb={250}>
            <Stack>
              <Group position="apart" align="end">
                <Title>New Stamp Paper</Title>

                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => setOrderNewForm(false)}
                >
                  cancel
                </Button>
              </Group>

              <form
                onSubmit={StampOrderForm.onSubmit(() => handleStampOrder())}
              >
                <Stack spacing="xs">
                  <SimpleGrid
                    cols={2}
                    style={{ alignItems: 'end' }}
                    breakpoints={FormBreakpoints}
                  >
                    <Select
                      data={StateDropData.filter(
                        (state) =>
                          state.state === 'Delhi' ||
                          state.state === 'Uttar Pradesh'
                      ).map((state) => ({
                        label: state.state,
                        value: state.state,
                      }))}
                      label="State"
                      placeholder="Select State"
                      searchable
                      nothingFound="No state found"
                      size="xs"
                      required
                      {...StampOrderForm.getInputProps('state')}
                    />

                    <FileInput
                      placeholder="Pick file ( 10MB Max )"
                      label="Your document"
                      description="Kindly upload ‘Filled Word or PDF Doc’ only, Blank Document and/or Scan image will not taken into consideration for execution."
                      required
                      withAsterisk
                      size="xs"
                      {...StampOrderForm.getInputProps('document')}
                    />
                  </SimpleGrid>

                  <SimpleGrid
                    cols={2}
                    style={{ alignItems: 'end' }}
                    breakpoints={FormBreakpoints}
                  >
                    <TextInput
                      size="xs"
                      label="First Party Name"
                      required
                      placeholder="Name of the first party"
                      {...StampOrderForm.getInputProps('firstParty')}
                    />
                    <TextInput
                      size="xs"
                      label="Second Party Name"
                      placeholder="Name of the second party if any"
                      {...StampOrderForm.getInputProps('secondParty')}
                    />
                  </SimpleGrid>

                  <SimpleGrid
                    cols={2}
                    style={{ alignItems: 'end' }}
                    breakpoints={FormBreakpoints}
                  >
                    <Select
                      data={ePaperData}
                      label="Choose your e-Stamp Paper"
                      placeholder="Select e-Stamp Paper"
                      searchable
                      nothingFound="No e-Stamp Paper found"
                      size="xs"
                      required
                      {...StampOrderForm.getInputProps('stampType')}
                    />

                    <TextInput
                      description="If you want any other e-Stamp Paper which is not mentioned in the List,then Write the Name here"
                      size="xs"
                      placeholder="Write Name here"
                      {...StampOrderForm.getInputProps('stampType')}
                    />
                  </SimpleGrid>

                  <SimpleGrid
                    cols={2}
                    style={{ alignItems: 'end' }}
                    breakpoints={FormBreakpoints}
                  >
                    <Select
                      defaultValue="10"
                      data={dutyDropdownData}
                      label="Choose your e-Stamp Paper"
                      description="For Maharashtra only 100 & 500 values are available."
                      placeholder="Select e-Stamp Paper"
                      searchable
                      nothingFound="No e-Stamp Paper found"
                      size="xs"
                      required
                      {...StampOrderForm.getInputProps('duty')}
                    />

                    <Select
                      data={[
                        { value: '1', label: 'First Party' },
                        { value: '2', label: 'Second Party' },
                      ]}
                      label="Who pay the Stamp Duty"
                      defaultValue="First Party"
                      placeholder="Select stamp duty payer"
                      size="xs"
                      required
                      {...StampOrderForm.getInputProps('whoPay')}
                    />
                  </SimpleGrid>

                  <Divider label="Additional Service" />

                  <Checkbox
                    label="Notarial Service"
                    description="Documents like ‘Power of Attorney, Loan Agreement, Gift Deed’ and / or any other Document related to Monetary Transaction except Rental Agreement cannot be Notarized."
                    {...StampOrderForm.getInputProps('notarial')}
                  />

                  <Collapse in={StampOrderForm.values.notarial}>
                    <Stack spacing="xs">
                      <Select
                        data={pagesDropdownData}
                        label="Select Pages"
                        description="For your Document for Notary Attestation"
                        placeholder="Select stamp duty payer"
                        size="xs"
                        withAsterisk
                        {...StampOrderForm.getInputProps('pagesPrice')}
                      />

                      <SimpleGrid
                        cols={2}
                        style={{ alignItems: 'end' }}
                        breakpoints={FormBreakpoints}
                      >
                        <FileInput
                          placeholder="Pick file ( 500KB Max )"
                          label="Aadhaar Card"
                          description="Upload ID proof (Aadhaar Card) for Notary purpose"
                          withAsterisk
                          size="xs"
                          {...StampOrderForm.getInputProps('aadhaar')}
                        />
                        <FileInput
                          placeholder="Pick file ( 500KB Max )"
                          label="Signature"
                          description="Upload for Notary purpose"
                          withAsterisk
                          size="xs"
                          {...StampOrderForm.getInputProps('signature')}
                        />
                      </SimpleGrid>

                      <Checkbox
                        mt="md"
                        label={
                          <Anchor href="/policy/terms">
                            Terms & Conditions
                          </Anchor>
                        }
                        description="I hereby confirm that the uploaded Documents belongs to the applicant which has been authorized before uploading & I accept the Terms & Conditions."
                        checked={PolicyAccepted}
                        onChange={() => setPolicyAccepted(!PolicyAccepted)}
                      />
                    </Stack>
                  </Collapse>
                  <Divider
                    label="Service Charge Rs. 214/- (included)"
                    mt="md"
                  />

                  <Group position="apart" align="center">
                    <Title order={3}>{OrderPrice} INR</Title>
                    <Button
                      size="xs"
                      variant="filled"
                      color="green"
                      loading={PriLoading}
                      disabled={
                        !PolicyAccepted && StampOrderForm.values.notarial
                      }
                      type="submit"
                    >
                      Pay for Order
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Stack>
          </Container>
        </>
      ) : (
        <>
          <Container mt="xl">
            <Stack>
              <Group position="apart" align="end">
                <Title>Stamp Orders</Title>

                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => setOrderNewForm(true)}
                >
                  Order new
                </Button>
              </Group>

              <Stack>
                {StampOrders.length > 0 ? (
                  React.Children.toArray(
                    StampOrders.map((order) => (
                      <Card py="sm">
                        <Stack spacing="xs">
                          <Group position="apart">
                            <Text size="sm" weight="bold">
                              {`${parseDate(order.createdAt, 'date')} | ${
                                order.state
                              }`}
                            </Text>

                            <Badge>{order.status}</Badge>
                          </Group>

                          <Divider />

                          <Group align="end">
                            <Text size="xs" weight="bold">
                              First Party
                            </Text>

                            <Text size="xs">{order.firstParty}</Text>
                          </Group>
                          <Group align="end">
                            <Text size="xs" weight="bold">
                              Second Party
                            </Text>

                            <Text size="xs">{order.secondParty}</Text>
                          </Group>

                          <Divider />
                          <Group align="end" position="apart">
                            <Text size="xs" color="dimmed">
                              Service Charge + Stamp Duty + Notrial Fee ( if any
                              )
                            </Text>

                            <Text size="sm" weight="bold">
                              {order.price} INR
                            </Text>
                          </Group>
                        </Stack>
                      </Card>
                    ))
                  )
                ) : (
                  <Center style={{ height: '30vh' }}>
                    <Title order={2} color="gray">
                      Empty
                    </Title>
                  </Center>
                )}
              </Stack>
            </Stack>
          </Container>
        </>
      )}
    </>
  );
};

export default StampMainComponent;
