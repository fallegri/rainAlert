# Manual de Usuario - Rain Alert App

## Introducción

Rain Alert es una aplicación web que te ayuda a determinar si una tormenta que se acerca te afectará personalmente. Utiliza tu ubicación actual, datos meteorológicos en tiempo real y cálculos de trayectoria para predecir si te mojarás o no.

## Requisitos del Sistema

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet para datos meteorológicos
- Permisos de geolocalización activados en el navegador

## Instalación

La aplicación está disponible como PWA (Progressive Web App) y puede instalarse en dispositivos móviles y de escritorio.

### Instalación en Android/iOS
1. Abre la aplicación en tu navegador
2. Toca el menú del navegador (tres puntos)
3. Selecciona "Agregar a pantalla de inicio" o "Instalar aplicación"

### Instalación en Desktop
1. Abre la aplicación en Chrome/Edge
2. Haz clic en el ícono de instalación en la barra de direcciones

## Primer Uso

1. **Permisos de Ubicación**: La aplicación solicitará acceso a tu ubicación. Acepta para obtener predicciones precisas.

2. **Selección de Zona**: Elige una zona meteorológica de Santa Cruz que esté experimentando lluvia o tormenta.

3. **Configuración de Tiempo**: Ajusta el tiempo estimado de llegada (ETA) que tienes disponible para llegar a un lugar seguro.

4. **Obtener Predicción**: La aplicación calculará si la tormenta te alcanzará antes de tu ETA.

## Funciones Principales

### Panel de Control
- **Dirección del Viento**: Muestra la dirección actual del viento (calculada automáticamente)
- **Velocidad del Viento**: Muestra la velocidad actual del viento (calculada automáticamente)
- **Tiempo de Llegada**: Control deslizante para ajustar tu ETA (0-120 minutos)

### Mapa Interactivo
- **Zonas Meteorológicas**: 8 puntos cardinales alrededor de Santa Cruz
- **Tu Ubicación**: Marcador azul que muestra tu posición actual
- **Trayectoria de Tormenta**: Animación de partículas que muestra el movimiento de la tormenta

### Resultados
- **Veredicto**: Uno de tres resultados posibles:
  - **TE SALVAS**: La tormenta no te alcanzará a tiempo
  - **TE MOJAS**: La tormenta te alcanzará antes de tu ETA
  - **PISO MOJADO**: La tormenta ya ha pasado pero el piso está mojado

### Simulación Animada
- **Iniciar Simulación**: Visualiza el movimiento de la tormenta con partículas
- **Detener Simulación**: Pausa la animación en cualquier momento

## Interpretación de Resultados

### Factores que Influyen
- **Distancia**: Cuán lejos está la zona de tormenta de tu ubicación
- **Dirección del Viento**: Hacia dónde sopla el viento (afecta la trayectoria)
- **Velocidad del Viento**: Cuán rápido se mueve la tormenta
- **Tu ETA**: Cuánto tiempo tienes para llegar a un refugio

### Cálculo de Trayectoria
La aplicación calcula si el camino de la tormenta (basado en viento) intersectará tu ubicación dentro de tu tiempo disponible.

## Solución de Problemas

### "Datos Locales" Aparece
Esto significa que no se pudo conectar a la base de datos externa. La aplicación usa datos locales de respaldo que pueden estar desactualizados.

### Ubicación no Disponible
- Verifica que los permisos de geolocalización estén activados
- Intenta refrescar la página
- Si estás en un dispositivo móvil, verifica la configuración de ubicación

### Animación no Funciona
- Asegúrate de que tu navegador soporte Canvas HTML5
- Intenta en un navegador más moderno

### Datos Meteorológicos Incorrectos
Los datos del viento se actualizan automáticamente cada minuto. Si parecen incorrectos, espera un momento y refresca.

## Consejos de Uso

1. **Actualiza Regularmente**: Los datos meteorológicos cambian constantemente
2. **Considera el Terreno**: La aplicación no tiene en cuenta edificios, colinas u otros obstáculos
3. **Margen de Error**: Hay un margen de 45 minutos en los cálculos para imprecisiones
4. **Usa con Moderación**: Esta es una herramienta de ayuda, no un sistema de alerta oficial

## Privacidad

- Tu ubicación se usa solo localmente en tu navegador
- Los datos de predicciones se almacenan de forma anónima para mejorar el sistema
- No se comparte información personal con terceros

## Soporte

Si encuentras problemas o tienes sugerencias, puedes:
- Revisar los logs de la consola del navegador (F12)
- Contactar al desarrollador a través del repositorio GitHub

## Actualizaciones

La aplicación se actualiza automáticamente cuando hay nuevas versiones disponibles. Refresca la página para obtener las últimas mejoras.

---

*Versión 0.1.0 - Abril 2026*