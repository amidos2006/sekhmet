class Event{
    constructor(type, playerIndex){
        this.type = type;
        this.playerIndex = playerIndex;
    }
}

export class HitEvent extends Event{
    constructor(playerIndex){
        super("hit", playerIndex);
    }
}

export class DiscardEvent extends Event{
    constructor(playerIndex){
        super("discard", playerIndex);
    }
}

export class ResourceEvent extends Event{
    constructor(playerIndex, value){
        super("resource", playerIndex);
        if(value === undefined) value = 1;
        this.value = value;
    }
}

class LaneEvent extends Event{
    constructor(type, playerIndex, laneIndex){
        super(type, playerIndex);
        this.laneIndex = laneIndex;
    }
}

export class KillEvent extends LaneEvent{
    constructor(playerIndex, laneIndex){
        super("kill", playerIndex, laneIndex);
    }
}

export class DamageEvent extends LaneEvent{
    constructor(playerIndex, laneIndex, value, canHit){
        super("damage", playerIndex, laneIndex);
        this.value = value;
        this.canHit = canHit;
    }
}

export class CooldownEvent extends LaneEvent{
    constructor(playerIndex, laneIndex, value){
        super("cooldown", playerIndex, laneIndex);
        if(value === undefined) value = -1;
        this.value = value;
    }
}

export class StatusEvent extends LaneEvent{
    constructor(playerIndex, laneIndex, status, value){
        super("status", playerIndex, laneIndex);
        this.status = status;
        this.value = value;
    }
}

export class GameLogger{
    constructor(){
        this.logs = [];
    }

    log(msg){
        this.logs.push(msg);
    }
}