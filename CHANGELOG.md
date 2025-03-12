# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- refactor: consolidate registration decorators
  Introduced Register decorator to handle class and instance registration in the DI container.
  Deprecated RegisterInstance in favor of Register, which now internally handles instance registration.
  Added support for marking dependencies as deprecated with a warning logged upon first resolution.
  Updated documentation with examples and notes on deprecation.
- tests: add mode parameter to RegisterInstanceDecorator
  Introduced a mode parameter to the test_RegisterInstanceDecorator function allowing 'instance' or 'standalone' modes.
  Updated test cases to utilize the new mode parameter when registering an instance.
  Disabled specific ESLint rule in Decorators.test.ts for deprecation warnings.
  Added an additional test call to test_RegisterInstanceDecorator with 'instance' mode.
- refactor: add region tags for overloads in Register.ts


### Deprecated


### Removed


### Fixed


### Security


## [0.2.0]

### Added

- Add pre release building to release workflow on dev/* branches an version changes.
- feat: Introduced a new CLI command `tsinjex-generate` to automate the generation of import statements for registered dependencies.  
  The command scans `.ts` files for `@Register` and `@RegisterInstance` decorators and generates an `auto-imports.ts` file.  
  This ensures that all registered dependencies are automatically included without requiring manual imports.  
  The CLI can be executed via `npx tsinjex-generate` or added as a script in `package.json` for easier integration.


### Deprecated


### Removed


### Fixed


### Security

## [0.0.14]

### Added

- Added **ChangeLog** file and format it according to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- Added reference to **Semantic Versioning** in the changelog file. (History will be updated on time).
- Version format is now `v0.0.0` instead of `0.0.0`. Changes to this are also reflected in the workflos.
- Add `Identifiers` and `Jest` Sections to the `README.md` file.
- feat: Add new Error `InitializationError` to reflect errors during initialization of a dependency.
- feat: Add initialization error handling and refactor Inject.
- feat: After injecting a dependency, the lazzy loading getter will be replaced with the dependency itself.
- feat: remove the use of a private property to store the injected dependencies. Now the dependencies are stored in the property itself.
- test: Add tests for the new features.


### Deprecated

- Deprecated the old version format `0.0.0`.

### Removed


### Fixed


### Security


---

[unreleased]: https://github.com/PxaMMaxP/TSinjex/compare/0.0.14...HEAD
[0.0.14]: https://github.com/PxaMMaxP/TSinjex/compare/0.0.13...v0.0.14
[0.2.00]: https://github.com/PxaMMaxP/TSinjex/compare/0.0.14...v0.2.0