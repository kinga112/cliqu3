import { create } from "zustand"

interface Globals {
  // currentDM: string
  currentScreen: 'Server' | 'DirectMessages' | 'Settings',
  settingsContent: string,
}

interface GlobalAction {
  // setCurrentDM: (id: string) => void,
  setCurrentScreen: (screen:  'Server' | 'DirectMessages' | 'Settings') => void,
  setSettingsContent: (content: string) => void,
}

export const useGlobalStore = create<Globals & GlobalAction>((set) => ({
  // currentDM: '',
  currentScreen: 'DirectMessages',
  settingsContent: 'Update Profile',
  // setCurrentDM: (id: string) => set({ currentDM: id }),
  setCurrentScreen: (screen: 'Server' | 'DirectMessages' | 'Settings') => set({ currentScreen: screen }),
  setSettingsContent: (content: string) => set({ settingsContent: content }),
}));
