# GitHub Pages Setup Guide

This project is configured to automatically deploy Storybook to GitHub Pages when code is pushed to the `main` branch.

## Prerequisites

To enable GitHub Pages deployment, you need to configure your repository settings:

## 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Save the settings

## 2. Verify Workflow Permissions

1. In your repository, go to **Settings** > **Actions** > **General**
2. Under **Workflow permissions**, ensure either:
   - **Read and write permissions** is selected, OR
   - **Read repository contents and packages permissions** is selected with **Allow GitHub Actions to create and approve pull requests** checked

## 3. Deploy

Once configured, the deployment will happen automatically:

- Push code to the `main` branch
- The **Deploy** workflow will run automatically
- Storybook will be built and deployed to GitHub Pages
- Your Storybook will be available at: `https://[username].github.io/[repository-name]/`

## Manual Deployment

You can also manually trigger deployment:

1. Go to **Actions** tab in your repository
2. Select the **Deploy** workflow
3. Click **Run workflow** button
4. Select the `main` branch and click **Run workflow**

## Troubleshooting

### "Get Pages site failed" Error

This error occurs when GitHub Pages is not properly enabled:

- Double-check that GitHub Pages is enabled in repository settings
- Ensure **GitHub Actions** is selected as the source
- Verify that your repository is public or you have GitHub Pro (for private repos)

### Build Failures

If the Storybook build fails:

- Check the **Actions** tab for detailed error logs
- Ensure all dependencies are properly installed
- Run `pnpm build-storybook` locally to test the build

### Permission Errors

If you see permission errors during deployment:

- Check that workflow permissions are correctly configured
- Ensure the `GITHUB_TOKEN` has sufficient permissions
- Verify that GitHub Actions are enabled for your repository

## Local Development

To test the Storybook build locally:

```bash
# Install dependencies
pnpm install

# Build Storybook
pnpm build-storybook

# The output will be in the `storybook-static` directory
```
