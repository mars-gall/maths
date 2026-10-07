var cards = [
    2, 2, 2, 2,
    3, 3, 3, 3,
    4, 4, 4, 4,
    5, 5, 5, 5,
    6, 6, 6, 6,
    7, 7, 7, 7,
    8, 8, 8, 8,
    9, 9, 9, 9,
    10, 10, 10, 10,
    "J", "J", "J", "J",
    "Q", "Q", "Q", "Q",
    "K", "K", "K", "K",
    "A", "A", "A", "A"
];

const hands = [];
const activeHandsWorth = [];
const stoodHands = [];
const stoodHandsWorth = [];
let dealerHand = [];
let playerHand = [];
let playerWins = 0;
let dealerWins = 0;
let gameOver = false
let monies = 1000
let handNum = 1

const readline = require("readline");

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function dealCards(numPlayers) {
    
    for (let i = 0; i < numPlayers; i++) {
        hands.push([
            cards.splice(Math.ceil(Math.random() * cards.length), 1)[0],
            cards.splice(Math.ceil(Math.random() * cards.length), 1)[0]
        ]);
    }
    return hands;
}


function HandValue(hand) {
    let value = 0;
    let numAces = 0;

    for (const card of hand) {
        if (card === "J" || card === "Q" || card === "K") {
            value += 10;
        } else if (card === "A") {
            value += 11;
            numAces++;
        } else {
            value += card;
        }
    }

    while (value > 21 && numAces > 0) {
        value -= 10;
        numAces--;
    }
    return value; 
}

function simulate(numPlayers) {

        cards = [
            2, 2, 2, 2,
            3, 3, 3, 3,
            4, 4, 4, 4,
            5, 5, 5, 5,
            6, 6, 6, 6,
            7, 7, 7, 7,
            8, 8, 8, 8,
            9, 9, 9, 9,
            10, 10, 10, 10,
            "J", "J", "J", "J",
            "Q", "Q", "Q", "Q",
            "K", "K", "K", "K",
            "A", "A", "A", "A"
        ];
        hands.length = 0;
        activeHandsWorth.length = 0;
        stoodHands.length = 0;
        stoodHandsWorth.length = 0;
        dealCards(numPlayers);
        dealerHand = hands[0];
        playerHand = hands[1];
        activeHandsWorth.push(0)
        activeHandsWorth.push(100)

   playerTurn();
}

function restart() {
    gameOver = false;
    simulate(2);
}

function playerTurn() {
    console.log(`Player Hand: ${playerHand} Dealer Showing: ${dealerHand[0]} Player Bet: $${activeHandsWorth[handNum]}`)

    if (HandValue(playerHand) === 21) {
        console.log(`Player has BLACKJACK!`)
        dealerTurn();
    }
    else {
        console.log("Player may hit, double, or stand. If player has two of the same card, they may also split. If the player has already split they may swap hands so long as they have not busted or stood with their other hand. What would you like to do? If the player splits they place an aditional bet of equal value on their second hand. Type 'hit', 'double', 'stand', 'split', or 'swap'.")
    askPlayer();
    }
}

function askPlayer() {

    r1.question("Choose action: ", (answer) => {
        if (answer === "hit" && gameOver === false) {
            hitPlayer();
    }
        else if (answer === "stand" && gameOver === false) {
            standPlayer();
        }
        else if (answer === "split" && gameOver === false) {
            splitPlayer();
        }
        else if (answer === "swap" && gameOver === false) {
            swapHands();
            askPlayer();
        }
        else if (answer === "double" && gameOver === false) {
            doublePlayer();
        }
        else if (answer === "yes" && gameOver === true) {
            restart();
        }
        else if (answer === "no" && gameOver === true) {
            r1.close();
        }
        else {
            console.log("Invalid input, please try again.")
            askPlayer();
        }
    });

}

function hitPlayer() {

    playerHand.push(cards.splice(Math.ceil(Math.random() * cards.length), 1)[0]);
    console.log(`Player Hits. Player Hand: ${playerHand} Dealer Showing: ${dealerHand[0]}`)

    if (HandValue(playerHand) > 21) {
        console.log(`Player has BUSTED with hand ${playerHand}.`)
        standPlayer();
    }
    else if (HandValue(playerHand) === 21) {
        console.log(`Player has BLACKJACK ${playerHand}.`)
        standPlayer();        
    }
    else if (HandValue(playerHand) < 21) {
        askPlayer();
    }
    else {
        console.log(`fuck`)
    }
}

function doublePlayer() {
    activeHandsWorth[handNum] = activeHandsWorth[handNum] * 2;
    playerHand.push(cards.splice(Math.ceil(Math.random() * cards.length), 1)[0]);
    standPlayer();
}

function standPlayer() {

    stoodHands.push(hands[handNum])
    stoodHandsWorth.push(activeHandsWorth[handNum])
    hands.splice(handNum, 1)
    activeHandsWorth.splice(handNum, 1)

    if (hands.length > 1) {
        swapHands();
        askPlayer();
    }
    else {
        dealerTurn();
    };
};

function splitPlayer() {
    
    if (HandValue([playerHand[0]]) === HandValue([playerHand[1]]) && playerHand.length === 2) {

            const firstCard = playerHand[0];
            const secondCard = playerHand[1];
            
            hands[handNum] = [
                firstCard,
                cards.splice(Math.ceil(Math.random() * cards.length), 1)[0]
                
            ];

            hands.push([
                secondCard,
                cards.splice(Math.ceil(Math.random() * cards.length), 1)[0]
            ]);

            activeHandsWorth.push(100)

            playerHand = hands[handNum]
    
            console.log(`Player split into ${hands.length - 1} hands.`)
            console.log(`Current Hand: ${playerHand}`)
            askPlayer();
        }
    
    else {
        console.log("Cannot Split, Cards are not the same value.")
        playerTurn();
    }
}

function swapHands() {
    if (hands.length > 2) {
       handNum++;
       if (handNum > hands.length - 1) {
        handNum = 1;
       };
       playerHand = hands[handNum];
       console.log(`Player is playing with Hand ${handNum}: ${playerHand}. Current Bet: ${activeHandsWorth[handNum]}`)
    }
    else {
        console.log(`Player is playing with Hand ${handNum}: ${playerHand}. Current Bet: ${activeHandsWorth[handNum]}`)
        console.log(`This is Players only hand`)
    }
};

function dealerTurn() {

    console.log(`Dealer's Turn. Dealer Hand: ${dealerHand}`)

    if (HandValue(dealerHand) < 17) {
        dealerHand.push(cards.splice(Math.ceil(Math.random() * cards.length), 1)[0]);
        console.log(`Dealer Hits. Dealer Hand: ${dealerHand}`)
        dealerTurn();
    }
    else {
        console.log(`Dealer Stands with hand: ${dealerHand}`)
        endGame();
    };
};

function endGame() {

    gameOver = true;
    
    for (let i = 0; i < stoodHands.length; i++) {
        playerHand = stoodHands[i];

            if (HandValue(playerHand) > 21) {
                console.log(`BUST, Player Loses! Player: ${HandValue(playerHand)} Dealer: ${HandValue(dealerHand)}`)
                dealerWins++
                monies = monies - stoodHandsWorth[i]
            }
            else if (HandValue(dealerHand) > 21) {
                console.log(`Dealer BUST, Player Wins! Player: ${HandValue(playerHand)} Dealer: ${HandValue(dealerHand)}`)
                playerWins++
                monies = monies + stoodHandsWorth[i]
            }
            else if (HandValue(playerHand) === 21 && HandValue(dealerHand) < 21) {
                console.log(`BLACKJACK! Player Wins! Player: ${HandValue(playerHand)} Dealer: ${HandValue(dealerHand)}`)
                playerWins++
                monies = monies + stoodHandsWorth[i] * 1.5
            }
            else if (HandValue(dealerHand) > HandValue(playerHand)) {
                console.log(`Dealer Wins! Player: ${HandValue(playerHand)} Dealer: ${HandValue(dealerHand)}`)
                dealerWins++
                monies = monies - stoodHandsWorth[i]
            }
            else if (HandValue(playerHand) > HandValue(dealerHand)) {
                console.log(`Player Wins! Player: ${HandValue(playerHand)} Dealer: ${HandValue(dealerHand)}`)
                playerWins++
                monies = monies + stoodHandsWorth[i]
            }
            else if (HandValue(playerHand) === HandValue(dealerHand)) {
                console.log(`Tie. Bet pushed. Player: ${HandValue(playerHand)} Dealer: ${HandValue(dealerHand)}`)
            };
        };

    monies = Math.floor(monies)

    console.log(`Player Wins: ${playerWins} Dealer Wins: ${dealerWins} Player Money: $${monies}`)
    console.log("Would you like to play again? Type 'yes' or 'no'")

    askPlayer();

};

simulate(2);