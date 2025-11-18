import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class GvtewayOrder implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'GVTEWAY Order',
    name: 'gvtewayOrder',
    icon: 'file:gvteway.svg',
    group: ['transform'],
    version: 1,
    description: 'Manage GVTEWAY orders',
    defaults: {
      name: 'GVTEWAY Order',
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
            description: 'Create a new order',
            action: 'Create an order',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get an order',
            action: 'Get an order',
          },
          {
            name: 'List',
            value: 'list',
            description: 'List orders',
            action: 'List orders',
          },
          {
            name: 'Update Status',
            value: 'updateStatus',
            description: 'Update order status',
            action: 'Update order status',
          },
          {
            name: 'Process Payment',
            value: 'processPayment',
            description: 'Process order payment',
            action: 'Process payment',
          },
          {
            name: 'Refund',
            value: 'refund',
            description: 'Refund an order',
            action: 'Refund order',
          },
        ],
        default: 'get',
      },
      {
        displayName: 'Order ID',
        name: 'orderId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['get', 'updateStatus', 'processPayment', 'refund'],
          },
        },
        description: 'The ID of the order',
      },
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['create', 'list'],
          },
        },
        description: 'The ID of the user',
      },
      {
        displayName: 'Event ID',
        name: 'eventId',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['create'],
          },
        },
        description: 'The ID of the event (optional)',
      },
      {
        displayName: 'Items',
        name: 'items',
        type: 'json',
        default: '[]',
        required: true,
        displayOptions: {
          show: {
            operation: ['create'],
          },
        },
        description: 'Order items as JSON array',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          {
            name: 'Pending',
            value: 'PENDING',
          },
          {
            name: 'Processing',
            value: 'PROCESSING',
          },
          {
            name: 'Completed',
            value: 'COMPLETED',
          },
          {
            name: 'Cancelled',
            value: 'CANCELLED',
          },
          {
            name: 'Refunded',
            value: 'REFUNDED',
          },
        ],
        default: 'PENDING',
        displayOptions: {
          show: {
            operation: ['updateStatus'],
          },
        },
        description: 'The new order status',
      },
      {
        displayName: 'Payment Method',
        name: 'paymentMethod',
        type: 'options',
        options: [
          {
            name: 'Credit Card',
            value: 'card',
          },
          {
            name: 'Apple Pay',
            value: 'apple_pay',
          },
          {
            name: 'Google Pay',
            value: 'google_pay',
          },
          {
            name: 'Crypto',
            value: 'crypto',
          },
        ],
        default: 'card',
        displayOptions: {
          show: {
            operation: ['processPayment'],
          },
        },
        description: 'Payment method to use',
      },
      {
        displayName: 'Amount',
        name: 'amount',
        type: 'number',
        default: 0,
        displayOptions: {
          show: {
            operation: ['refund'],
          },
        },
        description: 'Refund amount (leave empty for full refund)',
      },
      {
        displayName: 'Reason',
        name: 'reason',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['refund'],
          },
        },
        description: 'Reason for refund',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 10,
        displayOptions: {
          show: {
            operation: ['list'],
          },
        },
        description: 'Number of orders to return',
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
          const userId = this.getNodeParameter('userId', i) as string;
          const eventId = this.getNodeParameter('eventId', i) as string;
          const itemsJson = this.getNodeParameter('items', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/orders`,
            body: {
              userId,
              eventId: eventId || undefined,
              items: JSON.parse(itemsJson),
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'get') {
          const orderId = this.getNodeParameter('orderId', i) as string;

          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/orders/${orderId}`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'list') {
          const userId = this.getNodeParameter('userId', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;

          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/orders`,
            qs: {
              userId,
              limit,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'updateStatus') {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const status = this.getNodeParameter('status', i) as string;

          const options = {
            method: 'PATCH',
            uri: `${baseUrl}/api/orders/${orderId}`,
            body: {
              status,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'processPayment') {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const paymentMethod = this.getNodeParameter('paymentMethod', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/orders/${orderId}/payment`,
            body: {
              paymentMethod,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'refund') {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const amount = this.getNodeParameter('amount', i) as number;
          const reason = this.getNodeParameter('reason', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/orders/${orderId}/refund`,
            body: {
              amount: amount || undefined,
              reason,
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
