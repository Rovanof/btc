document.addEventListener('DOMContentLoaded', async () => {
  const btcAddressInput = document.getElementById('btcAddress');
  const balanceSpan = document.getElementById('balance');
  const sendBtn = document.getElementById('sendBtn');
  const destinationAddressInput = document.getElementById('destinationAddress');
  const amountInput = document.getElementById('amount');

  // Obtener nueva dirección BTC
  const response = await fetch('/new-address');
  const data = await response.json();
  const address = data.address;
  btcAddressInput.value = address;

  // Comprobar saldo
  const checkBalance = async () => {
    const response = await fetch(`/balance/${address}`);
    const data = await response.json();
    balanceSpan.textContent = data.balance + ' satoshis';
  };

  // Comprobación inicial de saldo
  checkBalance();
  // Comprobar saldo periódicamente
  setInterval(checkBalance, 10000);

  // Enviar BTC
  sendBtn.addEventListener('click', async () => {
    const toAddress = destinationAddressInput.value;
    const amount = amountInput.value;

    const response = await fetch('/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fromAddress: address, toAddress, amount })
    });

    const data = await response.json();
    if (data.txId) {
      alert(`¡Transacción exitosa! TXID: ${data.txId}`);
    } else {
      alert(`Error: ${data.error}`);
    }
  });
});
