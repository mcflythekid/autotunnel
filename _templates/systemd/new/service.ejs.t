---
to: <%= systemdPath %>/autotunnel-<%= service %>.service
---
[Unit]
Description=Auto Tunnel: <%= service %>
After=network-online.target ssh.service

[Service]
User=<%= user %>
Environment="AUTOSSH_GATETIME=0"
ExecStart=/usr/bin/autossh -M 0 -N -o "ServerAliveInterval 60" -o "ServerAliveCountMax 3" <%= posfix %>

[Install]
WantedBy=multi-user.target
