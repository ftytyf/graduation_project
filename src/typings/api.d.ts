// 后端接口返回的数据类型

/** 后端返回的用户权益相关类型 */
declare namespace ApiAuth {
  /** 返回的token和刷新token */
  interface Token {
    token: string;
    refreshToken: string;
  }
  interface registration {
    code: number;
    Message: string;
  }
  /** 返回的用户信息 */
  type UserInfo = Auth.UserInfo;
}

/** 后端返回的路由相关类型 */
declare namespace ApiRoute {
  /** 后端返回的路由数据类型 */
  interface Route {
    /** 动态路由 */
    routes: AuthRoute.Route[];
    /** 路由首页对应的key */
    home: AuthRoute.AllRouteKey;
  }
}

declare namespace ApiUserManagement {
  interface User {
    /** 用户id */
    userId: string;
    /** 用户名 */
    userName: string | null;
    /** 用户年龄 */
    /**
     * 用户性别
     * - 0: 女
     * - 1: 男
     */
    /** 用户手机号码 */
    phone: string;
    /** 用户邮箱 */
    email: string | null;
    /**
     * 用户状态
     * - 1: 启用
     * - 2: 禁用
     * - 3: 冻结
     * - 4: 软删除
     */
    userRole: string;
  }
  interface Data {
    data_id: number;
    userName: string | null;
    beer_name: string | null;
    state: string | null;
    brewery_name: string | null;
    brewery_id: string | null;
    abv: string | null;
    ounces: string | null;
    style: string | null;
    id: string | null;
    index: string | null;
    city: string | null;
  }
}
