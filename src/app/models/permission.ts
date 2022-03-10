
export class Permission  {
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
