import { useEffect, useRef, useState } from "react"
import { useDirectMessageStore } from "../../state-management/dmStore"
import { useGlobalStore } from "../../state-management/globalStore"
import { useCallStore, useServerStore, useUserStore } from "../../state-management/store"
import { Messages } from "../server/Messages"
import { BottomBar } from "../server/Server"
import { push } from "../../App"
import { CONSTANTS, IFeeds, IMessageIPFS, TYPES, VideoCallStatus, VideoNotificationRules, VideoPeerInfo } from "@pushprotocol/restapi/src"
import { VIDEO_NOTIFICATION_ACCESS_TYPE } from "@pushprotocol/restapi/src/lib/payloads/constants"
import { PushStream } from "@pushprotocol/restapi/src/lib/pushstream/PushStream"
import { Dialog, DialogPanel } from "@headlessui/react"

export function DirectMessage(){
// function DirectMessage(props: { recipient: { address: string, name: string | null, desc: string | null, picture: string | null } }){
  // const [recepientInfo, setRecipientInfo] = useState<any>('');
  const audio = useUserStore(user => user.audio)
  const video = useUserStore(user => user.video)
  const userProfiles = useServerStore((server) => server.userProfiles)
  // const currentDM = useGlobalStore((globals) => globals.currentDM)
  const currentDM = useDirectMessageStore((dm) => dm.currentDM)
  const setCurrentDM = useDirectMessageStore(dm => dm.setCurrentDM)
  const stream = useServerStore((server) => server.stream)
  const [participants, setParticipants] = useState<string[]>([])
  const [videoData, setVideoData] = useState<TYPES.VIDEO.DATA>(CONSTANTS.VIDEO.INITIAL_DATA);
  const [peerInfo, setPeerInfo] = useState<VideoPeerInfo | null>(null);
  const [openVideo, setOpenVideo] = useState(false)
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const incomingVideoRef = useRef<HTMLVideoElement>(null);

  const rules: VideoNotificationRules = {
    access: {
      type: VIDEO_NOTIFICATION_ACCESS_TYPE.PUSH_CHAT,
      data: {
        chatId: currentDM!
      },
    },
  }

  "df07eec6-a276-4535-bade-7c3164f43cd1"
  // console.log("STREAM 1: ", stream)

  // if(userProfiles[])

  useEffect(() => {
    fetchData()
  }, [currentDM, userProfiles])

  // useEffect(() => {
  //   if (videoData.incoming[0].status === VideoCallStatus.CONNECTED) {
  //     console.log("CALL CONNECTED in USE EFFECT!")
  //   }
  //   return () => {
  //   };
  // }, [videoData.incoming[0].status]);

  // useEffect(() => {
  //   console.log("USE EFFECT LOCAL: ", videoData.local)
  //   if (localVideoRef.current) {
  //     localVideoRef.current.srcObject = videoData.local.stream;
  //     localVideoRef.current.play();
  //   }
  // }, [videoData.local.stream]);

  // useEffect(() => {
  //   console.log("USE EFFECT INCOMING: ", videoData.incoming[0])
  //   if (incomingVideoRef.current) {
  //     incomingVideoRef.current.srcObject = videoData.incoming[0].stream;
  //     incomingVideoRef.current.play();
  //   }
  // }, [videoData.incoming[0].stream]);

  async function fetchData(){
    // maybe use wallets to get dm participant for no extra await time and api lookup
    // console.log("CURRENT DM IN FETCH DATA: ", currentDM?.wallets)
    const dmInfo = await push.user?.chat.info(currentDM!)
    // console.log("DM INFO: ", dmInfo)
    dmInfo?.participants.map((participant: string) => {
      const user = push.user?.account.toLowerCase()!
      const participantParsed = participant.split(':')[1].toLowerCase()!
      if(participantParsed != user){
        if(!participants.includes(participantParsed)){
          // console.log("PARTssss 1:", participants)
          setParticipants([...participants, participantParsed])
        }
      }
      console.log("profiles: ", userProfiles)
    })
  }

  async function callUser(){
    console.log("CURRENT DM:", currentDM)
    if(stream == undefined){
      console.log("STREAM IS UNDFINED! Try again....", stream)
    }else{
      // console.log("STREAM 2: ", stream)
      console.log("AUDIO:", audio)
      console.log("VIDEO:", video)
      const callInit = await push.user!.video.initialize(setVideoData, {
        stream: stream!, // pass the stream object, refer Stream Video
        config: {
          video: video, // to enable video on start, for frontend use
          audio: audio, // to enable audio on start, for frontend use
        },
        // media?: MediaStream, // to pass your existing media stream(for backend use)
      });

      // setCall(callInit)
      // setCurrentDM('0xF06863EaD6A1c82Eb976E2b8E5754a5e15b3C46D')
      console.log("USER BEFORE CALL:", push.user!.account)
      // console.log("Now Current Dm:", currentDM)
      
      if(push.user!.account != '0xDEC4399dDb5655237Ee0cCBEe1B79273FDD3B465'){
        console.log("STARTING CALL", callInit)
        // await callInit.request(['0xF06863EaD6A1c82Eb976E2b8E5754a5e15b3C46D'], {rules})
        // await callInit.request(['0xF06863EaD6A1c82Eb976E2b8E5754a5e15b3C46D'])
        await callInit.request(['0xDEC4399dDb5655237Ee0cCBEe1B79273FDD3B465'], {rules})
        // console.log("VIDEO DATA 1:", videoData)
      }else{
        console.log("JOINING CALL", callInit)
        // console.log("VIDEO DATA 2:", videoData)
        // console.log("PEER INFO: ", peerInfo)
        if(peerInfo){
           await callInit.approve('0x6cbC0AF4e8b1022aFaB474A68FdAbaD670BD452D', peerInfo);
        }else{
          await callInit.approve('0x6cbC0AF4e8b1022aFaB474A68FdAbaD670BD452D');
        }
      }
    }
  }


  stream!.on(CONSTANTS.STREAM.VIDEO, async (data: TYPES.VIDEO.EVENT) => {
    // console.log("VIDEO EVENT IS OCCURING IN DM!")

    if (data.event === CONSTANTS.VIDEO.EVENT.REQUEST) {
      console.log("REQUEST CALL!!! IN DM")
      console.log("DATA: ", data)
      setPeerInfo(data.peerInfo);
    }

    // if (data.event === CONSTANTS.VIDEO.EVENT) {
    //   console.log("REQUEST CALL!!! IN DM")
    //   console.log("DATA: ", data)
    //   setPeerInfo(data.peerInfo);
    // }
  })

  const participantNames = participants.map((participant: string) => {
    // console.log("part in map: ", participant)
    if(userProfiles[participant]){
      // console.log("LEN: ", participant.length, userProfiles)
      // console.log("profiles: ", userProfiles)
      // console.log("PART NAME: ", participant)
      return <div className="flex place-items-center gap-2"><img className="h-10 w-10 rounded-md shrink-0 object-cover select-none" src={userProfiles[participant].picture!}/>{userProfiles[participant].name!}</div>
    }else{
      return <div/>
    }
  })

  // function VideoModal(){
  //   // const stream = useCallStore((server) => server.stream)
  //   console.log("video.local.stream", videoData.local.stream)
  //   console.log("video.incoming", videoData.incoming[0])
  //   return (
  //     <>
  //       {/* <button onClick={() => setIsOpen(true)}>Open dialog</button> */}
  //       <Dialog open={openVideo} onClose={() => {setOpenVideo(false)}} className="relative z-50 text-deep-purple-100 select-none">
  //         <div className="fixed inset-0 flex w-screen items-center justify-center">
  //           <DialogPanel>
  //             <div className="flex gap-2 p-5 bg-deep-purple-100 rounded-lg">
                // <VideoPlayer stream={videoData.local.stream} isMuted={true}/>
                // <VideoPlayer stream={videoData.incoming[0].stream} isMuted={false} />
  //             </div>
  //           </DialogPanel>
  //         </div>
  //       </Dialog>
  //     </>
  //   )
  // }

  
  function VideoPlayer(props: {stream: MediaStream | null, isMuted: boolean}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    // const videoRef = useRef<any>(null);
    console.log("LOCAL", videoData.local)
    console.log("INCOMING", videoData.incoming)
    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = props.stream;
        console.log("VIDEO REF: " + videoRef.current.srcObject)
        videoRef.current.play();
      }
    }, [videoRef, videoData.incoming, videoData.local]);

    return <video className="w-[500px] h-[500px] border-2 rounded" ref={videoRef} muted={props.isMuted} autoPlay/>;
    // return <video className="w-[500px] h-[500px] border-2 rounded" ref={videoRef} muted={props.isMuted} autoPlay/>;
  }

  return(
    <>
      <div className="flex flex-col overflow-hidden h-full w-full bg-off-black-500">
        {/* <div className="flex gap-2 p-2 bg-off-black-600 place-items-center"> */}
        <div className="flex w-full gap-2 h-14 border-b z-10 border-off-black-700 justify-start p-2 shadow-md shadow-off-black-700 place-items-center shrink-0 text-2xl font-extralight">
          <div className="flex flex-grow">
            {/* <img className="h-16 w-16 rounded-md" src={''}/> */}
            {participantNames}
            {/* <div className="flex flex-col"> */}
              {/* <div>{props.recipient.name}</div> */}
              {/* <div>{props.recipient.address}</div> */}
            {/* </div> */}
          </div>
          <button className="p-2 bg-off-black-200 hover:bg-off-black-100 rounded" onClick={() => setOpenVideo(true)}> OPEN VIDEO </button>
          <button className="p-2 bg-off-black-200 hover:bg-off-black-100 rounded" onClick={callUser}> CALL </button>
        </div>
        <Messages/>
        <BottomBar/>
      </div>
      {/* <VideoModal/> */}
      <Dialog open={openVideo} onClose={() => {setOpenVideo(false)}} className="relative z-50 text-deep-purple-100 select-none">
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <DialogPanel>
            <div className="flex gap-2 p-5 bg-deep-purple-100 rounded-lg">
              {/* <video className="w-[500px] h-[500px] border-2 rounded" ref={localVideoRef} muted={false} autoPlay/>;
              <video className="w-[500px] h-[500px] border-2 rounded" ref={incomingVideoRef} muted={false} autoPlay/>; */}
              <VideoPlayer stream={videoData.local.stream} isMuted={true}/>
              <VideoPlayer stream={videoData.incoming.length > 1 ? videoData.incoming[1].stream : videoData.incoming[0].stream} isMuted={false} />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
