import NonFungibleToken from "../../../contracts/Flow/NonFungibleToken.cdc"
import HyperverseNFTContract from "../../../contracts/Project/HyperverseNFTContract.cdc"

pub fun main(acct: Address): [UInt64] {
  let acctNFTCollectionRef = getAccount(acct).getCapability(/public/NFTCollection)
            .borrow<&HyperverseNFTContract.Collection{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow the public capability for the recipient's account")
  return acctNFTCollectionRef.getIDs()
}