import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type EntireFieldWrapper<T> = T;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Dynamo = {
  __typename?: 'Dynamo';
  getItem?: EntireFieldWrapper<Maybe<Scalars['String']>>;
  partiQL?: EntireFieldWrapper<Maybe<Scalars['String']>>;
};

export type DynamoGetItemArgs = {
  id: Scalars['String'];
};

export type DynamoPartiQlArgs = {
  id: Scalars['String'];
};

export type Http = {
  __typename?: 'Http';
  body?: EntireFieldWrapper<Maybe<Scalars['String']>>;
  message?: EntireFieldWrapper<Maybe<Scalars['String']>>;
  status?: EntireFieldWrapper<Maybe<Scalars['Int']>>;
};

export type Query = {
  __typename?: 'Query';
  dbCall?: EntireFieldWrapper<Maybe<Scalars['String']>>;
  hello?: EntireFieldWrapper<Maybe<Scalars['String']>>;
  simulate?: EntireFieldWrapper<Maybe<Simulate>>;
};

export type QueryDbCallArgs = {
  id: Scalars['String'];
};

export type Simulate = {
  __typename?: 'Simulate';
  dynamo?: EntireFieldWrapper<Maybe<Dynamo>>;
  http?: EntireFieldWrapper<Maybe<Http>>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<
  TResult,
  TParent,
  TContext,
  TArgs
>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>;
  Dynamo: ResolverTypeWrapper<Partial<Dynamo>>;
  Http: ResolverTypeWrapper<Partial<Http>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']>>;
  Query: ResolverTypeWrapper<{}>;
  Simulate: ResolverTypeWrapper<Partial<Simulate>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Partial<Scalars['Boolean']>;
  Dynamo: Partial<Dynamo>;
  Http: Partial<Http>;
  Int: Partial<Scalars['Int']>;
  Query: {};
  Simulate: Partial<Simulate>;
  String: Partial<Scalars['String']>;
}>;

export type HiddenDirectiveArgs = {
  environments?: Maybe<Array<Scalars['String']>>;
  toggleQueryKey?: Maybe<Scalars['String']>;
};

export type HiddenDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = HiddenDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type DynamoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Dynamo'] = ResolversParentTypes['Dynamo']
> = ResolversObject<{
  getItem?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<DynamoGetItemArgs, 'id'>
  >;
  partiQL?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<DynamoPartiQlArgs, 'id'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HttpResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Http'] = ResolversParentTypes['Http']
> = ResolversObject<{
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  dbCall?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<QueryDbCallArgs, 'id'>
  >;
  hello?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  simulate?: Resolver<Maybe<ResolversTypes['Simulate']>, ParentType, ContextType>;
}>;

export type SimulateResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Simulate'] = ResolversParentTypes['Simulate']
> = ResolversObject<{
  dynamo?: Resolver<Maybe<ResolversTypes['Dynamo']>, ParentType, ContextType>;
  http?: Resolver<Maybe<ResolversTypes['Http']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Dynamo?: DynamoResolvers<ContextType>;
  Http?: HttpResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Simulate?: SimulateResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = any> = ResolversObject<{
  hidden?: HiddenDirectiveResolver<any, any, ContextType>;
}>;
