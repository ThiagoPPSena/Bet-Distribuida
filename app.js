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
    
    console.log('Endereços das contas no Ganache:');
    accounts.forEach((account, index) => {
        console.log(`${index + 1}: ${account}`);
    });
}

// ABI e endereço do contrato
const contractJSON = require("./build/contracts/Storage.json");
const contractABI = contractJSON.abi;
const contractAddress ="0xa73AA83CAB4841B38d282407b94d8DA4a0916B4f"

const storage = new web3.eth.Contract(contractABI, contractAddress);

// Endpoint para definir um valor
fastify.post("/setValue", async (request, reply) => {
    const { value } = request.body;
    const accounts = await web3.eth.getAccounts(); // Contas do Ganache
    try {
        const receipt = await storage.methods.set(value).send({ from: accounts[0] });
        reply.send({ status: "success", transaction: receipt.transactionHash });
    } catch (error) {
        reply.status(500).send(error.toString());
    }
});

// Endpoint para obter o valor armazenado
fastify.get("/getValue", async (request, reply) => {
    try {
        const value = await storage.methods.get().call();
        const formattedValue = web3.utils.toBigInt(value).toString();
        reply.send({ value: formattedValue });
    } catch (error) {
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
