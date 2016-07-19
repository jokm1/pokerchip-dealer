/* jshint undef: true, unused: false, esnext: true, strict:false */
/* globals module */
let Helper = require('./helper');
let Stack = require('./stack');

module.exports = (() => {

class Dealer {

	constructor(pokerSet,
				amountOfPlayers,
				buyIn,
				lowestDenom) {
		this.pokerSet = pokerSet;
		this.amountOfPlayers = amountOfPlayers;
		this.buyIn = buyIn;
		this.lowestDenom = lowestDenom;
		this.amountOfRebuys = 0;
	}

	deal() {
		let validationErrors = this.validateRequirements();
		return validationErrors || '';
	}

	distribute() {
		// amount of BBs in buy-in determines speed
		// 100 BBs as 2nd denom = slow
		// 50 BBs as 2nd denom = semi
		// 25 BBs as 2nd denom = fast
		let denoms = Helper.findIdealDenominations(this.amountOfDenoms, this.lowestDenom);
		denoms.map((denom) => [denom, ]);
		return new Stack([10,10]);
	}

	validateRequirements() {
		if (!this.pokerSet) {
			return 'I require a PokerSet before dealing.';
		}
		if (this.pokerSet.validate()) {
			return this.pokerSet.validate();
		}
 		if (!this.amountOfPlayers || this.amountOfPlayers <= 0) {
			return 'I require a number of players before dealing.';
 		}
 		if (!this.buyIn || this.buyIn <= 0) {
			return 'I require a buy-in (total value) before dealing.';
 		}
 		if (!this.lowestDenom || this.lowestDenom <= 0) {
			return 'I require a lowest denomination before dealing.';
 		}
 		return '';
	}
}

return Dealer;

})();

