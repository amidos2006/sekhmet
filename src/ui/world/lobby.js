import JSP from "../../jsp/JSP";
import World from "../../jsp/world";
import { GameClient } from "../../logic/main";
import { TextButton } from "../entity/text";
import { DeckWorld } from "./deck";

export class LobbyWorld extends World{
    constructor(){
        super();
    }

    begin(){
        super.begin();

        this.addEntity(new TextButton(JSP.renderTarget.width/2, JSP.renderTarget.height/2-50, 
            JSP.loader.getFile("button"), "Create Match", this.createRoom.bind(this)));
        this.addEntity(new TextButton(JSP.renderTarget.width/2, JSP.renderTarget.height/2+50, 
            JSP.loader.getFile("button"), "Join Match", this.joinRoom.bind(this)));
    }

    createRoom(){
        GameClient.playerID = "0";
        GameClient.matchID = "default";
        GameClient.getAPP().start();
        JSP.world = new DeckWorld();
    }

    joinRoom(){
        GameClient.playerID = "1";
        GameClient.matchID = "default";
        GameClient.getAPP().start();
        JSP.world = new DeckWorld();
    }
}