// import { addRxPlugin, RxCollection, RxDatabase, RxDocument, RxJsonSchema } from 'rxdb';
// import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
// import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
// import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
// import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
// import { createRxDatabase } from 'rxdb';
// import { ChatMemberProfile } from '@pushprotocol/restapi/src';

// addRxPlugin(RxDBUpdatePlugin);
// addRxPlugin(RxDBDevModePlugin);
// addRxPlugin(RxDBQueryBuilderPlugin);

// export class CacheDB {
// 	database: RxDatabase | undefined;
// 	channels: RxCollection | undefined;
//  messages: RxCollection | undefined;s
	
// 	async initCache(){
// 		this.database = await createRxDatabase({
// 			// name: 'cliqu3_cache_test_6',
//       name: 'cliqu3_cache_test_7',
// 			storage: getRxStorageDexie(),
// 			ignoreDuplicate: true
// 		});

// 		const collections = await this.database.addCollections({
// 			channels: {
// 				schema: channelSchema
// 			},
//       messages: {
//         schema: messageSchema
//       }
// 		});
    
// 		this.channels = collections.channels;
//     this.messages = collections.messages;

//   }

//   async addChannel(channel: Channel){
//     console.log("Inserting channel: ", channel.name)
//     try{
//       this.channels!.insert(channel)
//     }catch(err){
//       console.log("adding channel duplicate.. i think or error")
//     }
//   }

//   async fetchChannel(chatId: string){
//     try{
//       const channel = await this.channels!
//         .findOne()
//         .where('chatId')
//         .eq(chatId)
//         .exec();

//       return channel
//     }catch{

//     }
//   }

//   async updateLastReadMessageCid(chatId: string, lastReadMessageCid: string){
//     // const update = (channel: Channel) => {
//     //   channel.lastReadMessageCid = lastReadCid;
//     //   return channel;
//     // }
//     console.log("Updating last read message CID:: ", lastReadMessageCid)
//     const channel: RxDocument = await this.channels!
//       .findOne()
//       .where('chatId')
//       .eq(chatId)
//       .exec();

//     // channel.modify(update)
//     // await channel.patch({lastReadMessageCid: lastReadMessageCid})
//     // not working

    
//     const changeFunction = (oldData: any) => {
//       oldData.chatId = oldData.chatId
//       oldData.lastReadMessageCid = lastReadMessageCid;
//       oldData.name = oldData.name
//       oldData.users = oldData.users
//       return oldData;
//     }

//     console.log("UPDATING LAST READ MESSAGE CID:", channel)
//     await channel.modify(changeFunction);
//     console.log("UPDATed: ", channel)
//     // await channel.update({
//     //   $set: {
//     //     'lastReadMessageCid': lastReadMessageCid
//     //   }
//     // });
//   }

//   async fetchRecentMessages(chatId: string){
//     try{
//       const messages = await this.messages!
//         .find()
//         .where('chatId').eq(chatId)
//         // .sort({timestamp: 'asc'})
//         .sort({ timestamp: 'asc' })
//         .limit(50)
//         .exec();

//       // messages.map((message: any) => {
//       //   console.log("Message timestamp: " + message.timestamp)
//       // })
      
//       // return json obj instead of document
//       // const messa
//       // const queryObjectSort = messages.sort({'timestamp': 'asc'});
//       // const results = await queryObjectSort.exec();
//       // console.log("messages timestamp sorted: ", results)
//       // const plainMessages = messages.map(msg => (msg.toJSON ? msg.toJSON() : msg));
//       // console.log("RESULTS: ", results)

      
//       // These timestamps out of order
//       // 1742136737000
//       // 1742136741101
//       // 1742136744314
//       // 1742136749488
//       // 1742136975338
//       // 1742136976833
//       // 1742136977638
//       // 1742136978514
//       // 1742136979472

//       // 1742134246959
//       // 1742134997979


//       const plainMessages = messages.map(msg => (msg.toJSON ? msg.toJSON() : msg));
//       // console.log("PLAIN MESSAGES: " + JSON.stringify(plainMessages))
//       return plainMessages;
//     }catch(error){
//       console.error('Error fetching recent messages:', error);
//       throw error;
//     }
//   };

//   async appendMessage(message: Message): Promise<boolean>{
//     // console.log("This Messsages Type: " + typeof(this.messages))
//     // console.log("appending message: " + message.message.content)
//     // this.messages!.insert(message).then(doc => {
//     //   console.log('Message inserted:', doc);
//     //   return true
//     // }).catch(err => {
//     //   console.error("message exists")
//     //   // console.error('Error inserting message:', err);
//     //   return false
//     // });
//     // return false
//     try{
//       const doc = await this.messages!.insert(message);
//       console.log('Message inserted:', doc);
//       return true;  // Only return true after successful insertion
//     }catch (err) {
//       console.error("Message exists or error inserting message");
//       return false;  // Return false if insertion fails
//     }
//   }

//   async updateReactions(emoji: string, user: string, cid: string){
//     try {
//       // Fetch the message document
//       const messageDoc = await this.messages!.findOne().where('cid').eq(cid).exec();

//       if (messageDoc) {
//         // Get current reactions or initialize if not present
//         console.log("Updaing reactions for this doc: " + JSON.stringify(messageDoc))
//         const currentReactions = messageDoc.reactions || {};
//         const emojiReactions = currentReactions[emoji] || { count: 0, users: [] };

//         // Determine the updated emoji reactions
//         let updatedEmojiReactions;

//         if(emojiReactions.users.includes(user)){
//           // Remove user and decrease count
//           updatedEmojiReactions = {
//             count: emojiReactions.count - 1,
//             users: emojiReactions.users.filter((u: string) => u !== user)
//           };
//         }else{
//           // Add user and increase count
//           updatedEmojiReactions = {
//             count: emojiReactions.count + 1,
//             users: [...emojiReactions.users, user]
//           };
//         }

//         // Create an updated reactions object
//         const updatedReactions = {
//           ...currentReactions,
//           [emoji]: updatedEmojiReactions
//         };

//         // Log updated reactions for debugging
//         console.log('NEW Updated Reactions:', updatedReactions);

//         // issue with json object insertion
//         const cleanedReactions = JSON.parse(JSON.stringify(updatedReactions));

//         console.log('CLEANED:', cleanedReactions);

//         await messageDoc.update({
//           $set: {
//             'reactions': cleanedReactions,
//           },
//         })
//       } else {
//         console.error(`Message with cid ${cid} not found.`);
//       }
//     } catch (error) {
//       console.error('Error updating reactions:', error);
//     }
//   }

// }

// export interface Channel {
//   chatId: string;
//   name: string;
//   users: ChatMemberProfile[];
//   // unreadCount: number; // ADD THIS
//   lastReadMessageCid: string // ADD THIS TOO, if I want cache to save between sessions
// }

// const channelSchema: RxJsonSchema<Channel> = {
// 	version: 0,
// 	primaryKey: 'chatId',
// 	type: 'object',
// 	properties: {
//     chatId: { type: 'string', maxLength: 64 },
//     name: { type: 'string' },
//     users: { type: 'array' },
//     lastReadMessageCid: { type: 'string' },
//   },
// }

// export interface Message {
//   id: string,
//   chatId: string,
//   origin: string,
//   timestamp: number,
//   from: string,
//   // type: string,
//   // content: any,
//   message: Content | ReferenceContent
//   // reference: string,
//   group: boolean,
//   cid: string,
//   // readCount: number;
//   // lastAccessed: number;
//   reply: null | { messageBlip: string, reference: string }
//   reactions: {
//     [emoji: string]: {
//       count: number;
//       users: string[];
//     };
//   }
//   // reactions: {
//   //   [emoji: string]: Array<Reaction>
//   // }
// }

// export interface Reaction {
//   user: string,
//   cid: string,
//   reference: string
// }

// export interface Content {
//   type: string, 
//   content: string
// }

// export interface ReferenceContent {
//   type: string, 
//   content: { type: string, content: string }, 
//   reference: string
// }

// // const messageSchema: RxJsonSchema<Message> = {
// //   version: 0,
// //   primaryKey: 'cid',
// //   type: 'object',
// //   properties: {
// //     "id": { "type": "string" },
// //     "chatId": { type: 'string', maxLength: 64 },
// //     "cid": { type: 'string', maxLength: 64 },
// //     "origin": { type: 'string' },
// //     // timestamp: { type: 'number', maxLength: 13, multipleOf: 1, minimum: 0, maximum: 9999999999999 },
// //     "timestamp": {"type": "number", "minimum": 1700000000000, "maximum": 2000000000000, "multipleOf": 1 },
// //     from: { type: 'string' },
// //     group: { type: 'boolean' },
// //     message: {
// //       oneOf: [
// //         {
// //           type: 'string'
// //         },
// //         {
// //           type: 'object',
// //           properties: {
// //             type: { type: 'string' },
// //             content: { type: 'string' }
// //           },
// //           required: ['type', 'content']
// //         }
// //       ]
// //     },
// //     reply: {
// //       type: 'object',
// //       properties: {
// //         messageBlip: { type: 'string' }, 
// //         reference: { type: 'string' }
// //       }
// //     },
// //     reactions: {
// //       type: 'object',
// //       additionalProperties: {
// //         type: 'object',
// //         properties: {
// //           count: { type: 'number' },
// //           users: {
// //             type: 'array',
// //             items: { type: 'string' }
// //           }
// //         }
// //       }
// //     }
// //   },
// //   indexes: ['chatId', 'timestamp']
// // };

// const messageSchema: RxJsonSchema<Message> = {
//   "version": 0,
//   "primaryKey": "cid",
//   "type": "object",
//   "properties": {
//     "id": { "type": "string" },
//     "chatId": { "type": "string", "maxLength": 64 },
//     "cid": { "type": "string", "maxLength": 64 },
//     "origin": { "type": "string" },
//     "timestamp": { "type": "number", "minimum": 1700000000000, "maximum": 3000000000000, "multipleOf": 1 },
//     "from": { "type": "string" },
//     "group": { "type": "boolean" },
//     "message": {
//       "oneOf": [
//         {
//           "type": "string"
//         },
//         {
//           "type": "object",
//           "properties": {
//             "type": { "type": "string" },
//             "content": { "type": "string" }
//           },
//           "required": ["type", "content"]
//         }
//       ]
//     },
//     "reply": {
//       "type": "object",
//       "properties": {
//         "messageBlip": { "type": "string" },
//         "reference": { "type": "string" }
//       }
//     },
//     "reactions": {
//       "type": "object",
//       "additionalProperties": {
//         "type": "object",
//         "properties": {
//           "count": { "type": "number" },
//           "users": {
//             "type": "array",
//             "items": { "type": "string" }
//           }
//         }
//       }
//     }
//   },
//   "indexes": ["chatId", "timestamp"]
// };
