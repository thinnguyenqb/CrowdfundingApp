import web3 from "./web3";
import Campaign from "./build/Campaign.json";

export default (address) => {
  console.log(address)
  console.log(Campaign.interface)
  return new web3.eth.Contract(JSON.parse(Campaign.interface), address);
};
