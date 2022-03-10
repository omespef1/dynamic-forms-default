export class ActionResult {
  IsSucessfull: boolean;
  IsSuccesfull?: boolean;
  IsError: boolean;
  ErrorMessage: string;
  Messages: string[];
  Result: any;
  Token?: string;
}

export class ActionResultT<T> {
  IsSucessfull: boolean;
  IsError: boolean;
  ErrorMessage: string;
  Messages: string[];
  Result: T;
  Token?: string;
}
export class ResultPrometheus<T> {
  isSuccessful: boolean;
  isError: boolean;
  errorMessage: string;
  messages: string;
  token: string;
  result: T;
  fileName: string;
}

