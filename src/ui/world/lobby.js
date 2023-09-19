import World from "../../jsp/world";
import { GameClient } from "../../logic/main";

export class LobbyWorld extends World{
    constructor(){
        super();
    }

    begin(){
        super.begin();
    }

    createRoom(){
        GameClient.playerID = "0";
        GameClient.matchID = "default";
        GameClient.getAPP().start();
    }

    joinRoom(){
        GameClient.playerID = "1";
        GameClient.matchID = "default";
        GameClient.getAPP().start();
    }
}