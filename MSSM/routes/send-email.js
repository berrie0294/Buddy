// send-email.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

const html = `<h1>Hello World</h1>`;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  },
});

const mailOptions = {
  from: {
    name: 'Buddy Finder',
    address: process.env.USER,
  },
  to: 'berrievz0120@gmail.com',
  subject: 'Testing',
  html: html,
};

const sendMail = async () => {
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email has been sent');
  } catch (error) {
    console.error(error);
  }
};

router.get('/send-email', (req, res) => {
  sendMail()
    .then(() => res.send('Email sent'))
    .catch(error => res.status(500).send(error.message));
});

module.exports = router;
