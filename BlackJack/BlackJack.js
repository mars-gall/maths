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
let dealerHand = [];
let playerHand = [];
let handSplit = false;
let handSwapping = false;
let playerWins = 0;
let dealerWins = 0;
let gameOver = false

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

   playerTurn();
}

function restart() {
    gameOver = false;
    simulate(2);
}

function playerTurn() {
    console.log(`Player Hand: ${playerHand} Dealer Showing: ${dealerHand[0]}`)
        console.log("Player may hit or stand. If player has two of the same card, they may also split. If the player has already split they may swap hands so long as they have not busted or stood with their other hand. What would you like to do? Type 'hit', 'stand', 'split', or 'swap'.")
    askPlayer();
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
            splitPlayer(playerHand);
        }
        else if (answer === "swap") {
            swapHands();
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

    if (HandValue(playerHand) > 21 && handSplit === false || HandValue(playerHand) > 21 && handSplit === true && handSwapping === false) {
        console.log(`Player has BUSTED with hand ${playerHand}.`)
        dealerTurn();
    }

    if (HandValue(playerHand) > 21 && handSplit === true && handSwapping === true) {
        console.log(`Player has BUSTED with hand: ${playerHand}. Player will now swap to their other hand.`)
        swapHands();
        handSwapping = false;
         console.log(`Player is now playing with hand: ${playerHand}. The player can no longer swap hands`)
        
    }

    if (HandValue(playerHand) === 21) {
        console.log(`Player has BLACKJACK!`)
        dealerTurn();
    }

    if (HandValue(playerHand) < 21) {
        askPlayer();
    }
}

function standPlayer() {

    if (handSplit === true && handSwapping === true) {
        console.log(`Player Stands with their hand: ${playerHand}. The player can no longer swap hands and will now move on to their other hand.`)
        swapHands();
        handSwapping = false;
         console.log(`Player is now playing with hand: ${playerHand}. The player can no longer swap hands`)
        askPlayer();
    }
    if (handSplit === true && handSwapping === false) {
        console.log(`Player Stands with their second hand: ${playerHand}`)
        dealerTurn();
    }
    if (handSplit === false) {
        console.log(`Player Stands with their hand: ${playerHand}`)
        dealerTurn();
    }

}

function splitPlayer(hand) {
    
/*    if (handSplit === false) {
        for (let i = 0; i < playerHand.length - 1; i++) {
            for (let j = i; j < playerHand.length; j++) {
                if (HandValue([playerHand[i]]) === HandValue([playerHand[j]])) {
                    handSplit = true;
                    handSwapping = true;
                    hands[1] = [playerHand[i], cards[Math.floor(Math.random() * cards.length)]]
                    hands[2] = [playerHand[j], cards[Math.floor(Math.random() * cards.length)]]
                    playerHand = hands[1];
                    hands.push(hands[2]);
                    console.log(`Hand 1: ${hands[1]} Hand 2: ${hands[2]}. Player is currently playing with hand 1, if player busts or stands they will move on to hand 2. The player may also swap to their other hand so long as they have not busted or stood with their other hand.`)
                    askPlayer();
                }
            }
        }
    }*/
    if (handSplit === false && HandValue([playerHand[0]]) === HandValue([playerHand[1]])) {
            handSplit = true;
            handSwapping = true;
            hands[1] = [playerHand[0], cards[Math.floor(Math.random() * cards.length)]]
            hands[2] = [playerHand[1], cards[Math.floor(Math.random() * cards.length)]]
            playerHand = hands[1];
            hands.push(hands[2]);
            console.log(`Hand 1: ${hands[1]} Hand 2: ${hands[2]}. Player is currently playing with hand 1, if player busts or stands they will move on to hand 2. The player may also swap to their other hand so long as they have not busted or stood with their other hand.`)
            askPlayer();
    }
    else if (handSplit === true) {
        console.log(`Player has already split, cannot split again.`)
        playerTurn();
    }
    else {
        console.log("Cannot Split, Cards are not the same value.")
        playerTurn();
    }

}

function swapHands() {

    if (handSplit === true && handSwapping === true) {
        if (playerHand === hands[1]) {
            playerHand = hands[2];
        }
        else if (playerHand === hands[2]) {
            playerHand = hands[1];
        }
        console.log(`Player has swapped hands: ${playerHand}.`)
        askPlayer();
    }
    else if (handSplit === true && handSwapping === false) {
        console.log(`Player has either busted or stood with their first hand, they may no longer swap hands.`)
        playerTurn();
    }
    else {
        console.log(`Player has not split, and therefore cannot swap hands.`)
        playerTurn();
    }
}

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

    if (handSplit === true) {
        if (HandValue(hands[1]) <= 21 && HandValue(hands[1]) >= HandValue(hands[2]) && HandValue(hands[2]) <= 21) {
            playerHand = hands[1];
        }
        else {
            playerHand = hands[2];
        }
    }

    if (HandValue(playerHand) > 21 && HandValue(dealerHand) <= 21) {
        console.log(`BUST, Player Loses! Player: ${HandValue(playerHand)} Dealer: ${HandValue(dealerHand)}`)
        dealerWins++
    }

    if (HandValue(dealerHand) > 21 && HandValue(playerHand) <= 21) {
        console.log(`Dealer BUST, Player Wins! Player: ${HandValue(playerHand)} Dealer: ${HandValue(dealerHand)}`)
        playerWins++
    }

    if (HandValue(playerHand) > 21 && HandValue(dealerHand) > 21) {
        console.log(`DOUBLE BUST, Tie goes to Dealer. Player: ${HandValue(playerHand)} Dealer: ${HandValue(dealerHand)}`)
        dealerWins++
    }

    if (HandValue(playerHand) === 21 && HandValue(dealerHand) !== 21) {
        console.log(`BLACKJACK! Player Wins! Player: ${HandValue(playerHand)} Dealer: ${HandValue(dealerHand)}`)
        playerWins++
    }

    if (HandValue(dealerHand) === 21 && HandValue(playerHand) !== 21) {
        console.log(`BLACKJACK! Dealer Wins! Player: ${HandValue(playerHand)} Dealer: ${HandValue(dealerHand)}`)
        dealerWins++
    }

    if (HandValue(playerHand) > HandValue(dealerHand) && HandValue(playerHand) < 21) {
        console.log(`Player Wins! Player: ${HandValue(playerHand)} Dealer: ${HandValue(dealerHand)}`)
        playerWins++
    }

    if (HandValue(dealerHand) > HandValue(playerHand) && HandValue(dealerHand) < 21) {
        console.log(`Dealer Wins! Player: ${HandValue(playerHand)} Dealer: ${HandValue(dealerHand)}`)
        dealerWins++
    }

    if (HandValue(playerHand) === HandValue(dealerHand) && HandValue(playerHand) <= 21) {
        console.log(`EQUAL HANDS, Tie goes to Dealer. Player: ${HandValue(playerHand)} Dealer: ${HandValue(dealerHand)}`)
        dealerWins++
    }

    console.log(`Player Wins: ${playerWins} Dealer Wins: ${dealerWins}`)

    console.log("Would you like to play again? Type 'yes' or 'no'")

    askPlayer();

}

simulate(2);