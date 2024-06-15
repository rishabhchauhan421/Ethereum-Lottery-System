import './App.css';
import React, { Component, useEffect } from 'react';
import web3 from './web3';
import lottery from './lottery';

function App() {
  const [manager, setManager] = React.useState('');
  const [players, setPlayers] = React.useState([]);
  const [balance, setBalance] = React.useState('');
  const [value, setValue] = React.useState('');
  const [message, setMessage] = React.useState('');

  useEffect(() => {
    async function fetchData() {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);

      setManager(manager);
      setPlayers(players);
      setBalance(balance);
    }
    fetchData();
  }, []);

  const onSubmitEther = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction success...');

    console.log('Sending transaction from', accounts[0]);

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether'),
    });

    setMessage('You have been entered!');
  };

  const onClickPickWinner = async (event) => {
    setMessage('Selecting a winner... Please wait...');
    const accounts = await web3.eth.getAccounts();
    // console.log({ lottery, accounts });
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    setMessage('A winner has been picked!');
  };

  return (
    <div className="App">
      <h1>Lottery Contract</h1>
      <p>This contract is managed by {manager}</p>
      <p>
        There are currently {players.length} people entered, competing to win{' '}
        {web3.utils.fromWei(balance, 'ether')} ether!
      </p>
      <hr />
      <h4>Want to try your luck?</h4>
      <form onSubmit={onSubmitEther}>
        <label htmlFor="value">Amount of ether to enter</label>
        <input
          type="text"
          id="value"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button type="submit">Enter</button>
      </form>
      <h2>{message}</h2>
      <br />
      <h2>Time to pick a winner?</h2>
      <button onClick={onClickPickWinner}>Pick a winner!</button>
    </div>
  );
}

export default App;
