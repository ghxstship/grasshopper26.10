import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class CompvssApi implements ICredentialType {
  name = 'compvssApi';
  displayName = 'COMPVSS API';
  documentationUrl = 'https://docs.compvss.com/api';
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
      description: 'COMPVSS API key',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.compvss.com',
      required: true,
      description: 'Base URL for COMPVSS API',
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
