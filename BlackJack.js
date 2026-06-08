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

        const hands = dealCards(numPlayers);
        const dealerHand = hands[0];
        const playerHand = hands[1];

    if (HandValue(playerHand) > 21 && HandValue(dealerHand) <= 21) {
        console.log(`BUST, Player Loses! ${HandValue(playerHand)}, ${HandValue(dealerHand)}`)
    }

    if (HandValue(dealerHand) > 21 && HandValue(playerHand) <= 21) {
        console.log(`Dealer BUST, Player Wins! ${HandValue(playerHand)}, ${HandValue(dealerHand)}`)
    }

    if (HandValue(playerHand) > 21 && HandValue(dealerHand) > 21) {
        console.log(`DOUBLE BUST, Tie goes to Dealer. ${HandValue(playerHand)}, ${HandValue(dealerHand)}`)
    }

    if (HandValue(playerHand) === 21 && HandValue(dealerHand) !== 21) {
        console.log(`BLACKJACK! Player Wins! ${HandValue(playerHand)}, ${HandValue(dealerHand)}`)
    }

    if (HandValue(dealerHand) === 21 && HandValue(playerHand) !== 21) {
        console.log(`BLACKJACK! Dealer Wins! ${HandValue(playerHand)}, ${HandValue(dealerHand)}`)
    }

    if (HandValue(playerHand) > HandValue(dealerHand) && HandValue(playerHand) <= 21) {
        console.log(`Player Wins! ${HandValue(playerHand)}, ${HandValue(dealerHand)}`)
    }

    if (HandValue(dealerHand) > HandValue(playerHand) && HandValue(dealerHand) <= 21) {
        console.log(`Dealer Wins! ${HandValue(playerHand)}, ${HandValue(dealerHand)}`)
    }

    if (HandValue(playerHand) === HandValue(dealerHand) && HandValue(playerHand) <= 21) {
        console.log(`EQUAL HANDS, Tie goes to Dealer. ${HandValue(playerHand)}, ${HandValue(dealerHand)}`)
    }
}