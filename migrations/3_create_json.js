const Lottery = artifacts.require("Lottery")

module.exports =  function (deployer) {
  
  const fs = require('fs')

  lotjson= JSON.parse(fs.readFileSync('build/contracts/Lottery.json'))

  let reducedJson = {};
  reducedJson["abi"] = lotjson.abi;
  reducedJson["networks"] = lotjson.networks;

  fs.writeFile('./client/contracts/LotteryReduced.json', JSON.stringify(reducedJson,null,2), (error) => {
    if (error) {
      console.log(`Error occurs, Error code -> ${err.code},
      Error No -> ${err.errno}`);
      throw error;
    }
  });
}