const express = require('express');
const { getMessaging } = require("firebase-admin/messaging");

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

  const paystackReq = request(options, paystackRes => {
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

router.post('/order-confirm', (req, res)=>{
const recievedToken = req.body.fcmToken;
const message = {
  notification: {
    title: "Order Confirmed",
    body: "Thank you for ordering!"
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

module.exports = router;
