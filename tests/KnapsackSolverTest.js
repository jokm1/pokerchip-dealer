/* jshint undef: true, unused: false, esnext: true, strict:false, laxbreak:true */
/* globals require, describe, it, console */
let expect = require('chai').expect;
let {KnapsackSolver, applyValues, applyWeights, correctBySubtraction} = require('../app/knapsacksolver');

describe('KnapsackSolver', function() {
	let _1chips =                [{color:'white',	amount:100,	denomination:0.05}];
	let _2chips = _1chips.concat([{color:'red',		amount:150,	denomination:0.1}]);
	let _3chips = _2chips.concat([{color:'blue',	amount:100,	denomination:0.25}]);
	let _4chips = _3chips.concat([{color:'green',	amount:75,	denomination:0.5}]);
	let _5chips = _4chips.concat([{color:'black',	amount:50,	denomination:1}]);
	let myChips = [
	{color:'white-red',		amount: 100,	denomination:0.05},
	{color:'red-blue',		amount: 100,	denomination:0.1},
	{color:'blue-white',	amount: 50,		denomination:0.25},
	{color:'green-pink',	amount: 50,		denomination:0.5},
	{color:'black-salmon',	amount: 25,		denomination:1}
	];

	describe('applyValues', function() {
		
		it('with 1 item => value is 1', function() {
			let items = applyValues(_1chips);
			let itemValues = toValueColorPairs(items,_1chips);
			expect(itemValues).to.deep.equal([
				{color:'white',	value:1}
			]);
		});
		
		it('with 2 items => values are equal', function() {
			let items = applyValues(_2chips);
			let itemValues = toValueColorPairs(items,_2chips);
			expect(itemValues).to.deep.equal([
				{color:'white',	value:1},
				{color:'red',	value:1}
			]);
		});
		
		it('with 3 items => second item has highest value, last item lowest', function() {
			let items = applyValues(_3chips);
			let itemValues = toValueColorPairs(items,_3chips);
			expect(itemValues).to.deep.equal([
				{color:'white',	value:2},
				{color:'red',	value:3},
				{color:'blue',	value:1}
			]);
		});
		
		it('with 4 items => second item has highest value, 3rd item second highest, rest descend in values along position in item list', function() {
			let items = applyValues(_4chips);
			let itemValues = toValueColorPairs(items,_4chips);
			expect(itemValues).to.deep.equal([
				{color:'white',	value:2},
				{color:'red',	value:4},
				{color:'blue',	value:3},
				{color:'green',	value:1}
			]);
		});
		
		it('with 5 items => same as with 4', function() {
			let items = applyValues(_5chips);
			let itemValues = toValueColorPairs(items,_5chips);
			expect(itemValues).to.deep.equal([
				{color:'white',	value:3},
				{color:'red',	value:5},
				{color:'blue',	value:4},
				{color:'green',	value:2},
				{color:'black',	value:1}
			]);
		});
	});

	describe('applyWeights', function() {
		
		it('2 player, 1 item => weights == total amount of chips', function() {
			let weights = applyWeights(_1chips,2);
			let itemWeights = toWeightColorPairs(weights,_1chips);
			expect(itemWeights).to.deep.equal([
				{color:'white', 	weight: 50 }
			]);
		});
		
		it('1 player => weights == total amount of chips', function() {
			let weights = applyWeights(_5chips,1);
			let itemWeights = toWeightColorPairs(weights,_5chips);
			expect(itemWeights).to.deep.equal([
				{color:'white', 	weight: 375 },
				{color:'red',		weight: 325	},
				{color:'blue',		weight: 375	},
				{color:'green',		weight: 400	},
				{color:'black',		weight: 425	}
			]);
		});
		
		it('3 players => weights == total amount of chips divided by 3', function() {
			let weights = applyWeights(_5chips,3);
			let itemWeights = toWeightColorPairs(weights,_5chips);
			expect(itemWeights).to.deep.equal([
				{color:'white', 	weight:  441.67 },
				{color:'red',		weight:  425.00	},
				{color:'blue',		weight:  441.67	},
				{color:'green',		weight:  450.00	},
				{color:'black',		weight:  458.34	}
			]);
		});
		
		it('6 players => weights == total amount of chips divided by 6', function() {
			let weights = applyWeights(_5chips,6);
			let itemWeights = toWeightColorPairs(weights,_5chips);
			expect(itemWeights).to.deep.equal([
				{color:'white', 	weight: 458.34  },
				{color:'red',		weight: 450.00  },
				{color:'blue',		weight: 458.34	},
				{color:'green',		weight: 462.50	},
				{color:'black',		weight: 466.67	}
			]);
		});
		
		it('10 players => weights == total amount of chips divided by 10', function() {
			let weights = applyWeights(_5chips,10);
			let itemWeights = toWeightColorPairs(weights,_5chips);
			expect(itemWeights).to.deep.equal([
				{color:'white', 	weight: 465   },
				{color:'red',		weight: 460   },
				{color:'blue',		weight: 465	  },
				{color:'green',		weight: 467.5 },
				{color:'black',		weight: 470	  }
			]);
		});
	});

	describe('constructor', function() {
		
		it('converts assigned chips to valued and weighted items for use in knapsack', function() {
			let items = new KnapsackSolver(_5chips, 6).items;
			expect(items).to.deep.equal([
		{value:3,	weight: 458.34,	chip: {color:'white',amount:100,denomination:0.05}},
		{value:5,	weight: 450.00,	chip: {color:'red',amount:150,denomination:0.1}},
		{value:4,	weight: 458.34,	chip: {color:'blue',amount:100,denomination:0.25}},
		{value:2,	weight: 462.50,	chip: {color:'green',amount:75,denomination:0.5}},
		{value:1,	weight: 466.67,	chip: {color:'black',amount:50,denomination:1}}
			]);
		});
	});

	describe('correctBySubtraction', function() {
		
		it('exactly one highest denomination overGreedy, removes 1 chip of that denomination', function() {
			let overGreedy = [
		{value:3, weight: 458.34, chip: {color:'white-red',		amount:15,denomination: 0.05}},
		{value:5, weight: 450.00, chip: {color:'red-blue',		amount:15,denomination: 0.1}},
		{value:4, weight: 458.34, chip: {color:'blue-white',	amount:7,denomination: 0.25}},
		{value:2, weight: 462.50, chip: {color:'green-pink',	amount:8,denomination: 0.5}},
		{value:1, weight: 466.67, chip: {color:'black-salmon',	amount:3,denomination: 1}}
			];
			let expectedCorrected = [
		{value:3, weight: 458.34, chip: {color:'white-red',		amount:15,denomination: 0.05}},
		{value:5, weight: 450.00, chip: {color:'red-blue',		amount:15,denomination: 0.1}},
		{value:4, weight: 458.34, chip: {color:'blue-white',	amount:7,denomination: 0.25}},
		{value:2, weight: 462.50, chip: {color:'green-pink',	amount:8,denomination: 0.5}},
		{value:1, weight: 466.67, chip: {color:'black-salmon',	amount:2,denomination: 1}}
			];
			expect(getStackWorth(overGreedy.map(({v,w,chip})=>chip))).to.equal(11);
			let correctedStack = correctBySubtraction(overGreedy,10);
			expect(correctedStack).to.deep.equal(expectedCorrected);
		});
		
		it('exactly one lowest denomination overGreedy, removes 1 chip of that denomination', function() {
			let overGreedy = [
		{value:3, weight: 458.34, chip: {color:'white-red',		amount:16,denomination: 0.05}},
		{value:5, weight: 450.00, chip: {color:'red-blue',		amount:15,denomination: 0.1}},
		{value:4, weight: 458.34, chip: {color:'blue-white',	amount:7,denomination: 0.25}},
		{value:2, weight: 462.50, chip: {color:'green-pink',	amount:8,denomination: 0.5}},
		{value:1, weight: 466.67, chip: {color:'black-salmon',	amount:2,denomination: 1}}
			];
			let expectedCorrected = [
		{value:3, weight: 458.34, chip: {color:'white-red',		amount:15,denomination: 0.05}},
		{value:5, weight: 450.00, chip: {color:'red-blue',		amount:15,denomination: 0.1}},
		{value:4, weight: 458.34, chip: {color:'blue-white',	amount:7,denomination: 0.25}},
		{value:2, weight: 462.50, chip: {color:'green-pink',	amount:8,denomination: 0.5}},
		{value:1, weight: 466.67, chip: {color:'black-salmon',	amount:2,denomination: 1}}
			];
			expect(getStackWorth(overGreedy.map(({v,w,chip})=>chip))).to.equal(10.05);
			let correctedStack = correctBySubtraction(overGreedy,10);
			expect(correctedStack).to.deep.equal(expectedCorrected);
		});
		
		it('exactly two denominations overGreedy, one small blind, one heighest denomination, removes both chips', function() {
			let overGreedy = [
		{value:3, weight: 458.34, chip: {color:'white-red',		amount:16,denomination: 0.05}},
		{value:5, weight: 450.00, chip: {color:'red-blue',		amount:15,denomination: 0.1}},
		{value:4, weight: 458.34, chip: {color:'blue-white',	amount:7,denomination: 0.25}},
		{value:2, weight: 462.50, chip: {color:'green-pink',	amount:8,denomination: 0.5}},
		{value:1, weight: 466.67, chip: {color:'black-salmon',	amount:3,denomination: 1}}
			];
			let expectedCorrected = [
		{value:3, weight: 458.34, chip: {color:'white-red',		amount:15,denomination: 0.05}},
		{value:5, weight: 450.00, chip: {color:'red-blue',		amount:15,denomination: 0.1}},
		{value:4, weight: 458.34, chip: {color:'blue-white',	amount:7,denomination: 0.25}},
		{value:2, weight: 462.50, chip: {color:'green-pink',	amount:8,denomination: 0.5}},
		{value:1, weight: 466.67, chip: {color:'black-salmon',	amount:2,denomination: 1}}
			];
			expect(getStackWorth(overGreedy.map(({v,w,chip})=>chip))).to.equal(11.05);
			let correctedStack = correctBySubtraction(overGreedy,10);
			expect(correctedStack).to.deep.equal(expectedCorrected);
		});
		
		it('more than one denomination overGreedy, removes chips with lowest value first', function() {
			let overGreedy = [
		{value:3, weight: 458.34, chip: {color:'white-red',		amount:16,denomination: 0.05}},
		{value:5, weight: 450.00, chip: {color:'red-blue',		amount:16,denomination: 0.1}},
		{value:4, weight: 458.34, chip: {color:'blue-white',	amount:8,denomination: 0.25}},
		{value:2, weight: 462.50, chip: {color:'green-pink',	amount:9,denomination: 0.5}},
		{value:1, weight: 466.67, chip: {color:'black-salmon',	amount:2,denomination: 1}}
			];
			let expectedCorrected = [
		{value:3, weight: 458.34, chip: {color:'white-red',		amount:15,denomination: 0.05}},
		{value:5, weight: 450.00, chip: {color:'red-blue',		amount:15,denomination: 0.1}},
		{value:4, weight: 458.34, chip: {color:'blue-white',	amount:7,denomination: 0.25}},
		{value:2, weight: 462.50, chip: {color:'green-pink',	amount:8,denomination: 0.5}},
		{value:1, weight: 466.67, chip: {color:'black-salmon',	amount:2,denomination: 1}}
			];
			expect(getStackWorth(overGreedy.map(({v,w,chip})=>chip))).to.equal(10.9);
			let correctedStack = correctBySubtraction(overGreedy,10);
			expect(correctedStack).to.deep.equal(expectedCorrected);
		});
		
		it('exactly two lowest and heighest valued denominations overGreedy, removes both chips', function() {
			let overGreedy = [
		{value:3, weight: 458.34, chip: {color:'white-red',		amount:15,denomination: 0.05}},
		{value:5, weight: 450.00, chip: {color:'red-blue',		amount:16,denomination: 0.1}},
		{value:4, weight: 458.34, chip: {color:'blue-white',	amount:7, denomination: 0.25}},
		{value:2, weight: 462.50, chip: {color:'green-pink',	amount:8, denomination: 0.5}},
		{value:1, weight: 466.67, chip: {color:'black-salmon',	amount:3, denomination: 1}}
			];
			let expectedCorrected = [
		{value:3, weight: 458.34, chip: {color:'white-red',		amount:15,denomination: 0.05}},
		{value:5, weight: 450.00, chip: {color:'red-blue',		amount:15,denomination: 0.1}},
		{value:4, weight: 458.34, chip: {color:'blue-white',	amount:7, denomination: 0.25}},
		{value:2, weight: 462.50, chip: {color:'green-pink',	amount:8, denomination: 0.5}},
		{value:1, weight: 466.67, chip: {color:'black-salmon',	amount:2, denomination: 1}}
			];
			expect(getStackWorth(overGreedy.map(({v,w,chip})=>chip))).to.equal(11.1);
			let correctedStack = correctBySubtraction(overGreedy,10);
			expect(getStackWorth(correctedStack.map(({v,w,chip})=>chip))).to.equal(10);
			expect(correctedStack).to.deep.equal(expectedCorrected);
		});
		
		it('exactly two lowest and second to heighest valued denominations overGreedy, removes both chips', function() {
			let overGreedy = [
		{value:3, weight: 458.34, chip: {color:'white-red',		amount:15,denomination: 0.05}},
		{value:5, weight: 450.00, chip: {color:'red-blue',		amount:15,denomination: 0.1}},
		{value:4, weight: 458.34, chip: {color:'blue-white',	amount:8,denomination: 0.25}},
		{value:2, weight: 462.50, chip: {color:'green-pink',	amount:8,denomination: 0.5}},
		{value:1, weight: 466.67, chip: {color:'black-salmon',	amount:3,denomination: 1}}
			];
			let expectedCorrected = [
		{value:3, weight: 458.34, chip: {color:'white-red',		amount:15,denomination: 0.05}},
		{value:5, weight: 450.00, chip: {color:'red-blue',		amount:15,denomination: 0.1}},
		{value:4, weight: 458.34, chip: {color:'blue-white',	amount:7,denomination: 0.25}},
		{value:2, weight: 462.50, chip: {color:'green-pink',	amount:8,denomination: 0.5}},
		{value:1, weight: 466.67, chip: {color:'black-salmon',	amount:2,denomination: 1}}
			];
			expect(getStackWorth(overGreedy.map(({v,w,chip})=>chip))).to.equal(11.25);
			let correctedStack = correctBySubtraction(overGreedy,10);
			expect(correctedStack).to.deep.equal(expectedCorrected);
		});
	});

	describe('solve', function() {
		
		it('buyin 10, 6 players', function() {
			let buyin = 10;
			let solver = new KnapsackSolver(myChips, 6);
			let stack = solver.solve(buyin);
			expect(stack).to.deep.equal([
				{color:'white-red'	,	amount:10	,denomination: 0.05	},
				{color:'red-blue'	,	amount:15	,denomination: 0.1	},
				{color:'blue-white'	,	amount:12	,denomination: 0.25	},
				{color:'green-pink'	,	amount:6	,denomination: 0.5	},
				{color:'black-salmon',	amount:2	,denomination: 1	}
			]);
			expect(getStackWorth(stack)).to.equal(buyin);
		});
		
		it.skip('total worth of available chips is lower than buyin', function() {
			let buyin = 10;
			let solver = new KnapsackSolver(_3chips, 6);
			let stack = solver.solve(buyin);
			
		});
		
		it('Stackworth must be equal to the buyin', function() {
			let buyin = 10;
			let solver = new KnapsackSolver(_5chips, 6);
			let stack = solver.solve(buyin);
			expect(getStackWorth(stack)).to.equal(buyin);
		});
	});
});

function toValueColorPairs(values, chips) {
	return values.map((value, idx) => {return {color:chips[idx].color,value};});
}

function toWeightColorPairs(weights, chips) {
	return weights.map((weight, idx) => {return {color:chips[idx].color,weight};});
}

function getStackWorth(stack) {
	return stack.reduce((prev, {color,amount,denomination}) => prev + (amount * denomination), 0);
}

