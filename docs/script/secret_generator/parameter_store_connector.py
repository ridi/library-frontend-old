from typing import Dict

import boto3


class ParameterStoreConnector(object):
    def __init__(self):
        self.client = boto3.client('ssm')

    def load_parameters_by_path(self, path: str, next_token: str = None):
        args = {
            'Path': path,
            'Recursive': False,
            'WithDecryption': True,
        }
        if next_token is not None:
            args['NextToken'] = next_token

        return self.client.get_parameters_by_path(**args)

    def load_parameters(self, env: str) -> Dict:
        path = '/%s/' % env

        parameters = {}
        next_token = None
        while True:
            response = self.load_parameters_by_path(path, next_token)

            for param in response['Parameters']:
                key = param['Name'][len(path):]
                value = param['Value']
                parameters[key] = value

            if 'NextToken' not in response:
                break
            else:
                next_token = response['NextToken']

        return parameters
