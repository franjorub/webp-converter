import { Express } from 'express';
import { ExpressRouterLayer } from '../types';

export function getRegisteredRoutes(app: Express): { method: string; path: string }[] {
  const routes: string[] = [];

  function cleanPath(path: string): string {
    return path
      .replace(/\?\(\?=\/\|\$\)/g, '')
      .replace(/\?\(\?=\/\|\)/g, '')
      .replace(/\^/g, '')
      .replace(/\$/g, '')
      .replace(/\\\//g, '/')
      .replace(/\/+/g, '/');
  }

  function extractRoutes(stack: ExpressRouterLayer[], basePath: string = '') {
    stack.forEach(layer => {
      if (layer.route) {
        const path = basePath + (layer.route.path || '');
        const methods = Object.keys(layer.route.methods)
          .filter(method => layer?.route?.methods[method])
          .map(method => method.toUpperCase());

        methods.forEach(method => {
          routes.push(`${method} ${path}`);
        });
      } else if (layer.name === 'router' && layer.handle?.stack) {
        let newPath = '';

        if (layer.regexp?.source) {
          newPath = layer.regexp.source
            .replace(/^\^/, '')
            .replace(/\$\/?$/, '')
            .replace(/\\\/\?\(\?=\/\|\$\)/g, '')
            .replace(/\?\(\?=\/\|\)/g, '')
            .replace(/\\\//g, '/')
            .replace(/\^/g, '')
            .replace(/\$/g, '')
            .replace(/\/+/g, '/');
        }

        if (newPath && !newPath.startsWith('/')) {
          newPath = '/' + newPath;
        }

        extractRoutes(layer.handle.stack, basePath + newPath);
      } else if (layer.name === 'bound dispatch' && layer.handle?.stack) {
        extractRoutes(layer.handle.stack, basePath);
      }
    });
  }

  extractRoutes(app._router.stack);

  return routes
    .map(route => {
      const [method, path] = route.split(' ');
      const cleanedPath = cleanPath(path).replace(/\/+/g, '/').replace(/\/$/, '');
      return { method, path: cleanedPath };
    })
    .filter(route => !route.path.includes('*'))
    .sort((a, b) => a.path.localeCompare(b.path));
}

export function logRegisteredRoutes(app: Express): void {
  const routes = getRegisteredRoutes(app);

  if (routes.length === 0) {
    console.log('\n🛣️  API Endpoints:');
    console.log('===================');
    console.log('No endpoints registered');
    console.log('===================\n');
    return;
  }

  const maxMethodLength = Math.max(...routes.map(route => route.method.length));

  console.log('\n🛣️  API Endpoints:');
  console.log('===================');

  routes.forEach(route => {
    const paddedMethod = route.method.padEnd(maxMethodLength, ' ');
    console.log(`▶ ${paddedMethod} ${route.path}`);
  });

  console.log('===================\n');
}
