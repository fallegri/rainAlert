# SCZ Micro-Clima Tracker

Proyecto PWA de nowcasting para Santa Cruz de la Sierra.

## Instrucciones

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Ejecuta tests:
   ```bash
   npm test
   ```

## Estructura relevante

- `src/app/page.tsx` — pantalla principal y estado cliente
- `src/lib/geoUtils.ts` — lógica geoespacial pura
- `src/app/api/zones/route.ts` — lectura de zonas activas
- `src/app/api/predictions/route.ts` — inserción de logs de predicción
- `src/lib/db.ts` — cliente Neon serverless
- `src/components/` — UI de mapa, controles y resultados
- `src/hooks/useRadarAnimation.ts` — animación de partículas

## Configuration

- `DATABASE_URL` debe estar presente en `.env.local` si quieres usar la base de datos real.
- `public/manifest.json` ya está configurado para PWA.
