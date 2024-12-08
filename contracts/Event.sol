// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventManager {
    struct Event {
        string name;
        uint256 oddsFor;
        uint256 oddsAgainst;
        uint256 totalFor;
        uint256 totalAgainst;
        bool closed;
        uint256 result; // 1 for "for", 2 for "against"
    }

    mapping(uint256 => Event) public events;
    uint256 public eventCount;

    function createEvent(
        string memory _name,
        uint256 _oddsFor,
        uint256 _oddsAgainst
    ) public {
        events[eventCount++] = Event(
            _name,
            _oddsFor,
            _oddsAgainst,
            0,
            0,
            false,
            0
        );
    }

    function closeEvent(uint256 _eventId, uint256 _result) public {
        require(!events[_eventId].closed, "Event is already closed");
        events[_eventId].closed = true;
        events[_eventId].result = _result;
    }
}
