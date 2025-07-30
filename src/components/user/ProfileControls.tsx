import { useEffect, useRef, useState } from "react";
import { useServerStore, useUserStore } from "../../state-management/store";
import mic from "../../assets/icons/mic.svg"
import muted_mic from "../../assets/icons/muted-mic.svg"
import headphones from "../../assets/icons/headphones.svg"
import muted_headphones from "../../assets/icons/muted-headphones.svg"
import editIcon from "../../assets/icons/edit.svg"
import { UserInfoLarge } from "./UserInfo";
import { push } from "../../App";

export function ProfileControls(){
  const profile = useUserStore(user => user.profile)
  const audio = useUserStore(user => user.audio)
  const video = useUserStore(user => user.video)
  const silence = useUserStore(user => user.silence)
  const setAudio = useUserStore(user => user.setAudio)
  const setVideo = useUserStore(user => user.setVideo)
  const setSilence = useUserStore(user => user.setSilence)
  const [profileMenuVisibility, setProfileMenuVisibility] = useState('invisible')
  const profileMenuRef = useRef(null);
  // const [muted, setMuted] = useState(false)
  // const [silence, setSilence] = useState(false)
  // const [edit, setEdit] = useState(false)

  outSideProfileMenuAlerter(profileMenuRef)

  function outSideProfileMenuAlerter(ref: React.MutableRefObject<any>) {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (!ref.current.contains(event.target)) {
          setProfileMenuVisibility('invisible')
          // setEdit(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  return(
    <>
      <div className="flex flex-col relative">
        <button 
          className="flex flex-col w-16 h-16 bg-deep-purple-300 rounded-2xl justify-center place-items-center duration-200 hover:scale-105 z-10"
          onClick={() => {setProfileMenuVisibility('visible')}}
        >
          {profile == null ? <div/> : <img className="object-cover w-16 h-16 rounded-2xl" src={profile.picture!}/>}
        </button>
        <div ref={profileMenuRef} className={"absolute flex p-2 gap-1 left-[75px] bottom-0 bg-off-black-400 border border-off-black-300 rounded-2xl z-20 " + profileMenuVisibility}>
          {/* {profile == null ? <div/> : <UserInfoLarge address={push.user?.account!} displayName={profile.name!} description={profile.desc!} picture={profile.picture!} edit={edit}/>} */}
          {profile == null ? <div/> : <UserInfoLarge address={push.user?.account!} userProfile={profile}/>}
          <div className="flex flex-col justify-evenly p-1 bg-off-black-300 rounded-xl">
            <button className="p-1 hover:bg-off-black-200 rounded-md" onClick={() => setAudio(!audio)}>
            { audio ? <img src={mic} width={25} height={25}/> : <img src={muted_mic} width={25} height={25}/> }
            </button>
            <button className="p-1 hover:bg-off-black-200 rounded-md" onClick={() => setSilence(!silence)}>
            { silence ? <img src={muted_headphones} width={25} height={25}/> : <img src={headphones} width={25} height={25}/> }
            </button>
            <button className={video ? "p-1 hover:bg-off-black-200 rounded-md bg-green-500" : "p-1 hover:bg-off-black-200 rounded-md bg-red-500"} onClick={() => setVideo(!video)}>
              <img src={editIcon} width={25} height={25}/>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
