import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x145C6483a54c284fcfC7654E72CA5b0FBdf06dfb"
);

export default instance;
