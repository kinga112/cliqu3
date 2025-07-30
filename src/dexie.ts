import Dexie, { Table } from 'dexie';
import { Message } from './types/messageTypes';
import { Channel } from './types/serverTypes';
import { timestamp } from 'rxjs';

export class CacheDB2 extends Dexie {
  messages!: Table<Message>; // Primary key is 'cid'
  channels!: Table<Channel>; // Primary key is 'chatId'

  constructor() {
      super("Cliqu3Cache");
      this.version(1).stores({
          messages: "cid, chatId, timestamp, [chatId+timestamp], [cid]",
          channels: "chatId, name, lastReadMessageCid, [chatId]"
      });
  }

  async fetchRecentMessages(chatId: string){
    // const recentMessages = await this.messages
    //   .where('chatId')
    //   .equals(chatId)
    //   .orderBy('timestamp')
    //   .sortBy('timestamp')
    // console.log("DATE NOW: ", Date.now())

    // const recentMessages = await this.messages
    //   .where('[chatId+timestamp]')
    //   .between([chatId, Dexie.minKey], [chatId, Dexie.maxKey])
    //   // .between([chatId, 1552680709198], [chatId, Date.now()])
    //   .limit(50)
    //   .toArray();

    const recentMessages = await this.messages
      .where('[chatId+timestamp]')
      .between([chatId, Dexie.minKey], [chatId, Dexie.maxKey])
      .reverse()
      .limit(50)
      .toArray();

      // await db.yourTable
      // .where('[id+timestamp]')
      // .between([targetId, targetTimestamp], [targetId, targetTimestamp])
      // .toArray();

    console.log("FETCH RECENT MESSAGES: ", recentMessages)
    return recentMessages.reverse()
  }

  async fetchChannel(chatId: string){
    const channel = await this.channels
      .where('chatId')
      .equals(chatId)
      .first()

    // add error if fails
    // if(channel){
    //   return channel
    // }else{
    //   return {  }
    // }

    return channel!
  }

  async addChannel(channel: Channel){
    // console.log("Inserting channel: ", channel.name)
    try{
      const result = await this.channels.add(channel)
      console.log("ADD CHANNEL RESULT: ", result)
    }catch(error){
      // console.log("ADD CHANNEL ERROR: ", error)
    }
  }

  async addMessage(message: Message): Promise<boolean>{
    try{
      const doc = await this.messages.add(message);
      console.log('Message inserted:', doc);
      return true;  // Only return true after successful insertion
    }catch (error) {
      // console.error("add message error", error);
      return false;  // Return false if insertion fails
    }
  }

  async updateReactions(emoji: string, user: string, cid: string){
    console.log("UPDATE REACTIONS FUNCTION")
    const messageDoc = await this.messages.where("cid").equals(cid).first();
    console.log("MESSAGE DOC: ", messageDoc)
    if(messageDoc){
      const reactions = messageDoc.reactions
      // console.log("current reactions DOC BEFORE: ", reactions)
      if(reactions[emoji]){
        if(reactions[emoji].users.includes(user)){
          reactions[emoji].count = reactions[emoji].count - 1
          reactions[emoji].users = reactions[emoji].users.filter(u => u !== user);
        }else{
          reactions[emoji].users.join(user)
        }
      }else{
        reactions[emoji] =  { count: 1, users: [user] }
      }
      // console.log("current reactions DOC AFTER: ", reactions)
      const result = await this.messages.where("cid").equals(cid).modify({reactions: reactions});
      console.log("RESULT OF UPDATE REACTIONS: ", result)
    }
    // }
    // await this.messages.where("cid").equals(cid).modify((message) => {
    //   if (!message.reactions) {
    //       message.reactions = {};
    //   }
    //   if (!message.reactions[emoji]) {
    //       message.reactions[emoji] = { count: 0, users: [] };
    //   }

    //   const users = message.reactions[emoji].users;
    //   const userIndex = users.indexOf(user);

    //   if (userIndex === -1) {
    //       // User hasn't reacted with this emoji, add them
    //       users.push(user);
    //       message.reactions[emoji].count += 1;
    //   } else {
    //       // User already reacted, remove them
    //       users.splice(userIndex, 1);
    //       message.reactions[emoji].count -= 1;

    //       // If no users left, remove the emoji reaction
    //       if (message.reactions[emoji].count === 0) {
    //           delete message.reactions[emoji];
    //       }
    //   }
    // });
  }

  async updateLastReadMessageCid(chatId: string, lastReadMessageCid: string){
    // const result = await this.channels.where("chatId").equals(chatId).modify({lastReadMessageCid: lastReadMessageCid})
    console.log("Updaing last read message cid for channel: " + chatId + ", cid: " + lastReadMessageCid)
    const result = await this.channels.update(chatId, {lastReadMessageCid: lastReadMessageCid})
    console.log("RESULT OF UPDATE LAST READ MESSAGE CID: ", result)
  }


  async fetchOlderMessages(chatId: string, timestamp: number){
    // console.log("fetching Older Messages 2 cid: ", cid)
    const olderMessages = await this.messages
      .where('[chatId+timestamp]')
      .between([chatId, Dexie.minKey], [chatId, timestamp], true, false) // include lower, exclude upper
      .reverse()
      .limit(50)
      .toArray();

    console.log("resut old messages:", olderMessages)
    // console.log("COLD CID: ", olderMessages[0])
    // console.log("CID: ", cid)
    if(olderMessages[0]){
      return olderMessages.reverse();
    }else{
      return [];
    }
  }
}

export const cache2 = new CacheDB2();
