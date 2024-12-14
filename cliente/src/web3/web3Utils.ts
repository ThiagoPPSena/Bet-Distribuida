import web3 from './web3';
import contractEventJSON from '../../../servidor/build/contracts/EventManager.json';
import contractAddress from '../../../contractAddress.json';

const contractEventABI = contractEventJSON.abi;
const contractAddressEvent = contractAddress.contractAddress;

const EventManager = new web3.eth.Contract(
  contractEventABI,
  contractAddressEvent
);

interface ContractExecutionError extends Error {
  cause?: {
    message: string;
  };
  code?: number;
}

function captureRevertMessage(error: unknown): string {
  if (error instanceof Error) {
    const contractError = error as ContractExecutionError;
    const messageError = contractError.cause?.message;
    if (messageError === 'insufficient funds for gas * price + value') {
      return 'Saldo insuficiente';
    }
    const revertMessageMatch = messageError?.match(/revert (.*)/);
    const revertMessage = revertMessageMatch
      ? revertMessageMatch[1]
      : 'Erro desconhecido';
    return revertMessage;
  }
  return 'Erro desconhecido';
}

// Função para pegar as contas do Ganache
async function getGanacheAccounts(): Promise<string[] | Error> {
  try {
    const accounts = await web3.eth.getAccounts(); // Obtém as contas
    return accounts;
  } catch (error: unknown) {
    const friendlyMessage = captureRevertMessage(error);
    return new Error(friendlyMessage);
  }
}

// Função para pegar o valor do saldo de uma conta
async function getBalance(account: string): Promise<string | Error> {
  try {
    const balance = await web3.eth.getBalance(account); // Obtém o saldo da conta
    return web3.utils.fromWei(balance, 'ether');
  } catch (error: unknown) {
    const friendlyMessage = captureRevertMessage(error);
    return new Error(friendlyMessage);
  }
}

// Função para criar um evento no contrato
async function createEvent(
  name: string,
  endTimestamp: string,
  account: string
): Promise<{ message: string } | Error> {
  try {
    await EventManager.methods.createEvent(name, endTimestamp).send({
      from: account,
      gas: '1299999',
    });
    return { message: `Evento criado com sucesso!` };
  } catch (error: unknown) {
    const friendlyMessage = captureRevertMessage(error);
    return new Error(friendlyMessage);
  }
}

// Função para fechar evento
async function closeEvent(
  eventId: string,
  account: string
): Promise<{ message: string } | Error> {
  try {
    await EventManager.methods.closeEvent(eventId).send({
      from: account,
      gas: '1299999',
    });
    return { message: `Evento fechado com sucesso!` };
  } catch (error: unknown) {
    const friendlyMessage = captureRevertMessage(error);
    console.log(friendlyMessage);
    return new Error(friendlyMessage);
  }
}

// Função para apostar em um evento
async function betEvent(
  eventId: string,
  choice: number,
  value: string,
  account: string
): Promise<{ message: string } | Error> {
  try {
    const valueInWei = web3.utils.toWei(value, 'ether'); // Converte o valor de Ether para Wei
    await EventManager.methods.placeBet(eventId, choice).send({
      from: account,
      gas: '1299999',
      value: valueInWei,
    });
    return { message: `Aposta realizada com sucesso!` };
  } catch (error: unknown) {
    const friendlyMessage = captureRevertMessage(error);
    return new Error(friendlyMessage);
  }
}

export interface OpenEvent {
  // Data formatada para o front-end
  eventId: string;
  name: string;
  totalFor: string;
  totalAgainst: string;
  closed: boolean;
  result: string;
  endTimestamp: string;
}

// Função para pegar os eventos abertos
async function getOpenEvents(): Promise<{ events: OpenEvent[] } | Error> {
  try {
    // await createEvent(
    //   'Evento 1',
    //   '1633084800',
    //   '0xda4062797ea155095fe8aEc85fe52C330E0303e7'
    // );
    const openEvents: OpenEvent[] = await EventManager.methods
      .getOpenEvents()
      .call();
    if (!Array.isArray(openEvents) || openEvents.length === 0) {
      return new Error('Nenhum evento aberto encontrado');
    }

    const eventDataFormatted: OpenEvent[] = openEvents.map((event) => {
      return {
        eventId: web3.utils.toBigInt(event.eventId).toString(),
        name: event.name,
        totalFor: web3.utils.fromWei(event.totalFor, 'ether'),
        totalAgainst: web3.utils.fromWei(event.totalAgainst, 'ether'),
        closed: event.closed,
        result: web3.utils.toBigInt(event.result).toString(),
        endTimestamp: web3.utils.toBigInt(event.endTimestamp).toString(),
      };
    });
    return { events: eventDataFormatted };
  } catch (error: unknown) {
    const friendlyMessage = captureRevertMessage(error);
    return new Error(friendlyMessage);
  }
}

// Função para pegar os eventos do usuário
async function getMyEvents(
  account: string
): Promise<{ events: OpenEvent[] } | Error> {
  try {
    const myEvents: OpenEvent[] = await EventManager.methods
      .getMyEvents()
      .call({ from: account });

    if (!Array.isArray(myEvents) || myEvents.length === 0) {
      return new Error('Nenhum evento encontrado');
    }

    const eventDataFormatted: OpenEvent[] = myEvents.map((event) => {
      return {
        eventId: web3.utils.toBigInt(event.eventId).toString(),
        name: event.name,
        totalFor: web3.utils.fromWei(event.totalFor, 'ether'),
        totalAgainst: web3.utils.fromWei(event.totalAgainst, 'ether'),
        closed: event.closed,
        result: web3.utils.toBigInt(event.result).toString(),
        endTimestamp: web3.utils.toBigInt(event.endTimestamp).toString(),
      };
    });
    return { events: eventDataFormatted };
  } catch (error: unknown) {
    const friendlyMessage = captureRevertMessage(error);
    return new Error(friendlyMessage);
  }
}

// Função para pegar as apostas do usuário
async function getMyBets(
  account: string
): Promise<{ events: OpenEvent[] } | Error> {
  try {
    const myBets: OpenEvent[] = await EventManager.methods
      .getMyBets()
      .call({ from: account });

    if (!Array.isArray(myBets) || myBets.length === 0) {
      return new Error('Nenhuma aposta encontrada');
    }

    const eventDataFormatted: OpenEvent[] = myBets.map((event) => {
      return {
        eventId: web3.utils.toBigInt(event.eventId).toString(),
        name: event.name,
        totalFor: web3.utils.fromWei(event.totalFor, 'ether'),
        totalAgainst: web3.utils.fromWei(event.totalAgainst, 'ether'),
        closed: event.closed,
        result: web3.utils.toBigInt(event.result).toString(),
        endTimestamp: web3.utils.toBigInt(event.endTimestamp).toString(),
      };
    });
    return { events: eventDataFormatted };
  } catch (error: unknown) {
    const friendlyMessage = captureRevertMessage(error);
    return new Error(friendlyMessage);
  }
}

const web3Utils = {
  EventManager,
  getBalance,
  getGanacheAccounts,
  createEvent,
  closeEvent,
  betEvent,
  getOpenEvents,
  getMyEvents,
  getMyBets,
};

export default web3Utils;
