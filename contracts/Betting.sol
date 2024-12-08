// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Event.sol";
import "./Wallet.sol";

contract Betting is EventManager, Wallet {
    struct Bet {
        uint256 amount;
        uint256 choice; // 1 for "for", 2 for "against"
    }

    mapping(address => mapping(uint256 => Bet)) public bets;

    function placeBet(uint256 _eventId, uint256 _choice) public payable {
        require(msg.value > 0, "Must send Ether to place a bet");
        require(!events[_eventId].closed, "Event is closed");

        bets[msg.sender][_eventId] = Bet(msg.value, _choice);

        if (_choice == 1) {
            events[_eventId].totalFor += msg.value;
        } else {
            events[_eventId].totalAgainst += msg.value;
        }
    }

    function calculateOdds(uint256 _eventId, uint256 _choice) public view returns (uint256) {
        Event storage eventDetails = events[_eventId];
        if (_choice == 1) {
            return (eventDetails.totalAgainst * 1 ether) / eventDetails.totalFor + 1 ether;
        } else if (_choice == 2) {
            return (eventDetails.totalFor * 1 ether) / eventDetails.totalAgainst + 1 ether;
        } else {
            revert("Invalid choice");
        }
    }

    function resolveBets(uint256 _eventId) public {
        Event storage eventDetails = events[_eventId];
        require(eventDetails.closed, "Event is not closed yet");

        uint256 winningChoice = eventDetails.result;
        uint256 totalPool = eventDetails.totalFor + eventDetails.totalAgainst;
        uint256 winningPool = (winningChoice == 1) ? eventDetails.totalFor : eventDetails.totalAgainst;

        for (uint256 i = 0; i < eventCount; i++) {
            Bet storage userBet = bets[msg.sender][_eventId];
            if (userBet.choice == winningChoice) {
                // Calcular a odds para o resultado vencedor
                uint256 odds = calculateOdds(_eventId, winningChoice);

                // Multiplicar o valor apostado pela odds para calcular os ganhos
                uint256 reward = (userBet.amount * odds) / 1 ether;
                balances[msg.sender] += reward;
            }
        }
    }


    function distributeRewards(
        uint256 _eventId,
        uint256 _choice,
        uint256 rewardPerUnit
    ) internal {
        for (uint256 i = 0; i < eventCount; i++) {
            address bettor = bets[msg.sender][_eventId].choice == _choice
                ? msg.sender
                : address(0);
            if (bettor != address(0)) {
                uint256 payout = bets[bettor][_eventId].amount * rewardPerUnit;
                balances[bettor] += payout;
            }
        }
    }
}
