import nodemailer from 'nodemailer';
import { config } from './config.js';
import { Logging } from './Logging.js';

export const sendEmail = (options)=>{
    const transport = nodemailer.createTransport({
        host: config.GMAIL_HOST,
        port: config.GMAIL_PORT,
        secure: true,
        auth: {
            user: config.GMAIL_USER,
            pass: config.GMAIL_PASS
        }
    })

    const mail_options = {
        from: ` ${config.FROM_NAME} <${config.GMAIL_USER}> `,
        to: options.email,
        subject: options.subject,
        html: `<b>Hi There!!!</b> <br> ${options.message}`
    }

    transport.sendMail(mail_options, (err, info)=>{
        if(err){
            Logging.error('There is an Error');
            Logging.error(err);
        }
        Logging.info('Mail Sent Successfully...');
    })
}