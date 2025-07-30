export function convertAddress(address: string){
  try{
    if(address.split(':')[1] != undefined){
      return(address.split(':')[1].toLowerCase())
    }
  }catch{
    // console
  }
}
