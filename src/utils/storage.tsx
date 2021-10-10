import { providers } from "ethers";
import { init } from "@textile/eth-storage";

declare global {
    interface Window {
        ethereum:any;
    }
}
// See also https://docs.metamask.io/guide/rpc-api.html#permissions
export async function storeState(web3:any){
    await window.ethereum.enable();
    const provider = new providers.Web3Provider(window.ethereum);
    const wallet = provider.getSigner();

    const storage = await init(wallet);

    const blob = new Blob(["Hello, world!"], { type: "text/plain" });
    const file = new File([blob], "welcome.txt", {
    type: "text/plain",
    lastModified: new Date().getTime(),
    });

    try {
        await storage.addDeposit();
    } catch(err) {
        console.log(err);
    }

    const { id, cid } = await storage.store(file);

    const { request, deals } = await storage.status(id);
    console.log(request.status_code);
    console.log([deals]);

    return cid;
}