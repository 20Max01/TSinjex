/**
 * Static Dependency Injection Container Interface
 */
export interface ITSInjex_ {
    /**
     * Get the **singleton** Dependency Injection Container
     */
    getInstance(): ITSInjex;
}

/**
 * Dependency Injection Container Interface
 */
export interface ITSInjex {
    /**
     * Register a dependency.
     * @param identifier The identifier of the dependency.
     * @param dependency The dependency to register.
     * @param deprecated If true, the dependency is deprecated => a warning
     * is logged when the dependency is resolved.
     */
    register<T>(identifier: string, dependency: T, deprecated?: boolean): void;
    /**
     * Register a deprecated dependency.
     * @param identifier The identifier of the dependency.
     * @param dependency The dependency to register.
     * @param deprecated A warning is logged when the dependency is resolved.
     */
    register<T>(identifier: string, dependency: T, deprecated?: true): void;
    /**
     * Register a dependency.
     * @param identifier The identifier of the dependency.
     * @param dependency The dependency to register.
     * @param deprecated No warning is logged when the dependency is resolved.
     */
    register<T>(identifier: string, dependency: T, deprecated?: false): void;

    /**
     * Resolve a dependency
     * @param identifier The identifier of the dependency
     * @param necessary If true, throws an error if the dependency is not found
     * @returns The resolved dependency or undefined if the dependency is not found
     */
    resolve<T>(identifier: string, necessary?: boolean): T | undefined;
    /**
     * Resolve a necessary dependency.
     * @param identifier The identifier of the dependency.
     * @param necessary If true, throws an error if the dependency is not found.
     * @returns The resolved dependency.
     * @throws Error if the dependency is not found.
     */
    resolve<T>(identifier: string, necessary?: true): T;
    /**
     * Resolve a non necessary dependency
     * @param identifier The identifier of the dependency
     * @param necessary Not necessary, does not throw an error if the dependency is not found.
     * @returns The resolved dependency or undefined if the dependency is not found
     */
    resolve<T>(identifier: string, necessary?: false): T | undefined;
}
