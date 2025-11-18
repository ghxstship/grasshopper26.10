import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class GvtewayApi implements ICredentialType {
  name = 'gvtewayApi';
  displayName = 'GVTEWAY API';
  documentationUrl = 'https://docs.gvteway.com/api';
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
      description: 'GVTEWAY API key',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.gvteway.com',
      required: true,
      description: 'Base URL for GVTEWAY API',
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
