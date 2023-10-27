const GameState = require("./src/GameState");
const PlayerState = require("./src/PlayerState");

class Player {
  static get VERSION() {
    return "0.1";
  }

  static betRequest(gameState, bet) {
    const game = new GameState(gameState);

    console.log({ game });

    console.log("---------------");

    console.log("player", game.me());

    console.log("---------------");

    const score = game.me().score();

    console.log({ score });

    const suitCounts = game.suitCounts();

    Object.keys(suitCounts).forEach((suit) => {
      console.log(`${suit} count: ${suitCounts[suit].total}`);
    });

    console.log("betting round", game.bettingRound());

    console.log("isPoker", game.isPoker());
    console.log("isFullHouse", game.isFullHouse());
    console.log("isFlush", game.isFlush());
    console.log("isStraight", game.isStraight());

    if (game.bettingRound() === "preflop") {
      if (game.hasSomeBodyAllIn()) {
        bet(0);
        return;
      }

      if (score >= 6) {
        bet(game.toCall());
      } else {
        bet(0);
        return;
      }
    } else {
      if (
        game.isPoker() ||
        game.isFullHouse() ||
        game.isFlush() ||
        game.isStraight() ||
        game.isThreeOfAKind() ||
        game.isTwoPair()
      ) {
        bet(game.toAllIn());
        return;
      } else {
        if (game.hasSomebodyRaised() || game.bettingRound() === "river") {
          bet(0);
        } else {
          bet(game.toCall());
        }
      }
    }
  }

  static showdown(gameState) {}
}

module.exports = Player;
