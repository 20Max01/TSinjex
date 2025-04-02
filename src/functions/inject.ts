import { TSinjex } from '../classes/TSinjex.js';
import {
    DependencyResolutionError,
    InitializationError,
    InjectorError,
    NoInstantiationMethodError,
} from '../interfaces/Exceptions.js';
import { Identifier } from '../types/Identifier.js';
import { InitDelegate } from '../types/InitDelegate.js';

/**
 * Resolves a dependency by its identifier without initialization or instantiation.
 * @template T The expected type of the dependency.
 * @param identifier The identifier used to resolve the dependency from the container.
 * @returns The resolved dependency.
 * @throws A {@link DependencyResolutionError} if the dependency is not found.
 * @example
 * ```ts
 * const logger = inject<Logger>('Logger');
 * ```
 */
export function inject<T>(identifier: Identifier): T;

/**
 * Resolves and instantiates a dependency using its constructor.
 * @template T The expected class type of the dependency.
 * @param identifier The identifier used to resolve the dependency from the container.
 * @param shouldInit Set to `true` to instantiate the dependency after resolution.
 * @returns The resolved and instantiated dependency.
 * @throws A {@link DependencyResolutionError} if the dependency is not found.
 * @throws A {@link NoInstantiationMethodError} if the dependency has no constructor.
 * @throws An {@link InitializationError} if instantiation fails.
 * @example
 * ```ts
 * const instance = inject<Service>('Service', true);
 * ```
 */
export function inject<T>(identifier: Identifier, shouldInit: true): T;

/**
 * Resolves and instantiates a dependency using its constructor, optionally failing silently.
 * @template T The expected class type of the dependency.
 * @param identifier The identifier used to resolve the dependency from the container.
 * @param shouldInit Set to `true` to instantiate the dependency.
 * @param isNecessary If `false`, resolution or instantiation errors return `undefined` instead of throwing.
 * @returns The resolved and instantiated dependency, or `undefined` if resolution or instantiation fails.
 * @example
 * ```ts
 * const instance = inject<Service>('OptionalService', true, false);
 * if (instance) instance.doSomething();
 * ```
 */
export function inject<T>(
    identifier: Identifier,
    shouldInit: true,
    isNecessary: false,
): T | undefined;

/**
 * Resolves a dependency without instantiating it, optionally failing silently.
 * @template T The expected type of the dependency.
 * @param identifier The identifier used to resolve the dependency from the container.
 * @param shouldInit Set to `false` to skip instantiation.
 * @param isNecessary If `false`, resolution errors return `undefined` instead of throwing.
 * @returns The resolved dependency, or `undefined` if not found.
 * @example
 * ```ts
 * const config = inject<Config>('Config', false, false) ?? getDefaultConfig();
 * ```
 */
export function inject<T>(
    identifier: Identifier,
    shouldInit: false,
    isNecessary: false,
): T | undefined;

/**
 * Resolves a dependency and applies a custom initializer function to transform the result.
 * @template T The original dependency type.
 * @template U The final return type after initialization.
 * @param identifier The identifier used to resolve the dependency.
 * @param init A function to transform or initialize the dependency.
 * @returns The transformed dependency.
 * @throws A {@link DependencyResolutionError} if the dependency is not found.
 * @throws An {@link InitializationError} if the initializer throws.
 * @example
 * ```ts
 * const client = inject<Api>('Api', (api) => api.getClient());
 * ```
 */
export function inject<T, U>(
    identifier: Identifier,
    init: InitDelegate<T, U>,
): U;

/**
 * Resolves a dependency and applies a custom initializer function, optionally failing silently.
 * @template T The original dependency type.
 * @template U The final return type after initialization.
 * @param identifier The identifier used to resolve the dependency.
 * @param init A function to transform or initialize the dependency.
 * @param isNecessary If `false`, resolution or initializer errors return `undefined` instead of throwing.
 * @returns The transformed dependency, or `undefined` if resolution or initialization fails.
 * @example
 * ```ts
 * const db = inject<Database, Pool>('Database', (d) => d.getPool(), false);
 * if (db) db.query('SELECT * FROM users');
 * ```
 */
export function inject<T, U>(
    identifier: Identifier,
    init: InitDelegate<T, U>,
    isNecessary: false,
): U | undefined;

/**
 * A function to inject a dependency from a DI (Dependency Injection) container into a variable.
 * This is the actual implementation that handles all overload variants.
 * @template T The original dependency type.
 * @template U The final return type after optional initialization or transformation.
 * @param identifier The identifier used to resolve the dependency.
 * @see {@link Identifier} for more information on identifiers.
 * @param init Optional: either `true` to instantiate via constructor, `false` to skip, or a function to transform the dependency.
 * @see {@link InitDelegate} for more information on initializer functions.
 * @param isNecessary If `true`, throws on failure; if `false`, returns `undefined` on resolution or initialization errors.
 * @returns The resolved dependency or result of initialization, or `undefined` if not necessary and resolution fails.
 * @throws A {@link DependencyResolutionError} if the dependency is not found (and necessary).
 * @throws A {@link NoInstantiationMethodError} if instantiation is requested but no constructor exists.
 * @throws An {@link InitializationError} if the initializer throws an error.
 * @throws A {@link InjectorError} for unknown errors during resolution or transformation.
 * @example
 * ```ts
 * const service = inject<Service>('Service');
 * ```
 * @example
 * ```ts
 * const instance = inject<Service>('Service', true);
 * ```
 * @example
 * ```ts
 * const logger = inject<ILogger>('ILogger_', (x) => x.getLogger('Module'), false);
 * ```
 */
export function inject<T, U>(
    identifier: Identifier,
    init?: InitDelegate<T, U> | true | false,
    isNecessary = true,
): T | U | undefined {
    let instance: T | U | undefined;

    const dependency: T | undefined = tryAndCatch(
        () => TSinjex.getInstance().resolve<T>(identifier, isNecessary),
        isNecessary,
        identifier,
        DependencyResolutionError,
    );

    if (dependency != null) {
        const initFunction: (() => U) | undefined =
            typeof init === 'function' && dependency != null
                ? (): U => init(dependency)
                : init === true && hasConstructor(dependency)
                  ? (): U => new dependency() as U
                  : undefined;

        if (init == null || init === false) instance = dependency;
        else if (initFunction != null)
            instance = tryAndCatch(
                initFunction,
                isNecessary,
                identifier,
                InitializationError,
            );
        else if (isNecessary) throw new NoInstantiationMethodError(identifier);
    } else if (isNecessary) throw new DependencyResolutionError(identifier);

    return instance as T | U;
}

/**
 * Tries to execute a function and catches any errors that occur.
 * If the function is necessary and an error occurs, it throws the error
 * with the specified error class and identifier.
 * @param fn The function to execute.
 * @param necessary If true, throws an error if an error occurs.
 * @param identifier The identifier of the dependency.
 * @param errorClass The error class to throw if an error occurs.
 * @returns The result of the function or undefined if an error occurs and the function is not necessary.
 */
function tryAndCatch<ReturnType, ErrorType>(
    fn: () => ReturnType,
    necessary: boolean,
    identifier?: Identifier,
    errorClass?: ErrorType,
): ReturnType | undefined {
    try {
        return fn();
    } catch (error) {
        if (necessary)
            throw new (errorClass != null ? errorClass : error)(
                identifier ?? 'not specified',
                error,
            );
        else return undefined;
    }
}

/**
 * Checks if an object has a constructor.
 * @param obj The object to check.
 * @returns True if the object has a constructor, false otherwise.
 */
function hasConstructor<T>(obj: T): obj is T & { new (): unknown } {
    const _obj = obj as unknown as { prototype?: { constructor?: unknown } };

    return (
        _obj?.prototype != null &&
        typeof _obj.prototype.constructor === 'function'
    );
}
