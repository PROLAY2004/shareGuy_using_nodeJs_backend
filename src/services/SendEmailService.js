import nodemailer from 'nodemailer';
import configuration from '../config/config.js';

export default class SendEmailService {
  // Common mail sender
  mailSender = async (email, title, body, attachments = []) => {
    try {
      console.log('sending email...');

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
      return error;
    }
  };

  // File mailer – send file as attachment + simple template
  fileMailer = async (email, fileUrl, fileName, next) => {
    try {
      const body = `
        <div style="font-family: Arial, sans-serif;">
          <h2>Your file from ShareGuy</h2>
          <p>Hi,</p>
          <p>The file you requested has been attached to this email.</p>
          <p>If the attachment is not visible, you can also download it using this link:</p>
          <p><a href="${fileUrl}" target="_blank">${fileUrl}</a></p>
          <br/>
          <p>Regards,<br/>ShareGuy Team</p>
        </div>
      `;

      const attachments = [
        {
          filename: fileName, // e.g. "document.pdf"
          path: fileUrl, // can be local path or https URL
        },
      ];

      const mailResponse = await this.mailSender(
        email,
        'Your File from ShareGuy',
        body,
        attachments
      );

      console.log('File Email sent successfully: ', mailResponse);
    } catch (error) {
      next(error);
    }
  };
}
