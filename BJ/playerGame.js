const cards = [
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
const stoodHands = [];
let dealerHand = [];
let playerHand = [];
let handSplit = false;
let handSwapping = false;
let playerWins = 0;
let dealerWins = 0;
let gameOver = false
let monies = 1000
let playerBet = 0
let numHands = 0
let handNum = 1

const { matchesGlob } = require("path");
const readline = require("readline");

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function shuffle(array) {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function dealCards(numPlayers) {
    const shuffled = shuffle(cards);
    const hands = [];

    for (let i = 0; i < numPlayers; i++) {
        hands.push(shuffled.slice(i * 2, i * 2 + 2));
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

        hands.length = 0;
        hands.push(...dealCards(numPlayers));
        dealerHand = hands[0];
        playerHand = hands[1];
        playerBet = 50
        numHands = 1

   playerTurn();
}

function restart() {
    gameOver = false;
    simulate(2);
}

function playerTurn() {
    console.log(`Player Hand: ${playerHand} Dealer Showing: ${dealerHand[0]} Player Bet: $${playerBet}`)

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
        if (answer === "hit") {
            hitPlayer();
    }
        else if (answer === "stand") {
            standPlayer();
        }
        else if (answer === "split") {
            splitPlayer();
        }
        else if (answer === "swap") {
            swapHands();
            askPlayer();
        }
        else if (answer === "double") {
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

    playerHand.push(cards[Math.floor(Math.random() * cards.length)]);
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
    playerBet = playerBet * 2
    playerHand.push(cards[Math.floor(Math.random() * cards.length)]);
    standPlayer();
}

function standPlayer() {

    stoodHands.push(hands[handNum])
    hands.slice(handNum, 1)
    numHands--

    if (handSplit) {
        swapHands();
        askPlayer();
    }
    else {
        dealerTurn();
    }


    /*if (handSplit && handSwapping) {
        console.log(`Player Stands with their hand: ${playerHand}. The player can no longer swap hands and will now move on to their other hand.`)
        swapHands();
        handSwapping = false;
         console.log(`Player is now playing with hand: ${playerHand}. The player can no longer swap hands`)
        askPlayer();
    }
    else if (handSplit && !handSwapping) {
        console.log(`Player Stands with their second hand: ${playerHand}`)
        dealerTurn();
    }
    else if (!handSplit) {
        console.log(`Player Stands with their hand: ${playerHand}`)
        dealerTurn();
    }
    else {
        console.log(`fuck`)
    }*/
}

function splitPlayer() {
    
    if (HandValue([playerHand[0]]) === HandValue([playerHand[1]])) {
            
            handSplit = true;
            playerBet += 50

            const firstCard = playerHand[0]
            const secondCard = playerHand[1]

            hands[1] = [
                firstCard,
                cards[Math.floor(Math.random() * cards.length)]
            ];

            hands.push ([
                secondCard,
                cards[Math.floor(Math.random() * cards.length)]
            ]);

            numHands = hands.length - 1
          
            handNum = 1
            playerHand = hands[handNum]
    
            console.log(`Player split into ${numHands} hands.`)
            console.log(`Current Hand: ${playerHand}`)
            askPlayer();
        }
    
    else {
        console.log("Cannot Split, Cards are not the same value.")
        playerTurn();
    }
}

function swapHands() {
    if (handSplit) {
       handNum++;
       if (handNum > numHands) {
        handNum = 1;
       };
       playerHand = hands[handNum];
       console.log(`Player is playing with Hand ${handNum}: ${playerHand}`)
    }
};

function dealerTurn() {

    console.log(`Dealer's Turn. Dealer Hand: ${dealerHand}`)

    if (HandValue(dealerHand) < 17) {
        dealerHand.push(cards[Math.floor(Math.random() * cards.length)]);
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
    
    for (let i = 1; i <= numHands; i++) {
        playerHand = stoodHands[i];

            if (HandValue(playerHand) > 21) {
                console.log(`BUST, Player Loses! Player: ${HandValue(playerHand)} Dealer: ${HandValue(dealerHand)}`)
                dealerWins++
                monies = monies - playerBet / numHands
            }
            else if (HandValue(dealerHand) > 21) {
                console.log(`Dealer BUST, Player Wins! Player: ${HandValue(playerHand)} Dealer: ${HandValue(dealerHand)}`)
                playerWins++
                monies = monies + playerBet / numHands
            }
            else if (HandValue(playerHand) === 21 && HandValue(dealerHand) < 21) {
                console.log(`BLACKJACK! Player Wins! Player: ${HandValue(playerHand)} Dealer: ${HandValue(dealerHand)}`)
                playerWins++
                monies = monies + playerBet * 1.5 / numHands
            }
            else if (HandValue(dealerHand) > HandValue(playerHand)) {
                console.log(`Dealer Wins! Player: ${HandValue(playerHand)} Dealer: ${HandValue(dealerHand)}`)
                dealerWins++
                monies = monies - playerBet / numHands
            }
            else if (HandValue(playerHand) > HandValue(dealerHand)) {
                console.log(`Player Wins! Player: ${HandValue(playerHand)} Dealer: ${HandValue(dealerHand)}`)
                playerWins++
                monies = monies + playerBet / numHands
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