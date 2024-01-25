import { $ } from 'zx';
import { setTimeout } from 'node:timers/promises';
import jsonwebtoken from 'jsonwebtoken';
import { initialize } from '@prici/sdk';

const token = 'abcd';
const tenantName = 'demo-tenant-' + Math.random();


async function runPriciInstance() {
  const RANDOM_PORT = Math.floor(Math.random() * 10000).toString()
  $.cwd = '../api';
  $.env = {
    ...process.env,
    PORT: RANDOM_PORT,
    JWT_SECRET: token,
  };

  const server = $`pnpm run dev`;

  await setTimeout(2000);

  const result = await $`nc -z localhost ${RANDOM_PORT}`;

  if (!result.toString().includes('succeeded!')) {
    server.kill('SIGINT')
    throw 'no prici';
  }

  server.catch(() => {
    console.log('prici failed to run');
    process.exit(1)
  })

  return {
    port: RANDOM_PORT,
    quit: () => {
      console.log('quit prici server');
      server.kill('SIGINT')
    }
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
    quit: () => server.quit()
  }
}