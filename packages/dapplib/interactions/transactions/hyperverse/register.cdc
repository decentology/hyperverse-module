import HyperverseService from "../../../contracts/Project/HyperverseService.cdc"
import FlowToken from "../../../contracts/Flow/FlowToken.cdc"

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