const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // Create Transporter
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '7c07a1e2079008',
      password: '33547f9663cbcf'
    }
  });

  // Define the email options
  const mailOptions = {
    // from: 'hello@jonas.io',
    from: '"Jonas 👻" <hello@jonas.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // Actually send the email
   transporter.sendMail(mailOptions, function(err) {
    if (err) console.log("Some Error",err.message);
    else console.log('email sent successfully');
  });
};

module.exports = sendEmail;
