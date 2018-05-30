# Changelog
All notable changes to this project will be documented in this file.

## [1.3.1-beta] - 2018-05-30
### Changed
- fixed issue with video iframes not applying the previous 16:9 height fix

## [1.3.0-beta] - 2018-05-30
### Added
- [CHANGELOG.md]() file

### Changed
- fixed video iframe heights to use the correct 16:9 ratio
- fixed reply avatars disappear when the replier's blog has been deactivated
- fixed reply avatars on big screens displaying the blog icon

### Removed
- various leftover comments and inactive code
- removed picture element that was used to load the fitting avatar-size of replies as it is bugged on tumblr's side. Using a simple img-element with css resizing now

## [1.2.0-beta] - 2018-05-20
### Added
- missing documentation to various typescript methods

### Changed
- fixed license to actually endorse the intended MIT license
