import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class AtlvsAsset implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'ATLVS Asset',
    name: 'atlvsAsset',
    icon: 'file:atlvs.svg',
    group: ['transform'],
    version: 1,
    description: 'Manage ATLVS assets and equipment',
    defaults: {
      name: 'ATLVS Asset',
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
            name: 'Get Asset',
            value: 'get',
            description: 'Get asset details',
            action: 'Get asset',
          },
          {
            name: 'List Assets',
            value: 'list',
            description: 'List all assets',
            action: 'List assets',
          },
          {
            name: 'Check Availability',
            value: 'checkAvailability',
            description: 'Check asset availability',
            action: 'Check availability',
          },
          {
            name: 'Book Asset',
            value: 'book',
            description: 'Book asset for project',
            action: 'Book asset',
          },
          {
            name: 'Release Asset',
            value: 'release',
            description: 'Release booked asset',
            action: 'Release asset',
          },
          {
            name: 'Log Maintenance',
            value: 'logMaintenance',
            description: 'Log maintenance activity',
            action: 'Log maintenance',
          },
        ],
        default: 'get',
      },
      {
        displayName: 'Asset ID',
        name: 'assetId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['get', 'checkAvailability', 'book', 'release', 'logMaintenance'],
          },
        },
        description: 'The ID of the asset',
      },
      {
        displayName: 'Asset Type',
        name: 'assetType',
        type: 'options',
        options: [
          {
            name: 'All Types',
            value: '',
          },
          {
            name: 'Equipment',
            value: 'EQUIPMENT',
          },
          {
            name: 'Vehicle',
            value: 'VEHICLE',
          },
          {
            name: 'Venue',
            value: 'VENUE',
          },
          {
            name: 'Tool',
            value: 'TOOL',
          },
        ],
        default: '',
        displayOptions: {
          show: {
            operation: ['list'],
          },
        },
        description: 'Filter by asset type',
      },
      {
        displayName: 'Project ID',
        name: 'projectId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['book'],
          },
        },
        description: 'Project to book asset for',
      },
      {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'dateTime',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['book', 'checkAvailability'],
          },
        },
        description: 'Booking start date',
      },
      {
        displayName: 'End Date',
        name: 'endDate',
        type: 'dateTime',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['book', 'checkAvailability'],
          },
        },
        description: 'Booking end date',
      },
      {
        displayName: 'Maintenance Type',
        name: 'maintenanceType',
        type: 'options',
        options: [
          {
            name: 'Routine',
            value: 'ROUTINE',
          },
          {
            name: 'Repair',
            value: 'REPAIR',
          },
          {
            name: 'Inspection',
            value: 'INSPECTION',
          },
          {
            name: 'Upgrade',
            value: 'UPGRADE',
          },
        ],
        default: 'ROUTINE',
        displayOptions: {
          show: {
            operation: ['logMaintenance'],
          },
        },
        description: 'Type of maintenance',
      },
      {
        displayName: 'Notes',
        name: 'notes',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        displayOptions: {
          show: {
            operation: ['logMaintenance'],
          },
        },
        description: 'Maintenance notes',
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

        if (operation === 'get') {
          const assetId = this.getNodeParameter('assetId', i) as string;

          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/assets/${assetId}`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'list') {
          const assetType = this.getNodeParameter('assetType', i) as string;

          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/assets`,
            qs: {
              type: assetType || undefined,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'checkAvailability') {
          const assetId = this.getNodeParameter('assetId', i) as string;
          const startDate = this.getNodeParameter('startDate', i) as string;
          const endDate = this.getNodeParameter('endDate', i) as string;

          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/assets/${assetId}/availability`,
            qs: {
              startDate,
              endDate,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'book') {
          const assetId = this.getNodeParameter('assetId', i) as string;
          const projectId = this.getNodeParameter('projectId', i) as string;
          const startDate = this.getNodeParameter('startDate', i) as string;
          const endDate = this.getNodeParameter('endDate', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/assets/${assetId}/book`,
            body: {
              projectId,
              startDate,
              endDate,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'release') {
          const assetId = this.getNodeParameter('assetId', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/assets/${assetId}/release`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'logMaintenance') {
          const assetId = this.getNodeParameter('assetId', i) as string;
          const maintenanceType = this.getNodeParameter('maintenanceType', i) as string;
          const notes = this.getNodeParameter('notes', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/assets/${assetId}/maintenance`,
            body: {
              type: maintenanceType,
              notes,
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
