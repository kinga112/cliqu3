// import { LensClient, development, EvmAddress } from '@lens-protocol/client';
// import { fetchAccounts } from '@lens-protocol/client/actions';
// // import { evmAddress } from "@lens-protocol/client";
// // import { fetchAccounts } from "@lens-protocol/client";

// const client = new LensClient({
//   environment: development,
// });

// export async function fetchLensAccounts(addresses: Array<string>){
//   let evmAddresses: EvmAddress[] = []
//   addresses.map((address: string) => {
//     evmAddresses.push(evmAddress(address))
//   })
//   const result = await fetchAccounts(client, {
//     addresses: evmAddresses,
//   });
  
//   if (result.isErr()) {
//     return console.error(result.error);
//   }else{
//     return result.value;
//   }
// }
