/* istanbul ignore file */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    DependencyResolutionError,
    InitializationError,
    NoInstantiationMethodError,
} from '../interfaces/Exceptions.js';
import { ITSinjex, ITSinjex_ } from '../interfaces/ITSinjex.js';

export function test_RegisterFunction(
    Container: ITSinjex_,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    register: Function,
): void {
    describe('Register Function Tests', () => {
        let container: ITSinjex;

        beforeEach(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Container as any)['_instance'] = undefined;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Container as any)['_dependencies'] = undefined;
            container = Container.getInstance();
        });

        it('should register a dependency', () => {
            const identifier = 'MockDependencyIdentifier';
            class TestClass {
                private readonly _dependency!: any;

                public getDependency() {
                    return this._dependency;
                }
            }

            register(identifier, TestClass, false);

            const resolvedDependency = container.resolve(identifier);
            expect(resolvedDependency).toBe(TestClass);
        });
    });
}

export function test_ResolveFunction(
    Container: ITSinjex_,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    resolve: Function,
): void {
    describe('Resolve Function Tests', () => {
        let container: ITSinjex;

        beforeEach(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Container as any)['_instance'] = undefined;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Container as any)['_dependencies'] = undefined;
            container = Container.getInstance();
        });

        it('should resolve a dependency', () => {
            const identifier = 'MockDependencyIdentifier';
            class TestClass {
                private readonly _dependency!: any;

                public getDependency() {
                    return this._dependency;
                }
            }

            container.register(identifier, TestClass);

            const resolvedDependency = resolve(identifier);
            expect(resolvedDependency).toBe(TestClass);
        });
    });
}

/**
 * Test the inject function.
 * @param Container The DI container implementation to test against.
 * @param inject The inject function to test.
 */
export function test_injectFunction(
    Container: ITSinjex_,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    inject: Function,
): void {
    describe('inject Function Tests', () => {
        let container: ITSinjex;

        beforeEach(() => {
            // Reset singleton
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Container as any)['_instance'] = undefined;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Container as any)['_dependencies'] = undefined;
            container = Container.getInstance();
        });

        it('should resolve and return the dependency as is', () => {
            container.register('SimpleDep', { value: 'test' });

            const resolved = inject('SimpleDep');
            expect(resolved.value).toBe('test');
        });

        it('should resolve and run the initializer function', () => {
            container.register('DepWithInit', { value: 'before' });

            const resolved = inject('DepWithInit', (dep: any) => {
                dep.value = 'after';

                return dep;
            });

            expect(resolved.value).toBe('after');
        });

        it('should resolve and instantiate the dependency if init is true and constructor exists', () => {
            class WithConstructor {
                value = 'constructed';
            }

            container.register('Constructable', WithConstructor);

            const resolved = inject('Constructable', true);
            expect(resolved.value).toBe('constructed');
        });

        it('should return undefined if dependency is not found and not necessary', () => {
            const resolved = inject('NonExistentDep', undefined, false);
            expect(resolved).toBeUndefined();
        });

        it('should throw DependencyResolutionError if dependency is not found and necessary', () => {
            expect(() => inject('MissingDep')).toThrow(
                DependencyResolutionError,
            );
        });

        it('should throw InitializationError if init function throws', () => {
            container.register('InitThrows', {});

            expect(() =>
                inject('InitThrows', () => {
                    throw new Error('fail');
                }),
            ).toThrow(InitializationError);
        });

        it('should throw NoInstantiationMethodError if init = true and no constructor exists', () => {
            container.register('NonConstructable', {});

            expect(() => inject('NonConstructable', true)).toThrow(
                NoInstantiationMethodError,
            );
        });

        it('should not throw if no constructor and necessary = false', () => {
            container.register('SafeSkip', {});
            expect(() => inject('SafeSkip', true, false)).not.toThrow();
        });

        it('should return undefined if initializer fails and not necessary', () => {
            container.register('InitErrorOptional', {});

            const result = inject(
                'InitErrorOptional',
                () => {
                    throw new Error('ignored');
                },
                false,
            );

            expect(result).toBeUndefined();
        });

        it('should return undefined if dependency is null and not necessary', () => {
            container.register('NullDep', null);
            const result = inject('NullDep', true, false);
            expect(result).toBeUndefined();
        });
    });
}
