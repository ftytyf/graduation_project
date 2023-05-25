import { selectProps } from 'naive-ui';
import type { List } from 'echarts';
import { mockRequest, request } from '../request';

/**
 * 获取验证码
 * @param phone - 手机号
 * @returns - 返回boolean值表示是否发送成功
 */
export function fetchSmsCode(phone: string) {
  return mockRequest.post<boolean>('/getSmsCode', { phone });
}

/**
 * 登录
 * @param userName - 用户名
 * @param password - 密码
 */
export function fetchLogin(userName: string, password: string) {
  return request.post<ApiAuth.Token>('/login', { userName, password });
}

export function fetchregistration(userName: string, pwd: string) {
  return request.post<ApiAuth.registration>('/registration', { userName, pwd });
}

/** 获取用户信息 */
export function fetchUserInfo() {
  return request.get<ApiAuth.UserInfo>('/getUserInfo');
}

/**
 * 获取用户路由数据
 * @param userId - 用户id
 * @description 后端根据用户id查询到对应的角色类型，并将路由筛选出对应角色的路由数据返回前端
 */
export function fetchUserRoutes(userId: string) {
  return request.post<ApiRoute.Route>('/getUserRoutes', { userId });
}

/**
 * 刷新token
 * @param refreshToken
 */
export function fetchUpdateToken(refreshToken: string) {
  return request.post<ApiAuth.Token>('/updateToken', { refreshToken });
}

export function Uploaddirty(file: FormData) {
  return request.post('/Uploaddirty', file);
}
export function Uploadrule(file: FormData) {
  return request.post('/Uploadrule', file);
}
// 删除用户
export function fetchUserdel(rowId: string) {
  return request.post('/userDel', { rowId });
}
// 批量删除用户
export function fetchUserdels(rowId: List, power: string) {
  return request.post('/userDels', { rowId, power });
}
// 更改用户身份
export function userRoleChange(userid: number, userRole: string) {
  return request.post('/userRoleChange', { userid, userRole });
}
// 修改脏数据或者增加脏数据
export function dataChange(data: any, type: string) {
  return request.post('/dataChange', { data, type });
}
// 删除脏数据
export function fetchDatadel(index: string) {
  return request.post('/dataDel', { index });
}
// 批量删除脏数据
export function fetchDatadels(index: List) {
  return request.post('/dataDels', { index });
}

export function fetchNull() {
  return request.post('/nullPresent');
}
export function fetchFormat() {
  return request.post('/formatPresent');
}
export function fetchFault() {
  return request.post('/faultPresent');
}
export async function abvCandidate(index: string) {
  return request.post('/abvCandidate', { index });
}
export async function stateCandidate(index: string) {
  return request.post('/stateCandidate', { index });
}
export async function cityCandidate(index: string) {
  return request.post('/cityCandidate', { index });
}
export async function completeCandidate(data: object) {
  return request.post('/handrepair', { data });
}
export function autorepair() {
  return request.post('/autorepair');
}

export const fetchfaulttype = async () => {
  const data = await request.post('/faulttype');
  return data;
};
