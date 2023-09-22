import JSP from "../../jsp/JSP";
import Entity from "../../jsp/entity";
import { BitmapText } from "../../jsp/graphics";
import { Color } from "../../jsp/rendering";
import World from "../../jsp/world";
import { MultiTextEntity } from "../entity/multitext";

export class WaitingWorld extends World{
    constructor(text, checkFn, completeFn){
        super();

        this.text = text;
        this.checkFn = checkFn;
        this.completeFn = completeFn;
    }

    begin(){
        super.begin();
        this.addEntity(new MultiTextEntity(JSP.renderTarget.width/2, JSP.renderTarget.height/2, this.text));
    }

    update(){
        super.update();

        if(this.checkFn()){
            this.completeFn();
        }
    }
}