const nodeMailer = require("nodemailer");
const {SMTP_HOST, SMTP_PORT, SMTP_SERVICE, SMTP_MAIL, SMTP_PASSWORD} = require('../config/config.env');

//options of object of sendEmail method call which are email, subject and message.
const sendMail = async (options) => {
  //we use mail tracking service in development ..but in this it is shown in the track history k mail is sent but in real it hasn't sent.So we use gmail.
  const transporter = nodeMailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    service: SMTP_SERVICE,
    secure: true, // true for 465, false for other ports
    auth: {
        user: SMTP_MAIL,
        pass: SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
  }
  });

  const mailOptions = {
    from: SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;