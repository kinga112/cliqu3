import { ChatMemberProfile, TYPES, UserProfile, VideoPeerInfo } from "@pushprotocol/restapi/src";
import { Message, Reply } from "./messageTypes";
import { PushStream } from "@pushprotocol/restapi/src/lib/pushstream/PushStream";
import { VideoV2 } from "@pushprotocol/restapi/src/lib/video/VideoV2";

export interface Call {
  initiator: boolean
  call: null | VideoV2
  peerInfo: null| VideoPeerInfo
  stream: TYPES.VIDEO.DATA
  users: Array<string>
}

export interface Channel {
  chatId: string;
  name: string;
  users: ChatMemberProfile[];
  lastReadMessageCid: string;
}

export interface Server {
  name: string
  serverId: string
  creator: string
  description: string
  picture: string
  currentTextChannel: {
    name: string,
    chatId: string,
    unread: boolean
  }
  textChannels: TextChannel[]
  voiceChannels: { [chatId: string] : VoiceChannel }
  messages: Message[]
  reply: Reply | null
  files: Array<any>
  currentVoiceChannel: string
  users: { admins: Array<ChatMemberProfile>, members: Array<ChatMemberProfile> }
  userProfiles: { [address: string] : UserProfile } // easier to search for user: structure: {'address': <Profile>}
  stream: PushStream | undefined
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

export interface VoiceChannel {
  name: string
  chatId: string
  // peerInfo: string
  peerInfo: VideoPeerInfo | null
}

export interface TextChannel {
  name: string
  chatId: string
  unread: boolean
}
