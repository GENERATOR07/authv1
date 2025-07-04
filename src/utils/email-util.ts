import nodemailer from "nodemailer";

export async function sendMagicLinkEmail(to: string, magicLink: string) {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Auth App" <no-reply@auth.com>',
    to,
    subject: "Your Magic Login Link",
    text: `Click this link to login: ${magicLink}`,
    html: `<p>Click <a href="${magicLink}">here</a> to login. This link expires in 15 minutes.</p>`,
  });
}
