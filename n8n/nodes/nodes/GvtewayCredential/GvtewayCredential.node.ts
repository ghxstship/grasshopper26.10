import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class GvtewayCredential implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'GVTEWAY Credential',
    name: 'gvtewayCredential',
    icon: 'file:gvteway.svg',
    group: ['transform'],
    version: 1,
    description: 'Manage GVTEWAY digital credentials and wallet passes',
    defaults: {
      name: 'GVTEWAY Credential',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'gvtewayApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Add to Wallet',
            value: 'addToWallet',
            description: 'Add credential to digital wallet',
            action: 'Add to wallet',
          },
          {
            name: 'Get Wallet Pass',
            value: 'getWalletPass',
            description: 'Get wallet pass details',
            action: 'Get wallet pass',
          },
          {
            name: 'Update Wallet Pass',
            value: 'updateWalletPass',
            description: 'Update wallet pass',
            action: 'Update wallet pass',
          },
          {
            name: 'Revoke Pass',
            value: 'revokePass',
            description: 'Revoke a wallet pass',
            action: 'Revoke pass',
          },
          {
            name: 'Get NFT',
            value: 'getNft',
            description: 'Get NFT credential',
            action: 'Get NFT',
          },
          {
            name: 'Transfer NFT',
            value: 'transferNft',
            description: 'Transfer NFT credential',
            action: 'Transfer NFT',
          },
        ],
        default: 'addToWallet',
      },
      {
        displayName: 'Ticket ID',
        name: 'ticketId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['addToWallet', 'getNft', 'transferNft'],
          },
        },
        description: 'The ID of the ticket',
      },
      {
        displayName: 'Pass ID',
        name: 'passId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['getWalletPass', 'updateWalletPass', 'revokePass'],
          },
        },
        description: 'The ID of the wallet pass',
      },
      {
        displayName: 'Provider',
        name: 'provider',
        type: 'options',
        options: [
          {
            name: 'Apple Wallet',
            value: 'APPLE_WALLET',
          },
          {
            name: 'Google Wallet',
            value: 'GOOGLE_WALLET',
          },
        ],
        default: 'APPLE_WALLET',
        displayOptions: {
          show: {
            operation: ['addToWallet'],
          },
        },
        description: 'Wallet provider',
      },
      {
        displayName: 'Metadata',
        name: 'metadata',
        type: 'json',
        default: '{}',
        displayOptions: {
          show: {
            operation: ['updateWalletPass'],
          },
        },
        description: 'Pass metadata to update',
      },
      {
        displayName: 'To Address',
        name: 'toAddress',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['transferNft'],
          },
        },
        description: 'Wallet address to transfer NFT to',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const operation = this.getNodeParameter('operation', 0) as string;
    const credentials = await this.getCredentials('gvtewayApi');
    const baseUrl = credentials.baseUrl as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData;

        if (operation === 'addToWallet') {
          const ticketId = this.getNodeParameter('ticketId', i) as string;
          const provider = this.getNodeParameter('provider', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/credentials/wallet`,
            body: {
              ticketId,
              provider,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'getWalletPass') {
          const passId = this.getNodeParameter('passId', i) as string;

          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/credentials/wallet/${passId}`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'updateWalletPass') {
          const passId = this.getNodeParameter('passId', i) as string;
          const metadata = this.getNodeParameter('metadata', i) as string;

          const options = {
            method: 'PATCH',
            uri: `${baseUrl}/api/credentials/wallet/${passId}`,
            body: JSON.parse(metadata),
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'revokePass') {
          const passId = this.getNodeParameter('passId', i) as string;

          const options = {
            method: 'DELETE',
            uri: `${baseUrl}/api/credentials/wallet/${passId}`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'getNft') {
          const ticketId = this.getNodeParameter('ticketId', i) as string;

          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/credentials/nft/${ticketId}`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'transferNft') {
          const ticketId = this.getNodeParameter('ticketId', i) as string;
          const toAddress = this.getNodeParameter('toAddress', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/credentials/nft/${ticketId}/transfer`,
            body: {
              toAddress,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData),
          { itemData: { item: i } },
        );

        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: (error as Error).message,
            },
            pairedItem: {
              item: i,
            },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
