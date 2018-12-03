import json
import os

from .secret_loader import BaseSecretLoader

SECRET_FILE_NAME = 'secrets.json'


class SecretGenerator:
    def __init__(self, root_path: str, secret_loader: BaseSecretLoader):
        self._root_path = root_path
        self._secrets = {}
        self._secret_loader = secret_loader

    def generate(self) -> None:
        self._load_secrets()
        self._merge_with_env()
        self._save_secrets()

    def _load_secrets(self) -> None:
        self._secrets = self._secret_loader._get_secrets()

    def _merge_with_env(self) -> None:
        secrets = {}
        for key in self._secrets.keys():
            secrets[key] = os.environ[key.upper()] if key.upper() in os.environ else self._secrets[key]

        self._secrets = secrets

    def _save_secrets(self) -> None:
        self._save_file(SECRET_FILE_NAME, json.dumps(self._secrets))

    def _get_file_path(self, file_name: str) -> str:
        return os.path.join(self._root_path, file_name)

    def _save_file(self, file_name: str, content: str) -> None:
        file_path = self._get_file_path(file_name)
        with open(file_path, 'w') as file:
            file.write(content)
