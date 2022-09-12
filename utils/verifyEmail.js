const sendMail = require("./sendMail");

const verifyEmail = async ({ name, email, verificationToken, origin }) => {
  const url = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email by clicking on the following link:
  <a href="${url}">Verify Email</a>
  </p>`;

  return sendMail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hello ${name}</h4>
    ${message}
    `,
  });
};

module.exports = verifyEmail;
