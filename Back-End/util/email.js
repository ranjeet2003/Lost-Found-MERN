const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./config.env" });

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.MAILGUN_HOST,
    port: process.env.MAILGUN_PORT,
    auth: {
      user: process.env.MAILGUN_USERNAME,
      pass: process.env.MAILGUN_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "ranjeetgautam13032@gmail.com",
    to: options.email,
    subject: options.subject,
    Text: options.message,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
