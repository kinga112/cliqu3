// import { SearchRequest, StringMatch, StringMatchMethod } from "@peerbit/document";
// import { peer, push } from "../App";
// import { Server, ServersDB } from "../peerbit";
// import { v4 as uuidv4 } from 'uuid';

// export async function createServer(name: string){
// 	const randomId = uuidv4();
//     const store = await peer.open(new ServersDB());
//     const newServer: Server = {
//       id: randomId,
//       name: name,
//       users: [],
//       textChannels: [],
//       voiceChannels: []
//     }  
//     store.servers.put(newServer)
    
// 		await push.createChannel(
// 			randomId, 
// 			'general', 
// 			'general chatting', 
// 			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==', 
// 			['0xDEC4399dDb5655237Ee0cCBEe1B79273FDD3B465', '0xF06863EaD6A1c82Eb976E2b8E5754a5e15b3C46D'], // needs to add test user because group cannot be empty when sending messages
// 			true,
// 			false
// 		)
    
// 		await push.createChannel(
// 			randomId, 
// 			'General', 
// 			'general voice chatting', 
// 			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==', 
// 			['0xDEC4399dDb5655237Ee0cCBEe1B79273FDD3B465', '0xF06863EaD6A1c82Eb976E2b8E5754a5e15b3C46D'], // needs to add test user because group cannot be empty when sending messages
// 			false,
// 			true
// 		)


// }