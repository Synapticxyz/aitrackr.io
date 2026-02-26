module.exports = {
  apps: [
    {
      name: 'aitrackr',
      script: 'server.js',
      cwd: '/home/xflash/aitrackr/.next/standalone',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
}
