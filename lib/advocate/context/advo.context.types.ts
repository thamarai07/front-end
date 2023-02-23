import { SetStateAction, Dispatch } from 'react';
import { UseListStateHandlers } from '@mantine/hooks';
import {
  TicketTypes,
  AdvocateTypes,
} from '../../client/context/client.context.types';

export interface AdvoContextTypes {
  LoggedAdvo: AdvocateTypes | null;
  setLoggedAdvo: Dispatch<SetStateAction<AdvocateTypes | null>>;

  DashState: 'dash' | 'profile' | 'payout' | 'resources' | 'support';
  setDashState: Dispatch<
    SetStateAction<'dash' | 'profile' | 'payout' | 'resources' | 'support'>
  >;

  AdvoTic: TicketTypes[];

  RightDrawerState: 'profile' | 'tic' | 'close';

  ViewTic: TicketTypes | null;

  SearchedTic: TicketTypes[];
  SearchedTicHandler: UseListStateHandlers<TicketTypes>;

  HandleSendMessage: (ticketId: string, message: string) => Promise<void>;
  HandleTicketClose: (ticketId: string) => Promise<void>;
  HandlePayoutRequest: () => Promise<void>;

  SearchTicket: (params: {
    id: string;
    status: string;
    price: number;
  }) => Promise<void>;

  SetRightDrawerContent: ({
    view,
    id,
  }: {
    view: 'ticket' | 'close' | 'profile';
    id: TicketTypes | null;
  }) => void;
}
