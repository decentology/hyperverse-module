# Example Hyperverse NFT Module

## Explaining Composability on Flow

Please see the Week 3 content (Days 1 & 2) of the finished Fast Floward bootcamp: https://github.com/decentology/fast-floward-1/tree/main/week3

Here you can find the explanation for the technical implementation of composability on Flow.

**PLEASE NOTE:** *We have changed the term 'Registry' to be 'Hyperverse.' If you see any examples of the term 'Registry' in the week 3 content, it is now named 'Hyperverse.'*

## Figuring out DappStarter

Please see the Week 2 content (Days 1-4) of the finished Fast Floward bootcamp: https://github.com/decentology/fast-floward-1/tree/main/week2

Here you can find explanations and examples of how to develop on DappStarter.

## /packages/dapplib/contracts/Project

This folder has 3 contracts: HyperverseInterface, HyperverseService, and HyperverseNFTContract.

**HyperverseService** allows Tenants of the Hyperverse ecosystem to register with the Hyperverse. This only happens one time. Once a Tenant registers with the HyperverseService, they can interact with the Hyperverse all they want. They can get any Tenant resource from a Hyperverse Contract that implements the **HyperverseInterface**.

The **HyperverseInterface** is a Contract Interface that all composable Hyperverse contracts must implement if they want to be in the ecosystem. You can see that **HyperverseNFTContract** implements **HyperverseInterface**. It specifies that composable smart contracts must have a `Tenant` resource that implements an `ITenant` Resource Interface. You can find the other requirements in the file itself.

## What You Could/Should Change

1) **HyperverseNFTContract** - change this to whatever your composable smart contract will be.
2) The `/packages/dapplib/src/interactions/transactions/nft` folder containing the transactions related to HyperverseNFTContract.
3) The `/packages/dapplib/src/interactions/scripts/nft` folder containing the transactions related to HyperverseNFTContract.

## What You Should NOT Change

Do not modify **HyperverseService.cdc** or **HyperverseInterface.cdc**. These are standard contracts we use for composability.

## How it Works

The pattern is like so:
1) A Tenant registers with the HyperverseService by calling the `register` transaction found in `/packages/dapplib/interactions/transactions/hyperverse/register.cdc`. 
2) A Tenant gets a `Tenant` resource from the composable smart contract they want (Note: They must have completed step 1 to do so because you need an `AuthNFT` resource to get a `Tenant` resource). In this example project, the Tenant gets the `Tenant` resource from the HyperverseNFTContract by calling the `get_tenant` transaction found in `/packages/dapplib/interactions/transactions/hyperverse/get_tenant.cdc`. 
3) Any account that wants to be able to receive NFTs must have setup their account to have an NFT Collection by calling the `provision_account` transaction. This can be found in `/packages/dapplib/interactions/transactions/nft/provision_account.cdc`. 
4) The Admin account can now mint NFTs and provisioned accounts can now interact with NFTs.

# Pre-requisites

In order to develop and build "My Dapp," the following pre-requisites must be installed:

* [Visual Studio Code](https://code.visualstudio.com/download) (or any IDE for editing Javascript)
* [NodeJS](https://nodejs.org/en/download/)
* [Yarn](https://classic.yarnpkg.com/en/docs/install) (DappStarter uses [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces))
* [Flow CLI](https://docs.onflow.org/flow-cli/install) (https://docs.onflow.org/flow-cli/install) (after installation run `flow cadence install-vscode-extension` to enable code highlighting for Cadence source files)

### Windows Users

Before you proceed with installation, it's important to note that many blockchain libraries either don't work or generate errors on Windows. If you try installation and can't get the startup scripts to completion, this may be the problem. In that case, it's best to install and run DappStarter using Windows Subsystem for Linux (WSL). Here's a [guide to help you install WSL](https://docs.decentology.com/guides/windows-subsystem-for-linux-wsl).

Blockchains known to require WSL: Solana

# Installation

Using a terminal (or command prompt), change to the folder containing the project files and type: `yarn` This will fetch all required dependencies. The process will take 1-3 minutes and while it is in progress you can move on to the next step.

# Yarn Errors

You might see failures related to the `node-gyp` package when Yarn installs dependencies.
These failures occur because the node-gyp package requires certain additional build tools
to be installed on your computer. Follow the [instructions](https://www.npmjs.com/package/node-gyp) for adding build tools and then try running `yarn` again.

# Start Your Project

Using a terminal (or command prompt), change to the folder containing the project files and type: `yarn start` This will run all the dev scripts in each project package.json.

# Test Your Project

Using a terminal (or command prompt), change to the folder containing the project files and type: `yarn test`. This will run the test file in `packages/dapplib/tests/nft-tests.js`


## File Locations
Here are the locations of some important files:
* Contract Code: [packages/dapplib/contracts](packages/dapplib/contracts)
* Dapp Library: [packages/dapplib/src/dapp-lib.js](packages/dapplib/src/dapp-lib.js) 
* Blockchain Interactions: [packages/dapplib/src/blockchain.js](packages/dapplib/src/blockchain.js)
* Unit Tests: [packages/dapplib/tests](packages/dapplib/tests)
* UI Test Harnesses: [packages/client/src/dapp/harness](packages/client/src/dapp/harness)

To view your dapp, open your browser to http://localhost:5000 for the DappStarter Workspace.

We ♥️ developers and want you to have an awesome experience. You should be experiencing Dappiness at this point. If not, let us know and we will help. Join our [Discord](https://discord.gg/XdtJfu8W) or hit us up on Twitter [@Decentology](https://twitter.com/decentology).


