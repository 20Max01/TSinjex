import { TSinjex } from '../classes/TSinjex.js';
import { DependencyResolutionError } from '../interfaces/Exceptions.js';
import { Identifier } from '../types/Identifier.js';

/**
 * Resolve a dependency.
 * @param identifier The identifier used to register the class in the DI container.
 * @see {@link Identifier} for more information on identifiers.
 * @returns The resolved dependency.
 * @throws A {@link DependencyResolutionError} if the dependency is not found.
 */
export function resolve<T>(identifier: Identifier): T;

/**
 * Resolve a dependency
 * @param identifier The identifier used to register the class in the DI container.
 * @see {@link Identifier} for more information on identifiers.
 * @param necessary The dependency is **not** necessary.
 * @returns The resolved dependency or undefined if the dependency is not found.
 */
export function resolve<T>(
    identifier: Identifier,
    necessary: false,
): T | undefined;

/**
 * Resolve a dependency.
 * @param identifier The identifier used to register the class in the DI container.
 * @see {@link Identifier} for more information on identifiers.
 * @param necessary If true, throws an error if the dependency is not found.
 * @returns The resolved dependency or undefined if the dependency is not necessary
 * and not found, or throws an error if the dependency is necessary and not found.
 * @throws A {@link DependencyResolutionError} if the dependency is not found and necessary.
 */
export function resolve<T>(
    identifier: Identifier,
    necessary?: boolean,
): T | undefined {
    return TSinjex.getInstance().resolve<T>(identifier, necessary);
}
