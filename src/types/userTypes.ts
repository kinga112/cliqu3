// import { UserProfile } from "@pushprotocol/restapi";
import { UserProfile } from "@pushprotocol/restapi/src";

export interface User {
  audio: boolean,
  video: boolean,
  silence: boolean,
  authorized: boolean,
  profile: UserProfile | null
  serverList: string[],
}

export interface GunUser {
  profile: String, // wallet address
  serverList: string // GunServer ids
}