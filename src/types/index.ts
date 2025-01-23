export interface List {
  id: string;
  name: string;
  subscriber_count: number;
}

export interface Campaign {
  sender_email: string;
  list_ids: string[];
  subject: string;
  content: string;
}

export interface ApiError {
  message: string;
  status: number;
}