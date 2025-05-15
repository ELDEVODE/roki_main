
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model DemoUser
 * 
 */
export type DemoUser = $Result.DefaultSelection<Prisma.$DemoUserPayload>
/**
 * Model DemoChannel
 * 
 */
export type DemoChannel = $Result.DefaultSelection<Prisma.$DemoChannelPayload>
/**
 * Model DemoMembership
 * 
 */
export type DemoMembership = $Result.DefaultSelection<Prisma.$DemoMembershipPayload>
/**
 * Model DemoMessage
 * 
 */
export type DemoMessage = $Result.DefaultSelection<Prisma.$DemoMessagePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more DemoUsers
 * const demoUsers = await prisma.demoUser.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more DemoUsers
   * const demoUsers = await prisma.demoUser.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.demoUser`: Exposes CRUD operations for the **DemoUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DemoUsers
    * const demoUsers = await prisma.demoUser.findMany()
    * ```
    */
  get demoUser(): Prisma.DemoUserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.demoChannel`: Exposes CRUD operations for the **DemoChannel** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DemoChannels
    * const demoChannels = await prisma.demoChannel.findMany()
    * ```
    */
  get demoChannel(): Prisma.DemoChannelDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.demoMembership`: Exposes CRUD operations for the **DemoMembership** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DemoMemberships
    * const demoMemberships = await prisma.demoMembership.findMany()
    * ```
    */
  get demoMembership(): Prisma.DemoMembershipDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.demoMessage`: Exposes CRUD operations for the **DemoMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DemoMessages
    * const demoMessages = await prisma.demoMessage.findMany()
    * ```
    */
  get demoMessage(): Prisma.DemoMessageDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    DemoUser: 'DemoUser',
    DemoChannel: 'DemoChannel',
    DemoMembership: 'DemoMembership',
    DemoMessage: 'DemoMessage'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "demoUser" | "demoChannel" | "demoMembership" | "demoMessage"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      DemoUser: {
        payload: Prisma.$DemoUserPayload<ExtArgs>
        fields: Prisma.DemoUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DemoUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DemoUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoUserPayload>
          }
          findFirst: {
            args: Prisma.DemoUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DemoUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoUserPayload>
          }
          findMany: {
            args: Prisma.DemoUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoUserPayload>[]
          }
          create: {
            args: Prisma.DemoUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoUserPayload>
          }
          createMany: {
            args: Prisma.DemoUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DemoUserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoUserPayload>[]
          }
          delete: {
            args: Prisma.DemoUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoUserPayload>
          }
          update: {
            args: Prisma.DemoUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoUserPayload>
          }
          deleteMany: {
            args: Prisma.DemoUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DemoUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DemoUserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoUserPayload>[]
          }
          upsert: {
            args: Prisma.DemoUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoUserPayload>
          }
          aggregate: {
            args: Prisma.DemoUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDemoUser>
          }
          groupBy: {
            args: Prisma.DemoUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<DemoUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.DemoUserCountArgs<ExtArgs>
            result: $Utils.Optional<DemoUserCountAggregateOutputType> | number
          }
        }
      }
      DemoChannel: {
        payload: Prisma.$DemoChannelPayload<ExtArgs>
        fields: Prisma.DemoChannelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DemoChannelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoChannelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DemoChannelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoChannelPayload>
          }
          findFirst: {
            args: Prisma.DemoChannelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoChannelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DemoChannelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoChannelPayload>
          }
          findMany: {
            args: Prisma.DemoChannelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoChannelPayload>[]
          }
          create: {
            args: Prisma.DemoChannelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoChannelPayload>
          }
          createMany: {
            args: Prisma.DemoChannelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DemoChannelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoChannelPayload>[]
          }
          delete: {
            args: Prisma.DemoChannelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoChannelPayload>
          }
          update: {
            args: Prisma.DemoChannelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoChannelPayload>
          }
          deleteMany: {
            args: Prisma.DemoChannelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DemoChannelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DemoChannelUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoChannelPayload>[]
          }
          upsert: {
            args: Prisma.DemoChannelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoChannelPayload>
          }
          aggregate: {
            args: Prisma.DemoChannelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDemoChannel>
          }
          groupBy: {
            args: Prisma.DemoChannelGroupByArgs<ExtArgs>
            result: $Utils.Optional<DemoChannelGroupByOutputType>[]
          }
          count: {
            args: Prisma.DemoChannelCountArgs<ExtArgs>
            result: $Utils.Optional<DemoChannelCountAggregateOutputType> | number
          }
        }
      }
      DemoMembership: {
        payload: Prisma.$DemoMembershipPayload<ExtArgs>
        fields: Prisma.DemoMembershipFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DemoMembershipFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMembershipPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DemoMembershipFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMembershipPayload>
          }
          findFirst: {
            args: Prisma.DemoMembershipFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMembershipPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DemoMembershipFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMembershipPayload>
          }
          findMany: {
            args: Prisma.DemoMembershipFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMembershipPayload>[]
          }
          create: {
            args: Prisma.DemoMembershipCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMembershipPayload>
          }
          createMany: {
            args: Prisma.DemoMembershipCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DemoMembershipCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMembershipPayload>[]
          }
          delete: {
            args: Prisma.DemoMembershipDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMembershipPayload>
          }
          update: {
            args: Prisma.DemoMembershipUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMembershipPayload>
          }
          deleteMany: {
            args: Prisma.DemoMembershipDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DemoMembershipUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DemoMembershipUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMembershipPayload>[]
          }
          upsert: {
            args: Prisma.DemoMembershipUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMembershipPayload>
          }
          aggregate: {
            args: Prisma.DemoMembershipAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDemoMembership>
          }
          groupBy: {
            args: Prisma.DemoMembershipGroupByArgs<ExtArgs>
            result: $Utils.Optional<DemoMembershipGroupByOutputType>[]
          }
          count: {
            args: Prisma.DemoMembershipCountArgs<ExtArgs>
            result: $Utils.Optional<DemoMembershipCountAggregateOutputType> | number
          }
        }
      }
      DemoMessage: {
        payload: Prisma.$DemoMessagePayload<ExtArgs>
        fields: Prisma.DemoMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DemoMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DemoMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMessagePayload>
          }
          findFirst: {
            args: Prisma.DemoMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DemoMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMessagePayload>
          }
          findMany: {
            args: Prisma.DemoMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMessagePayload>[]
          }
          create: {
            args: Prisma.DemoMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMessagePayload>
          }
          createMany: {
            args: Prisma.DemoMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DemoMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMessagePayload>[]
          }
          delete: {
            args: Prisma.DemoMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMessagePayload>
          }
          update: {
            args: Prisma.DemoMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMessagePayload>
          }
          deleteMany: {
            args: Prisma.DemoMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DemoMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DemoMessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMessagePayload>[]
          }
          upsert: {
            args: Prisma.DemoMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DemoMessagePayload>
          }
          aggregate: {
            args: Prisma.DemoMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDemoMessage>
          }
          groupBy: {
            args: Prisma.DemoMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<DemoMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.DemoMessageCountArgs<ExtArgs>
            result: $Utils.Optional<DemoMessageCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    demoUser?: DemoUserOmit
    demoChannel?: DemoChannelOmit
    demoMembership?: DemoMembershipOmit
    demoMessage?: DemoMessageOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type DemoUserCountOutputType
   */

  export type DemoUserCountOutputType = {
    memberships: number
    messages: number
    createdChannels: number
  }

  export type DemoUserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    memberships?: boolean | DemoUserCountOutputTypeCountMembershipsArgs
    messages?: boolean | DemoUserCountOutputTypeCountMessagesArgs
    createdChannels?: boolean | DemoUserCountOutputTypeCountCreatedChannelsArgs
  }

  // Custom InputTypes
  /**
   * DemoUserCountOutputType without action
   */
  export type DemoUserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoUserCountOutputType
     */
    select?: DemoUserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DemoUserCountOutputType without action
   */
  export type DemoUserCountOutputTypeCountMembershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DemoMembershipWhereInput
  }

  /**
   * DemoUserCountOutputType without action
   */
  export type DemoUserCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DemoMessageWhereInput
  }

  /**
   * DemoUserCountOutputType without action
   */
  export type DemoUserCountOutputTypeCountCreatedChannelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DemoChannelWhereInput
  }


  /**
   * Count Type DemoChannelCountOutputType
   */

  export type DemoChannelCountOutputType = {
    members: number
    messages: number
  }

  export type DemoChannelCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | DemoChannelCountOutputTypeCountMembersArgs
    messages?: boolean | DemoChannelCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * DemoChannelCountOutputType without action
   */
  export type DemoChannelCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoChannelCountOutputType
     */
    select?: DemoChannelCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DemoChannelCountOutputType without action
   */
  export type DemoChannelCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DemoMembershipWhereInput
  }

  /**
   * DemoChannelCountOutputType without action
   */
  export type DemoChannelCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DemoMessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model DemoUser
   */

  export type AggregateDemoUser = {
    _count: DemoUserCountAggregateOutputType | null
    _min: DemoUserMinAggregateOutputType | null
    _max: DemoUserMaxAggregateOutputType | null
  }

  export type DemoUserMinAggregateOutputType = {
    id: string | null
    walletAddress: string | null
    name: string | null
    createdAt: Date | null
  }

  export type DemoUserMaxAggregateOutputType = {
    id: string | null
    walletAddress: string | null
    name: string | null
    createdAt: Date | null
  }

  export type DemoUserCountAggregateOutputType = {
    id: number
    walletAddress: number
    name: number
    createdAt: number
    _all: number
  }


  export type DemoUserMinAggregateInputType = {
    id?: true
    walletAddress?: true
    name?: true
    createdAt?: true
  }

  export type DemoUserMaxAggregateInputType = {
    id?: true
    walletAddress?: true
    name?: true
    createdAt?: true
  }

  export type DemoUserCountAggregateInputType = {
    id?: true
    walletAddress?: true
    name?: true
    createdAt?: true
    _all?: true
  }

  export type DemoUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DemoUser to aggregate.
     */
    where?: DemoUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DemoUsers to fetch.
     */
    orderBy?: DemoUserOrderByWithRelationInput | DemoUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DemoUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DemoUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DemoUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DemoUsers
    **/
    _count?: true | DemoUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DemoUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DemoUserMaxAggregateInputType
  }

  export type GetDemoUserAggregateType<T extends DemoUserAggregateArgs> = {
        [P in keyof T & keyof AggregateDemoUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDemoUser[P]>
      : GetScalarType<T[P], AggregateDemoUser[P]>
  }




  export type DemoUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DemoUserWhereInput
    orderBy?: DemoUserOrderByWithAggregationInput | DemoUserOrderByWithAggregationInput[]
    by: DemoUserScalarFieldEnum[] | DemoUserScalarFieldEnum
    having?: DemoUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DemoUserCountAggregateInputType | true
    _min?: DemoUserMinAggregateInputType
    _max?: DemoUserMaxAggregateInputType
  }

  export type DemoUserGroupByOutputType = {
    id: string
    walletAddress: string
    name: string | null
    createdAt: Date
    _count: DemoUserCountAggregateOutputType | null
    _min: DemoUserMinAggregateOutputType | null
    _max: DemoUserMaxAggregateOutputType | null
  }

  type GetDemoUserGroupByPayload<T extends DemoUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DemoUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DemoUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DemoUserGroupByOutputType[P]>
            : GetScalarType<T[P], DemoUserGroupByOutputType[P]>
        }
      >
    >


  export type DemoUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletAddress?: boolean
    name?: boolean
    createdAt?: boolean
    memberships?: boolean | DemoUser$membershipsArgs<ExtArgs>
    messages?: boolean | DemoUser$messagesArgs<ExtArgs>
    createdChannels?: boolean | DemoUser$createdChannelsArgs<ExtArgs>
    _count?: boolean | DemoUserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["demoUser"]>

  export type DemoUserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletAddress?: boolean
    name?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["demoUser"]>

  export type DemoUserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletAddress?: boolean
    name?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["demoUser"]>

  export type DemoUserSelectScalar = {
    id?: boolean
    walletAddress?: boolean
    name?: boolean
    createdAt?: boolean
  }

  export type DemoUserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "walletAddress" | "name" | "createdAt", ExtArgs["result"]["demoUser"]>
  export type DemoUserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    memberships?: boolean | DemoUser$membershipsArgs<ExtArgs>
    messages?: boolean | DemoUser$messagesArgs<ExtArgs>
    createdChannels?: boolean | DemoUser$createdChannelsArgs<ExtArgs>
    _count?: boolean | DemoUserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DemoUserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DemoUserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DemoUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DemoUser"
    objects: {
      memberships: Prisma.$DemoMembershipPayload<ExtArgs>[]
      messages: Prisma.$DemoMessagePayload<ExtArgs>[]
      createdChannels: Prisma.$DemoChannelPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      walletAddress: string
      name: string | null
      createdAt: Date
    }, ExtArgs["result"]["demoUser"]>
    composites: {}
  }

  type DemoUserGetPayload<S extends boolean | null | undefined | DemoUserDefaultArgs> = $Result.GetResult<Prisma.$DemoUserPayload, S>

  type DemoUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DemoUserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DemoUserCountAggregateInputType | true
    }

  export interface DemoUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DemoUser'], meta: { name: 'DemoUser' } }
    /**
     * Find zero or one DemoUser that matches the filter.
     * @param {DemoUserFindUniqueArgs} args - Arguments to find a DemoUser
     * @example
     * // Get one DemoUser
     * const demoUser = await prisma.demoUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DemoUserFindUniqueArgs>(args: SelectSubset<T, DemoUserFindUniqueArgs<ExtArgs>>): Prisma__DemoUserClient<$Result.GetResult<Prisma.$DemoUserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DemoUser that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DemoUserFindUniqueOrThrowArgs} args - Arguments to find a DemoUser
     * @example
     * // Get one DemoUser
     * const demoUser = await prisma.demoUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DemoUserFindUniqueOrThrowArgs>(args: SelectSubset<T, DemoUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DemoUserClient<$Result.GetResult<Prisma.$DemoUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DemoUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoUserFindFirstArgs} args - Arguments to find a DemoUser
     * @example
     * // Get one DemoUser
     * const demoUser = await prisma.demoUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DemoUserFindFirstArgs>(args?: SelectSubset<T, DemoUserFindFirstArgs<ExtArgs>>): Prisma__DemoUserClient<$Result.GetResult<Prisma.$DemoUserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DemoUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoUserFindFirstOrThrowArgs} args - Arguments to find a DemoUser
     * @example
     * // Get one DemoUser
     * const demoUser = await prisma.demoUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DemoUserFindFirstOrThrowArgs>(args?: SelectSubset<T, DemoUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__DemoUserClient<$Result.GetResult<Prisma.$DemoUserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DemoUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DemoUsers
     * const demoUsers = await prisma.demoUser.findMany()
     * 
     * // Get first 10 DemoUsers
     * const demoUsers = await prisma.demoUser.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const demoUserWithIdOnly = await prisma.demoUser.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DemoUserFindManyArgs>(args?: SelectSubset<T, DemoUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DemoUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DemoUser.
     * @param {DemoUserCreateArgs} args - Arguments to create a DemoUser.
     * @example
     * // Create one DemoUser
     * const DemoUser = await prisma.demoUser.create({
     *   data: {
     *     // ... data to create a DemoUser
     *   }
     * })
     * 
     */
    create<T extends DemoUserCreateArgs>(args: SelectSubset<T, DemoUserCreateArgs<ExtArgs>>): Prisma__DemoUserClient<$Result.GetResult<Prisma.$DemoUserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DemoUsers.
     * @param {DemoUserCreateManyArgs} args - Arguments to create many DemoUsers.
     * @example
     * // Create many DemoUsers
     * const demoUser = await prisma.demoUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DemoUserCreateManyArgs>(args?: SelectSubset<T, DemoUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DemoUsers and returns the data saved in the database.
     * @param {DemoUserCreateManyAndReturnArgs} args - Arguments to create many DemoUsers.
     * @example
     * // Create many DemoUsers
     * const demoUser = await prisma.demoUser.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DemoUsers and only return the `id`
     * const demoUserWithIdOnly = await prisma.demoUser.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DemoUserCreateManyAndReturnArgs>(args?: SelectSubset<T, DemoUserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DemoUserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DemoUser.
     * @param {DemoUserDeleteArgs} args - Arguments to delete one DemoUser.
     * @example
     * // Delete one DemoUser
     * const DemoUser = await prisma.demoUser.delete({
     *   where: {
     *     // ... filter to delete one DemoUser
     *   }
     * })
     * 
     */
    delete<T extends DemoUserDeleteArgs>(args: SelectSubset<T, DemoUserDeleteArgs<ExtArgs>>): Prisma__DemoUserClient<$Result.GetResult<Prisma.$DemoUserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DemoUser.
     * @param {DemoUserUpdateArgs} args - Arguments to update one DemoUser.
     * @example
     * // Update one DemoUser
     * const demoUser = await prisma.demoUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DemoUserUpdateArgs>(args: SelectSubset<T, DemoUserUpdateArgs<ExtArgs>>): Prisma__DemoUserClient<$Result.GetResult<Prisma.$DemoUserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DemoUsers.
     * @param {DemoUserDeleteManyArgs} args - Arguments to filter DemoUsers to delete.
     * @example
     * // Delete a few DemoUsers
     * const { count } = await prisma.demoUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DemoUserDeleteManyArgs>(args?: SelectSubset<T, DemoUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DemoUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DemoUsers
     * const demoUser = await prisma.demoUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DemoUserUpdateManyArgs>(args: SelectSubset<T, DemoUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DemoUsers and returns the data updated in the database.
     * @param {DemoUserUpdateManyAndReturnArgs} args - Arguments to update many DemoUsers.
     * @example
     * // Update many DemoUsers
     * const demoUser = await prisma.demoUser.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DemoUsers and only return the `id`
     * const demoUserWithIdOnly = await prisma.demoUser.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DemoUserUpdateManyAndReturnArgs>(args: SelectSubset<T, DemoUserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DemoUserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DemoUser.
     * @param {DemoUserUpsertArgs} args - Arguments to update or create a DemoUser.
     * @example
     * // Update or create a DemoUser
     * const demoUser = await prisma.demoUser.upsert({
     *   create: {
     *     // ... data to create a DemoUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DemoUser we want to update
     *   }
     * })
     */
    upsert<T extends DemoUserUpsertArgs>(args: SelectSubset<T, DemoUserUpsertArgs<ExtArgs>>): Prisma__DemoUserClient<$Result.GetResult<Prisma.$DemoUserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DemoUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoUserCountArgs} args - Arguments to filter DemoUsers to count.
     * @example
     * // Count the number of DemoUsers
     * const count = await prisma.demoUser.count({
     *   where: {
     *     // ... the filter for the DemoUsers we want to count
     *   }
     * })
    **/
    count<T extends DemoUserCountArgs>(
      args?: Subset<T, DemoUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DemoUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DemoUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DemoUserAggregateArgs>(args: Subset<T, DemoUserAggregateArgs>): Prisma.PrismaPromise<GetDemoUserAggregateType<T>>

    /**
     * Group by DemoUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DemoUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DemoUserGroupByArgs['orderBy'] }
        : { orderBy?: DemoUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DemoUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDemoUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DemoUser model
   */
  readonly fields: DemoUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DemoUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DemoUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    memberships<T extends DemoUser$membershipsArgs<ExtArgs> = {}>(args?: Subset<T, DemoUser$membershipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DemoMembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messages<T extends DemoUser$messagesArgs<ExtArgs> = {}>(args?: Subset<T, DemoUser$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DemoMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    createdChannels<T extends DemoUser$createdChannelsArgs<ExtArgs> = {}>(args?: Subset<T, DemoUser$createdChannelsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DemoChannelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DemoUser model
   */
  interface DemoUserFieldRefs {
    readonly id: FieldRef<"DemoUser", 'String'>
    readonly walletAddress: FieldRef<"DemoUser", 'String'>
    readonly name: FieldRef<"DemoUser", 'String'>
    readonly createdAt: FieldRef<"DemoUser", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DemoUser findUnique
   */
  export type DemoUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoUser
     */
    select?: DemoUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoUser
     */
    omit?: DemoUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoUserInclude<ExtArgs> | null
    /**
     * Filter, which DemoUser to fetch.
     */
    where: DemoUserWhereUniqueInput
  }

  /**
   * DemoUser findUniqueOrThrow
   */
  export type DemoUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoUser
     */
    select?: DemoUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoUser
     */
    omit?: DemoUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoUserInclude<ExtArgs> | null
    /**
     * Filter, which DemoUser to fetch.
     */
    where: DemoUserWhereUniqueInput
  }

  /**
   * DemoUser findFirst
   */
  export type DemoUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoUser
     */
    select?: DemoUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoUser
     */
    omit?: DemoUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoUserInclude<ExtArgs> | null
    /**
     * Filter, which DemoUser to fetch.
     */
    where?: DemoUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DemoUsers to fetch.
     */
    orderBy?: DemoUserOrderByWithRelationInput | DemoUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DemoUsers.
     */
    cursor?: DemoUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DemoUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DemoUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DemoUsers.
     */
    distinct?: DemoUserScalarFieldEnum | DemoUserScalarFieldEnum[]
  }

  /**
   * DemoUser findFirstOrThrow
   */
  export type DemoUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoUser
     */
    select?: DemoUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoUser
     */
    omit?: DemoUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoUserInclude<ExtArgs> | null
    /**
     * Filter, which DemoUser to fetch.
     */
    where?: DemoUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DemoUsers to fetch.
     */
    orderBy?: DemoUserOrderByWithRelationInput | DemoUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DemoUsers.
     */
    cursor?: DemoUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DemoUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DemoUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DemoUsers.
     */
    distinct?: DemoUserScalarFieldEnum | DemoUserScalarFieldEnum[]
  }

  /**
   * DemoUser findMany
   */
  export type DemoUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoUser
     */
    select?: DemoUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoUser
     */
    omit?: DemoUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoUserInclude<ExtArgs> | null
    /**
     * Filter, which DemoUsers to fetch.
     */
    where?: DemoUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DemoUsers to fetch.
     */
    orderBy?: DemoUserOrderByWithRelationInput | DemoUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DemoUsers.
     */
    cursor?: DemoUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DemoUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DemoUsers.
     */
    skip?: number
    distinct?: DemoUserScalarFieldEnum | DemoUserScalarFieldEnum[]
  }

  /**
   * DemoUser create
   */
  export type DemoUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoUser
     */
    select?: DemoUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoUser
     */
    omit?: DemoUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoUserInclude<ExtArgs> | null
    /**
     * The data needed to create a DemoUser.
     */
    data: XOR<DemoUserCreateInput, DemoUserUncheckedCreateInput>
  }

  /**
   * DemoUser createMany
   */
  export type DemoUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DemoUsers.
     */
    data: DemoUserCreateManyInput | DemoUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DemoUser createManyAndReturn
   */
  export type DemoUserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoUser
     */
    select?: DemoUserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DemoUser
     */
    omit?: DemoUserOmit<ExtArgs> | null
    /**
     * The data used to create many DemoUsers.
     */
    data: DemoUserCreateManyInput | DemoUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DemoUser update
   */
  export type DemoUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoUser
     */
    select?: DemoUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoUser
     */
    omit?: DemoUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoUserInclude<ExtArgs> | null
    /**
     * The data needed to update a DemoUser.
     */
    data: XOR<DemoUserUpdateInput, DemoUserUncheckedUpdateInput>
    /**
     * Choose, which DemoUser to update.
     */
    where: DemoUserWhereUniqueInput
  }

  /**
   * DemoUser updateMany
   */
  export type DemoUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DemoUsers.
     */
    data: XOR<DemoUserUpdateManyMutationInput, DemoUserUncheckedUpdateManyInput>
    /**
     * Filter which DemoUsers to update
     */
    where?: DemoUserWhereInput
    /**
     * Limit how many DemoUsers to update.
     */
    limit?: number
  }

  /**
   * DemoUser updateManyAndReturn
   */
  export type DemoUserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoUser
     */
    select?: DemoUserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DemoUser
     */
    omit?: DemoUserOmit<ExtArgs> | null
    /**
     * The data used to update DemoUsers.
     */
    data: XOR<DemoUserUpdateManyMutationInput, DemoUserUncheckedUpdateManyInput>
    /**
     * Filter which DemoUsers to update
     */
    where?: DemoUserWhereInput
    /**
     * Limit how many DemoUsers to update.
     */
    limit?: number
  }

  /**
   * DemoUser upsert
   */
  export type DemoUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoUser
     */
    select?: DemoUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoUser
     */
    omit?: DemoUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoUserInclude<ExtArgs> | null
    /**
     * The filter to search for the DemoUser to update in case it exists.
     */
    where: DemoUserWhereUniqueInput
    /**
     * In case the DemoUser found by the `where` argument doesn't exist, create a new DemoUser with this data.
     */
    create: XOR<DemoUserCreateInput, DemoUserUncheckedCreateInput>
    /**
     * In case the DemoUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DemoUserUpdateInput, DemoUserUncheckedUpdateInput>
  }

  /**
   * DemoUser delete
   */
  export type DemoUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoUser
     */
    select?: DemoUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoUser
     */
    omit?: DemoUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoUserInclude<ExtArgs> | null
    /**
     * Filter which DemoUser to delete.
     */
    where: DemoUserWhereUniqueInput
  }

  /**
   * DemoUser deleteMany
   */
  export type DemoUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DemoUsers to delete
     */
    where?: DemoUserWhereInput
    /**
     * Limit how many DemoUsers to delete.
     */
    limit?: number
  }

  /**
   * DemoUser.memberships
   */
  export type DemoUser$membershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMembership
     */
    select?: DemoMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMembership
     */
    omit?: DemoMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMembershipInclude<ExtArgs> | null
    where?: DemoMembershipWhereInput
    orderBy?: DemoMembershipOrderByWithRelationInput | DemoMembershipOrderByWithRelationInput[]
    cursor?: DemoMembershipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DemoMembershipScalarFieldEnum | DemoMembershipScalarFieldEnum[]
  }

  /**
   * DemoUser.messages
   */
  export type DemoUser$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMessage
     */
    select?: DemoMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMessage
     */
    omit?: DemoMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMessageInclude<ExtArgs> | null
    where?: DemoMessageWhereInput
    orderBy?: DemoMessageOrderByWithRelationInput | DemoMessageOrderByWithRelationInput[]
    cursor?: DemoMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DemoMessageScalarFieldEnum | DemoMessageScalarFieldEnum[]
  }

  /**
   * DemoUser.createdChannels
   */
  export type DemoUser$createdChannelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoChannel
     */
    select?: DemoChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoChannel
     */
    omit?: DemoChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoChannelInclude<ExtArgs> | null
    where?: DemoChannelWhereInput
    orderBy?: DemoChannelOrderByWithRelationInput | DemoChannelOrderByWithRelationInput[]
    cursor?: DemoChannelWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DemoChannelScalarFieldEnum | DemoChannelScalarFieldEnum[]
  }

  /**
   * DemoUser without action
   */
  export type DemoUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoUser
     */
    select?: DemoUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoUser
     */
    omit?: DemoUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoUserInclude<ExtArgs> | null
  }


  /**
   * Model DemoChannel
   */

  export type AggregateDemoChannel = {
    _count: DemoChannelCountAggregateOutputType | null
    _min: DemoChannelMinAggregateOutputType | null
    _max: DemoChannelMaxAggregateOutputType | null
  }

  export type DemoChannelMinAggregateOutputType = {
    id: string | null
    name: string | null
    creatorId: string | null
    isTokenGated: boolean | null
    tokenAddress: string | null
    createdAt: Date | null
  }

  export type DemoChannelMaxAggregateOutputType = {
    id: string | null
    name: string | null
    creatorId: string | null
    isTokenGated: boolean | null
    tokenAddress: string | null
    createdAt: Date | null
  }

  export type DemoChannelCountAggregateOutputType = {
    id: number
    name: number
    creatorId: number
    isTokenGated: number
    tokenAddress: number
    createdAt: number
    _all: number
  }


  export type DemoChannelMinAggregateInputType = {
    id?: true
    name?: true
    creatorId?: true
    isTokenGated?: true
    tokenAddress?: true
    createdAt?: true
  }

  export type DemoChannelMaxAggregateInputType = {
    id?: true
    name?: true
    creatorId?: true
    isTokenGated?: true
    tokenAddress?: true
    createdAt?: true
  }

  export type DemoChannelCountAggregateInputType = {
    id?: true
    name?: true
    creatorId?: true
    isTokenGated?: true
    tokenAddress?: true
    createdAt?: true
    _all?: true
  }

  export type DemoChannelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DemoChannel to aggregate.
     */
    where?: DemoChannelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DemoChannels to fetch.
     */
    orderBy?: DemoChannelOrderByWithRelationInput | DemoChannelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DemoChannelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DemoChannels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DemoChannels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DemoChannels
    **/
    _count?: true | DemoChannelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DemoChannelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DemoChannelMaxAggregateInputType
  }

  export type GetDemoChannelAggregateType<T extends DemoChannelAggregateArgs> = {
        [P in keyof T & keyof AggregateDemoChannel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDemoChannel[P]>
      : GetScalarType<T[P], AggregateDemoChannel[P]>
  }




  export type DemoChannelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DemoChannelWhereInput
    orderBy?: DemoChannelOrderByWithAggregationInput | DemoChannelOrderByWithAggregationInput[]
    by: DemoChannelScalarFieldEnum[] | DemoChannelScalarFieldEnum
    having?: DemoChannelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DemoChannelCountAggregateInputType | true
    _min?: DemoChannelMinAggregateInputType
    _max?: DemoChannelMaxAggregateInputType
  }

  export type DemoChannelGroupByOutputType = {
    id: string
    name: string
    creatorId: string
    isTokenGated: boolean
    tokenAddress: string | null
    createdAt: Date
    _count: DemoChannelCountAggregateOutputType | null
    _min: DemoChannelMinAggregateOutputType | null
    _max: DemoChannelMaxAggregateOutputType | null
  }

  type GetDemoChannelGroupByPayload<T extends DemoChannelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DemoChannelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DemoChannelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DemoChannelGroupByOutputType[P]>
            : GetScalarType<T[P], DemoChannelGroupByOutputType[P]>
        }
      >
    >


  export type DemoChannelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    creatorId?: boolean
    isTokenGated?: boolean
    tokenAddress?: boolean
    createdAt?: boolean
    creator?: boolean | DemoUserDefaultArgs<ExtArgs>
    members?: boolean | DemoChannel$membersArgs<ExtArgs>
    messages?: boolean | DemoChannel$messagesArgs<ExtArgs>
    _count?: boolean | DemoChannelCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["demoChannel"]>

  export type DemoChannelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    creatorId?: boolean
    isTokenGated?: boolean
    tokenAddress?: boolean
    createdAt?: boolean
    creator?: boolean | DemoUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["demoChannel"]>

  export type DemoChannelSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    creatorId?: boolean
    isTokenGated?: boolean
    tokenAddress?: boolean
    createdAt?: boolean
    creator?: boolean | DemoUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["demoChannel"]>

  export type DemoChannelSelectScalar = {
    id?: boolean
    name?: boolean
    creatorId?: boolean
    isTokenGated?: boolean
    tokenAddress?: boolean
    createdAt?: boolean
  }

  export type DemoChannelOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "creatorId" | "isTokenGated" | "tokenAddress" | "createdAt", ExtArgs["result"]["demoChannel"]>
  export type DemoChannelInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | DemoUserDefaultArgs<ExtArgs>
    members?: boolean | DemoChannel$membersArgs<ExtArgs>
    messages?: boolean | DemoChannel$messagesArgs<ExtArgs>
    _count?: boolean | DemoChannelCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DemoChannelIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | DemoUserDefaultArgs<ExtArgs>
  }
  export type DemoChannelIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | DemoUserDefaultArgs<ExtArgs>
  }

  export type $DemoChannelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DemoChannel"
    objects: {
      creator: Prisma.$DemoUserPayload<ExtArgs>
      members: Prisma.$DemoMembershipPayload<ExtArgs>[]
      messages: Prisma.$DemoMessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      creatorId: string
      isTokenGated: boolean
      tokenAddress: string | null
      createdAt: Date
    }, ExtArgs["result"]["demoChannel"]>
    composites: {}
  }

  type DemoChannelGetPayload<S extends boolean | null | undefined | DemoChannelDefaultArgs> = $Result.GetResult<Prisma.$DemoChannelPayload, S>

  type DemoChannelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DemoChannelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DemoChannelCountAggregateInputType | true
    }

  export interface DemoChannelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DemoChannel'], meta: { name: 'DemoChannel' } }
    /**
     * Find zero or one DemoChannel that matches the filter.
     * @param {DemoChannelFindUniqueArgs} args - Arguments to find a DemoChannel
     * @example
     * // Get one DemoChannel
     * const demoChannel = await prisma.demoChannel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DemoChannelFindUniqueArgs>(args: SelectSubset<T, DemoChannelFindUniqueArgs<ExtArgs>>): Prisma__DemoChannelClient<$Result.GetResult<Prisma.$DemoChannelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DemoChannel that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DemoChannelFindUniqueOrThrowArgs} args - Arguments to find a DemoChannel
     * @example
     * // Get one DemoChannel
     * const demoChannel = await prisma.demoChannel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DemoChannelFindUniqueOrThrowArgs>(args: SelectSubset<T, DemoChannelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DemoChannelClient<$Result.GetResult<Prisma.$DemoChannelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DemoChannel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoChannelFindFirstArgs} args - Arguments to find a DemoChannel
     * @example
     * // Get one DemoChannel
     * const demoChannel = await prisma.demoChannel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DemoChannelFindFirstArgs>(args?: SelectSubset<T, DemoChannelFindFirstArgs<ExtArgs>>): Prisma__DemoChannelClient<$Result.GetResult<Prisma.$DemoChannelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DemoChannel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoChannelFindFirstOrThrowArgs} args - Arguments to find a DemoChannel
     * @example
     * // Get one DemoChannel
     * const demoChannel = await prisma.demoChannel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DemoChannelFindFirstOrThrowArgs>(args?: SelectSubset<T, DemoChannelFindFirstOrThrowArgs<ExtArgs>>): Prisma__DemoChannelClient<$Result.GetResult<Prisma.$DemoChannelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DemoChannels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoChannelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DemoChannels
     * const demoChannels = await prisma.demoChannel.findMany()
     * 
     * // Get first 10 DemoChannels
     * const demoChannels = await prisma.demoChannel.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const demoChannelWithIdOnly = await prisma.demoChannel.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DemoChannelFindManyArgs>(args?: SelectSubset<T, DemoChannelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DemoChannelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DemoChannel.
     * @param {DemoChannelCreateArgs} args - Arguments to create a DemoChannel.
     * @example
     * // Create one DemoChannel
     * const DemoChannel = await prisma.demoChannel.create({
     *   data: {
     *     // ... data to create a DemoChannel
     *   }
     * })
     * 
     */
    create<T extends DemoChannelCreateArgs>(args: SelectSubset<T, DemoChannelCreateArgs<ExtArgs>>): Prisma__DemoChannelClient<$Result.GetResult<Prisma.$DemoChannelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DemoChannels.
     * @param {DemoChannelCreateManyArgs} args - Arguments to create many DemoChannels.
     * @example
     * // Create many DemoChannels
     * const demoChannel = await prisma.demoChannel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DemoChannelCreateManyArgs>(args?: SelectSubset<T, DemoChannelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DemoChannels and returns the data saved in the database.
     * @param {DemoChannelCreateManyAndReturnArgs} args - Arguments to create many DemoChannels.
     * @example
     * // Create many DemoChannels
     * const demoChannel = await prisma.demoChannel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DemoChannels and only return the `id`
     * const demoChannelWithIdOnly = await prisma.demoChannel.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DemoChannelCreateManyAndReturnArgs>(args?: SelectSubset<T, DemoChannelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DemoChannelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DemoChannel.
     * @param {DemoChannelDeleteArgs} args - Arguments to delete one DemoChannel.
     * @example
     * // Delete one DemoChannel
     * const DemoChannel = await prisma.demoChannel.delete({
     *   where: {
     *     // ... filter to delete one DemoChannel
     *   }
     * })
     * 
     */
    delete<T extends DemoChannelDeleteArgs>(args: SelectSubset<T, DemoChannelDeleteArgs<ExtArgs>>): Prisma__DemoChannelClient<$Result.GetResult<Prisma.$DemoChannelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DemoChannel.
     * @param {DemoChannelUpdateArgs} args - Arguments to update one DemoChannel.
     * @example
     * // Update one DemoChannel
     * const demoChannel = await prisma.demoChannel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DemoChannelUpdateArgs>(args: SelectSubset<T, DemoChannelUpdateArgs<ExtArgs>>): Prisma__DemoChannelClient<$Result.GetResult<Prisma.$DemoChannelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DemoChannels.
     * @param {DemoChannelDeleteManyArgs} args - Arguments to filter DemoChannels to delete.
     * @example
     * // Delete a few DemoChannels
     * const { count } = await prisma.demoChannel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DemoChannelDeleteManyArgs>(args?: SelectSubset<T, DemoChannelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DemoChannels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoChannelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DemoChannels
     * const demoChannel = await prisma.demoChannel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DemoChannelUpdateManyArgs>(args: SelectSubset<T, DemoChannelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DemoChannels and returns the data updated in the database.
     * @param {DemoChannelUpdateManyAndReturnArgs} args - Arguments to update many DemoChannels.
     * @example
     * // Update many DemoChannels
     * const demoChannel = await prisma.demoChannel.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DemoChannels and only return the `id`
     * const demoChannelWithIdOnly = await prisma.demoChannel.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DemoChannelUpdateManyAndReturnArgs>(args: SelectSubset<T, DemoChannelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DemoChannelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DemoChannel.
     * @param {DemoChannelUpsertArgs} args - Arguments to update or create a DemoChannel.
     * @example
     * // Update or create a DemoChannel
     * const demoChannel = await prisma.demoChannel.upsert({
     *   create: {
     *     // ... data to create a DemoChannel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DemoChannel we want to update
     *   }
     * })
     */
    upsert<T extends DemoChannelUpsertArgs>(args: SelectSubset<T, DemoChannelUpsertArgs<ExtArgs>>): Prisma__DemoChannelClient<$Result.GetResult<Prisma.$DemoChannelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DemoChannels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoChannelCountArgs} args - Arguments to filter DemoChannels to count.
     * @example
     * // Count the number of DemoChannels
     * const count = await prisma.demoChannel.count({
     *   where: {
     *     // ... the filter for the DemoChannels we want to count
     *   }
     * })
    **/
    count<T extends DemoChannelCountArgs>(
      args?: Subset<T, DemoChannelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DemoChannelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DemoChannel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoChannelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DemoChannelAggregateArgs>(args: Subset<T, DemoChannelAggregateArgs>): Prisma.PrismaPromise<GetDemoChannelAggregateType<T>>

    /**
     * Group by DemoChannel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoChannelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DemoChannelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DemoChannelGroupByArgs['orderBy'] }
        : { orderBy?: DemoChannelGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DemoChannelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDemoChannelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DemoChannel model
   */
  readonly fields: DemoChannelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DemoChannel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DemoChannelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    creator<T extends DemoUserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DemoUserDefaultArgs<ExtArgs>>): Prisma__DemoUserClient<$Result.GetResult<Prisma.$DemoUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    members<T extends DemoChannel$membersArgs<ExtArgs> = {}>(args?: Subset<T, DemoChannel$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DemoMembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messages<T extends DemoChannel$messagesArgs<ExtArgs> = {}>(args?: Subset<T, DemoChannel$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DemoMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DemoChannel model
   */
  interface DemoChannelFieldRefs {
    readonly id: FieldRef<"DemoChannel", 'String'>
    readonly name: FieldRef<"DemoChannel", 'String'>
    readonly creatorId: FieldRef<"DemoChannel", 'String'>
    readonly isTokenGated: FieldRef<"DemoChannel", 'Boolean'>
    readonly tokenAddress: FieldRef<"DemoChannel", 'String'>
    readonly createdAt: FieldRef<"DemoChannel", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DemoChannel findUnique
   */
  export type DemoChannelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoChannel
     */
    select?: DemoChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoChannel
     */
    omit?: DemoChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoChannelInclude<ExtArgs> | null
    /**
     * Filter, which DemoChannel to fetch.
     */
    where: DemoChannelWhereUniqueInput
  }

  /**
   * DemoChannel findUniqueOrThrow
   */
  export type DemoChannelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoChannel
     */
    select?: DemoChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoChannel
     */
    omit?: DemoChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoChannelInclude<ExtArgs> | null
    /**
     * Filter, which DemoChannel to fetch.
     */
    where: DemoChannelWhereUniqueInput
  }

  /**
   * DemoChannel findFirst
   */
  export type DemoChannelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoChannel
     */
    select?: DemoChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoChannel
     */
    omit?: DemoChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoChannelInclude<ExtArgs> | null
    /**
     * Filter, which DemoChannel to fetch.
     */
    where?: DemoChannelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DemoChannels to fetch.
     */
    orderBy?: DemoChannelOrderByWithRelationInput | DemoChannelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DemoChannels.
     */
    cursor?: DemoChannelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DemoChannels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DemoChannels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DemoChannels.
     */
    distinct?: DemoChannelScalarFieldEnum | DemoChannelScalarFieldEnum[]
  }

  /**
   * DemoChannel findFirstOrThrow
   */
  export type DemoChannelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoChannel
     */
    select?: DemoChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoChannel
     */
    omit?: DemoChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoChannelInclude<ExtArgs> | null
    /**
     * Filter, which DemoChannel to fetch.
     */
    where?: DemoChannelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DemoChannels to fetch.
     */
    orderBy?: DemoChannelOrderByWithRelationInput | DemoChannelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DemoChannels.
     */
    cursor?: DemoChannelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DemoChannels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DemoChannels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DemoChannels.
     */
    distinct?: DemoChannelScalarFieldEnum | DemoChannelScalarFieldEnum[]
  }

  /**
   * DemoChannel findMany
   */
  export type DemoChannelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoChannel
     */
    select?: DemoChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoChannel
     */
    omit?: DemoChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoChannelInclude<ExtArgs> | null
    /**
     * Filter, which DemoChannels to fetch.
     */
    where?: DemoChannelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DemoChannels to fetch.
     */
    orderBy?: DemoChannelOrderByWithRelationInput | DemoChannelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DemoChannels.
     */
    cursor?: DemoChannelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DemoChannels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DemoChannels.
     */
    skip?: number
    distinct?: DemoChannelScalarFieldEnum | DemoChannelScalarFieldEnum[]
  }

  /**
   * DemoChannel create
   */
  export type DemoChannelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoChannel
     */
    select?: DemoChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoChannel
     */
    omit?: DemoChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoChannelInclude<ExtArgs> | null
    /**
     * The data needed to create a DemoChannel.
     */
    data: XOR<DemoChannelCreateInput, DemoChannelUncheckedCreateInput>
  }

  /**
   * DemoChannel createMany
   */
  export type DemoChannelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DemoChannels.
     */
    data: DemoChannelCreateManyInput | DemoChannelCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DemoChannel createManyAndReturn
   */
  export type DemoChannelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoChannel
     */
    select?: DemoChannelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DemoChannel
     */
    omit?: DemoChannelOmit<ExtArgs> | null
    /**
     * The data used to create many DemoChannels.
     */
    data: DemoChannelCreateManyInput | DemoChannelCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoChannelIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DemoChannel update
   */
  export type DemoChannelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoChannel
     */
    select?: DemoChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoChannel
     */
    omit?: DemoChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoChannelInclude<ExtArgs> | null
    /**
     * The data needed to update a DemoChannel.
     */
    data: XOR<DemoChannelUpdateInput, DemoChannelUncheckedUpdateInput>
    /**
     * Choose, which DemoChannel to update.
     */
    where: DemoChannelWhereUniqueInput
  }

  /**
   * DemoChannel updateMany
   */
  export type DemoChannelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DemoChannels.
     */
    data: XOR<DemoChannelUpdateManyMutationInput, DemoChannelUncheckedUpdateManyInput>
    /**
     * Filter which DemoChannels to update
     */
    where?: DemoChannelWhereInput
    /**
     * Limit how many DemoChannels to update.
     */
    limit?: number
  }

  /**
   * DemoChannel updateManyAndReturn
   */
  export type DemoChannelUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoChannel
     */
    select?: DemoChannelSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DemoChannel
     */
    omit?: DemoChannelOmit<ExtArgs> | null
    /**
     * The data used to update DemoChannels.
     */
    data: XOR<DemoChannelUpdateManyMutationInput, DemoChannelUncheckedUpdateManyInput>
    /**
     * Filter which DemoChannels to update
     */
    where?: DemoChannelWhereInput
    /**
     * Limit how many DemoChannels to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoChannelIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DemoChannel upsert
   */
  export type DemoChannelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoChannel
     */
    select?: DemoChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoChannel
     */
    omit?: DemoChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoChannelInclude<ExtArgs> | null
    /**
     * The filter to search for the DemoChannel to update in case it exists.
     */
    where: DemoChannelWhereUniqueInput
    /**
     * In case the DemoChannel found by the `where` argument doesn't exist, create a new DemoChannel with this data.
     */
    create: XOR<DemoChannelCreateInput, DemoChannelUncheckedCreateInput>
    /**
     * In case the DemoChannel was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DemoChannelUpdateInput, DemoChannelUncheckedUpdateInput>
  }

  /**
   * DemoChannel delete
   */
  export type DemoChannelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoChannel
     */
    select?: DemoChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoChannel
     */
    omit?: DemoChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoChannelInclude<ExtArgs> | null
    /**
     * Filter which DemoChannel to delete.
     */
    where: DemoChannelWhereUniqueInput
  }

  /**
   * DemoChannel deleteMany
   */
  export type DemoChannelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DemoChannels to delete
     */
    where?: DemoChannelWhereInput
    /**
     * Limit how many DemoChannels to delete.
     */
    limit?: number
  }

  /**
   * DemoChannel.members
   */
  export type DemoChannel$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMembership
     */
    select?: DemoMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMembership
     */
    omit?: DemoMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMembershipInclude<ExtArgs> | null
    where?: DemoMembershipWhereInput
    orderBy?: DemoMembershipOrderByWithRelationInput | DemoMembershipOrderByWithRelationInput[]
    cursor?: DemoMembershipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DemoMembershipScalarFieldEnum | DemoMembershipScalarFieldEnum[]
  }

  /**
   * DemoChannel.messages
   */
  export type DemoChannel$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMessage
     */
    select?: DemoMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMessage
     */
    omit?: DemoMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMessageInclude<ExtArgs> | null
    where?: DemoMessageWhereInput
    orderBy?: DemoMessageOrderByWithRelationInput | DemoMessageOrderByWithRelationInput[]
    cursor?: DemoMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DemoMessageScalarFieldEnum | DemoMessageScalarFieldEnum[]
  }

  /**
   * DemoChannel without action
   */
  export type DemoChannelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoChannel
     */
    select?: DemoChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoChannel
     */
    omit?: DemoChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoChannelInclude<ExtArgs> | null
  }


  /**
   * Model DemoMembership
   */

  export type AggregateDemoMembership = {
    _count: DemoMembershipCountAggregateOutputType | null
    _min: DemoMembershipMinAggregateOutputType | null
    _max: DemoMembershipMaxAggregateOutputType | null
  }

  export type DemoMembershipMinAggregateOutputType = {
    id: string | null
    userId: string | null
    channelId: string | null
    role: string | null
    createdAt: Date | null
  }

  export type DemoMembershipMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    channelId: string | null
    role: string | null
    createdAt: Date | null
  }

  export type DemoMembershipCountAggregateOutputType = {
    id: number
    userId: number
    channelId: number
    role: number
    createdAt: number
    _all: number
  }


  export type DemoMembershipMinAggregateInputType = {
    id?: true
    userId?: true
    channelId?: true
    role?: true
    createdAt?: true
  }

  export type DemoMembershipMaxAggregateInputType = {
    id?: true
    userId?: true
    channelId?: true
    role?: true
    createdAt?: true
  }

  export type DemoMembershipCountAggregateInputType = {
    id?: true
    userId?: true
    channelId?: true
    role?: true
    createdAt?: true
    _all?: true
  }

  export type DemoMembershipAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DemoMembership to aggregate.
     */
    where?: DemoMembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DemoMemberships to fetch.
     */
    orderBy?: DemoMembershipOrderByWithRelationInput | DemoMembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DemoMembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DemoMemberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DemoMemberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DemoMemberships
    **/
    _count?: true | DemoMembershipCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DemoMembershipMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DemoMembershipMaxAggregateInputType
  }

  export type GetDemoMembershipAggregateType<T extends DemoMembershipAggregateArgs> = {
        [P in keyof T & keyof AggregateDemoMembership]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDemoMembership[P]>
      : GetScalarType<T[P], AggregateDemoMembership[P]>
  }




  export type DemoMembershipGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DemoMembershipWhereInput
    orderBy?: DemoMembershipOrderByWithAggregationInput | DemoMembershipOrderByWithAggregationInput[]
    by: DemoMembershipScalarFieldEnum[] | DemoMembershipScalarFieldEnum
    having?: DemoMembershipScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DemoMembershipCountAggregateInputType | true
    _min?: DemoMembershipMinAggregateInputType
    _max?: DemoMembershipMaxAggregateInputType
  }

  export type DemoMembershipGroupByOutputType = {
    id: string
    userId: string
    channelId: string
    role: string
    createdAt: Date
    _count: DemoMembershipCountAggregateOutputType | null
    _min: DemoMembershipMinAggregateOutputType | null
    _max: DemoMembershipMaxAggregateOutputType | null
  }

  type GetDemoMembershipGroupByPayload<T extends DemoMembershipGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DemoMembershipGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DemoMembershipGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DemoMembershipGroupByOutputType[P]>
            : GetScalarType<T[P], DemoMembershipGroupByOutputType[P]>
        }
      >
    >


  export type DemoMembershipSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    channelId?: boolean
    role?: boolean
    createdAt?: boolean
    user?: boolean | DemoUserDefaultArgs<ExtArgs>
    channel?: boolean | DemoChannelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["demoMembership"]>

  export type DemoMembershipSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    channelId?: boolean
    role?: boolean
    createdAt?: boolean
    user?: boolean | DemoUserDefaultArgs<ExtArgs>
    channel?: boolean | DemoChannelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["demoMembership"]>

  export type DemoMembershipSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    channelId?: boolean
    role?: boolean
    createdAt?: boolean
    user?: boolean | DemoUserDefaultArgs<ExtArgs>
    channel?: boolean | DemoChannelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["demoMembership"]>

  export type DemoMembershipSelectScalar = {
    id?: boolean
    userId?: boolean
    channelId?: boolean
    role?: boolean
    createdAt?: boolean
  }

  export type DemoMembershipOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "channelId" | "role" | "createdAt", ExtArgs["result"]["demoMembership"]>
  export type DemoMembershipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | DemoUserDefaultArgs<ExtArgs>
    channel?: boolean | DemoChannelDefaultArgs<ExtArgs>
  }
  export type DemoMembershipIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | DemoUserDefaultArgs<ExtArgs>
    channel?: boolean | DemoChannelDefaultArgs<ExtArgs>
  }
  export type DemoMembershipIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | DemoUserDefaultArgs<ExtArgs>
    channel?: boolean | DemoChannelDefaultArgs<ExtArgs>
  }

  export type $DemoMembershipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DemoMembership"
    objects: {
      user: Prisma.$DemoUserPayload<ExtArgs>
      channel: Prisma.$DemoChannelPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      channelId: string
      role: string
      createdAt: Date
    }, ExtArgs["result"]["demoMembership"]>
    composites: {}
  }

  type DemoMembershipGetPayload<S extends boolean | null | undefined | DemoMembershipDefaultArgs> = $Result.GetResult<Prisma.$DemoMembershipPayload, S>

  type DemoMembershipCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DemoMembershipFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DemoMembershipCountAggregateInputType | true
    }

  export interface DemoMembershipDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DemoMembership'], meta: { name: 'DemoMembership' } }
    /**
     * Find zero or one DemoMembership that matches the filter.
     * @param {DemoMembershipFindUniqueArgs} args - Arguments to find a DemoMembership
     * @example
     * // Get one DemoMembership
     * const demoMembership = await prisma.demoMembership.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DemoMembershipFindUniqueArgs>(args: SelectSubset<T, DemoMembershipFindUniqueArgs<ExtArgs>>): Prisma__DemoMembershipClient<$Result.GetResult<Prisma.$DemoMembershipPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DemoMembership that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DemoMembershipFindUniqueOrThrowArgs} args - Arguments to find a DemoMembership
     * @example
     * // Get one DemoMembership
     * const demoMembership = await prisma.demoMembership.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DemoMembershipFindUniqueOrThrowArgs>(args: SelectSubset<T, DemoMembershipFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DemoMembershipClient<$Result.GetResult<Prisma.$DemoMembershipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DemoMembership that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoMembershipFindFirstArgs} args - Arguments to find a DemoMembership
     * @example
     * // Get one DemoMembership
     * const demoMembership = await prisma.demoMembership.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DemoMembershipFindFirstArgs>(args?: SelectSubset<T, DemoMembershipFindFirstArgs<ExtArgs>>): Prisma__DemoMembershipClient<$Result.GetResult<Prisma.$DemoMembershipPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DemoMembership that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoMembershipFindFirstOrThrowArgs} args - Arguments to find a DemoMembership
     * @example
     * // Get one DemoMembership
     * const demoMembership = await prisma.demoMembership.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DemoMembershipFindFirstOrThrowArgs>(args?: SelectSubset<T, DemoMembershipFindFirstOrThrowArgs<ExtArgs>>): Prisma__DemoMembershipClient<$Result.GetResult<Prisma.$DemoMembershipPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DemoMemberships that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoMembershipFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DemoMemberships
     * const demoMemberships = await prisma.demoMembership.findMany()
     * 
     * // Get first 10 DemoMemberships
     * const demoMemberships = await prisma.demoMembership.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const demoMembershipWithIdOnly = await prisma.demoMembership.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DemoMembershipFindManyArgs>(args?: SelectSubset<T, DemoMembershipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DemoMembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DemoMembership.
     * @param {DemoMembershipCreateArgs} args - Arguments to create a DemoMembership.
     * @example
     * // Create one DemoMembership
     * const DemoMembership = await prisma.demoMembership.create({
     *   data: {
     *     // ... data to create a DemoMembership
     *   }
     * })
     * 
     */
    create<T extends DemoMembershipCreateArgs>(args: SelectSubset<T, DemoMembershipCreateArgs<ExtArgs>>): Prisma__DemoMembershipClient<$Result.GetResult<Prisma.$DemoMembershipPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DemoMemberships.
     * @param {DemoMembershipCreateManyArgs} args - Arguments to create many DemoMemberships.
     * @example
     * // Create many DemoMemberships
     * const demoMembership = await prisma.demoMembership.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DemoMembershipCreateManyArgs>(args?: SelectSubset<T, DemoMembershipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DemoMemberships and returns the data saved in the database.
     * @param {DemoMembershipCreateManyAndReturnArgs} args - Arguments to create many DemoMemberships.
     * @example
     * // Create many DemoMemberships
     * const demoMembership = await prisma.demoMembership.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DemoMemberships and only return the `id`
     * const demoMembershipWithIdOnly = await prisma.demoMembership.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DemoMembershipCreateManyAndReturnArgs>(args?: SelectSubset<T, DemoMembershipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DemoMembershipPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DemoMembership.
     * @param {DemoMembershipDeleteArgs} args - Arguments to delete one DemoMembership.
     * @example
     * // Delete one DemoMembership
     * const DemoMembership = await prisma.demoMembership.delete({
     *   where: {
     *     // ... filter to delete one DemoMembership
     *   }
     * })
     * 
     */
    delete<T extends DemoMembershipDeleteArgs>(args: SelectSubset<T, DemoMembershipDeleteArgs<ExtArgs>>): Prisma__DemoMembershipClient<$Result.GetResult<Prisma.$DemoMembershipPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DemoMembership.
     * @param {DemoMembershipUpdateArgs} args - Arguments to update one DemoMembership.
     * @example
     * // Update one DemoMembership
     * const demoMembership = await prisma.demoMembership.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DemoMembershipUpdateArgs>(args: SelectSubset<T, DemoMembershipUpdateArgs<ExtArgs>>): Prisma__DemoMembershipClient<$Result.GetResult<Prisma.$DemoMembershipPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DemoMemberships.
     * @param {DemoMembershipDeleteManyArgs} args - Arguments to filter DemoMemberships to delete.
     * @example
     * // Delete a few DemoMemberships
     * const { count } = await prisma.demoMembership.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DemoMembershipDeleteManyArgs>(args?: SelectSubset<T, DemoMembershipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DemoMemberships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoMembershipUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DemoMemberships
     * const demoMembership = await prisma.demoMembership.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DemoMembershipUpdateManyArgs>(args: SelectSubset<T, DemoMembershipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DemoMemberships and returns the data updated in the database.
     * @param {DemoMembershipUpdateManyAndReturnArgs} args - Arguments to update many DemoMemberships.
     * @example
     * // Update many DemoMemberships
     * const demoMembership = await prisma.demoMembership.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DemoMemberships and only return the `id`
     * const demoMembershipWithIdOnly = await prisma.demoMembership.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DemoMembershipUpdateManyAndReturnArgs>(args: SelectSubset<T, DemoMembershipUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DemoMembershipPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DemoMembership.
     * @param {DemoMembershipUpsertArgs} args - Arguments to update or create a DemoMembership.
     * @example
     * // Update or create a DemoMembership
     * const demoMembership = await prisma.demoMembership.upsert({
     *   create: {
     *     // ... data to create a DemoMembership
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DemoMembership we want to update
     *   }
     * })
     */
    upsert<T extends DemoMembershipUpsertArgs>(args: SelectSubset<T, DemoMembershipUpsertArgs<ExtArgs>>): Prisma__DemoMembershipClient<$Result.GetResult<Prisma.$DemoMembershipPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DemoMemberships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoMembershipCountArgs} args - Arguments to filter DemoMemberships to count.
     * @example
     * // Count the number of DemoMemberships
     * const count = await prisma.demoMembership.count({
     *   where: {
     *     // ... the filter for the DemoMemberships we want to count
     *   }
     * })
    **/
    count<T extends DemoMembershipCountArgs>(
      args?: Subset<T, DemoMembershipCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DemoMembershipCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DemoMembership.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoMembershipAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DemoMembershipAggregateArgs>(args: Subset<T, DemoMembershipAggregateArgs>): Prisma.PrismaPromise<GetDemoMembershipAggregateType<T>>

    /**
     * Group by DemoMembership.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoMembershipGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DemoMembershipGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DemoMembershipGroupByArgs['orderBy'] }
        : { orderBy?: DemoMembershipGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DemoMembershipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDemoMembershipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DemoMembership model
   */
  readonly fields: DemoMembershipFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DemoMembership.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DemoMembershipClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends DemoUserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DemoUserDefaultArgs<ExtArgs>>): Prisma__DemoUserClient<$Result.GetResult<Prisma.$DemoUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    channel<T extends DemoChannelDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DemoChannelDefaultArgs<ExtArgs>>): Prisma__DemoChannelClient<$Result.GetResult<Prisma.$DemoChannelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DemoMembership model
   */
  interface DemoMembershipFieldRefs {
    readonly id: FieldRef<"DemoMembership", 'String'>
    readonly userId: FieldRef<"DemoMembership", 'String'>
    readonly channelId: FieldRef<"DemoMembership", 'String'>
    readonly role: FieldRef<"DemoMembership", 'String'>
    readonly createdAt: FieldRef<"DemoMembership", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DemoMembership findUnique
   */
  export type DemoMembershipFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMembership
     */
    select?: DemoMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMembership
     */
    omit?: DemoMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMembershipInclude<ExtArgs> | null
    /**
     * Filter, which DemoMembership to fetch.
     */
    where: DemoMembershipWhereUniqueInput
  }

  /**
   * DemoMembership findUniqueOrThrow
   */
  export type DemoMembershipFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMembership
     */
    select?: DemoMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMembership
     */
    omit?: DemoMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMembershipInclude<ExtArgs> | null
    /**
     * Filter, which DemoMembership to fetch.
     */
    where: DemoMembershipWhereUniqueInput
  }

  /**
   * DemoMembership findFirst
   */
  export type DemoMembershipFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMembership
     */
    select?: DemoMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMembership
     */
    omit?: DemoMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMembershipInclude<ExtArgs> | null
    /**
     * Filter, which DemoMembership to fetch.
     */
    where?: DemoMembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DemoMemberships to fetch.
     */
    orderBy?: DemoMembershipOrderByWithRelationInput | DemoMembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DemoMemberships.
     */
    cursor?: DemoMembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DemoMemberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DemoMemberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DemoMemberships.
     */
    distinct?: DemoMembershipScalarFieldEnum | DemoMembershipScalarFieldEnum[]
  }

  /**
   * DemoMembership findFirstOrThrow
   */
  export type DemoMembershipFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMembership
     */
    select?: DemoMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMembership
     */
    omit?: DemoMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMembershipInclude<ExtArgs> | null
    /**
     * Filter, which DemoMembership to fetch.
     */
    where?: DemoMembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DemoMemberships to fetch.
     */
    orderBy?: DemoMembershipOrderByWithRelationInput | DemoMembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DemoMemberships.
     */
    cursor?: DemoMembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DemoMemberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DemoMemberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DemoMemberships.
     */
    distinct?: DemoMembershipScalarFieldEnum | DemoMembershipScalarFieldEnum[]
  }

  /**
   * DemoMembership findMany
   */
  export type DemoMembershipFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMembership
     */
    select?: DemoMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMembership
     */
    omit?: DemoMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMembershipInclude<ExtArgs> | null
    /**
     * Filter, which DemoMemberships to fetch.
     */
    where?: DemoMembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DemoMemberships to fetch.
     */
    orderBy?: DemoMembershipOrderByWithRelationInput | DemoMembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DemoMemberships.
     */
    cursor?: DemoMembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DemoMemberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DemoMemberships.
     */
    skip?: number
    distinct?: DemoMembershipScalarFieldEnum | DemoMembershipScalarFieldEnum[]
  }

  /**
   * DemoMembership create
   */
  export type DemoMembershipCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMembership
     */
    select?: DemoMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMembership
     */
    omit?: DemoMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMembershipInclude<ExtArgs> | null
    /**
     * The data needed to create a DemoMembership.
     */
    data: XOR<DemoMembershipCreateInput, DemoMembershipUncheckedCreateInput>
  }

  /**
   * DemoMembership createMany
   */
  export type DemoMembershipCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DemoMemberships.
     */
    data: DemoMembershipCreateManyInput | DemoMembershipCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DemoMembership createManyAndReturn
   */
  export type DemoMembershipCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMembership
     */
    select?: DemoMembershipSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMembership
     */
    omit?: DemoMembershipOmit<ExtArgs> | null
    /**
     * The data used to create many DemoMemberships.
     */
    data: DemoMembershipCreateManyInput | DemoMembershipCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMembershipIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DemoMembership update
   */
  export type DemoMembershipUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMembership
     */
    select?: DemoMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMembership
     */
    omit?: DemoMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMembershipInclude<ExtArgs> | null
    /**
     * The data needed to update a DemoMembership.
     */
    data: XOR<DemoMembershipUpdateInput, DemoMembershipUncheckedUpdateInput>
    /**
     * Choose, which DemoMembership to update.
     */
    where: DemoMembershipWhereUniqueInput
  }

  /**
   * DemoMembership updateMany
   */
  export type DemoMembershipUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DemoMemberships.
     */
    data: XOR<DemoMembershipUpdateManyMutationInput, DemoMembershipUncheckedUpdateManyInput>
    /**
     * Filter which DemoMemberships to update
     */
    where?: DemoMembershipWhereInput
    /**
     * Limit how many DemoMemberships to update.
     */
    limit?: number
  }

  /**
   * DemoMembership updateManyAndReturn
   */
  export type DemoMembershipUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMembership
     */
    select?: DemoMembershipSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMembership
     */
    omit?: DemoMembershipOmit<ExtArgs> | null
    /**
     * The data used to update DemoMemberships.
     */
    data: XOR<DemoMembershipUpdateManyMutationInput, DemoMembershipUncheckedUpdateManyInput>
    /**
     * Filter which DemoMemberships to update
     */
    where?: DemoMembershipWhereInput
    /**
     * Limit how many DemoMemberships to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMembershipIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DemoMembership upsert
   */
  export type DemoMembershipUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMembership
     */
    select?: DemoMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMembership
     */
    omit?: DemoMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMembershipInclude<ExtArgs> | null
    /**
     * The filter to search for the DemoMembership to update in case it exists.
     */
    where: DemoMembershipWhereUniqueInput
    /**
     * In case the DemoMembership found by the `where` argument doesn't exist, create a new DemoMembership with this data.
     */
    create: XOR<DemoMembershipCreateInput, DemoMembershipUncheckedCreateInput>
    /**
     * In case the DemoMembership was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DemoMembershipUpdateInput, DemoMembershipUncheckedUpdateInput>
  }

  /**
   * DemoMembership delete
   */
  export type DemoMembershipDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMembership
     */
    select?: DemoMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMembership
     */
    omit?: DemoMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMembershipInclude<ExtArgs> | null
    /**
     * Filter which DemoMembership to delete.
     */
    where: DemoMembershipWhereUniqueInput
  }

  /**
   * DemoMembership deleteMany
   */
  export type DemoMembershipDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DemoMemberships to delete
     */
    where?: DemoMembershipWhereInput
    /**
     * Limit how many DemoMemberships to delete.
     */
    limit?: number
  }

  /**
   * DemoMembership without action
   */
  export type DemoMembershipDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMembership
     */
    select?: DemoMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMembership
     */
    omit?: DemoMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMembershipInclude<ExtArgs> | null
  }


  /**
   * Model DemoMessage
   */

  export type AggregateDemoMessage = {
    _count: DemoMessageCountAggregateOutputType | null
    _min: DemoMessageMinAggregateOutputType | null
    _max: DemoMessageMaxAggregateOutputType | null
  }

  export type DemoMessageMinAggregateOutputType = {
    id: string | null
    content: string | null
    userId: string | null
    channelId: string | null
    createdAt: Date | null
  }

  export type DemoMessageMaxAggregateOutputType = {
    id: string | null
    content: string | null
    userId: string | null
    channelId: string | null
    createdAt: Date | null
  }

  export type DemoMessageCountAggregateOutputType = {
    id: number
    content: number
    userId: number
    channelId: number
    createdAt: number
    _all: number
  }


  export type DemoMessageMinAggregateInputType = {
    id?: true
    content?: true
    userId?: true
    channelId?: true
    createdAt?: true
  }

  export type DemoMessageMaxAggregateInputType = {
    id?: true
    content?: true
    userId?: true
    channelId?: true
    createdAt?: true
  }

  export type DemoMessageCountAggregateInputType = {
    id?: true
    content?: true
    userId?: true
    channelId?: true
    createdAt?: true
    _all?: true
  }

  export type DemoMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DemoMessage to aggregate.
     */
    where?: DemoMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DemoMessages to fetch.
     */
    orderBy?: DemoMessageOrderByWithRelationInput | DemoMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DemoMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DemoMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DemoMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DemoMessages
    **/
    _count?: true | DemoMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DemoMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DemoMessageMaxAggregateInputType
  }

  export type GetDemoMessageAggregateType<T extends DemoMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateDemoMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDemoMessage[P]>
      : GetScalarType<T[P], AggregateDemoMessage[P]>
  }




  export type DemoMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DemoMessageWhereInput
    orderBy?: DemoMessageOrderByWithAggregationInput | DemoMessageOrderByWithAggregationInput[]
    by: DemoMessageScalarFieldEnum[] | DemoMessageScalarFieldEnum
    having?: DemoMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DemoMessageCountAggregateInputType | true
    _min?: DemoMessageMinAggregateInputType
    _max?: DemoMessageMaxAggregateInputType
  }

  export type DemoMessageGroupByOutputType = {
    id: string
    content: string
    userId: string
    channelId: string
    createdAt: Date
    _count: DemoMessageCountAggregateOutputType | null
    _min: DemoMessageMinAggregateOutputType | null
    _max: DemoMessageMaxAggregateOutputType | null
  }

  type GetDemoMessageGroupByPayload<T extends DemoMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DemoMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DemoMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DemoMessageGroupByOutputType[P]>
            : GetScalarType<T[P], DemoMessageGroupByOutputType[P]>
        }
      >
    >


  export type DemoMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    userId?: boolean
    channelId?: boolean
    createdAt?: boolean
    user?: boolean | DemoUserDefaultArgs<ExtArgs>
    channel?: boolean | DemoChannelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["demoMessage"]>

  export type DemoMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    userId?: boolean
    channelId?: boolean
    createdAt?: boolean
    user?: boolean | DemoUserDefaultArgs<ExtArgs>
    channel?: boolean | DemoChannelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["demoMessage"]>

  export type DemoMessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    userId?: boolean
    channelId?: boolean
    createdAt?: boolean
    user?: boolean | DemoUserDefaultArgs<ExtArgs>
    channel?: boolean | DemoChannelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["demoMessage"]>

  export type DemoMessageSelectScalar = {
    id?: boolean
    content?: boolean
    userId?: boolean
    channelId?: boolean
    createdAt?: boolean
  }

  export type DemoMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content" | "userId" | "channelId" | "createdAt", ExtArgs["result"]["demoMessage"]>
  export type DemoMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | DemoUserDefaultArgs<ExtArgs>
    channel?: boolean | DemoChannelDefaultArgs<ExtArgs>
  }
  export type DemoMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | DemoUserDefaultArgs<ExtArgs>
    channel?: boolean | DemoChannelDefaultArgs<ExtArgs>
  }
  export type DemoMessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | DemoUserDefaultArgs<ExtArgs>
    channel?: boolean | DemoChannelDefaultArgs<ExtArgs>
  }

  export type $DemoMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DemoMessage"
    objects: {
      user: Prisma.$DemoUserPayload<ExtArgs>
      channel: Prisma.$DemoChannelPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      userId: string
      channelId: string
      createdAt: Date
    }, ExtArgs["result"]["demoMessage"]>
    composites: {}
  }

  type DemoMessageGetPayload<S extends boolean | null | undefined | DemoMessageDefaultArgs> = $Result.GetResult<Prisma.$DemoMessagePayload, S>

  type DemoMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DemoMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DemoMessageCountAggregateInputType | true
    }

  export interface DemoMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DemoMessage'], meta: { name: 'DemoMessage' } }
    /**
     * Find zero or one DemoMessage that matches the filter.
     * @param {DemoMessageFindUniqueArgs} args - Arguments to find a DemoMessage
     * @example
     * // Get one DemoMessage
     * const demoMessage = await prisma.demoMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DemoMessageFindUniqueArgs>(args: SelectSubset<T, DemoMessageFindUniqueArgs<ExtArgs>>): Prisma__DemoMessageClient<$Result.GetResult<Prisma.$DemoMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DemoMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DemoMessageFindUniqueOrThrowArgs} args - Arguments to find a DemoMessage
     * @example
     * // Get one DemoMessage
     * const demoMessage = await prisma.demoMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DemoMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, DemoMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DemoMessageClient<$Result.GetResult<Prisma.$DemoMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DemoMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoMessageFindFirstArgs} args - Arguments to find a DemoMessage
     * @example
     * // Get one DemoMessage
     * const demoMessage = await prisma.demoMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DemoMessageFindFirstArgs>(args?: SelectSubset<T, DemoMessageFindFirstArgs<ExtArgs>>): Prisma__DemoMessageClient<$Result.GetResult<Prisma.$DemoMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DemoMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoMessageFindFirstOrThrowArgs} args - Arguments to find a DemoMessage
     * @example
     * // Get one DemoMessage
     * const demoMessage = await prisma.demoMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DemoMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, DemoMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__DemoMessageClient<$Result.GetResult<Prisma.$DemoMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DemoMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DemoMessages
     * const demoMessages = await prisma.demoMessage.findMany()
     * 
     * // Get first 10 DemoMessages
     * const demoMessages = await prisma.demoMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const demoMessageWithIdOnly = await prisma.demoMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DemoMessageFindManyArgs>(args?: SelectSubset<T, DemoMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DemoMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DemoMessage.
     * @param {DemoMessageCreateArgs} args - Arguments to create a DemoMessage.
     * @example
     * // Create one DemoMessage
     * const DemoMessage = await prisma.demoMessage.create({
     *   data: {
     *     // ... data to create a DemoMessage
     *   }
     * })
     * 
     */
    create<T extends DemoMessageCreateArgs>(args: SelectSubset<T, DemoMessageCreateArgs<ExtArgs>>): Prisma__DemoMessageClient<$Result.GetResult<Prisma.$DemoMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DemoMessages.
     * @param {DemoMessageCreateManyArgs} args - Arguments to create many DemoMessages.
     * @example
     * // Create many DemoMessages
     * const demoMessage = await prisma.demoMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DemoMessageCreateManyArgs>(args?: SelectSubset<T, DemoMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DemoMessages and returns the data saved in the database.
     * @param {DemoMessageCreateManyAndReturnArgs} args - Arguments to create many DemoMessages.
     * @example
     * // Create many DemoMessages
     * const demoMessage = await prisma.demoMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DemoMessages and only return the `id`
     * const demoMessageWithIdOnly = await prisma.demoMessage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DemoMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, DemoMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DemoMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DemoMessage.
     * @param {DemoMessageDeleteArgs} args - Arguments to delete one DemoMessage.
     * @example
     * // Delete one DemoMessage
     * const DemoMessage = await prisma.demoMessage.delete({
     *   where: {
     *     // ... filter to delete one DemoMessage
     *   }
     * })
     * 
     */
    delete<T extends DemoMessageDeleteArgs>(args: SelectSubset<T, DemoMessageDeleteArgs<ExtArgs>>): Prisma__DemoMessageClient<$Result.GetResult<Prisma.$DemoMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DemoMessage.
     * @param {DemoMessageUpdateArgs} args - Arguments to update one DemoMessage.
     * @example
     * // Update one DemoMessage
     * const demoMessage = await prisma.demoMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DemoMessageUpdateArgs>(args: SelectSubset<T, DemoMessageUpdateArgs<ExtArgs>>): Prisma__DemoMessageClient<$Result.GetResult<Prisma.$DemoMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DemoMessages.
     * @param {DemoMessageDeleteManyArgs} args - Arguments to filter DemoMessages to delete.
     * @example
     * // Delete a few DemoMessages
     * const { count } = await prisma.demoMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DemoMessageDeleteManyArgs>(args?: SelectSubset<T, DemoMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DemoMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DemoMessages
     * const demoMessage = await prisma.demoMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DemoMessageUpdateManyArgs>(args: SelectSubset<T, DemoMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DemoMessages and returns the data updated in the database.
     * @param {DemoMessageUpdateManyAndReturnArgs} args - Arguments to update many DemoMessages.
     * @example
     * // Update many DemoMessages
     * const demoMessage = await prisma.demoMessage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DemoMessages and only return the `id`
     * const demoMessageWithIdOnly = await prisma.demoMessage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DemoMessageUpdateManyAndReturnArgs>(args: SelectSubset<T, DemoMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DemoMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DemoMessage.
     * @param {DemoMessageUpsertArgs} args - Arguments to update or create a DemoMessage.
     * @example
     * // Update or create a DemoMessage
     * const demoMessage = await prisma.demoMessage.upsert({
     *   create: {
     *     // ... data to create a DemoMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DemoMessage we want to update
     *   }
     * })
     */
    upsert<T extends DemoMessageUpsertArgs>(args: SelectSubset<T, DemoMessageUpsertArgs<ExtArgs>>): Prisma__DemoMessageClient<$Result.GetResult<Prisma.$DemoMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DemoMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoMessageCountArgs} args - Arguments to filter DemoMessages to count.
     * @example
     * // Count the number of DemoMessages
     * const count = await prisma.demoMessage.count({
     *   where: {
     *     // ... the filter for the DemoMessages we want to count
     *   }
     * })
    **/
    count<T extends DemoMessageCountArgs>(
      args?: Subset<T, DemoMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DemoMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DemoMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DemoMessageAggregateArgs>(args: Subset<T, DemoMessageAggregateArgs>): Prisma.PrismaPromise<GetDemoMessageAggregateType<T>>

    /**
     * Group by DemoMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DemoMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DemoMessageGroupByArgs['orderBy'] }
        : { orderBy?: DemoMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DemoMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDemoMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DemoMessage model
   */
  readonly fields: DemoMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DemoMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DemoMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends DemoUserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DemoUserDefaultArgs<ExtArgs>>): Prisma__DemoUserClient<$Result.GetResult<Prisma.$DemoUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    channel<T extends DemoChannelDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DemoChannelDefaultArgs<ExtArgs>>): Prisma__DemoChannelClient<$Result.GetResult<Prisma.$DemoChannelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DemoMessage model
   */
  interface DemoMessageFieldRefs {
    readonly id: FieldRef<"DemoMessage", 'String'>
    readonly content: FieldRef<"DemoMessage", 'String'>
    readonly userId: FieldRef<"DemoMessage", 'String'>
    readonly channelId: FieldRef<"DemoMessage", 'String'>
    readonly createdAt: FieldRef<"DemoMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DemoMessage findUnique
   */
  export type DemoMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMessage
     */
    select?: DemoMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMessage
     */
    omit?: DemoMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMessageInclude<ExtArgs> | null
    /**
     * Filter, which DemoMessage to fetch.
     */
    where: DemoMessageWhereUniqueInput
  }

  /**
   * DemoMessage findUniqueOrThrow
   */
  export type DemoMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMessage
     */
    select?: DemoMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMessage
     */
    omit?: DemoMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMessageInclude<ExtArgs> | null
    /**
     * Filter, which DemoMessage to fetch.
     */
    where: DemoMessageWhereUniqueInput
  }

  /**
   * DemoMessage findFirst
   */
  export type DemoMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMessage
     */
    select?: DemoMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMessage
     */
    omit?: DemoMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMessageInclude<ExtArgs> | null
    /**
     * Filter, which DemoMessage to fetch.
     */
    where?: DemoMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DemoMessages to fetch.
     */
    orderBy?: DemoMessageOrderByWithRelationInput | DemoMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DemoMessages.
     */
    cursor?: DemoMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DemoMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DemoMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DemoMessages.
     */
    distinct?: DemoMessageScalarFieldEnum | DemoMessageScalarFieldEnum[]
  }

  /**
   * DemoMessage findFirstOrThrow
   */
  export type DemoMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMessage
     */
    select?: DemoMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMessage
     */
    omit?: DemoMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMessageInclude<ExtArgs> | null
    /**
     * Filter, which DemoMessage to fetch.
     */
    where?: DemoMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DemoMessages to fetch.
     */
    orderBy?: DemoMessageOrderByWithRelationInput | DemoMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DemoMessages.
     */
    cursor?: DemoMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DemoMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DemoMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DemoMessages.
     */
    distinct?: DemoMessageScalarFieldEnum | DemoMessageScalarFieldEnum[]
  }

  /**
   * DemoMessage findMany
   */
  export type DemoMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMessage
     */
    select?: DemoMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMessage
     */
    omit?: DemoMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMessageInclude<ExtArgs> | null
    /**
     * Filter, which DemoMessages to fetch.
     */
    where?: DemoMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DemoMessages to fetch.
     */
    orderBy?: DemoMessageOrderByWithRelationInput | DemoMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DemoMessages.
     */
    cursor?: DemoMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DemoMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DemoMessages.
     */
    skip?: number
    distinct?: DemoMessageScalarFieldEnum | DemoMessageScalarFieldEnum[]
  }

  /**
   * DemoMessage create
   */
  export type DemoMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMessage
     */
    select?: DemoMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMessage
     */
    omit?: DemoMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a DemoMessage.
     */
    data: XOR<DemoMessageCreateInput, DemoMessageUncheckedCreateInput>
  }

  /**
   * DemoMessage createMany
   */
  export type DemoMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DemoMessages.
     */
    data: DemoMessageCreateManyInput | DemoMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DemoMessage createManyAndReturn
   */
  export type DemoMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMessage
     */
    select?: DemoMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMessage
     */
    omit?: DemoMessageOmit<ExtArgs> | null
    /**
     * The data used to create many DemoMessages.
     */
    data: DemoMessageCreateManyInput | DemoMessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DemoMessage update
   */
  export type DemoMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMessage
     */
    select?: DemoMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMessage
     */
    omit?: DemoMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a DemoMessage.
     */
    data: XOR<DemoMessageUpdateInput, DemoMessageUncheckedUpdateInput>
    /**
     * Choose, which DemoMessage to update.
     */
    where: DemoMessageWhereUniqueInput
  }

  /**
   * DemoMessage updateMany
   */
  export type DemoMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DemoMessages.
     */
    data: XOR<DemoMessageUpdateManyMutationInput, DemoMessageUncheckedUpdateManyInput>
    /**
     * Filter which DemoMessages to update
     */
    where?: DemoMessageWhereInput
    /**
     * Limit how many DemoMessages to update.
     */
    limit?: number
  }

  /**
   * DemoMessage updateManyAndReturn
   */
  export type DemoMessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMessage
     */
    select?: DemoMessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMessage
     */
    omit?: DemoMessageOmit<ExtArgs> | null
    /**
     * The data used to update DemoMessages.
     */
    data: XOR<DemoMessageUpdateManyMutationInput, DemoMessageUncheckedUpdateManyInput>
    /**
     * Filter which DemoMessages to update
     */
    where?: DemoMessageWhereInput
    /**
     * Limit how many DemoMessages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DemoMessage upsert
   */
  export type DemoMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMessage
     */
    select?: DemoMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMessage
     */
    omit?: DemoMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the DemoMessage to update in case it exists.
     */
    where: DemoMessageWhereUniqueInput
    /**
     * In case the DemoMessage found by the `where` argument doesn't exist, create a new DemoMessage with this data.
     */
    create: XOR<DemoMessageCreateInput, DemoMessageUncheckedCreateInput>
    /**
     * In case the DemoMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DemoMessageUpdateInput, DemoMessageUncheckedUpdateInput>
  }

  /**
   * DemoMessage delete
   */
  export type DemoMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMessage
     */
    select?: DemoMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMessage
     */
    omit?: DemoMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMessageInclude<ExtArgs> | null
    /**
     * Filter which DemoMessage to delete.
     */
    where: DemoMessageWhereUniqueInput
  }

  /**
   * DemoMessage deleteMany
   */
  export type DemoMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DemoMessages to delete
     */
    where?: DemoMessageWhereInput
    /**
     * Limit how many DemoMessages to delete.
     */
    limit?: number
  }

  /**
   * DemoMessage without action
   */
  export type DemoMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DemoMessage
     */
    select?: DemoMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DemoMessage
     */
    omit?: DemoMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DemoMessageInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const DemoUserScalarFieldEnum: {
    id: 'id',
    walletAddress: 'walletAddress',
    name: 'name',
    createdAt: 'createdAt'
  };

  export type DemoUserScalarFieldEnum = (typeof DemoUserScalarFieldEnum)[keyof typeof DemoUserScalarFieldEnum]


  export const DemoChannelScalarFieldEnum: {
    id: 'id',
    name: 'name',
    creatorId: 'creatorId',
    isTokenGated: 'isTokenGated',
    tokenAddress: 'tokenAddress',
    createdAt: 'createdAt'
  };

  export type DemoChannelScalarFieldEnum = (typeof DemoChannelScalarFieldEnum)[keyof typeof DemoChannelScalarFieldEnum]


  export const DemoMembershipScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    channelId: 'channelId',
    role: 'role',
    createdAt: 'createdAt'
  };

  export type DemoMembershipScalarFieldEnum = (typeof DemoMembershipScalarFieldEnum)[keyof typeof DemoMembershipScalarFieldEnum]


  export const DemoMessageScalarFieldEnum: {
    id: 'id',
    content: 'content',
    userId: 'userId',
    channelId: 'channelId',
    createdAt: 'createdAt'
  };

  export type DemoMessageScalarFieldEnum = (typeof DemoMessageScalarFieldEnum)[keyof typeof DemoMessageScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type DemoUserWhereInput = {
    AND?: DemoUserWhereInput | DemoUserWhereInput[]
    OR?: DemoUserWhereInput[]
    NOT?: DemoUserWhereInput | DemoUserWhereInput[]
    id?: StringFilter<"DemoUser"> | string
    walletAddress?: StringFilter<"DemoUser"> | string
    name?: StringNullableFilter<"DemoUser"> | string | null
    createdAt?: DateTimeFilter<"DemoUser"> | Date | string
    memberships?: DemoMembershipListRelationFilter
    messages?: DemoMessageListRelationFilter
    createdChannels?: DemoChannelListRelationFilter
  }

  export type DemoUserOrderByWithRelationInput = {
    id?: SortOrder
    walletAddress?: SortOrder
    name?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    memberships?: DemoMembershipOrderByRelationAggregateInput
    messages?: DemoMessageOrderByRelationAggregateInput
    createdChannels?: DemoChannelOrderByRelationAggregateInput
  }

  export type DemoUserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    walletAddress?: string
    AND?: DemoUserWhereInput | DemoUserWhereInput[]
    OR?: DemoUserWhereInput[]
    NOT?: DemoUserWhereInput | DemoUserWhereInput[]
    name?: StringNullableFilter<"DemoUser"> | string | null
    createdAt?: DateTimeFilter<"DemoUser"> | Date | string
    memberships?: DemoMembershipListRelationFilter
    messages?: DemoMessageListRelationFilter
    createdChannels?: DemoChannelListRelationFilter
  }, "id" | "walletAddress">

  export type DemoUserOrderByWithAggregationInput = {
    id?: SortOrder
    walletAddress?: SortOrder
    name?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: DemoUserCountOrderByAggregateInput
    _max?: DemoUserMaxOrderByAggregateInput
    _min?: DemoUserMinOrderByAggregateInput
  }

  export type DemoUserScalarWhereWithAggregatesInput = {
    AND?: DemoUserScalarWhereWithAggregatesInput | DemoUserScalarWhereWithAggregatesInput[]
    OR?: DemoUserScalarWhereWithAggregatesInput[]
    NOT?: DemoUserScalarWhereWithAggregatesInput | DemoUserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DemoUser"> | string
    walletAddress?: StringWithAggregatesFilter<"DemoUser"> | string
    name?: StringNullableWithAggregatesFilter<"DemoUser"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"DemoUser"> | Date | string
  }

  export type DemoChannelWhereInput = {
    AND?: DemoChannelWhereInput | DemoChannelWhereInput[]
    OR?: DemoChannelWhereInput[]
    NOT?: DemoChannelWhereInput | DemoChannelWhereInput[]
    id?: StringFilter<"DemoChannel"> | string
    name?: StringFilter<"DemoChannel"> | string
    creatorId?: StringFilter<"DemoChannel"> | string
    isTokenGated?: BoolFilter<"DemoChannel"> | boolean
    tokenAddress?: StringNullableFilter<"DemoChannel"> | string | null
    createdAt?: DateTimeFilter<"DemoChannel"> | Date | string
    creator?: XOR<DemoUserScalarRelationFilter, DemoUserWhereInput>
    members?: DemoMembershipListRelationFilter
    messages?: DemoMessageListRelationFilter
  }

  export type DemoChannelOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    creatorId?: SortOrder
    isTokenGated?: SortOrder
    tokenAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    creator?: DemoUserOrderByWithRelationInput
    members?: DemoMembershipOrderByRelationAggregateInput
    messages?: DemoMessageOrderByRelationAggregateInput
  }

  export type DemoChannelWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DemoChannelWhereInput | DemoChannelWhereInput[]
    OR?: DemoChannelWhereInput[]
    NOT?: DemoChannelWhereInput | DemoChannelWhereInput[]
    name?: StringFilter<"DemoChannel"> | string
    creatorId?: StringFilter<"DemoChannel"> | string
    isTokenGated?: BoolFilter<"DemoChannel"> | boolean
    tokenAddress?: StringNullableFilter<"DemoChannel"> | string | null
    createdAt?: DateTimeFilter<"DemoChannel"> | Date | string
    creator?: XOR<DemoUserScalarRelationFilter, DemoUserWhereInput>
    members?: DemoMembershipListRelationFilter
    messages?: DemoMessageListRelationFilter
  }, "id">

  export type DemoChannelOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    creatorId?: SortOrder
    isTokenGated?: SortOrder
    tokenAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: DemoChannelCountOrderByAggregateInput
    _max?: DemoChannelMaxOrderByAggregateInput
    _min?: DemoChannelMinOrderByAggregateInput
  }

  export type DemoChannelScalarWhereWithAggregatesInput = {
    AND?: DemoChannelScalarWhereWithAggregatesInput | DemoChannelScalarWhereWithAggregatesInput[]
    OR?: DemoChannelScalarWhereWithAggregatesInput[]
    NOT?: DemoChannelScalarWhereWithAggregatesInput | DemoChannelScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DemoChannel"> | string
    name?: StringWithAggregatesFilter<"DemoChannel"> | string
    creatorId?: StringWithAggregatesFilter<"DemoChannel"> | string
    isTokenGated?: BoolWithAggregatesFilter<"DemoChannel"> | boolean
    tokenAddress?: StringNullableWithAggregatesFilter<"DemoChannel"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"DemoChannel"> | Date | string
  }

  export type DemoMembershipWhereInput = {
    AND?: DemoMembershipWhereInput | DemoMembershipWhereInput[]
    OR?: DemoMembershipWhereInput[]
    NOT?: DemoMembershipWhereInput | DemoMembershipWhereInput[]
    id?: StringFilter<"DemoMembership"> | string
    userId?: StringFilter<"DemoMembership"> | string
    channelId?: StringFilter<"DemoMembership"> | string
    role?: StringFilter<"DemoMembership"> | string
    createdAt?: DateTimeFilter<"DemoMembership"> | Date | string
    user?: XOR<DemoUserScalarRelationFilter, DemoUserWhereInput>
    channel?: XOR<DemoChannelScalarRelationFilter, DemoChannelWhereInput>
  }

  export type DemoMembershipOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    channelId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    user?: DemoUserOrderByWithRelationInput
    channel?: DemoChannelOrderByWithRelationInput
  }

  export type DemoMembershipWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_channelId?: DemoMembershipUserIdChannelIdCompoundUniqueInput
    AND?: DemoMembershipWhereInput | DemoMembershipWhereInput[]
    OR?: DemoMembershipWhereInput[]
    NOT?: DemoMembershipWhereInput | DemoMembershipWhereInput[]
    userId?: StringFilter<"DemoMembership"> | string
    channelId?: StringFilter<"DemoMembership"> | string
    role?: StringFilter<"DemoMembership"> | string
    createdAt?: DateTimeFilter<"DemoMembership"> | Date | string
    user?: XOR<DemoUserScalarRelationFilter, DemoUserWhereInput>
    channel?: XOR<DemoChannelScalarRelationFilter, DemoChannelWhereInput>
  }, "id" | "userId_channelId">

  export type DemoMembershipOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    channelId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    _count?: DemoMembershipCountOrderByAggregateInput
    _max?: DemoMembershipMaxOrderByAggregateInput
    _min?: DemoMembershipMinOrderByAggregateInput
  }

  export type DemoMembershipScalarWhereWithAggregatesInput = {
    AND?: DemoMembershipScalarWhereWithAggregatesInput | DemoMembershipScalarWhereWithAggregatesInput[]
    OR?: DemoMembershipScalarWhereWithAggregatesInput[]
    NOT?: DemoMembershipScalarWhereWithAggregatesInput | DemoMembershipScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DemoMembership"> | string
    userId?: StringWithAggregatesFilter<"DemoMembership"> | string
    channelId?: StringWithAggregatesFilter<"DemoMembership"> | string
    role?: StringWithAggregatesFilter<"DemoMembership"> | string
    createdAt?: DateTimeWithAggregatesFilter<"DemoMembership"> | Date | string
  }

  export type DemoMessageWhereInput = {
    AND?: DemoMessageWhereInput | DemoMessageWhereInput[]
    OR?: DemoMessageWhereInput[]
    NOT?: DemoMessageWhereInput | DemoMessageWhereInput[]
    id?: StringFilter<"DemoMessage"> | string
    content?: StringFilter<"DemoMessage"> | string
    userId?: StringFilter<"DemoMessage"> | string
    channelId?: StringFilter<"DemoMessage"> | string
    createdAt?: DateTimeFilter<"DemoMessage"> | Date | string
    user?: XOR<DemoUserScalarRelationFilter, DemoUserWhereInput>
    channel?: XOR<DemoChannelScalarRelationFilter, DemoChannelWhereInput>
  }

  export type DemoMessageOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    userId?: SortOrder
    channelId?: SortOrder
    createdAt?: SortOrder
    user?: DemoUserOrderByWithRelationInput
    channel?: DemoChannelOrderByWithRelationInput
  }

  export type DemoMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DemoMessageWhereInput | DemoMessageWhereInput[]
    OR?: DemoMessageWhereInput[]
    NOT?: DemoMessageWhereInput | DemoMessageWhereInput[]
    content?: StringFilter<"DemoMessage"> | string
    userId?: StringFilter<"DemoMessage"> | string
    channelId?: StringFilter<"DemoMessage"> | string
    createdAt?: DateTimeFilter<"DemoMessage"> | Date | string
    user?: XOR<DemoUserScalarRelationFilter, DemoUserWhereInput>
    channel?: XOR<DemoChannelScalarRelationFilter, DemoChannelWhereInput>
  }, "id">

  export type DemoMessageOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    userId?: SortOrder
    channelId?: SortOrder
    createdAt?: SortOrder
    _count?: DemoMessageCountOrderByAggregateInput
    _max?: DemoMessageMaxOrderByAggregateInput
    _min?: DemoMessageMinOrderByAggregateInput
  }

  export type DemoMessageScalarWhereWithAggregatesInput = {
    AND?: DemoMessageScalarWhereWithAggregatesInput | DemoMessageScalarWhereWithAggregatesInput[]
    OR?: DemoMessageScalarWhereWithAggregatesInput[]
    NOT?: DemoMessageScalarWhereWithAggregatesInput | DemoMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DemoMessage"> | string
    content?: StringWithAggregatesFilter<"DemoMessage"> | string
    userId?: StringWithAggregatesFilter<"DemoMessage"> | string
    channelId?: StringWithAggregatesFilter<"DemoMessage"> | string
    createdAt?: DateTimeWithAggregatesFilter<"DemoMessage"> | Date | string
  }

  export type DemoUserCreateInput = {
    id?: string
    walletAddress: string
    name?: string | null
    createdAt?: Date | string
    memberships?: DemoMembershipCreateNestedManyWithoutUserInput
    messages?: DemoMessageCreateNestedManyWithoutUserInput
    createdChannels?: DemoChannelCreateNestedManyWithoutCreatorInput
  }

  export type DemoUserUncheckedCreateInput = {
    id?: string
    walletAddress: string
    name?: string | null
    createdAt?: Date | string
    memberships?: DemoMembershipUncheckedCreateNestedManyWithoutUserInput
    messages?: DemoMessageUncheckedCreateNestedManyWithoutUserInput
    createdChannels?: DemoChannelUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type DemoUserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: DemoMembershipUpdateManyWithoutUserNestedInput
    messages?: DemoMessageUpdateManyWithoutUserNestedInput
    createdChannels?: DemoChannelUpdateManyWithoutCreatorNestedInput
  }

  export type DemoUserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: DemoMembershipUncheckedUpdateManyWithoutUserNestedInput
    messages?: DemoMessageUncheckedUpdateManyWithoutUserNestedInput
    createdChannels?: DemoChannelUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type DemoUserCreateManyInput = {
    id?: string
    walletAddress: string
    name?: string | null
    createdAt?: Date | string
  }

  export type DemoUserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DemoUserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DemoChannelCreateInput = {
    id?: string
    name: string
    isTokenGated?: boolean
    tokenAddress?: string | null
    createdAt?: Date | string
    creator: DemoUserCreateNestedOneWithoutCreatedChannelsInput
    members?: DemoMembershipCreateNestedManyWithoutChannelInput
    messages?: DemoMessageCreateNestedManyWithoutChannelInput
  }

  export type DemoChannelUncheckedCreateInput = {
    id?: string
    name: string
    creatorId: string
    isTokenGated?: boolean
    tokenAddress?: string | null
    createdAt?: Date | string
    members?: DemoMembershipUncheckedCreateNestedManyWithoutChannelInput
    messages?: DemoMessageUncheckedCreateNestedManyWithoutChannelInput
  }

  export type DemoChannelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isTokenGated?: BoolFieldUpdateOperationsInput | boolean
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: DemoUserUpdateOneRequiredWithoutCreatedChannelsNestedInput
    members?: DemoMembershipUpdateManyWithoutChannelNestedInput
    messages?: DemoMessageUpdateManyWithoutChannelNestedInput
  }

  export type DemoChannelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    isTokenGated?: BoolFieldUpdateOperationsInput | boolean
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: DemoMembershipUncheckedUpdateManyWithoutChannelNestedInput
    messages?: DemoMessageUncheckedUpdateManyWithoutChannelNestedInput
  }

  export type DemoChannelCreateManyInput = {
    id?: string
    name: string
    creatorId: string
    isTokenGated?: boolean
    tokenAddress?: string | null
    createdAt?: Date | string
  }

  export type DemoChannelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isTokenGated?: BoolFieldUpdateOperationsInput | boolean
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DemoChannelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    isTokenGated?: BoolFieldUpdateOperationsInput | boolean
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DemoMembershipCreateInput = {
    id?: string
    role?: string
    createdAt?: Date | string
    user: DemoUserCreateNestedOneWithoutMembershipsInput
    channel: DemoChannelCreateNestedOneWithoutMembersInput
  }

  export type DemoMembershipUncheckedCreateInput = {
    id?: string
    userId: string
    channelId: string
    role?: string
    createdAt?: Date | string
  }

  export type DemoMembershipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: DemoUserUpdateOneRequiredWithoutMembershipsNestedInput
    channel?: DemoChannelUpdateOneRequiredWithoutMembersNestedInput
  }

  export type DemoMembershipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DemoMembershipCreateManyInput = {
    id?: string
    userId: string
    channelId: string
    role?: string
    createdAt?: Date | string
  }

  export type DemoMembershipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DemoMembershipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DemoMessageCreateInput = {
    id?: string
    content: string
    createdAt?: Date | string
    user: DemoUserCreateNestedOneWithoutMessagesInput
    channel: DemoChannelCreateNestedOneWithoutMessagesInput
  }

  export type DemoMessageUncheckedCreateInput = {
    id?: string
    content: string
    userId: string
    channelId: string
    createdAt?: Date | string
  }

  export type DemoMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: DemoUserUpdateOneRequiredWithoutMessagesNestedInput
    channel?: DemoChannelUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type DemoMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DemoMessageCreateManyInput = {
    id?: string
    content: string
    userId: string
    channelId: string
    createdAt?: Date | string
  }

  export type DemoMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DemoMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DemoMembershipListRelationFilter = {
    every?: DemoMembershipWhereInput
    some?: DemoMembershipWhereInput
    none?: DemoMembershipWhereInput
  }

  export type DemoMessageListRelationFilter = {
    every?: DemoMessageWhereInput
    some?: DemoMessageWhereInput
    none?: DemoMessageWhereInput
  }

  export type DemoChannelListRelationFilter = {
    every?: DemoChannelWhereInput
    some?: DemoChannelWhereInput
    none?: DemoChannelWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DemoMembershipOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DemoMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DemoChannelOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DemoUserCountOrderByAggregateInput = {
    id?: SortOrder
    walletAddress?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type DemoUserMaxOrderByAggregateInput = {
    id?: SortOrder
    walletAddress?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type DemoUserMinOrderByAggregateInput = {
    id?: SortOrder
    walletAddress?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DemoUserScalarRelationFilter = {
    is?: DemoUserWhereInput
    isNot?: DemoUserWhereInput
  }

  export type DemoChannelCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    creatorId?: SortOrder
    isTokenGated?: SortOrder
    tokenAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type DemoChannelMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    creatorId?: SortOrder
    isTokenGated?: SortOrder
    tokenAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type DemoChannelMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    creatorId?: SortOrder
    isTokenGated?: SortOrder
    tokenAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DemoChannelScalarRelationFilter = {
    is?: DemoChannelWhereInput
    isNot?: DemoChannelWhereInput
  }

  export type DemoMembershipUserIdChannelIdCompoundUniqueInput = {
    userId: string
    channelId: string
  }

  export type DemoMembershipCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    channelId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type DemoMembershipMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    channelId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type DemoMembershipMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    channelId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type DemoMessageCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    userId?: SortOrder
    channelId?: SortOrder
    createdAt?: SortOrder
  }

  export type DemoMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    userId?: SortOrder
    channelId?: SortOrder
    createdAt?: SortOrder
  }

  export type DemoMessageMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    userId?: SortOrder
    channelId?: SortOrder
    createdAt?: SortOrder
  }

  export type DemoMembershipCreateNestedManyWithoutUserInput = {
    create?: XOR<DemoMembershipCreateWithoutUserInput, DemoMembershipUncheckedCreateWithoutUserInput> | DemoMembershipCreateWithoutUserInput[] | DemoMembershipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DemoMembershipCreateOrConnectWithoutUserInput | DemoMembershipCreateOrConnectWithoutUserInput[]
    createMany?: DemoMembershipCreateManyUserInputEnvelope
    connect?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
  }

  export type DemoMessageCreateNestedManyWithoutUserInput = {
    create?: XOR<DemoMessageCreateWithoutUserInput, DemoMessageUncheckedCreateWithoutUserInput> | DemoMessageCreateWithoutUserInput[] | DemoMessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DemoMessageCreateOrConnectWithoutUserInput | DemoMessageCreateOrConnectWithoutUserInput[]
    createMany?: DemoMessageCreateManyUserInputEnvelope
    connect?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
  }

  export type DemoChannelCreateNestedManyWithoutCreatorInput = {
    create?: XOR<DemoChannelCreateWithoutCreatorInput, DemoChannelUncheckedCreateWithoutCreatorInput> | DemoChannelCreateWithoutCreatorInput[] | DemoChannelUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: DemoChannelCreateOrConnectWithoutCreatorInput | DemoChannelCreateOrConnectWithoutCreatorInput[]
    createMany?: DemoChannelCreateManyCreatorInputEnvelope
    connect?: DemoChannelWhereUniqueInput | DemoChannelWhereUniqueInput[]
  }

  export type DemoMembershipUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DemoMembershipCreateWithoutUserInput, DemoMembershipUncheckedCreateWithoutUserInput> | DemoMembershipCreateWithoutUserInput[] | DemoMembershipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DemoMembershipCreateOrConnectWithoutUserInput | DemoMembershipCreateOrConnectWithoutUserInput[]
    createMany?: DemoMembershipCreateManyUserInputEnvelope
    connect?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
  }

  export type DemoMessageUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DemoMessageCreateWithoutUserInput, DemoMessageUncheckedCreateWithoutUserInput> | DemoMessageCreateWithoutUserInput[] | DemoMessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DemoMessageCreateOrConnectWithoutUserInput | DemoMessageCreateOrConnectWithoutUserInput[]
    createMany?: DemoMessageCreateManyUserInputEnvelope
    connect?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
  }

  export type DemoChannelUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<DemoChannelCreateWithoutCreatorInput, DemoChannelUncheckedCreateWithoutCreatorInput> | DemoChannelCreateWithoutCreatorInput[] | DemoChannelUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: DemoChannelCreateOrConnectWithoutCreatorInput | DemoChannelCreateOrConnectWithoutCreatorInput[]
    createMany?: DemoChannelCreateManyCreatorInputEnvelope
    connect?: DemoChannelWhereUniqueInput | DemoChannelWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type DemoMembershipUpdateManyWithoutUserNestedInput = {
    create?: XOR<DemoMembershipCreateWithoutUserInput, DemoMembershipUncheckedCreateWithoutUserInput> | DemoMembershipCreateWithoutUserInput[] | DemoMembershipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DemoMembershipCreateOrConnectWithoutUserInput | DemoMembershipCreateOrConnectWithoutUserInput[]
    upsert?: DemoMembershipUpsertWithWhereUniqueWithoutUserInput | DemoMembershipUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DemoMembershipCreateManyUserInputEnvelope
    set?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
    disconnect?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
    delete?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
    connect?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
    update?: DemoMembershipUpdateWithWhereUniqueWithoutUserInput | DemoMembershipUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DemoMembershipUpdateManyWithWhereWithoutUserInput | DemoMembershipUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DemoMembershipScalarWhereInput | DemoMembershipScalarWhereInput[]
  }

  export type DemoMessageUpdateManyWithoutUserNestedInput = {
    create?: XOR<DemoMessageCreateWithoutUserInput, DemoMessageUncheckedCreateWithoutUserInput> | DemoMessageCreateWithoutUserInput[] | DemoMessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DemoMessageCreateOrConnectWithoutUserInput | DemoMessageCreateOrConnectWithoutUserInput[]
    upsert?: DemoMessageUpsertWithWhereUniqueWithoutUserInput | DemoMessageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DemoMessageCreateManyUserInputEnvelope
    set?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
    disconnect?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
    delete?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
    connect?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
    update?: DemoMessageUpdateWithWhereUniqueWithoutUserInput | DemoMessageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DemoMessageUpdateManyWithWhereWithoutUserInput | DemoMessageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DemoMessageScalarWhereInput | DemoMessageScalarWhereInput[]
  }

  export type DemoChannelUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<DemoChannelCreateWithoutCreatorInput, DemoChannelUncheckedCreateWithoutCreatorInput> | DemoChannelCreateWithoutCreatorInput[] | DemoChannelUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: DemoChannelCreateOrConnectWithoutCreatorInput | DemoChannelCreateOrConnectWithoutCreatorInput[]
    upsert?: DemoChannelUpsertWithWhereUniqueWithoutCreatorInput | DemoChannelUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: DemoChannelCreateManyCreatorInputEnvelope
    set?: DemoChannelWhereUniqueInput | DemoChannelWhereUniqueInput[]
    disconnect?: DemoChannelWhereUniqueInput | DemoChannelWhereUniqueInput[]
    delete?: DemoChannelWhereUniqueInput | DemoChannelWhereUniqueInput[]
    connect?: DemoChannelWhereUniqueInput | DemoChannelWhereUniqueInput[]
    update?: DemoChannelUpdateWithWhereUniqueWithoutCreatorInput | DemoChannelUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: DemoChannelUpdateManyWithWhereWithoutCreatorInput | DemoChannelUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: DemoChannelScalarWhereInput | DemoChannelScalarWhereInput[]
  }

  export type DemoMembershipUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DemoMembershipCreateWithoutUserInput, DemoMembershipUncheckedCreateWithoutUserInput> | DemoMembershipCreateWithoutUserInput[] | DemoMembershipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DemoMembershipCreateOrConnectWithoutUserInput | DemoMembershipCreateOrConnectWithoutUserInput[]
    upsert?: DemoMembershipUpsertWithWhereUniqueWithoutUserInput | DemoMembershipUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DemoMembershipCreateManyUserInputEnvelope
    set?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
    disconnect?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
    delete?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
    connect?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
    update?: DemoMembershipUpdateWithWhereUniqueWithoutUserInput | DemoMembershipUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DemoMembershipUpdateManyWithWhereWithoutUserInput | DemoMembershipUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DemoMembershipScalarWhereInput | DemoMembershipScalarWhereInput[]
  }

  export type DemoMessageUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DemoMessageCreateWithoutUserInput, DemoMessageUncheckedCreateWithoutUserInput> | DemoMessageCreateWithoutUserInput[] | DemoMessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DemoMessageCreateOrConnectWithoutUserInput | DemoMessageCreateOrConnectWithoutUserInput[]
    upsert?: DemoMessageUpsertWithWhereUniqueWithoutUserInput | DemoMessageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DemoMessageCreateManyUserInputEnvelope
    set?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
    disconnect?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
    delete?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
    connect?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
    update?: DemoMessageUpdateWithWhereUniqueWithoutUserInput | DemoMessageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DemoMessageUpdateManyWithWhereWithoutUserInput | DemoMessageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DemoMessageScalarWhereInput | DemoMessageScalarWhereInput[]
  }

  export type DemoChannelUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<DemoChannelCreateWithoutCreatorInput, DemoChannelUncheckedCreateWithoutCreatorInput> | DemoChannelCreateWithoutCreatorInput[] | DemoChannelUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: DemoChannelCreateOrConnectWithoutCreatorInput | DemoChannelCreateOrConnectWithoutCreatorInput[]
    upsert?: DemoChannelUpsertWithWhereUniqueWithoutCreatorInput | DemoChannelUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: DemoChannelCreateManyCreatorInputEnvelope
    set?: DemoChannelWhereUniqueInput | DemoChannelWhereUniqueInput[]
    disconnect?: DemoChannelWhereUniqueInput | DemoChannelWhereUniqueInput[]
    delete?: DemoChannelWhereUniqueInput | DemoChannelWhereUniqueInput[]
    connect?: DemoChannelWhereUniqueInput | DemoChannelWhereUniqueInput[]
    update?: DemoChannelUpdateWithWhereUniqueWithoutCreatorInput | DemoChannelUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: DemoChannelUpdateManyWithWhereWithoutCreatorInput | DemoChannelUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: DemoChannelScalarWhereInput | DemoChannelScalarWhereInput[]
  }

  export type DemoUserCreateNestedOneWithoutCreatedChannelsInput = {
    create?: XOR<DemoUserCreateWithoutCreatedChannelsInput, DemoUserUncheckedCreateWithoutCreatedChannelsInput>
    connectOrCreate?: DemoUserCreateOrConnectWithoutCreatedChannelsInput
    connect?: DemoUserWhereUniqueInput
  }

  export type DemoMembershipCreateNestedManyWithoutChannelInput = {
    create?: XOR<DemoMembershipCreateWithoutChannelInput, DemoMembershipUncheckedCreateWithoutChannelInput> | DemoMembershipCreateWithoutChannelInput[] | DemoMembershipUncheckedCreateWithoutChannelInput[]
    connectOrCreate?: DemoMembershipCreateOrConnectWithoutChannelInput | DemoMembershipCreateOrConnectWithoutChannelInput[]
    createMany?: DemoMembershipCreateManyChannelInputEnvelope
    connect?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
  }

  export type DemoMessageCreateNestedManyWithoutChannelInput = {
    create?: XOR<DemoMessageCreateWithoutChannelInput, DemoMessageUncheckedCreateWithoutChannelInput> | DemoMessageCreateWithoutChannelInput[] | DemoMessageUncheckedCreateWithoutChannelInput[]
    connectOrCreate?: DemoMessageCreateOrConnectWithoutChannelInput | DemoMessageCreateOrConnectWithoutChannelInput[]
    createMany?: DemoMessageCreateManyChannelInputEnvelope
    connect?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
  }

  export type DemoMembershipUncheckedCreateNestedManyWithoutChannelInput = {
    create?: XOR<DemoMembershipCreateWithoutChannelInput, DemoMembershipUncheckedCreateWithoutChannelInput> | DemoMembershipCreateWithoutChannelInput[] | DemoMembershipUncheckedCreateWithoutChannelInput[]
    connectOrCreate?: DemoMembershipCreateOrConnectWithoutChannelInput | DemoMembershipCreateOrConnectWithoutChannelInput[]
    createMany?: DemoMembershipCreateManyChannelInputEnvelope
    connect?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
  }

  export type DemoMessageUncheckedCreateNestedManyWithoutChannelInput = {
    create?: XOR<DemoMessageCreateWithoutChannelInput, DemoMessageUncheckedCreateWithoutChannelInput> | DemoMessageCreateWithoutChannelInput[] | DemoMessageUncheckedCreateWithoutChannelInput[]
    connectOrCreate?: DemoMessageCreateOrConnectWithoutChannelInput | DemoMessageCreateOrConnectWithoutChannelInput[]
    createMany?: DemoMessageCreateManyChannelInputEnvelope
    connect?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DemoUserUpdateOneRequiredWithoutCreatedChannelsNestedInput = {
    create?: XOR<DemoUserCreateWithoutCreatedChannelsInput, DemoUserUncheckedCreateWithoutCreatedChannelsInput>
    connectOrCreate?: DemoUserCreateOrConnectWithoutCreatedChannelsInput
    upsert?: DemoUserUpsertWithoutCreatedChannelsInput
    connect?: DemoUserWhereUniqueInput
    update?: XOR<XOR<DemoUserUpdateToOneWithWhereWithoutCreatedChannelsInput, DemoUserUpdateWithoutCreatedChannelsInput>, DemoUserUncheckedUpdateWithoutCreatedChannelsInput>
  }

  export type DemoMembershipUpdateManyWithoutChannelNestedInput = {
    create?: XOR<DemoMembershipCreateWithoutChannelInput, DemoMembershipUncheckedCreateWithoutChannelInput> | DemoMembershipCreateWithoutChannelInput[] | DemoMembershipUncheckedCreateWithoutChannelInput[]
    connectOrCreate?: DemoMembershipCreateOrConnectWithoutChannelInput | DemoMembershipCreateOrConnectWithoutChannelInput[]
    upsert?: DemoMembershipUpsertWithWhereUniqueWithoutChannelInput | DemoMembershipUpsertWithWhereUniqueWithoutChannelInput[]
    createMany?: DemoMembershipCreateManyChannelInputEnvelope
    set?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
    disconnect?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
    delete?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
    connect?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
    update?: DemoMembershipUpdateWithWhereUniqueWithoutChannelInput | DemoMembershipUpdateWithWhereUniqueWithoutChannelInput[]
    updateMany?: DemoMembershipUpdateManyWithWhereWithoutChannelInput | DemoMembershipUpdateManyWithWhereWithoutChannelInput[]
    deleteMany?: DemoMembershipScalarWhereInput | DemoMembershipScalarWhereInput[]
  }

  export type DemoMessageUpdateManyWithoutChannelNestedInput = {
    create?: XOR<DemoMessageCreateWithoutChannelInput, DemoMessageUncheckedCreateWithoutChannelInput> | DemoMessageCreateWithoutChannelInput[] | DemoMessageUncheckedCreateWithoutChannelInput[]
    connectOrCreate?: DemoMessageCreateOrConnectWithoutChannelInput | DemoMessageCreateOrConnectWithoutChannelInput[]
    upsert?: DemoMessageUpsertWithWhereUniqueWithoutChannelInput | DemoMessageUpsertWithWhereUniqueWithoutChannelInput[]
    createMany?: DemoMessageCreateManyChannelInputEnvelope
    set?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
    disconnect?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
    delete?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
    connect?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
    update?: DemoMessageUpdateWithWhereUniqueWithoutChannelInput | DemoMessageUpdateWithWhereUniqueWithoutChannelInput[]
    updateMany?: DemoMessageUpdateManyWithWhereWithoutChannelInput | DemoMessageUpdateManyWithWhereWithoutChannelInput[]
    deleteMany?: DemoMessageScalarWhereInput | DemoMessageScalarWhereInput[]
  }

  export type DemoMembershipUncheckedUpdateManyWithoutChannelNestedInput = {
    create?: XOR<DemoMembershipCreateWithoutChannelInput, DemoMembershipUncheckedCreateWithoutChannelInput> | DemoMembershipCreateWithoutChannelInput[] | DemoMembershipUncheckedCreateWithoutChannelInput[]
    connectOrCreate?: DemoMembershipCreateOrConnectWithoutChannelInput | DemoMembershipCreateOrConnectWithoutChannelInput[]
    upsert?: DemoMembershipUpsertWithWhereUniqueWithoutChannelInput | DemoMembershipUpsertWithWhereUniqueWithoutChannelInput[]
    createMany?: DemoMembershipCreateManyChannelInputEnvelope
    set?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
    disconnect?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
    delete?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
    connect?: DemoMembershipWhereUniqueInput | DemoMembershipWhereUniqueInput[]
    update?: DemoMembershipUpdateWithWhereUniqueWithoutChannelInput | DemoMembershipUpdateWithWhereUniqueWithoutChannelInput[]
    updateMany?: DemoMembershipUpdateManyWithWhereWithoutChannelInput | DemoMembershipUpdateManyWithWhereWithoutChannelInput[]
    deleteMany?: DemoMembershipScalarWhereInput | DemoMembershipScalarWhereInput[]
  }

  export type DemoMessageUncheckedUpdateManyWithoutChannelNestedInput = {
    create?: XOR<DemoMessageCreateWithoutChannelInput, DemoMessageUncheckedCreateWithoutChannelInput> | DemoMessageCreateWithoutChannelInput[] | DemoMessageUncheckedCreateWithoutChannelInput[]
    connectOrCreate?: DemoMessageCreateOrConnectWithoutChannelInput | DemoMessageCreateOrConnectWithoutChannelInput[]
    upsert?: DemoMessageUpsertWithWhereUniqueWithoutChannelInput | DemoMessageUpsertWithWhereUniqueWithoutChannelInput[]
    createMany?: DemoMessageCreateManyChannelInputEnvelope
    set?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
    disconnect?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
    delete?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
    connect?: DemoMessageWhereUniqueInput | DemoMessageWhereUniqueInput[]
    update?: DemoMessageUpdateWithWhereUniqueWithoutChannelInput | DemoMessageUpdateWithWhereUniqueWithoutChannelInput[]
    updateMany?: DemoMessageUpdateManyWithWhereWithoutChannelInput | DemoMessageUpdateManyWithWhereWithoutChannelInput[]
    deleteMany?: DemoMessageScalarWhereInput | DemoMessageScalarWhereInput[]
  }

  export type DemoUserCreateNestedOneWithoutMembershipsInput = {
    create?: XOR<DemoUserCreateWithoutMembershipsInput, DemoUserUncheckedCreateWithoutMembershipsInput>
    connectOrCreate?: DemoUserCreateOrConnectWithoutMembershipsInput
    connect?: DemoUserWhereUniqueInput
  }

  export type DemoChannelCreateNestedOneWithoutMembersInput = {
    create?: XOR<DemoChannelCreateWithoutMembersInput, DemoChannelUncheckedCreateWithoutMembersInput>
    connectOrCreate?: DemoChannelCreateOrConnectWithoutMembersInput
    connect?: DemoChannelWhereUniqueInput
  }

  export type DemoUserUpdateOneRequiredWithoutMembershipsNestedInput = {
    create?: XOR<DemoUserCreateWithoutMembershipsInput, DemoUserUncheckedCreateWithoutMembershipsInput>
    connectOrCreate?: DemoUserCreateOrConnectWithoutMembershipsInput
    upsert?: DemoUserUpsertWithoutMembershipsInput
    connect?: DemoUserWhereUniqueInput
    update?: XOR<XOR<DemoUserUpdateToOneWithWhereWithoutMembershipsInput, DemoUserUpdateWithoutMembershipsInput>, DemoUserUncheckedUpdateWithoutMembershipsInput>
  }

  export type DemoChannelUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<DemoChannelCreateWithoutMembersInput, DemoChannelUncheckedCreateWithoutMembersInput>
    connectOrCreate?: DemoChannelCreateOrConnectWithoutMembersInput
    upsert?: DemoChannelUpsertWithoutMembersInput
    connect?: DemoChannelWhereUniqueInput
    update?: XOR<XOR<DemoChannelUpdateToOneWithWhereWithoutMembersInput, DemoChannelUpdateWithoutMembersInput>, DemoChannelUncheckedUpdateWithoutMembersInput>
  }

  export type DemoUserCreateNestedOneWithoutMessagesInput = {
    create?: XOR<DemoUserCreateWithoutMessagesInput, DemoUserUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: DemoUserCreateOrConnectWithoutMessagesInput
    connect?: DemoUserWhereUniqueInput
  }

  export type DemoChannelCreateNestedOneWithoutMessagesInput = {
    create?: XOR<DemoChannelCreateWithoutMessagesInput, DemoChannelUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: DemoChannelCreateOrConnectWithoutMessagesInput
    connect?: DemoChannelWhereUniqueInput
  }

  export type DemoUserUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<DemoUserCreateWithoutMessagesInput, DemoUserUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: DemoUserCreateOrConnectWithoutMessagesInput
    upsert?: DemoUserUpsertWithoutMessagesInput
    connect?: DemoUserWhereUniqueInput
    update?: XOR<XOR<DemoUserUpdateToOneWithWhereWithoutMessagesInput, DemoUserUpdateWithoutMessagesInput>, DemoUserUncheckedUpdateWithoutMessagesInput>
  }

  export type DemoChannelUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<DemoChannelCreateWithoutMessagesInput, DemoChannelUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: DemoChannelCreateOrConnectWithoutMessagesInput
    upsert?: DemoChannelUpsertWithoutMessagesInput
    connect?: DemoChannelWhereUniqueInput
    update?: XOR<XOR<DemoChannelUpdateToOneWithWhereWithoutMessagesInput, DemoChannelUpdateWithoutMessagesInput>, DemoChannelUncheckedUpdateWithoutMessagesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DemoMembershipCreateWithoutUserInput = {
    id?: string
    role?: string
    createdAt?: Date | string
    channel: DemoChannelCreateNestedOneWithoutMembersInput
  }

  export type DemoMembershipUncheckedCreateWithoutUserInput = {
    id?: string
    channelId: string
    role?: string
    createdAt?: Date | string
  }

  export type DemoMembershipCreateOrConnectWithoutUserInput = {
    where: DemoMembershipWhereUniqueInput
    create: XOR<DemoMembershipCreateWithoutUserInput, DemoMembershipUncheckedCreateWithoutUserInput>
  }

  export type DemoMembershipCreateManyUserInputEnvelope = {
    data: DemoMembershipCreateManyUserInput | DemoMembershipCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type DemoMessageCreateWithoutUserInput = {
    id?: string
    content: string
    createdAt?: Date | string
    channel: DemoChannelCreateNestedOneWithoutMessagesInput
  }

  export type DemoMessageUncheckedCreateWithoutUserInput = {
    id?: string
    content: string
    channelId: string
    createdAt?: Date | string
  }

  export type DemoMessageCreateOrConnectWithoutUserInput = {
    where: DemoMessageWhereUniqueInput
    create: XOR<DemoMessageCreateWithoutUserInput, DemoMessageUncheckedCreateWithoutUserInput>
  }

  export type DemoMessageCreateManyUserInputEnvelope = {
    data: DemoMessageCreateManyUserInput | DemoMessageCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type DemoChannelCreateWithoutCreatorInput = {
    id?: string
    name: string
    isTokenGated?: boolean
    tokenAddress?: string | null
    createdAt?: Date | string
    members?: DemoMembershipCreateNestedManyWithoutChannelInput
    messages?: DemoMessageCreateNestedManyWithoutChannelInput
  }

  export type DemoChannelUncheckedCreateWithoutCreatorInput = {
    id?: string
    name: string
    isTokenGated?: boolean
    tokenAddress?: string | null
    createdAt?: Date | string
    members?: DemoMembershipUncheckedCreateNestedManyWithoutChannelInput
    messages?: DemoMessageUncheckedCreateNestedManyWithoutChannelInput
  }

  export type DemoChannelCreateOrConnectWithoutCreatorInput = {
    where: DemoChannelWhereUniqueInput
    create: XOR<DemoChannelCreateWithoutCreatorInput, DemoChannelUncheckedCreateWithoutCreatorInput>
  }

  export type DemoChannelCreateManyCreatorInputEnvelope = {
    data: DemoChannelCreateManyCreatorInput | DemoChannelCreateManyCreatorInput[]
    skipDuplicates?: boolean
  }

  export type DemoMembershipUpsertWithWhereUniqueWithoutUserInput = {
    where: DemoMembershipWhereUniqueInput
    update: XOR<DemoMembershipUpdateWithoutUserInput, DemoMembershipUncheckedUpdateWithoutUserInput>
    create: XOR<DemoMembershipCreateWithoutUserInput, DemoMembershipUncheckedCreateWithoutUserInput>
  }

  export type DemoMembershipUpdateWithWhereUniqueWithoutUserInput = {
    where: DemoMembershipWhereUniqueInput
    data: XOR<DemoMembershipUpdateWithoutUserInput, DemoMembershipUncheckedUpdateWithoutUserInput>
  }

  export type DemoMembershipUpdateManyWithWhereWithoutUserInput = {
    where: DemoMembershipScalarWhereInput
    data: XOR<DemoMembershipUpdateManyMutationInput, DemoMembershipUncheckedUpdateManyWithoutUserInput>
  }

  export type DemoMembershipScalarWhereInput = {
    AND?: DemoMembershipScalarWhereInput | DemoMembershipScalarWhereInput[]
    OR?: DemoMembershipScalarWhereInput[]
    NOT?: DemoMembershipScalarWhereInput | DemoMembershipScalarWhereInput[]
    id?: StringFilter<"DemoMembership"> | string
    userId?: StringFilter<"DemoMembership"> | string
    channelId?: StringFilter<"DemoMembership"> | string
    role?: StringFilter<"DemoMembership"> | string
    createdAt?: DateTimeFilter<"DemoMembership"> | Date | string
  }

  export type DemoMessageUpsertWithWhereUniqueWithoutUserInput = {
    where: DemoMessageWhereUniqueInput
    update: XOR<DemoMessageUpdateWithoutUserInput, DemoMessageUncheckedUpdateWithoutUserInput>
    create: XOR<DemoMessageCreateWithoutUserInput, DemoMessageUncheckedCreateWithoutUserInput>
  }

  export type DemoMessageUpdateWithWhereUniqueWithoutUserInput = {
    where: DemoMessageWhereUniqueInput
    data: XOR<DemoMessageUpdateWithoutUserInput, DemoMessageUncheckedUpdateWithoutUserInput>
  }

  export type DemoMessageUpdateManyWithWhereWithoutUserInput = {
    where: DemoMessageScalarWhereInput
    data: XOR<DemoMessageUpdateManyMutationInput, DemoMessageUncheckedUpdateManyWithoutUserInput>
  }

  export type DemoMessageScalarWhereInput = {
    AND?: DemoMessageScalarWhereInput | DemoMessageScalarWhereInput[]
    OR?: DemoMessageScalarWhereInput[]
    NOT?: DemoMessageScalarWhereInput | DemoMessageScalarWhereInput[]
    id?: StringFilter<"DemoMessage"> | string
    content?: StringFilter<"DemoMessage"> | string
    userId?: StringFilter<"DemoMessage"> | string
    channelId?: StringFilter<"DemoMessage"> | string
    createdAt?: DateTimeFilter<"DemoMessage"> | Date | string
  }

  export type DemoChannelUpsertWithWhereUniqueWithoutCreatorInput = {
    where: DemoChannelWhereUniqueInput
    update: XOR<DemoChannelUpdateWithoutCreatorInput, DemoChannelUncheckedUpdateWithoutCreatorInput>
    create: XOR<DemoChannelCreateWithoutCreatorInput, DemoChannelUncheckedCreateWithoutCreatorInput>
  }

  export type DemoChannelUpdateWithWhereUniqueWithoutCreatorInput = {
    where: DemoChannelWhereUniqueInput
    data: XOR<DemoChannelUpdateWithoutCreatorInput, DemoChannelUncheckedUpdateWithoutCreatorInput>
  }

  export type DemoChannelUpdateManyWithWhereWithoutCreatorInput = {
    where: DemoChannelScalarWhereInput
    data: XOR<DemoChannelUpdateManyMutationInput, DemoChannelUncheckedUpdateManyWithoutCreatorInput>
  }

  export type DemoChannelScalarWhereInput = {
    AND?: DemoChannelScalarWhereInput | DemoChannelScalarWhereInput[]
    OR?: DemoChannelScalarWhereInput[]
    NOT?: DemoChannelScalarWhereInput | DemoChannelScalarWhereInput[]
    id?: StringFilter<"DemoChannel"> | string
    name?: StringFilter<"DemoChannel"> | string
    creatorId?: StringFilter<"DemoChannel"> | string
    isTokenGated?: BoolFilter<"DemoChannel"> | boolean
    tokenAddress?: StringNullableFilter<"DemoChannel"> | string | null
    createdAt?: DateTimeFilter<"DemoChannel"> | Date | string
  }

  export type DemoUserCreateWithoutCreatedChannelsInput = {
    id?: string
    walletAddress: string
    name?: string | null
    createdAt?: Date | string
    memberships?: DemoMembershipCreateNestedManyWithoutUserInput
    messages?: DemoMessageCreateNestedManyWithoutUserInput
  }

  export type DemoUserUncheckedCreateWithoutCreatedChannelsInput = {
    id?: string
    walletAddress: string
    name?: string | null
    createdAt?: Date | string
    memberships?: DemoMembershipUncheckedCreateNestedManyWithoutUserInput
    messages?: DemoMessageUncheckedCreateNestedManyWithoutUserInput
  }

  export type DemoUserCreateOrConnectWithoutCreatedChannelsInput = {
    where: DemoUserWhereUniqueInput
    create: XOR<DemoUserCreateWithoutCreatedChannelsInput, DemoUserUncheckedCreateWithoutCreatedChannelsInput>
  }

  export type DemoMembershipCreateWithoutChannelInput = {
    id?: string
    role?: string
    createdAt?: Date | string
    user: DemoUserCreateNestedOneWithoutMembershipsInput
  }

  export type DemoMembershipUncheckedCreateWithoutChannelInput = {
    id?: string
    userId: string
    role?: string
    createdAt?: Date | string
  }

  export type DemoMembershipCreateOrConnectWithoutChannelInput = {
    where: DemoMembershipWhereUniqueInput
    create: XOR<DemoMembershipCreateWithoutChannelInput, DemoMembershipUncheckedCreateWithoutChannelInput>
  }

  export type DemoMembershipCreateManyChannelInputEnvelope = {
    data: DemoMembershipCreateManyChannelInput | DemoMembershipCreateManyChannelInput[]
    skipDuplicates?: boolean
  }

  export type DemoMessageCreateWithoutChannelInput = {
    id?: string
    content: string
    createdAt?: Date | string
    user: DemoUserCreateNestedOneWithoutMessagesInput
  }

  export type DemoMessageUncheckedCreateWithoutChannelInput = {
    id?: string
    content: string
    userId: string
    createdAt?: Date | string
  }

  export type DemoMessageCreateOrConnectWithoutChannelInput = {
    where: DemoMessageWhereUniqueInput
    create: XOR<DemoMessageCreateWithoutChannelInput, DemoMessageUncheckedCreateWithoutChannelInput>
  }

  export type DemoMessageCreateManyChannelInputEnvelope = {
    data: DemoMessageCreateManyChannelInput | DemoMessageCreateManyChannelInput[]
    skipDuplicates?: boolean
  }

  export type DemoUserUpsertWithoutCreatedChannelsInput = {
    update: XOR<DemoUserUpdateWithoutCreatedChannelsInput, DemoUserUncheckedUpdateWithoutCreatedChannelsInput>
    create: XOR<DemoUserCreateWithoutCreatedChannelsInput, DemoUserUncheckedCreateWithoutCreatedChannelsInput>
    where?: DemoUserWhereInput
  }

  export type DemoUserUpdateToOneWithWhereWithoutCreatedChannelsInput = {
    where?: DemoUserWhereInput
    data: XOR<DemoUserUpdateWithoutCreatedChannelsInput, DemoUserUncheckedUpdateWithoutCreatedChannelsInput>
  }

  export type DemoUserUpdateWithoutCreatedChannelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: DemoMembershipUpdateManyWithoutUserNestedInput
    messages?: DemoMessageUpdateManyWithoutUserNestedInput
  }

  export type DemoUserUncheckedUpdateWithoutCreatedChannelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: DemoMembershipUncheckedUpdateManyWithoutUserNestedInput
    messages?: DemoMessageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DemoMembershipUpsertWithWhereUniqueWithoutChannelInput = {
    where: DemoMembershipWhereUniqueInput
    update: XOR<DemoMembershipUpdateWithoutChannelInput, DemoMembershipUncheckedUpdateWithoutChannelInput>
    create: XOR<DemoMembershipCreateWithoutChannelInput, DemoMembershipUncheckedCreateWithoutChannelInput>
  }

  export type DemoMembershipUpdateWithWhereUniqueWithoutChannelInput = {
    where: DemoMembershipWhereUniqueInput
    data: XOR<DemoMembershipUpdateWithoutChannelInput, DemoMembershipUncheckedUpdateWithoutChannelInput>
  }

  export type DemoMembershipUpdateManyWithWhereWithoutChannelInput = {
    where: DemoMembershipScalarWhereInput
    data: XOR<DemoMembershipUpdateManyMutationInput, DemoMembershipUncheckedUpdateManyWithoutChannelInput>
  }

  export type DemoMessageUpsertWithWhereUniqueWithoutChannelInput = {
    where: DemoMessageWhereUniqueInput
    update: XOR<DemoMessageUpdateWithoutChannelInput, DemoMessageUncheckedUpdateWithoutChannelInput>
    create: XOR<DemoMessageCreateWithoutChannelInput, DemoMessageUncheckedCreateWithoutChannelInput>
  }

  export type DemoMessageUpdateWithWhereUniqueWithoutChannelInput = {
    where: DemoMessageWhereUniqueInput
    data: XOR<DemoMessageUpdateWithoutChannelInput, DemoMessageUncheckedUpdateWithoutChannelInput>
  }

  export type DemoMessageUpdateManyWithWhereWithoutChannelInput = {
    where: DemoMessageScalarWhereInput
    data: XOR<DemoMessageUpdateManyMutationInput, DemoMessageUncheckedUpdateManyWithoutChannelInput>
  }

  export type DemoUserCreateWithoutMembershipsInput = {
    id?: string
    walletAddress: string
    name?: string | null
    createdAt?: Date | string
    messages?: DemoMessageCreateNestedManyWithoutUserInput
    createdChannels?: DemoChannelCreateNestedManyWithoutCreatorInput
  }

  export type DemoUserUncheckedCreateWithoutMembershipsInput = {
    id?: string
    walletAddress: string
    name?: string | null
    createdAt?: Date | string
    messages?: DemoMessageUncheckedCreateNestedManyWithoutUserInput
    createdChannels?: DemoChannelUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type DemoUserCreateOrConnectWithoutMembershipsInput = {
    where: DemoUserWhereUniqueInput
    create: XOR<DemoUserCreateWithoutMembershipsInput, DemoUserUncheckedCreateWithoutMembershipsInput>
  }

  export type DemoChannelCreateWithoutMembersInput = {
    id?: string
    name: string
    isTokenGated?: boolean
    tokenAddress?: string | null
    createdAt?: Date | string
    creator: DemoUserCreateNestedOneWithoutCreatedChannelsInput
    messages?: DemoMessageCreateNestedManyWithoutChannelInput
  }

  export type DemoChannelUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    creatorId: string
    isTokenGated?: boolean
    tokenAddress?: string | null
    createdAt?: Date | string
    messages?: DemoMessageUncheckedCreateNestedManyWithoutChannelInput
  }

  export type DemoChannelCreateOrConnectWithoutMembersInput = {
    where: DemoChannelWhereUniqueInput
    create: XOR<DemoChannelCreateWithoutMembersInput, DemoChannelUncheckedCreateWithoutMembersInput>
  }

  export type DemoUserUpsertWithoutMembershipsInput = {
    update: XOR<DemoUserUpdateWithoutMembershipsInput, DemoUserUncheckedUpdateWithoutMembershipsInput>
    create: XOR<DemoUserCreateWithoutMembershipsInput, DemoUserUncheckedCreateWithoutMembershipsInput>
    where?: DemoUserWhereInput
  }

  export type DemoUserUpdateToOneWithWhereWithoutMembershipsInput = {
    where?: DemoUserWhereInput
    data: XOR<DemoUserUpdateWithoutMembershipsInput, DemoUserUncheckedUpdateWithoutMembershipsInput>
  }

  export type DemoUserUpdateWithoutMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: DemoMessageUpdateManyWithoutUserNestedInput
    createdChannels?: DemoChannelUpdateManyWithoutCreatorNestedInput
  }

  export type DemoUserUncheckedUpdateWithoutMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: DemoMessageUncheckedUpdateManyWithoutUserNestedInput
    createdChannels?: DemoChannelUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type DemoChannelUpsertWithoutMembersInput = {
    update: XOR<DemoChannelUpdateWithoutMembersInput, DemoChannelUncheckedUpdateWithoutMembersInput>
    create: XOR<DemoChannelCreateWithoutMembersInput, DemoChannelUncheckedCreateWithoutMembersInput>
    where?: DemoChannelWhereInput
  }

  export type DemoChannelUpdateToOneWithWhereWithoutMembersInput = {
    where?: DemoChannelWhereInput
    data: XOR<DemoChannelUpdateWithoutMembersInput, DemoChannelUncheckedUpdateWithoutMembersInput>
  }

  export type DemoChannelUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isTokenGated?: BoolFieldUpdateOperationsInput | boolean
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: DemoUserUpdateOneRequiredWithoutCreatedChannelsNestedInput
    messages?: DemoMessageUpdateManyWithoutChannelNestedInput
  }

  export type DemoChannelUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    isTokenGated?: BoolFieldUpdateOperationsInput | boolean
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: DemoMessageUncheckedUpdateManyWithoutChannelNestedInput
  }

  export type DemoUserCreateWithoutMessagesInput = {
    id?: string
    walletAddress: string
    name?: string | null
    createdAt?: Date | string
    memberships?: DemoMembershipCreateNestedManyWithoutUserInput
    createdChannels?: DemoChannelCreateNestedManyWithoutCreatorInput
  }

  export type DemoUserUncheckedCreateWithoutMessagesInput = {
    id?: string
    walletAddress: string
    name?: string | null
    createdAt?: Date | string
    memberships?: DemoMembershipUncheckedCreateNestedManyWithoutUserInput
    createdChannels?: DemoChannelUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type DemoUserCreateOrConnectWithoutMessagesInput = {
    where: DemoUserWhereUniqueInput
    create: XOR<DemoUserCreateWithoutMessagesInput, DemoUserUncheckedCreateWithoutMessagesInput>
  }

  export type DemoChannelCreateWithoutMessagesInput = {
    id?: string
    name: string
    isTokenGated?: boolean
    tokenAddress?: string | null
    createdAt?: Date | string
    creator: DemoUserCreateNestedOneWithoutCreatedChannelsInput
    members?: DemoMembershipCreateNestedManyWithoutChannelInput
  }

  export type DemoChannelUncheckedCreateWithoutMessagesInput = {
    id?: string
    name: string
    creatorId: string
    isTokenGated?: boolean
    tokenAddress?: string | null
    createdAt?: Date | string
    members?: DemoMembershipUncheckedCreateNestedManyWithoutChannelInput
  }

  export type DemoChannelCreateOrConnectWithoutMessagesInput = {
    where: DemoChannelWhereUniqueInput
    create: XOR<DemoChannelCreateWithoutMessagesInput, DemoChannelUncheckedCreateWithoutMessagesInput>
  }

  export type DemoUserUpsertWithoutMessagesInput = {
    update: XOR<DemoUserUpdateWithoutMessagesInput, DemoUserUncheckedUpdateWithoutMessagesInput>
    create: XOR<DemoUserCreateWithoutMessagesInput, DemoUserUncheckedCreateWithoutMessagesInput>
    where?: DemoUserWhereInput
  }

  export type DemoUserUpdateToOneWithWhereWithoutMessagesInput = {
    where?: DemoUserWhereInput
    data: XOR<DemoUserUpdateWithoutMessagesInput, DemoUserUncheckedUpdateWithoutMessagesInput>
  }

  export type DemoUserUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: DemoMembershipUpdateManyWithoutUserNestedInput
    createdChannels?: DemoChannelUpdateManyWithoutCreatorNestedInput
  }

  export type DemoUserUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: DemoMembershipUncheckedUpdateManyWithoutUserNestedInput
    createdChannels?: DemoChannelUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type DemoChannelUpsertWithoutMessagesInput = {
    update: XOR<DemoChannelUpdateWithoutMessagesInput, DemoChannelUncheckedUpdateWithoutMessagesInput>
    create: XOR<DemoChannelCreateWithoutMessagesInput, DemoChannelUncheckedCreateWithoutMessagesInput>
    where?: DemoChannelWhereInput
  }

  export type DemoChannelUpdateToOneWithWhereWithoutMessagesInput = {
    where?: DemoChannelWhereInput
    data: XOR<DemoChannelUpdateWithoutMessagesInput, DemoChannelUncheckedUpdateWithoutMessagesInput>
  }

  export type DemoChannelUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isTokenGated?: BoolFieldUpdateOperationsInput | boolean
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: DemoUserUpdateOneRequiredWithoutCreatedChannelsNestedInput
    members?: DemoMembershipUpdateManyWithoutChannelNestedInput
  }

  export type DemoChannelUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    isTokenGated?: BoolFieldUpdateOperationsInput | boolean
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: DemoMembershipUncheckedUpdateManyWithoutChannelNestedInput
  }

  export type DemoMembershipCreateManyUserInput = {
    id?: string
    channelId: string
    role?: string
    createdAt?: Date | string
  }

  export type DemoMessageCreateManyUserInput = {
    id?: string
    content: string
    channelId: string
    createdAt?: Date | string
  }

  export type DemoChannelCreateManyCreatorInput = {
    id?: string
    name: string
    isTokenGated?: boolean
    tokenAddress?: string | null
    createdAt?: Date | string
  }

  export type DemoMembershipUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    channel?: DemoChannelUpdateOneRequiredWithoutMembersNestedInput
  }

  export type DemoMembershipUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DemoMembershipUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DemoMessageUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    channel?: DemoChannelUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type DemoMessageUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DemoMessageUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DemoChannelUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isTokenGated?: BoolFieldUpdateOperationsInput | boolean
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: DemoMembershipUpdateManyWithoutChannelNestedInput
    messages?: DemoMessageUpdateManyWithoutChannelNestedInput
  }

  export type DemoChannelUncheckedUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isTokenGated?: BoolFieldUpdateOperationsInput | boolean
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: DemoMembershipUncheckedUpdateManyWithoutChannelNestedInput
    messages?: DemoMessageUncheckedUpdateManyWithoutChannelNestedInput
  }

  export type DemoChannelUncheckedUpdateManyWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isTokenGated?: BoolFieldUpdateOperationsInput | boolean
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DemoMembershipCreateManyChannelInput = {
    id?: string
    userId: string
    role?: string
    createdAt?: Date | string
  }

  export type DemoMessageCreateManyChannelInput = {
    id?: string
    content: string
    userId: string
    createdAt?: Date | string
  }

  export type DemoMembershipUpdateWithoutChannelInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: DemoUserUpdateOneRequiredWithoutMembershipsNestedInput
  }

  export type DemoMembershipUncheckedUpdateWithoutChannelInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DemoMembershipUncheckedUpdateManyWithoutChannelInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DemoMessageUpdateWithoutChannelInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: DemoUserUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type DemoMessageUncheckedUpdateWithoutChannelInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DemoMessageUncheckedUpdateManyWithoutChannelInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}