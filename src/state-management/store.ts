import { useProfile } from '@lens-protocol/api-bindings'
import { ChatMemberProfile, CONSTANTS, TYPES, UserProfile, VideoPeerInfo } from '@pushprotocol/restapi/src'
import { VideoV2 } from '@pushprotocol/restapi/src/lib/video/VideoV2'
import { create } from 'zustand'
import { Message } from '../cache'
import { TextChannel, VoiceChannel } from '../gun'
import { PushStream } from '@pushprotocol/restapi/src/lib/pushstream/PushStream'

export type Msg = {
  id: string
  cid: string // reference id
  origin: string
  timestamp: number
  chatId: string
  from: string
  message: {type: string, content: string} | {type: string, content: {type: string, content: string}, reference: string}
  meta: {group: boolean}
  messageContent: string
  reactions: Array<Reaction>
  reply: Reply | null
}

export type Reply = {
  messageBlip: string,
  reference: string
}

export type Reaction = {
  emoji: string,
  count: number,
  users: Array<string>
}

export type Server = {
  name: string
  serverId: string
  creator: string
  description: string
  picture: string
  currentChatChannel: {name: string, chatId: string}
  // newChatChannel: {name: string, chatId: string}
  // chatChannels: Array<any>
  chatChannels: TextChannel[]
  voiceChannels: VoiceChannel[]
  // messages: Array<Msg>
  messages: Array<Message>
  reply: Reply
  files: Array<any>
  currentVoiceChannel: string
  users: {admins: Array<ChatMemberProfile>, members: Array<ChatMemberProfile>}
  // userProfiles: Map<string, UserProfile>
  userProfiles: any // easier to search for user: structure: {'address': <Profile>}
  stream: PushStream | undefined
  // videoStreamData: TYPES.VIDEO.DATA
  // call: null | VideoV2
  // videoPeerInfo: null | VideoPeerInfo
  // testCall: null | Call
}

type Action = {
  // setVideoPeerInfo: (videoPeerInfo: VideoPeerInfo) => void
  // setCall: (call: VideoV2) => void
  // setVideoStreamData: (videoStreamData: TYPES.VIDEO.DATA) => void
  setUserProfiles: (userProfiles: Server['userProfiles']) => void
  setUsers: (users: Server['users']) => void
  setCurrentVoiceChannel: (name: Server['currentVoiceChannel']) => void
  setName:(name: Server['name']) => void
  setReply: (reply: Reply) => void
  setFiles: (files: Array<any>) => void
  setStream: (stream: PushStream | undefined) => void
  appendFile: (file: any) => void
  setServerId:(serverId: Server['serverId']) => void
  setCreator:(serverId: Server['creator']) => void
  setPicture:(picture: Server['picture']) => void
  setDescription:(serverId: Server['description']) => void
  setCurrentChatChannel:(currentChatId: Server['currentChatChannel']) => void
  setChatChannels:(chatChannels: TextChannel[]) => void
  appendChatChannel: (chatChannel: {name: string, chatId: string}) => void
  setVoiceChannels:(voiceChannels: VoiceChannel[]) => void
  appendVoiceChannel: (voiceChannel: VoiceChannel) => void
  setMessages: (messages: Server['messages']) => void
  clearMessages: () => void
  // appendMessage: (message: Msg) => void
  appendMessage: (message: Message) => void
  addReferenceId: (id: string, cid: string) => void
  // addReaction: (emoji: string, users: Array<string>, cid: string) => void
  addOrRemoveReaction: (emoji: string, user: string, cid: string) => void
  // addReaction: (emoji: string, user: string, cid: string) => void
  incrementReactionCount: (emoji: string, users: Array<string>, cid: string) => void
  decrementReactionCount: (emoji: string, users: Array<string>, cid: string) => void
}

// Create your store, which includes both state and (optionally) actions
export const useServerStore = create<Server & Action>((set) => ({
  name: '',
  serverId: '',
  currentChatChannel: {name: '', chatId: ''},
  creator: '',
  picture: '',
  description: '',
  // newChatChannel: {name: '', chatId: ''},
  chatChannels: [],
  voiceChannels: [],
  reactions: {'': ''},
  messages: [],
  reply: {reference: '', messageBlip: ''},
  files: [],
  videoStreamData: CONSTANTS.VIDEO.INITIAL_DATA,
  call: null,
  videoPeerInfo: null,
  currentVoiceChannel: '',
  users: {admins: [], members: []},
  userProfiles: {},
  stream: undefined,
  setUserProfiles: (userProfiles: any) => set(() => ({userProfiles: userProfiles})),
  // testCall: {video: null, peerInfo: null, stream: CONSTANTS.VIDEO.INITIAL_DATA, users: []},
  // setCall: (call: VideoV2) => set(() => ({call: call})),
  // setVideoPeerInfo: (videoPeerInfo: VideoPeerInfo) => set(() => ({videoPeerInfo: videoPeerInfo})),
  // setVideoStreamData: (videoStreamData: TYPES.VIDEO.DATA) => set(() => ({videoStreamData: videoStreamData})),
  // {...server.testCall, video: video}
  // setCall: (video: VideoV2) => set((server: Server) => ({testCall: {video: video, peerInfo: server.testCall?.peerInfo, stream: server.testCall?.stream, users: server.testCall?.users}})),
  // setVideoPeerInfo: (peerInfo: VideoPeerInfo) => set((server: Server) => ({testCall: {...server.testCall, peerInfo: peerInfo}})),
  // setVideoStreamData: (stream: TYPES.VIDEO.DATA) => set((server: Server) => ({testCall: {...server.testCall, stream: stream}})),
  setUsers: (users: {admins: Array<ChatMemberProfile>, members: Array<ChatMemberProfile>}) => set(() => ({users: users})),
  setCurrentVoiceChannel: (chatId: string) => set(() => ({currentVoiceChannel: chatId})),
  setReply: (reply: Reply) => set(() => ({reply: reply})),
  setName: (name: string) => set(() => ({name: name})),
  setServerId: (id: string) => set(() => ({serverId: id})),
  setCreator: (creator: string) => set(() => ({creator: creator})),
  setPicture: (picture: string) => set(() => ({picture: picture})),
  setDescription: (description: string) => set(() => ({description: description})),
  // setServer: (server: Server) => set(() => ({serverId: id})),
  setCurrentChatChannel: (channel: {name: string, chatId: string}) => set(() => ({currentChatChannel: channel})),
  setChatChannels: (channels: Array<any>) => set(() => ({chatChannels: channels})),
  setStream: (stream: PushStream | undefined) => set(() => ({stream: stream})),
  appendChatChannel: (channel: {name: string, chatId: string}) => set((server: Server) => ({chatChannels: [...server.chatChannels, channel]})),
  setVoiceChannels: (channels: VoiceChannel[]) => set(() => ({voiceChannels: channels})),
  appendVoiceChannel: (channel: VoiceChannel) => set((server: Server) => ({voiceChannels: [...server.voiceChannels, channel]})),
  // setMessages: (messages: Msg[]) => set(() => ({messages: messages})),
  clearMessages: () => set(() => ({messages: []})),
  setFiles: (files: Array<any>) => set(() => ({files: files})),
  appendFile: (file: any) => set((server: Server) => ({files: [...server.files, file]})),
  // setMessages: (messages: Msg[]) => set((server: Server) => ({messages: [...server.messages, ...messages]})),
  // setMessages: (messages: Message[]) => set((server: Server) => ({messages: [...server.messages, ...messages]})),
  setMessages: (messages: Message[]) => set(() => ({messages: messages})),
  appendMessage: (message: Message) => set((server: Server) => ({messages: [...server.messages, message]})),
  // appendMessage: (message: Message) =>
  //   set((server: Server) => ({
  //     messages: server.messages ? [...server.messages, message] : [message]
  //   })),
  // appendMessage: (message: Msg) => set((server: Server) => ({messages: [message, ...server.messages]})),
  addReferenceId: (id: string, cid: string) => set((server: Server) => ({
    messages: server.messages.map((msg: Message) =>
      msg.id === id ? { ...msg, cid: cid } : msg
    )
  })),
  // incrementReactionCount:  (emoji: string, users: Array<string>, cid: string) => set((server: Server) => ({messages: server.messages.map()})),
  // decrementReactionCount:  (emoji: string, users: Array<string>, cid: string) => set((server: Server) => ({})),

  // incrementReactionCount: (emoji: string, users: Array<string>, cid: string) => set((server: Server) => ({
  //   messages: server.messages.map((msg: Message) =>
  //     msg.cid === cid ? {...msg, reactions: msg.reactions[emoji].count + 1}
  // )),

  incrementReactionCount: (emoji: string, users: Array<string>, cid: string) => set((server: Server) => ({
    messages: server.messages.map((msg: Message) =>
      msg.cid === cid ? {...msg, reactions: {...msg.reactions, [emoji]: {count: msg.reactions[emoji].count + 1, users: users}}} : msg
    )
  })),
  // incrementReactionCount: (emoji: string, users: string[], cid: string) => set((server: Server) => ({
  //   messages: server.messages.map((msg: Message) =>
  //     msg.cid === cid 
  //       ? {
  //           ...msg,
  //           reactions: {
  //             ...msg.reactions,
  //             [emoji]: {
  //               count: (msg.reactions[emoji]?.count || 0) + 1,
  //               users: [...msg.reactions[emoji]?.users || [], ...users],
  //             }
  //           }
  //         }
  //       : msg
  //   )
  // })), 
  // incrementReactionCount: (emoji: string, users: string[], cid: string) => set((server: Server) => ({
  //   messages: server.messages.map((msg: Message) =>
  //     msg.cid == cid
  //       ? { 
  //         ...msg, 
  //         reactions: {
  //           ...msg.reactions, 
  //           [emoji]: {
  //             count: (msg.reactions[emoji]?.count || 0) + 1,
  //             users: users,
  //           }
  //         } 
  //       } : msg
  //   ),
  // })),
  decrementReactionCount: (emoji: string, users: string[], cid: string) => set((server: Server) => ({
    messages: server.messages.map((msg: Message) =>
      msg.cid == cid 
        ? {
            ...msg,
            reactions: {
              ...msg.reactions,
              emoji: {
                count: msg.reactions[emoji]?.count  - 1,
                users: users,
              }
            }
          }
        : msg
    )
  })), 

  // incrementReactionCount: (emoji: string, users: Array<string>, cid: string) => set((server: Server) => ({
  //   messages: server.messages.map((msg: Msg) =>
  //     msg.cid === cid ? {...msg, reactions: msg.reactions.map((reaction: Reaction) =>
  //       reaction.emoji === emoji ? { ...reaction, count: reaction.count + 1, users: users } : reaction
  //     )} : msg
  //   )
  // })),
  // incrementReactionCount: (emoji: string, users: Array<string>, cid: string) => 
  //   set((server: Server) => {
  //     const updatedMessages = server.messages.map((msg: Msg) => {
  //       if (msg.cid !== cid) return msg;
  
  //       const updatedReactions = msg.reactions.map((reaction: Reaction) => {
  //         if (reaction.emoji !== emoji) return reaction;
  
  //         return {
  //           ...reaction,
  //           count: reaction.count + 1,
  //           users,
  //         };
  //       });
  
  //       return { ...msg, reactions: updatedReactions };
  //     });
  
  //     return { messages: updatedMessages };
  //   }),
  // decrementReactionCount: (emoji: string, users: Array<string>, cid: string) => set((server: Server) => ({
  //   messages: server.messages.map((msg: Msg) =>
  //     msg.cid === cid ? {...msg, reactions: msg.reactions.map((reaction: Reaction) =>
  //       reaction.emoji === emoji ? { ...reaction, count: reaction.count - 1, users: users } : reaction
  //     )} : msg
  //   )
  // })),
  // decrementReactionCount: (emoji: string, users: Array<string>, cid: string) => 
  //   set((server: Server) => {
  //     const updatedMessages = server.messages.map((msg: Msg) => {
  //       if (msg.cid !== cid) return msg;
  
  //       const updatedReactions = msg.reactions.map((reaction: Reaction) => {
  //         if (reaction.emoji !== emoji) return reaction;

  //         return {
  //           ...reaction,
  //           count: Math.max(reaction.count - 1, 0), // Prevent count from going negative
  //           users,
  //         };
  //       });
        
  //       return { ...msg, reactions: updatedReactions };
  //     });
  //   return { messages: updatedMessages };
  // }),
  // addReaction: (emoji: string, users: Array<string>, cid: string) => set((server: Server) => ({
  //   messages: server.messages.map((msg: Msg) =>
  //     msg.cid === cid ? {...msg, reactions: [...msg.reactions, {emoji: emoji, count: 1, users: users}]} : msg
  //   )
  // })),
  // addReaction: (emoji: string, user: string, cid: string) => set((server: Server) => ({
  //   messages: server.messages.map((msg: Message) =>
  //     msg.cid == cid 
  //       ? {
  //           ...msg,
  //           reactions: {
  //             ...msg.reactions,
  //             [emoji]: {
  //               count: 1,
  //               users: [user],
  //             }
  //           }
  //         }
  //       : msg
  //   )
  // })),
  
  // addReaction: (emoji: string, user: string, cid: string) => set((server: Server) => ({
  //   messages: server.messages.map((msg: Message) =>
  //     msg.cid === cid ? {...msg, reactions: {...msg.reactions, [emoji]: {count: 1, users: [user]}}} : msg
  //   )
  // })),
  // addReaction: (emoji: string, user: string, cid: string) => set((server: Server) => {
  //   console.log('Before update:', server.messages);
    
  //   const updatedMessages = server.messages.map((msg: Message) =>
  //     msg.cid === cid
  //       ? {
  //           ...msg,
  //           reactions: {
  //             ...msg.reactions,
  //             [emoji]: {
  //               count: msg.reactions[emoji]?.count ? msg.reactions[emoji].count + 1 : 1,
  //               users: msg.reactions[emoji]?.users
  //                 ? [...new Set([...msg.reactions[emoji].users, user])]
  //                 : [user],
  //             },
  //           },
  //         }
  //       : msg
  //   );
    
  //   console.log('After update:', updatedMessages);
  
  //   return { messages: updatedMessages };
  // }),

  addOrRemoveReaction: (emoji: string, user: string, cid: string) => set((server: Server) => {
    const updatedMessages = server.messages.map((msg: Message) => {
      if (msg.cid !== cid) return msg; // Skip if it's not the correct message
  
      const existingReaction = msg.reactions[emoji];
      let updatedReactions = { ...msg.reactions };
  
      if (existingReaction) {
        // If the user already reacted, remove their reaction
        if (existingReaction.users.includes(user)) {
          const updatedUsers = existingReaction.users.filter((u) => u !== user);
  
          if (updatedUsers.length > 0) {
            updatedReactions[emoji] = { count: updatedUsers.length, users: updatedUsers };
          } else {
            // If no users left, delete the reaction for this emoji
            delete updatedReactions[emoji];
          }
        } else {
          // Add user reaction if they haven't reacted yet
          updatedReactions[emoji] = {
            count: existingReaction.count + 1,
            users: [...existingReaction.users, user],
          };
        }
      } else {
        // Create a fresh reaction if the emoji doesn't exist yet
        updatedReactions[emoji] = { count: 1, users: [user] };
      }
  
      return {
        ...msg,
        reactions: updatedReactions, // Updated reactions with the key deleted if necessary
      };
    });
  
    return { messages: updatedMessages };
  }),
  
}))


export type Call = {
  initiator: boolean
  call: null | VideoV2
  peerInfo: null| VideoPeerInfo
  stream: TYPES.VIDEO.DATA
  users: Array<string>
}

type CallAction = {
  setInitiator: (initiator: Call['initiator']) => void
  setPeerInfo: (videoPeerInfo: VideoPeerInfo) => void
  setCall: (call: VideoV2) => void
  setStream: (stream: TYPES.VIDEO.DATA) => void
  addUser: (user: string) => void
}

export const useCallStore = create<Call & CallAction>((set) => ({
  initiator: false,
  call: null,
  peerInfo: null,
  stream: CONSTANTS.VIDEO.INITIAL_DATA,
  users: [],
  setInitiator: (initiator: boolean) => set(() => ({initiator: initiator})),
  setCall: (call: VideoV2) => set(() => ({call: call})),
  setPeerInfo: (peerInfo: VideoPeerInfo) => set(() => ({peerInfo: peerInfo})),
  setStream: (stream: TYPES.VIDEO.DATA) => set(() => ({stream: stream})),
  addUser: (user: string) => set((call: Call) => ({users: [...call.users, user]})),
}))

export type User = {
  authorized: boolean,
  profile: any
}

type UserAction = {
  setAuth: (initiator: User['authorized']) => void
  setProfile: (profile: User['profile']) => void,
}

export const useUserStore = create<User & UserAction>((set) => ({
  authorized: false,
  profile: null,
  setAuth: (authorized: boolean) => set(() => ({authorized: authorized})),
  setProfile: (profile: any) => set(() => ({profile: profile})),
}))