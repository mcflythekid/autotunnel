#!/usr/bin/node

const CONFIG = require('./config');
const { exec, spawn, fork } = require('child_process');
const fs = require('fs');
const glob = require("glob");
const SYSTEMD_PATH = "/etc/systemd/system"; //Without last slash
const HYGEN_PATH = 'node_modules/hygen/dist/bin.js';
const HYGEN_OPTIONS = {
    env: {
        HYGEN_OVERWRITE: 1
    }
};
const remove = wildcard=>{
    glob(wildcard, function (er, files) {
        files.forEach(file=>{
            console.log("Removing file:", file)
            fs.unlinkSync(file);
        });
    });
}
const log = function (error, stdout, stderr) {
    if (stdout){
        console.log(stdout);
    }
    if (stderr){
        console.error(stderr);
    }
}

remove(`${SYSTEMD_PATH}/autotunnel-*.service`);
CONFIG.tunnels.forEach(tunnel=>{
    fork(
        HYGEN_PATH,
        [ 
            'systemd', 'new', 
            '--systemdPath', `"${SYSTEMD_PATH}"`,
            '--user', `"${CONFIG.user}"`,
            '--service', `"${tunnel.service}"`,
            '--posfix', `"${tunnel.posfix}"`
        ],
        HYGEN_OPTIONS
    );
});

setTimeout(()=>{
    console.log('Reloading SYSTEMD DAEMON');
    exec('systemctl daemon-reload', log);
}, 1000);

setTimeout(()=>{
    CONFIG.tunnels.forEach(tunnel=>{
        console.log('Reloading service:', tunnel.service);
        exec(`systemctl enable autotunnel-${tunnel.service}.service`, log);
        exec(`systemctl start autotunnel-${tunnel.service}.service`, log);
    });
}, 2000);