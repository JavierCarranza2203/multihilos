import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

export class Mailer {
    _transporter;
    _mailOptions = {
        from: '',
        to: '',
        subject: '',
        html: ''
    }

    constructor() {
        this._transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    CreateMail(to, subject, htmlContent, buffer) {
        this._mailOptions.from = process.env.EMAIL;
        this._mailOptions.to = to;
        this._mailOptions.subject = subject;
        this._mailOptions.html = htmlContent;
        this._mailOptions.attachments = [{
            filename: 'FORMATO DE PEDIMENTO ADUANAL.pdf',
            content: fs.readFileSync('./formato.pdf'),
            contentType: 'application/pdf'
        }]
    }

    SendMail() {
        return new Promise((resolve, reject) => {
            this._transporter.sendMail(this._mailOptions, (error, info) => {
                if(error) {
                    reject(error);
                }
                else {
                    resolve(true)
                }
            });
        });
    }
}