/* jshint undef: true, unused: false, esnext: true, strict:false */
/* globals require, describe, it */

let expect = require('chai').expect;
let { Dealer, validateRequirements } = require('../app/dealer');
let Stack = require('../app/stack');
let PokerSet = require('../app/pokerset');

let myDealer = new Dealer();
let largePokerSet = new PokerSet();

describe('Dealer', function() {
	describe('Validation', function() {
		let validPokerSet = new PokerSet(20,20);
		let dummyPokerSet = new PokerSet(); 
		dummyPokerSet.validate = () => 'pokerset validation';
		
		it('requires a PokerSet', function() {
			let dealer = new Dealer();
			expect(validateRequirements(dealer)).to.equal('I require a PokerSet before dealing.');
		});
		
		it('requires a PokerSet', function() {
			let dealer = new Dealer('fish',10,10,10);
			expect(validateRequirements(dealer)).to.equal('I require a PokerSet before dealing.');
		});
		
		it('validates PokerSet when validating', function() {
			let dealer = new Dealer(dummyPokerSet,0,0,0);
			expect(validateRequirements(dealer)).to.equal('pokerset validation');
		});
		
		it('requires an amount of players', function() {
			let dealer = new Dealer(validPokerSet);
			expect(validateRequirements(dealer)).to.equal('I require a number of players before dealing.');
			dealer = new Dealer(validPokerSet,0,0,0);
			expect(validateRequirements(dealer)).to.equal('I require a number of players before dealing.');
		});
		
		it('requires a buy-in', function() {
			let dealer = new Dealer(validPokerSet,10);
			expect(validateRequirements(dealer)).to.equal('I require a buy-in (total value) before dealing.');
			dealer = new Dealer(validPokerSet,10,0,0);
			expect(validateRequirements(dealer)).to.equal('I require a buy-in (total value) before dealing.');
		});
		
		it('requires a lowest denomination', function() {
			let dealer = new Dealer(validPokerSet,11,12);
			expect(validateRequirements(dealer)).to.equal('I require a lowest denomination before dealing.');
			dealer = new Dealer(validPokerSet,11,12,0);
			expect(validateRequirements(dealer)).to.equal('I require a lowest denomination before dealing.');
		});
	});
	
	describe('Distribution', function() {
		largePokerSet.distributionPerColor = [
			['purple',75],
			['orange',75],
			['white-red',100],
			['red-blue',100],
			['blue-white',50],
			['green-pink',50],
			['black-salmon',25],
			['purple-pink',25]
		];
		
		it('limits the amount of denoms to 5', function() {
			let dealer = new Dealer(largePokerSet, 6, 10, 0.05);
			let stack = dealer.distribute();
			expect(stack.denominations).to.deep.equal([0.05, 0.1, 0.25, 0.5, 1]);
		});
		
		it('should provide a stack of at least 50 big blinds');
	});

	describe('Scenarios', function() {
		
		it('with large pokerset of 500/8 chips, 5 denominations, 6 players, 10 buy-in', function() {
			let players = 6;
			let buyin = 10;
			let stack = new Dealer(largePokerSet, players, buyin, 0.05).distribute();
			expect(stack.totalValue).to.equal(buyin);
			expect(stack.denominations).to.deep.equal([0.05, 0.10, 0.25, 0.50, 1]);
			expect(stack.amounts).to.deep.equal([10, 15, 12, 6, 2]);
			expect(stack.totalChips).to.equal(55);
		});

		it.skip('with 1000 chips, 1 denomination, 10 players, 10 buy-in', function() {
			let chips = 1000;
			let players = 10;
			let stack = new Dealer(chips, 1, players, 10).distribute();
			expect(stack.denominations).to.deep.equal([10]);
			expect(stack.amounts).to.deep.equal([10]);
			expect(stack.totalValue).to.equal(100);
		});
		it.skip('with 500 chips, 8 denominations, 1 player, 174060.25 buy-in', function() {
			let chips = 500;
			let players = 1;
			let buyin = 174060.25;
			let stack = new Dealer(chips, 8, players, buyin, 0.25).distribute();
			expect(stack.denominations).to.deep.equal([0.25, 0.50, 1, 5, 10, 25, 100, 500]);
			expect(stack.amounts).to.deep.equal([75, 75, 100, 100, 50, 50, 25, 25]);
			expect(stack.totalChips).to.equal(chips);
			expect(stack.totalValue).to.equal(buyin);
		});
		it.skip('with 200 chips, 4 denominations, 1 player, 375 buy-in', function() {
			let chips = 200;
			let players = 1;
			let buyin = 375;
			let stack = new Dealer(chips, 8, players, buyin, 0.25).distribute();
			expect(stack.denominations).to.deep.equal([0.25, 0.50, 1, 5]);
			expect(stack.amounts).to.deep.equal([100, 100, 50, 50]);
			expect(stack.totalChips).to.equal(chips);
			expect(stack.totalValue).to.equal(buyin);
		});
		it.skip('with 200 chips, 2 denominations, 10 players, 10 buy-in', function() {
			let chips = 200;
			let players = 10;
			let stack = new Dealer(chips, 1, players, 10, 10).distribute();
			expect(stack.denominations).to.deep.equal([10,20]);
			expect(stack.amounts).to.deep.equal([10]);
			expect(stack.totalValue).to.equal(100);
		});
	});
});
