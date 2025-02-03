import { MailService, MailInput } from "@/application/services/MailService";
import { Resend } from "resend";
import { env } from "../configuration/env";

export class ResendMailService implements MailService {
  resend: Resend;

  constructor() {
    this.resend = new Resend(env.resendToken);
  }

  async send(input: MailInput): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: `${input.fromName} <${input.fromEmail}>`,
      to: [input.to],
      subject: input.subject,
      html: input.body,
    });

    if (error) throw error;
  }
}
