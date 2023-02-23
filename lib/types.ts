export interface ServerResStructure<T = any> {
  statusCode: number;
  message?: any;
  error?: any;
  data?: T;
}
