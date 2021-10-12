import { providers } from "ethers";
import { init } from "@textile/eth-storage";

declare global {
    interface Window {
        ethereum:any;
    }
}
// See also https://docs.metamask.io/guide/rpc-api.html#permissions
export async function storeState(web3:any, file:any, SET_CURRENT_TXN:any, SET_ERROR:any){
    await window.ethereum.enable();
    const provider = new providers.Web3Provider(window.ethereum);
    const wallet = provider.getSigner();

    const storage = await init(wallet);

    try {
        SET_CURRENT_TXN(2);
        await storage.addDeposit();
    } catch(err) {
        console.log(err);
    }

    const { id, cid } = await storage.store(file);


    try {
        const { request, deals } = await storage.status(id);
        console.log(request.status_code);
        console.log([deals]);
    } catch(error){
        console.log('req and deals error.');
    }

    if(!cid){
        SET_ERROR(1);
    } else {
        return cid;
    }
}