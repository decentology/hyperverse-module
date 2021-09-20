import "../components/page-panel.js";
import "../components/page-body.js";
import "../components/action-card.js";
import "../components/account-widget.js";
import "../components/text-widget.js";
import "../components/number-widget.js";
import "../components/switch-widget.js";
import "../components/upload-widget.js";
import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('nft-harness')
export default class NftHarness extends LitElement {
  @property()
  title;
  @property()
  category;
  @property()
  description;

  createRenderRoot() {
    return this;
  }

  constructor(args) {
    super(args);
  }

  render() {
    let content = html`
      <page-body title="${this.title}" category="${this.category}" description="${this.description}">
      
        <!-- Hyperverse -->
      
        <action-card title="Hyperverse - Register"
          description="Register a Tenant with the HyperverseService to get an AuthNFT" action="registerHyperverse"
          method="post" fields="acct">
          <account-widget field="acct" label="Account">
          </account-widget>
        </action-card>
      
        <action-card title="NFT - Get NFT Tenant"
          description="Get an instance of a Tenant from HyperverseNFTIPFSContract to have your own data" action="nftTenant"
          method="post" fields="acct">
          <account-widget field="acct" label="Account">
          </account-widget>
        </action-card>
      
        <!-- NFT -->
      
        <action-card title="NFT - Provision Account" description="Set up a user account to handle NFTs"
          action="provisionAccountNFT" method="post" fields="acct">
          <account-widget field="acct" label="Account">
          </account-widget>
        </action-card>
      
        <action-card title="NFT - Mint NFT" description="Mint an NFT into an account using the Tenant's data" action="mintNFT"
          method="post" fields="acct recipient files">
          <account-widget field="acct" label="Tenant Account">
          </account-widget>
          <account-widget field="recipient" label="Recipient Account">
          </account-widget>
          <upload-widget data-field="files" field="file" label="NFT upload ipfshash" placeholder="select source file"
            multiple="true">
          </upload-widget>
        </action-card>
      
        <action-card title="NFT - Transfer NFT" description="Transfer an NFT from Giver --> Recipient" action="transferNFT"
          method="post" fields="giver recipient id">
          <account-widget field="giver" label="Giver">
          </account-widget>
          <account-widget field="recipient" label="Recipient">
          </account-widget>
          <text-widget field="id" label="ID" placeholder="0"></text-widget>
        </action-card>
      
        <action-card title="NFT - Get Owned NFTs" description="Get Owned NFTs" action="getNFTsInCollection" method="get"
          fields="acct">
          <account-widget field="acct" label="Account">
          </account-widget>
        </action-card>
      
        <action-card title="NFT - Get NFT Metadata" description="Get NFT Metadata" action="getNFTMetadata" method="get"
          fields="acct id">
          <account-widget field="acct" label="Account">
          </account-widget>
          <text-widget field="id" label="ID" placeholder="0"> </text-widget>
        </action-card>
      
        <action-card title="NFT - Get NFT IPFSHash" description="Get NFT IPFSHash" action="getNFTIPFSHash" method="get"
          fields="acct id">
          <account-widget field="acct" label="Account">
          </account-widget>
          <text-widget field="id" label="ID" placeholder="0"> </text-widget>
        </action-card>
      
        <!-- Flow Token -->
        <action-card title="Get Balance" description="Get the Flow Token balance of an account" action="getBalance"
          method="get" fields="account">
          <account-widget field="account" label="Account">
          </account-widget>
        </action-card>
      
      
      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}
