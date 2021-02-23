function checkTwoCoins(target, accumulatedSum, coin1, coin2, counters) {
  if (accumulatedSum === target) {
    const isSumOfOnlyOneCoin = Object.values(counters).includes(0);
    return isSumOfOnlyOneCoin ? null : counters;
  }

  const diff = target - accumulatedSum;
  const canSumWithCoin1 = diff % coin1 === 0;
  const canSumWithCoin2 = diff % coin2 === 0;
  if (!canSumWithCoin1 && !canSumWithCoin2) {
    // If each coin is already bigger than a difference,
    // we definitely can't get the X out of these coins
    if (coin1 > diff && coin2 > diff) {
      return null;
    }
    return checkSumCombinations(diff, coin1, coin2, counters);
  }

  const isOnlySummedWithCoin1 = counters[coin2] === 0;
  if (canSumWithCoin1 && !isOnlySummedWithCoin1) {
    counters[coin1] += diff / coin1;
    return counters;
  }

  const isOnlySummedWithCoin2 = counters[coin1] === 0;
  if (canSumWithCoin2 && !isOnlySummedWithCoin2) {
    counters[coin2] += diff / coin2;
    return counters;
  }

  return null;
}

function checkSumCombinations(
  target,
  coin1,
  coin2,
  counters = { [coin1]: 0, [coin2]: 0 }
) {
  const cases = [];

  if (coin1 <= target) {
    cases.push(
      checkTwoCoins(target, coin1, coin1, coin2, {
        [coin1]: counters[coin1] + 1,
        [coin2]: counters[coin2],
      })
    );
  }

  if (coin2 <= target) {
    cases.push(
      checkTwoCoins(target, coin2, coin1, coin2, {
        [coin1]: counters[coin1],
        [coin2]: counters[coin2] + 1,
      })
    );
  }

  if (coin1 + coin2 <= target) {
    cases.push(
      checkTwoCoins(target, coin1 + coin2, coin1, coin2, {
        [coin1]: counters[coin1] + 1,
        [coin2]: counters[coin2] + 1,
      })
    );
  }

  if (coin1 + coin1 <= target) {
    cases.push(
      checkTwoCoins(target, coin1 + coin1, coin1, coin2, {
        [coin1]: counters[coin1] + 2,
        [coin2]: counters[coin2],
      })
    );
  }

  if (coin2 + coin2 <= target) {
    cases.push(
      checkTwoCoins(target, coin2 + coin2, coin1, coin2, {
        [coin1]: counters[coin1],
        [coin2]: counters[coin2] + 2,
      })
    );
  }

  return cases;
}

function shouldTryCoins(x, c1, c2) {
  const isXEven = x % 2 === 0;
  if (isXEven) {
    // We can get an even number out of two evens, two odds, even and odd
    return true;
  }
  const evenCoins = c1 % 2 === 0 && c2 % 2 === 0;

  // Can't get an odd number out of two even numbers
  return !evenCoins;
}

function makeChange(x, initialCoinSet) {
  const single = [];
  let combinations = [];

  // Coins that are already bigger than x are useless here
  const coinSet = initialCoinSet.filter((coin) => coin < x);

  coinSet.forEach((coin, i) => {
    if (x % coin === 0) {
      single.push({ [coin]: x / coin });
    }
    for (let nextIndex = i + 1; nextIndex < coinSet.length; nextIndex++) {
      const nextCoin = coinSet[nextIndex];
      if (shouldTryCoins(x, coin, nextCoin)) {
        combinations.push(...checkSumCombinations(x, coin, nextCoin));
      }
    }
  });

  combinations = combinations.filter(Boolean);
  let unique = combinations.map((combo) => {
    const [coin1, coin2] = Object.keys(combo);
    const coin1Count = combo[coin1];
    const coin2Count = combo[coin2];
    return `${coin1}-${coin1Count}:${coin2}-${coin2Count}`;
  });

  unique = new Set(unique);
  unique = Array.from(unique).map((code) => {
    const [coin1Code, coin2Code] = code.split(":");
    const [coin1, coin1Count] = coin1Code.split("-");
    const [coin2, coin2Count] = coin2Code.split("-");
    return {
      [coin1]: parseInt(coin1Count),
      [coin2]: parseInt(coin2Count),
    };
  });

  const result = [...single, ...unique];
  if (result.length) {
    return result;
  }
  throw new Error("X cannot be calculated from given coins");
}

module.exports = {
  makeChange,
};
