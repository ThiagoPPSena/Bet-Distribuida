import web3 from './web3';

import contractEventJSON from '../../../servidor/build/contracts/EventManager.json';

const contractEventABI = contractEventJSON.abi;
const contractAddressEvent: string =
  '0xAAB05409074acd87dF0BE21A0877B51bdfB00508';

const EventManager = new web3.eth.Contract(
  contractEventABI,
  contractAddressEvent
);

// Função para pegar as contas do Ganache
async function getGanacheAccounts(): Promise<string[] | Error> {
  try {
    const accounts = await web3.eth.getAccounts(); // Obtém as contas
    return accounts;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Error(`Erro: ${error.message}`);
    }
    return new Error('Erro desconhecido');
  }
}

// Função para pegar o valor do saldo de uma conta
async function getBalance(account: string): Promise<string | Error> {
  try {
    const balance = await web3.eth.getBalance(account); // Obtém o saldo da conta
    return web3.utils.fromWei(balance, 'ether');
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Error(`Erro: ${error.message}`);
    }
    return new Error('Erro desconhecido');
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
    if (error instanceof Error) {
      return new Error(`Erro: ${error.message}`);
    }
    return new Error('Erro desconhecido');
  }
}

// Função para fechar evento
async function closeEvent(
  eventId: number,
  account: string
): Promise<{ message: string } | Error> {
  try {
    await EventManager.methods.closeEvent(eventId).send({
      from: account,
      gas: '1299999',
    });
    return { message: `Evento fechado com sucesso!` };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Error(`Erro: ${error.message}`);
    }
    return new Error('Erro desconhecido');
  }
}

// Função para apostar em um evento
async function betEvent(
  eventId: number,
  choice: number,
  value: number,
  account: string
): Promise<{ message: string } | Error> {
  try {
    await EventManager.methods.placeBet(eventId, choice).send({
      from: account,
      gas: '1299999',
      value: String(value),
    });
    return { message: `Aposta realizada com sucesso!` };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Error(`Erro: ${error.message}`);
    }
    return new Error('Erro desconhecido');
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
    await createEvent(
      'Evento 1',
      '1633084800',
      '0x7Ff87Bacee62635585b50067Fe12B92Dce280814'
    );
    const openEvents: OpenEvent[] = await EventManager.methods
      .getOpenEvents()
      .call();
    // console.log(openEvents);

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
    if (error instanceof Error) {
      return new Error(`Erro: ${error.message}`);
    }
    return new Error('Erro desconhecido');
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
    console.log(myEvents);

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
    if (error instanceof Error) {
      return new Error(`Erro: ${error.message}`);
    }
    return new Error('Erro desconhecido');
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
    console.log(myBets);

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
    if (error instanceof Error) {
      return new Error(`Erro: ${error.message}`);
    }
    return new Error('Erro desconhecido');
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
