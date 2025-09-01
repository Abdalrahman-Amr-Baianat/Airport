import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import sgMail from '@sendgrid/mail';
import { EmailsService } from './emails.service';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly emailService: EmailsService) {
    super();
  }

  async process(job: Job){
    if (job.name === 'sendEmail') {
      try {
        const { toEmail, subject, templateFile, variables } = job.data;

        const htmlContent = await this.emailService.loadTemplate(
          templateFile,
          variables,
        );

        const msg = {
          to: toEmail,
          from: 'abdalrhmanamr2005@gmail.com',
          subject: subject || 'No subject',
          html: htmlContent,
        };

        await sgMail.send(msg);
        console.log(` Email sent using Queue to ${toEmail}`);
      } catch (err: any) {
        console.error(` Failed processing job ${job.id}:`, err.message);
        throw err;
      }
    }
  }
}
