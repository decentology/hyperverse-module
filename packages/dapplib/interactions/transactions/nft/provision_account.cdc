import HyperverseNFTContract from "../../../contracts/Project/HyperverseNFTContract.cdc"
import NonFungibleToken from "../../../contracts/Flow/NonFungibleToken.cdc"

// sets up an account (any user who wants to interact with the Marketplace)
// the ability to deal with NFTs. It gives them an NFT Collection

transaction {

  prepare(acct: AuthAccount) {
    // if the account doesn't already have an NFT Collection
    if acct.borrow<&HyperverseNFTContract.Collection>(from: /storage/NFTCollection) == nil {

      // create a new empty collection
      let nftCollection <- HyperverseNFTContract.createEmptyCollection()
            
      // save it to the account
      acct.save(<-nftCollection, to: /storage/NFTCollection)

      // create a public capability for the collection
      acct.link<&HyperverseNFTContract.Collection{NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, HyperverseNFTContract.INFTCollectionPublic}>(/public/NFTCollection, target: /storage/NFTCollection)
    
      log("Gave account an NFT Collection")
    }
  }

  execute {
    
  }
}
