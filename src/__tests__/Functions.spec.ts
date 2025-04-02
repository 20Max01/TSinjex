/* istanbul ignore file */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITSinjex, ITSinjex_ } from 'src/interfaces/ITSinjex.js';

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
