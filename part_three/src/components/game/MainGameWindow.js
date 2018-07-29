import React from 'react';
import { AnotherPlayer, MiddleSection, Player } from '.';
import { utils, Card, enums } from './cross';

import { getGame, playGameWithId } from '../api';

const { createCardsArray, isSpecialCard, shuffleDeck } = utils;
const { PLAYER, BOT } = enums;

const StartGameButton = ({ }) => (
  <button
    type="button"
    id="startGame"
    className="btn start-game-button"
    onClick={() => this.startGame()}
  >
    Start Game
  </button>
);

let playFunc;
let getGameInterval;

class MainGameWindow extends React.Component {
  constructor(props) {
    super(props);
    this.baseState = this.state;
    this.countTimer = this.countTimer.bind(this);
    this.setHasMove = this.setHasMove.bind(this);
    this.playCard = this.playCard.bind(this);
    this.switchPlayer = this.switchPlayer.bind(this);
    this.setTaki = this.setTaki.bind(this);
    this.closeTaki = this.closeTaki.bind(this);
    this.takeCardFromMainDeck = this.takeCardFromMainDeck.bind(this);
    this.selectColor = this.selectColor.bind(this);
    this.getMiddleProps = this.getMiddleProps.bind(this);
    this.getPlayerProps = this.getPlayerProps.bind(this);
    this.statsComp = React.createRef();
    this.setStats = this.setStats.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.quit = this.quit.bind(this);
    this.state = {};
    playFunc = body =>
      playGameWithId(props.gameId, Object.assign({ args: [] }, body));
  }

  quit() {
    playFunc({
      action: 'quit'
    });
  }

  setStats(player) { }

  setHasMove(bool) { }

  playCard(index) {
    playFunc({
      action: 'playCard',
      args: [index]
    });
  }

  switchPlayer(anotherTurn, closeTaki = false) {
    playFunc({
      action: 'nextPlayer',
      args: [anotherTurn, closeTaki]
    });
  }

  gameOver() { }

  takeCardFromMainDeck() {
    playFunc({
      action: 'takeCardFromMainDeck'
    });
  }

  closeTaki() {
    this.switchPlayer(false, true);
  }

  selectColor(color) {
    playFunc({
      action: 'selectColor',
      args: [color]
    });
  }

  componentDidMount() {
    setInterval(() => {
      getGame(this.props.gameId).then(game => {
        this.setState(Object.assign(game.state, { render: true }));
      });
    }, 200);
  }

  componentDidUpdate() {
    this.countTimer();
  }

  setTaki(setTo) {
    /*if (setTo === true && this.state.currentPlayer === PLAYER) {
      this.setState({ msg: 'taki you can put all the cards off this color' });
    }*/
    playFunc({
      action: 'setTaki',
      args: [setTo]
    });


  }

  countTimer() {
    playFunc({
      action: 'countTimer'
    });
    console.log(1);
  }

  getMiddleProps() {
    const {
      deckCards,
      pileCards,
      currentPlayer,
      cardIsActive,
      isTaki,
      isChangeColor,
      playerHasMove,
      stats,
      winner,
      msg,
      playersFinished
    } = this.state;
    return {
      takiIdentifier: currentPlayer === this.props.playerName && isTaki,
      mainDeckCards: deckCards,
      pileCards: pileCards,
      player: currentPlayer, ///who's turn
      takeCard:
        currentPlayer === this.props.playerName
          ? this.takeCardFromMainDeck
          : null,
      isTaki: isTaki,
      stats: stats[this.props.playerName],
      closeTaki: this.closeTaki,
      selectColor: this.selectColor,
      statsRef: this.statsComp,
      allowTake:
        playerHasMove === false &&
        currentPlayer === this.props.playerName &&
        !isTaki,
      winner: winner,
      msg: msg,
      colorIdentifier: currentPlayer === this.props.playerName && isChangeColor,
      playersFinished: playersFinished
    };
  }

  getPlayerProps() {
    const {
      pileCards,
      currentPlayer,
      playerDecks,
      cardIsActive,
      isTaki,
      winner
    } = this.state;
    return {
      playCard: currentPlayer === this.props.playerName ? this.playCard : null,
      switchPlayer: this.switchPlayer,
      cards: playerDecks[this.props.playerName],
      isActive: cardIsActive,
      lastPileCard: pileCards[pileCards.length - 1],
      isTaki: isTaki,
      setTaki: this.setTaki,
      hasMove: this.setHasMove,
      buildDeck: this.buildNewMainDeck,
      gameOver: winner !== -1
    };
  }

  render() {
    return (
      <div>
        {this.state.render ? (
          <div id="wrapper">
            {Object.keys(this.state.playerDecks)
              .filter(name => name !== this.props.playerName)
              .map(player => (
                <AnotherPlayer cards={this.state.playerDecks[player]} />
              ))}
            <MiddleSection {...this.getMiddleProps()} />
            <Player {...this.getPlayerProps()} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default MainGameWindow;
