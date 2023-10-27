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

    const player = new PlayerState(game.me());

    console.log({ player });

    console.log("---------------");

    const score = player.score();

    console.log({ score });

    if (score > 25) {
      bet(game.currentBuyIn() - game.me().bet() + game.minimumRaise());
    }
  }

  static showdown(gameState) {}
}

module.exports = Player;
