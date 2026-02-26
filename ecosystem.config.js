module.exports = {
  apps: [
    {
      name: 'aitrackr',
      script: 'npm',
      args: 'run start',
      cwd: '/home/xflash/aitrackr',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
}
