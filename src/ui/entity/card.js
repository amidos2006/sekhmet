import JSP from "../../jsp/JSP";
import { BitmapText, Graphic, GraphicList } from "../../jsp/graphics";
import { Camera, Color, RenderTarget } from "../../jsp/rendering";
import { getCard } from "../../logic/cards";
import { GraphicButton } from "./graphic";

export class CardEntity extends GraphicButton{
    constructor(x, y, cardName, clickFn){
        let card = getCard(cardName);

        let nameText = new BitmapText(JSP.loader.getFile("bmpfont"), cardName);
        nameText.cx = nameText.width / 2;
        nameText.cy = nameText.height / 2;
        nameText.tint = Color.BLACK;
        nameText.scaleX = 2;
        nameText.scaleY = 2;

        let cooldownBack = new Graphic(JSP.loader.getFile("cooldown"));
        cooldownBack.cx = cooldownBack.width / 2;
        cooldownBack.cy = cooldownBack.height / 2;

        let cooldownText = new BitmapText(JSP.loader.getFile("bmpfont"), card.cooldown);
        cooldownText.cx = cooldownText.width / 2;
        cooldownText.cy = cooldownText.height / 2;
        cooldownText.tint = Color.BLACK;
        cooldownText.scaleX = 2;
        cooldownText.scaleY = 2;

        let healthBack = null;
        if(card.isCapped()){
            healthBack = new Graphic(JSP.loader.getFile("capped_health"));
        }
        else{
            healthBack = new Graphic(JSP.loader.getFile("normal_health"));
        }
        healthBack.cx = healthBack.width / 2;
        healthBack.cy = healthBack.height / 2;

        let healthText = new BitmapText(JSP.loader.getFile("bmpfont"), card.health);
        healthText.cx = healthText.width / 2;
        healthText.cy = healthText.height / 2;
        healthText.tint = Color.BLACK;
        healthText.scaleX = 2;
        healthText.scaleY = 2;

        let attackBack = new Graphic(JSP.loader.getFile(`${card.getHitType()}_attack`));
        attackBack.cx = attackBack.width / 2;
        attackBack.cy = attackBack.height / 2;

        let attackText = new BitmapText(JSP.loader.getFile("bmpfont"), card.attack);
        attackText.cx = attackText.width / 2;
        attackText.cy = attackText.height / 2;
        attackText.tint = Color.BLACK;
        attackText.scaleX = 2;
        attackText.scaleY = 2;

        let backGraphics = null;
        if(card.isAuto()){
            backGraphics = new Graphic(JSP.loader.getFile("auto_card"));
        }
        else if(card.isTrigger()){
            backGraphics = new Graphic(JSP.loader.getFile("trigger_card"));
        }
        else{
            backGraphics = new Graphic(JSP.loader.getFile("normal_card"));
        }
        backGraphics.cx = backGraphics.width/2;
        backGraphics.cy = backGraphics.height/2;

        let temp = new GraphicList();
        temp.add(backGraphics, 0, 0);
        temp.add(nameText, 0, 0);
        temp.add(cooldownBack, 0, -48);
        temp.add(cooldownText, 0, -48);
        temp.add(attackBack, 24, 48);
        temp.add(attackText, 24, 48);
        temp.add(healthBack, -24, 48);
        temp.add(healthText, -24, 48);

        let renderTarget = new RenderTarget(backGraphics.width, backGraphics.height);
        temp.draw(renderTarget, renderTarget.width/2, renderTarget.height/2, Camera.zeroCamera);

        super(x, y, renderTarget, clickFn);

        this.card = card;
    }
}