<x-layout>
    <div class="playmat">
        <div class="left-col">
            <div class="score" data-player="1">Player 1: <span>0</span></div>
            <div class="score" data-player="2">Player 2: <span>0</span></div>
        </div>
        <div class="center-col">
            <div id="player-2" class="hand"></div>
            <div id="play-area" class="combat-zone"></div>
            <div id="player-1" class="hand"></div>
        </div>
        <div class="right-col">
            <div class="cards-remaining">
                <span>0</span> Cards remaining
            </div>
        </div>
    </div>
    <div class="endgame-notification"></div>
</x-layout>
