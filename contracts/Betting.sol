// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./EventManager.sol";

contract Betting is EventManager {

    struct Bet {
        address bettor;
        uint256 value;
        uint256 choice; // 1 ou 2
    }

    // Dicionário de eventos com uma lista de apostas {eventId: [Bet1, Bet2, ...]}
    mapping(uint256 => Bet[]) public bets;

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

    // Função de distribuição de valores após finalização do evento
    function resolveBets(uint256 _eventId) public {
        Event storage eventDetails = events[_eventId];
        require(events[_eventId].closed, "Evento ainda nao encerrado");

        // Pegar o resultado do evento
        uint256 winningChoice = eventDetails.result;
        // Pegar o valor total em apostas para o evento
        uint256 totalPool =(eventDetails.totalFor + eventDetails.totalAgainst) / 1 ether;
        // Pegar o valor total em apostas para o resultado vencedor
        uint256 winningPool = (winningChoice == 1) ? (eventDetails.totalFor / 1 ether) : (eventDetails.totalAgainst / 1 ether);

        // Calcula o valor da comissão do criador do evento
        uint256 creatorCommission = totalPool * (COMMISSION / 100);
        // Calcula o valor total restante para distribuir
        uint256 rewardPool = totalPool - creatorCommission;
        // Calcula o multiplicador de odds para o resultado vencedor
        uint256 rewardPerUnit = rewardPool / winningPool; // Odds
        // Pegar o criador do evento pelo event id
        address creatorEvent = getEventCreator(_eventId);

        // Paga o criador do evento a comissão
        payable(creatorEvent).transfer(creatorCommission);

        // Distribui as recompensas para os vencedores
        for (uint256 i = 0; i < bets[_eventId].length; i++) {
            Bet storage userBet = bets[_eventId][i];
            if (userBet.choice == winningChoice) {
                payable(userBet.bettor).transfer(userBet.value * rewardPerUnit);
            }
        }
    }

}
