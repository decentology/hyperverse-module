import HyperverseNFTContract from "../../../contracts/Project/HyperverseNFTContract.cdc"
import NonFungibleToken from "../../../contracts/Flow/NonFungibleToken.cdc"

// This transaction is used to transfer an NFT from acct --> recipient

transaction(id: UInt64, recipient: Address) {
  let giverNFTCollectionRef: &HyperverseNFTContract.Collection
  let recipientNFTCollectionRef: &HyperverseNFTContract.Collection{NonFungibleToken.CollectionPublic}

  prepare(acct: AuthAccount) {
      self.giverNFTCollectionRef = acct.borrow<&HyperverseNFTContract.Collection>(from: /storage/NFTCollection)
        ?? panic("Could not borrow the user's NFT Collection")
      self.recipientNFTCollectionRef = getAccount(recipient).getCapability(/public/NFTCollection)
          .borrow<&HyperverseNFTContract.Collection{NonFungibleToken.CollectionPublic}>()
          ?? panic("Could not borrow the public capability for the recipient's account")
  } 

  execute {
      let nft <- self.giverNFTCollectionRef.withdraw(withdrawID: id)
      
      self.recipientNFTCollectionRef.deposit(token: <-nft)

      log("Transfered the NFT from the giver to the recipient")
  }
}