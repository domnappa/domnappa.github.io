<x-layout>
    <h1>Card Game</h1>
    <div class="main-controls">
        <a href="/game">
            <div class="btn">
                Start Game
            </div>
        </a>
    </div>
    <div class="game-rules">
        <ol>
            <li>All players select a card from their hand to play for the turn</li>
            <li>The player with the highest card value wins the fight</li>
            <li>In the event of a tie, winner is determined based on the suit: clubs (♣) > diamonds (♦) >hearts (♥) > spades (♠)</li>
            <li>You gain points equal to the difference of the highest played card value, and the lowest played card value</li>
        </ol>
    </div>
</x-layout>
