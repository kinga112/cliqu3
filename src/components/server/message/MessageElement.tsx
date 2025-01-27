import { memo, useState } from "react";
import { Message } from "../../../cache";
import { useServerStore } from "../../../state-management/store";
import { Dialog, DialogPanel } from "@headlessui/react";
import arrow from '../../../assets/icons/arrow.png'
import pdf from '../../../assets/icons/pdf.svg'
import { ReactionElement } from "../Server";
import Interactions from "./Interactions";
import LinkPreview from "../LinkPreview";
import DisplayName from "./DisplayName";

// function MessageElement(props: {message: Message}){
function MessageElement(props: {message: Message, lastMessage: Message}){  
  const userProfiles = useServerStore((server) => server.userProfiles)

  // console.log("MESSAGE stringify: " + JSON.stringify(props.message.reactions))
  if(props.message.message == undefined){
    return <div/>
  }
  // if(typeof props.message.message.content === 'string'){
  //   console.log("MESSAGE 1: " + props.message.message.content)
  // }else{
  //   console.log("MESSAGE 2: " + props.message.message.content.content)
  // }
  // SUBSCRIBE TO JUST THIS MESSAGE IN THE STORE
  // const message = useStore((state) => state.messages.find(msg => msg.cid === cid));
  
  if(props.message.from == undefined){
    return <div/>
  }

  function withinFiveMinutes(timestamp1: number, timestamp2: number): boolean {
    const differenceInMilliseconds = Math.abs(timestamp1 - timestamp2); // Get absolute difference
    const fiveMinutesInMilliseconds = 5 * 60 * 1000; // 5 minutes in milliseconds
  
    return differenceInMilliseconds <= fiveMinutesInMilliseconds;
  };

  let shortFormat = false
  if(props.lastMessage != undefined){
    if(props.message.from == props.lastMessage.from && withinFiveMinutes(props.message.timestamp, props.lastMessage.timestamp)){
      shortFormat = true
    }
  }

  let picture: string | null = null
  if(userProfiles[props.message.from] != undefined){
    picture = userProfiles[props.message.from].picture!
  }
  
  let fileContent = false
  if(props.message.message.type == 'File'){
    fileContent = true
  }

  let imageContent = false;
  if(props.message.message.type == 'MediaEmbed'){
    imageContent = true
  }

  let showReply = false
  let overflow = false
  let messageContent = ''
  if(typeof(props.message.message.content) == 'string'){
    messageContent = props.message.message.content
  }else{
    console.log("PROPS.MESSAGE.MESSAGE.CONTENT: ", props.message.message.content)
    messageContent = props.message.message.content.content
    showReply = true
    // console.log("CONTENT TYPE OF REPLY TYPE: " + message.message.content.type)
    if(props.message.message.content.type == 'MediaEmbed'){
      imageContent = true
    }
    if(props.message.reply!.messageBlip.length >= 50){
      overflow = true
    }
  }

  // console.log("MESSAGE CONTENT::::: ", messageContent)

  let reactions = Object.entries(props.message.reactions).map(([emoji, reaction]) => {
    return reaction.count == 0 ? <p/> : <ReactionElement key={emoji} emoji={emoji} count={reaction.count} users={reaction.users} cid={props.message.cid} userProfiles={userProfiles}/>
  });

  function Linkify(props: {messageContent: string}){
    let found = false
    let before = ''
    let after = ''
    let link = ''
    let clickable = ''

    const isUrl = (word: string) => {
      const urlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
      return word.match(urlPattern)
    }

    const addMarkup = (word: string) => {
      if(isUrl(word)){
        link = word
        clickable = link
        if(clickable.substring(0,3) == 'www'){
            clickable = 'https://' + link
        }
        found = true
      }else{
        if(found){
            after = after.concat(" ", word)
        }else{
            before = before.concat(" ", word)
        }
      }
    }

    const words = props.messageContent.split(' ')
    words.map((w, i) => addMarkup(w))

    // const contentString = `${props.messageContent}`

    if(found){
      return(
        <>
          <div className="flex flex-col gap-2 w-full">
            <span>
              <p className="inline">{before}&nbsp;</p>
              { found ? <a className="text-blue-400 hover:text-blue-500 inline" href={clickable} target="_blank">{link}</a> : <p/>}
              <p className="inline">&nbsp;{after}</p>
            </span>
            <LinkPreview url={link}/>
          </div>
        </>
      )
    }else{
      return (
        <>
          {/* <p>{props.messageContent}</p> */}
          <p className="whitespace-pre-line">{props.messageContent}</p>
        </>
      )
    }
  }

  function Content(){
    const [openFile, setOpenFile] = useState(false)

    function FileModal(props: {base64string: string}){
      return (
        <>
          {/* <button onClick={() => setIsOpen(true)}>Open dialog</button> */}
          <Dialog open={openFile} onClose={() => {setOpenFile(false)}} className="relative z-50 text-deep-purple-100 select-none">
            <div className="fixed inset-0 flex w-screen items-center justify-center">
              <DialogPanel>
                <iframe className="h-[750px] w-[750px]" src={'data:application/pdf;base64,' + props.base64string}/>
              </DialogPanel>
            </div>
          </Dialog>
        </>
      )
    }

    // imageContent ? <img className="rounded-md" src={messageContent}/> : <Linkify messageContent={messageContent}
    if(imageContent == true){
      return <img className="rounded-md object-scale-down" src={messageContent}/>
    }else if(fileContent == true){
      // console.log(messageContent)
      // const f = JSON.parse(messageContent)
      // console.log(JSON.stringify(f))
      const base64string = messageContent.split('base64,')[1].split(',')[0]
      const name = messageContent.split('"name":')[1].split('}')[0]
      // console.log("BASE 64 STRING !!! : " + base64string)
      // console.log("Name: " + name)
      let icon = pdf
      return (
        <div>
          <FileModal base64string={base64string}/>
          <button className="flex gap-1 py-1 px-2 bg-deep-purple-300 border border-deep-purple-100 rounded-md place-items-center" onClick={() => setOpenFile(true)}>
            <img src={icon} height={30} width={30}/>
            {name}
          </button>
        </div>
      )
    }else{
      return <Linkify messageContent={messageContent}/>
    }
  }

  function MessageFormat(){
    if(shortFormat){
      const time = new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: '2-digit'}).format(props.message.timestamp)
        return(
          <>
            <div className="flex place-items-start gap-2 w-full h-full group">
              <div className="flex text-xxs font-semibold justify-center text-center w-14 shrink-0 p-1 invisible group-hover:visible select-none">{time}</div>
              <div className={"flex flex-col w-full " + (reactions.length == 0 ? "" : "gap-1")}>
                <div>
                  <Content/>
                </div>
                <div className="flex gap-1">
                  {reactions}
                </div>
              </div>
            </div>
          </>
        )
    }else{
      const time = new Intl.DateTimeFormat('en-US', {month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'}).format(props.message.timestamp)
      return(
        <>
          <div className="flex place-items-start gap-2 w-full h-full">
            <img src={picture!} className="w-14 h-14 bg-deep-purple-100 rounded-md shrink-0 object-cover select-none pointer-events-none"/>
            <div className={"flex flex-col w-full " + (reactions.length == 0 ? "" : "gap-1")}>
              <div className="flex flex-row place-items-center gap-2">
                <DisplayName message={props.message}/>
                <div className="text-xxs font-semibold select-none">
                  {time}
                </div>
              </div>
              <div>
                <Content/>
              </div>
              <div className="flex gap-1">
                {reactions}
              </div>
            </div>
          </div>
        </>
      )
    }
  }

  return(
    <>
      <div key={props.message.id + props.message.cid} className={"flex-col place-items-start relative p-1 hover:bg-off-black-300 gap-2 group rounded ml-8 " + (shortFormat ? "" : "mt-4")}>
        {showReply ? <div className="flex justify-center gap-2 pl-4">
          <img className="select-none" src={arrow} height={20} width={30}/>
          <p className="text-sm truncate max-w-full">{props.message.reply!.messageBlip}{ overflow ? '...' : ''}</p>
        </div> : <div/>}
        <MessageFormat/>
        <Interactions key={props.message.id + props.message.cid} message={props.message}/>
      </div>
    </>
  )
}

export default memo(MessageElement)