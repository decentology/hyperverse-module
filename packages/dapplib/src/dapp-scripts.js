// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
// ⚠️ THIS FILE IS AUTO-GENERATED WHEN packages/dapplib/interactions CHANGES
// DO **** NOT **** MODIFY CODE HERE AS IT WILL BE OVER-WRITTEN
// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨

const fcl = require("@onflow/fcl");

module.exports = class DappScripts {

	static nft_get_nft_ipfshash() {
		return fcl.script`
import HyperverseNFTContract from 0x01cf0e2f2f715450

pub fun main(acct: Address, id: UInt64): String {
  let acctNFTCollectionRef = getAccount(acct).getCapability(/public/NFTCollection)
            .borrow<&HyperverseNFTContract.Collection{HyperverseNFTContract.INFTCollectionPublic}>()
            ?? panic("Could not borrow the public capability for the recipient's account")
  let borrowedNFT = acctNFTCollectionRef.borrowEntireNFT(id: id)
    ?? panic("Could not borrow the NFT from the user's collection")
  let ipfshash: String = borrowedNFT.ipfsHash
  return ipfshash
}
		`;
	}

	static nft_get_nft_metadata() {
		return fcl.script`
import HyperverseNFTContract from 0x01cf0e2f2f715450

pub fun main(acct: Address, id: UInt64): &HyperverseNFTContract.NFT {
  let acctNFTCollectionRef = getAccount(acct).getCapability(/public/NFTCollection)
            .borrow<&HyperverseNFTContract.Collection{HyperverseNFTContract.INFTCollectionPublic}>()
            ?? panic("Could not borrow the public capability for the recipient's account")
  let borrowedNFT = acctNFTCollectionRef.borrowEntireNFT(id: id)
    ?? panic("Could not borrow the NFT from the user's collection")
  
  return borrowedNFT
}
		`;
	}

	static nft_get_nfts_in_collection() {
		return fcl.script`
import NonFungibleToken from 0x01cf0e2f2f715450
import HyperverseNFTContract from 0x01cf0e2f2f715450

pub fun main(acct: Address): [UInt64] {
  let acctNFTCollectionRef = getAccount(acct).getCapability(/public/NFTCollection)
            .borrow<&HyperverseNFTContract.Collection{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow the public capability for the recipient's account")
  return acctNFTCollectionRef.getIDs()
}
		`;
	}

	static flowtoken_get_balance() {
		return fcl.script`
import FungibleToken from 0xee82856bf20e2aa6
import FlowToken from 0x0ae53cb6e3f42a79

pub fun main(account: Address): UFix64 {

    let vaultRef = getAccount(account)
        .getCapability(/public/flowTokenBalance)
        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}  
		`;
	}

}
