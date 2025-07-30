import { useHookstate } from "@hookstate/core";
import { _openCreateServerModal } from "../../../screens/globalState";
import { useState } from "react";
import { createServer } from "../../../gun";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export function CreateServerModal(){
    const openModal = useHookstate(_openCreateServerModal);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState('');
    const [showError, setShowError] = useState(false);
  
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("EVENT: " + event.target.value);
      setName(event.target.value)
    }
  
    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("EVENT: " + event.target.value);
      setDescription(event.target.value)
    }
  
    const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("EVENT: " + event.target.value);
      setPicture(event.target.value)
    }
    
    let textColor = 'text-deep-purple-300'
    if(showError){
      textColor = 'text-red-500'
    }
  
    function onServerAdd(){
      if(name == ''){
        setShowError(true);
      }else{
        // props.db!.createServer(serverName);
        createServer(name, description, picture)
        openModal.set(false);
        setShowError(false);
        setName('')
        setDescription('')
        setPicture('')
      }
    }
  
    return (
      <>
        {/* <button onClick={() => setIsOpen(true)}>Open dialog</button> */}
        <Dialog open={openModal.value} onClose={() => {openModal.set(false);setShowError(false);}} className="relative z-50 text-deep-purple-100 select-none">
          <div className="fixed inset-0 flex w-screen items-center justify-center">
            <DialogPanel className="flex flex-col max-w-lg space-y-1 bg-deep-purple-300 p-10 rounded-md">
              <DialogTitle className="font-light text-3xl">Create New Server</DialogTitle>
              <div className={textColor}>Server name cannot be empty</div>
              <div className="flex gap-2">
                <div className="bg-deep-purple-100 rounded-xl w-32 h-32">
                  {picture != '' ? <img className="w-32 h-32 rounded-xl object-cover" src={picture}/> : <div/>}
                </div>
                <div className="flex flex-col gap-1">
                  <input className="bg-deep-purple-400 p-2 rounded-md" placeholder="server name" onChange={handleNameChange}/>
                  <input className="bg-deep-purple-400 p-2 rounded-md" placeholder="description" onChange={handleDescriptionChange}/>
                  <input className="bg-deep-purple-400 p-2 rounded-md" placeholder="icon image address link" onChange={handlePictureChange}/>
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <button className="bg-slate-900 p-2 w-20 rounded-md hover:text-deep-purple-200" onClick={() => {onServerAdd()}}>Add</button>
                <button className="bg-slate-900 p-2 w-20 rounded-md hover:text-deep-purple-200" onClick={() => {openModal.set(false);setShowError(false);}}>Cancel</button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </>
    )
  }
  