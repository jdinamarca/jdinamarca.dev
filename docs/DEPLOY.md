# Deploy Guide — jdinamarca.dev

> Guía paso a paso para desplegar en Vercel + configurar dominio + Firebase Auth.

---

## Requisitos previos

- ✅ Repo en GitHub: `git@github.com:jdinamarca/jdinamarca.dev.git`
- ✅ Build local pasa: `npm run build`
- ✅ Archivos de seguridad creados: `firestore.rules`, `storage.rules`, `firebase.json`

---

## E2: Deploy en Vercel

### 1. Conectar repo a Vercel

1. Ve a [vercel.com](https://vercel.com) → Sign in con GitHub
2. Dashboard → "Add New Project" → "Import Git Repository"
3. Selecciona `jdinamarca/jdinamarca.dev`
4. Framework Preset: **Next.js** (detectado automáticamente)

### 2. Configurar Environment Variables

Vercel → Project → Settings → Environment Variables → **Add New**

Variable | Valor (de `.env.local`)
---|---
`NEXT_PUBLIC_FIREBASE_API_KEY` | Tu API key
`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `jdinamarcadev-c1f8b.firebaseapp.com`
`NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `jdinamarcadev-c1f8b`
`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `jdinamarcadev-c1f8b.firebasestorage.app`
`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Tu sender ID
`NEXT_PUBLIC_FIREBASE_APP_ID` | Tu app ID
`NEXT_PUBLIC_ADMIN_EMAIL` | Tu email admin
`FIREBASE_ADMIN_PROJECT_ID` | `jdinamarcadev-c1f8b`
`FIREBASE_ADMIN_CLIENT_EMAIL` | Tu service account email
`FIREBASE_ADMIN_PRIVATE_KEY` | Tu private key **con saltos de línea** (ver abajo)

**⚠️ Importante para `FIREBASE_ADMIN_PRIVATE_KEY`:**

En `.env.local`, la private key tiene saltos de línea literales (`\n`). En Vercel:

- Pega la private key **completa** incluyendo `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`
- Los saltos de línea reales deben mantenerse
- **NO** reemplazar `\n` con saltos de línea reales en Vercel - la variable se guarda tal cual

Ejemplo de cómo debería verse en el campo de texto de Vercel:

```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD...
...líneas de la key...
...más líneas...
...fin de la key...
-----END PRIVATE KEY-----
```

### 3. Deploy

- Click en **Deploy**
- Espera el build (1-2 min)
- Verifica que sea verde ✅
- El sitio estará en `https://jdinamarcadev-c1f8b.vercel.app` (o similar)

**Si falla el build:**

1. Revisa las env vars (tienen que coincidir exactamente con `.env.local`)
2. Revisa el log de error en Vercel

---

## E3: Dominio `jdinamarca.dev`

### 1. Comprar dominio (si no lo tienes)

- Usar Namecheap, GoDaddy, o cualquier registrador
- Dominio: `jdinamarca.dev`

### 2. Añadir dominio en Vercel

1. Vercel → Project → Settings → Domains
2. Click en **Add Domain**
3. Ingresa `jdinamarca.dev` (sin www)
4. Click en **Add**

### 3. Configurar DNS en el registrador

Vercel te mostrará instrucciones DNS. Tienes dos opciones:

**Opción A: Usar nameservers de Vercel (recomendado)**

1. En el registrador, cambia los nameservers a los que Vercel muestra:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
2. Espera propagación (puede tardar 24-48 horas, usualmente 10-30 min)

**Opción B: Añadir A records**

Si prefieres mantener tus nameservers actuales:

1. Añade A records:
   - `@` → `76.76.21.21` (IPv4)
   - `www` → `76.76.21.21` (IPv4)
   - `@` → `2606:4700:4700::1111` (IPv6)
   - `www` → `2606:4700:4700::1001` (IPv6)

### 4. Esperar propagación + HTTPS

- Vercel detectará automáticamente los cambios DNS
- HTTPS se habilitará automáticamente (Let's Encrypt)
- Verifica que `https://jdinamarca.dev` carga con candado 🔒

---

## E4: Dominios autorizados en Firebase Auth

### 1. Ir a Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Proyecto: `jdinamarcadev-c1f8b`
3. Menú lateral → **Authentication** → **Settings** → **Authorized domains**

### 2. Añadir dominios autorizados

Click en **Add domain** y añade:

| Dominio | Estado |
|---|---|
| `jdinamarca.dev` | ⬜ |
| `*.vercel.app` | ⬜ |

### 3. Verificar login

- Ve a `https://jdinamarca.dev/admin`
- Intenta hacer login con Google
- Debería funcionar ✅

**Si falla el login:**

1. Revisa que `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` en Vercel sea `jdinamarcadev-c1f8b.firebaseapp.com`
2. Revisa que los dominios autorizados en Firebase sean correctos
3. Revisa la consola del navegador para errores de Firebase Auth

---

## Verificación final

- [ ] Site carga en `https://jdinamarca.dev` con HTTPS 🔒
- [ ] `/blog` muestra posts (si hay)
- [ ] `/admin` permite login con Google
- [ ] `/robots.txt` retorna el texto correcto
- [ ] `/sitemap.xml` retorna el XML correcto
- [ ] OG image se genera en `/opengraph-image`

---

## Troubleshooting

### Build falla en Vercel

- Verifica que todas las env vars están seteadas
- Revisa el log de error en la pestaña "Build"
- Compara con build local: `npm run build`

### Login no funciona

- Verifica `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` en Vercel
- Verifica dominios autorizados en Firebase Auth
- Verifica que el dominio `jdinamarca.dev` esté resuelto (DNS)

### Imágenes no cargan

- Verifica `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` en Vercel
- Verifica reglas de `storage.rules` (deben permitir lectura pública)

### Firestore error

- Verifica `firestore.rules` permitan lectura pública
- Verifica que los índices estén creados (ver sesión anterior)

---

## Post-deploy (opcional)

### Vercel Analytics

1. `npm i @vercel/analytics`
2. En `src/app/layout.tsx`, añadir:
   ```tsx
   import { Analytics } from "@vercel/analytics/react";

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="es">
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```
3. Deploy de nuevo

### Monitoreo de errores

- Configurar Vercel Log Drains (opcional)
- Considerar Sentry para tracking de errores en producción

---

## Referencias

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Auth Domains](https://firebase.google.com/docs/auth/web/start#set_up_auth_providers)

---

**¿Listo para hacer deploy?** Sigue las secciones E2 → E3 → E4 en orden.