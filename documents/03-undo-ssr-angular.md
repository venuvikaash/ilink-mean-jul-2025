
# Undo SSR in an Angular Application

If you’ve set up Server-Side Rendering (SSR) in your Angular app and wish to undo it, you’ll need to remove all SSR-specific configurations, dependencies, and code changes. Follow these steps:

---

## **Step 1: Remove SSR Dependencies**
SSR typically involves dependencies like `@nguniversal/express-engine`. Remove them using the following command:

```bash
npm uninstall @nguniversal/express-engine @nguniversal/builders express
```

---

## **Step 2: Delete SSR-Specific Files**
Remove all files and folders created during the SSR setup:

1. **`server.ts`**
   - This file contains the Express server logic for SSR. Delete it.

2. **SSR entry point** (e.g., `main.server.ts`):
   - This is the file that bootstraps your server-side Angular app. Delete it.

3. **SSR folder** (optional):
   - If you created an SSR-specific folder, such as `src/ssr`, remove it.

---

## **Step 3: Revert Angular Configuration**
1. Open `angular.json` and remove the SSR-specific configurations:
   - Locate and delete the `server` target under your app configuration.
   - Remove any references to `server.ts` or `main.server.ts`.

**Example:**
```json
"server": {
  "builder": "@angular-devkit/build-angular:server",
  "options": {
    "outputPath": "dist/your-app-name-server",
    "main": "src/main.server.ts",
    "tsConfig": "tsconfig.server.json"
  }
}
```

2. Remove SSR-specific output paths and builders.

---

## **Step 4: Revert TypeScript Configuration**
Delete SSR-specific TypeScript files or configurations:

1. **`tsconfig.server.json`:**
   - Remove this file.
   
2. Update `tsconfig.app.json` if any SSR-related entries were added.

---

## **Step 5: Update Your `package.json`**
1. Remove SSR-related scripts:
   - Look for scripts like `build:ssr` or `serve:ssr` and delete them.

2. Revert the `start` script to its original form if it was changed:
   ```json
   "start": "ng serve"
   ```

---

## **Step 6: Cleanup Build Artifacts**
Run the following command to clean up any SSR-specific build artifacts:

```bash
rm -rf dist
```

---

## **Step 7: Verify and Test the Application**
1. Run your application in development mode to ensure everything works:
   ```bash
   ng serve
   ```

2. Build your application to confirm the removal of SSR:
   ```bash
   ng build
   ```

---

Follow these steps to fully revert your Angular app from SSR back to a standard client-side rendered app.
