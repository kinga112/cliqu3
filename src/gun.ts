import Gun from 'gun/gun';
// import Sea from 'gun/sea'
import { v4 as uuid } from "uuid";
import { push } from './App';
import { chat, VideoPeerInfo } from '@pushprotocol/restapi/src';
import { GunServer, TextChannel, VoiceChannel } from './types/serverTypes';
import { useUserStore } from './state-management/store';
// import { data } from '@lens-protocol/react-web';

// export interface PeerInfo {
//   address: string, // Address of the caller (initiator)
//   signal: string, // Signal data required to establish a video call
//   meta: {
//     rules: {
//       access: {
//         type: "PUSH_CHAT",
//         data: {
//           chatId: string, // ChatId between the caller and the callee
//         }
//       }
//     }
//   }
// }

// export const gun = Gun('https://gun-manhattan.herokuapp.com/gun')
export const gun = Gun({
  // web: 'https://gun-manhattan.herokuapp.com/gun',
  // peers: [], // Empty array, new peers will auto-connect
  peers: [
    'https://gun-manhattan.herokuapp.com/gun',
  ],
  // file: "data",
  // localStorage: false,
  axe: true, // Enables automatic peer discovery
  multicast: true, // Helps local network nodes find each other
});

export async function createServer(name: string, description: string, picture: string){
  const setServerList = useUserStore.getState().setServerList;
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
  // const user = {
  //   address: push.user?.account.toLowerCase()!
  // }
  // const user = {
  //   address: push.user?.account.toLowerCase()!
  // }
  // gun.get('cliqu3-servers-test-db-3').get(randomId).get('users').set(user)
  
  const user = JSON.stringify([push.user?.account.toLowerCase()!])
  gun.get('cliqu3-servers-test-db-3').get(randomId).get('users').put(user)

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

  console.log("USER: ", creatorAddress)
  
  gun.get('cliqu3-users-test-db-2').get(creatorAddress).get('serverList').once((serverListJson: string) => {
    // console.log("THE UPDATE PEER INFO DATA: ", typeof(data))
    console.log("Updating SERVER LIST ", serverListJson)
    const serverList: string[] = JSON.parse(serverListJson)
    serverList.unshift(randomId)
    gun.get('cliqu3-users-test-db-2').get(creatorAddress).get('serverList').put(JSON.stringify(serverList))
    console.log("NEW ID:", randomId)
    console.log("Updated SERVER LIST ", serverList)
    setServerList(serverList)
  })
}

export async function createUser(address: string){
  console.log("CREATING USER IN GUN DB")
  // gun.get('cliqu3-users-test-db-2').get('users').put(address).once(() => {
  //   gun.get('cliqu3-users-test-db-2').get('users').get(address).get('serverList').put('[]')
  // })
  gun.get('cliqu3-users-test-db-2').get(address).get('serverList').put('[]')
  // gun.get('cliqu3-users-test-db-2').get('users').get(address).once((user1) => {
  //   console.log("USER AFTER PUT: ", user1)
  // })
  console.log("AFTER USER CREATE")
}

export async function updatePeerInfo(serverId: string, chatId: string, peerInfo: VideoPeerInfo | null){
  console.log("UPDATE PEER INFO")
  // const voiceChannels = gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels')
  // console.log("VOICE CHANNELS:", voiceChannels)

  // gun.get('cliqu3-servers-test-db-3').get(server.id).get('users').put(users)
  // voiceChannels

  
  gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').once((voiceChannelsJson: string) => {
    console.log("THE UPDATE PEER INFO DATA: ", voiceChannelsJson)
    const voiceChannels: VoiceChannel[] = JSON.parse(voiceChannelsJson)
    let temp: VoiceChannel[] = []
    // let tempVoiceChannels = voiceChannels
    voiceChannels.map((voiceChannel: VoiceChannel, index: number) => {
      // let temp: VoiceChannel = {
      //   name: voiceChannel.name,
      //   chatId: voiceChannel.chatId,
      //   peerInfo: null
      // }
      if(voiceChannel.chatId == chatId){
        console.log("UPDATING VOICE CHANNEL PEER INFO: ", peerInfo)
        // temp.peerInfo = peerInfo
        temp.push({
          name: voiceChannel.name,
          chatId: voiceChannel.chatId,
          peerInfo: peerInfo
        })
      }else{
        temp.push({
          name: voiceChannel.name,
          chatId: voiceChannel.chatId,
          peerInfo: null
        })
      }
    })

    gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').put(JSON.stringify(temp))
  })

  gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').once((voiceChannelsJson: string) => {
    // console.log("THE UPDATE PEER INFO DATA: ", typeof(data))
    const voiceChannels: VoiceChannel[] = JSON.parse(voiceChannelsJson)
    console.log("THE UPDATE PEER INFO DATA 2: ", voiceChannels)
  })



  // gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').map((voiceChannel: VoiceChannel) => {
  //   console.log("Voice CHannels inside update peer into: ", voiceChannel)
  //   let temp: VoiceChannel = {
  //     name: voiceChannel.name,
  //     chatId: voiceChannel.name,
  //     peerInfo: null
  //   }
  //   if(voiceChannel.chatId == chatId){
  //     temp.peerInfo = peerInfo
  //   }
  //   gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').set(temp)

  //   gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').once((data: any) => {
  //     console.log("THE UPDATE PEER INFO DATA: ", data)
  //   })
    
  // });
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
  const setServerList = useUserStore.getState().setServerList;
  const user = push.user!.account.toLowerCase()
  const users: String[] = JSON.parse(server.users)
  const textChannels: TextChannel[] = JSON.parse(server.textChannels!)
  const voiceChannels: VoiceChannel[] = JSON.parse(server.voiceChannels!)
  
  users.push(user)
  gun.get('cliqu3-servers-test-db-3').get(server.id).get('users').put(users)

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

  // gun.get('cliqu3-users-test-db-2').get(user).get('serverList').once((serverListJson: string) => {
  //   // console.log("THE UPDATE PEER INFO DATA: ", typeof(data))
  //   console.log("Updating SERVER LIST after join:", serverListJson)
  //   const serverList: string[] = JSON.parse(serverListJson)
  //   serverList.unshift(server.id)
  //   gun.get('cliqu3-users-test-db-2').get(user).get('serverList').put(JSON.stringify(serverList))
  //   console.log("Updated SERVER LIST after join:", serverList)
  //   setServerList(serverList)
  // })

  gun.get('cliqu3-users-test-db-2').get(user).get('serverList').once((serverListJson: string) => {
    // console.log("THE UPDATE PEER INFO DATA: ", typeof(data))
    console.log("Updating SERVER LIST ", serverListJson)
    const serverList: string[] = JSON.parse(serverListJson)
    serverList.unshift(server.id)
    gun.get('cliqu3-users-test-db-2').get(user).get('serverList').put(JSON.stringify(serverList))
    console.log("NEW ID:", server.id)
    console.log("Updated SERVER LIST ", serverList)
    setServerList(serverList)
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

// export async function fetchUserServers(address: string): Promise<String[]>{
//   gun.get('cliqu3-servers-user-db-1').get(address).get('voiceChannels').once((userServersJson: string) => {
//     const userServers = JSON.parse(userServersJson)
//     return userServers
//   })
//   return ['']
// }
