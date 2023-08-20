const express = require('express');
const https = require('https');

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

module.exports = router;
