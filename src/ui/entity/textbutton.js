import JSP from "../../jsp/JSP";
import { BitmapText, Graphic, GraphicList } from "../../jsp/graphics";
import { Hitbox } from "../../jsp/hitbox";
import { Camera, Color, RenderTarget } from "../../jsp/rendering";
import { ButtonEntity } from "./button";

export class TextButton extends ButtonEntity{
    constructor(x, y, image, text, clickFn){
        let backGraphics = new Graphic(image);
        backGraphics.cx = backGraphics.width/2;
        backGraphics.cy = backGraphics.height/2;

        let textGraphics = new BitmapText(JSP.loader.getFile("bmpfont"), text);
        textGraphics.cx = textGraphics.width / 2;
        textGraphics.cy = textGraphics.height / 2;
        textGraphics.tint = Color.BLACK;
        textGraphics.scaleX = 2;
        textGraphics.scaleY = 2;

        let temp = new GraphicList();
        temp.add(backGraphics, 0, 0);
        temp.add(textGraphics, 0, 0);
        let renderTarget = new RenderTarget(backGraphics.width, backGraphics.height);
        temp.draw(renderTarget, renderTarget.width/2, renderTarget.height/2, Camera.zeroCamera);

        super(x, y);
        
        this.clickFn = clickFn;
        
        this.graphic = new Graphic(renderTarget);
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