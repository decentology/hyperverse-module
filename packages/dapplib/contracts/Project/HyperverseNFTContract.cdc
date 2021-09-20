import HyperverseInterface from "./HyperverseInterface.cdc"
import HyperverseService from "./HyperverseService.cdc"
import NonFungibleToken from "../Flow/NonFungibleToken.cdc"

pub contract HyperverseNFTContract: NonFungibleToken, HyperverseInterface {

    // The total number of Tenants that have registered
    // with this contract.
    pub var totalTenants: UInt64

    // Maps an address (of the customer/DappContract) to the amount
    // of tenants they have for a specific HyperverseContract.
    access(contract) var clientTenants: {Address: UInt64}

    // ITenant
    // An interface that exposes the totalSupply
    // and a function to update that totalSupply
    // inside this contract.
    // This is primarily used to update the totalSupply
    // during minting
    //
    pub resource interface ITenantMinter {
        access(contract) var totalSupply: UInt64
        access(contract) fun updateTotalSupply()
    }

    // Tenant
    // The resource that stores all the data per Tenant
    pub resource Tenant: ITenantMinter, HyperverseInterface.ITenant {
       // The Tenant's id
       pub let id: UInt64
       
       // The Tenant's AuthNFT
       // This acts as proof that the Tenant has registered
       // with the HyperverseService
       pub let authNFT: Capability<&HyperverseService.AuthNFT>

       // The total supply of NFTs minted by this Tenant
       pub var totalSupply: UInt64

       // A function to update the total supply in this contract.
       pub fun updateTotalSupply() {
           self.totalSupply = self.totalSupply + (1 as UInt64)
       }

       // A NFTMinter resource used to mint new NFTs
       access(self) let minter: @NFTMinter

       // A function that returns a reference to self.minter
       pub fun minterRef(): &NFTMinter {
           return &self.minter as &NFTMinter
       }

       init(_authNFT: Capability<&HyperverseService.AuthNFT>) {
           self.id = HyperverseNFTContract.totalTenants
           HyperverseNFTContract.totalTenants = HyperverseNFTContract.totalTenants + (1 as UInt64)

           self.authNFT = _authNFT

           self.totalSupply = 0

           self.minter <- create NFTMinter()
       }

       destroy() {
           destroy self.minter
       }
    }

    // This function is used to register with the contract and returns 
    // a new Tenant
    pub fun instance(authNFT: Capability<&HyperverseService.AuthNFT>): @Tenant {
        let clientTenant = authNFT.borrow()!.owner!.address
        if let count = self.clientTenants[clientTenant] {
            self.clientTenants[clientTenant] = self.clientTenants[clientTenant]! + (1 as UInt64)
        } else {
            self.clientTenants[clientTenant] = (1 as UInt64)
        }

        return <- create Tenant(_authNFT: authNFT)
    }

    // Returns self.clientTenants
    pub fun getTenants(): {Address: UInt64} {
        return self.clientTenants
    }

    // NFTContract

    // Paths
    //
    pub let TenantStoragePath: StoragePath
    pub let TenantMinterPath: PublicPath

    // An empty totalSupply simply used to conform to the NFT standard
    pub var totalSupply: UInt64

    // Events
    //
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    // NFT
    // Represents a simple NFT resource with an IPFS hash
    //
    pub resource NFT: NonFungibleToken.INFT {
        pub let id: UInt64

        pub let tenantID: UInt64

        pub var ipfsHash: String

        init(_tenant: &Tenant{ITenantMinter, HyperverseInterface.ITenant}, _ipfsHash: String) {
            self.id = _tenant.totalSupply
            self.tenantID = _tenant.id
            self.ipfsHash = _ipfsHash

            _tenant.updateTotalSupply()
            HyperverseNFTContract.totalSupply = HyperverseNFTContract.totalSupply + (1 as UInt64)
        }
    }

    // INFTCollectionPublic
    // A resource interface used to expose certain functions
    // in the Collection resource below
    //
    pub resource interface INFTCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT

        pub fun borrowEntireNFT(id: UInt64): &NFT? {
            // If the result isn't nil, the id of the returned reference
            // should be the same as the argument to the function
            post {
                (result == nil) || (result?.id == id): 
                    "Cannot borrow NFT reference: The ID of the returned reference is incorrect"
            }
        }
    }

    // Collection
    // Used to store NFTs. We laos use a tenantID
    // in order to ensure that this Collection only stores
    // NFTs from one Tenant, so NFTs from different Tenants don't
    // get mixed up in one Collection
    //
    pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, INFTCollectionPublic {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        // Indicates the NFTs that this Collection stores.
        // Ex. this stores NFTs ONLY from a Tenant with tenantID ___
        pub var tenantID: UInt64?

        init () {
            self.ownedNFTs <- {}
            self.tenantID = nil
        }

        // withdraw removes an NFT from the collection and moves it to the caller
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        // deposit takes a NFT and adds it to the collections dictionary
        // and adds the ID to the id array
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @HyperverseNFTContract.NFT

            if self.tenantID == nil {
                self.tenantID = token.tenantID
            } else if token.tenantID != self.tenantID {
                panic("This collection stores NFTs from a different Tenant")
            }

            let id: UInt64 = token.id

            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        // getIDs returns an array of the IDs that are in the collection
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        // borrowNFT gets a reference to an NFT in the collection
        // so that the caller can read its id and call its methods
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }

        // borrowEntireNFT gets a reference to an NFT in the collection
        // so that the caller can read its id & metadata and call its methods
        pub fun borrowEntireNFT(id: UInt64): &NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
                return ref as! &NFT
            } else {
                return nil
            }
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // public function that anyone can call to create a new empty collection
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    // Resource that an admin or something similar would own to be
    // able to mint new NFTs
    //
    pub resource NFTMinter {

        // mintNFT mints a new NFT with a new ID
        // and deposit it in the recipients collection using their collection reference
        pub fun mintNFT(tenant: &Tenant{ITenantMinter, HyperverseInterface.ITenant}, recipient: &{NonFungibleToken.CollectionPublic}, ipfsHash: String) {

            // create a new NFT
            var newNFT <- create NFT(_tenant: tenant, _ipfsHash: ipfsHash)

            // deposit it in the recipient's account using their reference
            recipient.deposit(token: <-newNFT)
        }
    }

    init() {
        self.totalTenants = 0
        // Initialize the total supply
        self.totalSupply = 0

        // Multitenancy
        
        self.clientTenants = {}

        // Set Named paths
        self.TenantStoragePath = /storage/HyperverseNFTContractTenant
        self.TenantMinterPath = /public/HyperverseNFTContractTenant

        emit ContractInitialized()
    }
}