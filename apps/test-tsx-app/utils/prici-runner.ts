import { $ } from 'zx';
import { setTimeout } from 'node:timers/promises';
import jsonwebtoken from 'jsonwebtoken';
import { initialize } from '@prici/sdk';

const token = 'abcd';
const tenantName = 'demo-tenant-' + Math.random();


async function runPriciInstance() {
  let RANDOM_PORT = Math.floor(Math.random() * 10000).toString()

  if (RANDOM_PORT.length < 4) {
    RANDOM_PORT = '3'.repeat(4 - RANDOM_PORT.length) + RANDOM_PORT;
  }

  $.cwd = '../api';
  $.env = {
    ...process.env,
    PORT: RANDOM_PORT,
    JWT_SECRET: token,
  };

  const server = $`node --import tsx --watch server.ts`;

  await setTimeout(2000);

  return {
    port: RANDOM_PORT,
    quit: () => {
      console.log('quit prici server');
      server.kill('SIGINT');
    },
  };
}


export async function getPriciSdk() {
  const server = await runPriciInstance();

  return {
    sdk: initialize({
      token: jsonwebtoken.sign({
        tenant: tenantName,
      }, token),
      priciUBaseUrl: 'http://localhost:' + server.port,
    }),
    quit: () => server.quit(),
  };
}