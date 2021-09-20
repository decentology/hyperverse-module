import HyperverseNFTContract from "../../../contracts/Project/HyperverseNFTContract.cdc"
import HyperverseService from "../../../contracts/Project/HyperverseService.cdc"
import HyperverseInterface from "../../../contracts/Project/HyperverseInterface.cdc"

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
