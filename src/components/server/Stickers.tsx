// https://api.mojilala.com/v1/stickers/trending?api_key=dc6zaTOxFJmzC
import axios from "axios";
import { useEffect, useState } from "react";
import { push } from "../../App";
import { useServerStore } from "../../state-management/store";
import { v4 as uuidv4 } from 'uuid';
import { Message } from "../../cache";

function StickerGrid(){
  const [stickers, setStickers] = useState([])
  
  useEffect(() => {

    fetch('https://www.youtube.com/watch?v=8BrLNgKLWzs&ab_channel=Fireship', { mode: "no-cors" }).then((res: any) => {
      console.log("RESULT YOUTUBE LINK: " + JSON.stringify(res))
    })

    axios.get('https://api.mojilala.com/v1/stickers/trending?api_key=dc6zaTOxFJmzC').then((res: any) => {
      setStickers(res.data.data)
    })
  }, []);

  const stickerList = stickers.map((sticker: any) => {return <Sticker url={sticker.images.fixed_height.url}/>})

  return (
    <>
      <div className='flex flex-col h-[500px] w-[500px] justify-center z-50'>
        <input className="w-full bg-white h-11 p-2 rounded focus:outline-none placeholder:text-gray-400" placeholder="Search Stickers (mojilala)"/>
        <div className='grid grid-cols-3 w-[500px] h-[475px] overflow-y-scroll justify-center place-items-center px-3 gap-2'>
          {stickerList}
        </div>
      </div>
    </>
  )
}

export default StickerGrid

function Sticker(props: {url: string}){
  const currentChatChannel = useServerStore((server) => server.currentChatChannel)
  const appendMessage = useServerStore((server) => server.appendMessage)
  const setReply = useServerStore((server) => server.setReply)

  async function onStickerClick(){
    console.log("STICKER CLICK")
    let msg: any = { type: "MediaEmbed", content: props.url }
    let r = null
    
    const reply = useServerStore.getState().reply;
    if(reply.messageBlip != '' && reply.reference != ''){
      msg = { type: "Reply", content: { type: "MediaEmbed", content: props.url }, reference: reply.reference }
      r =  { messageBlip: reply.messageBlip, reference: reply.reference }
    }
    
    let from = ''
    try{
      from = push.user!.account.split(':')[1].toLowerCase()
      if(from == undefined){
        from = push.user!.account.toLowerCase()
      }
    }catch{
      from = push.user!.account.toLowerCase()
    }
    
    const randomId = uuidv4();
    // const msg: Msg = {
    //   "id": randomId, "origin": "self", "timestamp": Date.now(),
    //   "chatId": currentChatChannel.chatId, "from": from.toLowerCase(),
    //   "message": message, "meta": { "group": true }, "messageContent": props.url,
    //   "cid": "",
    //   reactions: [{
    //     emoji: '', count: 0,
    //     users: []
    //   }],
    //   reply: r
    // }

    const message: Message = {
      id: randomId,
      chatId: currentChatChannel.chatId,
      origin: "self",
      timestamp: Date.now(),
      from: from.toLowerCase(),
      message: msg,
      group: true,
      cid: "",
      reply: null,
      reactions: {}
    }

    appendMessage(message)
    setReply({messageBlip: '', reference: ''})

    const stickerResponse = await push.user!.chat.send(currentChatChannel.chatId, msg);
    console.log("STICKER RESPONSE:::: " + JSON.stringify(stickerResponse))
  }
  return(
    <button onClick={onStickerClick} className="hover:bg-deep-purple-100 rounded">
      <img src={props.url} height={125} width={125}/></button>
  )
}