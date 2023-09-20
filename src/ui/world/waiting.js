import JSP from "../../jsp/JSP";
import Entity from "../../jsp/entity";
import { BitmapText } from "../../jsp/graphics";
import { Color } from "../../jsp/rendering";
import World from "../../jsp/world";

export class WaitingWorld extends World{
    constructor(text, checkFn, completeFn){
        super();

        this.text = text;
        this.checkFn = checkFn;
        this.completeFn = completeFn;
    }

    begin(){
        super.begin();

        let waitingText = new BitmapText(JSP.loader.getFile("bmpfont"), this.text);
        waitingText.cx = waitingText.width/2;
        waitingText.cy = waitingText.height/2;
        waitingText.tint = Color.WHITE;
        waitingText.scaleX = 2;
        waitingText.scaleY = 2;
        this.addEntity(new Entity(JSP.renderTarget.width/2, JSP.renderTarget.height/2, waitingText));
    }

    update(){
        super.update();

        if(this.checkFn()){
            this.completeFn();
        }
    }
}