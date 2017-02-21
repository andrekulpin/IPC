const { spawn }  = require('child_process');
const { join } = require('path');
const path = join( __dirname, 'slave.js' );
const IPC = require('./index');
const P = require('bluebird')