import World from "../../jsp/world";
import { HandEntity } from "../entity/hand";
import { GameClient } from "../../logic/main"
import { CardEntity } from "../entity/card";
import { TextButton } from "../entity/textbutton";
import JSP from "../../jsp/JSP";

export class GameplayWorld extends World{
    constructor(){
        super();
    }

    begin(){
        super.begin();

        this.discardPhase = true;

        this.player = {
            hand: new HandEntity(true)
        }

        for(let card of GameClient.getAPP().state.G.players[GameClient.playerID].hand){
            this.player.hand.addCard(new CardEntity(0, 0, card, null));
        }

        for(let card of GameClient.getAPP().state.G.players[GameClient.playerID].deck){

        }

        this.discardButton = new TextButton(JSP.renderTarget.width/2, JSP.renderTarget.height - 300, 
            JSP.loader.getFile("button"), "discard", this.submitDiscard.bind(this));

        this.addEntity(this.player.hand);
        this.addEntity(this.discardButton);
    }

    submitDiscard(){
        let cards = this.player.hand.getSelectedCards();
        if(cards.length > 0){
            GameClient.getAPP().moves.discardCard(cards[0].index, cards[1].index);
        }
        this.player.hand.numOfSelection = 1;
        this.discardPhase = false;
    }

    update(){
        super.update();

        this.discardButton.visible = this.discardPhase && this.player.hand.getNumOfSelected() == 2;
        this.discardButton.active = this.discardPhase && this.player.hand.getNumOfSelected() == 2;
    }
}