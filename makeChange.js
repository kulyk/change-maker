function checkTwoCoins(x, coin1, coin2, result = { [coin1]: 0, [coin2]: 0 }) {
  const sum = coin1 + coin2;
  if (sum > x) {
    return null;
  }

  result[coin1]++;
  result[coin2]++;

  if (sum === x) {
    return result;
  }

  const diff = x - sum;
  const canSumWithCoin1 = diff % coin1 === 0;
  const canSumWithCoin2 = diff % coin2 === 0;
  if (!canSumWithCoin1 && !canSumWithCoin2) {
    // If each coin is already bigger than a difference,
    // we definitely can't get the X out of these coins
    if (coin1 > diff || coin2 > diff) {
      return null;
    }
    return checkTwoCoins(diff, coin1, coin2, result);
  }

  if (canSumWithCoin1) {
    result[coin1] += diff / coin1;
  } else {
    result[coin2] += diff / coin2;
  }

  return result;
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
      const sums = checkTwoCoins(x, coin, nextCoin);
      if (sums) {
        result.push(sums);
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
