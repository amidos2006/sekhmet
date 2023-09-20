import { Client } from 'boardgame.io/client';
import { SocketIO } from 'boardgame.io/multiplayer';
import { Sekhmet } from './game';

class SekhmetClient {
    constructor(playerID, matchID){
        this.client = new Client({ 
            game: Sekhmet,  
            multiplayer: SocketIO({ server: 'localhost:8000' }), 
            playerID: playerID, matchID: matchID
        });
    }

    get moves(){
        return this.client.moves;
    }

    get state(){
        return this.client.getState();
    }

    start(){
        this.client.start();
    }

    stop(){
        this.client.stop();
    }

    reset(){
        this.client.reset();
    }
}

export const GameClient = {
    matchID: "default",
    playerID: "0",
    app: null,
    getAPP: function(){
        if(this.app == null){
            this.app = new SekhmetClient(this.playerID, this.matchID);
        }
        return this.app;
    }
}