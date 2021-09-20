import FungibleToken from "../../../contracts/Flow/FungibleToken.cdc"
import FlowToken from "../../../contracts/Flow/FlowToken.cdc"

pub fun main(account: Address): UFix64 {

    let vaultRef = getAccount(account)
        .getCapability(/public/flowTokenBalance)
        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}  