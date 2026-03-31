{
  "apps": [
    {
      "name": "toko-pakaian-backend",
      "script": "./src/server.js",
      "cwd": "./backend",
      "watch": false,
      "ignore_watch": ["node_modules", "logs"],
      "env": {
        "NODE_ENV": "development"
      },
      "error_file": "./logs/err.log",
      "out_file": "./logs/out.log",
      "log_date_format": "YYYY-MM-DD HH:mm:ss Z",
      "merge_logs": true,
      "autorestart": true,
      "max_memory_restart": "300M",
      "max_restarts": 10,
      "min_uptime": "10s",
      "restart_delay": 4000,
      "listen_timeout": 3000,
      "kill_timeout": 5000
    }
  ]
}
