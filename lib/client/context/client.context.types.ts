import { UseListStateHandlers } from '@mantine/hooks';
import { Dispatch, SetStateAction } from 'react';

export interface DocTypes {
  hash: string;
  ticketId: string;
  stampPaperId: string;
  url: string;
  type: 'TICKET' | 'STAMP' | 'ADHAR' | 'SIGNATURE';
  name: string;
}

export interface ClientTypes {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  status: 'VERIFIED' | 'BANNED' | 'NOTVERIFIED';
  password: string;
  tickets: TicketTypes[];
  state: string;
  city: string;
  pincode: number;
  country: string;
}

export interface AdvoSearchForm {
  name: string;
  experience: number;
  language: string;
  priceMin: number;
  priceMax: number;
  court: string;
  designation: string;
  rating: number;
  state: string;
  city: string;
  speciality: string;
}

export interface StampOrderTypes {
  clientId: string;
  documents: DocTypes[];
  status: 'PENDING' | 'COMPLETED';
  state: string;
  firstParty: string;
  secondParty: string;
  price: number;
  type: string;
  createdAt: string;
  duty: number;
  whoPays: string;
  notarial: boolean;
  notarialPages: number;
}

export interface AdvocateTypes {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  status: 'VERIFIED' | 'UNVERIFIED' | 'UNDERREVIEW';
  password: string;
  price: number;
  experience: number | null;
  languages: string;
  court: string | null;
  speciality: string | null;
  designation: string | null;
  unverifiedBallance: number;
  verifiedBallance: number;
  rating: number;
  state: string;
  city: string;
  pincode: number;
  country: string;
  accNumber: string;
  accIfsc: string;
  accbankName: string;
  accHolder: string;
  PayoutRequest?: {
    createdAt: string;
    advocateId: string;
    status: 'PENDING' | 'COMPLETED';
    price: number;
  };
  AvailabelDates: [
    {
      year: number;
      month: number;
      days: number[];
    }
  ];
}

export interface ClientOrderTypes {
  key: string;
  amount: string;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: object;
  theme: {
    color: string;
  };
}

export interface TicketTypes {
  id: string;
  createdAt: string;
  clientId: string;
  advocateId: string;
  status: 'OPEN' | 'CLOSED' | 'BOOKED' | 'REFUNDED' | 'UNPAID';
  price: number;
  clientDescription: string;
  clientMessage: string | null;
  advocateMessage: string | null;
  rating: number;
  meetDate: string;
  meeting: {
    id: string;
    createdAt: string;
    ticketId: string;
  };
  documents: DocTypes[];
}

export interface ClientDashboardContextTypes {
  LoggedClient: ClientTypes | null;
  setLoggedClient: Dispatch<SetStateAction<ClientTypes | null>>;

  DashState: 'dash' | 'profile' | 'tics' | 'stamp' | 'support';
  setDashState: Dispatch<
    SetStateAction<'dash' | 'profile' | 'tics' | 'stamp' | 'support'>
  >;

  ClientTic: TicketTypes[];
  SomeAdvo: AdvocateTypes[];
  SearchAdvo: AdvocateTypes[];
  StampOrders: StampOrderTypes[];

  SearchAdvoHandler: UseListStateHandlers<AdvocateTypes>;

  RightDrawerState: boolean;

  ViewTic: TicketTypes | null;
  ViewAdvo: AdvocateTypes | null;
  BookTic: AdvocateTypes | null;

  HandleBookTicket: (ticketData: {
    meetDate: string;
    description: string;
  }) => Promise<{
    success: boolean;
    message: any;
  }>;

  RefundTicket: (ticketId: string, password: string) => Promise<void>;

  SearchAdvocates: (searchData: AdvoSearchForm) => Promise<void>;

  HandleMeetGen: (ticketId: string) => Promise<void>;
  HandleSendMessage: (ticketId: string, message: string) => Promise<void>;

  HandlePayForTicket: (
    ticketId: string,
    clientOrder?: ClientOrderTypes | null
  ) => Promise<void>;

  SetRightDrawerContent: ({
    view,
    id,
  }: {
    view: 'book' | 'ticket' | 'advocate' | 'close';
    id: AdvocateTypes | TicketTypes | null;
  }) => void;

  getUser: () => Promise<void>;

  HandleRating: (params: { ticketId: string; rating: number }) => Promise<void>;

  HandleTicFileUpload: (params: {
    ticketId: string;
    doc: File;
  }) => Promise<void>;
}
