import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SimpleERC20 from "./SimpleERC20.json";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState("");
  const [recipient, setRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [checkAddress, setCheckAddress] = useState("");
  const [checkBalance, setCheckBalance] = useState("");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.requestAccounts();
        setAccount(accounts[0]);

        const allAccounts = await web3Instance.eth.getAccounts();
        setAddresses(allAccounts);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = SimpleERC20.networks[networkId];

        if (deployedNetwork) {
          const contractInstance = new web3Instance.eth.Contract(
            SimpleERC20.abi,
            deployedNetwork.address
          );
          setContract(contractInstance);

          const balance = await contractInstance.methods.balanceOf(accounts[0]).call();
          setBalance(web3Instance.utils.fromWei(balance, "ether"));
        } else {
          alert("Smart contract not deployed to detected network.");
        }
      } else {
        alert("Please install MetaMask to use this app.");
      }
    };

    init();
  }, []);

  const transferTokens = async () => {
    if (contract) {
      try {
        await contract.methods
          .transfer(recipient, web3.utils.toWei(transferAmount, "ether"))
          .send({ from: account });
        alert("Transfer successful!");

        const balance = await contract.methods.balanceOf(account).call();
        setBalance(web3.utils.fromWei(balance, "ether"));
      } catch (error) {
        alert("Transfer failed: " + error.message);
      }
    }
  };

  const handleCheckBalance = async () => {
    if (contract && checkAddress) {
      try {
        const balance = await contract.methods.balanceOf(checkAddress).call();
        setCheckBalance(web3.utils.fromWei(balance, "ether"));
      } catch (error) {
        alert("Failed to fetch balance: " + error.message);
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>ERC-20</h1>
      <p><strong>Your Address:</strong> {account}</p>
      <p><strong>Your Balance:</strong> {balance} Tokens</p>

      <div>
        <h2>Transfer Tokens</h2>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={transferTokens}>Transfer</button>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Check Balance of Any Address</h2>
        <input
          type="text"
          placeholder="Enter Address"
          value={checkAddress}
          onChange={(e) => setCheckAddress(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleCheckBalance}>Check Balance</button>
        {checkBalance && (
          <p><strong>Balance:</strong> {checkBalance} Tokens</p>
        )}
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>All Addresses</h2>
        <ul>
          {addresses.map((addr, index) => (
            <li key={index}>{addr}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
