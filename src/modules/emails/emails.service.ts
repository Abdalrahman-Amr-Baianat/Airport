import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';
import * as fs from 'fs/promises';
import * as path from 'path';
import Handlebars from 'handlebars';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class EmailsService {
  constructor(
    private readonly configService: ConfigService,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {
    sgMail.setApiKey(
      this.configService.get<string>('SEND_GRID_API_KEY') || 'secret',
    );
  }

  async loadTemplate(
    templateName: string,
    data: Record<string, any>,
  ): Promise<string> {
    try {
      const filePath = path.resolve(
        process.cwd(),
        'src/public/templates',
        `${templateName}.hbs`,
      );

      const source = await fs.readFile(filePath, 'utf-8');
      const template = Handlebars.compile(source);
      return template(data);
    } catch (error: any) {
      console.error(
        `Could not read/compile HTML template: ${templateName}.hbs`,
        error.message,
      );
      throw error;
    }
  }
// To add the email to the queue 
  async sendEmail(
    toEmail: string,
    subject: string,
    templateFile: string,
    variables: Record<string, any>,
  ) {
    await this.emailQueue.add('sendEmail', {
      toEmail,
      subject,
      templateFile,
      variables,
    });
    return { success: true, message: 'Email job queued' };
  }

// DIRECT EMAIL SEND WITHOUT QUEUE

  // async sendEmail(
  //   toEmail: string,
  //   subject: string,
  //   templateFile: string,
  //   variables: Record<string, any>,
  // ) {
  //   try {
  //     const htmlContent = await this.loadTemplate(templateFile, variables);

  //     const msg = {
  //       to: toEmail,
  //       from: 'abdalrhmanamr2005@gmail.com',
  //       subject: subject || 'No subject',
  //       html: htmlContent,
  //     };

  //     await sgMail.send(msg);
  //     console.log(`Email sent successfully to ${toEmail}`);
  //     return { success: true };
  //   } catch (error: any) {
  //     console.error(
  //       'Failed to send email:',
  //       error.response?.body || error.message,
  //     );
  //     throw error;
  //   }
  // }
}
