import { adapter } from '@/utils';
import { mockRequest,request } from '../request';
import { adapterOfFetchUserList } from './management.adapter';
import { adapterOfFetchDataList } from './management.adapter';
import type { ApiUserManagement } from '~/src/typings/api';

/** 获取用户列表 */
export const fetchUserList = async (power: string, all: string) => {
  const data = await request.post<ApiUserManagement.User[] | null>('/getAllUserList', { power, all });
  let i = 0;
  for (; i < data.data?.length; i++) {
    if (data.data[i].userRole === 'super') {
      data.data[i].userRole = '1';
    } else if (data.data[i].userRole === 'admin') {
      data.data[i].userRole = '2';
    } else {
      data.data[i].userRole = '3';
    }
  }
  return adapter(adapterOfFetchUserList, data);
};
// 获取脏数据
export const fetchDataList = async () => {
  const data = await request.post('/getDataList');
  return adapter(adapterOfFetchDataList, data);
};

