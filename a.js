nodemailer = require('nodemailer');

nodemailer.SES = {
    AWSAccessKeyID: 'AKIAJ6PO3P4KGEAOX3IA', // required
    AWSSecretKey: 'AvOo1V7xZzHkT5KAyqf7H0Te9HKEqmTcf8fbmp1iHXeW', // required
    ServiceUrl: 'email-smtp.us-east-1.amazonaws.com', // optional
}


nodemailer.send_mail(
    // e-mail options
    {
        sender: 'kmax12@gmail.com',
        to:'kmax12@gmail.com',
        subject:'Hello!',
        html: '<p><b>Hi,</b> how are you doing?</p>',
        body:'Hi, how are you doing?'
    },
    // callback function
    function(error, success){
        console.log('Message ' + success ? 'sent' : 'failed');
    }
);
