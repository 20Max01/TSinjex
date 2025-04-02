import { TSinjex } from '../classes/TSinjex.js';
import { Identifier } from '../types/Identifier.js';

/**
 * Register a dependency.
 * @param identifier The identifier used to register the class in the DI container.
 * @see {@link Identifier} for more information on identifiers..
 * @param dependency The dependency to register.
 */
export function register<T>(identifier: Identifier, dependency: T): void;

/**
 * Register a dependency.
 * @param identifier The identifier used to register the class in the DI container.
 * @see {@link Identifier} for more information on identifiers.
 * @param dependency The dependency to register.
 * @param deprecated A warning is logged when the dependency is resolved.
 */
export function register<T>(
    identifier: Identifier,
    dependency: T,
    deprecated?: true,
): void;

/**
 * Register a dependency.
 * @param identifier The identifier used to register the class in the DI container.
 * @see {@link Identifier} for more information on identifiers.
 * @param dependency The dependency to register.
 * @param deprecated If true, the dependency is deprecated => a warning
 * is logged when the dependency is resolved.
 */
export function register<T>(
    identifier: Identifier,
    dependency: T,
    deprecated?: boolean,
): void {
    TSinjex.getInstance().register(identifier, dependency, deprecated);
}
