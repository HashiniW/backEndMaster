var nodemailer = require('nodemailer');

var emailBcc = 'dev@urbandine.nl';

function invitationEmail(email, comment) {

    console.log(email);
    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      keepBcc: true,
      auth: {
        user: 'dev@urbandine.nl',
        pass: 'dinein@hash_ud'
      },
      tls: {
        rejectUnauthorized: false //unathoutized access allow
      }
    });
  
    var mailOptions = {
      from: '"Urbandine Partner Care" <sasitha@pikanite.com>',
      to: `${email}`,
      bcc: emailBcc,
      subject: 'Super Admin Invitation',
      text: 'Hi, we are glad you make to help!, your reset code info as follows',
      html: `
        <html xmlns="http://www.w3.org/1999/xhtml">
        
        <head>
            
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            
            <title>Urbandine Super Admin</title>
            
            <style type="text/css">
                
            </style>
        </head>
        
        <body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" style="font-family: 'Varela Round', sans-serif;">
            
            <a href="https://admin.urbandine.info/?#/"> Super Admin Login </a>
            </body>
        
        </html>
  `
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {

        console.log(error);
        return false;
      } else {

        console.log('Email sent: ' + info.response);
        return true;
      }
    });
  }

module.exports = { invitationEmail }