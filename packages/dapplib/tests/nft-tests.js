const assert = require('chai').assert;
const DappLib = require('../src/dapp-lib.js');
const fkill = require('fkill');

describe('Flow Dapp Tests', async () => {

    let config = null;
    before('setup contract', async () => {
        // Setup tasks for tests
        config = DappLib.getConfig();
    });

    after(() => {
        fkill(':3570');
    });

    describe('NFT Tests', async () => {

        it(`shall register with HyperverseService and receive NFT Tenant`, async () => {
            let testData = {
                acct: config.accounts[1]
            }

            await DappLib.registerHyperverse(testData);
            await DappLib.nftTenant(testData);
        });

        it(`shall set up account 2 with NFT Collection`, async () => {
            let testData = {
                acct: config.accounts[2]
            }

            await DappLib.provisionAccountNFT(testData);
        });

        it(`shall mint NFT into user account and check correct NFT id`, async () => {
            let testData1 = {
                acct: config.accounts[1],
                recipient: config.accounts[2],
                files: ["File 1", "File 2"]
            }
            let testData2 = {
                acct: config.accounts[2]
            }

            await DappLib.mintNFT(testData1);

            let res = await DappLib.getNFTsInCollection(testData2);

            assert.equal(res.result.length, 1, "NFT did not mint correctly");
            assert.equal(res.result[0], 0, "Minted NFT has the wrong ID");
        });
    });

});


