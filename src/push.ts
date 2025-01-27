// Import Push SDK & Ethers
// import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import { _db } from './screens/globalState';
import { RxDocument } from 'rxdb';
// import { peer, rxdb } from './App';
import { CONSTANTS, PushAPI, SignerType } from '@pushprotocol/restapi/src';
import { Msg, useServerStore, useUserStore } from './state-management/store';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
// import { ServersDB, Server } from './peerbit';
import { gun, TextChannel, VoiceChannel } from './gun';

// const signer = ethers.Wallet.createRandom();

// Initialize wallet user
// 'CONSTANTS.ENV.PROD' -> mainnet apps | 'CONSTANTS.ENV.STAGING' -> testnet apps
// const userAlice = await PushAPI.initialize(signer, {
//   env: CONSTANTS.ENV.STAGING,
// });


export class Push {
  user: PushAPI | undefined;

  async signIn(user: PushAPI){
    this.user = user
    console.log("USER ACOUNT: " + this.user.account)
  }
  // async initUser(signer: ethers.Wallet){
  async initUser(signer: ethers.Wallet | ethers.providers.JsonRpcSigner){
    // const signer = ethers.Wallet.fromMnemonic("stadium chase abuse leg monitor uncle pledge category flip luxury antenna extra", "m/44'/60'/0'/0/0")
    // const signer = ethers.Wallet.fromMnemonic("stem still jacket screen skill hip ice impulse wasp dice kidney border", "m/44'/60'/0'/0/0")
    // console.log("init user: " + JSON.stringify(signer.mnemonic))
    // let newSigner: SignerType;
    // newSigner = ethersV5SignerType
    this.user = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.STAGING,
    });
    // console.log("THIS USER: " + this.user.account)
    // console.log("USER PROFILE: yeah : " + JSON.stringify(userProfile))

  }

  // async createChatChannel(serverId: string, name: string, description: string, image: string, userAddresses: Array<string>, chat:boolean=false, voice: boolean=false){
  //   console.log("CREATING NEW CHAT CHANNEL", this.user!.account)
  //   const newChatChannel = await this.user!.chat.group.create(
  //     name, {
  //       description: description,
  //       // image: image,
  //       image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
  //       members: userAddresses,
  //       admins: [],
  //       private: false,
  //       rules: {
  //         entry: { conditions: [] },
  //         chat: { conditions: [] },
  //       },
  //     },
  //   );

  //   console.log("INFO: " + JSON.stringify(newChatChannel))

  //   // add new server this way or return newChatChannel then update servers doc
  //   // const rxdb: any = _db.value;
  //   console.log('db: ' + rxdb.database!.name)

  //   // const doc: RxDocument = await rxdb!.servers!.find({
  //   //   selector: {
  //   //     id: {
  //   //       $eq: serverId
  //   //     }
  //   //   }
  //   // }).exec();
  //   // const doc: RxDocument = await rxdb!.servers!.findOne().where('id').eq(serverId).exec();
  //   // cons
  //   const doc: RxDocument = await rxdb.servers!.findOne().where('id').eq(serverId).exec();
  //                             // props.db.servers!.findOne().where('id').eq(props.serverId).exec()
  //   console.log("DOC CREATE::: " + JSON.stringify(doc))
  //   // console.log("CHAT ID: " + newChatChannel.chatId)

  //   const success = await doc.update({
  //     $push: {
  //       chatChannels: newChatChannel.chatId
  //     },
  //   })

  //   // const doc1: RxDocument = await rxdb.servers!.findOne().where('id').eq(serverId).exec();
  //   // props.db.servers!.findOne().where('id').eq(props.serverId).exec()
  //   // console.log("DOC: " + JSON.stringify(doc1))

  //   console.log("CREATED NEW CHAT CHANNEL??? : " + JSON.stringify(success))

  //   // await rxdb!.servers!.update({
  //   //   $push: {
  //   //     chatChannel: newChatChannel.chatId
  //   //   },
  //   // });

  //   return newChatChannel.chatId
  // };

  async createChannel(serverId: string, name: string, description: string, image: string, userAddresses: Array<string>, chat: boolean=false, voice: boolean=false){
    console.log("CREATING NEW CHAT CHANNEL", this.user!.account)
    const newChannel = await this.user!.chat.group.create(
      name, {
        description: description,
        // image: image,
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
        members: userAddresses,
        admins: [],
        private: false,
        rules: {
          entry: { conditions: [] },
          chat: { conditions: [] },
        },
      },
    );

    console.log("INFO: " + JSON.stringify(newChannel))

    // add new server this way or return newChatChannel then update servers doc
    // const rxdb: any = _db.value;
    // console.log('db: ' + rxdb.database!.name)
    // const db = ServersDB

    // const server = await peer

    // const doc: RxDocument = await rxdb!.servers!.find({
    //   selector: {
    //     id: {
    //       $eq: serverId
    //     }
    //   }
    // }).exec();
    // const doc: RxDocument = await rxdb!.servers!.findOne().where('id').eq(serverId).exec();
    // cons
    // const doc: RxDocument = await rxdb.servers!.findOne().where('id').eq(serverId).exec();
                              // props.db.servers!.findOne().where('id').eq(props.serverId).exec()
    // console.log("DOC CREATE::: " + JSON.stringify(doc))
    // console.log("CHAT ID: " + newChatChannel.chatId)
    // let success: RxDocument<{}, {}, unknown>

    
    // const store = await peer.open(new ServersDB());
    // const responses: Server[] = await store.servers.index.search(
    //   new SearchRequest({
    //       query: [
    //         new StringMatch({
    //           key: 'id',
    //           value: serverId,
    //           method: StringMatchMethod.contains,
    //         }),
    //       ],
    //   }),
    //   {
    //       local: true,
    //       remote: true,
    //   },
    // );

    // console.log("PEER BIT RESPONSE QUERY: " + JSON.stringify(responses))

    if(chat){
      // change channels back to json format
      const textChannel: TextChannel = {
        name: newChannel.groupName, 
        chatId: newChannel.chatId
      }
      // gun.get('cliqu3-servers-test-db-3').get(serverId).get('textChannels').set(textChannel)
      // const textChannels = JSON.parse()
      let textChannels: TextChannel[] = []
      gun.get('cliqu3-servers-test-db-3').get(serverId).get('textChannels').once((data: string ) => {
        console.log("Text Channels Data String: ", data)
        textChannels = JSON.parse(data)
      })
      textChannels.push(textChannel)
      gun.get('cliqu3-servers-test-db-3').get(serverId).get('textChannels').put(JSON.stringify(textChannels))
      gun.get('cliqu3-servers-test-db-3').get(serverId).get('textChannels').on(function(data, key){
        // {property: 'value'}, 'key'
        console.log("GUN DATA TC: " + JSON.stringify(data))
        console.log("GUN KEY: " + key)
      })
      // const server = responses[0]
      // console.log("SERVER: " + JSON.stringify(server))
      // server.textChannels.push(newChannel.chatId)
      // store.servers.put(server)
      
      // success = await doc.update({
      //   $push: {
      //     chatChannels: newChannel.chatId
      //   },
      // })
      // console.log("CREATED NEW CHAT CHANNEL??? : " + JSON.stringify(success))
    }
    if(voice){
      const voiceChannel: VoiceChannel = {
        name: newChannel.groupName, 
        chatId: newChannel.chatId, 
        peerInfo: ''
      }
      // gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').set(voiceChannel)
      let voiceChannels: TextChannel[] = []
      gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').once((data: string ) => {
        console.log("Voice Channels Data String: ", data)
        voiceChannels = JSON.parse(data)
      })
      voiceChannels.push(voiceChannel)
      gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').put(JSON.stringify(voiceChannels))
      gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').on(function(data, key){
        // {property: 'value'}, 'key'
        console.log("GUN DATA: " + JSON.stringify(data))
        console.log("GUN KEY: " + key)
      })
      gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').on(function(data, key){
        // {property: 'value'}, 'key'
        console.log("GUN DATA VC: " + JSON.stringify(data))
        console.log("GUN KEY: " + key)
      })

      // const server = responses[0]
      // console.log("SERVER: " + JSON.stringify(server))
      // const voiceChannel = {chatId: newChannel.chatId, peerInfo: ''}
      // server.voiceChannels.push(voiceChannel)
      // store.servers.put(server)


      // success = await doc.update({
      //   $push: {
      //     voiceChannels: {"chatId": newChannel.chatId, "peerInfo": ''}
      //   },
      // })
      // console.log("CREATED NEW VOICE CHANNEL??? : " + JSON.stringify(success))
    }

    // const doc1: RxDocument = await rxdb.servers!.findOne().where('id').eq(serverId).exec();
    // props.db.servers!.findOne().where('id').eq(props.serverId).exec()
    // console.log("DOC: " + JSON.stringify(doc1))

    // await rxdb!.servers!.update({
    //   $push: {
    //     chatChannel: newChatChannel.chatId
    //   },
    // });

    return newChannel.chatId
  };

  async sendMessage(message: string, chatId: string){
    console.log('Sending message from: ' + this.user!.account);
  
    const msg = await this.user!.chat.send(chatId, {
      content: message,
      type: 'Text',
      // type: 'Reply',
    });
    
    return msg.cid
  }

  async fetchChats(){
    const chats = await this.user!.chat.list('CHATS');
    console.log("CHATS: " + chats)
  }
}