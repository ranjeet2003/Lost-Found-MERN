const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");
require("dotenv").config({ path: "./config.env" });

// new Email(user).sendWelcome();

module.exports = class Email {
  constructor(user) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.from = `Lost-Found <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    // res.render('')
    // const html = pug.renderFile(`${__dirname}/../views/emails${template}.pug`, {
    //   firstName: this.firstName,
    //   url: this.url,
    //   subject,
    // });
    // 2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      // html,
      // Text: htmlToText.fromString(html),
      Text: "Welcome to Lost-Found Family",
      // html:
    };

    // 3) Create a transport and send email

    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send("welcome", "Welcome to the Lost-Found family!");
  }
};
