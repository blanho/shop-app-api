const nodemailer = require("nodemailer");
const mailTransporter = require("./transporter");

const sendMail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport(mailTransporter);

  return await transporter.sendMail({
    from: "<h.baolan20025@gmail.com>",
    to,
    subject,
    html,
  });
};

module.exports = sendMail;
