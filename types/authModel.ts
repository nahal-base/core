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
  export type Content = Auth
  export namespace Login {
    export interface Request extends Pick<AuthDTO.Content, 'username' | 'password'> {}
    export interface Response extends Omit<AuthDTO.Content, 'password'> {}
  }
  export interface User
    extends Pick<AuthDTO.Content, 'username' | 'id' | 'accessToken' | 'tokenType'> {}
}
