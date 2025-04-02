import { DependencyResolutionError } from './Exceptions.js';
import { Identifier } from '../types/Identifier.js';

/**
 * Static TSInjex Interface
 */
export interface ITSinjex_ extends ITSinjexRegister, ITSinjexResolve {
    /**
     * Get the **singleton** TSInjex instance.
     * @returns The singleton instance.
     */
    getInstance(): ITSinjex;
}

/**
 * `Register` method for static and instance Dependency Injection Container.
 */
export interface ITSinjexRegister {
    /**
     * Register a dependency.
     * @param identifier The identifier of the dependency.
     * @param dependency The dependency to register.
     * @param deprecated If true, the dependency is deprecated => a warning
     * is logged when the dependency is resolved.
     */
    register<T>(
        identifier: Identifier,
        dependency: T,
        deprecated?: boolean,
    ): void;
    /**
     * Register a deprecated dependency.
     * @param identifier The identifier of the dependency.
     * @param dependency The dependency to register.
     * @param deprecated A warning is logged when the dependency is resolved.
     */
    register<T>(identifier: Identifier, dependency: T, deprecated?: true): void;
    /**
     * Register a dependency.
     * @param identifier The identifier of the dependency.
     * @param dependency The dependency to register.
     * @param deprecated No warning is logged when the dependency is resolved.
     */
    register<T>(
        identifier: Identifier,
        dependency: T,
        deprecated?: false,
    ): void;
}

/**
 * `Resolve` method for static and instance Dependency Injection Container.
 */
export interface ITSinjexResolve {
    /**
     * Resolve a dependency
     * @param identifier The identifier of the dependency
     * @param necessary If true, throws an error if the dependency is not found
     * @returns The resolved dependency or undefined if the dependency is not found
     * @throws A {@link DependencyResolutionError} if the dependency is not found and necessary.
     */
    resolve<T>(identifier: Identifier, necessary?: boolean): T | undefined;
    /**
     * Resolve a necessary dependency.
     * @param identifier The identifier of the dependency.
     * @param necessary If true, throws an error if the dependency is not found.
     * @returns The resolved dependency.
     * @throws A {@link DependencyResolutionError} if the dependency is not found.
     */
    resolve<T>(identifier: Identifier, necessary?: true): T;
    /**
     * Resolve a non necessary dependency
     * @param identifier The identifier of the dependency
     * @param necessary Not necessary, does not throw an error if the dependency is not found.
     * @returns The resolved dependency or undefined if the dependency is not found
     */
    resolve<T>(identifier: Identifier, necessary?: false): T | undefined;
}

/**
 * Instance TSinjex Interface
 */
export interface ITSinjex extends ITSinjexRegister, ITSinjexResolve {}
