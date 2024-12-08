// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventManager {
    struct Event {
        string name; // Nome do evento
        uint256 totalFor; // Total de apostas a favor
        uint256 totalAgainst; // Total de apostas contra
        bool closed; // Evento fechado ou não
        uint256 result; // 0 for "open", 1 for "for", 2 for "against"
    }

    mapping(uint256 => Event) public events; // Mapping/Dicionário de eventos (ID: event)
    mapping(uint256 => address) public eventCreators; // Criador de cada evento
    uint256 public eventCount = 0;
    uint256 public constant COMMISSION = 5; // 5% do valor apostado no evento vai para o criador

    // Função para criação de evento (adicionando-o ao dicionário)
    function createEvent(string memory _name) public {
        events[eventCount] = Event(
            _name,
            0,
            0,
            false,
            0
        );
        eventCreators[eventCount] = msg.sender; // Armazena o criador do evento
        eventCount++;
    }

    // Função para encerrar um evento e registrar o resultado
    function closeEvent(uint256 _eventId, uint256 _result) public {
        require(!events[_eventId].closed, "Evento ja fechado");
        events[_eventId].closed = true;
        events[_eventId].result = _result;
    }

    // Função para consultar o criador de um evento
    function getEventCreator(uint256 _eventId) public view returns (address) {
        return eventCreators[_eventId];
    }
}