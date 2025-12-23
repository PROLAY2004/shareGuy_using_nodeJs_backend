import nodemailer from 'nodemailer';
import configuration from '../config/config.js';

export default class SendEmailService {
  // Common mail sender
  mailSender = async (email, title, body, attachments = []) => {
    try {
      const transporter = nodemailer.createTransport({
        service: configuration.MAIL_SERVICE,
        auth: {
          user: configuration.MAIL_USER,
          pass: configuration.MAIL_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `${configuration.MAIL_USER}`,
        to: email,
        subject: title,
        html: body,
        attachments, // <- this can be empty or contain files
      });

      return info;
    } catch (error) {
      throw error;
    }
  };

  fileMailer = async (email, files) => {
    const attachments = files.map((file) => ({
      filename: file.fileName,
      path: file.filePath,
    }));

    const fileListHtml = files.map((f) => `<li>${f.fileName}</li>`).join('');

    console.log(attachments);

    const body = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Your file${files.length > 1 ? 's' : ''} from ShareGuy</h2>
        <p>Hi,</p>
        <p>The following file${files.length > 1 ? 's have' : ' has'} been attached to this email:</p>
        <ul>
          ${fileListHtml}
        </ul>
        <p>If the attachments are not visible, please try opening this email in a different mail app.</p>
        <br/>
        <p>Regards,<br/>ShareGuy Team</p>
      </div>
    `;

    return this.mailSender(
      email,
      'Your file(s) from ShareGuy',
      body,
      attachments
    );
  };
}
