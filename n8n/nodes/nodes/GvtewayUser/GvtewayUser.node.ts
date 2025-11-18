import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class GvtewayUser implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'GVTEWAY User',
    name: 'gvtewayUser',
    icon: 'file:gvteway.svg',
    group: ['transform'],
    version: 1,
    description: 'Manage GVTEWAY users',
    defaults: {
      name: 'GVTEWAY User',
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
            name: 'Get',
            value: 'get',
            description: 'Get a user',
            action: 'Get a user',
          },
          {
            name: 'Update',
            value: 'update',
            description: 'Update user profile',
            action: 'Update user',
          },
          {
            name: 'Get Preferences',
            value: 'getPreferences',
            description: 'Get user preferences',
            action: 'Get preferences',
          },
          {
            name: 'Update Preferences',
            value: 'updatePreferences',
            description: 'Update user preferences',
            action: 'Update preferences',
          },
          {
            name: 'Get Tickets',
            value: 'getTickets',
            description: 'Get user tickets',
            action: 'Get tickets',
          },
          {
            name: 'Get Orders',
            value: 'getOrders',
            description: 'Get user orders',
            action: 'Get orders',
          },
          {
            name: 'Add to Wishlist',
            value: 'addWishlist',
            description: 'Add event to wishlist',
            action: 'Add to wishlist',
          },
        ],
        default: 'get',
      },
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        default: '',
        required: true,
        description: 'The ID of the user',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['update'],
          },
        },
        description: 'User name',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['update'],
          },
        },
        description: 'User email',
      },
      {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['update'],
          },
        },
        description: 'User phone number',
      },
      {
        displayName: 'Preferences',
        name: 'preferences',
        type: 'json',
        default: '{}',
        displayOptions: {
          show: {
            operation: ['updatePreferences'],
          },
        },
        description: 'User preferences as JSON',
      },
      {
        displayName: 'Event ID',
        name: 'eventId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['addWishlist'],
          },
        },
        description: 'Event ID to add to wishlist',
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
        const userId = this.getNodeParameter('userId', i) as string;

        if (operation === 'get') {
          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/users/${userId}`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'update') {
          const name = this.getNodeParameter('name', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const phone = this.getNodeParameter('phone', i) as string;

          const options = {
            method: 'PATCH',
            uri: `${baseUrl}/api/users/${userId}`,
            body: {
              name: name || undefined,
              email: email || undefined,
              phone: phone || undefined,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'getPreferences') {
          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/users/${userId}/preferences`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'updatePreferences') {
          const preferences = this.getNodeParameter('preferences', i) as string;

          const options = {
            method: 'PATCH',
            uri: `${baseUrl}/api/users/${userId}/preferences`,
            body: JSON.parse(preferences),
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'getTickets') {
          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/users/${userId}/tickets`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'getOrders') {
          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/users/${userId}/orders`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'addWishlist') {
          const eventId = this.getNodeParameter('eventId', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/users/${userId}/wishlist`,
            body: {
              eventId,
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
