import JSP from "../../jsp/JSP";
import Entity from "../../jsp/entity";
import { BitmapText, Graphic, GraphicList } from "../../jsp/graphics";
import { Camera, RenderTarget } from "../../jsp/rendering";

export class MultiTextEntity extends Entity{
    constructor(x, y, text){
        super(x, y);

        let graphic = new GraphicList();
        let maxWidth = 0;
        let maxHeight = 0;
        let lines = text.split("\n");
        for(let line of lines){
            let temp = new BitmapText(JSP.loader.getFile("bmpfont"), line.trim());
            temp.cx = temp.width / 2;
            if(temp.width > maxWidth){
                maxWidth = temp.width;
            }
            graphic.add(temp, 0, maxHeight * 10);
            maxHeight += 1;
        }
        maxHeight *= 10;

        let renderTarget = new RenderTarget(maxWidth, maxHeight);
        graphic.draw(renderTarget, renderTarget.width/2, 0, Camera.zeroCamera);

        this.graphic = new Graphic(renderTarget);
        this.graphic.cx = this.graphic.width/2;
        this.graphic.cy = this.graphic.height/2;
        this.graphic.scaleX = 2;
        this.graphic.scaleY = 2;
    }

    set scale(value){
        this.graphic.scaleX = value;
        this.graphic.scaleY = value;
    }

    get scale(){
        return this.graphic.scaleX;
    }

    set tint(value){
        this.graphic.tint = value;
    }

    get tint(){
        return this.graphic.tint;
    }
}