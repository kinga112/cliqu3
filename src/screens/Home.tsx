import { _openCreateServerModal } from "./globalState";
import Server from "../components/server/Server";
import { useServerStore } from "../state-management/store";
// import DirectMessages from "./DirectMessages";
import { SideNav } from "../components/sidenav/SideNav";
import { useGlobalStore } from "../state-management/globalStore";
import { Settings } from "../components/settings/Settings";
import { DirectMessages } from "../components/dms/DirectMessages";
// import { Settings } from "./Settings";

export function Home(){
  const serverId = useServerStore((server) => server.serverId)
  // console.log("CURRENT SCREEN: ", currentScreen)
  return (
    <>
      <div className="flex relative bg-off-black-700 h-screen w-screen text-deep-purple-100 overflow-hidden">
        <SideNav/>
        <div className="w-full h-full">
          <CurrentScreen/>
        </div>
        {/* FIX BELOW SO NOT SUPER SPECIFIC WITH THE DIMENSIONS BASED ON OTHER SCREENS */}
        <div className="overflow-hidden absolute top-0 w-24 h-56 select-none pointer-events-none">
          <div className="absolute top-0 w-24 bg-off-black-700 border-b-2 border-off-black-400 h-[156px] shadow-lg shadow-off-black-700"/>
        </div>
        <div className="overflow-hidden absolute bottom-0 w-24 h-40 select-none pointer-events-none">
          <div className="absolute bottom-0 w-24 bg-off-black-700 border-t-2 border-off-black-400 h-[88px] shadow-[0px_-10px_15px_-3px_rgba(0,0,0,0.1)] shadow-off-black-700"/>
        </div>
      </div>
    </>
  )
}

function CurrentScreen(){
  const currentScreen = useGlobalStore((globals) => globals.currentScreen)
  switch(currentScreen){
    case 'Server':
      return(<Server/>)
    case 'DirectMessages':
      return(<DirectMessages/>)
    case 'Settings':
      return(<Settings/>)
  }
}
