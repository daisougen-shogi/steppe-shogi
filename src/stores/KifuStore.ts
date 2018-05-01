"use strict";
import {JKFPlayer} from "json-kifu-format";
import {decorate, observable} from "mobx";

export default class KifuStore {
  @observable private filePath: string;
  @observable private _player: JKFPlayer;

  constructor() {
    this.player = new JKFPlayer({header: {}, moves: [{}]});
  }

  get player() {
    return this._player;
  }

  set player(player: JKFPlayer) {
    decorate(player, {
      forkPointers: observable,
      kifu: observable,
      tesuu: observable
    });
    decorate(player.shogi, {
      board: observable,
      hands: observable,
      turn: observable
    });
    this._player = player;
  }

  parse(kifu: string, filePath: string) {
    this.player = JKFPlayer.parse(kifu, filePath);
    this.filePath = filePath;
  }
}
