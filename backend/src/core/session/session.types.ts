export interface ENTUserSession {
  userId: string;
  login: string;
  email: string;
  username: string;
}

export interface Function {
  code: string;
  scope: string[];
}

export interface AuthorizedAction {
  name: string;
  displayName: string;
  type: string;
}

export interface ENTUserBookPersonReponse {
  classNames: string[];
  id: string;
  externalId: string;
  login: string;
  username: string;
  type: string;
  userId: string;
  email: string;
  mobile: string;
  birthDate: null;
  functions: Record<string, Function>;
  groupsIds: string[];
  structures: string[];
  structureNames: string[];
  authorizedActions: AuthorizedAction[];
}
