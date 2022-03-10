import { Theme } from './theme';

export class Session {
  token: string;
  accountId: string;
  accountCode: string;
  accountLDAPCode: string;
  avatarUrl: string;
  displayName: string;
  roleCode: string;
  roleName: TranslatedProperty;
  roleHomeCode: string;
  email: string;
  facebookId: string;
  googleId: string;
  microsoftId: string;
  cellPhone: string;
  companies: Company[];
  permissions: PermissionSession[];
  selectedLanguage: string;
  selectedCompany: Company;
  state: SessionState;
}

// Estados de la sesión */
export class SessionState {
  changePassword: boolean;
  notEmailConfirmed: boolean;
}

export class TranslatedProperty {

  // Traducción a español colombia
  esCO: string;
  // Traducción a inglés USA
  enUS: string;
  // Traducción a portugés brazilero
  ptBR: string;

  constructor() {
      this.esCO = '';
      this.enUS = '';
      this.ptBR = '';
  }
}

export class Company {
  id: string;
  // Código de empresa
  code: string;
  // Nombre de la empresa
  name: string;
  // Descripción de la empresa
  description: TranslatedProperty = new TranslatedProperty();
  // Número de identificación
  uId: string;
  // Código de empresa padre (Grupos empresariales)
  parentCode: string;
  // Logo de la empresa
  logoUrl: string;
  // Imagen de represetnación corporativa
  imageUrl: string;
  // Valor que indica si es la empresa por defecto de una cuenta
  isDefault: boolean;
  // Tema asignado a la cuenta
  themeCode: string;
  // Tema asignado a la cuenta
  theme: Theme;
 // Parámetros generales de la empresa
  generalParameters:GeneralParameters
}

export class PermissionSession  {
  id: string;
  // Código del sujeto a quien le pertenece el permiso */
  sujectCode: string;
  // Tipo de sujeto */
  sujectType: SujectType;
  // Código del recurso sobre el que se aplica el permiso */
  resourceCode: string;
  // Tipo de recurso */
  resourceType: ResourceType;
  // Arreglo de acciones a las que tiene permiso sobre el recurso */
  actions: string[] = [];
  visible = true;
}

export class PermissionData  {
  id: string;
  // Código del sujeto a quien le pertenece el permiso */
  sujectCode: string;
  // Tipo de sujeto */
  sujectType: SujectType;
  // Código del recurso sobre el que se aplica el permiso */
  resourceCode: string;
  // Tipo de recurso */
  resourceType: ResourceType;
  // Arreglo de acciones a las que tiene permiso sobre el recurso */
  actions: Action[] = [];
}

export class Action {

  // Código de la acción
  code: string;
  // Nombre de la acción
  name: TranslatedProperty;

  constructor() {
      this.code = '';
      this.name = new TranslatedProperty();
  }
}

// Tipo de sujeto */
export enum SujectType {
  // Rol */
  Role,
  // Cuenta de usuario */
  Account,
  // Aplicación */
  Application
}

// Tipo de recurso */
export enum ResourceType {
  // Acción de controlador */
  ControllerAction,
  // Característica del portal Agora */
  AgoraFeature,
  // Microaplicación */
  Microapplication,
  // Recurso de microaplicación */
  Resource
}

export class GeneralParameters {

  currency:Currency;
}

export class Currency {

  abbreviation:string;
  code:string;
  name:string;
}