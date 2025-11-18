import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class AtlvsTeam implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'ATLVS Team',
    name: 'atlvsTeam',
    icon: 'file:atlvs.svg',
    group: ['transform'],
    version: 1,
    description: 'Manage ATLVS teams and members',
    defaults: {
      name: 'ATLVS Team',
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
            name: 'Get Team',
            value: 'get',
            description: 'Get team details',
            action: 'Get team',
          },
          {
            name: 'List Members',
            value: 'listMembers',
            description: 'List team members',
            action: 'List members',
          },
          {
            name: 'Add Member',
            value: 'addMember',
            description: 'Add member to team',
            action: 'Add member',
          },
          {
            name: 'Remove Member',
            value: 'removeMember',
            description: 'Remove member from team',
            action: 'Remove member',
          },
          {
            name: 'Update Role',
            value: 'updateRole',
            description: 'Update member role',
            action: 'Update role',
          },
          {
            name: 'Get Availability',
            value: 'getAvailability',
            description: 'Get team availability',
            action: 'Get availability',
          },
        ],
        default: 'get',
      },
      {
        displayName: 'Team ID',
        name: 'teamId',
        type: 'string',
        default: '',
        required: true,
        description: 'The ID of the team',
      },
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['addMember', 'removeMember', 'updateRole'],
          },
        },
        description: 'The ID of the user',
      },
      {
        displayName: 'Role',
        name: 'role',
        type: 'options',
        options: [
          {
            name: 'Lead',
            value: 'LEAD',
          },
          {
            name: 'Manager',
            value: 'MANAGER',
          },
          {
            name: 'Member',
            value: 'MEMBER',
          },
          {
            name: 'Contractor',
            value: 'CONTRACTOR',
          },
        ],
        default: 'MEMBER',
        displayOptions: {
          show: {
            operation: ['addMember', 'updateRole'],
          },
        },
        description: 'Team member role',
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
        const teamId = this.getNodeParameter('teamId', i) as string;

        if (operation === 'get') {
          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/teams/${teamId}`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'listMembers') {
          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/teams/${teamId}/members`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'addMember') {
          const userId = this.getNodeParameter('userId', i) as string;
          const role = this.getNodeParameter('role', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/teams/${teamId}/members`,
            body: {
              userId,
              role,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'removeMember') {
          const userId = this.getNodeParameter('userId', i) as string;

          const options = {
            method: 'DELETE',
            uri: `${baseUrl}/api/teams/${teamId}/members/${userId}`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'updateRole') {
          const userId = this.getNodeParameter('userId', i) as string;
          const role = this.getNodeParameter('role', i) as string;

          const options = {
            method: 'PATCH',
            uri: `${baseUrl}/api/teams/${teamId}/members/${userId}`,
            body: {
              role,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'getAvailability') {
          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/teams/${teamId}/availability`,
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
