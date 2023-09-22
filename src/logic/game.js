import { INVALID_MOVE, ActivePlayers, PlayerView } from "boardgame.io/core";
import { DamageEvent } from "./events"
import { getCard } from "./cards";

export const MAX_VALUES = {
    RESOURCES: 3,
    HEALTH: 7,
    DECK_SIZE: 15,
}

const eventsQueue = [];
function resolveEventQueue(G, currentPlayer){
    while(eventsQueue.length > 0){
        let event = eventsQueue.splice(0, 1);
    }
}

function attackCard(G, playerIndex, laneIndex, cardName, triggerCard){
    G.players[playerIndex].pacifist = false;

    let currentCard = getCard(cardName);
    let lanes = currentCard.getLanes(playerIndex, laneIndex);
    let c = {
        name: currentCard.name,
        health: G.playerground[playerIndex][laneIndex].card.health,
        cooldown: 0,
        dmg: currentCard.attack,
        maxHealth: currentCard.health,
        maxCooldown: currentCard.cooldown
    };
    let tc = triggerCard;
    let p = {
        health: G.players[playerIndex].health,
        resource: G.players[playerIndex].resource,
        cards: [],
    }
    let op = {
        health: G.players[(1 - parseInt(playerIndex)).toString()].health,
        resource: G.players[(1 - parseInt(playerIndex)).toString()].resource,
        cards: [],
    }
    for(let i=0; i<3; i++){
        if(G.playground[playerIndex][i].card){
            p.cards.push(Object.assign({}, G.playground[playerIndex][i].card));
        }
        if(G.playground[(1 - parseInt(playerIndex)).toString()][i].card){
            p.cards.push(Object.assign({}, G.playground[(1 - parseInt(playerIndex)).toString()][i].card));
        }
    }
    for(let l of lanes){
        let oc = {
            name: "",
            health: 0,
            cooldown: 0,
            dmg: 0,
            maxHealth: 0,
            maxCooldown: 0
        }
        if(G.playground[l.playerIndex][l.laneIndex].card){
            let opponetCard = getCard(G.playground[l.playerIndex][l.laneIndex].card.name);
            oc.name = opponetCard.name;
            oc.health = G.playground[l.playerIndex][l.laneIndex].card.health;
            oc.cooldown = G.playground[l.playerIndex][l.laneIndex].card.cooldown;
            oc.dmg = opponetCard.attack;
            oc.maxHealth = opponetCard.health;
            oc.maxCooldown = opponetCard.cooldown;
        }
        eventsQueue.push(new DamageEvent(l.playerIndex, l.laneIndex, 
            currentCard.getDamage(c, tc, oc, laneIndex, p, op), l.canHit));
    }
    resolveEventQueue(G, playerIndex);
    // call onSacrifice
    resolveEventQueue(G, playerIndex);
}

function drawCard(G, playerID){
    let card = G.players[playerID].deck.pop();
    G.players[playerID].hand.push(card);
}

function updateLane(G, playerIndex, laneIndex){
    if(G.playground[playerIndex][laneIndex].card != null){
        if(G.playground[playerIndex][laneIndex].card.cooldown > 0){
            G.playground[playerIndex][laneIndex].card.cooldown -= 1;
            if(G.playground[playerIndex][laneIndex].card.cooldown == 0){
                // call on ready first
                let currentCard = getCard(G.playground[playerIndex][laneIndex].card.name);
                if(currentCard.isAuto()){
                    attackCard(G, playerIndex, laneIndex, currentCard.name);
                    G.playground[playerIndex][i].card = null;
                }
            }
        }
    }
}

function playCard(G, playerIndex, laneIndex, cardName){
    let nextCard = getCard(cardName);
    if(G.playground[playerIndex][laneIndex].cooldown == 0 && G.playerground[playerIndex][laneIndex].card != null){
        let currentCard = getCard(G.playerground[playerIndex][laneIndex].card.name)
        attackCard(G, playerIndex, laneIndex, currentCard.name);
        for(let i=0; i<3; i++){
            if(i == laneIndex){
                continue;
            }
            if(G.playground[playerIndex][i].card != null && G.playground[playerIndex][i].card.cooldown == 0){
                let triggerCard = getCard(G.playground[playerIndex][i].card.name);
                if(!triggerCard.isTrigger()){
                    continue;
                }
                attackCard(G, playerIndex, laneIndex, triggerCard.name, 
                    {
                        name: currentCard.name,
                        health: G.playerground[playerIndex][laneIndex].card.health,
                        cooldown: 0,
                        dmg: currentCard.attack,
                        maxHealth: currentCard.health,
                        maxCooldown: currentCard.cooldown,
                    });
                G.playground[playerIndex][i].card = null;
            }
        }
    }
    G.playground[playerIndex][laneIndex].card = {
        name: nextCard.name,
        cooldown: nextCard.cooldown,
        health: nextCard.health
    }
}

export const Sekhmet = {
    setup: function({ random }){
        return {
            playground: {
                "0": Array(3).fill(
                    {
                        card: null,
                        status: {}
                    }
                ), 
                "1": Array(3).fill(
                    {
                        card: null,
                        status: {}
                    }
                ),
            },
            players: {
                "0": {
                    hand: [],
                    deck: [],
                    discard: [],
                    resource: 0,
                    health: MAX_VALUES.HEALTH,
                    pacifist: true,
                    kills: 0,
                    move: 1,
                },
                "1": {
                    hand: [],
                    deck: [],
                    discard: [],
                    resource: 1,
                    health: MAX_VALUES.HEALTH,
                    pacifist: true,
                    kills: 0,
                    move: 1,
                }
            }
        }
    },
    
    // playerView: PlayerView.STRIP_SECRETS,

    phases: {
        setup: {
            turn: {
                activePlayers: {
                    all: "setup",
                    minMoves: 1,
                    maxMoves: 1,
                },
                stages: {
                    setup: {
                        moves: {
                            useDeck: function({ G, playerID, random }, deck){
                                if(deck.length < MAX_VALUES){
                                    return INVALID_MOVE;
                                }
                                deck = random.Shuffle(deck);
                                G.players[playerID].deck = deck;
                            }
                        },
                    }
                },
            },
            endIf: function({ G }){
                return G.players["0"].deck.length == 15 && G.players["1"].deck.length == 15;
            },
            next: "discard",
            start: true,
        },
        discard: {
            onBegin: function({ G }){
                for(let i=0; i<5; i++){
                    drawCard(G, "0");
                    drawCard(G, "1");
                }
            },
            turn:{
                activePlayers: {
                    all: "discard",
                    minMoves: 1,
                    maxMoves: 1,
                },
                stages: {
                    discard: {
                        moves: {
                            discardCard: function({ G, playerID, random }, cardIndex1, cardIndex2){
                                if(cardIndex1 > cardIndex2){
                                    let temp = cardIndex1;
                                    cardIndex1 = cardIndex2;
                                    cardIndex2 = temp;
                                }
                                let card1 = G.players[playerID].hand.splice(cardIndex1, 1)[0];
                                let card2 = G.players[playerID].hand.splice(cardIndex2 - 1, 1)[0];
                                G.players[playerID].deck.push(card1);
                                G.players[playerID].deck.push(card2);
                                G.players[playerID].deck = random.Shuffle(G.players[playerID].deck);
                            },
                        },
                    },
                },
            },
            endIf: function( { G } ){
                return G.players["0"].hand.length == 3 && G.players["1"].hand.length == 3;
            },
            next: "play",
        },
        play: {
            turn: {
                stages: {
                    main: {
                        onBegin: function({ G, ctx }){
                            for(let i=0; i<3; i++){
                                updateLane(G, ctx.currentPlayer, i);
                            }
                        },
                        moves: {
                            playCard: function({ G, playerID }, handID, colID){
                                if(G.players[playerID].move <= 0 && G.players[playerID].resource <= 1){
                                    return INVALID_MOVE;
                                }
                                if(colID >= 3 || colID < 0){
                                    return INVALID_MOVE;
                                }
                                if(handID >= G.players[playerID].hand.length || handID < 0){
                                    return INVALID_MOVE;
                                }
                                playCard(G, playerID, colID, G.players[playerID].hand[handID].id);
                                if(G.players[playerID].move > 0){
                                    G.players[playerID].move -= 1;
                                }
                                else{
                                    G.players[playerID].resource -= 2;
                                }
                            }, 
                            switchCol: function({ G, playerID }, col1ID, col2ID){
                                if(G.players[playerID].resource <= 0){
                                    return INVALID_MOVE;
                                }
                                let temp = G.playground[playerID][col1ID];
                                G.playground[playerID][col1ID] = G.playground[playerID][col2ID];
                                G.playground[playerID][col2ID] = temp;
                                G.players[playerID].resource -= 1;
                            }, 
                            speedCol: function({ G, playerID }, colID){
                                if(G.players[playerID].resource <= 0){
                                    return INVALID_MOVE;
                                }
                                G.players[playerID].resource -= 1;
                            },
                        },
                        onEnd: function({ G, ctx, random }){
                            let addedResources = 0;
                            if(G.players[ctx.currentPlayer].pacifist){
                                addedResources += 1;
                            }
                            addedResources += G.players[ctx.currentPlayer].kills;
                            G.players[ctx.currentPlayer].resource += addedResources;
                            if(G.players[ctx.currentPlayer].resource > MAX_VALUES.RESOURCES){
                                G.players[ctx.currentPlayer].resource = MAX_VALUES.RESOURCES;
                            }

                            while(G.players[ctx.currentPlayer].hand.length < 3){
                                if(G.players[ctx.currentPlayer].deck.length == 0){
                                    G.players[ctx.currentPlayer].health -= 1;
                                    if(G.players[ctx.currentPlayer].health < 0){
                                        G.players[ctx.currentPlayer].health = 0;
                                    }
                                    G.players[ctx.currentPlayer].deck = G.players[ctx.currentPlayer].discard;
                                    G.players[ctx.currentPlayer].discard = [];
                                    G.players[ctx.currentPlayer].deck = random.Shuffle(G.players[ctx.currentPlayer].deck);
                                }
                                drawCard(G, ctx.currentPlayer);
                            }

                            G.players[ctx.currentPlayer].pacifist = true;
                            G.players[ctx.currentPlayer].kills = 0;
                        }
                    }
                }
            }
        }
    },
    endIf: function({ G, ctx }) {
        if(G.players[ctx.currentPlayer].health <= 0){
            return { winner: 1 - parseInt(ctx.currentPlayer) };
        }
    },
}