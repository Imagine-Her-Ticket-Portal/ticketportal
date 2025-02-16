import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

type MailPromise = Promise<boolean | Error>;

export const sendMail = async (email: string, OTP: number): MailPromise => {

  
const logoPath = path.resolve(__dirname, "..", "assets", "logo-new.jpg");
const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });

  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER_EMAIL,
      pass: process.env.NODEMAILER_APP_PASSWORD,
    },
  });

  const mailDetails = {
    from: process.env.NODEMAILER_USER_EMAIL,
    to: email,
    subject: "OTP Verification for Your Account",
    html: `
        <html>
        <body>
          <p>Dear User,</p>
          <p>Your OTP for account verification is:</p>
          <h2>${OTP}</h2>
          <p>Please use this OTP to verify your account.</p>
          <p>The OTP is valid for <strong>5</strong> minutes.</p>
          <br>
          <hr>
          <br>
          <img src="cid:logoImage" alt="Imagine Her" style="max-width: 80px; width: 80px; height: auto;">
          <p><strong>Imagine Her<br>Entrepreneur Support Portal</strong></p>
        </body>
    `,
    attachments: [
      {
        filename: 'logo-new.jpg',
        path: logoPath,
        cid: 'logoImage' 
      }
    ]
  };

  return new Promise((resolve, reject) => {
    mailTransporter.sendMail(mailDetails, (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log(`Successfully send OTP to ${data.accepted}`);
        resolve(true);
      }
    });
  });
};

export const TicketUpdateMail = async (status: string, email: string, 
  assignedToEmail: string, assignedToName: string): MailPromise => {

      
const logoPath = path.resolve(__dirname, "..", "assets", "logo-new.jpg");
const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });


  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER_EMAIL,
      pass: process.env.NODEMAILER_APP_PASSWORD,
    },
  });

  const mailDetails = {
    from: process.env.NODEMAILER_USER_EMAIL,
    to: email,
    subject: "Ticket Status Update",
    html: `
        <html>
        <body>
          <p>Dear User,</p>
          <p>Your ticket is <strong> ${status} </strong>. Your ticket is being handled by : </p>
          <p>Name  : ${assignedToName} </p>
          <p>Email : ${assignedToEmail} </p>
          <br>
          <hr>
          <br>
          <img src="cid:logoImage" alt="Imagine Her" style="max-width: 80px; width: 80px; height: auto;">
          <p><strong>Imagine Her<br>Entrepreneur Support Portal</strong></p>
        </body>
    `,
    attachments: [
      {
        filename: 'logo-new.jpg',
        path: logoPath,
        cid: 'logoImage' 
      }
    ]
  };

  return new Promise((resolve, reject) => {
    mailTransporter.sendMail(mailDetails, (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log(`Successfully send ticket status update to ${data.accepted}`);
        resolve(true);
      }
    });
  });
};


