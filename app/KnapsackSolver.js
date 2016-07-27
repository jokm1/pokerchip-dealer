/* jshint undef: true, unused: false, esnext: true, strict:false, laxbreak:true */
/* globals module, require */
module.exports = (() => {

let _ = require('lodash');
	
/* 
 * See LOG.md#Day5
 * See also https://en.wikipedia.org/wiki/Knapsack_problem#Definition
 */
class KnapsackSolver {

	constructor(assignedChips, players){
		this.players = players;
		this.items = convertToItems(assignedChips, players);
	}

	solve(buyin) {
		let resultItems = [];
		let copiedItems = _.cloneDeep(this.items);

		// TODO check if sum of all amounts, divided by players, is already lower than the buyin
		// TODO minimum of 1 in each denomination?
		let greedyItems = greedy(copiedItems, this.players, buyin);
		
		let greedyStackWorth = itemsStackWorth(greedyItems);
		
		if (greedyStackWorth == buyin) {
			resultItems = greedyItems;
		}
		if (greedyStackWorth > buyin) {
			resultItems = correctBySubtraction(greedyItems, buyin);
		}
		if (greedyStackWorth < buyin) {
			resultItems = correctByAddition(greedyItems, buyin);
		}
		return resultItems
				.map(({value,weight,chip}) => chip)
				.sort(byDenomAsc);
	}
}

function greedy(items, players, buyin) {
	let stackWorth = 0;
	let sortedItems = items.sort(byValueDesc);

	for (let item of sortedItems) {
		let maxChipCount = _.floor(item.chip.amount / players);
		let currentChipCount = 0;
		while (item.chip.amount > 0 && currentChipCount < maxChipCount && stackWorth < buyin) {
			currentChipCount++;
			item.chip.amount--;
			stackWorth += item.chip.denomination;
		}
		item.chip.amount = currentChipCount;
	}
	return items.sort(itemByDenomAsc);
}

function correctBySubtraction(items, buyin) { 
	// I'd want to just pass in the difference instead of the buyin, 
	// but I don't think I'd like the way my tests end up looking like
	let toCorrect = (itemsStackWorth(items) - buyin).toFixed(3);
	let sortedItems = items.sort(byValueAsc);
	
	while(toCorrect > 0) {
		for (let item of sortedItems) {
			let currentValue = (item.chip.denomination).toFixed(3);
			if (currentValue <= toCorrect && item.chip.amount > 0) {
				toCorrect -= currentValue;
				toCorrect = (toCorrect).toFixed(3);
				item.chip.amount--;
			}
		}
	}

	return items.sort(itemByDenomAsc);
}

function correctByAddition(items, buyin){
	return items.sort(itemByDenomAsc);
}

function convertToItems(assignedChips, players) {
	let values = applyValues(assignedChips);
	let weights = applyWeights(assignedChips, players);
	return assignedChips.map((chip, idx) => {
		return {
			value: values[idx],
			weight: weights[idx],
			chip: chip
		};
	});
}

function applyValues(assignedChips) {
	if (assignedChips.length == 1) return [1];
	if (assignedChips.length == 2) return [1,1];
	if (assignedChips.length == 3) return [2,3,1];
	// if (assignedChips.length == 5) return [4,5,3,2,1];
	let copy = _.cloneDeep(assignedChips);
	let sb = copy.shift();
	let bb = copy.shift();
	let bbplus1 = copy.shift();
	copy.unshift(bb,bbplus1,sb);
	return copy
	.reverse()
	.map((el, idx) => {
		return {
			value: idx+1,
			denomination: el.denomination
		};
	})//retain denom so I can retain idx position by sorting (fragile I know)
	.sort(byDenomAsc)
	.map(({value}) => value);//just retain value
}

function applyWeights(items, players) {
	let totalAmount = items.reduce((prev,{amount}) => prev + amount, 0);
	return items.map((el) => totalAmount - _.floor(el.amount / players, 2));
}

function itemsStackWorth(stack) {
	return stack.reduce((prev, {v,w,chip:{color,amount,denomination}}) => prev + (amount*denomination), 0);
}
function itemByDenomAsc({v1,w1,chip:one}, {v2,w2,chip:two}){ return one.denomination - two.denomination; }
function byDenomAsc(one, two){ return one.denomination - two.denomination; }
function byValueDesc(one, two) { return two.value - one.value;}
function byValueAsc(one, two)  { return one.value - two.value;}
function byValueAmountRatioDesc(one, two) {
	let ratio1 = one.value / one.chip.amount;
	let ratio2 = two.value / two.chip.amount;
	return ratio2 - ratio1;
}

return {KnapsackSolver, applyValues, applyWeights, correctBySubtraction};

})();