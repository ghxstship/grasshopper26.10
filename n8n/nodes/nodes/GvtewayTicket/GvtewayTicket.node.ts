/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

export class GvtewayTicket implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'GVTEWAY Ticket',
    name: 'gvtewayTicket',
    icon: 'file:gvteway.svg',
    group: ['transform'],
    version: 1,
    description: 'Manage GVTEWAY tickets',
    defaults: {
      name: 'GVTEWAY Ticket',
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
            name: 'Create',
            value: 'create',
            description: 'Create a new ticket',
            action: 'Create a ticket',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get a ticket',
            action: 'Get a ticket',
          },
          {
            name: 'Update',
            value: 'update',
            description: 'Update a ticket',
            action: 'Update a ticket',
          },
          {
            name: 'Transfer',
            value: 'transfer',
            description: 'Transfer a ticket',
            action: 'Transfer a ticket',
          },
          {
            name: 'Generate QR',
            value: 'generateQr',
            description: 'Generate QR code for ticket',
            action: 'Generate QR code',
          },
          {
            name: 'Mint NFT',
            value: 'mintNft',
            description: 'Mint ticket as NFT',
            action: 'Mint NFT ticket',
          },
        ],
        default: 'get',
      },
      {
        displayName: 'Ticket ID',
        name: 'ticketId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['get', 'update', 'transfer', 'generateQr', 'mintNft'],
          },
        },
        description: 'The ID of the ticket',
      },
      {
        displayName: 'Event ID',
        name: 'eventId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['create'],
          },
        },
        description: 'The ID of the event',
      },
      {
        displayName: 'Ticket Type ID',
        name: 'ticketTypeId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['create'],
          },
        },
        description: 'The ID of the ticket type',
      },
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['create'],
          },
        },
        description: 'The ID of the user',
      },
      {
        displayName: 'Order ID',
        name: 'orderId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['create'],
          },
        },
        description: 'The ID of the order',
      },
      {
        displayName: 'New Owner ID',
        name: 'newOwnerId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['transfer'],
          },
        },
        description: 'The ID of the new ticket owner',
      },
      {
        displayName: 'Wallet Address',
        name: 'walletAddress',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['mintNft'],
          },
        },
        description: 'The wallet address to mint NFT to',
      },
      {
        displayName: 'Chain',
        name: 'chain',
        type: 'options',
        options: [
          {
            name: 'Ethereum',
            value: 'ethereum',
          },
          {
            name: 'Polygon',
            value: 'polygon',
          },
        ],
        default: 'polygon',
        displayOptions: {
          show: {
            operation: ['mintNft'],
          },
        },
        description: 'The blockchain to mint on',
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

        if (operation === 'create') {
          const eventId = this.getNodeParameter('eventId', i) as string;
          const ticketTypeId = this.getNodeParameter('ticketTypeId', i) as string;
          const userId = this.getNodeParameter('userId', i) as string;
          const orderId = this.getNodeParameter('orderId', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/tickets`,
            body: {
              eventId,
              ticketTypeId,
              userId,
              orderId,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'get') {
          const ticketId = this.getNodeParameter('ticketId', i) as string;

          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/tickets/${ticketId}`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'transfer') {
          const ticketId = this.getNodeParameter('ticketId', i) as string;
          const newOwnerId = this.getNodeParameter('newOwnerId', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/tickets/${ticketId}/transfer`,
            body: {
              newOwnerId,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'generateQr') {
          const ticketId = this.getNodeParameter('ticketId', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/tickets/${ticketId}/qr`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'mintNft') {
          const ticketId = this.getNodeParameter('ticketId', i) as string;
          const walletAddress = this.getNodeParameter('walletAddress', i) as string;
          const chain = this.getNodeParameter('chain', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/tickets/${ticketId}/mint-nft`,
            body: {
              walletAddress,
              chain,
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
              error: error.message,
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
