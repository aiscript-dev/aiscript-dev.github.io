import { Runner } from '../runner';

interface VersionModule {
  default: new (...args: ConstructorParameters<typeof Runner>) => Runner;
}

export const versionModules = new Map<string, () => Promise<VersionModule>>([
  ['dev', () => import('./dev')],
  ['0.19.0', () => import('./0.19.0')],
  ['0.18.0', () => import('./0.18.0')],
  ['0.17.0', () => import('./0.17.0')],
  ['0.16.0', () => import('./0.16.0')],
  ['0.15.0', () => import('./0.15.0')],
  ['0.14.1', () => import('./0.14.1')],
]);

export const latestVersion = [...versionModules.keys()][1]!;
