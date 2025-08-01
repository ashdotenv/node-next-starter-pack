import ejs from "ejs";
import path from "path";
import nodemailer, { Transporter } from "nodemailer";
import { SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from "../config/env.config";

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
  const { email, subject, template, data } = options;
  const templatePath = path.join(__dirname, "../mails", template);
  const html = await ejs.renderFile(templatePath, data);
  const mailOptions = {
    from: `Learn Vista`,
    to: email,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};
