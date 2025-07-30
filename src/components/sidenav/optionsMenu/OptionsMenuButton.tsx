import { useEffect, useRef, useState } from "react";
import add_cropped from "../../../assets/icons/add-cropped.svg"
import settings from "../../../assets/icons/settings.svg"
import options from "../../../assets/icons/options.svg"
import { _openCreateServerModal } from "../../../screens/globalState";
import { CreateServerModal } from "./CreateServerModal";
import { useGlobalStore } from "../../../state-management/globalStore";
import { useServerStore } from "../../../state-management/store";

export function OptionsMenuButton(){
  const [optionsMenuVisibility, setOptionsMenuVisibility] = useState('invisible')
  const optionsMenuRef = useRef(null);
  const optionsMenuButtonRef = useRef(null);
  const setCurrentScreen = useGlobalStore((globals) => globals.setCurrentScreen)
  const setServerId = useServerStore((server) => server.setServerId)
  outsideOptionsMenuAlerter(optionsMenuRef, optionsMenuButtonRef);


  function outsideOptionsMenuAlerter(optionsMenuRef: React.MutableRefObject<any>, optionsMenuButtonRef: React.MutableRefObject<any>) {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (!optionsMenuButtonRef.current.contains(event.target)) {
          if (!optionsMenuRef.current.contains(event.target)) {
            setOptionsMenuVisibility('invisible')
          }
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [optionsMenuRef, optionsMenuButtonRef]);
  }

  function optionsMenuClick(){
    if(optionsMenuVisibility == 'visible'){
      setOptionsMenuVisibility('invisible')
    }else{
      setOptionsMenuVisibility('visible')
    }
  }

  return(
    <>
      <div className="flex flex-col relative">
        <button ref={optionsMenuButtonRef}
          className=" w-16 h-16 bg-deep-purple-300 rounded-2xl justify-center place-items-center duration-200 hover:scale-105 z-10 overflow-visible"
          onClick={optionsMenuClick}
        >
          <img src={options} height={75} width={75}/>
        </button>
        <div ref={optionsMenuRef} className={"absolute flex flex-col p-2 gap-1 left-[75px] w-32 bg-off-black-400 border border-off-black-300 rounded-2xl z-20 " + optionsMenuVisibility}>
          <button className="flex gap-2 p-2 place-items-center h-12 bg-deep-purple-300 rounded-lg hover:bg-deep-purple-400" 
                  onClick={() => {_openCreateServerModal.set(true); setOptionsMenuVisibility('invisible')}}
          >
            <img src={add_cropped} height={25} width={25}></img>
            <div className="font-semibold">Create</div>
          </button>
          <button className="flex gap-2 p-2 h-12 bg-deep-purple-300 rounded-lg hover:bg-deep-purple-400"></button>
          <button className="flex gap-2 p-2 place-items-center h-12 bg-deep-purple-300 rounded-lg hover:bg-deep-purple-400"
            onClick={() => {setCurrentScreen('Settings'); setServerId(''); setOptionsMenuVisibility('invisible')}}
          >
            <img src={settings} height={25} width={25}></img>
            <div className="font-semibold">Settings</div>
          </button>
        </div>
        <CreateServerModal/>
      </div>
    </>
  )
}