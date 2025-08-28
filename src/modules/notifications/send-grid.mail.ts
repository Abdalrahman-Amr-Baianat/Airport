import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

const configService = new ConfigService();

sgMail.setApiKey(configService.get<string>('SEND_GRID_API_KEY') || 'secret');

export async function sendEmail() {
    const msg = {
        to: 'test@example.com', // Change to your recipient
        from: 'test@example.com', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      }
}
