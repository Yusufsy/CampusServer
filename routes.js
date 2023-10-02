const express = require('express');
const { getMessaging } = require("firebase-admin/messaging");
const https = require('https');
const nodemailer = require("nodemailer");
const { title } = require('process');

const router = express.Router();

router.post('/request-access-code', (req, res) => {
  const params = JSON.stringify({
    "email": req.body.email,
    "amount": req.body.amount
  });

  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 
      'Content-Type': 'application/json'
    }
  };

  const paystackReq = https.request(options, paystackRes => {
    let data = '';

    paystackRes.on('data', chunk => {
      data += chunk;
    });

    paystackRes.on('end', () => {
      res.json(JSON.parse(data));
    });
  }).on('error', error => {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  });

  paystackReq.write(params);
  paystackReq.end();
});

router.get('/test', (req, res)=>{
    res.status(200).json({message: 'Connection OK'});
});

router.post('/send-notification', (req, res)=>{
const recievedToken = req.body.fcmToken;
const title = req.body.title;
const notifBody = req.body.notifBody;
const message = {
  notification: {
    title: title,
    body: notifBody
  },
  token: recievedToken
}

getMessaging().send(message).then((response)=>{
  res.status(200).json({message: "Notification sent successfully", token: recievedToken});
  console.log('Successfully sent message:', response);
}).catch((error) => {
  res.status(400);
  res.send(error);
  console.log('Error sending message:', error);
});

});

router.post('/sale', (req, res)=>{
  const amount = req.body.amount;
  const orderId = req.body.orderId;
  const method = req.body.method;

  const transporter = nodemailer.createTransport({
    host: "mail.sysoftware.ng",
    port: 465,
    secure: true,
    auth: {
      user: 'yusuf@sysoftware.ng',
      pass: process.env.EMAIL_KEY
    }
  });

  transporter.sendMail({
    from: '"CampusDelight Server" <yusuf@sysoftware.ng>', // sender address
    to: "yusufsunusi63@gmail.com, yusuf.sy@sysoftware.ng", // list of receivers
    subject: `New Sale! ${method}`, // Subject line
    text: "Amount: ${amount}, Method: <b>${method}</b>", // plain text body
    html: `Amount: ${amount}<br>
    Method: <b>${method}</b>`, // html body
  }).then((response)=>{
    res.status(200).json({message: "Email sent successfully", messageId: response.messageId});
    console.log("Message sent: %s", response.messageId);
  }).catch((error) => {
    res.status(400);
    res.send(error);
    console.log('Error sending email:', error);
  });
  
  });

  router.post('/bjmls-submission', (req, res)=>{
    const paperTitle = req.body.paperTitle;
    const email = req.body.email;
  
    const transporter = nodemailer.createTransport({
      host: "mail.sysoftware.ng",
      port: 465,
      secure: true,
      auth: {
        user: 'editor@bjmls.ng',
        pass: process.env.BJMLS_KEY
      }
    });
  
    transporter.sendMail({
      from: '"BJMLS Editor" <editor@bjmls.ng>', // sender address
      to: email, // list of receivers
      subject: `Submission Received`, // Subject line
      text: `Thank you for your submission. This is to confirm that the submission for your paper titled "${paperTitle}" has 
      been received and will be revieved`, // plain text body
      html: `<h3>Thank you for your submission</h3><br>
      Your paper titled:<br> <b>${paperTitle}</b><br>
      Has been received and will undergo review. 
      You will receive a notification regarding the status of your paper once the review is complete`, // html body
    }).then((response)=>{
      res.status(200).json({message: "Email sent successfully", messageId: response.messageId});
      console.log("Message sent: %s", response.messageId);
    }).catch((error) => {
      res.status(400);
      res.send(error);
      console.log('Error sending email:', error);
    });
    
    });

module.exports = router;
