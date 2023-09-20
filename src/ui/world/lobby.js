import JSP from "../../jsp/JSP";
import World from "../../jsp/world";
import { GameClient } from "../../logic/main";
import { TextButton } from "../entity/text";
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
    }

    waitForServerConnection(){
        return GameClient.getAPP().state != null;
    }

    advanceToDeckBuilding(){
        JSP.world = new DeckWorld();
    }

    createRoom(){
        GameClient.playerID = "0";
        GameClient.matchID = "default";
        GameClient.getAPP().start();
        JSP.world = new WaitingWorld("... Waiting for Server Connection ...", 
            this.waitForServerConnection.bind(this), this.advanceToDeckBuilding.bind(this));
    }

    joinRoom(){
        GameClient.playerID = "1";
        GameClient.matchID = "default";
        GameClient.getAPP().start();
        JSP.world = new WaitingWorld("... Waiting for Server Connection ...", 
            this.waitForServerConnection.bind(this), this.advanceToDeckBuilding.bind(this));
    }
}