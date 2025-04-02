import type { Inject } from '../decorators/Inject.js';
import type { Register } from '../decorators/Register.js';
import type { RegisterInstance } from '../decorators/RegisterInstance.js';
import type { register } from '../functions/register.js';
import type { resolve } from '../functions/resolve.js';
import { ImplementsStatic } from '../helper/ImplementsStatic.js';
import { DependencyResolutionError } from '../interfaces/Exceptions.js';
import { IDependency } from '../interfaces/IDependency.js';
import { ITSinjex, ITSinjex_ } from '../interfaces/ITSinjex.js';
import { Identifier } from '../types/Identifier.js';

/**
 * # TSinjex
 * The main class for the Dependency Injection Container **TSinjex**.
 * ### Decorators
 * @see {@link Register} for registering a class in the DI container.
 * @see {@link RegisterInstance} for registering an instance in the DI container.
 * @see {@link Inject} for injecting a dependency into a property.
 * ---
 * ### Functions
 * @see {@link register} for registering a dependency (class or instance) as a function.
 * @see {@link resolve} for resolving a dependency as a function.
 */
@ImplementsStatic<ITSinjex_>()
export class TSinjex implements ITSinjex {
    /**
     * The singleton instance of the TSinjex class.
     */
    private static _instance: TSinjex;

    /**
     * The dependencies map.
     */
    private readonly _dependencies = new Map<Identifier, IDependency>();

    /**
     * Private constructor to prevent direct instantiation.
     */
    private constructor() {}

    //#region ITSinjex_ (Static)

    /**
     * Get the **singleton** TSInjex instance.
     * @returns The singleton instance.
     */
    public static getInstance(): ITSinjex {
        if (this._instance == null) {
            this._instance = new TSinjex();
        }

        return this._instance;
    }

    /**
     * Static implementation of {@link ITSinjex.register}.
     * @see {@link ITSinjex.register}
     * @inheritdoc
     */
    public static register<T>(
        identifier: Identifier,
        dependency: T,
        deprecated = false,
    ): void {
        (TSinjex.getInstance() as TSinjex)._dependencies.set(identifier, {
            dependency: dependency,
            deprecated: deprecated,
        });
    }

    /**
     * Static implementation of {@link ITSinjex.resolve}.
     * @see {@link ITSinjex.resolve}
     * @inheritdoc
     */
    public static resolve<T>(
        identifier: Identifier,
        necessary = true,
    ): T | undefined {
        return (TSinjex.getInstance() as TSinjex).resolve<T>(
            identifier,
            necessary,
        );
    }

    //#endregion

    //#region ITSinjex (Instance)

    /**
     * @inheritdoc
     */
    public register<T>(
        identifier: Identifier,
        dependency: T,
        deprecated = false,
    ): void {
        this._dependencies.set(identifier, {
            dependency: dependency,
            deprecated: deprecated,
        });
    }

    /**
     * @inheritdoc
     */
    public resolve<T>(identifier: Identifier, necessary = true): T | undefined {
        const dependency = this._dependencies.get(identifier);

        if (necessary && !dependency) {
            throw new DependencyResolutionError(identifier);
        } else if (!dependency) {
            return undefined;
        }

        if (dependency.deprecated) {
            console.warn(`Dependency ${identifier.toString()} is deprecated`);

            // Remove the deprecation warning; it should only be logged once.
            dependency.deprecated = false;
        }

        return dependency.dependency as T;
    }

    //#endregion
}
