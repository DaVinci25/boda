# 💍 Web de Boda - Angular

Una web elegante y completa para gestionar las confirmaciones de asistencia a tu boda, construida con Angular.

## ✨ Características

- ✅ **Diseño elegante y clásico** - Tema dorado y elegante perfecto para una boda
- ✅ **Formulario RSVP completo** - Con validaciones y campos para todos los detalles
- ✅ **Diseño responsive** - Se ve perfecto en móvil, tablet y desktop
- ✅ **Navegación intuitiva** - Acceso rápido a todas las secciones
- ✅ **Información completa** - Fecha, hora, lugar, dress code, cronograma
- ✅ **Lista de regalos** - Sección para gestionar regalos
- ✅ **FAQ** - Preguntas frecuentes para resolver dudas
- ✅ **Nuestra historia** - Sección para contar vuestra historia de amor
- ✅ **Privacidad** - Consentimiento y protección de datos

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Instalación

1. Navega al directorio del proyecto:
```bash
cd boda-wedding
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
ng serve
```

4. Abre tu navegador en `http://localhost:4200`

## 📝 Personalización

### 1. Información de la Boda

Edita los siguientes archivos para personalizar la información:

- **Nombres de los novios**: `src/app/components/home/home.component.html` (líneas 6-8)
- **Fecha de la boda**: `src/app/components/home/home.component.html` (línea 9)
- **Lugar**: `src/app/components/details/details.component.html`
- **Dress code**: `src/app/components/details/details.component.html`

### 2. Fotos

Reemplaza los placeholders de fotos (`photo-placeholder`) con tus imágenes:

1. Coloca tus fotos en `src/assets/images/`
2. Reemplaza los divs con clase `photo-placeholder` por:
```html
<img src="assets/images/tu-foto.jpg" alt="Descripción" class="wedding-photo">
```

### 3. Colores y Estilos

Los colores principales están definidos en `src/styles.css`:

```css
:root {
  --primary-gold: #D4AF37;
  --dark-gold: #C9A227;
  --brown: #8B4513;
  /* ... */
}
```

### 4. Integración del Formulario RSVP

El formulario actualmente simula el envío. Para integrarlo con un servicio real:

1. **EmailJS** (Recomendado para empezar):
   - Crea una cuenta en [EmailJS](https://www.emailjs.com/)
   - Configura un template de email
   - Actualiza `src/app/services/rsvp.service.ts` con tus credenciales

2. **Backend propio**:
   - Crea un endpoint en tu backend
   - Actualiza el método `submitRsvp` en `rsvp.service.ts`

3. **Google Forms**:
   - Crea un formulario de Google
   - Usa la API de Google Forms

### 5. Enlaces Externos

Actualiza los siguientes enlaces:

- **Google Maps**: `src/app/components/details/details.component.html`
- **Lista de regalos**: `src/app/components/gifts/gifts.component.html`
- **Email de contacto**: `src/app/components/faq/faq.component.html`

## 📁 Estructura del Proyecto

```
boda-wedding/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── home/          # Página principal
│   │   │   ├── rsvp/          # Formulario de confirmación
│   │   │   ├── details/       # Detalles del evento
│   │   │   ├── story/         # Nuestra historia
│   │   │   ├── gifts/         # Lista de regalos
│   │   │   └── faq/           # Preguntas frecuentes
│   │   ├── services/
│   │   │   └── rsvp.service.ts  # Servicio para manejar RSVP
│   │   ├── app.component.*    # Componente principal con navegación
│   │   └── app.routes.ts      # Configuración de rutas
│   ├── styles.css             # Estilos globales
│   └── index.html
└── README.md
```

## 🎨 Temas y Estilos

La web usa un tema elegante y clásico con:
- Colores dorados y marrones
- Tipografía serif (Playfair Display) para títulos
- Tipografía sans-serif (Lato) para texto
- Diseño limpio y minimalista

## 📱 Responsive Design

La web está completamente optimizada para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)

## 🔒 Privacidad

El formulario incluye:
- Consentimiento explícito de privacidad
- Explicación del uso de datos
- Sin recopilación de información sensible innecesaria

## 🚢 Despliegue

### Netlify (Recomendado)

1. Construye el proyecto:
```bash
ng build --configuration production
```

2. Arrastra la carpeta `dist/boda-wedding` a [Netlify](https://www.netlify.com/)

### Vercel

```bash
npm install -g vercel
vercel
```

### GitHub Pages

1. Instala `angular-cli-ghpages`:
```bash
npm install -g angular-cli-ghpages
```

2. Despliega:
```bash
ng build --configuration production --base-href=/tu-repositorio/
npx angular-cli-ghpages --dir=dist/boda-wedding
```

## 📧 Notificaciones

Para recibir notificaciones cuando alguien confirma:

1. Configura EmailJS o tu servicio de email preferido
2. Actualiza `rsvp.service.ts` con tu configuración
3. El servicio enviará:
   - Email de confirmación al invitado
   - Notificación a los novios con los datos del RSVP

## 🛠️ Tecnologías Utilizadas

- Angular 18
- TypeScript
- RxJS
- CSS3 (con variables CSS)
- Google Fonts (Playfair Display, Lato)

## 📄 Licencia

Este proyecto es de uso libre para tu boda personal.

## 💡 Consejos

1. **Personaliza los textos**: Haz que reflejen vuestra personalidad
2. **Añade fotos reales**: Reemplaza todos los placeholders
3. **Prueba el formulario**: Asegúrate de que funciona antes de compartirlo
4. **Comparte el enlace**: Una vez desplegado, comparte la URL con tus invitados
5. **Revisa las respuestas**: Configura un sistema para recibir las confirmaciones

## 🎉 ¡Felicidades!

¡Que tengáis un día perfecto lleno de amor y felicidad!

---

**Nota**: Recuerda actualizar todos los placeholders `[Nombre Novio]`, `[Nombre Novia]`, fechas, lugares, etc. antes de compartir la web con tus invitados.
