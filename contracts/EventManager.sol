// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventManager {

    uint256 public constant COMMISSION = 5; // 5% do valor apostado no evento vai para o criador
    
    struct Event {
        string name; // Nome do evento
        uint256 totalFor; // Total de apostas a favor
        uint256 totalAgainst; // Total de apostas contra
        bool closed; // Evento fechado ou não
        uint256 result; // 0 for "open", 1 for "for", 2 for "against"
        uint256 endTimestamp; // Timestamp de encerramento do evento
    }
    
    mapping(uint256 => Event) public events; // Mapping/Dicionário de eventos (ID: event)
    mapping(uint256 => address) public eventCreators; // Criador de cada evento
    uint256 public eventCount = 0;

     struct Bet {
        address bettor;
        uint256 value;
        uint256 choice; // 1 ou 2
    }

    // Dicionário de eventos com uma lista de apostas {eventId: [Bet1, Bet2, ...]}
    mapping(uint256 => Bet[]) public bets;

    // Função para criação de evento (adicionando-o ao dicionário)
    function createEvent(string memory _name, uint256 _endTimestamp) public {
        events[eventCount] = Event(
            _name,
            0,
            0,
            false,
            0,
            _endTimestamp
        );
        eventCreators[eventCount] = msg.sender; // Armazena o criador do evento
        eventCount++;
    }

    // Função de distribuição de valores após finalização do evento
    function resolveBets(uint256 _eventId) public {
        Event storage eventDetails = events[_eventId];
        require(events[_eventId].closed, "Evento ainda nao encerrado");

        uint256 winningChoice = eventDetails.result;
        uint256 totalPool = eventDetails.totalFor + eventDetails.totalAgainst;
        uint256 winningPool = (winningChoice == 1) ? eventDetails.totalFor : eventDetails.totalAgainst;

        // Pega o criador do evento pelo event id
        address creatorEvent = getEventCreator(_eventId);
        
        // Caso não haja apostas na escolha vencedora
        if (winningPool == 0) {
            // Transfere todo o saldo do evento ao criador
            payable(creatorEvent).transfer(totalPool);
            return; // Finaliza a execução
        }

        uint256 creatorCommission = (totalPool * COMMISSION) / 100;
        uint256 rewardPool = totalPool - creatorCommission;

        // Defina uma constante de precisão
        uint256 PRECISION = 1e18;

        // Multiplique antes de dividir para manter a precisão
        uint256 rewardPerUnit = (rewardPool * PRECISION) / winningPool;

        // Paga o criador do evento a comissão
        payable(creatorEvent).transfer(creatorCommission);

        // Distribui as recompensas para os vencedores
        for (uint256 i = 0; i < bets[_eventId].length; i++) {
            Bet storage userBet = bets[_eventId][i];
            if (userBet.choice == winningChoice) {
                // Multiplique o valor da aposta pelo rewardPerUnit e divida pela precisão
                uint256 reward = (userBet.value * rewardPerUnit) / PRECISION;
                payable(userBet.bettor).transfer(reward);
            }
        }
    }

    // Função para encerrar um evento e registrar o resultado
    function closeEvent(uint256 _eventId) public {
        require(!events[_eventId].closed, "Evento ja fechado");
        require(msg.sender == eventCreators[_eventId], "Apenas o criador do evento pode fechar");
        require(block.timestamp >= events[_eventId].endTimestamp, "Evento ainda nao encerrado");

        // Sorteio do resultado
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 2 + 1;

        events[_eventId].result = random;
        events[_eventId].closed = true;
        resolveBets(_eventId);
    }


    // Função para consultar o criador de um evento
    function getEventCreator(uint256 _eventId) public view returns (address) {
        return eventCreators[_eventId];
    }

    // =====---------------------------Funções de betting-------------------------------------=====

    // Função em que o usuário insere o valor (aposta) em um evento
    function placeBet(uint256 _eventId, uint256 _choice) public payable {
        require(msg.value > 0, "Deve ser enviado ethereum"); // Precisa enviar ether
        require(!events[_eventId].closed, "Evento fechado"); // Evento fechado

        bets[_eventId].push(Bet(msg.sender, msg.value, _choice));

        // Se a escolha for a primeira
        if (_choice == 1) {
            events[_eventId].totalFor += msg.value;
        // Se a escolha for a segunda
        } else if (_choice == 2){
            events[_eventId].totalAgainst += msg.value;
        } else {
            revert("Escolha invalida");
        }
    }

    
}