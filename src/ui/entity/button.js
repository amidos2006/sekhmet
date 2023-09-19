import JSP from "../../jsp/JSP";
import Entity from "../../jsp/entity";
import { MouseKeys } from "../../jsp/input";

export class ButtonEntity extends Entity{
    constructor(x, y){
        super(x, y);

        this.active = true;
    }

    onHover(){

    }

    onExit(){

    }

    onClick(){

    }

    update(){
        super.update();

        if(!this.active){
            this.onExit();
            return;
        }

        if(this.collidePoint(this.x, this.y, JSP.input.mouseX(), JSP.input.mouseY())){
            this.onHover();
            if(JSP.input.mouseReleased(MouseKeys.LEFT)){
                this.onClick();
            }
        }
        else{
            this.onExit();
        }
    }
}