import { Sekhmet } from "./logic/game";
import { Server, Origins } from "boardgame.io/server";


const server = Server({
    games: [Sekhmet],
    origins: [Origins.LOCALHOST],
  });
  
server.run(8000);