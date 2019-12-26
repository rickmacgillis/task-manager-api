const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {

    sgMail.send({
        to: email,
        from: process.env.MAIL_FROM,
        subject: 'Thanks for joining us!',
        text: `Welcome to the Task Manager app, ${name}! Let us know if you need any help.`,
    }).catch((error) => {
        console.log(error);
    });

};

const sendCancellationEmail = (email, name) => {

    sgMail.send({
        to: email,
        from: process.env.MAIL_FROM,
        subject: 'Sorry to see you go...',
        text: `Hi ${name}. Why hast thou canceled? Is there anything we could have done differently?`,
    }).catch((error) => {
        console.log(error);
    });

};

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail,
};
