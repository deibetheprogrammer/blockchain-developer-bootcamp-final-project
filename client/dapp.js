var lotjson;
var hash;

async function loadJSON() {
  const response = await fetch('./contracts/LotteryReduced.json');
  lotjson = await response.json();
}

loadJSON();

async function selectedAddress() {
  const accounts = await ethereum.request({
    method:
      'eth_requestAccounts'
  });
  if (typeof accounts !== 'undefined') {
    return accounts[0].toLowerCase();
  }
  return "";
}

ethereum.on('accountsChanged', function (accounts) {
  getInfo();
})

window.addEventListener('load', function () {
  if (!window.ethereum) {
    this.alert("You need to install Metamask!");
    return;
  }
  getInfo();
})

async function getInfo() {
  var SCResponse;
  
  const participant1 = document.getElementById("lo-participant1");
  const participant2 = document.getElementById("lo-participant2");
  const lotteryCount = document.getElementById("lo-lotteryCount");
  const winner = document.getElementById("lo-winner");
  const status = document.getElementById("lo-status");

  var web3 = new Web3(window.ethereum)
  const networkId = await web3.eth.net.getId();

  const lottery = new web3.eth.Contract
    (lotjson.abi, lotjson.networks[networkId].address);

  try {
    SCResponse = await lottery.methods.requestData().call();
  } catch (error) {
    document.getElementById("lo-participant1").innerHTML = "---";
    document.getElementById("lo-participant2").innerHTML = "---";
    document.getElementById("lo-lotteryCount").innerHTML = "---";
    document.getElementById("lo-winner").innerHTML = "---";

    return false;
  }

  document.getElementById("lo-participant1").innerHTML = "Participant 1: " + SCResponse[1];
  document.getElementById("lo-participant2").innerHTML = "Participant 2: " +SCResponse[2];
  document.getElementById("lo-lotteryCount").innerHTML = "Lottery #: " +SCResponse[4];
  document.getElementById("lo-winner").innerHTML = "Winner: " + SCResponse[3];
  
  let statusDisplay;
  
  switch (parseInt(SCResponse[0])) {
    case 0:
      statusDisplay = "A lottery has started!";
      break;
    case 1:
      statusDisplay = "One bet received!";
      break;
    case 2:
      statusDisplay = "Two bets received!";
      break;
    case 3:
      statusDisplay = "Electing a winner...";
      break;
    case 4:
      statusDisplay = "Winner elected, claim your prize!";
      break;
    
    default:
      statusDisplay = "You should not be seeing this ...."
      break;
    
  }
  document.getElementById("lo-status").innerHTML = statusDisplay;
  return true;
}

const loBet = document.getElementById("lo-bet");
loBet.onclick = async () => {

  if (!window.ethereum) {
    alert("No MetaMask detected");
    return;
  }

  var web3 = new Web3(window.ethereum)
  const networkId = await web3.eth.net.getId();

  // console.log(networkId);
  // console.log(lotjson.networks[networkId].address);
  // console.log(await selectedAddress());

  const lottery = new web3.eth.Contract
    (lotjson.abi, lotjson.networks[networkId].address);
  
  await lottery.methods
  .placeBet()
  .send({ from: await selectedAddress(), value: 1e9 });

  getInfo();
}

const loGains = document.getElementById("lo-prize");
loGains.onclick = async () => {

  if (!window.ethereum) {
    alert("No MetaMask detected");
    return;
  }

  var web3 = new Web3(window.ethereum)
  const networkId = await web3.eth.net.getId();

  const lottery = new web3.eth.Contract
    (lotjson.abi, lotjson.networks[networkId].address);
  
  await lottery.methods
  .requestPot()
  .send({ from: await selectedAddress() });

  getInfo();
}

const loGains = document.getElementById("lo-gains");
loGains.onclick = async () => {

  if (!window.ethereum) {
    alert("No MetaMask detected");
    return;
  }

  var web3 = new Web3(window.ethereum)
  const networkId = await web3.eth.net.getId();

  const lottery = new web3.eth.Contract
    (lotjson.abi, lotjson.networks[networkId].address);
  
  await lottery.methods
  .requestGains()
  .send({ from: await selectedAddress() });

  getInfo();
}