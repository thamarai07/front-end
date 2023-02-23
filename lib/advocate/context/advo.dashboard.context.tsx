import { useEffect, useState } from 'react';
import { useListState } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import {
  AdvocateTypes,
  TicketTypes,
} from '../../client/context/client.context.types';
import { createGenericContext } from '../../create.context';
import { ServerResStructure } from '../../types';
import { AdvoContextTypes } from './advo.context.types';
import POST from '../../funs/post';
import { GetUser } from '../../funs/user';

const [useAdvoDashboardContext, AdvoDashboardContextProvider] =
  createGenericContext<AdvoContextTypes>();

const AdvoDashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [LoggedAdvo, setLoggedAdvo] = useState<AdvocateTypes | null>(null);

  const [AdvoTic, AdvoTicHandler] = useListState<TicketTypes>();

  const [SearchedTic, SearchedTicHandler] = useListState<TicketTypes>([]);

  const [ViewTic, setViewTic] = useState<TicketTypes | null>(null);
  const [RightDrawerState, setRightDrawerState] = useState<
    'tic' | 'profile' | 'close'
  >('close');

  const [DashState, setDashState] = useState<
    'dash' | 'profile' | 'payout' | 'resources' | 'support'
  >('dash');

  const SetRightDrawerContent = ({
    view,
    id,
  }: {
    view: 'ticket' | 'close' | 'profile';
    id: TicketTypes | null;
  }) => {
    switch (view) {
      case 'ticket':
        setViewTic(id as TicketTypes);
        setRightDrawerState('tic');
        break;

      case 'profile':
        setViewTic(null);
        setRightDrawerState('profile');
        break;

      case 'close':
        setRightDrawerState('close');
        break;

      default:
        throw new Error('Invalid View');
    }
  };

  const SearchTicket = async (params: {
    id: string;
    status: string;
    price: number;
  }) => {
    const { id, status, price } = params;

    if (id.length < 2 && status === 'All' && price === 0) {
      SearchedTicHandler.setState(AdvoTic);
    }

    const filteredTickets = AdvoTic.filter((ticket) => {
      if (id.length >= 2) {
        if (ticket.id.slice(-6).includes(id)) {
          return ticket;
        }
      }

      if (status !== 'All') {
        if (ticket.status === status) {
          return ticket;
        }
      }

      if (price !== 0) {
        if (ticket.price === price) {
          return ticket;
        }
      }

      return null;
    });

    if (filteredTickets.length === 0) {
      showNotification({
        title: 'No Ticket Found',
        message: 'No Ticket Found',
        color: 'red',
        autoClose: true,
      });
    }

    SearchedTicHandler.setState(filteredTickets);
  };

  const getTickets = async () => {
    // /api/client/advocate/popular
    const Tickets: ServerResStructure<TicketTypes[]> = await fetch(
      '/api/advocate/ticket'
    ).then((res) => res.json());

    AdvoTicHandler.setState(Tickets.data || []);
  };

  const HandleSendMessage = async (ticketId: string, message: string) => {
    // if messafge bigger than 200
    if (message.length > 200) {
      showNotification({
        title: 'Error',
        message: 'Message must be less than 200 characters',
        color: 'red',
        autoClose: true,
      });

      return;
    }

    const MsgSendRes = await POST('/api/advocate/ticket/message', {
      ticketId,
      message,
    });

    if (MsgSendRes.statusCode === 200) {
      // find ticket index
      const ticketIndex = AdvoTic.findIndex((ticket) => ticket.id === ticketId);

      // remove ticket from tickets
      AdvoTicHandler.remove(ticketIndex);

      // add refunded ticket to tickets
      AdvoTicHandler.prepend(MsgSendRes.data);

      setViewTic(MsgSendRes.data);
    } else {
      showNotification({
        title: 'Error',
        message: MsgSendRes.message,
        color: 'red',
        autoClose: true,
      });
    }
  };

  const HandleTicketClose = async (ticketId: string) => {
    const updatedTicket = await fetch(
      `/api/advocate/ticket/close/${ticketId}`
    ).then((res) => res.json());

    if (updatedTicket.statusCode === 200) {
      AdvoTicHandler.applyWhere(
        (ticket) => ticket.id === ticketId,
        () => ({ ...updatedTicket.data })
      );

      setLoggedAdvo(updatedTicket.data.advocate);

      setViewTic(updatedTicket.data);
    } else {
      showNotification({
        title: 'Error',
        message: updatedTicket.message,
        color: 'red',
        autoClose: true,
      });
    }
  };

  const HandlePayoutRequest = async () => {
    const payoutRes = await fetch('/api/advocate/payout/request')
      .then((res) => res.json())
      .catch((err) => {
        showNotification({
          title: 'Error',
          message: err.message,
          color: 'red',
          autoClose: true,
        });
      });

    if (payoutRes.data) {
      setLoggedAdvo(payoutRes.data);
    } else {
      showNotification({
        title: 'Error',
        message: payoutRes.message,
        color: 'red',
        autoClose: true,
      });
    }
  };

  const getAdvocate = async () => {
    const fetchRes = await GetUser();

    setLoggedAdvo(fetchRes);
  };

  useEffect(() => {
    getAdvocate();
    getTickets();
  }, []);

  return (
    <AdvoDashboardContextProvider
      value={{
        LoggedAdvo,
        setLoggedAdvo,
        DashState,
        setDashState,
        AdvoTic,
        RightDrawerState,
        ViewTic,
        SearchedTic,
        SearchedTicHandler,
        HandleSendMessage,
        HandleTicketClose,
        SearchTicket,
        SetRightDrawerContent,
        HandlePayoutRequest,
      }}
    >
      {children}
    </AdvoDashboardContextProvider>
  );
};

export { useAdvoDashboardContext, AdvoDashboardProvider };
