const PlayerState = require("./PlayerState");
const Card = require("./Card");

class GameState {
  constructor(gameState) {
    this.gameState = gameState;
  }

  tournamentId() {
    return this.gameState.tournament_id;
  }
  gameId() {
    return this.gameState.game_id;
  }
  round() {
    return this.gameState.round;
  }
  betIndex() {
    return this.gameState.bet_index;
  }
  smallBlind() {
    return this.gameState.small_blind;
  }
  bigBlind() {
    return this.gameState.small_blind * 2;
  }
  currentBuyIn() {
    return this.gameState.current_buy_in;
  }
  pot() {
    return this.gameState.pot;
  }
  minimumRaise() {
    return this.gameState.minimum_raise;
  }
  dealer() {
    return this.gameState.dealer;
  }
  orbits() {
    return this.gameState.orbits;
  }
  myId() {
    return this.gameState.in_action;
  }

  players() {
    return this.gameState.players.map((p) => new PlayerState(p));
  }
  communityCards() {
    return this.gameState.community_cards.map((c) => new Card(c));
  }

  me() {
    return new PlayerState(this.gameState.players[this.gameState.in_action]);
  }

  /* Return this value if you want to call */
  toCall() {
    return this.currentBuyIn() - this.me().bet();
  }
  /* Return this value if you want to make the smallest possible raise */
  toRaise() {
    return this.toCall() + this.minimumRaise();
  }
  /* Use this function to raise by diven amount of big blinds */
  toRaiseByBlinds(n) {
    return this.toRaise() + n * this.bigBlind();
  }

  playersCount() {
    return this.gameState.players.length;
  }

  suitCounts() {
    const suits = ["spades", "clubs", "hearts", "diamonds"];
    return suits.reduce((obj, s) => {
      const holeCount = this.me()
        .holeCards()
        .filter((c) => c.suit() == s).length;
      const communityCount = this.communityCards().filter(
        (c) => c.suit() == s
      ).length;
      return {
        ...obj,
        [s]: {
          hole: holeCount,
          community: communityCount,
          total: holeCount + communityCount,
        },
      };
    }, {});
  }

  rankCounts() {
    const ranks = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];
    return ranks.reduce((obj, r) => {
      const holeCount = this.me()
        .holeCards()
        .filter((c) => c.rank() == r).length;
      const communityCount = this.communityCards().filter(
        (c) => c.rank() == r
      ).length;
      return {
        ...obj,
        [r]: {
          hole: holeCount,
          community: communityCount,
          total: holeCount + communityCount,
        },
      };
    }, {});
  }

  isPoker() {
    return Object.values(this.rankCounts()).some((r) => r.total === 4);
  }

  isFullHouse() {
    return (
      Object.values(this.rankCounts()).some((r) => r.total === 3) &&
      Object.values(this.rankCounts()).some((r) => r.total === 2)
    );
  }

  isFlush() {
    return Object.values(this.suitCounts()).some((s) => s.total === 5);
  }

  isStraight() {
    const ranks = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];
    const cards = this.me().holeCards().concat(this.communityCards());
    const values = cards.map((c) => c.value()).sort((a, b) => a - b);
    return ranks.some((r, i) => {
      const straight = values.slice(i, i + 5);
      return straight.length === 5 && straight.every((v, i) => v === i + 2);
    });
  }

  isThreeOfAKind() {
    return Object.values(this.rankCounts()).some((r) => r.total === 3);
  }

  isTwoPair() {
    return (
      Object.values(this.rankCounts()).filter((r) => r.total === 2).length === 2
    );
  }

  isPair() {
    return Object.values(this.rankCounts()).some((r) => r.total === 2);
  }

  toAllIn() {
    return this.me().stack();
  }

  /** Betting position tells you if you are betting early or late.
   *  If this value is 1, you are the first to make a bet when there is the
   *  least amount of information available.
   *  If this value is equal to the nubmer of players you are the dealer
   *  and you make your bet after everyone else
   */
  bettingPosition() {
    return (
      ((this.gameState.in_action -
        this.gameState.dealer +
        this.playersCount() -
        1) %
        this.playersCount()) +
      1
    );
  }

  bettingRound() {
    return {
      0: "pre flop",
      3: "flop",
      4: "turn",
      5: "river",
    }[this.gameState.community_cards.length];
  }

  activePlayersInGame() {
    return this.players().filter((p) => p.status() !== "out");
  }

  activePlayersInHand() {
    return this.players().filter((p) => p.status() === "active");
  }

  hasSomeBodyAllIn() {
    return this.players().some((p) => p.bet() >= this.toAllIn());
  }

  hasSomebodyRaised() {
    return this.players().some((p) => p.bet() > this.toCall());
  }
}

module.exports = GameState;
