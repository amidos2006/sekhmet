import JSP from "../../jsp/JSP";
import World from "../../jsp/world";
import { getCardNames } from "../../logic/cards";
import { GameClient } from "../../logic/main";
import { CardEntity } from "../entity/card";
import { GraphicButton } from "../entity/graphic";
import { SelectedCardEntity } from "../entity/selectedcard";

export class DeckWorld extends World{
    constructor(){
        super();

        this.cards = [];
        this.selectedCards = {};
        let cardNames = getCardNames();
        for(let i=0; i<cardNames.length; i++){
            this.cards.push(new CardEntity((i%3)*120 + 130, (parseInt(i/3)%3)*170 + 160, 
                cardNames[i], this.selectCard.bind(this)));
            this.selectedCards[cardNames[i]] = {
                name: cardNames[i],
                count: 0,
                entity: new SelectedCardEntity(0, 0, cardNames[i], 0, this.removeCard.bind(this)),
            }
        }

        this.page = 0;

        this.leftButton = new GraphicButton(30, JSP.renderTarget.height/2 - 50, 
            JSP.loader.getFile("arrow"), this.previousPage.bind(this));
        this.leftButton.direction = -1;
        this.rightButton = new GraphicButton(JSP.renderTarget.width - 30, JSP.renderTarget.height/2 - 50, 
            JSP.loader.getFile("arrow"), this.nextPage.bind(this));
        this.okayButton = new GraphicButton(JSP.renderTarget.width/2, JSP.renderTarget.height - 195, 
            JSP.loader.getFile("okay"), this.submitDeck.bind(this));
        
    }

    begin(){
        for(let card of this.cards){
            this.addEntity(card);
        }
        for(let cardName in this.selectedCards){
            this.addEntity(this.selectedCards[cardName].entity);
        }
        this.addEntity(this.leftButton);
        this.addEntity(this.rightButton);
        this.addEntity(this.okayButton);
    }

    nextPage(){
        this.page += 1;
        if(this.page >= Math.ceil(this.cards.length / 9)){
            this.page = Math.ceil(this.cards.length / 9) - 1;
        }
    }

    previousPage(){
        this.page -= 1;
        if(this.page < 0){
            this.page = 0;
        }
    }

    submitDeck(){
        if(this.getSelectedCards().length < 15){
            return;
        }
        GameClient.getAPP().moves.useDeck(this.getSelectedCards());
    }

    selectCard(cardButton){
        let cardName = cardButton.card.name;
        if(this.getSelectedCards().length < 15 && this.selectedCards[cardName].count < 3){
            this.selectedCards[cardName].count += 1;
        }
    }

    removeCard(selectedButton){
        this.selectedCards[selectedButton.cardName].count -= 1;
    }

    getSelectedCards(){
        let results = [];
        for(let name in this.selectedCards){
            for(let i=0; i<this.selectedCards[name].count; i++){
                results.push(name);
            }
        }
        return results;
    }

    update(){
        super.update();
        for(let i=0; i<this.cards.length; i++){
            this.cards[i].active = false;
            this.cards[i].visible = false;
        }
        for(let i=0; i<9; i++){
            if(this.page*9 + i >= this.cards.length){
                break;
            }
            let cardName = this.cards[this.page * 9 + i].card.name;
            this.cards[this.page * 9 + i].visible = true;
            if(this.selectedCards[cardName].count >= 3){
                this.cards[this.page * 9 + i].graphic.alpha = 0.5;
                this.cards[this.page * 9 + i].active = false;
            }
            else{
                this.cards[this.page * 9 + i].graphic.alpha = 1;
                this.cards[this.page * 9 + i].active = true;
            }
        }
        let selectedCards = [];
        for(let name in this.selectedCards){
            this.selectedCards[name].entity.active = false;
            this.selectedCards[name].entity.visible = false;
            this.selectedCards[name].entity.cardCount =  this.selectedCards[name].count;
            if(this.selectedCards[name].count > 0){
                selectedCards.push(this.selectedCards[name].entity);
            }
        }
        for(let i=0; i<selectedCards.length; i++){
            selectedCards[i].x = (i%3)*130 + 130;
            selectedCards[i].y = JSP.renderTarget.height - 150 + (parseInt(i/3)%5)*30;
            selectedCards[i].active = true;
            selectedCards[i].visible = true;
        }

        this.leftButton.visible = true;
        if(this.page == 0){
            this.leftButton.visible = false;
        }
        this.rightButton.visible = true;
        if(this.page == Math.ceil(this.cards.length / 9) - 1){
            this.rightButton.visible = false;
        }
        this.okayButton.visible = false;
        if(this.getSelectedCards().length >= 15){
            this.okayButton.visible = true;
        }
    }
}