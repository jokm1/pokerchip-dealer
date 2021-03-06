/* jshint undef: true, unused: false, esnext: true, strict:false, laxbreak:true */
/* globals module, require */
module.exports = (() => {

let _ = require('lodash');
let BigNumber = require('bignumber.js')

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

		let greedyItems = greedy(copiedItems, this.players, buyin);
		
		let dynamicItems = dynamic(copiedItems, this.players, buyin);

		let greedyStackWorth = itemsStackWorth(greedyItems);
		
		if (greedyStackWorth == buyin) {
			console.log('Greedy algorithm matched buyin exactly');
			resultItems = greedyItems;
		}
		if (greedyStackWorth > buyin) {
			console.log('Greedy algorithm was more than buyin, correcting by subtraction');
			resultItems = correctBySubtraction(greedyItems, buyin);
		}
		return resultItems
				.map(({value,weight,amount,chip}) => chip)
				.sort(byDenomAsc);
	}
}

function dynamic(items, players, buyin) {
	let stackWorth = 0;

	// initialize DP matrix
	//   amount of dimensions
	let amountOfDimensions = items.length;
	//   max depth
	let maxDepth = items.reduce((prev,{v,w,chip:{c,amount:cur,d}}) => {
		return cur > prev ? cur : prev;
	}, 0);
	//   initialize matrix with dimensions and until max depth
	let matrix = items.map((item) => {
		let dimension = { id:item.chip.color, values:[] };
		for (let amount = 0; amount <= maxDepth; amount++) {
			dimension.values[amount] = 0;
		}
		return dimension;
	});

	// initialize subsolutions
	let solutions = [{}];
	for(let subBuyin=1; subBuyin<=buyin; subBuyin++){
		solutions[subBuyin] = bestSolution(subBuyin,items);
	}
	function bestSolution(subBuyin,items) {
		let itemsInBestSolution = [];
		let bestValue = 0;

		for(let item of items) {
			let availableWeight = subBuyin - totalWeight(itemsInBestSolution);
			for(let amount = 0; amount <= item.amount; amount++) {
				if (item.weight < availableWeight) {
					itemsInBestSolution.push(item);
				}
			}
		}
	}
	function totalWeight(items) {
		return items.reduce((prev,cur) => cur.weight + prev, 0);
	}
	// calculate DP matrix
	// find ideal solution
}

function greedy(items, players, buyin) {
	let stackWorth = 0;
	let sortedItems = items.sort(byValueDesc);

	for (let item of sortedItems) {
		let maxChipCount = _.floor(item.chip.amount / players, 2);
		let currentChipCount = 0;

		while (--item.chip.amount > 0 
			&& ++currentChipCount < maxChipCount 
			&& stackWorth < buyin) {
			stackWorth += item.chip.denomination;
		}
		item.chip.amount = currentChipCount;
	}
	return items.sort(itemByDenomAsc);
}

function correctBySubtraction(items, buyin) {
	// I'd want to just pass in the difference instead of the buyin, 
	// but I don't think I'd like the way my tests end up looking like
	let toCorrect = new BigNumber(itemsStackWorth(items)).minus(buyin);
	let sortedItems = items.sort(byValueAsc);
	
	while(toCorrect > 0) {
		for (let item of sortedItems) {
			let currentValue = new BigNumber(item.chip.denomination);
			if (currentValue.lte(toCorrect) && item.chip.amount > 0) {
				toCorrect = toCorrect.minus(currentValue);
				item.chip.amount--;
			}
		}
	}

	return items.sort(itemByDenomAsc);
}

function convertToItems(assignedChips, players) {
	let copiedChips = _.cloneDeep(assignedChips);
	let values = applyValues(copiedChips);
	return copiedChips.map((chip, idx) => {
		return {
			value: values[idx],
			weight: _.clone(chip.denomination),
			amount: _.floor(chip.amount / players),
			chip: chip
		};
	});
}

function applyValues(assignedChips) {
	if (assignedChips.length == 1) return [1];
	if (assignedChips.length == 2) return [1,1];
	if (assignedChips.length == 3) return [2,3,1];
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

function itemsStackWorth(stack) {
	return stack.reduce((prev, {v,w,chip:{color,amount,denomination}}) => prev + (amount*denomination), 0);
}
function itemByDenomAsc({v1,w1,chip:one}, {v2,w2,chip:two}){ return one.denomination - two.denomination; }
function byDenomAsc(one, two){ return one.denomination - two.denomination; }
function byValueAsc(one, two)  { return one.value - two.value;}
function byValueDesc(one, two) { return two.value - one.value;}
function byValueAmountRatioDesc(one, two) {
	let ratio1 = one.value / one.chip.amount;
	let ratio2 = two.value / two.chip.amount;
	return ratio2 - ratio1;
}

return {KnapsackSolver, applyValues, correctBySubtraction, convertToItems, dynamic};

})();