const nodemailer = require('nodemailer');

class EmailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth : {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendEmail(to,subject,text){
        await this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
    }
}

module.exports = EmailService;