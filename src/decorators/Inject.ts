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
 * A decorator to inject a dependency from a DI (Dependency Injection) container into a class property.
 * @template T The type of the dependency to be injected.
 * @template U The type of the property to be injected.
 * @param identifier The identifier used to resolve the class in the DI container.
 * @see {@link Identifier} for more information on identifiers.
 * @param init Optional an initializer function to transform the dependency before injection
 * or true to instantiate the dependency if it has a constructor.
 * @see {@link InitDelegate} for more information on initializer functions.
 * @param isNecessary If true, throws an error if the dependency is not found.
 * @returns The resolved dependency or undefined if the dependency is not necessary
 * and not found, or throws an error if the dependency is necessary and not found.
 * @throws **Only throws errors if the dependency is necessary.**
 * @throws A {@link DependencyResolutionError} if the dependency is not found.
 * @throws A {@link InjectorError} if an error occurs during the injection process.
 * @throws A {@link NoInstantiationMethodError} if the dependency does not have a constructor.
 * @throws An {@link InitializationError} if an error occurs during the initialization process.
 * @example
 * ```ts
 * class MyClass {
 *   \@Inject<MyDependency>('MyDependencyIdentifier')
 *   private myDependency!: MyDependency;
 * }
 * ```
 * @example
 * ```ts
 * class MyClass {
 *   \@Inject('ILogger_', (x: ILogger_) => x.getLogger('Tags'), false)
 *   private _logger?: ILogger;
 * }
 * ```
 */
export function Inject<T, U>(
    identifier: Identifier,
    init?: InitDelegate<T, U> | true,
    isNecessary = true,
) {
    return function (target: unknown, propertyKey: string | symbol): void {
        /**
         * Function to evaluate the dependency lazily
         * to avoid circular dependencies, not found dependencies, etc.
         * @returns The resolved dependency or undefined if the dependency is not found.
         */
        const resolve = (): T | undefined => {
            return TSinjex.getInstance().resolve<T>(identifier, isNecessary);
        };

        Object.defineProperty(target, propertyKey, {
            get() {
                let instance: T | U | undefined;

                const dependency: T | undefined = tryAndCatch(
                    () => resolve(),
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

                    if (init == null) instance = dependency;
                    else if (initFunction != null)
                        instance = tryAndCatch(
                            initFunction,
                            isNecessary,
                            identifier,
                            InitializationError,
                        );
                    else if (isNecessary)
                        throw new NoInstantiationMethodError(identifier);
                } else if (isNecessary)
                    throw new DependencyResolutionError(identifier);

                /**
                 * Replace itself with the resolved dependency
                 * for performance reasons.
                 */
                Object.defineProperty(this, propertyKey, {
                    value: instance,
                    writable: false,
                    enumerable: false,
                    configurable: false,
                });

                return instance;
            },
            /**
             * Make the property configurable to allow replacing it
             */
            configurable: true,
        });
    };
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
