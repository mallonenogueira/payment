export interface MailInput {
  fromEmail: string;
  fromName: string;
  to: string;
  subject: string;
  body: string;
  attachments?: {
    filename: string;
    path: string;
  }[];
}

export interface MailService {
  send(input: MailInput): Promise<void>;
}
