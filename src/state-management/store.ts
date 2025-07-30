import { useProfile } from '@lens-protocol/api-bindings'
import { ChatMemberProfile, CONSTANTS, InfoOptions, TYPES, UserProfile, VideoPeerInfo } from '@pushprotocol/restapi/src'
import { VideoV2 } from '@pushprotocol/restapi/src/lib/video/VideoV2'
import { create } from 'zustand'
// import { Message, Reaction } from '../cache'
import { PushStream } from '@pushprotocol/restapi/src/lib/pushstream/PushStream'
import { Message, Reply } from '../types/messageTypes'
import { Call, Server, TextChannel, VoiceChannel } from '../types/serverTypes'
import { User } from '../types/userTypes'

type Action = {
  // setVideoPeerInfo: (videoPeerInfo: VideoPeerInfo) => void
  // setCall: (call: VideoV2) => void
  // setVideoStreamData: (videoStreamData: TYPES.VIDEO.DATA) => void
  setUserProfiles: (userProfiles: Server['userProfiles']) => void
  setUsers: (users: Server['users']) => void
  setCurrentVoiceChannel: (name: Server['currentVoiceChannel']) => void
  setName:(name: Server['name']) => void
  setReply: (reply: Reply | null) => void
  setFiles: (files: Array<any>) => void
  setStream: (stream: PushStream | undefined) => void
  appendFile: (file: any) => void
  setServerId:(serverId: Server['serverId']) => void
  setCreator:(serverId: Server['creator']) => void
  setPicture:(picture: Server['picture']) => void
  setDescription:(serverId: Server['description']) => void
  setCurrentTextChannel:(currentTextChannel: TextChannel) => void
  setTextChannels:(textChannels: TextChannel[]) => void
  appendTextChannel: (textChannel: TextChannel) => void
  // setVoiceChannels:(voiceChannels: VoiceChannel[]) => void
  setVoiceChannels:(voiceChannels: {[chatId: string] : VoiceChannel}) => void
  appendVoiceChannel: (voiceChannel: VoiceChannel) => void
  setMessages: (messages: Server['messages']) => void
  clearMessages: () => void
  // appendMessage: (message: Msg) => void
  appendMessage: (message: Message) => void
  appendNewMessages: (messages: Message[]) => void
  appendOldMessages: (messages: Message[]) => void
  addReferenceId: (id: string, cid: string) => void
  // addReaction: (emoji: string, users: Array<string>, cid: string) => void
  addOrRemoveReaction: (emoji: string, user: string, cid: string) => void
  // addReaction: (emoji: string, user: string, cid: string) => void
  // incrementReactionCount: (emoji: string, users: Array<string>, cid: string) => void
  // decrementReactionCount: (reference: string, reactionCid: string) => void
}

// Create your store, which includes both state and (optionally) actions
export const useServerStore = create<Server & Action>((set) => ({
  name: '',
  serverId: '',
  currentTextChannel: {name: '', chatId: '', unread: false},
  creator: '',
  picture: '',
  description: '',
  // newChatChannel: {name: '', chatId: ''},
  textChannels: [],
  // voiceChannels: [],
  voiceChannels: {},
  reactions: {'': ''},
  messages: [],
  reply: null,
  files: [],
  videoStreamData: CONSTANTS.VIDEO.INITIAL_DATA,
  call: null,
  videoPeerInfo: null,
  currentVoiceChannel: '',
  users: {admins: [], members: []},
  userProfiles: {},
  stream: undefined,
  setUserProfiles: (userProfiles: Server['userProfiles']) => set(() => ({userProfiles: userProfiles})),
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
  setReply: (reply: Reply | null) => set(() => ({reply: reply})),
  setName: (name: string) => set(() => ({name: name})),
  setServerId: (id: string) => set(() => ({serverId: id})),
  setCreator: (creator: string) => set(() => ({creator: creator})),
  setPicture: (picture: string) => set(() => ({picture: picture})),
  setDescription: (description: string) => set(() => ({description: description})),
  // setServer: (server: Server) => set(() => ({serverId: id})),
  setCurrentTextChannel: (textChannel: TextChannel) => set(() => ({currentTextChannel: textChannel})),
  setTextChannels: (textChannels: Array<any>) => set(() => ({textChannels: textChannels})),
  setStream: (stream: PushStream | undefined) => set(() => ({stream: stream})),
  appendTextChannel: (textChannel: TextChannel) => set((server: Server) => ({textChannels: [...server.textChannels, textChannel]})),
  // setVoiceChannels: (channels: VoiceChannel[]) => set(() => ({voiceChannels: channels})),
  // appendVoiceChannel: (channel: VoiceChannel) => set((server: Server) => ({voiceChannels: [...server.voiceChannels, channel]})),
  setVoiceChannels: (voiceChannels: {[chatId: string] : VoiceChannel}) => set(() => ({voiceChannels: voiceChannels})),
  appendVoiceChannel: (voiceChannel: VoiceChannel) => set((server: Server) => {
    console.log("APPENDING VOICE CHANNEL: ", server.voiceChannels)
    server.voiceChannels[voiceChannel.chatId] = voiceChannel
    return { voiceChannels: server.voiceChannels }
  }),
  // setMessages: (messages: Msg[]) => set(() => ({messages: messages})),
  clearMessages: () => set(() => ({messages: []})),
  setFiles: (files: Array<any>) => set(() => ({files: files})),
  appendFile: (file: any) => set((server: Server) => ({files: [...server.files, file]})),
  // setMessages: (messages: Msg[]) => set((server: Server) => ({messages: [...server.messages, ...messages]})),
  // setMessages: (messages: Message[]) => set((server: Server) => ({messages: [...server.messages, ...messages]})),
  setMessages: (messages: Message[]) => set(() => ({messages: messages})),
  appendMessage: (message: Message) => set((server: Server) => ({messages: [...server.messages, message]})),
  appendNewMessages: (messages: Message[]) => set((server: Server) => ({messages: [...server.messages, ...messages]})),
  appendOldMessages: (messages: Message[]) => set((server: Server) => ({messages: [...messages, ...server.messages]})),
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

  // incrementReactionCount: (emoji: string, users: Array<string>, cid: string) => set((server: Server) => ({
  //   messages: server.messages.map((msg: Message) =>
  //     msg.cid === cid ? {...msg, reactions: {...msg.reactions, [emoji]: {count: msg.reactions[emoji].count + 1, users: users}}} : msg
  //   )
  // })),
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

  // decrementReactionCount: (emoji: string, users: string[], cid: string) => set((server: Server) => ({
  //   messages: server.messages.map((msg: Message) =>
  //     msg.cid == cid 
  //       ? {
  //           ...msg,
  //           reactions: {
  //             ...msg.reactions,
  //             emoji: {
  //               count: msg.reactions[emoji]?.count  - 1,
  //               users: users,
  //             }
  //           }
  //         }
  //       : msg
  //   )
  // })), 
  /// TESTING
  // decrementReactionCount: (reference: string, reactionCid: string) => set((server: Server) => ({
  //   messages: server.messages.map((msg: Message) =>
  //     msg.cid == reference 
  //       ? {
  //           ...msg,
  //           reactions: {
  //             ...msg.reactions,
  //             emoji: msg.reactions.map((reaction: Reaction) => 
  //               reaction.cid == reactionCid ? 
  //                 {} : reaction
  //             )
  //           }
  //         }
  //       : msg
  //   )
  // })),
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


  // addOrRemoveReaction: (emoji: string, user: string, cid: string) => set((server: Server) => {
  //   const updatedMessages = server.messages.map((msg: Message) => {
  //     if (msg.cid !== cid) return msg; // Skip if it's not the correct message

  //     const existingReaction = msg.reactions[emoji];
  //     let updatedReactions = { ...msg.reactions };
  
  //     if (existingReaction) {
  //       // If the user already reacted, remove their reaction
  //       if (existingReaction.users.includes(user)) {
  //         const updatedUsers = existingReaction.users.filter((u) => u !== user);
  
  //         if (updatedUsers.length > 0) {
  //           updatedReactions[emoji] = { count: updatedUsers.length, users: updatedUsers };
  //         } else {
  //           // If no users left, delete the reaction for this emoji
  //           delete updatedReactions[emoji];
  //         }
  //       } else {
  //         // Add user reaction if they haven't reacted yet
  //         updatedReactions[emoji] = {
  //           count: existingReaction.count + 1,
  //           users: [...existingReaction.users, user],
  //         };
  //       }
  //     } else {
  //       // Create a fresh reaction if the emoji doesn't exist yet
  //       updatedReactions[emoji] = { count: 1, users: [user] };
  //     }
  
  //     return {
  //       ...msg,
  //       reactions: updatedReactions, // Updated reactions with the key deleted if necessary
  //     };
  //   });
  
  //   return { messages: updatedMessages };
  // }),

  addOrRemoveReaction: (emoji: string, user: string, cid: string) => set((server: Server) => {
    console.log("Updating reactions for message:", cid, "with emoji:", emoji, "by user:", user);
    const updatedMessages = server.messages.map((msg: Message) => {
      if (msg.cid !== cid) return msg; // Skip messages that don’t match
  
      // Ensure reactions object exists
      const reactions = msg.reactions || {};
  
      const existingReaction = reactions[emoji];
      const updatedReactions = { ...reactions };
  
      if (existingReaction) {
        if (existingReaction.users.includes(user)) {
          // Remove the user from reaction
          const updatedUsers = existingReaction.users.filter((u: string) => u !== user);
  
          if (updatedUsers.length > 0) {
            updatedReactions[emoji] = { count: updatedUsers.length, users: updatedUsers };
          } else {
            // No users left, delete the emoji key
            delete updatedReactions[emoji];
          }
        } else {
          // Add user to reaction
          updatedReactions[emoji] = {
            count: existingReaction.count + 1,
            users: [...existingReaction.users, user],
          };
        }
      } else {
        // Create a new reaction entry
        updatedReactions[emoji] = { count: 1, users: [user] };
      }
  
      return {
        ...msg,
        reactions: updatedReactions, // Ensure state changes with a new object reference
      };
    });
  
    return { messages: updatedMessages };
  }),  
  
}))

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

type UserAction = {
  setAudio: (audio: boolean) => void,
  setVideo: (video: boolean) => void,
  setSilence: (silence: boolean) => void,
  setAuth: (initiator: User['authorized']) => void,
  setProfile: (profile: UserProfile) => void,
  setServerList: (serverList: string[]) => void,
}

export const useUserStore = create<User & UserAction>((set) => ({
  audio: true,
  video: false,
  silence: false,
  authorized: false,
  profile: null,
  serverList: [],
  setAudio: (audio: boolean) => set(() => ({audio: audio})),
  setVideo: (video: boolean) => set(() => ({video: video})),
  setSilence: (silence: boolean) => set(() => ({silence: silence})),
  setAuth: (authorized: boolean) => set(() => ({authorized: authorized})),
  setProfile: (profile: UserProfile) => set(() => ({profile: profile})),
  setServerList: (serverList: string[]) => set(() => ({serverList: serverList})),
}))