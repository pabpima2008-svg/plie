# Cómo publicar Plié en Google Play

Esta guía va en orden. Los menús de Google y GitHub cambian de vez en cuando, así que si algún nombre no coincide exactamente, busca el más parecido.

## Qué hay en esta carpeta

- `src/` y `www/`: el código de la app (pantallas, clases de ballet, temporizador, anuncios, compra).
- `android/`: el proyecto de Android ya preparado.
- `.github/workflows/android.yml`: la receta para que GitHub compile la app por ti (no hace falta Android Studio ni un portátil potente).
- `docs/index.html`: la política de privacidad (la pide Google Play).
- `assets/`: el icono y la pantalla de carga.

## Paso 1: subir el proyecto a GitHub

1. Crea una cuenta gratis en github.com.
2. Instala **GitHub Desktop** (desktop.github.com), que es ligero.
3. En GitHub Desktop: File > Add local repository > elige esta carpeta. Ya trae el primer commit hecho.
4. Pulsa **Publish repository**. Ponle de nombre `plie` y **quita la marca de "Keep this code private"** (hace falta público para que la política de privacidad tenga una página web gratis).

## Paso 2: la clave de firma

Abre el archivo `SECRETOS-GITHUB.txt` (te lo he dado aparte). En GitHub: tu repositorio > Settings > Secrets and variables > Actions > New repository secret. Crea los 4 secretos con el nombre y valor exactos que aparecen ahí.

Guarda `plie-upload.jks` y `SECRETOS-GITHUB.txt` en un sitio seguro. **No los subas a GitHub.**

## Paso 3: compilar

1. En tu repositorio, pestaña **Actions** > "Compilar app Android" > **Run workflow**. Tarda unos 5-10 minutos.
2. Cuando termine en verde, abre la ejecución y baja los dos archivos de "Artifacts":
   - `plie-apk-de-prueba`: se instala en tu móvil para probar (hay que permitir "instalar apps desconocidas").
   - `plie-aab-para-play-store`: es el que se sube a Google Play.
3. Si sale en rojo, copia el mensaje de error y mándamelo.

## Paso 4: política de privacidad

1. En el repositorio, abre `docs/index.html`, pulsa el lápiz y cambia `[ESCRIBE AQUÍ TU CORREO]` y `[WRITE YOUR EMAIL HERE]` por tu correo de contacto. Guarda (Commit).
2. Settings > Pages > Source: "Deploy from a branch" > rama `main`, carpeta `/docs` > Save.
3. Tu URL será `https://TU-USUARIO.github.io/plie/`. Abre `src/ads.js` en GitHub, cambia `PRIVACY_URL` por esa URL y guarda. Esa URL también se pega en Play Console.

## Paso 5: Google Play Console

1. Crea la cuenta de desarrollador (pago único de unos 25 $) y completa la verificación que te pidan.
2. Crear app: nombre, idioma, "App" (no juego), "Gratis".
3. **Público objetivo y contenido**: elige los rangos de edad que incluyan menores de 13 (y adolescentes). Al hacerlo, la app entra en el programa de **Familias** de Google Play. Responde que la app **contiene anuncios**.
4. **Seguridad de los datos**: declara que la app no recoge datos personales en tus servidores. Ten en cuenta que AdMob puede tratar datos técnicos del dispositivo; revisa la ayuda de AdMob para apps de Familias y responde con cuidado.
5. **Clasificación de contenido**: rellena el cuestionario (es una app de ejercicio, sin violencia).
6. Pega la URL de la política de privacidad.

## Paso 6: anuncios reales (AdMob)

Hasta que hagas esto, la app muestra anuncios de **prueba** (no dan dinero, pero son seguros para probar).

1. Crea una cuenta en admob.google.com y registra la app Android `com.pliedance.app`.
2. Crea un bloque de anuncios de tipo **Banner**. Te dará dos IDs: el **ID de la app** (`ca-app-pub-...~...`) y el **ID del bloque** (`ca-app-pub-.../...`).
3. En el proyecto:
   - `android/app/src/main/res/values/strings.xml`: cambia `admob_app_id` por el ID de la app.
   - `src/ads.js`: pon el ID del bloque en `BANNER_ID_REAL` y cambia `TEST_MODE` a `false`.
4. En AdMob, en la configuración de la app, activa el tratamiento de anuncios para menores si te lo ofrece y revisa que los anuncios sean adecuados para Familias.

## Paso 7: la compra "Quitar anuncios"

1. Play Console > tu app > Monetizar > Productos > **Productos integrados**.
2. Crea un producto **de un solo pago** con el ID exacto `remove_ads`, un nombre ("Quitar anuncios") y un precio. Actívalo.
3. Para que la compra funcione hay que instalar la app desde Play (pruebas internas o cerradas), no desde el APK de prueba.

## Paso 8: pruebas obligatorias y publicación

1. Play Console > Pruebas > **Prueba cerrada**: crea una versión, sube el `.aab`, añade a tus testers (por correo de Google) y envíala a revisión.
2. Las cuentas nuevas de particular deben mantener la prueba cerrada con unos **12 testers durante 14 días seguidos** antes de pedir la publicación. Comprueba el número exacto en la consola, porque Google lo cambia de vez en cuando.
3. Pasados los días, pide el **acceso a producción** y publica.

## Cada vez que quieras actualizar

Cambia lo que quieras, haz commit y "Push" en GitHub Desktop. GitHub compila un AAB nuevo (con número de versión más alto automáticamente) y lo subes a Play Console.

## Textos para la ficha de la tienda

**Nombre (máx. 30):** Plié: Ballet en casa

**Descripción corta (máx. 80):**
- ES: Clases de ballet guiadas con temporizador y ritmo. Ideal para empezar en casa.
- EN: Guided ballet classes with timer and beat. Perfect for starting at home.

**Descripción larga (ES):**
Plié te lleva de la mano en clases de ballet para hacer en casa, sin necesidad de apuntarte a una academia. Cada clase está dividida en ejercicios cortos, con temporizador, un ritmo opcional para marcar los tiempos y explicaciones paso a paso.

- Barra para principiantes: calentamiento, pliés, tendus, dégagés, rond de jambe, relevés y estiramiento final.
- Estiramientos suaves para soltar el cuerpo antes o después de bailar.
- Centro y equilibrio: port de bras, pasos en media punta, sautés y reverencia.
- En español y en inglés.
- Pensada para niñas, niños, adolescentes y adultos que empiezan.

La app es gratuita con anuncios. Con un único pago puedes quitarlos para siempre.

Los ejercicios son orientativos y no sustituyen a un profesor de ballet. Baila con un adulto cerca si eres menor y para si sientes dolor.

**Descripción larga (EN):**
Plié guides you through ballet classes you can do at home, no studio needed. Each class is split into short exercises with a timer, an optional beat to keep time, and step-by-step explanations.

- Beginner barre: warm-up, pliés, tendus, dégagés, rond de jambe, relevés and a final stretch.
- Gentle stretching to loosen up before or after dancing.
- Centre and balance: port de bras, steps on demi-pointe, sautés and a bow.
- In English and Spanish.
- Made for children, teenagers and adults who are just starting.

The app is free with ads. A single payment removes them for good.

Exercises are for guidance only and do not replace a ballet teacher. If you are under 18, dance with an adult nearby, and stop if you feel pain.

## Cosas que aún faltan para mejorar

- Capturas de pantalla para la ficha (mínimo 2). Se pueden hacer desde el móvil con la app instalada.
- Un gráfico de funciones (1024×500) para la ficha.
- Ilustraciones o fotos de cada ejercicio (ahora las clases son por texto, temporizador y ritmo).
- Más clases.
