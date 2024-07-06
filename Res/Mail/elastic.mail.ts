import { Configuration, EmailsApi, EmailTransactionalMessageData } from '@elasticemail/elasticemail-client-ts-axios';
import config from '../../config/config';



export class ElasticMailService {
    private configuration: Configuration;
    private emailsApi: EmailsApi;
    constructor() {
        this.configuration = new Configuration({
            apiKey: config.mail.elastic.apiKey
        });
        this.emailsApi = new EmailsApi(this.configuration);
    }

    public async SendMail(email: string, subject: string, message: string) {
        try {
            const emailMessage: EmailTransactionalMessageData = {
                Recipients: {
                    To: [email] // maximum 50 recipients
                },
                Content: {
                    Body: [
                        {
                            ContentType: "HTML",
                            Charset: "utf-8",
                            Content: message
                        },
                        {
                            ContentType: "PlainText",
                            Charset: "utf-8",
                            Content: message
                        }
                    ],
                    From: "myemail@address.com",
                    Subject: subject
                }
            };
            const isMailSent = await this.emailsApi.emailsTransactionalPost(emailMessage);
            if (!isMailSent) {
                return false;
            }
            return true;
        } catch (error) {
            return error;
        }
    }

    public async SendBulkMail(emails: string[], subject: string, message: string) {
        try {
            const emailMessage: EmailTransactionalMessageData = {
                Recipients: {
                    To: emails // maximum 50 recipients
                },
                Content: {
                    Body: [
                        {
                            ContentType: "HTML",
                            Charset: "utf-8",
                            Content: message
                        },
                        {
                            ContentType: "PlainText",
                            Charset: "utf-8",
                            Content: message
                        }
                    ],
                    From: '',
                    Subject: subject
                }
            };
            const isMailSent = await this.emailsApi.emailsTransactionalPost(emailMessage);
            if (!isMailSent) {
                return false;
            }
            return true;
        } catch (error) {
            return error;
        }
    }
}