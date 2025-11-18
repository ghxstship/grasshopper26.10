import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class AtlvsBudget implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'ATLVS Budget',
    name: 'atlvsBudget',
    icon: 'file:atlvs.svg',
    group: ['transform'],
    version: 1,
    description: 'Manage ATLVS budgets and expenses',
    defaults: {
      name: 'ATLVS Budget',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'atlvsApi',
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
            name: 'Get Budget',
            value: 'get',
            description: 'Get budget details',
            action: 'Get budget',
          },
          {
            name: 'Create Expense',
            value: 'createExpense',
            description: 'Create new expense',
            action: 'Create expense',
          },
          {
            name: 'List Expenses',
            value: 'listExpenses',
            description: 'List budget expenses',
            action: 'List expenses',
          },
          {
            name: 'Check Budget Status',
            value: 'checkStatus',
            description: 'Check if budget is exceeded',
            action: 'Check budget status',
          },
          {
            name: 'Get Variance',
            value: 'getVariance',
            description: 'Get budget variance analysis',
            action: 'Get variance',
          },
          {
            name: 'Send Alert',
            value: 'sendAlert',
            description: 'Send budget alert',
            action: 'Send alert',
          },
        ],
        default: 'get',
      },
      {
        displayName: 'Project ID',
        name: 'projectId',
        type: 'string',
        default: '',
        required: true,
        description: 'The ID of the project',
      },
      {
        displayName: 'Category',
        name: 'category',
        type: 'options',
        options: [
          {
            name: 'Production',
            value: 'PRODUCTION',
          },
          {
            name: 'Talent',
            value: 'TALENT',
          },
          {
            name: 'Equipment',
            value: 'EQUIPMENT',
          },
          {
            name: 'Venue',
            value: 'VENUE',
          },
          {
            name: 'Marketing',
            value: 'MARKETING',
          },
          {
            name: 'Hospitality',
            value: 'HOSPITALITY',
          },
          {
            name: 'Travel',
            value: 'TRAVEL',
          },
          {
            name: 'Other',
            value: 'OTHER',
          },
        ],
        default: 'PRODUCTION',
        displayOptions: {
          show: {
            operation: ['createExpense'],
          },
        },
        description: 'Expense category',
      },
      {
        displayName: 'Amount',
        name: 'amount',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: {
            operation: ['createExpense'],
          },
        },
        description: 'Expense amount',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['createExpense'],
          },
        },
        description: 'Expense description',
      },
      {
        displayName: 'Vendor',
        name: 'vendor',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['createExpense'],
          },
        },
        description: 'Vendor name',
      },
      {
        displayName: 'Alert Type',
        name: 'alertType',
        type: 'options',
        options: [
          {
            name: 'Budget Exceeded',
            value: 'exceeded',
          },
          {
            name: 'Approaching Limit',
            value: 'approaching',
          },
          {
            name: 'Category Overspent',
            value: 'category_overspent',
          },
        ],
        default: 'exceeded',
        displayOptions: {
          show: {
            operation: ['sendAlert'],
          },
        },
        description: 'Type of budget alert',
      },
      {
        displayName: 'Recipients',
        name: 'recipients',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['sendAlert'],
          },
        },
        description: 'Comma-separated email addresses',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const operation = this.getNodeParameter('operation', 0) as string;
    const credentials = await this.getCredentials('atlvsApi');
    const baseUrl = credentials.baseUrl as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData;
        const projectId = this.getNodeParameter('projectId', i) as string;

        if (operation === 'get') {
          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/projects/${projectId}/budget`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'createExpense') {
          const category = this.getNodeParameter('category', i) as string;
          const amount = this.getNodeParameter('amount', i) as number;
          const description = this.getNodeParameter('description', i) as string;
          const vendor = this.getNodeParameter('vendor', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/projects/${projectId}/expenses`,
            body: {
              category,
              amount,
              description,
              vendor: vendor || undefined,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'listExpenses') {
          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/projects/${projectId}/expenses`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'checkStatus') {
          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/projects/${projectId}/budget/status`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'getVariance') {
          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/projects/${projectId}/budget/variance`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'sendAlert') {
          const alertType = this.getNodeParameter('alertType', i) as string;
          const recipients = this.getNodeParameter('recipients', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/projects/${projectId}/budget/alert`,
            body: {
              alertType,
              recipients: recipients.split(',').map(r => r.trim()),
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
