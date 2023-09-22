import JSP from "../../jsp/JSP";
import Entity from "../../jsp/entity";
import { BitmapText, Graphic, GraphicList } from "../../jsp/graphics";
import { Hitbox } from "../../jsp/hitbox";
import { KeyboardKeys, MouseKeys } from "../../jsp/input";
import { Color, RenderTarget } from "../../jsp/rendering";
import { Alarm, Tween } from "../../jsp/tweens";

export class InputTextEntity extends Entity{
    constructor(x, y, maxLength){
        if(maxLength === undefined) maxLength = 10;

        super(x, y);

        this._text = "";
        this._flicker = "";
        this.active = false;
        this.maxLength = maxLength;

        this.renderText = new BitmapText(JSP.loader.getFile("bmpfont"), "");
        this.renderText.scaleX = 2;
        this.renderText.scaleY = 2;

        this.graphic = new GraphicList();
        if(this.maxLength > 0){
            let renderTarget = new RenderTarget(this.maxLength * 16, 20);
            renderTarget.drawFillRect(0, 0, renderTarget.width, renderTarget.height, Color.BLACK);
            let temp = new Graphic(renderTarget);
            temp.cx = temp.width/2;
            temp.cy = temp.height/2;
            this.graphic.add(temp);
            this.mask = new Hitbox(-temp.cx, -temp.cy, temp.width, temp.height);
        }        
        this.graphic.add(this.renderText, -this.maxLength * 8 + 32, -6);
        
        this.addTween(new Alarm(30, Tween.LOOPING, function(){
            if(this.active){
                if(this._flicker == ""){
                    this._flicker = "|";
                }
                else{
                    this._flicker = "";
                }
            }
            else{
                this._flicker = "";
            }
            this.renderText.text = this._text + this._flicker;
        }.bind(this)), true);
    }

    get text(){
        return this._text;
    }

    update(){
        super.update();

        if(JSP.input.mouseReleased(MouseKeys.LEFT)){
            this.active = this.collidePoint(this.x, this.y, JSP.input.mouseX(), JSP.input.mouseY());
        }

        if(this.active){
            let before = this._text.toString();
            if(this.maxLength <= 0 || this._text.length < this.maxLength){
                for(let i=KeyboardKeys.NUM_0; i<=KeyboardKeys.Z; i++){
                    if(JSP.input.keyPressed(i)){
                        this._text += JSP.input.keyString().trim().toLowerCase();
                        break;
                    }
                }
            }

            if(JSP.input.keyPressed(KeyboardKeys.BACKSPACE) && this._text.length > 0){
                this._text = this._text.slice(0, this._text.length - 1);
            }

            if(before != this._text){
                this.renderText.text = this._text + this._flicker;
            }
        }
    }
}