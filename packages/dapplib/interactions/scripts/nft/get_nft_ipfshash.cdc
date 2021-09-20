import HyperverseNFTContract from "../../../contracts/Project/HyperverseNFTContract.cdc"

pub fun main(acct: Address, id: UInt64): String {
  let acctNFTCollectionRef = getAccount(acct).getCapability(/public/NFTCollection)
            .borrow<&HyperverseNFTContract.Collection{HyperverseNFTContract.INFTCollectionPublic}>()
            ?? panic("Could not borrow the public capability for the recipient's account")
  let borrowedNFT = acctNFTCollectionRef.borrowEntireNFT(id: id)
    ?? panic("Could not borrow the NFT from the user's collection")
  let ipfshash: String = borrowedNFT.ipfsHash
  return ipfshash
}