import json
from typing import Dict

from .parameter_store_connector import ParameterStoreConnector


class BaseSecretLoader:
    def _get_secrets(self) -> Dict:
        raise NotImplementedError


class DefaultSecretLoader(BaseSecretLoader):
    def __init__(self, default_file_path: str, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._default_file_path = default_file_path

    def _get_secrets(self) -> Dict:
        with open(self._default_file_path) as file:
            return json.loads(file.read())


class ParameterStoreSecretLoader(BaseSecretLoader):
    def __init__(self, environment: str, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._environment = environment

    def _get_secrets(self) -> Dict:
        return ParameterStoreConnector().load_parameters(self._environment)
