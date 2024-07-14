const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const blockcypherToken = 'a877eb5b51324fe5b2862ed1aa81b91c';
const baseURL = 'https://api.blockcypher.com/v1/btc/main';

// Generar nueva dirección BTC para cada visitante
app.get('/new-address', async (req, res) => {
  try {
    const response = await axios.post(`${baseURL}/addrs`, null, {
      params: { token: blockcypherToken }
    });
    const address = response.data.address;
    res.json({ address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Comprobar saldo para una dirección dada
app.get('/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const response = await axios.get(`${baseURL}/addrs/${address}/balance`, {
      params: { token: blockcypherToken }
    });
    const balance = response.data.final_balance;
    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enviar BTC de una dirección a otra
app.post('/send', async (req, res) => {
  const { fromAddress, toAddress, amount } = req.body;
  try {
    const response = await axios.post(`${baseURL}/txs/new`, {
      inputs: [{ addresses: [fromAddress] }],
      outputs: [{ addresses: [toAddress], value: amount }]
    }, {
      params: { token: blockcypherToken }
    });

    const tx = response.data;
    const signedTx = {
      tx: tx.tx,
      tosign: tx.tosign,
      signatures: [/* Firma tu transacción aquí */],
      pubkeys: [/* Llave pública aquí */]
    };

    const sendTxResponse = await axios.post(`${baseURL}/txs/send`, signedTx, {
      params: { token: blockcypherToken }
    });

    res.json({ txId: sendTxResponse.data.tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
