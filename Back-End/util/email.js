const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "c529cecbff843c",
      pass: "1b0b30cf98f3f9",
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "Lost-Found <notice@lost-found.com>",
    to: options.email,
    subject: options.subject,
    Text: options.message,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
