import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class AtlvsTask implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'ATLVS Task',
    name: 'atlvsTask',
    icon: 'file:atlvs.svg',
    group: ['transform'],
    version: 1,
    description: 'Manage ATLVS tasks',
    defaults: {
      name: 'ATLVS Task',
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
            name: 'Create',
            value: 'create',
            description: 'Create a new task',
            action: 'Create a task',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get a task',
            action: 'Get a task',
          },
          {
            name: 'List',
            value: 'list',
            description: 'List tasks',
            action: 'List tasks',
          },
          {
            name: 'Update',
            value: 'update',
            description: 'Update a task',
            action: 'Update a task',
          },
          {
            name: 'Assign',
            value: 'assign',
            description: 'Assign task to user',
            action: 'Assign task',
          },
          {
            name: 'Complete',
            value: 'complete',
            description: 'Mark task as complete',
            action: 'Complete task',
          },
          {
            name: 'Add Comment',
            value: 'addComment',
            description: 'Add comment to task',
            action: 'Add comment',
          },
        ],
        default: 'get',
      },
      {
        displayName: 'Task ID',
        name: 'taskId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['get', 'update', 'assign', 'complete', 'addComment'],
          },
        },
        description: 'The ID of the task',
      },
      {
        displayName: 'Project ID',
        name: 'projectId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['create', 'list'],
          },
        },
        description: 'The ID of the project',
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
        description: 'Task title',
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
            operation: ['create', 'update'],
          },
        },
        description: 'Task description',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          {
            name: 'To Do',
            value: 'TODO',
          },
          {
            name: 'In Progress',
            value: 'IN_PROGRESS',
          },
          {
            name: 'In Review',
            value: 'IN_REVIEW',
          },
          {
            name: 'Completed',
            value: 'COMPLETED',
          },
          {
            name: 'Blocked',
            value: 'BLOCKED',
          },
        ],
        default: 'TODO',
        displayOptions: {
          show: {
            operation: ['create', 'update'],
          },
        },
        description: 'Task status',
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
            operation: ['create', 'update'],
          },
        },
        description: 'Task priority',
      },
      {
        displayName: 'Assignee ID',
        name: 'assigneeId',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['create', 'assign'],
          },
        },
        description: 'User ID to assign task to',
      },
      {
        displayName: 'Due Date',
        name: 'dueDate',
        type: 'dateTime',
        default: '',
        displayOptions: {
          show: {
            operation: ['create', 'update'],
          },
        },
        description: 'Task due date',
      },
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['addComment'],
          },
        },
        description: 'Comment text',
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

        if (operation === 'create') {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const title = this.getNodeParameter('title', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const priority = this.getNodeParameter('priority', i) as string;
          const assigneeId = this.getNodeParameter('assigneeId', i) as string;
          const dueDate = this.getNodeParameter('dueDate', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/tasks`,
            body: {
              projectId,
              title,
              description: description || undefined,
              status,
              priority,
              assigneeId: assigneeId || undefined,
              dueDate: dueDate || undefined,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'get') {
          const taskId = this.getNodeParameter('taskId', i) as string;

          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/tasks/${taskId}`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'list') {
          const projectId = this.getNodeParameter('projectId', i) as string;

          const options = {
            method: 'GET',
            uri: `${baseUrl}/api/tasks`,
            qs: {
              projectId,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'update') {
          const taskId = this.getNodeParameter('taskId', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const priority = this.getNodeParameter('priority', i) as string;
          const dueDate = this.getNodeParameter('dueDate', i) as string;

          const options = {
            method: 'PATCH',
            uri: `${baseUrl}/api/tasks/${taskId}`,
            body: {
              description: description || undefined,
              status,
              priority,
              dueDate: dueDate || undefined,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'assign') {
          const taskId = this.getNodeParameter('taskId', i) as string;
          const assigneeId = this.getNodeParameter('assigneeId', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/tasks/${taskId}/assign`,
            body: {
              assigneeId,
            },
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'complete') {
          const taskId = this.getNodeParameter('taskId', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/tasks/${taskId}/complete`,
            json: true,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          };

          responseData = await this.helpers.request(options);
        } else if (operation === 'addComment') {
          const taskId = this.getNodeParameter('taskId', i) as string;
          const comment = this.getNodeParameter('comment', i) as string;

          const options = {
            method: 'POST',
            uri: `${baseUrl}/api/tasks/${taskId}/comments`,
            body: {
              comment,
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
