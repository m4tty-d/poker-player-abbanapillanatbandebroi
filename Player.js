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

    if (score > 5) {
      bet(game.currentBuyIn() - game.me().bet() + game.minimumRaise());
    } else {
      bet(game.currentBuyIn() - game.me().bet());
    }
  }

  static showdown(gameState) {}
}

module.exports = Player;
