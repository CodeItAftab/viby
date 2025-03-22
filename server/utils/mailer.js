const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async ({ to, from, subject, html, text, attachments }) => {
  try {
    const sender = from || "aftabalamk7a@gmailcom";
    const msg = {
      to,
      from: sender,
      subject,
      text,
      html,
      attachments,
    };

    return sgMail.send(msg);
  } catch (error) {
    // console.log(error);
  }
};

exports.sendEmail = async (args) => {
  if (process.env.NODE_ENV === "developement") {
    return new Promise.resolve();
  } else {
    return sendMail(args);
  }
};
