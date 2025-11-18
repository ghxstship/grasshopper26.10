/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

export class CrossPlatformSync implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Cross-Platform Sync',
    name: 'crossPlatformSync',
    icon: 'file:sync.svg',
    group: ['transform'],
    version: 1,
    description: 'Synchronize data across GVTEWAY, COMPVSS, and ATLVS platforms',
    defaults: {
      name: 'Cross-Platform Sync',
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
        displayName: 'Sync Type',
        name: 'syncType',
        type: 'options',
        options: [
          {
            name: 'User Data',
            value: 'user',
          },
          {
            name: 'Event Data',
            value: 'event',
          },
          {
            name: 'Credentials',
            value: 'credentials',
          },
          {
            name: 'Organization',
            value: 'organization',
          },
          {
            name: 'Notifications',
            value: 'notifications',
          },
        ],
        default: 'user',
        required: true,
        description: 'Type of data to synchronize',
      },
      {
        displayName: 'Source Platform',
        name: 'sourcePlatform',
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
        description: 'Platform to sync from',
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
        default: ['compvss', 'atlvs'],
        required: true,
        description: 'Platforms to sync to',
      },
      {
        displayName: 'Entity ID',
        name: 'entityId',
        type: 'string',
        default: '',
        required: true,
        description: 'ID of the entity to sync (user, event, etc.)',
      },
      {
        displayName: 'Sync Mode',
        name: 'syncMode',
        type: 'options',
        options: [
          {
            name: 'Full Sync',
            value: 'full',
          },
          {
            name: 'Incremental',
            value: 'incremental',
          },
          {
            name: 'Selective',
            value: 'selective',
          },
        ],
        default: 'full',
        description: 'Synchronization mode',
      },
      {
        displayName: 'Fields to Sync',
        name: 'fields',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            syncMode: ['selective'],
          },
        },
        description: 'Comma-separated list of fields to sync',
      },
      {
        displayName: 'Conflict Resolution',
        name: 'conflictResolution',
        type: 'options',
        options: [
          {
            name: 'Source Wins',
            value: 'source_wins',
          },
          {
            name: 'Target Wins',
            value: 'target_wins',
          },
          {
            name: 'Newest Wins',
            value: 'newest_wins',
          },
          {
            name: 'Manual',
            value: 'manual',
          },
        ],
        default: 'source_wins',
        description: 'How to resolve conflicts',
      },
      {
        displayName: 'Dry Run',
        name: 'dryRun',
        type: 'boolean',
        default: false,
        description: 'Whether to perform a dry run without actually syncing',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const syncType = this.getNodeParameter('syncType', i) as string;
        const sourcePlatform = this.getNodeParameter('sourcePlatform', i) as string;
        const targetPlatforms = this.getNodeParameter('targetPlatforms', i) as string[];
        const entityId = this.getNodeParameter('entityId', i) as string;
        const syncMode = this.getNodeParameter('syncMode', i) as string;
        const conflictResolution = this.getNodeParameter('conflictResolution', i) as string;
        const dryRun = this.getNodeParameter('dryRun', i) as boolean;
        const fields = this.getNodeParameter('fields', i, '') as string;

        // Get source platform credentials
        const sourceCredentialName = `${sourcePlatform}Api`;
        const sourceCredentials = await this.getCredentials(sourceCredentialName);
        const sourceBaseUrl = sourceCredentials.baseUrl as string;

        // Fetch data from source platform
        const sourceOptions = {
          method: 'GET',
          uri: `${sourceBaseUrl}/api/${syncType}/${entityId}`,
          json: true,
          headers: {
            'Authorization': `Bearer ${sourceCredentials.apiKey}`,
          },
        };

        const sourceData = await this.helpers.request(sourceOptions);

        // Prepare sync results
        const syncResults = {
          syncType,
          entityId,
          sourcePlatform,
          sourceData,
          targetResults: [] as Array<{ platform: string; success: boolean; data?: unknown; error?: string }>,
          dryRun,
          timestamp: new Date().toISOString(),
        };

        // Sync to each target platform
        for (const targetPlatform of targetPlatforms) {
          if (targetPlatform === sourcePlatform) {
            continue; // Skip syncing to self
          }

          try {
            const targetCredentialName = `${targetPlatform}Api`;
            const targetCredentials = await this.getCredentials(targetCredentialName);
            const targetBaseUrl = targetCredentials.baseUrl as string;

            // Prepare sync payload
            let syncPayload = sourceData;
            if (syncMode === 'selective' && fields) {
              const fieldList = fields.split(',').map(f => f.trim());
              syncPayload = {};
              for (const field of fieldList) {
                if (sourceData[field] !== undefined) {
                  syncPayload[field] = sourceData[field];
                }
              }
            }

            // Perform sync (or dry run)
            if (!dryRun) {
              const targetOptions = {
                method: 'POST',
                uri: `${targetBaseUrl}/api/sync/${syncType}`,
                body: {
                  entityId,
                  data: syncPayload,
                  conflictResolution,
                  syncMode,
                },
                json: true,
                headers: {
                  'Authorization': `Bearer ${targetCredentials.apiKey}`,
                },
              };

              const targetResult = await this.helpers.request(targetOptions);
              syncResults.targetResults.push({
                platform: targetPlatform,
                success: true,
                result: targetResult,
              });
            } else {
              syncResults.targetResults.push({
                platform: targetPlatform,
                success: true,
                dryRun: true,
                wouldSync: syncPayload,
              });
            }
          } catch (error) {
            syncResults.targetResults.push({
              platform: targetPlatform,
              success: false,
              error: (error as Error).message,
            });
          }
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(syncResults),
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
