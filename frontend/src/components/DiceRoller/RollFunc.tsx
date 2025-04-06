function helper(sides: number, count: number): number[] {
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    const roll = Math.floor(Math.random() * sides) + 1; // Random number between 1 and sides
    rolls.push(roll);
  }
  return rolls;
}

function getRollResults(rolls: number[]): string {
  let results = "";

  if (rolls.length === 1) {
    return rolls[0].toString(); // Return empty string if no rolls
  }

  for (let i = 0; i < rolls.length; i++) {
    if (i < rolls.length - 1) {
      if (rolls[i] < 0 || results === "") {
        results += rolls[i]; // Negative rolls should not have a "+" sign before them
      } else {
        results += "+" + rolls[i]; // Add comma for all but the last roll
      }
    } else {
      if (rolls[i] < 0) {
        results += rolls[i]; // Negative rolls should not have a "+" sign before them
      } else {
        results += "+" + rolls[i]; // Add comma for all but the last roll
      }
    }
  }
  return results;
}

function rollBatch(dice: Record<number, number>) {
  let total = 0;
  const rolls: number[] = [];
  let keys = Object.keys(dice).reverse();
  keys.forEach((key) => {
    const count = dice[parseInt(key, 10)];
    const side = parseInt(key, 10);
    if (side > 0) {
      // dice case
      const rollResults = helper(side, count);
      rolls.push(...rollResults); // Convert each roll to string
      total += rollResults.reduce((acc, val) => acc + val, 0); // Sum the rolls
    } else {
      // 0 case are just numbers
      if (count === 0) return; // Skip if count is 0
      rolls.push(count); // Push modifiers
      total += count;
    }
  });

  const results = getRollResults(rolls);

  return { results, total };
}

function rollDice(
  dice: Record<number, number>,
  advantage: boolean = false,
  disadvantage: boolean = false
) {
  if (advantage && disadvantage) {
    // treat as normal roll
    return rollBatch(dice);
  } else if (advantage) {
    // Roll twice, take the higher
    const roll1 = rollBatch(dice); // First roll
    const roll2 = rollBatch(dice); // Second roll
    if (roll1.total < roll2.total) {
      return roll2;
    } else {
      return roll1;
    }
  } else if (disadvantage) {
    // Roll twice, take the lower
    const roll1 = rollBatch(dice); // First roll
    const roll2 = rollBatch(dice); // Second roll
    if (roll1.total < roll2.total) {
      return roll1;
    } else {
      return roll2;
    }
  } else {
    // Normal roll
    return rollBatch(dice);
  }
}

export { rollDice };
