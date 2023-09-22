import { Graphic } from "../../jsp/graphics";
import { Hitbox } from "../../jsp/hitbox";
import { ButtonEntity } from "./button";

export class GraphicButton extends ButtonEntity{
    constructor(x, y, image, clickFn){
        super(x, y);
        
        this.clickFn = clickFn;
        
        this.graphic = new Graphic(image);
        this.graphic.cx = this.graphic.width/2;
        this.graphic.cy = this.graphic.height/2;

        this.mask = new Hitbox(-this.graphic.cx, -this.graphic.cy, this.graphic.width, this.graphic.height);

        this.direction = 1;
    }

    onHover(){
        this.graphic.scaleX = this.direction * 1.5;
        this.graphic.scaleY = this.direction * 1.5;
        this.layer = 10;
    }

    onExit(){
        this.graphic.scaleX = this.direction * 1;
        this.graphic.scaleY = this.direction * 1;
        this.layer = 0;
    }

    onClick(){
        if(this.clickFn){
            this.clickFn(this);
        }
    }
}