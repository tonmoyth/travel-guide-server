import nodemailer from "nodemailer";
import status from "http-status";
import path from "path";
import ejs from "ejs";
import { envVeriables } from "../config/env";
import AppError from "../errors/AppError";

const transporter = nodemailer.createTransport({
  host: envVeriables.EMAIL_SENDER.EMAIL_SENDER_SMTP_HOST,
  secure: true,
  auth: {
    pass: envVeriables.EMAIL_SENDER.EMAIL_SENDER_SMTP_PASS,
    user: envVeriables.EMAIL_SENDER.EMAIL_SENDER_SMTP_USER,
  },
  port: Number(envVeriables.EMAIL_SENDER.EMAIL_SENDER_SMTP_PORT),
});

interface ISendEmail {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  attechment?: {
    fileName: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateData,
  templateName,
  attechment,
}: ISendEmail) => {
  try {
    //   template path
    const templatePath = path.resolve(
      process.cwd(),
      `src/templates/${templateName}.ejs`,
    );

    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      to,
      subject,
      html,
      attachments:
        attechment?.map((item) => ({
          filename: item.fileName,
          content: item.content,
          contentType: item.contentType,
        })) || [],
    });
  } catch (error: any) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, error.message);
  }
};
