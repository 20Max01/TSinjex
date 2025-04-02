import { Identifier } from 'src/types/Identifier.js';
import { ITSinjex } from './ITSinjex.js';

/**
 * General error class for {@link ITSinjex} interface.
 */
export class TSinjexError extends Error {
    /**
     * Creates a new instance of {@link TSinjexError}
     * @param message **The error message**
     */
    constructor(message: string) {
        super(message);
        this.name = 'TSinjex';
    }
}

/**
 * Error class for dependency resolution errors in {@link ITSinjex}.
 * @see {@link ITSinjex.resolve}
 */
export class DependencyResolutionError extends TSinjexError {
    /**
     * Creates a new instance of {@link DependencyResolutionError}
     * @param identifier **The identifier of the dependency**
     */
    constructor(identifier: Identifier) {
        super(`Dependency ${identifier.toString()} could not be resolved.`);
        this.name = 'TSinjexResolutionError';
    }
}

/**
 * Error class for Injector errors in {@link ITSinjex}.
 * @see {@link ITSinjex.inject}
 */
export class InjectorError extends TSinjexError {
    /**
     * Creates a new instance of {@link InjectorError}
     * @param identifier **The identifier of the dependency**
     * @param originalError **The original error that caused the injection error**
     */
    constructor(identifier: Identifier, originalError?: Error) {
        super(
            `Error injecting dependency ${identifier.toString()} with error: "${originalError}"`,
        );
        this.name = 'TSinjexInjectorError';
    }
}

/**
 * Error class for missing instantiation methods in {@link ITSinjex}.
 * @see {@link ITSinjex.inject}
 */
export class NoInstantiationMethodError extends TSinjexError {
    /**
     * Creates a new instance of {@link NoInstantiationMethodError}
     * @param identifier **The identifier of the dependency**
     */
    constructor(identifier: Identifier) {
        super(
            `No instantiation method found for dependency ${identifier.toString()}.`,
        );
        this.name = 'TSinjexNoInstantiationMethodError';
    }
}

/**
 * Error class for errors during the initialization of a dependency in {@link ITSinjex}.
 * @see {@link ITSinjex.inject}
 */
export class InitializationError extends TSinjexError {
    /**
     * Creates a new instance of {@link InitializationError}
     * @param identifier **The identifier of the dependency**
     * @param originalError **The original error that caused the initialization error**
     */
    constructor(identifier: Identifier, originalError?: Error) {
        super(
            `Error initializing dependency ${identifier.toString()} with error: "${originalError}"`,
        );
        this.name = 'TSinjexInitializationError';
    }
}
