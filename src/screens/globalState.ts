import { hookstate } from "@hookstate/core";
import { RxDB } from "../rxdb";
// import { PushAPI } from "@pushprotocol/restapi";
import {  PushAPI } from '@pushprotocol/restapi/src/lib';
import { Push } from "../push";

// export const _serverList = hookstate<Array<{id: string, server: any}>>([]);
// export const _db = hookstate<RxDB|undefined>(undefined);
// export const _user = hookstate<PushAPI|undefined>(undefined);
// export const _push = hookstate<Push|undefined>(undefined);
// export const _serverId = hookstate<string>('');
// export const _channelId = hookstate<string>('');
export const _openCreateServerModal = hookstate<boolean>(false);
export const _openCreateChatChannelModal = hookstate<boolean>(false);
// export const _chatChannels = hookstate<Array<string>>([''])
// export const _currentChatId = hookstate<string>('');
// export const _currentChannelName = hookstate<string>('');
// export const _currentMessages = hookstate<any>([]);
// export const _chatChannels = hookstate<Array<{name: string, chatId: string}>>([]);
