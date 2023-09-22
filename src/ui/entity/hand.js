import JSP from "../../jsp/JSP";
import Entity from "../../jsp/entity";

export class HandEntity extends Entity{
    constructor(isCurrentPlayer){
        if(isCurrentPlayer === undefined) isCurrentPlayer = true;

        super(JSP.renderTarget.width / 2, isCurrentPlayer?JSP.renderTarget.height - 100: 100);

        this.isCurrentPlayer = isCurrentPlayer;
        this.cards = [];
        this.selected = [];
        this.numOfSelection = 2;
    }

    selectCard(card){
       let index = this.selected.indexOf(card.index);
        if(index >= 0){
            this.selected.splice(index, 1);
        }
        else{
            if(this.selected.length >= this.numOfSelection){
                this.selected.splice(0, 1);
            }
            this.selected.push(card.index);
        }
    }

    addCard(card){
        this.cards.push(card);
        card.index = this.cards.length - 1;
        card.clickFn = this.selectCard.bind(this);
        card.active = this.isCurrentPlayer;
    }

    getNumOfSelected(){
        return this.selected.length;
    }

    getSelectedCards(){
        let results = [];
        if(this.selected.length ==  this.numOfSelection){
            for(let index of this.selected){
                results.push(this.cards[index]);
                this.cards[index] = null;
            }
            this.cards = this.cards.filter((value) => value != null);
        }
        return results;
    }

    update(){
        super.draw();

        for(let i=0; i<this.cards.length; i++){
            let card = this.cards[i];
            card.x = this.x - (i - Math.floor(this.cards.length/2)) * 40;
            let selected = this.selected.indexOf(card.index) >= 0;
            card.y = this.y - selected * 100;
            card.layer = i;
            card.update();
        }
    }

    draw(){
        super.draw();
        let cards = this.cards.slice(0, this.cards.length);
        cards.sort((a, b)=>a.layer-b.layer);
        for(let card of cards){
            card.draw();
        }
    }
}