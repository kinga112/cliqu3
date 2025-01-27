import Gun from 'gun/gun';
// import Sea from 'gun/sea'
import { v4 as uuid } from "uuid";
import { push } from './App';
// import { data } from '@lens-protocol/react-web';

export interface VoiceChannel {
  name: string
  chatId: string
  peerInfo: string
}

export interface TextChannel {
  name: string
  chatId: string
}


// Server type stored in Gun DB
export interface GunServer {
  id: string
  name: string
  description: string
  picture: string
  creator: string
  users: string
  textChannels?: string
  voiceChannels?: string
}


export const gun = Gun('https://gun-manhattan.herokuapp.com/gun')

export async function createServer(name: string, description: string, picture: string){
  const randomId = uuid()
  const creatorAddress = push.user?.account.toLowerCase()!
  const newServer: GunServer = {
    id: randomId,
    name: name,
    description: description,
    picture: picture,
    creator: creatorAddress,
    users: JSON.stringify([creatorAddress]),
    // users: JSON.stringify([push.user?.account.toLowerCase()!]),
    // users: JSON.stringify(['Test User 1']),
    // textChannels:  JSON.stringify([]),
    // voiceChannels:  JSON.stringify([])
  }

  // const pair = await Gun.SEA.pair();
  // const enc = Gun.SEA.encrypt(newServer, pair);
  // const data = await Gun.SEA.sign(enc, pair);

  // gun.get(randomId).put(data)
  // gun.put(randomId)
  // gun.get(randomId).put(newServer)
  gun.get('cliqu3-servers-test-db-3').get(randomId).put(newServer)

  // const userInfo = await push.user?.info()
  const user = {
    address: push.user?.account.toLowerCase()!
  }

  gun.get('cliqu3-servers-test-db-3').get(randomId).get('users').set(user)

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

  // gun.get('cliqu3-servers-test-db-3').get(randomId).on(function(data, key){
  //   // {property: 'value'}, 'key'
  //   console.log("GUN DATA: " + JSON.stringify(data))
  //   console.log("GUN KEY: " + key)
  // })
}

export async function updatePeerInfo(serverId: string, chatId: string, peerInfo: string){
  gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').map((voiceChannel) => {
    if(voiceChannel.chatId == chatId){
      voiceChannel.peerInfo = peerInfo
    }
    gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').set(voiceChannel)
  });
}

export async function getServer(serverId: string) {
  // gun.get('cliqu3-servers-test-db-3').once((serverList, key) => {
  //   // console.log()
  //   console.log('THIS IS THE SERVER: ', server)
  //   let foundServer:  Server | null = null
  //   if(server.id == serverId){
  //     foundServer = {
  //       id: server.id,
  //       name: server.name,
  //       users: server.users,
  //       textChannels: server.textChannels,
  //       voiceChannels: server.voiceChannels
  //     }
  //   }
  //   return foundServer
  // })
  gun.get('cliqu3-servers-test-db-3').get(serverId).once((server, key) => {
    console.log('THIS IS THE SERVER: ', server)
    // let foundServer:  Server | null = null
    // if(server){
    //       foundServer = {
    //         id: server.id,
    //         name: server.name,
    //         users: server.users,
    //         textChannels: server.textChannels,
    //         voiceChannels: server.voiceChannels
    //       }
    //     }
    //     return foundServer
    if(server){
      return server
    }else{
      return null
    }
  })
  // console.log("returning null")
  // return null
}

export async function joinServer(server: GunServer){
  console.log("JOIN SERVER: ", server)
  // const users: string[] = JSON.parse(server.users)
  const textChannels: TextChannel[] = JSON.parse(server.textChannels!)
  const voiceChannels: VoiceChannel[] = JSON.parse(server.voiceChannels!)
  // users.push(push.user!.account)
  
  textChannels.map((textChannel) => {
    push.user?.chat.group.join(textChannel.chatId).then((groupInfo) => {
      console.log("Joining textChannel: ", groupInfo.groupName)
    }).catch((error) => {
      console.log("Error Joining textChannel: ", textChannel.chatId, error)
    })
  })
  
  voiceChannels.map((voiceChannel) => {
    push.user?.chat.group.join(voiceChannel.chatId).then((groupInfo) => {
      console.log("Joining voiceChannel: ", groupInfo.groupName)
    }).catch((error) => {
      console.log("Error Joining voiceChannel: ", voiceChannel.chatId, error)
    })
  })
  
  // gun.get('cliqu3-servers-test-db-3').once((svr, key) => {
  //   // console.log()
  //   console.log('THIS IS THE SERVER: ', svr)
  //   let foundServer:  Server | null = null
  //   if(svr == server){
  //     foundServer = {
  //       id: server.id,
  //       name: server.name,
  //       users: 'test test'
  //       // users: JSON.stringify(JSON.parse(server.users).push(user))
  //     }
  //   }
  //   return foundServer
  // })
}