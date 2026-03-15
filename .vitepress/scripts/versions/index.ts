import { Runner } from '../runner.js';

interface VersionModule {
  default: new (...args: ConstructorParameters<typeof Runner>) => Runner;
}

export const versionModules = new Map<string, () => Promise<VersionModule>>([
  ['dev', () => import('./dev.js')],
  ['1.2', () => import('./1.2.js')],
  ['1.1', () => import('./1.1.js')],
  ['1.0', () => import('./1.0.js')],
  ['0.19', () => import('./0.19.js')],
  ['0.18', () => import('./0.18.js')],
  ['0.17', () => import('./0.17.js')],
  ['0.16', () => import('./0.16.js')],
  ['0.15', () => import('./0.15.js')],
  ['0.14', () => import('./0.14.js')],
]);

export const latestVersion = [...versionModules.keys()][1]!;
