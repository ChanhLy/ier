import { message } from 'antd';
import Axios from 'axios';
import { SUCCESS } from '../utils/constants';

const API_CONTRACTS = '/api/contracts';

export async function createContract(value: any) {
  const response = await Axios.post(API_CONTRACTS, value);
  if (response) message.success(SUCCESS);
}

export async function getContracts(params?: any) {
  const response = await Axios.get(API_CONTRACTS, { params });
  return response?.data;
}

export async function updateContractId(id: string, data: any) {
  const response = await Axios.patch(API_CONTRACTS + id, data);
  if (response) message.success(SUCCESS);
}
