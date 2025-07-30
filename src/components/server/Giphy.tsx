import {
  Grid, // our UI Component to display the results
  SearchBar, // the search bar the user will type into
  SearchContext, // the context that wraps and connects our components
  SearchContextManager, // the context manager, includes the Context.Provider
  SuggestionBar, // an optional UI component that displays trending searches and channel / username results
} from '@giphy/react-components'
import { useContext, useState } from 'react'
import type { GifID, IGif } from '@giphy/js-types'
import { push } from '../../App'
import { useServerStore } from '../../state-management/store'
import { v4 as uuidv4 } from 'uuid';
import { Content, Message, ReferenceContent } from '../../types/messageTypes'
// import { Message } from '../../cache'

// the search experience consists of the manager and its child components that use SearchContext
const SearchExperience = () => (
  <SearchContextManager apiKey='goyFCcsB5PDaDT3xWZLQmyBMfKRV98dS'>
    <Components />
  </SearchContextManager>
)

// define the components in a separate function so we can
// use the context hook. You could also use the render props pattern
const Components = () => {
  const currentTextChannel = useServerStore((server) => server.currentTextChannel)
  const appendMessage = useServerStore((server) => server.appendMessage)
  const setReply = useServerStore((server) => server.setReply)
  const { fetchGifs, searchKey } = useContext(SearchContext)
  // const [gif, setGif] = useState<IGif | null>(null)

  async function onGifClick(gif: IGif | null){
    // console.log("GIF ON Click: " + JSON.stringify(gif))
    let content = gif?.images.downsized_small.url!
    if(content == undefined){
      content = gif?.images.downsized_medium.url!
      if(content == undefined){
        content = gif?.images.downsized_large.url!
      }
    }

    // console.log("CONTENT: " + content)
    let msg: any = { type: "MediaEmbed", content: content }
    // let r = null
    
    const reply = useServerStore.getState().reply;
    // if(reply){
    //   msg = { type: "Reply", content: msg, reference: reply.reference }
    //   r =  { from: reply.from, message: reply.message, reference: reply.reference }
    // }
    
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

    const message: Message = {
      id: randomId,
      chatId: currentTextChannel.chatId,
      origin: "self",
      timestamp: Date.now(),
      from: from,
      message: msg,
      group: true,
      cid: "",
      // readCount: 0,
      // lastAccessed: 0,
      reply: reply,
      reactions: {}
    }
    
    appendMessage(message)
    setReply(null)

    const gifResponse = await push.user!.chat.send(currentTextChannel.chatId, msg);

    // console.log("GIF RESPONSE: " + JSON.stringify(gifResponse))
  }

  return(
    <>
      <div className='flex flex-col h-[500px] w-[500px] justify-center'>
        <SearchBar/>
        {/* <SuggestionBar /> */}
        {/** 
            key will recreate the component, 
              this is important for when you change fetchGifs 
              e.g. changing from search term dogs to cats or type gifs to stickers
              you want to restart the gifs from the beginning and changing a component's key does that 
          **/}
        <div className='w-[500px] h-[475px] overflow-y-scroll justify-center'>
          <Grid key={searchKey} columns={2} width={485} fetchGifs={fetchGifs} onGifClick={onGifClick} noLink={true}/>
        </div>
      </div>
    </>
  )
}

export function GiphyGrid(){
  return(
    <>
      <div className="flex w-[500px] h-[500px] bg-deep-purple-300 rounded-t-xl">
        <SearchExperience/>
      </div>
    </>
  )
}
