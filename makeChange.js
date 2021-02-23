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

function checkCounterExists(results, counter) {
  const [coin1, coin2] = Object.keys(counter);
  const coin1Count = counter[coin1];
  const coin2Count = counter[coin2];
  let exists = false;
  for (let i = 0; i < results.length; i++) {
    const savedCounter = results[i];
    const coins = Object.keys(savedCounter);
    exists =
      savedCounter[coin1] === coin1Count && savedCounter[coin2] === coin2Count;
    if (exists) {
      break;
    }
  }
  return exists;
}

function checkSumCombinations(
  target,
  coin1,
  coin2,
  initialCounters = { [coin1]: 0, [coin2]: 0 }
) {
  const results = [];

  if (coin1 <= target) {
    const counter = checkTwoCoins(target, coin1, coin1, coin2, {
      [coin1]: initialCounters[coin1] + 1,
      [coin2]: initialCounters[coin2],
    });
    if (counter && !checkCounterExists(results, counter)) {
      results.push(counter);
    }
  }

  if (coin2 <= target) {
    const counter = checkTwoCoins(target, coin2, coin1, coin2, {
      [coin1]: initialCounters[coin1],
      [coin2]: initialCounters[coin2] + 1,
    });
    if (counter && !checkCounterExists(results, counter)) {
      results.push(counter);
    }
  }

  if (coin1 + coin2 <= target) {
    const counter = checkTwoCoins(target, coin1 + coin2, coin1, coin2, {
      [coin1]: initialCounters[coin1] + 1,
      [coin2]: initialCounters[coin2] + 1,
    });
    if (counter && !checkCounterExists(results, counter)) {
      results.push(counter);
    }
  }

  if (coin1 + coin1 <= target) {
    const counter = checkTwoCoins(target, coin1 + coin1, coin1, coin2, {
      [coin1]: initialCounters[coin1] + 2,
      [coin2]: initialCounters[coin2],
    });
    if (counter && !checkCounterExists(results, counter)) {
      results.push(counter);
    }
  }

  if (coin2 + coin2 <= target) {
    const counter = checkTwoCoins(target, coin2 + coin2, coin1, coin2, {
      [coin1]: initialCounters[coin1],
      [coin2]: initialCounters[coin2] + 2,
    });
    if (counter && !checkCounterExists(results, counter)) {
      results.push(counter);
    }
  }

  return results;
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
  const result = [];

  // Coins that are already bigger than x are useless here
  const coinSet = initialCoinSet.filter((coin) => coin < x);

  coinSet.forEach((coin, i) => {
    if (x % coin === 0) {
      result.push({ [coin]: x / coin });
    }
    for (let nextIndex = i + 1; nextIndex < coinSet.length; nextIndex++) {
      const nextCoin = coinSet[nextIndex];
      if (shouldTryCoins(x, coin, nextCoin)) {
        result.push(...checkSumCombinations(x, coin, nextCoin));
      }
    }
  });

  if (result.length) {
    return result;
  }
  throw new Error("X cannot be calculated from given coins");
}

module.exports = {
  makeChange,
};
