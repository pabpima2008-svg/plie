import { build } from 'esbuild';

// Valores de publicacion: llegan como variables de entorno (GitHub Actions).
const env = process.env;
const release = env.PLIE_RELEASE === '1';

await build({
  entryPoints: ['src/app.js'],
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['chrome80'],
  outfile: 'www/app.js',
  logLevel: 'info',
  define: {
    __RELEASE__: JSON.stringify(release),
    __BANNER_ID__: JSON.stringify(env.ADMOB_BANNER_ID || ''),
    __PRIVACY_URL__: JSON.stringify(env.PRIVACY_URL || '')
  }
});
console.log(release ? 'Versión de PUBLICACIÓN (sin modo prueba).' : 'Versión de PRUEBAS (con modo prueba).');
console.log(env.ADMOB_BANNER_ID ? 'Anuncios REALES.' : 'Anuncios de PRUEBA de Google.');
