import { ChatMemberProfile, IUser } from "@pushprotocol/restapi/src";
import { useEffect, useRef, useState } from "react";
import { useServerStore } from "../../state-management/store";
import star from '../../assets/icons/star.svg'
import block from '../../assets/icons/block.svg'
import { push } from "../../App";

export function UserInfoSmall(props: {member: ChatMemberProfile}){
  const creator = useServerStore((server) => server.creator)
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // console.log("CREATOR: ", creator)
  // console.log("USER ADDRESS: ", props.member.address)


  const handleClick = (e: React.MouseEvent) => {
    setShowMenu(true);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        handleCloseMenu();
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);


  let displayName = ''
  if(props.member.userInfo.profile.name != null){
    displayName = props.member.userInfo.profile.name
  }else{
    displayName = props.member.address
  }


  function IsCreator(){
    const [creatorTagVisibility, setCreatorTagVisibility] = useState('invisible')
    if(props.member.address.toLowerCase().includes(creator)){
      return(
        <>
          <div className="relative">
            <img 
              onMouseEnter={() => setCreatorTagVisibility('visible')} 
              onMouseLeave={() => setCreatorTagVisibility('invisible')} 
              src={star} width={25} height={25}
            />
            <div className={"absolute p-1 rounded text-deep-purple-100 bg-off-black-300 -right-5 font-medium border border-off-black-200 " + creatorTagVisibility}>
              creator
            </div>
          </div>
        </>
      )
    }
  }

  return(
    <>
      <div className="relative">
        <button onClick={(e) => handleClick(e)} className="flex place-items-center gap-1 hover:bg-deep-purple-300 rounded w-full p-2">
          <img className="rounded-sm object-cover w-6 h-6 select-none" src={props.member.userInfo.profile.picture!}/>
          <p className="truncate">{displayName}</p>
          <IsCreator/>
        </button>
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute shadow-lg w-96 h-36 bg-slate-400 rounded-xl top-0 -left-[calc(395px)] z-50"
          >
            <UserInfoLarge 
              address={props.member.address.toLowerCase()}
              displayName={props.member.userInfo.profile.name!} 
              description={props.member.userInfo.profile.desc!} 
              picture={props.member.userInfo.profile.picture!} 
            />
          </div>
        )}
      </div>
    </>
  )
}

export function UserInfoLarge(props: {address: string, displayName: string, description: string, picture: string}){
  const [showCopy, setShowCopy] = useState(false)
  const [copyText, setCopyText] = useState('copy')
  let address = props.address.toLowerCase()
  try{
    if(props.address.split(':')[1] != undefined){
      address = props.address.split(':')[1].toLowerCase()
    }
  }catch{
    // console
  }

  console.log("account: " + push.user!.account + ", address: " + address)
  let myProfile = false
  if(address.includes(push.user!.account.toLowerCase())){
    myProfile = true
  }

  let visibility = 'invisible'
  if(showCopy){
    visibility = 'visible'
  }

  function blockUser(){
    push.user!.chat.block([address]).then((user: IUser) => {
      console.log("BLOCKED USER: ", user)
    })
  }

  return(
    <>
      <div className="relative w-96 h-36 rounded-xl overflow-hidden pointer-events-none z-50">
        <img className="absolute w-full h-full blur-3xl select-none" src={props.picture}/>
        <img className="absolute left-5 top-4 rounded-lg shrink-0 w-28 h-28 object-cover select-none" src={props.picture}/>
        <div className="absolute left-36 top-4 p-1 rounded-lg bg-deep-purple-100 bg-opacity-40 text-deep-purple-500">
          <div className="flex flex-col gap-1 pointer-events-auto">
            <div className="text-xl font-semibold">{props.displayName}</div>
            <div className="relative">
              <button 
                className="text-xs hover:underline" 
                onClick={() => {navigator.clipboard.writeText(address); setCopyText('copied')}}
                onMouseEnter={() => setShowCopy(true)}
                onMouseLeave={() => {setShowCopy(false); setCopyText('copy')}}
              >
                {address.substring(0,12)}...{address.substring(30,42)}
              </button>
              <div className={"absolute top-6 right-0 bg-deep-purple-500 text-deep-purple-100 rounded text-sm p-0.5 " + visibility}>
                {copyText}
              </div>
            </div>
            <div className="text-base font-light">{props.description}</div>
          </div>
        </div>
        { myProfile ? 
          <div/> :
          <button className="absolute bottom-3 right-3 p-1 bg-deep-purple-300 rounded-lg z-50 pointer-events-auto" onClick={blockUser}>
            <img src={block} width={25} height={25}/>
          </button>
        }
      </div>
    </>
  )
}