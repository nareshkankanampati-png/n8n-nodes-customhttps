import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import axios from 'axios';

export class HttpBin implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HTTP Custom',
		name: 'httpCustom',
		group: ['transform'],
		version: 1,
		description: 'Make a custom HTTP request',
		defaults: {
			name: 'HTTP Custom',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				placeholder: 'https://api.example.com/data',
				required: true,
			},
			{
				displayName: 'Method',
				name: 'method',
				type: 'options',
				options: [
					{ name: 'GET', value: 'GET' },
					{ name: 'POST', value: 'POST' },
					{ name: 'PUT', value: 'PUT' },
					{ name: 'DELETE', value: 'DELETE' },
				],
				default: 'GET',
			},
			{
				displayName: 'Body (JSON)',
				name: 'body',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						method: ['POST', 'PUT'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const url = this.getNodeParameter('url', i) as string;
			const method = this.getNodeParameter('method', i) as string;
			let body: any = {};

			if (method === 'POST' || method === 'PUT') {
				body = this.getNodeParameter('body', i);
			}

			const response = await axios({
				url,
				method,
				data: body,
			});

			returnData.push({
				json: response.data,
			});
		}

		return [returnData];
	}
}
