import JSP from "../jsp/JSP";
import { DamageEvent, KillEvent, ResourceEvent } from "./events";

const AttackType = {
    NORMAL: 0,
    AUTO: 1,
    TRIGGER: 2,
}

const HitType = {
    NORMAL: 0,
    CANTHIT: 1,
    ALL: 2,
    DIAG: 3,
    EVERYONE: 4,
}

const HealthType = {
    NORMAL: 0,
    CAPPED: 1,
}

class Card{
    constructor(name, description, cooldown, health, attack){
        this.name = name;
        this.description = description;
        this.cooldown = cooldown;
        this.health = health;
        this.attack = attack;
        
        this.dmgScript = "";
        this.effectScript = "";

        this.hitType = HitType.HIT;
        this.attackType = AttackType.NORMAL;
        this.healthType = HealthType.NORMAL;

        this.onReady = [];
        this.onSacrifice = [];
        this.onDamaging = [];
        this.onKill = [];
        this.onHit = [];
        this.onDamaged = [];
        this.onDeath = [];
    }

    isTrigger(){
        return this.attackType == AttackType.TRIGGER;
    }

    isAuto(){
        return this.attackType == AttackType.AUTO;
    }

    isCapped(){
        return this.healthType == HealthType.CAPPED;
    }

    getHitType(){
        switch(this.hitType){
            case HitType.ALL:
                return "all";
            case HitType.CANTHIT:
                return "nohit";
            case HitType.DIAG:
                return "diag";
            case HitType.EVERYONE:
                return "everyone";
        }
        return "normal";
    }

    getLanes(playerIndex, laneIndex){
        let otherPlayerIndex = (1 - parseInt(playerIndex)).toString();
        switch(this.hitType){
            case HitType.CANTHIT:
                return [{playerIndex: otherPlayerIndex, laneIndex: laneIndex, canHit: false}];
            case HitType.NORMAL:
                return [{playerIndex: otherPlayerIndex, laneIndex: laneIndex, canHit: true}];
            case HitType.ALL:
                let result = [];
                for(let i=0; i<3; i++){
                    result.push({playerIndex: otherPlayerIndex, laneIndex: i, canHit: false});
                }
                return result;
            case HitType.EVERYONE:
                result = [];
                for(let i=0; i<3; i++){
                    result.push({playerIndex: otherPlayerIndex, laneIndex: i, canHit: false});
                }
                for(let i=0; i<3; i++){
                    result.push({playerIndex: playerIndex, laneIndex: i, canHit: false});
                }
                return result;
            case HitType.DIAG:
                result = [];
                for(let i=laneIndex - 1; i<laneIndex+2; i++){
                    if(i == laneIndex || i < 0 || i >= 3){
                        continue;
                    }
                    result.push({playerIndex: otherPlayerIndex, laneIndex: i, canHit: true});
                }
                return result;
        }
        return [];
    }

    getDamage(c, tc, oc, laneIndex, p, op){
        let dmgFunction = new Function("c", "tc", "oc", "laneIndex", "p", "op",
            `let dmg = 0;\n${this.dmgScript}\nreturn dmg;\n`);
        return dmgFunction(c, tc, oc, laneIndex, p, op);
    }
}

let cardDict = null;
function loadCards(){
    cardDict = {};
    let cardJson = JSP.loader.getFile("cards").data;
    for(let cardName in cardJson){
        let card = cardJson[cardName];
        cardDict[card.Name] = new Card(card.Name, card.Description, card.Cooldown, card.Health, card.Attack);
        switch(card.AttackType.trim()){
            case "NORMAL":
                cardDict[card.Name].attackType = AttackType.NORMAL;
                break;
            case "TRIGGER":
                cardDict[card.Name].attackType = AttackType.TRIGGER;
                break;
            case "AUTO":
                cardDict[card.Name].attackType = AttackType.AUTO;
                break;
        }
        switch(card.HitType.trim()){
            case "NORMAL":
                cardDict[card.Name].hitType = HitType.NORMAL;
                break;
            case "CANTHIT":
                cardDict[card.Name].hitType = HitType.CANTHIT;
                break;
            case "ALL":
                cardDict[card.Name].hitType = HitType.ALL;
                break;
            case "EVERYONE":
                cardDict[card.Name].hitType = HitType.EVERYONE;
                break;
            case "DIAG":
                cardDict[card.Name].hitType = HitType.DIAG;
                break;
        }
        switch(card.HealthType.trim()){
            case "NORMAL":
                cardDict[card.Name].healthType = HealthType.NORMAL;
                break;
            case "CAPPED":
                cardDict[card.Name].healthType = HealthType.CAPPED;
                break;
        }
        cardDict[card.Name].dmgScript = card.Damage.trim();
        cardDict[card.Name].effectScript = card.Effect.trim();
    }
}

export function getCard(name){
    if(cardDict == null){
        loadCards();
    }
    return cardDict[name];
}

export function getCardNames(){
    if(cardDict == null){
        loadCards();
    }
    return Object.keys(cardDict);
}