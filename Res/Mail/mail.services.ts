import nodemailer from 'nodemailer'
import { ElasticMailService } from './elastic.mail';
import config from '../../config/config';

export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.mail.nodemailer.auth,
      pass: config.mail.nodemailer.pass
    },
  });
  // constructor(private mailerElastic: ElasticMailService) {
  //   this.mailerElastic = new ElasticMailService()
  // }

  public async SendMail(email: string, subject: string, message: string) {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: config.mail.nodemailer.auth,
        to: email,
        subject: subject,
        html: message,
        text: message
      };
      const isMailSent = await this.transporter.sendMail(mailOptions)
      if (!isMailSent) {
        return false
      }
      return true
    } catch (error) {
      return error
    }
  }

  // public async SendMailWithElastic(email: string, subject: string, message: string) {
  //   try {
  //     const isMailSent = await this.mailerElastic.SendMail(email, subject, message)
  //     if (!isMailSent) {
  //       return false
  //     }
  //     return true
  //   } catch (error) {
  //     return error
  //   }
  // }

  // public async sendBulkMailWithElastic(emails: string[], subject: string, message: string) {
  //   try {
  //     const isMailSent = await this.mailerElastic.SendBulkMail(emails, subject, message)
  //     if (!isMailSent) {
  //       return false
  //     }
  //     return true
  //   } catch (error) {
  //     return error
  //   }
  // }
}