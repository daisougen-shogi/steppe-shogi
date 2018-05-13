"use strict";
import {JKFPlayer, Formats} from "json-kifu-format";
import {decorate, observable} from "mobx";
import {IpcRenderer} from "electron";
import {HIRATE} from "../constants";

export default class KifuStore {
  signature = Math.random();
  @observable filePath: string;
  @observable private _player: JKFPlayer;
  private ipc: IpcRenderer;
  @observable preset: string;

  constructor(ipc: IpcRenderer) {
    this.preset = HIRATE;
    this.player = new JKFPlayer({header: {}, moves: [{}]});
    this.ipc = ipc;
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

    // 編集モードを使って反則手も入力可能にする。
    // 大草原将棋はそういうものなのだから。
    this._player.shogi.editMode(true);
  }

  parse(kifu: string, filePath: string) {
    // TODO: json-kifu-formatをforkして反則手を入力可能にする。
    //       現状だと編集モードを使った棋譜データは読み込めない。
    const newPlayer = JKFPlayer.parse(kifu, filePath);
    this.takeOver(newPlayer, this.player);
    this.player = newPlayer;
    this.filePath = filePath;
  }

  onMove(move: Formats.IMoveMoveFormat) {
    try {
      if (this.player.inputMove(move) === false) {
        move.promote = confirm("成りますか？");
        this.player.inputMove(move);
      }
      this.ipc.send("engine:next", this._player.shogi.toSFENString());
    } catch (e) {
      // json-kifu-formatで反則手を指した場合例外が投げられる。
      // 例外を握りつぶせばなかったことになるらしい。
    }
  }

  load(path: string) {
    this.ipc.send("kifu:load", path);
  }

  handicap(preset: string) {
    this.preset = preset;
    this.player = new JKFPlayer({header: {}, initial: {preset}, moves: [{}]});
  }

  clear() {
    this.player = new JKFPlayer({header: {}, moves: [{}]});
  }

  start() {
    this.ipc.send("engine:new-game", this._player.shogi.toSFENString());
  }

  private takeOver(newPlayer: JKFPlayer, current: JKFPlayer) {
    const tesuu = current.tesuu === current.getMaxTesuu() ? Infinity : current.tesuu;
    newPlayer.goto(tesuu);
  }
}
