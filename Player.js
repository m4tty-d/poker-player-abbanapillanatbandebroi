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

    const suit =
      suitCounts["spades"].total >= 4 ||
      suitCounts["clubs"].total >= 4 ||
      suitCounts["hearts"].total >= 4 ||
      suitCounts["diamonds"].total >= 4;

    console.log("suit", suit);

    if (suit) {
      bet(game.toRaiseByBlinds(5));
      return;
    }

    if (score >= 7) {
      bet(game.toRaiseByBlinds(2));
    } else if (score < 7 && score >= 4) {
      bet(game.toRaiseByBlinds(1));
    } else {
      bet(0);
    }
  }

  static showdown(gameState) {}
}

module.exports = Player;
