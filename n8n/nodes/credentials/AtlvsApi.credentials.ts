import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class AtlvsApi implements ICredentialType {
  name = 'atlvsApi';
  displayName = 'ATLVS API';
  documentationUrl = 'https://docs.atlvs.com/api';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'ATLVS API key',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.atlvs.com',
      required: true,
      description: 'Base URL for ATLVS API',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'Authorization': '=Bearer {{$credentials.apiKey}}',
        'Content-Type': 'application/json',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/api/auth/verify',
      method: 'GET',
    },
  };
}
