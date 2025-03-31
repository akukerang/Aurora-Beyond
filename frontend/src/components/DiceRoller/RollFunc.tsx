function parseDiceText(diceText: string, mod: number = 0) {
  const diceGroups = diceText.split(/(?=[+-])/); // Split at + or -

  if (!diceGroups || diceText === "") {
    let notation = "";
    if (mod === 0) {
      notation = "1d20";
    } else {
      notation = `1d20${mod > 0 ? `+${mod}` : `${mod}`}`;
    }

    return {
      rolls: [
        { count: 1, sides: 20, modifier: 0 },
        { count: 0, sides: 0, modifier: mod },
      ], // Default to 1d20 if no valid dice notation is found
      notation: notation,
    };
  }

  let notation = "";
  const rolls: { count: number; sides: number; modifier: number }[] = [];
  diceGroups.forEach((group) => {
    const diceMatch = group.match(/(\d*)d(\d+)/);

    // Dice Group Case (e.g., 2d20, 5d8)
    if (diceMatch) {
      const count = diceMatch[1] ? parseInt(diceMatch[1], 10) : 1;
      const sides = parseInt(diceMatch[2], 10);
      notation += group;
      rolls.push({ count, sides, modifier: 0 });
    } else {
      const modifierMatch = group.match(/[+-]\d+/);
      if (modifierMatch) {
        const modInt = parseInt(modifierMatch[0], 10);
        if (modInt === 0) return; // Ignore zero modifiers
        notation += modifierMatch[0];
        rolls.push({
          count: 0,
          sides: 0,
          modifier: parseInt(modifierMatch[0], 10),
        });
      }
    }

    // Modifier Case (e.g., +4, -3)
  });

  return { rolls, notation };
}

function rollDice(
  parsedDice: { count: number; sides: number; modifier: number }[],
  advantage: boolean = false,
  disadvantage: boolean = false
) {
  let total = 0;
  const rolls: string[] = [];

  parsedDice.forEach(({ count, sides, modifier }) => {
    if (sides > 0) {
      const groupRolls = Array.from(
        { length: count },
        () => Math.floor(Math.random() * sides) + 1
      );
      rolls.push(...groupRolls.map((roll) => roll.toString()));
      total += groupRolls.reduce((sum, roll) => sum + roll, 0);
    }
    total += modifier;
    if (modifier !== 0) {
      rolls.push(modifier > 0 ? `+${modifier}` : `${modifier}`);
    }
  });

  return { rolls, total };
}

export { parseDiceText, rollDice };
