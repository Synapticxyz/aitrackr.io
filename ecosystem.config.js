module.exports = {
  apps: [
    {
      name: 'aitrackr',
      script: 'node',
      args: '.next/standalone/server.js',
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
