import { GraphQLError as BaseGraphQLError } from 'graphql';
import { ApolloError as BaseApolloError } from '@apollo/client/core';
import type { App as Vue } from '@vue/runtime-core';
import { ApolloOperationContext } from '../types';
import { ApolloErrorHandlerResultInterface } from './ApolloErrorHandlerResult';

export enum ApolloErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNAUTHORIZED_ERROR = 'UNAUTHORIZED_ERROR',
  BAD_USER_INPUT = 'BAD_USER_INPUT',
  INPUT_VALIDATION_ERROR = 'INPUT_VALIDATION_ERROR',
}

// Upstream type declares networkError as Error, but it can contain additional properties, we override to add these
export type ApolloError = BaseApolloError & {
  networkError: ApolloNetworkError | null;
  graphQLErrors: GraphQLError[];
};

export interface ApolloNetworkError extends Error {
  statusCode?: number;
  response?: any;
  result?: {
    errors: GraphQLError[];
  };
}

export interface StatusException {
  status?: number;
}

export type GraphQLError = Omit<BaseGraphQLError, 'message'> & {
  message: string | Record<string, any>;
};
export type ProcessedApolloError =
  | NetworkError
  | ServerError
  | UnauthorizedError
  | UserInputError
  | InputValidationError;

export interface NetworkError {
  type: ApolloErrorType.NETWORK_ERROR;
  error: Error;
  message: string;
  statusCode?: number;
}

export interface ServerError {
  type: ApolloErrorType.SERVER_ERROR;
  error: Error;
  path?: readonly (string | number)[];
  message: string;
}

export interface UnauthorizedError {
  type: ApolloErrorType.UNAUTHORIZED_ERROR;
  error: Error;
  path?: readonly (string | number)[];
  message: string;
}

export interface UserInputError {
  type: ApolloErrorType.BAD_USER_INPUT;
  error: Error;
  path?: readonly (string | number)[];
  message: string;
}

export interface InputValidationError {
  type: ApolloErrorType.INPUT_VALIDATION_ERROR;
  error: Error;
  path?: readonly (string | number)[];
  message: string;
  invalidArgs: string[];
  violations: ValidationRuleViolation[];
}

export interface ValidationRuleViolation {
  path: string[];
  message: string;
  value?: any;
}

export type ApolloOperationErrorHandlerFunction<
  TError = BaseApolloError,
  TApp extends Vue = Vue,
  TContext = ApolloOperationContext,
  TResult = ApolloErrorHandlerResultInterface,
> = (error: TError, app: TApp, context?: TContext) => TResult;
