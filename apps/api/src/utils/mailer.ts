import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: Number(process.env.SMTP_PORT) || 1025,
  secure: false,
  tls: {
    rejectUnauthorized: false
  }
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: '"Wontent Content Hub" <noreply@wontent.com>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, '')
    });
    console.log(`[Email] Message sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email Error] Failed to send email:', error);
    return { success: false, error };
  }
}
