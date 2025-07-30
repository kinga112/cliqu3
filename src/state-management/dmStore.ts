// import { IFeeds } from "@pushprotocol/restapi/src";
import { create } from "zustand"

interface DirectMessageState {
  // currentDM: string,
  currentDM: string | null,
  // currentNavOption: 'Chats' | 'Requests',
  currentNavOption: 'CHATS' | 'REQUESTS',
  newMessage: boolean,
}

interface DirectMessageAction {
  // setCurrentDM: (id: string) => void,
  setCurrentDM: (dm: string | null) => void,
  setCurrentNavOptions: (option: 'CHATS' | 'REQUESTS') => void,
  setNewMessage: (newMessage: boolean) => void,
}

export const useDirectMessageStore = create<DirectMessageState & DirectMessageAction>((set) => ({
  currentDM: null,
  currentNavOption: 'CHATS',
  newMessage: true,
  setCurrentDM: (dm: string | null) => set({currentDM: dm}),
  setCurrentNavOptions: (option: 'CHATS' | 'REQUESTS') => set({currentNavOption: option }),
  setNewMessage: (newMessage: boolean) => set({newMessage: newMessage }),
}));
