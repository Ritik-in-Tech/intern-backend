module.exports = {
  apps: [
    {
      name: 'api',
      script: './src/index.ts',
      interpreter: 'ts-node',
      env: {
        NODE_OPTIONS: '--max-old-space-size=4096',
        NODE_ENV: 'production'
      },
    },
  ],
};
