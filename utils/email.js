const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // create transporter - service that actually send the email
  const port = Number(process.env.EMAIL_PORT);
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: proces.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  // define the email options
  const mailOptions = {
    from: 'Test Dev <test-dev@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  }
  // send the email
  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
