# Instrucciones para subir a GitHub

## Paso 1: Crear el repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Haz clic en el botón **"+"** (arriba a la derecha) → **"New repository"**
3. Completa el formulario:
   - **Repository name**: `boda-wedding` (o el nombre que prefieras)
   - **Description**: "Web de boda elegante con formulario RSVP - Angular"
   - **Visibility**: Elige **Public** o **Private**
   - **NO marques** "Initialize this repository with a README" (ya tenemos uno)
4. Haz clic en **"Create repository"**

## Paso 2: Conectar y subir el código

Una vez creado el repositorio, GitHub te mostrará instrucciones. Ejecuta estos comandos en la terminal desde el directorio `boda-wedding`:

### Si es la primera vez (HTTPS):
```bash
git remote add origin https://github.com/TU_USUARIO/boda-wedding.git
git branch -M main
git push -u origin main
```

### Si prefieres SSH:
```bash
git remote add origin git@github.com:TU_USUARIO/boda-wedding.git
git branch -M main
git push -u origin main
```

**Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub**

## Paso 3: Verificar

Después de ejecutar los comandos, ve a tu repositorio en GitHub y deberías ver todos los archivos subidos.

## Comandos útiles para futuros cambios

```bash
# Ver el estado de los archivos
git status

# Agregar archivos modificados
git add .

# Hacer commit
git commit -m "Descripción de los cambios"

# Subir cambios a GitHub
git push
```

## Nota sobre archivos sensibles

Si necesitas agregar información sensible (como API keys), créalos en un archivo `.env` y agrégalo al `.gitignore` antes de hacer commit.

