import JSP from "../../jsp/JSP";
import World from "../../jsp/world";
import { GameClient } from "../../logic/main";
import { InputTextEntity } from "../entity/inputtext";
import { TextButton } from "../entity/textbutton";
import { DeckWorld } from "./deck";
import { WaitingWorld } from "./waiting";

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

        this.input = new InputTextEntity(JSP.renderTarget.width/2, JSP.renderTarget.height/2, 10);
        this.addEntity(this.input);
    }

    waitForPlayer2(){
        return GameClient.getAPP().state != null && GameClient.getAPP().client.matchData[1].isConnected;
    }

    waitForPlayer1(){
        return GameClient.getAPP().state != null && GameClient.getAPP().client.matchData[0].isConnected;
    }

    advanceToDeckBuilding(){
        JSP.world = new DeckWorld();
    }

    createRoom(){
        GameClient.playerID = "0";
        GameClient.matchID = (+new Date()).toString(36);
        console.log(GameClient.matchID)
        GameClient.getAPP().start();
        JSP.world = new WaitingWorld(`... Waiting for other Player ...\n\nRoom Code: ${GameClient.matchID}`, 
            this.waitForPlayer2.bind(this), this.advanceToDeckBuilding.bind(this));
    }

    joinRoom(){
        GameClient.playerID = "1";
        GameClient.matchID = this.input.text;
        GameClient.getAPP().start();
        JSP.world = new WaitingWorld("... Waiting for Server Connection ...", 
            this.waitForPlayer1.bind(this), this.advanceToDeckBuilding.bind(this));
    }
}