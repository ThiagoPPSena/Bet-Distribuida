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

const contractAddressEvent = "0xfD3388F3Cb1945C0B3f2C5a4aeCcAC200B96d38D";

const EventManager = new web3.eth.Contract(
  contractEventABI,
  contractAddressEvent
);

// Endpoint para definir um valor
fastify.post("/criarevento", async (request, reply) => {
  // Pega os valores do corpo da requisição
  const { name, endTimestamp } = request.body;
  // Estima o gas
  const gasEstimate = await EventManager.methods
    .createEvent(name, endTimestamp)
    .estimateGas();
  const adjustedGasEstimate = Math.floor(Number(gasEstimate) * 1.5);
  // Pega as contas no Ganache
  const accounts = await web3.eth.getAccounts(); // Contas do Ganache

  try {
    const receipt = await EventManager.methods
      .createEvent(name, endTimestamp)
      .send({ from: accounts[0], gas: adjustedGasEstimate });

    reply.status(200).send({
      message: "Evento criado com sucesso",
      transaction: receipt.transactionHash,
    });
  } catch (error) {
    reply.status(500).send(error.toString());
  }
});

fastify.post("/apostar", async (request, reply) => {
  // Pega os valores do corpo da requisição
  const { eventId, choice, value, accountIndex } = request.body;

  // Pega as contas no Ganache
  const accounts = await web3.eth.getAccounts(); // Contas do Ganache
  try {
    const receipt = await EventManager.methods.placeBet(eventId, choice).send({
      from: accounts[accountIndex],
      gas: "1299999",
      value: web3.utils.toWei(value, "ether"),
    });

    reply.status(200).send({
      message: "Aposta feita com sucesso",
      transaction: receipt.transactionHash,
    });
  } catch (error) {
    console.log(error);
    reply.status(500).send(error.toString());
  }
});

fastify.post("/encerrarevento", async (request, reply) => {
  // Pega os valores do corpo da requisição
  const { eventId, accountIndex } = request.body;
  // Pega as contas no Ganache
  const accounts = await web3.eth.getAccounts(); // Contas do Ganache
  try {
    const receipt = await EventManager.methods.closeEvent(eventId).send({
      from: accounts[accountIndex],
      gas: "1299999",
    });

    reply.status(200).send({
      message: "Evento encerrado com sucesso!",
      transaction: receipt.transactionHash,
    });
  } catch (error) {
    console.log(error);
    reply.status(500).send(error.toString());
  }
});

fastify.get("/check/:eventId", async (request, reply) => {
  const { eventId } = request.params;
  try {
    const eventDetails = await EventManager.methods.events(eventId).call();

    const eventData = {
      eventId: eventId,
      name: eventDetails.nameconst,
      totalFor: web3.utils.toBigInt(eventDetails.totalFor).toString(),
      totalAgainst: web3.utils.toBigInt(eventDetails.totalAgainst).toString(),
      closed: eventDetails.closed,
      result: web3.utils.toBigInt(eventDetails.result).toString(),
      endTimestamp: web3.utils.toBigInt(eventDetails.endTimestamp).toString(),
    };
    reply
      .status(200)
      .send({ event: eventData, transaction: eventDetails.transactionHash });
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
