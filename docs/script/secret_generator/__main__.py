import argparse
import os

from .secret_generator import SECRET_FILE_NAME, SecretGenerator
from .secret_loader import DefaultSecretLoader, ParameterStoreSecretLoader

# 스크림트 위치가 변경된다면 아래 ROOT_PATH 계산을 변경해야한다.
ROOT_PATH = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../'))
DEFAULT_DEV_FILE_PATH = os.path.join(ROOT_PATH, f'docs/dev/settings/{SECRET_FILE_NAME}')

args_parser = argparse.ArgumentParser()
args_parser.add_argument('-a', '--action', help='defaults or parameter_store')
args_parser.add_argument('-e', '--environment', required=False, help='environment (development or staging or production)')
args = args_parser.parse_args()

if args.action == 'defaults':
    SecretGenerator(ROOT_PATH, DefaultSecretLoader(DEFAULT_DEV_FILE_PATH)).generate()

elif args.action == 'parameter_store':
    service_name = 'library_web'
    SecretGenerator(ROOT_PATH, ParameterStoreSecretLoader(service_name, args.environment)).generate()

else:
    args_parser.print_help()
