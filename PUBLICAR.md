# Cómo publicar Plié en Google Play

Guía en orden, de principio a fin. Los menús de Google y GitHub cambian a veces: si un nombre no coincide exactamente, busca el más parecido.

**Lo que ya está hecho:** la app, los anuncios (AdMob, adaptados a la edad), la compra "Quitar anuncios", la política de privacidad, el icono, las capturas, el gráfico y los textos de la ficha (carpeta `store`). La app apunta a Android 16 (API 36), que es lo que Google exige desde el 31 de agosto de 2026.

**Lo que tienes que hacer tú:** crear las cuentas, pegar tus IDs y subir los archivos. Nada de código.

---

## Paso 1 · Subir el proyecto a GitHub (una sola vez)

1. Crea una cuenta gratis en github.com.
2. Instala **GitHub Desktop** (desktop.github.com) e inicia sesión.
3. Descomprime `plie-app.zip`. En GitHub Desktop: **File > Add local repository** y elige la carpeta `plie`.
4. Pulsa **Publish repository**, con el nombre `plie`. **Quita la marca "Keep this code private"**: hace falta que sea público para que la política de privacidad tenga una web gratis.

## Paso 2 · Clave de firma (una sola vez)

En GitHub: tu repositorio > **Settings > Secrets and variables > Actions > pestaña Secrets > New repository secret**. Crea los 4 secretos de `SECRETOS-GITHUB.txt` (KEYSTORE_B64, KEYSTORE_PASSWORD, KEY_ALIAS, KEY_PASSWORD).

Guarda `plie-upload.jks` y `SECRETOS-GITHUB.txt` en un sitio seguro. **Si los pierdes, no podrás actualizar la app.**

## Paso 3 · Política de privacidad en internet

1. En GitHub, abre `docs/index.html`, pulsa el lápiz y cambia `[ESCRIBE AQUÍ TU CORREO]` y `[WRITE YOUR EMAIL HERE]` por tu correo de contacto. Guarda con **Commit changes**.
2. **Settings > Pages**: en *Source* elige **Deploy from a branch**, rama `main` y carpeta `/docs`. Guarda.
3. En un par de minutos estará en `https://TU-USUARIO.github.io/plie/`. La app ya enlaza esa dirección sola.

## Paso 4 · Cuenta de desarrollador de Google Play

1. Entra en play.google.com/console, paga la cuota única (unos 25 $) y completa la verificación de identidad que te pida.
2. **Crear app:** nombre "Plié: Ballet en casa", idioma por defecto Español (España), tipo **App**, **Gratuita**. Acepta las declaraciones.

## Paso 5 · AdMob (los anuncios de verdad)

1. Entra en admob.google.com con la misma cuenta de Google y acepta las condiciones. Rellena los datos de pago cuando te lo pida.
2. **Apps > Añadir app > Android**. Si ya aparece en Play, búscala; si no, elige que aún no está publicada. Nombre: Plié.
3. Copia el **ID de la app**, que tiene esta forma: `ca-app-pub-1234567890123456~1234567890`.
4. Dentro de la app crea **tres bloques de anuncios** (Bloques de anuncios > Añadir) y copia el ID de cada uno (`ca-app-pub-.../...`):
   - **Banner** · nombre "Banner principal". Es la franja de abajo en el inicio, los días, los resultados y los ajustes.
   - **Intersticial** · nombre "Fin de sesión". Es el anuncio a pantalla completa al terminar una sesión: uno cada 2 sesiones (cada 3 en menores de 13) y con al menos 4 minutos entre uno y otro. Nunca sale durante el ejercicio.
   - **Bonificado** · nombre "Desbloquear día". Es el anuncio que la persona elige ver para adelantar el día siguiente de una modalidad, como máximo una vez al día por modalidad. En "Recompensa" pon cantidad 1 y artículo "dia".
5. En la configuración de la app en AdMob, revisa **Configuración de la app > Contenido dirigido a menores** y ajusta las categorías de anuncios bloqueadas a contenido apto para todos los públicos.
6. **Privacidad y mensajes**: crea el mensaje de consentimiento para el RGPD (Europa). La app ya lo muestra a los adultos donde haga falta.
7. En GitHub: **Settings > Secrets and variables > Actions > pestaña Variables > New repository variable**. Crea estas dos:

| Nombre | Valor |
|---|---|
| `ADMOB_APP_ID` | el ID de la app (con `~`) |
| `ADMOB_BANNER_ID` | el ID del bloque banner |
| `ADMOB_INTERSTITIAL_ID` | el ID del bloque intersticial |
| `ADMOB_REWARDED_ID` | el ID del bloque bonificado |

**No pongas tus anuncios reales en tu propio móvil** ni pulses en ellos: AdMob puede bloquear la cuenta. El APK de prueba siempre usa anuncios de prueba; los reales solo van en el archivo de Play.

## Paso 6 · Compilar

1. En tu repositorio: pestaña **Actions > "Compilar app Android" > Run workflow**. Tarda unos 10 minutos.
2. Al terminar, el **resumen** te dice si el archivo para Play está firmado y qué anuncios reales lleva (banner, intersticial y bonificado). Tiene que salir todo en ✅.
3. En *Artifacts* descarga:
   - `plie-apk-de-prueba`: para instalar en tu móvil y probar. Lleva el interruptor "Modo prueba" y anuncios de prueba.
   - `plie-aab-para-play-store`: el archivo `.aab` que se sube a Google Play. No lleva modo prueba.
4. Si algo sale en rojo, copia el error y pásamelo.

## Paso 7 · Rellenar la ficha y las declaraciones en Play Console

**Ficha principal de la tienda** (Crecer > Presencia en la tienda): copia los textos de `store/FICHA-PLAY.md` y sube el icono, el gráfico de funciones y las capturas de la carpeta `store`. Añade también el idioma inglés con sus textos y capturas.

**Contenido de la app** (Política > Contenido de la app). Responde así:

- **Política de privacidad:** `https://TU-USUARIO.github.io/plie/`
- **Anuncios:** Sí, la app contiene anuncios.
- **Acceso a la app:** todas las funciones están disponibles sin restricciones (no hay cuentas).
- **Clasificación de contenido:** categoría "Todas las demás apps" o "Referencia, salud, educación". No hay violencia, sexo, lenguaje malsonante, drogas ni apuestas. Hay compras en la app y anuncios. Resultado esperado: PEGI 3 / Para todos.
- **Público objetivo y contenido:** marca los rangos **6-8, 9-12, 13-15, 16-17 y 18+**. Al incluir menores de 13, entras en el programa **Familias**: acepta sus requisitos. Si te pregunta si la app atrae sin querer a niños, ya los has incluido, así que no aplica.
- **Anuncios para Familias:** confirma que usas AdMob, que es un SDK certificado para Familias.
- **ID de publicidad:** la app **no** usa el ID de publicidad (lo hemos quitado del manifiesto).
- **Apps de salud:** declara que es una app de **actividad física y ejercicio**, sin funciones médicas.
- **Seguridad de los datos** (formulario):
  - ¿Recoge o comparte datos? **Sí** (por el SDK de AdMob).
  - ¿Cifrados en tránsito? **Sí**.
  - ¿Pueden pedir que se borren? No hay cuentas; los datos locales se borran desde la app o desinstalándola.
  - Datos que se **recogen y comparten**, con finalidad *Publicidad o marketing, Analíticas y Prevención de fraude*:
    - **Ubicación aproximada** (por la dirección IP).
    - **Actividad en la app > Interacciones con la app.**
    - **Información y rendimiento de la app > Diagnóstico.**
    - **Identificadores del dispositivo u otros** (el identificador de conjunto de apps).
  - Ninguno es opcional para el usuario de la versión gratuita. Todos los trata el SDK automáticamente.
  - La app no recoge nombre, correo, ubicación exacta, fotos, contactos ni datos de salud.
  - Consulta también la guía oficial de AdMob por si cambia: developers.google.com/admob/android/privacy/play-data-disclosure

**Monetizar > Productos > Productos integrados:** crea un producto de **pago único** con el ID exacto `remove_ads`, nombre "Quitar anuncios" / "Remove ads" y un precio (por ejemplo 2,99 €). Actívalo.

## Paso 8 · Prueba cerrada obligatoria

1. **Probar > Prueba cerrada > Crear canal** (o usa "Alpha"). Crea una versión y sube el `.aab`. Pega las notas de la versión de `FICHA-PLAY.md`.
2. **Testers:** crea una lista con los correos de Gmail de al menos **12 personas**. Mándales el enlace de participación; tienen que aceptarlo e instalar la app desde Play.
3. Envía la versión a revisión. Google suele tardar unos días.
4. Las cuentas personales nuevas deben tener la prueba cerrada con al menos 12 testers durante **14 días seguidos** antes de poder publicar. Comprueba la cifra exacta en tu consola.
5. Durante esos días, prueba la compra "Quitar anuncios" desde una cuenta de tester. Añade tu correo en **Configuración > Pruebas de licencias** para que no te cobre de verdad.

## Paso 9 · Publicar

1. Pasados los 14 días, en el **Panel** aparece **Solicitar acceso a producción**. Responde las preguntas sobre la prueba (qué te dijeron los testers y qué cambiaste).
2. Cuando lo aprueben: **Producción > Crear versión**, sube el último `.aab` y envía a revisión.
3. Al aprobarse, Plié aparece en Google Play.

## Cada vez que quieras actualizar

Cambia lo que quieras, haz *Commit* y *Push* en GitHub Desktop. GitHub compila un `.aab` nuevo con un número de versión mayor y lo subes a Play Console.

---

## Antes de pulsar "Publicar": lista de comprobación

- [ ] Una profesora de ballet ha revisado los ejercicios avanzados y las poses del personaje.
- [ ] El resumen de GitHub sale en ✅ (firmado y con anuncios reales).
- [ ] He probado el APK de prueba en un móvil Android: clases, sonido del ritmo, pantalla que no se apaga y botón de atrás.
- [ ] Mi correo está en la política de privacidad y la web se abre.
- [ ] El producto `remove_ads` está activo en Play Console.
- [ ] He rellenado Público objetivo, Seguridad de los datos, Anuncios, Clasificación y Apps de salud.

## Comprobaciones técnicas (para quien programe)

- `npm run validate` revisa todo el contenido: ejercicios, animaciones, textos ES/EN y los 270 días.
- `npm run build` genera la versión de pruebas; con `PLIE_RELEASE=1` genera la de publicación.
- `node scripts/store-assets.mjs` y `node scripts/screenshots.mjs` regeneran el icono, el gráfico y las capturas.
