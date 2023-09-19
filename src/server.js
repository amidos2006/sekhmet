import { Sekhmet } from "./logic/Game";
import { Server, Origins } from "boardgame.io/server";


const server = Server({
    games: [Sekhmet],
    origins: [Origins.LOCALHOST],
  });
  
server.run(8000);