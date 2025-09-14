# Changelog

## [Unreleased]

### Fixed

- **Build Warnings**: Suppressed "use client" directive warnings in Storybook builds
  - Updated `.storybook/main.ts` to filter out module-level directive warnings
  - Updated `.storybook/vite.config.ts` to handle bundling warnings properly
  - Disabled sourcemaps in Storybook production builds to reduce noise
- **GitHub Pages Deployment**: Improved deployment configuration
  - Added `.nojekyll` file creation step in deploy workflow
  - Enhanced GitHub Actions workflow for better Pages compatibility
- **Path Aliases**: Fixed hardcoded path in Storybook configuration
  - Replaced absolute path with proper `resolve(__dirname, '../src')` pattern
  - Ensures consistent builds across different environments

### Changed

- **Build Process**: Cleaner build output with reduced warning noise
- **CI/CD**: Enhanced deployment workflow reliability

### Technical Notes

- The "use client" directives are necessary for Next.js App Router components
- Vite/Rollup warnings about these directives are expected when bundling for client-only environments like Storybook
- All functionality remains intact while providing cleaner build logs
