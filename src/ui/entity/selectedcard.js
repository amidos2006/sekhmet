import JSP from "../../jsp/JSP";
import { BitmapText, Graphic, GraphicList } from "../../jsp/graphics";
import { Camera, Color, RenderTarget } from "../../jsp/rendering";
import { getCard } from "../../logic/cards";
import { GraphicButton } from "./graphicbutton";

export class SelectedCardEntity extends GraphicButton{
    constructor(x, y, cardName, cardCount, clickFn){
        let nameText = new BitmapText(JSP.loader.getFile("bmpfont"), cardName);
        nameText.cx = 0;
        nameText.cy = nameText.height / 2;
        nameText.tint = Color.BLACK;
        nameText.scaleX = 2;
        nameText.scaleY = 2;

        let countText = new BitmapText(JSP.loader.getFile("bmpfont"), `x${cardCount}`);
        countText.cx = 0;
        countText.cy = countText.height / 2;
        countText.tint = Color.WHITE;
        countText.scaleX = 2;
        countText.scaleY = 2;

        let card = getCard(cardName);
        let backGraphics = null;
        if(card.isAuto()){
            backGraphics = new Graphic(JSP.loader.getFile("auto_selected_card"));
        }
        else if(card.isTrigger()){
            backGraphics = new Graphic(JSP.loader.getFile("trigger_selected_card"));
        }
        else{
            backGraphics = new Graphic(JSP.loader.getFile("normal_selected_card"));
        }
        backGraphics.cx = backGraphics.width/2;
        backGraphics.cy = backGraphics.height/2;

        let cooldownText = new BitmapText(JSP.loader.getFile("bmpfont"), `${card.cooldown}`);
        cooldownText.cx = cooldownText.width / 2;
        cooldownText.cy = cooldownText.height / 2;
        cooldownText.tint = Color.BLACK;
        cooldownText.scaleX = 2;
        cooldownText.scaleY = 2;

        let temp = new GraphicList();
        temp.add(backGraphics, 0, 0);
        temp.add(nameText, -backGraphics.width/2 + 6, 0);
        temp.add(cooldownText, backGraphics.width/2 - 40, 0);
        temp.add(countText, backGraphics.width/2 - 20, 0);

        let renderTarget = new RenderTarget(backGraphics.width, backGraphics.height);
        temp.draw(renderTarget, renderTarget.width/2, renderTarget.height/2, Camera.zeroCamera);

        super(x, y, renderTarget, clickFn);

        this.graphicList = temp;
        this.renderTarget = renderTarget;

        this.cardName = cardName;
        this.cardCount = cardCount;
    }

    draw(){
        this.renderTarget.clearTarget();
        let loc = this.graphicList.graphics.length - 1;
        this.graphicList.graphics[loc].text = `x${this.cardCount}`;
        this.graphicList.draw(this.renderTarget, this.renderTarget.width/2, 
            this.renderTarget.height/2, Camera.zeroCamera);
        this.graphic.tint = Color.WHITE;
        super.draw();
    }
}