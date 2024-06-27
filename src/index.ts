import 'dotenv/config';
import {Server} from './server';

const port = Number(process.env.PORT) || 4000;

Server.Initialize();
Server.Start(port);

// while(true) {
//     Server.Logs.debug("Test!");
//     delay(500)
// }

// function delay(ms: number) {
//     return new Promise( resolve => setTimeout(resolve, ms) );
// }
