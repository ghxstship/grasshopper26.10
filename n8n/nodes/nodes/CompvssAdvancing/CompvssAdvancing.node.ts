import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class CompvssAdvancing implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'COMPVSS Advancing',
    name: 'compvssAdvancing',
    icon: 'file:compvss.svg',
    group: ['transform'],
    version: 1,
    description: 'Manage COMPVSS production advancing requests',
    defaults: {
      name: 'COMPVSS Advancing',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'compvssApi',
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
            name: 'Create Request',
            value: 'create',
            description: 'Create advancing request',
            action: 'Create advancing request',
          },
          {
            name: 'Get Request',
            value: 'get',
            description: 'Get advancing request',
            action: 'Get advancing request',
          },
          {
            name: 'Update Status',
            value: 'updateStatus',
            description: 'Update request status',
            action: 'Update request status',
          },
          {
            name: 'Approve',
            value: 'approve',
            description: 'Approve request',
            action: 'Approve request',
          },
          {
            name: 'Reject',
            value: 'reject',
            description: 'Reject request',
            action: 'Reject request',
          },
          {
            name: 'Add Result',
            value: 'addResult',
            description: 'Add result to request',
            action: 'Add result',
          },
        ],
        default: 'get',
      },
      {
        displayName: 'Request ID',
        name: 'requestId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['get', 'updateStatus', 'approve', 'reject', 'addResult'],
          },
        },
        description: 'The ID of the advancing request',
      },
      {
        displayName: 'Category',
        name: 'category',
        type: 'options',
        options: [
          {
            name: 'Access & Credentials',
            value: 'ACCESS_CREDENTIALS',
          },
          {
            name: 'Site Infrastructure',
            value: 'SITE_INFRASTRUCTURE',
          },
          {
            name: 'Site Assets',
            value: 'SITE_ASSETS',
          },
          {
            name: 'Site Utilities',
            value: 'SITE_UTILITIES',
          },
          {
            name: 'Site Vehicles',
            value: 'SITE_VEHICLES',
          },
          {
            name: 'Heavy Equipment',
            value: 'HEAVY_EQUIPMENT',
          },
          {
            name: 'Technical Production',
            value: 'TECHNICAL_PRODUCTION',
          },
          {
            name: 'Hospitality',
            value: 'HOSPITALITY',
          },
          {
            name: 'Travel & Logistics',
            value: 'TRAVEL_LOGISTICS',
          },
        ],
        default: 'ACCESS_CREDENTIALS',
        required: true,
        displayOptions: {
          show: {
            operation: ['create'],
          },
        },
        description: 'The category of the advancing request',
      },
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['create'],
          },
        },
        description: 'The title of the request',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        displayOptions: {
          show: {
            operation: ['create'],
          },
        },
        description: 'The description of the request',
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
        description: 'The ID of the user making the request',
      },
      {
        displayName: 'Priority',
        name: 'priority',
        type: 'options',
        options: [
          {
            name: 'Low',
            value: 'LOW',
          },
          {
            name: 'Medium',
            value: 'MEDIUM',
          },
          {
            name: 'High',
            value: 'HIGH',
          },
          {
            name: 'Urgent',
            value: 'URGENT',
          },
        ],
        default: 'MEDIUM',
        displayOptions: {
          show: {
            operation: ['create'],
          },
        },
        description: 'The priority of the request',
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
            name: 'Under Review',
            value: 'UNDER_REVIEW',
          },
          {
            name: 'Approved',
            value: 'APPROVED',
          },
          {
            name: 'Rejected',
            value: 'REJECTED',
          },
          {
            name: 'Changes Requested',
            value: 'CHANGES_REQUESTED',
          },
          {
            name: 'Completed',
            value: 'COMPLETED',
          },
        ],
        default: 'PENDING',
        displayOptions: {
          show: {
            operation: ['updateStatus'],
          },
        },
        description: 'The new status',
      },
      {
        displayName: 'Comments',
        name: 'comments',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        displayOptions: {
          show: {
            operation: ['approve', 'reject'],
          },
        },
        description: 'Comments for approval/rejection',
      },
      {
        displayName: 'Assigned Resources',
        name: 'assignedResources',
        type: 'json',
        default: '{}',
        displayOptions: {
          show: {
            operation: ['addResult'],
          },
        },
        description: 'Resources assigned to the request (JSON)',
      },
      {
        displayName: 'Notes',
        name: 'notes',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        displayOptions: {
          show: {
            operation: ['addResult'],
          },
        },
        description: 'Additional notes',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const operation = this.getNodeParameter('operation', 0) as string;
    const credentials = await this.getCredentials('compvssApi');
    const baseUrl = credentials.baseUrl as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData;

        if (operation === 'create') {
          const category = this.getNodeParameter('category', i) as string;
          const title = this.getNodeParameter('title', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          const userId = this.getNodeParameter('userId', i) as string;
          const priority = this.getNodeParameter('priority', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/advancing`,
            body: {
              category,
              title,
              description,
              userId,
              priority,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'get') {
          const requestId = this.getNodeParameter('requestId', i) as string;

          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/advancing/${requestId}`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'updateStatus') {
          const requestId = this.getNodeParameter('requestId', i) as string;
          const status = this.getNodeParameter('status', i) as string;

          const options = {
            method: 'PATCH',
            uri: `${baseUrl}/api/advancing/${requestId}`,
            body: {
              status,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'approve' || operation === 'reject') {
          const requestId = this.getNodeParameter('requestId', i) as string;
          const comments = this.getNodeParameter('comments', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/advancing/${requestId}/${operation}`,
            body: {
              comments,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'addResult') {
          const requestId = this.getNodeParameter('requestId', i) as string;
          const assignedResources = this.getNodeParameter('assignedResources', i) as string;
          const notes = this.getNodeParameter('notes', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/advancing/${requestId}/result`,
            body: {
              assignedResources: JSON.parse(assignedResources),
              notes,
              approved: true,
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
