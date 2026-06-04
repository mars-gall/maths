const numCommunists = 11088
const numLoyalists = 16632

const people = [
    ...Array(numCommunists).fill("C"),
    ...Array(numLoyalists).fill("L")
];

function shuffle(array) {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

function makeGroups(people, groupSize) {
    const shuffled = shuffle(people);
    const groups = [];

    for (let i = 0; i < shuffled.length; i += groupSize) {
        groups.push(shuffled.slice(i, i + groupSize));
    }

    if (groups.length > 1 && groups[groups.length - 1].length < groupSize){
        const leftovers = groups.pop()

        for (let i = 0; i < leftovers.length; i++) {
            groups[i % groups.length].push(leftovers[i])
        }
    }

    return groups;

}

const trials = 1000;

for (let groupSize = 3; groupSize <= 12; groupSize++) {

    let communistGroups = 0
    let totalGroups = 0

    for (let t = 0; t < trials; t++) {
        const groups = makeGroups (people,groupSize);
    
        for (const group of groups) {
            totalGroups++;
            const numC = group.filter(person => person === "C").length

            if (numC >= group.length / 3) {
                communistGroups++;
            }
        }
    }

    const percentage = (1 - (communistGroups / totalGroups)) * 100
    
    console.log(
        `Group Size ${groupSize}: ${percentage.toFixed(2)}%`
    );
    
}