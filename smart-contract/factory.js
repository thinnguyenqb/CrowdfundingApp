import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x61583aB9BF763b0340d89Ad292Ebf27201C384D6"
);

export default instance;
