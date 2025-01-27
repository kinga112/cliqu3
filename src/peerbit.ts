import { field, variant } from "@dao-xyz/borsh";
import { Documents, SearchRequest } from "@peerbit/document";
import { Program } from "@peerbit/program";
import assert from "node:assert";
import { Peerbit } from "peerbit";
import { v4 as uuid } from "uuid";
import { push } from "./App";

interface VoiceChannel {
  chatId: string,
  peerInfo: string
}

// @variant(0) // version 0
export class Server {
  @field({ type: "string" })
  id: string;

  @field({ type: "string" })
  name: string;

  @field({ type: Array })
  users: Array<string>;

  @field({ type: Array })
  textChannels: Array<string>;

  @field({ type: Array })
  voiceChannels: Array<VoiceChannel>;

  constructor(name: string, users: Array<string>, textChannels: Array<string>, voiceChannels: Array<VoiceChannel>) {
    this.id = uuid();
    this.name = name;
    this.users = users;
    this.textChannels = textChannels;
    this.voiceChannels = voiceChannels;
  }
}

@variant("servers")
export class ServersDB extends Program {
  @field({ type: Documents })
  servers: Documents<Server>; // Documents<?> provide document store functionality around your Posts

  constructor() {
    super();
    this.servers = new Documents();
  }

  /**
   * Implement open to control what things are to be done on 'open'
   */
  async open(): Promise<void> {
    // We need to setup the store in the setup hook
    // we can also modify properties of our store here, for example set access control
    await this.servers.open({
        type: Server,
        // You can add more properties here, like
        /* canPerform: (entry) => true */
    });

  }

}


