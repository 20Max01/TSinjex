/* istanbul ignore file */
import { ITSinjex_, ITSinjex } from '../interfaces/ITSinjex.js';

/**
 * Test the implementation of the `ITSinjex` interface.
 * @param Container The implementation to test.
 * Must implement {@link ITSinjex}, {@link ITSinjex_}
 */
export function test_ITSinjex(Container: ITSinjex_): void {
    describe('IDIContainer Implementation Tests', () => {
        let container: ITSinjex;

        beforeEach(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Container as any)['_instance'] = undefined;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Container as any)['_dependencies'] = undefined;
            container = Container.getInstance();
        });

        it('should register and resolve a dependency', () => {
            const identifier = 'myDependency';
            const dependency = { value: 42 };

            container.register(identifier, dependency);

            const resolvedDependency =
                container.resolve<typeof dependency>(identifier);
            expect(resolvedDependency).toBe(dependency);
        });

        it('should register and resolve a dependency static', () => {
            const identifier = 'myDependency';
            const dependency = { value: 42 };

            Container.register(identifier, dependency);

            const resolvedDependency =
                Container.resolve<typeof dependency>(identifier);
            expect(resolvedDependency).toBe(dependency);
        });

        it('should throw an error when resolving a non-registered dependency static', () => {
            const identifier = 'nonExistentDependency';

            expect(() => Container.resolve<unknown>(identifier)).toThrow();
        });

        it('should return undefined when resolving a non-registered, non-necessary dependency', () => {
            const resolvedDependency = Container.resolve<unknown>(
                'nonExistentDependency',
                false,
            );
            expect(resolvedDependency).toBe(undefined);
        });

        it('should warn when resolving a deprecated dependency', () => {
            const identifier = 'deprecatedDependency';
            const dependency = { value: 42 };

            // Spy on console.warn
            const warnSpy = jest
                .spyOn(console, 'warn')
                .mockImplementation(() => {});

            Container.register(identifier, dependency, true);

            const resolvedDependency =
                Container.resolve<typeof dependency>(identifier);
            expect(resolvedDependency).toBe(dependency);

            // Expect console.warn to be called
            expect(warnSpy).toHaveBeenCalled();

            // Restore the original console.warn
            warnSpy.mockRestore();
        });
    });
}
