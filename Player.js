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

    if (score >= 10) {
      bet(game.toRaiseByBlinds(2));
    } else if (score < 10 && score >= 5) {
      bet(game.toRaiseByBlinds(1));
    } else {
      bet(game.toCall());
    }
  }

  static showdown(gameState) {}
}

module.exports = Player;
