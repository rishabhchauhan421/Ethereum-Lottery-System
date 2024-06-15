const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const { abi, evm } = require('./compile');

//This is just for testing purposes. In production, you should use environment variables.
//Feel free to steal my test Sepolia coins.
const provider = new HDWalletProvider(
  'join squirrel ticket spot spoil velvet expose stereo squeeze blossom cruise bread',
  'https://sepolia.infura.io/v3/999f4134607c4db28981c679ab5210b9'
);

const web3 = new Web3(provider);

const deploy = async () => {
  // console.log({ abi });
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', accounts[0]);
  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ from: accounts[0], gas: '1000000' });

  console.log({ abi });
  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();
