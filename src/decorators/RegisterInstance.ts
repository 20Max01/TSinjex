import { Register } from './Register.js';
import { Identifier } from '../types/Identifier.js';
import { InitDelegate } from '../types/InitDelegate.js';

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
 * @deprecated Use {@link Register} instead. This decorator already uses the {@link Register} decorator internally.
 */
export function RegisterInstance<
    TargetType extends new (..._args: unknown[]) => InstanceType<TargetType>,
>(
    identifier: Identifier,
    init?: InitDelegate<
        TargetType & { new (..._args: unknown[]): InstanceType<TargetType> },
        InstanceType<TargetType>
    >,
    deprecated?: boolean,
): (constructor: TargetType, ...args: unknown[]) => void {
    const initDelegate = typeof init === 'function' ? init : undefined;

    if (initDelegate) return Register(identifier, initDelegate, deprecated);
    else return Register(identifier, 'instance', deprecated);
}
