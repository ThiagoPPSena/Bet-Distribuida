import Web3 from 'web3';

// Define uma variável para a instância do Web3

// Configura o provedor HTTP para conectar ao nó Ethereum
const provider = new Web3.providers.HttpProvider(
  "http://127.0.0.1:7545" // Endereço do nó Ethereum (Ganache)
);

// Inicializa a instância do Web3
const web3 = new Web3(provider);


export default web3;