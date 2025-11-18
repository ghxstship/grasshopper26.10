import {
  INodeType,
  INodeTypeDescription,
  ITriggerFunctions,
  ITriggerResponse,
  IDataObject,
} from 'n8n-workflow';

export class AtlvsProjectTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'ATLVS Project Trigger',
    name: 'atlvsProjectTrigger',
    icon: 'file:atlvs.svg',
    group: ['trigger'],
    version: 1,
    description: 'Triggers workflow on ATLVS project lifecycle events',
    defaults: {
      name: 'ATLVS Project Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'atlvsApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        options: [
          {
            name: 'Project Created',
            value: 'project.created',
          },
          {
            name: 'Project Updated',
            value: 'project.updated',
          },
          {
            name: 'Project Status Changed',
            value: 'project.status_changed',
          },
          {
            name: 'Project Completed',
            value: 'project.completed',
          },
          {
            name: 'Milestone Reached',
            value: 'project.milestone',
          },
          {
            name: 'Budget Exceeded',
            value: 'project.budget_exceeded',
          },
          {
            name: 'Deadline Approaching',
            value: 'project.deadline_approaching',
          },
        ],
        default: 'project.created',
        required: true,
        description: 'The project event to listen for',
      },
      {
        displayName: 'Organization ID',
        name: 'organizationId',
        type: 'string',
        default: '',
        description: 'Filter projects by organization (optional)',
      },
      {
        displayName: 'Project Type',
        name: 'projectType',
        type: 'options',
        options: [
          {
            name: 'All Types',
            value: '',
          },
          {
            name: 'Festival',
            value: 'FESTIVAL',
          },
          {
            name: 'Concert',
            value: 'CONCERT',
          },
          {
            name: 'Corporate Event',
            value: 'CORPORATE',
          },
          {
            name: 'Tour',
            value: 'TOUR',
          },
        ],
        default: '',
        description: 'Filter by project type',
      },
    ],
  };

  async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
    const webhookUrl = this.getNodeWebhookUrl('default');
    const event = this.getNodeParameter('event') as string;
    const organizationId = this.getNodeParameter('organizationId', '') as string;
    const projectType = this.getNodeParameter('projectType', '') as string;

    const webhookData = this.getWorkflowStaticData('node');
    const credentials = await this.getCredentials('atlvsApi');
    const baseUrl = credentials.baseUrl as string;

    // Register webhook with ATLVS API
    if (!webhookData.webhookId) {
      const options = {
        method: 'POST',
        uri: `${baseUrl}/api/webhooks`,
        body: {
          url: webhookUrl,
          event,
          organizationId: organizationId || undefined,
          projectType: projectType || undefined,
        },
        json: true,
        headers: {
          'Authorization': `Bearer ${credentials.apiKey}`,
        },
      };

      const response = await this.helpers.request(options);
      webhookData.webhookId = response.id;
    }

    async function manualTriggerFunction() {
      return {
        closeFunction: async () => {
          // Unregister webhook
          if (webhookData.webhookId) {
            const options = {
              method: 'DELETE',
              uri: `${baseUrl}/api/webhooks/${webhookData.webhookId}`,
              headers: {
                'Authorization': `Bearer ${credentials.apiKey}`,
              },
            };
            await this.helpers.request(options);
            delete webhookData.webhookId;
          }
        },
      };
    }

    async function webhookFunction(this: ITriggerFunctions) {
      const bodyData = this.getBodyData();
      return {
        workflowData: [this.helpers.returnJsonArray(bodyData as IDataObject[])],
      };
    }

    return {
      closeFunction: manualTriggerFunction,
      webhookFunction,
    };
  }
}
