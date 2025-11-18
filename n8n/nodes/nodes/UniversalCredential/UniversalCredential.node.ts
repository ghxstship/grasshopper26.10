import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class UniversalCredential implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Universal Credential',
    name: 'universalCredential',
    icon: 'file:credential.svg',
    group: ['transform'],
    version: 1,
    description: 'Manage credentials across all platforms',
    defaults: {
      name: 'Universal Credential',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'gvtewayApi',
        required: false,
      },
      {
        name: 'compvssApi',
        required: false,
      },
      {
        name: 'atlvsApi',
        required: false,
      },
    ],
    properties: [
      {
        displayName: 'Platform',
        name: 'platform',
        type: 'options',
        options: [
          {
            name: 'GVTEWAY',
            value: 'gvteway',
          },
          {
            name: 'COMPVSS',
            value: 'compvss',
          },
          {
            name: 'ATLVS',
            value: 'atlvs',
          },
        ],
        default: 'gvteway',
        required: true,
        description: 'Platform to manage credentials for',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Get Credential',
            value: 'get',
            description: 'Get credential details',
            action: 'Get credential',
          },
          {
            name: 'List Credentials',
            value: 'list',
            description: 'List user credentials',
            action: 'List credentials',
          },
          {
            name: 'Verify Credential',
            value: 'verify',
            description: 'Verify credential validity',
            action: 'Verify credential',
          },
          {
            name: 'Upload Credential',
            value: 'upload',
            description: 'Upload new credential',
            action: 'Upload credential',
          },
          {
            name: 'Check Expiration',
            value: 'checkExpiration',
            description: 'Check if credential is expiring',
            action: 'Check expiration',
          },
          {
            name: 'Sync Across Platforms',
            value: 'sync',
            description: 'Sync credential across platforms',
            action: 'Sync credential',
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
        displayName: 'Credential ID',
        name: 'credentialId',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['get', 'verify', 'sync'],
          },
        },
        description: 'The ID of the credential',
      },
      {
        displayName: 'Credential Type',
        name: 'credentialType',
        type: 'options',
        options: [
          {
            name: 'Ticket',
            value: 'TICKET',
          },
          {
            name: 'Pass',
            value: 'PASS',
          },
          {
            name: 'Badge',
            value: 'BADGE',
          },
          {
            name: 'Certification',
            value: 'CERTIFICATION',
          },
          {
            name: 'License',
            value: 'LICENSE',
          },
          {
            name: 'Permit',
            value: 'PERMIT',
          },
          {
            name: 'Insurance',
            value: 'INSURANCE',
          },
          {
            name: 'Background Check',
            value: 'BACKGROUND_CHECK',
          },
        ],
        default: 'TICKET',
        displayOptions: {
          show: {
            operation: ['upload', 'list'],
          },
        },
        description: 'Type of credential',
      },
      {
        displayName: 'File URL',
        name: 'fileUrl',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['upload'],
          },
        },
        description: 'URL of the credential file',
      },
      {
        displayName: 'Expiry Date',
        name: 'expiryDate',
        type: 'dateTime',
        default: '',
        displayOptions: {
          show: {
            operation: ['upload'],
          },
        },
        description: 'Credential expiry date',
      },
      {
        displayName: 'Days Before Expiry',
        name: 'daysBeforeExpiry',
        type: 'number',
        default: 30,
        displayOptions: {
          show: {
            operation: ['checkExpiration'],
          },
        },
        description: 'Check if expiring within this many days',
      },
      {
        displayName: 'Target Platforms',
        name: 'targetPlatforms',
        type: 'multiOptions',
        options: [
          {
            name: 'GVTEWAY',
            value: 'gvteway',
          },
          {
            name: 'COMPVSS',
            value: 'compvss',
          },
          {
            name: 'ATLVS',
            value: 'atlvs',
          },
        ],
        default: ['gvteway', 'compvss', 'atlvs'],
        displayOptions: {
          show: {
            operation: ['sync'],
          },
        },
        description: 'Platforms to sync credential to',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const operation = this.getNodeParameter('operation', 0) as string;
    const platform = this.getNodeParameter('platform', 0) as string;

    // Get appropriate credentials based on platform
    const credentialName = `${platform}Api`;
    const credentials = await this.getCredentials(credentialName);
    const baseUrl = credentials.baseUrl as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData;
        const userId = this.getNodeParameter('userId', i) as string;

        if (operation === 'get') {
          const credentialId = this.getNodeParameter('credentialId', i) as string;

          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/credentials/${credentialId}`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'list') {
          const credentialType = this.getNodeParameter('credentialType', i) as string;

          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/users/${userId}/credentials`,
            qs: {
              type: credentialType,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'verify') {
          const credentialId = this.getNodeParameter('credentialId', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/credentials/${credentialId}/verify`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'upload') {
          const credentialType = this.getNodeParameter('credentialType', i) as string;
          const fileUrl = this.getNodeParameter('fileUrl', i) as string;
          const expiryDate = this.getNodeParameter('expiryDate', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/credentials`,
            body: {
              userId,
              type: credentialType,
              fileUrl,
              expiryDate: expiryDate || undefined,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'checkExpiration') {
          const daysBeforeExpiry = this.getNodeParameter('daysBeforeExpiry', i) as number;

          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/users/${userId}/credentials/expiring`,
            qs: {
              days: daysBeforeExpiry,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'sync') {
          const credentialId = this.getNodeParameter('credentialId', i) as string;
          const targetPlatforms = this.getNodeParameter('targetPlatforms', i) as string[];

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/credentials/${credentialId}/sync`,
            body: {
              platforms: targetPlatforms,
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
