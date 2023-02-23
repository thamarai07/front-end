import { useEffect, useState } from 'react';
import { useListState } from '@mantine/hooks';
import useRazorpay from 'react-razorpay';
import { showNotification } from '@mantine/notifications';
import {
  AdvoSearchForm,
  AdvocateTypes,
  ClientDashboardContextTypes,
  ClientOrderTypes,
  ClientTypes,
  StampOrderTypes,
  TicketTypes,
} from './client.context.types';
import { createGenericContext } from '../../create.context';
import { ServerResStructure } from '../../types';
import POST from '../../funs/post';
import { GetUser } from '../../funs/user';

const [useClientDashboardContext, ClientDashboardContextProvider] =
  createGenericContext<ClientDashboardContextTypes>();

const ClientDashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const Razorpay = useRazorpay();

  const [LoggedClient, setLoggedClient] = useState<ClientTypes | null>(null);

  const [SomeAdvo, SomeAdvoHandler] = useListState<AdvocateTypes>();
  const [SearchAdvo, SearchAdvoHandler] = useListState<AdvocateTypes>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [StampOrders, StampOrdersHandler] = useListState<StampOrderTypes>([
    {
      clientId: '5f9f1b0b0b1b8c0b8c8c8c8c',
      documents: [],
      status: 'PENDING',
      state: 'Gujarat',
      firstParty: 'Ramesh Patel',
      secondParty: 'Rajesh Patel',
      price: 800,
      type: 'Stamp',
      createdAt: '2020-11-02T10:30:00.000Z',
      duty: 100,
      whoPays: 'firstParty',
      notarial: false,
      notarialPages: 0,
    },
  ]);

  const [ClientTic, ClientTicsHandler] = useListState<TicketTypes>();

  const [ViewTic, setViewTic] = useState<TicketTypes | null>(null);
  const [ViewAdvo, setViewAdvo] = useState<AdvocateTypes | null>(null);
  const [BookTic, setBookTic] = useState<AdvocateTypes | null>(null);
  const [RightDrawerState, setRightDrawerState] = useState(false);

  const [DashState, setDashState] = useState<
    'dash' | 'profile' | 'tics' | 'stamp' | 'support'
  >('dash');

  const SetRightDrawerContent = ({
    view,
    id,
  }: {
    view: 'book' | 'ticket' | 'advocate' | 'close';
    id: AdvocateTypes | TicketTypes | null;
  }) => {
    switch (view) {
      case 'book':
        setViewAdvo(null);
        setViewTic(null);
        setBookTic(id as AdvocateTypes);
        setRightDrawerState(true);
        break;

      case 'ticket':
        setViewAdvo(null);
        setBookTic(null);
        setViewTic(id as TicketTypes);
        setRightDrawerState(true);
        break;

      case 'advocate':
        setViewTic(null);
        setBookTic(null);
        setViewAdvo(id as AdvocateTypes);
        setRightDrawerState(true);

        break;

      case 'close':
        setRightDrawerState(false);
        break;

      default:
        throw new Error('Invalid View');
    }
  };

  const getPopularAdvocates = async () => {
    // /api/client/advocate/popular
    const popularAdvocates: AdvocateTypes[] = await fetch(
      '/api/client/advocate/popular'
    ).then((res) => res.json());

    SomeAdvoHandler.setState(popularAdvocates);
  };

  const SearchAdvocates = async (param: AdvoSearchForm): Promise<void> => {
    const searchResult: ServerResStructure<AdvocateTypes[]> = await POST(
      '/api/client/advocate/search',
      param
    );

    if (searchResult.statusCode === 200 && searchResult.data) {
      if (searchResult.data.length === 0) {
        showNotification({
          title: 'No Results',
          message: 'No advocates found',
          color: 'red',
        });
        SearchAdvoHandler.setState([]);
      } else {
        SearchAdvoHandler.setState(searchResult.data);
      }
    } else {
      showNotification({
        title: 'Error',
        message: searchResult.message,
        color: 'red',
      });
    }
  };

  const getTickets = async () => {
    // /api/client/ticket/filter , POST
    // status: "OPEN" | "CLOSED"
    // numOfTickets: number
    const tickets: ServerResStructure<TicketTypes[]> = await fetch(
      '/api/client/ticket'
    ).then((res) => res.json());

    // if data, set tickets
    if (tickets.data) {
      ClientTicsHandler.setState(tickets.data);
    }
  };

  const RefundTicket = async (ticketId: string, password: string) => {
    // /api/client/ticket/refund/:ticketId, POST

    SetRightDrawerContent({
      view: 'close',
      id: null,
    });

    // check password not smallet than 6
    if (password.length < 6) {
      showNotification({
        title: 'Error',
        message: 'Password must be atleast 6 characters long',
        color: 'red',
      });

      return;
    }

    const refundedTicket: ServerResStructure<TicketTypes> = await POST(
      '/api/client/ticket/refund',
      {
        ticketId,
        password,
      }
    );

    // if data is null, then there is an error
    if (!refundedTicket.data) {
      showNotification({
        title: 'Error',
        message: refundedTicket.message,
        color: 'red',
      });

      return;
    }

    // find ticket index
    const ticketIndex = ClientTic.findIndex((ticket) => ticket.id === ticketId);

    // remove ticket from tickets
    ClientTicsHandler.remove(ticketIndex);

    // add refunded ticket to tickets
    ClientTicsHandler.prepend(refundedTicket.data);
  };

  const HandleTicFileUpload = async (params: {
    ticketId: string;
    doc: File;
  }) => {
    const formData = new FormData();

    formData.append('doc', params.doc);

    // /api/client/ticket/doc/upload/:ticketId, POST
    const updatedTicket: ServerResStructure<TicketTypes> = await fetch(
      `/api/client/ticket/doc/upload/${params.ticketId}`,
      {
        method: 'POST',
        body: formData,
      }
    ).then((res) => res.json());

    // if data is null, then there is an error
    if (updatedTicket.statusCode === 200 && updatedTicket.data) {
      ClientTicsHandler.applyWhere(
        (ticket) => ticket.id === params.ticketId,
        () => ({ ...updatedTicket.data } as any)
      );

      setViewTic(updatedTicket.data);

      showNotification({
        title: 'success',
        message: 'Document Uploaded',
      });
    } else {
      showNotification({
        title: 'error',
        message: updatedTicket.message,
      });
    }
  };

  const HandleRating = async (params: { ticketId: string; rating: number }) => {
    // /api/client/ticket/rate/:ticketId/:rating, GET
    const ratedTicket: ServerResStructure<TicketTypes> = await fetch(
      `/api/client/ticket/rate/${params.ticketId}/${params.rating}`
    ).then((res) => res.json());

    // if data is null, then there is an error
    if (ratedTicket.statusCode === 200 && ratedTicket.data) {
      ClientTicsHandler.applyWhere(
        (ticket) => ticket.id === params.ticketId,
        () => ({ ...ratedTicket.data } as any)
      );
      setViewTic(ratedTicket.data);
    } else {
      showNotification({
        title: 'error',
        message: ratedTicket.message,
      });
    }
  };

  const HandlePayForTicket = async (
    ticketId: string,
    clientOrder: ClientOrderTypes | null = null
  ) => {
    let internalClientOrder: ClientOrderTypes | null = clientOrder;

    // client order is null, then fetch from server from /api/client/ticket/pay/:ticketId, GET

    if (!internalClientOrder) {
      const clientOrderRes = await fetch(
        `/api/client/ticket/pay/${ticketId}`
      ).then((res) => res.json());

      if (clientOrderRes.statusCode === 200) {
        ClientTicsHandler.applyWhere(
          (ticket) => ticket.id === ticketId,
          () => ({ ...clientOrderRes.data })
        );
        setViewTic(clientOrderRes.data);
        return;
      }
      if (clientOrderRes.statusCode === 201) {
        internalClientOrder = clientOrderRes.data;
      } else {
        showNotification({
          title: 'Error',
          message: clientOrderRes.message,
          color: 'red',
        });
        return;
      }
    }

    if (!internalClientOrder) {
      showNotification({
        title: 'Error',
        message: 'Order is null',
        color: 'red',
      });
      return;
    }

    if (!internalClientOrder.order_id) {
      showNotification({
        title: 'Error',
        message: 'Order id is null',
        color: 'red',
      });
      return;
    }

    const options = {
      ...internalClientOrder,
      handler: async (response: any) => {
        const data = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          order_id: internalClientOrder?.order_id,
        };

        // POST, /api/client/ticket/pay/callback
        const paymentRes: ServerResStructure = await POST(
          '/api/client/ticket/pay/callback',
          data
        );

        // if stausCode is 200, then payment is successful
        if (paymentRes.statusCode === 200) {
          // find ticket index
          ClientTicsHandler.applyWhere(
            (ticket) => ticket.id === ticketId,
            () => ({ ...paymentRes.data })
          );

          setViewTic(paymentRes.data);
          showNotification({
            title: 'Success',
            message: 'Payment Successful',
          });
        } else {
          showNotification({
            title: 'Error',
            message: paymentRes.message,
            color: 'red',
          });
        }
      },
    };

    const paymentObject = new Razorpay(options);
    paymentObject.open();
  };

  const HandleBookTicket = async (ticketData: {
    meetDate: string;
    description: string;
  }) => {
    // /api/client/ticket/create, POST
    const newTicket: ServerResStructure = await POST(
      '/api/client/ticket/create',
      {
        ...ticketData,
        advocateId: BookTic?.id,
      }
    );

    // if data is null, then there is an error\
    if (!newTicket.data) {
      showNotification({
        title: 'Error',
        message: newTicket.message,
        color: 'red',
      });
      return {
        success: false,
        message: newTicket.message,
      };
    }

    // push new ticket to client tickets
    ClientTicsHandler.prepend(newTicket.data.ticket);

    if (newTicket.data.ticket.price !== 0) {
      HandlePayForTicket(
        newTicket.data.ticket.id,
        newTicket.data.razorpayOrder
      );
    }

    return {
      success: true,
      message: newTicket.message,
    };
  };

  const HandleSendMessage = async (ticketId: string, message: string) => {
    // if messafge bigger than 200
    if (message.length > 200) {
      showNotification({
        title: 'Error',
        message: 'Message is too long',
        color: 'red',
      });
      return;
    }

    const MsgSendRes = await POST('/api/client/ticket/message', {
      ticketId,
      message,
    });

    if (MsgSendRes.statusCode === 200) {
      // find ticket index
      const ticketIndex = ClientTic.findIndex(
        (ticket) => ticket.id === ticketId
      );

      // remove ticket from tickets
      ClientTicsHandler.remove(ticketIndex);

      // add refunded ticket to tickets
      ClientTicsHandler.prepend(MsgSendRes.data);

      setViewTic(MsgSendRes.data);
    } else {
      showNotification({
        title: 'Error',
        message: MsgSendRes.message,
        color: 'red',
      });
    }
  };

  const HandleMeetGen = async (ticketId: string) => {
    // /api/client/ticket/meet/create/:ticketId, GET
    const meetGenRes: ServerResStructure<TicketTypes> = await fetch(
      `/api/client/ticket/meet/create/${ticketId}`
    ).then((res) => res.json());

    // if data is null, then there is an error
    if (!meetGenRes.data) {
      showNotification({
        title: 'Error',
        message: meetGenRes.message,
        color: 'red',
      });
    } else {
      // find ticket index
      const ticketIndex = ClientTic.findIndex(
        (ticket) => ticket.id === ticketId
      );

      // remove ticket from tickets
      ClientTicsHandler.remove(ticketIndex);

      // add refunded ticket to tickets
      ClientTicsHandler.prepend(meetGenRes.data);

      setViewTic(meetGenRes.data);
    }
  };

  const getUser = async () => {
    const fetchRes = await GetUser();

    setLoggedClient(fetchRes);
  };

  const StampOrderList = async () => {
    const fetchRes = await fetch('/api/client/stamp/order/list').then((res) =>
      res.json()
    );

    if (fetchRes.statusCode === 200) {
      StampOrdersHandler.setState(fetchRes.data);
    } else {
      showNotification({
        message: fetchRes.message,
        title: 'Error',
      });
    }
  };

  useEffect(() => {
    getUser();
    getPopularAdvocates();
    getTickets();
    StampOrderList();
  }, []);

  return (
    <ClientDashboardContextProvider
      value={{
        HandleRating,
        StampOrders,
        getUser,
        DashState,
        setDashState,
        ClientTic,
        SomeAdvo,
        SearchAdvo,
        SearchAdvoHandler,
        RightDrawerState,
        ViewAdvo,
        ViewTic,
        BookTic,
        LoggedClient,
        setLoggedClient,
        HandleBookTicket,
        RefundTicket,
        SearchAdvocates,
        HandleMeetGen,
        HandleSendMessage,
        HandlePayForTicket,
        SetRightDrawerContent,
        HandleTicFileUpload,
      }}
    >
      {children}
    </ClientDashboardContextProvider>
  );
};

export { useClientDashboardContext, ClientDashboardProvider };
