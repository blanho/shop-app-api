const sendMail = require("./sendMail");

const resetPassword = async ({ name, email, token, origin }) => {
  const url = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const message = `<p>Please click this link to reset your password:
  <a href="${url}">Reset Password</a>
  </p>`;

  return sendMail({
    to: email,
    subject: "Reset Password ",
    html: `<h4>Hello ${name}</h4>
    ${message}
    `,
  });
};

module.exports = resetPassword;
