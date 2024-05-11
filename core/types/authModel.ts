export interface Auth {
  id: string
  username: string
  email: string
  roles: string
  tokenType: string
  accessToken: string
  password: string
}

export namespace AuthDTO {
  export interface Content extends Auth {}
  export namespace Login {
    export interface Request extends Pick<Auth, 'username' | 'password'> {}
    export interface Response extends Omit<Auth, 'password'> {}
  }
  export interface User extends Pick<Auth, 'username' | 'id' | 'accessToken' | 'tokenType'> {}
}
