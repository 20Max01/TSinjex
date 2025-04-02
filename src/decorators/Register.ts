import { InitDelegate } from 'src/types/InitDelegate.js';
import { TSinjex } from '../classes/TSinjex.js';
import { Identifier } from '../types/Identifier.js';

//#region Overloads

/**
 * A decorator to register a class in the **TSinjex** DI (Dependency Injection) container.
 * @template TargetType The type of the class to be registered.
 * @param identifier The identifier used to register the class in the DI container.
 * @see {@link Identifier} for more information on identifiers.
 * @param deprecated If true, the dependency is deprecated and a warning
 * is logged only once upon the first resolution of the dependency.
 * @returns The decorator function to be applied on the class.
 * @example
 * ```ts
 * \@Register('MyClassIdentifier')
 * class MyClass {
 *   // ...
 * }
 * ```
 * @example
 * ```ts
 * \@Register('MyClassIdentifier', true)
 * class MyClass {
 *   // ...
 * }
 * ```
 */
export function Register<
    TargetType extends new (...args: unknown[]) => InstanceType<TargetType>,
>(
    identifier: Identifier,
    deprecated?: boolean,
): (constructor: TargetType, ...args: unknown[]) => void;

/**
 * A decorator to register an instance of a class in the DI (Dependency Injection) container.
 * @template TargetType The type of the class whose instance is to be registered.
 * @param identifier The identifier used to register the instance in the DI container.
 * @see {@link Identifier} for more information on identifiers.
 * @param shouldRegister Set to 'instance' to register the instance in the DI container
 * with an empty constructor.
 * @param deprecated If true, the dependency is deprecated and a warning
 * is logged only once upon the first resolution of the dependency.
 * @returns The decorator function to be applied on the class.
 * @example
 * ```ts
 * \@RegisterInstance('MyClassInstanceIdentifier', 'instance')
 * class MyClass {
 *   // ...
 * }
 * ```
 * @example
 * ```ts
 * \@RegisterInstance('MyClassInstanceIdentifier', 'instance', true)
 * class MyClass {
 *   // ...
 * }
 * ```
 */
export function Register<
    TargetType extends new (..._args: unknown[]) => InstanceType<TargetType>,
>(
    identifier: Identifier,
    shouldRegister: 'instance',
    deprecated?: boolean,
): (constructor: TargetType, ...args: unknown[]) => void;

/**
 * A decorator to register an instance of a class in the DI (Dependency Injection) container.
 * @template TargetType The type of the class whose instance is to be registered.
 * @param identifier The identifier used to register the instance in the DI container.
 * @see {@link Identifier} for more information on identifiers.
 * @param init An optional initializer function which get the constructor of the class
 * as input and returns an instance of the class.
 * @param deprecated If true, the dependency is deprecated and a warning
 * is logged only once upon the first resolution of the dependency.
 * @see {@link InitDelegate} for more information on initializer functions.
 * @returns The decorator function to be applied on the class.
 * @example
 * ```ts
 * \@RegisterInstance('MyClassInstanceIdentifier', (constructor) => new constructor())
 * class MyClass {
 *   // ...
 * }
 * ```
 * @example
 * ```ts
 * \@RegisterInstance('MyClassInstanceIdentifier', (constructor) => new constructor(), true)
 * class MyClass {
 *   // ...
 * }
 * ```
 */
export function Register<
    TargetType extends new (..._args: unknown[]) => InstanceType<TargetType>,
>(
    identifier: Identifier,
    init?: InitDelegate<
        TargetType & { new (..._args: unknown[]): InstanceType<TargetType> },
        InstanceType<TargetType>
    >,
    deprecated?: boolean,
): (constructor: TargetType, ...args: unknown[]) => void;

//#endregion Overloads

// eslint-disable-next-line jsdoc/require-jsdoc
export function Register<
    TargetType extends new (...args: unknown[]) => InstanceType<TargetType>,
>(
    identifier: Identifier,
    arg1?:
        | undefined
        | boolean
        | InitDelegate<TargetType, InstanceType<TargetType>>
        | 'instance',
    arg2?: boolean,
): (constructor: TargetType, ...args: unknown[]) => void {
    const deprecated = typeof arg1 === 'boolean' ? arg1 : arg2;
    const init = typeof arg1 === 'function' ? arg1 : undefined;
    const shouldRegisterInstance = arg1 === 'instance';

    if (init == undefined && shouldRegisterInstance !== true) {
        return _register(identifier, deprecated);
    } else {
        return _registerInstance(identifier, init, deprecated);
    }
}

/**
 * A decorator to register a class in the **TSinjex** DI (Dependency Injection) container.
 * @template TargetType The type of the class to be registered.
 * @param identifier The identifier used to register the class in the DI container.
 * @see {@link Identifier} for more information on identifiers.
 * @param deprecated If true, the dependency is deprecated and a warning
 * is logged only once upon the first resolution of the dependency.
 * @returns The decorator function to be applied on the class.
 * @example
 * ```ts
 * \@Register('MyClassIdentifier')
 * class MyClass {
 *   // ...
 * }
 * ```
 */
function _register<
    TargetType extends new (...args: unknown[]) => InstanceType<TargetType>,
>(identifier: Identifier, deprecated?: boolean) {
    return function (constructor: TargetType, ...args: unknown[]): void {
        // Get the instance of the DI container
        const diContainer = TSinjex.getInstance();

        // Register the class in the DI container
        diContainer.register(identifier, constructor, deprecated);
    };
}

/**
 * A decorator to register an instance of a class in the DI (Dependency Injection) container.
 * @template TargetType The type of the class whose instance is to be registered.
 * @param identifier The identifier used to register the instance in the DI container.
 * @see {@link Identifier} for more information on identifiers.
 * @param init An optional initializer function which get the constructor of the class
 * as input and returns an instance of the class.
 * @param deprecated If true, the dependency is deprecated and a warning
 * is logged only once upon the first resolution of the dependency.
 * @see {@link InitDelegate} for more information on initializer functions.
 * @returns The decorator function to be applied on the class.
 * @example
 * ```ts
 * \@RegisterInstance('MyClassInstanceIdentifier', (constructor) => new constructor())
 * class MyClass {
 *   // ...
 * }
 * ```
 */
function _registerInstance<
    TargetType extends new (..._args: unknown[]) => InstanceType<TargetType>,
>(
    identifier: Identifier,
    init?: InitDelegate<
        TargetType & { new (..._args: unknown[]): InstanceType<TargetType> },
        InstanceType<TargetType>
    >,
    deprecated?: boolean,
) {
    return function (constructor: TargetType, ...args: unknown[]): void {
        // Get the instance of the DI container
        const diContainer = TSinjex.getInstance();
        let instance: InstanceType<TargetType>;

        // Create a proxy to instantiate the class when needed (Lazy Initialization)
        let lazyProxy: unknown = new Proxy(
            {},
            {
                get(target, prop, receiver) {
                    ({ instance, lazyProxy } = initializeInstance<TargetType>(
                        instance,
                        init,
                        constructor,
                        args,
                        lazyProxy,
                    ));

                    // Return the requested property of the instance
                    return instance[prop as keyof InstanceType<TargetType>];
                },
                set(target, prop, value, receiver) {
                    ({ instance, lazyProxy } = initializeInstance<TargetType>(
                        instance,
                        init,
                        constructor,
                        args,
                        lazyProxy,
                    ));

                    // Set the requested property of the instance
                    return (instance[prop as keyof InstanceType<TargetType>] =
                        value);
                },
            },
        );

        // Register the lazy proxy in the DI container
        diContainer.register(identifier, lazyProxy, deprecated);
    };
}

/**
 * Initializes the instance of the class.
 * @template TargetType The type of the class whose instance is to be initialized.
 * @param instance The instance of the class to be initialized.
 * @param init The optional initializer function to initialize the instance.
 * @param constructor The constructor of the class.
 * @param args The arguments to be passed to the constructor of the class.
 * @param lazyProxy The lazy proxy to instantiate the class when needed.
 * @returns The initialized instance and the lazy proxy.
 */
function initializeInstance<
    TargetType extends new (..._args: unknown[]) => InstanceType<TargetType>,
>(
    instance: InstanceType<TargetType>,
    init:
        | InitDelegate<
              TargetType &
                  (new (..._args: unknown[]) => InstanceType<TargetType>),
              InstanceType<TargetType>
          >
        | undefined,
    constructor: TargetType,
    args: unknown[],
    lazyProxy: unknown,
): { instance: InstanceType<TargetType>; lazyProxy: unknown } {
    if (instance == null) {
        if (init) {
            instance = init(constructor);
        } else {
            instance = new constructor(...args);
        }
    }
    lazyProxy = instance;

    return { instance, lazyProxy };
}
