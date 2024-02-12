# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.8.7](https://github.com/MapColonies/discrete-cleanup/compare/v1.8.6...v1.8.7) (2024-02-12)

### [1.8.6](https://github.com/MapColonies/discrete-cleanup/compare/v1.8.5...v1.8.6) (2024-02-11)


### Bug Fixes

* release version ([005a095](https://github.com/MapColonies/discrete-cleanup/commit/005a095f718c4e835ee825d10395d49f73bc8ab9))

### [1.8.4](https://github.com/MapColonies/discrete-cleanup/compare/v1.8.3...v1.8.4) (2023-11-05)

### [1.8.3](https://github.com/MapColonies/discrete-cleanup/compare/v1.8.2...v1.8.3) (2023-11-05)

### [1.8.2](https://github.com/MapColonies/discrete-cleanup/compare/v1.8.1...v1.8.2) (2023-05-08)

### [1.8.1](https://github.com/MapColonies/discrete-cleanup/compare/v1.8.0...v1.8.1) (2023-04-20)


### Bug Fixes

* chart ([#26](https://github.com/MapColonies/discrete-cleanup/issues/26)) ([c91b7de](https://github.com/MapColonies/discrete-cleanup/commit/c91b7defc2b4be366b49a7e1bd8e9c9c3c675423))

## [1.8.0](https://github.com/MapColonies/discrete-cleanup/compare/v1.7.1...v1.8.0) (2023-01-29)


### Features

* add support for update ingestion job (MAPCO-2800) ([#24](https://github.com/MapColonies/discrete-cleanup/issues/24)) ([40ba666](https://github.com/MapColonies/discrete-cleanup/commit/40ba6666a21a76f47bde51fcfd6a98fa0564a771))


### Bug Fixes

* update cleanup failed logic ([#25](https://github.com/MapColonies/discrete-cleanup/issues/25)) ([07f48a4](https://github.com/MapColonies/discrete-cleanup/commit/07f48a4cb9095bc7f36d100952f873966185144e)), closes [#2](https://github.com/MapColonies/discrete-cleanup/issues/2)

### [1.7.1](https://github.com/MapColonies/discrete-cleanup/compare/v1.7.0...v1.7.1) (2022-10-19)


### Bug Fixes

* job type key ([#21](https://github.com/MapColonies/discrete-cleanup/issues/21)) ([1da2359](https://github.com/MapColonies/discrete-cleanup/commit/1da235937292d526bbf46f67ea6b05889f3c2f54))
* sslEnabled env format ([#22](https://github.com/MapColonies/discrete-cleanup/issues/22)) ([8cc875e](https://github.com/MapColonies/discrete-cleanup/commit/8cc875e2e6796f97f43c555b5ea24ae3f3ca96d8))

## [1.7.0](https://github.com/MapColonies/discrete-cleanup/compare/v1.6.3...v1.7.0) (2022-09-22)


### Features

* added displayPath support ([#20](https://github.com/MapColonies/discrete-cleanup/issues/20)) ([6c7cf20](https://github.com/MapColonies/discrete-cleanup/commit/6c7cf201806d55fcaed21a425febb492a92e853c))

### [1.6.3](https://github.com/MapColonies/discrete-cleanup/compare/v1.6.2...v1.6.3) (2022-09-08)


### Bug Fixes

* added node affinity use condition ([#18](https://github.com/MapColonies/discrete-cleanup/issues/18)) ([c989f91](https://github.com/MapColonies/discrete-cleanup/commit/c989f9122a044101b37ce43356c607fb8a82b620))

### [1.6.2](https://github.com/MapColonies/discrete-cleanup/compare/v1.6.1...v1.6.2) (2022-07-24)


### Bug Fixes

* azure updated token ([41bb0cd](https://github.com/MapColonies/discrete-cleanup/commit/41bb0cd31318ffb86e1cba51d2725d7124800edc))
* new azure token value ([#19](https://github.com/MapColonies/discrete-cleanup/issues/19)) ([e3ca2b2](https://github.com/MapColonies/discrete-cleanup/commit/e3ca2b2026dcd00e66bbc95f5339803bb51a5bf7))

### [1.6.1](https://github.com/MapColonies/discrete-cleanup/compare/v1.6.0...v1.6.1) (2022-07-24)


### Bug Fixes

* update mc-models version ([#17](https://github.com/MapColonies/discrete-cleanup/issues/17)) ([b1bfc76](https://github.com/MapColonies/discrete-cleanup/commit/b1bfc762d3ccdfdfdbed686e8317bb2bc12b9dc0))

## [1.6.0](https://github.com/MapColonies/discrete-cleanup/compare/v1.5.0...v1.6.0) (2022-04-07)


### Features

* update model types ([#11](https://github.com/MapColonies/discrete-cleanup/issues/11)) ([a3b7fe0](https://github.com/MapColonies/discrete-cleanup/commit/a3b7fe010e8effcd5a23f64c78cad5088f4776a4)), closes [#12](https://github.com/MapColonies/discrete-cleanup/issues/12)

## [1.5.0](https://github.com/MapColonies/discrete-cleanup/compare/v1.4.0...v1.5.0) (2022-03-06)


### Features

* removing file list from cleaned jobs ([#9](https://github.com/MapColonies/discrete-cleanup/issues/9)) ([76ba02b](https://github.com/MapColonies/discrete-cleanup/commit/76ba02b6ebe799b6828fae2ae87e4825e88babc2))


### Bug Fixes

* azure compatability ([#8](https://github.com/MapColonies/discrete-cleanup/issues/8)) ([826ee85](https://github.com/MapColonies/discrete-cleanup/commit/826ee85a55ec2baa3f4854455b5f5e6470989881))

## [1.4.0](https://github.com/MapColonies/discrete-cleanup/compare/v1.3.2...v1.4.0) (2022-02-20)


### Features

* added config to disable cleanup with pvc ([#7](https://github.com/MapColonies/discrete-cleanup/issues/7)) ([d62c327](https://github.com/MapColonies/discrete-cleanup/commit/d62c3276b28469093fa17428df518dda6de7fc0a))

### [1.3.2](https://github.com/MapColonies/discrete-cleanup/compare/v1.3.1...v1.3.2) (2022-01-04)


### Bug Fixes

* added pull secret to helm ([#4](https://github.com/MapColonies/discrete-cleanup/issues/4)) ([c264cb6](https://github.com/MapColonies/discrete-cleanup/commit/c264cb6a21cac793bae91138bee3920c7ebc1276))
* fix config and injection ([#5](https://github.com/MapColonies/discrete-cleanup/issues/5)) ([e3c63b2](https://github.com/MapColonies/discrete-cleanup/commit/e3c63b2133a7049635b81146fed5e5b94e559423))

### [1.3.1](https://github.com/MapColonies/discrete-cleanup/compare/v1.3.0...v1.3.1) (2021-12-01)

## 1.3.0 (2021-11-21)


### Features

* converted discrete cleanup to typescript ([#1](https://github.com/MapColonies/discrete-cleanup/issues/1)) ([9ab2ac8](https://github.com/MapColonies/discrete-cleanup/commit/9ab2ac8e73c88b6c5d61ae31963f651f68dfc50c))
