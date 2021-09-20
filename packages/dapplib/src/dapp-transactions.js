// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
// ⚠️ THIS FILE IS AUTO-GENERATED WHEN packages/dapplib/interactions CHANGES
// DO **** NOT **** MODIFY CODE HERE AS IT WILL BE OVER-WRITTEN
// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨

const fcl = require("@onflow/fcl");

module.exports = class DappTransactions {

	static hyperverse_get_tenant() {
		return fcl.transaction`
import HyperverseNFTContract from 0x01cf0e2f2f715450
import HyperverseService from 0x01cf0e2f2f715450
import HyperverseInterface from 0x01cf0e2f2f715450

// This transaction allows any Tenant to receive a Tenant Resource from
// HyperverseNFTIPFSContract. It saves the resource to account storage.
//
// Note that this can only be called by someone who has already registered
// with the HyperverseService and received an AuthNFT.

transaction() {

  prepare(acct: AuthAccount) {
    // save the Tenant resource to the account if it doesn't already exist
    if acct.borrow<&HyperverseNFTContract.Tenant>(from: /storage/NFTContract) == nil {
      let privateCapability = acct.getCapability<&HyperverseService.AuthNFT>(/private/HyperverseServiceAuthNFT)
      
      // save the new Tenant resource from HyperverseNFTIPFSContract to account storage
      acct.save(<-HyperverseNFTContract.instance(authNFT: privateCapability), to: HyperverseNFTContract.TenantStoragePath)

      // link the Tenant resource to the public with ITenant restrictions
      acct.link<&HyperverseNFTContract.Tenant{HyperverseInterface.ITenant, HyperverseNFTContract.ITenantMinter}>(HyperverseNFTContract.TenantMinterPath, target: HyperverseNFTContract.TenantStoragePath)
    }
  }

  execute {
    log("Registered a new Tenant for HyperverseNFTContract.")
  }
}

		`;
	}

	static hyperverse_register() {
		return fcl.transaction`
import HyperverseService from 0x01cf0e2f2f715450
import FlowToken from 0x0ae53cb6e3f42a79

// Allows a Tenant to register with the HyperverseService. It will
// save an AuthNFT to account storage. Once an account
// has an AuthNFT, they can then get Tenant Resources from any contract
// in the Hyperverse.
//
// Note that this only ever needs to be called once per Tenant

transaction() {

    prepare(acct: AuthAccount) {
        // if this account doesn't already have an AuthNFT...
        if acct.borrow<&HyperverseService.AuthNFT>(from: HyperverseService.AuthStoragePath) == nil {
            let flowTokenVault = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
                                ?? panic("Could not borrow the FlowToken Vault")

            // We link this so we can send in a Capability to the HyperverseService
            let privateCapability = acct.link<&FlowToken.Vault>(/private/FlowTokenVaultHyperverseServiceAuthNFT, target: /storage/flowTokenVault)
                                        ?? panic("Capability was linked incorrectly")
            // save a new AuthNFT to account storage
            acct.save(<-HyperverseService.register(flowTokenVault: privateCapability), to: HyperverseService.AuthStoragePath)  
            acct.link<&HyperverseService.AuthNFT>(/private/HyperverseServiceAuthNFT, target: HyperverseService.AuthStoragePath)
        }
    }

    execute {

    }
}
		`;
	}

	static nft_mint_nft() {
		return fcl.transaction`
import NonFungibleToken from 0x01cf0e2f2f715450
import HyperverseNFTContract from 0x01cf0e2f2f715450

// This transction uses the NFTMinter resource to mint a new NFT.
//
// It must be run with the account that has a minter resource. In this case,
// we are calling the transaction with the Tenant itself because it stores
// an NFTMinter resource in the Tenant resource

transaction(recipient: Address, ipfsHash: String) {
    
    // the tenant
    let tenant: &HyperverseNFTContract.Tenant
    let receiver: &HyperverseNFTContract.Collection{NonFungibleToken.CollectionPublic}

    prepare(acct: AuthAccount) {

        self.tenant = acct.borrow<&HyperverseNFTContract.Tenant>(from: HyperverseNFTContract.TenantStoragePath)
                        ?? panic("Could not borrow the Tenant")
         // borrow the recipient's public NFT collection reference
        self.receiver = getAccount(recipient).getCapability(/public/NFTCollection)
            .borrow<&HyperverseNFTContract.Collection{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")
        
    }

    execute {
        // get a reference to an NFTMinter resource from the Tenant
        let minter = self.tenant.minterRef()

        // mint the NFT and deposit it to the recipient's collection
        minter.mintNFT(tenant: self.tenant, recipient: self.receiver, ipfsHash: ipfsHash)
    }
}
		`;
	}

	static nft_provision_account() {
		return fcl.transaction`
import HyperverseNFTContract from 0x01cf0e2f2f715450
import NonFungibleToken from 0x01cf0e2f2f715450

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

		`;
	}

	static nft_transfer_nft() {
		return fcl.transaction`
import HyperverseNFTContract from 0x01cf0e2f2f715450
import NonFungibleToken from 0x01cf0e2f2f715450

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
		`;
	}

}
