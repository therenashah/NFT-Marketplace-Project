import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

export default function Marketplace() {
const sampleData = [
    {
        "name": "NFT-1",
        "description": "Trikon's First NFT",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmTu1zypoc2sHgApNd1ws3V5Pqcqsscj99NNJGRYjXBDrH",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0x6948D8Bafd5F6d90B5BC123c5974697e8f3b8969",
    },
    {
        "name": "NFT-2",
        "description": "Trikon's Second NFT",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmYhVaYPMLwZpnZvwn6pLfWHzvhccZ8YJEghzfwKHoKbzQ",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0x6948D8Bafd5F6d90B5BC123c5974697e8f3b8969",
    },
    {
        "name": "NFT-3",
        "description": "Trikon's Third NFT",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmR3d9MYV82FaA2yYoLEBmCoNkm7J2sH1Yo6B1zEd8UnUh",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0x6948D8Bafd5F6d90B5BC123c5974697e8f3b8969",
    },
];
const [data, updateData] = useState(sampleData);
const [dataFetched, updateFetched] = useState(false);

async function getAllNFTs() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    let transaction = await contract.getAllNFTs()

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async i => {
        var tokenURI = await contract.tokenURI(i.tokenId);
        console.log("getting this tokenUri", tokenURI);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        return item;
    }))

    updateFetched(true);
    updateData(items);
}

if(!dataFetched)
    getAllNFTs();

return (
    <div>
        <Navbar></Navbar>
        <div className="flex flex-col place-items-center mt-20">
            <div className="md:text-xl font-bold text-white font-sans" style={{fontSize: '25px'}}>
                Top NFTs
            </div>
            <div className="flex mt-3 justify-between flex-wrap max-w-screen-xl text-center font-semibold">
                {data.map((value, index) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                })}
            </div>
        </div>            
    </div>
);

}
