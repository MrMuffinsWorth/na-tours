const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // create transporter - service that actually send the email
  const port = Number(process.env.EMAIL_PORT);
  console.log('[email] Creating transporter', {
    host: process.env.EMAIL_HOST,
    port,
    user: process.env.EMAIL_USERNAME
  });
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
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
  console.log('[email] Sending mail', {
    to: mailOptions.to,
    subject: mailOptions.subject
  });
  await transporter.sendMail(mailOptions);
  console.log('[email] Mail sent successfully');
}

module.exports = sendEmail;
