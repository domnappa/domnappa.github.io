$(document).on('ready', function() {
    let api_url = "https://deckofcardsapi.com/api/deck/";
    let deck_id, cards_remaining, played_cards, discard = [];
    let suite_scoring = [
        "C","D","H","S"
    ];
    let value_scoring = [
        "","1","2","3","4","5","6","7","8","9","0","J","Q","K","A"
    ];
    let play_area = document.getElementById('play-area');
    let players = 2;

    async function drawCards(num_of_cards) {
        let p = new Promise((response) => {
            let request_url = api_url + `${deck_id}/draw/?count=${num_of_cards}`;
            $.get(request_url, function(data) {
                cards_remaining = data.remaining;
                response(data);
            })
        });

        return await p;
    }

    async function generateDeck() {
        let p = new Promise((response) => {
            let deck_count = players-1;
            let request_url = api_url + `/new/shuffle/?deck_count=${deck_count}`;
            $.get(request_url, function(data) {
                response(data);
            })
        });
        return await p;
    }

    function ai_move() {
        let cards_in_hand = document.querySelectorAll('.card-display--player-2');
        let card_to_play = cards_in_hand[getRandomInt(cards_in_hand.length)];
        playCard(card_to_play.dataset.cardId,2);
        card_to_play.remove();
    }

    function checkHandSize() {
        let hand_el = document.querySelectorAll('.card-display--hand');
        if(hand_el.length === 0) {
            dealNewHands();
        }
    }


    function calculateScore(winner) {
        let lowest_value = findLowestFace();
        let highest_value = findHighestFace();
        let points = highest_value - lowest_value;
        updateScore(points,winner);
        checkHandSize();
    }

    function dealNewHands() {
        if (cards_remaining < (players*5)) {
            endGame();
            return;
        }
        for(let i=0;i<players;i++) {
            let delay = 250*i;
            let player = i+1;
            setTimeout(function() {
                drawCards(5).then( response => {
                    renderCards(response.cards,player);
                    updateGameCounters();
                });
            }, delay)
        }
    }

    function determineRoundWinner() {
        played_cards = play_area.querySelectorAll('.card-display--played');
        let winner_id = findWinningPlayersId();
        highlightWinningCard(winner_id);
        calculateScore(winner_id);
    }

    function determineGameWinner() {
        let scores = document.querySelectorAll('.score');
        let current_highest = 0, winner;
        scores.forEach(el => {
            let player_id = el.dataset.player;
            let score = parseInt(document.querySelector(`.score[data-player="${player_id}"] span`).innerText);
            if (score > current_highest) {
                current_highest = score;
                winner = player_id;
            }
        });

        return winner;
    }

    function endGame() {
        let endgame_notification_el = document.querySelector('.endgame-notification');
        endgame_notification_el.innerText = `Player ${determineGameWinner()} wins!`;
        endgame_notification_el.classList.add('shown');
    }

    function findWinningPlayersId() {
        let current_highest = 0, highest_player;
        played_cards.forEach((el, index) => {
            let card_id = el.dataset.cardId;
            let face_value = value_scoring.indexOf(card_id[0]);
            if(face_value > current_highest) {
                current_highest = face_value;
                highest_player = index+1;
            } else if (face_value === current_highest) {
                highest_player = findHighestSuite();
            }
        });

        return highest_player;
    }

    function findHighestSuite() {
        let current_highest = 0, highest_player;
        played_cards.forEach((el, index) => {
            let card_id = el.dataset.cardId;
            let suite_value = suite_scoring.indexOf(card_id[1]);
            if(suite_value > current_highest) {
                current_highest = suite_value;
                highest_player = index+1;
            }
        });

        return highest_player;
    }

    function findHighestFace() {
        let current_highest = 0;
        played_cards.forEach((el, index) => {
            let card_id = el.dataset.cardId;
            let face_value = value_scoring.indexOf(card_id[0]);
            if(face_value > current_highest) {
                current_highest = face_value;
            }
        });

        return current_highest;
    }

    function findLowestFace() {
        let current_lowest = 15;
        played_cards.forEach((el, index) => {
            let card_id = el.dataset.cardId;
            let face_value = value_scoring.indexOf(card_id[0]);
            if(face_value < current_lowest) {
                current_lowest = face_value;
            }
        });

        return current_lowest;
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function highlightWinningCard(winner_id) {
        document.querySelector(`.card-display--played[data-player="${winner_id}"]`).classList.add('winner');
    }

    function playCard(card_id, player_id) {
        let combat_zone = document.getElementById('play-area');
        let card_image = document.createElement('img');
        card_image.src = `https://deckofcardsapi.com/static/img/${card_id}.png`;
        card_image.classList = 'card-display card-display--played';
        card_image.setAttribute('data-player',player_id);
        card_image.setAttribute('data-card-id',card_id);
        combat_zone.appendChild(card_image);
    }

    function renderCards(cards,player) {
        let player_hand = document.getElementById(`player-${player}`);
        for(let i=0;i<cards.length;i++) {
            let card_image = document.createElement('img');
            card_image.classList = `card-display card-display--hand card-display--player-${player}`;
            card_image.setAttribute('data-card-id',cards[i].code);
            player === 2 ? card_image.src = "/cardback_0.png" : card_image.src = cards[i].images.png;
            player_hand.appendChild(card_image);
        }
    }

    function setGameListeners() {
        let action_buttons = document.querySelectorAll('.game-action');

        action_buttons.forEach(el => {
            el.addEventListener('click', (e) => {
                switch(e.target.dataset.action) {
                    case "draw-card":
                        drawCards(1).then(response => {
                            renderCards(response.cards, 1);
                        });
                        break;
                }
            });
        });

        document.addEventListener('click', (e) => {
            if(e.target.classList.contains('card-display--player-1')) {
                document.getElementById('play-area').textContent = '';
                e.target.remove();
                playCard(e.target.dataset.cardId,1);
                ai_move();
                determineRoundWinner();
            }
        })
    }

    function updateScore(points,player) {
        let score_counter = document.querySelector(`.score[data-player="${player}"] span`);
        let current_score = parseInt(score_counter.innerText);
        score_counter.innerText = current_score + points;
    }

    function updateGameCounters() {
        let cards_remaining_el = document.querySelector('.cards-remaining span');
        cards_remaining_el.innerHTML = cards_remaining;
    }


    function initGame() {
        generateDeck().then(response => {
            deck_id = response.deck_id;
            dealNewHands();
            setGameListeners();
        });
    }

    initGame();

})
