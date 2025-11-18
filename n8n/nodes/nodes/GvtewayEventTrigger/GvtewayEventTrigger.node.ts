import {
  INodeType,
  INodeTypeDescription,
  ITriggerFunctions,
  ITriggerResponse,
  IDataObject,
} from 'n8n-workflow';

export class GvtewayEventTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'GVTEWAY Event Trigger',
    name: 'gvtewayEventTrigger',
    icon: 'file:gvteway.svg',
    group: ['trigger'],
    version: 1,
    description: 'Triggers workflow on GVTEWAY event changes',
    defaults: {
      name: 'GVTEWAY Event Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'gvtewayApi',
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
            name: 'Event Created',
            value: 'event.created',
          },
          {
            name: 'Event Updated',
            value: 'event.updated',
          },
          {
            name: 'Event Published',
            value: 'event.published',
          },
          {
            name: 'Event Cancelled',
            value: 'event.cancelled',
          },
          {
            name: 'Ticket Sold',
            value: 'ticket.sold',
          },
          {
            name: 'Order Completed',
            value: 'order.completed',
          },
        ],
        default: 'event.created',
        required: true,
        description: 'The event to listen for',
      },
      {
        displayName: 'Organization ID',
        name: 'organizationId',
        type: 'string',
        default: '',
        description: 'Filter events by organization (optional)',
      },
    ],
  };

  async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
    const webhookUrl = this.getNodeWebhookUrl('default');
    const event = this.getNodeParameter('event') as string;
    const organizationId = this.getNodeParameter('organizationId', '') as string;

    const webhookData = this.getWorkflowStaticData('node');

    // Register webhook with GVTEWAY API
    const credentials = await this.getCredentials('gvtewayApi');
    const baseUrl = credentials.baseUrl as string;

    if (!webhookData.webhookId) {
      const options = {
        method: 'POST',
        uri: `${baseUrl}/api/webhooks`,
        body: {
          url: webhookUrl,
          event,
          organizationId: organizationId || undefined,
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
