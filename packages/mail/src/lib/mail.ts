import nodemailer from 'nodemailer';

export interface MailService {
  sendTextTo(to: string, subject: string, text: string): Promise<void>;
}

export class EtherealTestMailService implements MailService {
  private user: string;
  private password: string;
  private transporter: any;

  constructor() {
    this.bootstrap();
  }

  async bootstrap() {
    const testAccount = await nodemailer.createTestAccount();
    this.user = testAccount.user;
    this.password = testAccount.pass;
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.user, // generated ethereal user
        pass: this.password, // generated ethereal password
      },
    });

    console.log('Ethereal account created for mailing:', this.user);
  }

  async sendTextTo(to: string, subject: string, text: string): Promise<void> {
    const info = await this.transporter.sendMail({
      from: this.user,
      to: to,
      subject: subject,
      text: text,
    });
    console.log('Email sent:', nodemailer.getTestMessageUrl(info));
  }
}
