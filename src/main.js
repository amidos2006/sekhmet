import JSP from './jsp/JSP';
import { Color } from './jsp/rendering';
import { LoadingWorld } from './jsp/utils';
import { LobbyWorld } from './ui/world/lobby';

JSP.init("game", 500, 800, 60);
JSP.start(function(){
    JSP.backcolor = Color.BLACK;
    JSP.world = new LoadingWorld(function(){
        JSP.loader.loadFile("cards", "assets/data/cards.json");

        JSP.loader.loadFile("arrow", "assets/graphics/arrow.png");
        JSP.loader.loadFile("button", "assets/graphics/okay_button.png");

        JSP.loader.loadFile("cooldown", "assets/graphics/cooldown.png");

        for(let name of ["normal", "capped"]){
            JSP.loader.loadFile(`${name}_health`, `assets/graphics/${name}_health.png`);
        }

        for(let name of ["all", "diag", "everyone", "nohit", "normal"]){
            JSP.loader.loadFile(`${name}_attack`, `assets/graphics/${name}_attack.png`);
        }

        for(let name of ["normal", "trigger", "auto"]){
            JSP.loader.loadFile(`${name}_card`, `assets/graphics/${name}_card.png`);
            JSP.loader.loadFile(`${name}_selected_card`, `assets/graphics/${name}_selected_card.png`);
        }
    },
    function(){
        JSP.backcolor = new Color(89, 86, 82);
        JSP.world = new LobbyWorld();
    });
})