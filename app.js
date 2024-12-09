const { Web3 } = require("web3"); // Versão 3.x
const Fastify = require("fastify");
require("dotenv").config();

// Configuração do Fastify
const fastify = Fastify({ logger: false });

// Configuração do Web3
const web3 = new Web3("http://127.0.0.1:7545"); // URL do Ganache

// Função para pegar o endereço das contas
async function getAccounts() {
  // Pega as contas no Ganache
  const accounts = await web3.eth.getAccounts();

  console.log("Endereços das contas no Ganache:");
  accounts.forEach((account, index) => {
    console.log(`${index + 1}: ${account}`);
  });
}

// ABI e endereço do contrato EventManager
const contractEventJSON = require("./build/contracts/EventManager.json");
const contractEventABI = contractEventJSON.abi;

const contractBetJSON = require("./build/contracts/Betting.json");
const contractBetABI = contractBetJSON.abi;

const contractAddressEvent = "0x07345B99EaB6b95ba071697702cd92B92c386f44";
const contractAddressBetting = "0x28BA45A6EbC5064d85a907AC491b6a5Ce96B1b5D";

const EventManager = new web3.eth.Contract(
  contractEventABI,
  contractAddressEvent
);
const Betting = new web3.eth.Contract(contractBetABI, contractAddressBetting);

// Endpoint para definir um valor
fastify.post("/criarevento", async (request, reply) => {
  const accounts = await web3.eth.getAccounts(); // Contas do Ganache

  try {
    const receipt = await Betting.methods
      .createEvent("Teste de evento")
      .send({ from: accounts[0], gas: 300000 });
    reply.send({ status: "success", transaction: receipt.transactionHash });
  } catch (error) {
    reply.status(500).send(error.toString());
  }
});

fastify.post("/apostar", async (request, reply) => {
  const accounts = await web3.eth.getAccounts(); // Contas do Ganache
  try {
    const receipt = await Betting.methods.placeBet(1, 1).send({
      from: accounts[0],
      gas: 300000,
      value: web3.utils.toWei("0.1", "ether"),
    });

    reply.send({ status: "sucess", transaction: receipt.transactionHash });
  } catch (error) {
    reply.status(500).send(error.toString());
  }
});

fastify.post("/encerrarevento", async (request, reply) => {
  const accounts = await web3.eth.getAccounts(); // Contas do Ganache
  try {
    const receipt = await Betting.methods.closeEvent(1, 1).send({
      from: accounts[0],
      gas: 300000,
    });

    reply.send({ status: "sucess", transaction: receipt.transactionHash });
  } catch (error) {
    console.log(error);
    reply.status(500).send(error.toString());
  }
});

fastify.post("/redistribuir", async (request, reply) => {
  const accounts = await web3.eth.getAccounts(); // Contas do Ganache
  try {
    const receipt = await Betting.methods.resolveBets(1).send({
      from: accounts[0],
      gas: 300000,
    });

    reply.send({ status: "sucess", transaction: receipt.transactionHash });
  } catch (error) {
    console.log(error);
    reply.status(500).send(error.toString());
  }
});

fastify.post("/check", async (request, reply) => {
  const accounts = await web3.eth.getAccounts(); // Contas do Ganache
  try {
    const eventDetails = await Betting.methods.events(1).call();

    console.log(eventDetails);
    reply.send({ status: "sucess", transaction: eventDetails.transactionHash });
  } catch (error) {
    console.log(error);
    reply.status(500).send(error.toString());
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    fastify.log.info("Servidor rodando em http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
