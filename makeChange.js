function checkTwoCoins(x, coin1, coin2) {
	const sum = coin1 + coin2;
	if (sum > x) {
		return null;
	}
	if (sum === x) {
		return {
			[coin1]: 1,
			[coin2]: 1,
		};
	}

	const diff = x - sum;
	const canSumWithCoin1 = diff % coin1 === 0;
	const canSumWithCoin2 = diff % coin2 === 0;
	if (!canSumWithCoin1 && !canSumWithCoin2) {
		return null;
	}

	// We add 1 to both coins as they were initially summed
	// in the beginning of a function
	return {
		[coin1]: canSumWithCoin1 ? diff / coin1 + 1 : 1,
		[coin2]: canSumWithCoin2 ? diff / coin2 + 1 : 1,
	};
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
