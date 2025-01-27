import { addRxPlugin, RxCollection, RxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { createRxDatabase } from 'rxdb';
import { v4 as uuidv4 } from 'uuid';
import { push } from './App';
import { chat } from '@pushprotocol/restapi/src';
import {
    replicateWebRTC,
    getConnectionHandlerSimplePeer,
	SimplePeer
} from 'rxdb/plugins/replication-webrtc';
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

export class RxDB {
	database: RxDatabase | undefined;
	servers: RxCollection | undefined;
	
	async initDB(){
		this.database = await createRxDatabase({
			name: 'cliqu3_test_4',
			storage: getRxStorageDexie(),
			ignoreDuplicate: true
		});
		const collections = await this.database.addCollections({
			servers: {
				schema: serverSchema
			}
		});

		this.servers = collections.servers;

		// replicateWebRTC<RxCollection, SimplePeer>({
		// 	collection: this.servers,
		// 	connectionHandlerCreator: getConnectionHandlerSimplePeer({}),
		// 	topic: 'cliqu3-topic-test-id',
		// 	pull: {},
		// 	push: {},
		// }).then(replicationState => {
		// 	replicationState.error$.subscribe((err: any) => {
		// 		console.log('replication error:');
		// 		console.dir(err);
		// 	});
		// 	replicationState.peerStates$.subscribe(s => {
		// 		console.log('new peer states:');
		// 		console.dir(s);
		// 	});
		// });

		// const replicationPool = await replicateWebRTC(
		// 	{
		// 		collection: this.servers!,
		// 		// The topic is like a 'room-name'. All clients with the same topic
		// 		// will replicate with each other. In most cases you want to use
		// 		// a different topic string per user.
		// 		topic: 'my-users-pool',
		// 		/**
		// 		 * You need a collection handler to be able to create WebRTC connections.
		// 		 * Here we use the simple peer handler which uses the 'simple-peer' npm library.
		// 		 * To learn how to create a custom connection handler, read the source code,
		// 		 * it is pretty simple.
		// 		 */
		// 		connectionHandlerCreator: getConnectionHandlerSimplePeer({
		// 			// Set the signaling server url.
		// 			// You can use the server provided by RxDB for tryouts,
		// 			// but in production you should use your own server instead.
		// 			signalingServerUrl: 'wss://signaling.rxdb.info/',
		// 			// wrtc: nodeDatachannelPolyfill,
        //     		// webSocketConstructor: WebSocket,
		// 			// only in Node.js, we need the wrtc library
		// 			// because Node.js does not contain the WebRTC API.
		// 			// wrtc: require('node-datachannel/polyfill'),
		// 			// only in Node.js, we need the WebSocket library
		// 			// because Node.js does not contain the WebSocket API.
		// 			// webSocketConstructor: require('ws').WebSocket
		// 		}),
		// 		// check if peer is valid
		// 		// isPeerValid: async (peer: SimplePeer) => {
		// 		// 	return true;
		// 		// },
		// 		pull: {},
		// 		push: {}
		// 	}
		// );
		// replicationPool.error$.subscribe(err => { /* ... */ });
		// replicationPool.cancel();

	}

	async createServer(name: string){
		const randomId = uuidv4();
		await this.database!.servers.insert({
			id: randomId,
			name: name,
			dateCreated: new Date().toISOString()
		});
		await push.createChannel(
			randomId, 
			'general', 
			'general chatting', 
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==', 
			['0xDEC4399dDb5655237Ee0cCBEe1B79273FDD3B465', '0xF06863EaD6A1c82Eb976E2b8E5754a5e15b3C46D'], // needs to add test user because group cannot be empty when sending messages
			true,
			false
		)
		await push.createChannel(
			randomId, 
			'General', 
			'general voice chatting', 
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==', 
			['0xDEC4399dDb5655237Ee0cCBEe1B79273FDD3B465', '0xF06863EaD6A1c82Eb976E2b8E5754a5e15b3C46D'], // needs to add test user because group cannot be empty when sending messages
			false,
			true
		)
	}

}

const serverSchema = {
	version: 0,
	primaryKey: 'id',
	type: 'object',
	properties: {
    id: {
      type: 'string',
      maxLength: 36 // <- the primary key must have set maxLength
    },
    name: {
      type: 'string'
    },
    users: {
      type: ['string']
    },
    chatChannels: {
      type: ['string']
    },
    voiceChannels: {
      // type: ['string']
      "type": "array",
      // "maxItems": 5,
      "uniqueItems": true,
      "voiceChannels": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string"
          },
          "peerInfo": {
            "type": "string", // JSON string
          }
        }
      }
    },
    dateCreated: {
      type: 'string',
      format: 'date-time'
    }
	},
	required: ['id', 'name', 'dateCreated']
}


// const serverSchema = {
// 	version: 0,
// 	primaryKey: 'id',
// 	type: 'object',
// 	properties: {
// 		id: {
// 				type: 'string',
// 				maxLength: 36 // <- the primary key must have set maxLength
// 		},
// 		name: {
// 				type: 'string'
// 		},
// 		users: {
// 			type: 'array'
// 		},
// 		dateCreated: {
// 			type: 'string',
// 			format: 'date-time'
// 		}
// 	},
// 	required: ['id', 'name', 'dateCreated']
// }