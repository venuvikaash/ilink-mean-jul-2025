## **Step 1: Set up Angular + Express + MongoDB App Locally**

We will prepare a monorepo-style structure (or two separate folders) to keep both apps organized.

### Project Directory Structure

```
my-app/
├── backend/               # Express.js + MongoDB API
│   ├── Dockerfile
│   └── ...
├── frontend/              # Angular app
│   ├── Dockerfile
│   └── ...
├── docker-compose.yml     # (for local dev, optional but helpful)
└── README.md
```

- Create the project directory and switch to it
```bash
mkdir my-app
cd my-app
```

### 1A. **Set up Angular App (`frontend/`)**

```bash
ng new frontend --routing --style=scss
cd frontend
ng serve
```
Choices  
    ✔ Do you want to create a 'zoneless' application without zone.js (Developer Preview)? No  
    ✔ Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? No  

Add a sample HTTP call to the backend (will configure proxy later). In `frontend/src/app/app.config.ts`
```ts
import { provideHttpClient } from '@angular/common/http';
```
```ts
export const appConfig: ApplicationConfig = {
  providers: [
    // other configuration...
    // ...
    provideHttpClient()
  ]
};
```
- In `frontend/src/app/app.ts`
```ts
import { HttpClient } from '@angular/common/http';
```
```ts
constructor(private http: HttpClient) {
  http.get('/api/hello').subscribe(console.log);
}
```

### 1B. **Set up Express.js Backend (`backend/`)**

- In the project folder (`my-app`) create the backend folder
```bash
mkdir backend && cd backend
npm init -y
npm install express mongoose cors
```

Create the following:

**`backend/index.js`:**

```js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

Run with:

```bash
node index.js
```

### 1C. **Verify Everything Works Locally**

1. Backend: Visit [http://localhost:3000/api/hello](http://localhost:3000/api/hello) → You should see JSON response.
2. Frontend:

   * Setup a proxy for development.

**`frontend/proxy.conf.json`:**

```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false
  }
}
```

###  The Proxy Solution

Instead of Angular calling:

```
http://localhost:3000/api/hello
```

You just write in your Angular code:

```ts
this.http.get('/api/hello')
```

Then the **Angular dev server intercepts** requests starting with `/api` and **forwards them to `http://localhost:3000/api`**.

---

- Update `angular.json`:

```json
"serve": {
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}
```

This tells the Angular dev server:

> “When I run `ng serve`, use `proxy.conf.json` to forward matching requests.”

This allows you to just run:

```bash
ng serve
```

Without having to specify the proxy config manually every time.

---

- Now run Angular again

```bash
ng serve
```

3. Check browser console → It should log the response from the backend.

### ✅ Step 1 Checklist

* [ ] Angular app can run locally and call Express API.
* [ ] Express server connects to MongoDB and responds to `/api/hello`.

---

## **Step 2: Dockerizing Angular and Express Apps**

We'll now:

1. Create a production-ready Angular build.
2. Dockerize the Angular frontend using NGINX.
3. Dockerize the Express backend.
4. Optionally use `docker-compose` for local testing.

---

### 2A. Dockerize Angular App

> The goal is to serve the Angular production build via NGINX in a Docker container.

#### `frontend/Dockerfile`

```Dockerfile
# Stage 1: Build Angular app
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve with NGINX
FROM nginx:1.25-alpine

COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Create `nginx.conf` in `frontend/`

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

> `backend` is the service name we will define in `docker-compose.yml`.

---

### 2B. Dockerize Express Backend

#### `backend/Dockerfile`

```Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["node", "index.js"]
```

---

### 2C. Create `docker-compose.yml` (root folder)

This helps us test the whole stack locally (frontend, backend, and MongoDB). In `my-app/docker-compose.yml`

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    depends_on:
      - mongo
    environment:
      - MONGO_URL=mongodb://mongo:27017/myapp
    networks:
      - app-net

  frontend:
    build: ./frontend
    ports:
      - "4200:80"
    depends_on:
      - backend
    networks:
      - app-net

  mongo:
    image: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - app-net

networks:
  app-net:
    driver: bridge

volumes:
  mongo-data:
```

> The backend must use `process.env.MONGO_URL` to connect to MongoDB in production. In `backend/index.js`, update the connection line to

```js
mongoose.connect(
  process.env.MONGO_URL || 'mongodb://localhost:27017/myapp',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);
```

---

### 2D. Test It Locally

Make sure you have [Docker Desktop installed](https://www.docker.com/) and the Docker daemon (server) is up and running (after installing if not present). Then in root directory (`my-app`). When running this make sure the ports that the apps are trying to bind to in the host machine are free (`3000`, `4200`, `27017`). You may have to stop the frontend, backend apps, and the local MongoDB service on the host (if running).

```bash
docker-compose up --build
```

Now open:

* Angular app → [http://localhost:4200](http://localhost:4200)
* API call `/api/hello` → proxied to backend
* MongoDB runs in container

---

### ✅ Step 2 Checklist

* [ ] Angular app is dockerized and served via NGINX.
* [ ] Express backend is dockerized and connects to MongoDB.
* [ ] `docker-compose` connects everything together.
* [ ] App works at [http://localhost:4200](http://localhost:4200) and loads data from `/api`.

---

## **Step 3: Push Docker Images to Azure Container Registry (ACR)**

This step will walk you through:

1. Creating an Azure Container Registry
2. Tagging and pushing your Docker images to ACR
3. Updating `docker-compose.yml` to use ACR-hosted images

Before you begin you must create an [Azure account](https://azure.microsoft.com/en-in/pricing/purchase-options/azure-account) and [install Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) on your system. If you are new to Azure you can sign up (needs validation with a credit card but not charged) for US $200 free credit in your account.

---

### 3A. Create Azure Container Registry (ACR)

You can do this via CLI or Azure Portal. We'll use the CLI for repeatability.

#### Step 1: Log in to Azure

```bash
az login
```
- __Note__: You should be aware of your tenant and subscription name / id, as you need to provide them at login.

#### Step 2: Create Resource Group

```bash
az group create --name my-app-rg --location eastus
```

#### Step 3: Create ACR
The Azure subscription has to enable the `Microsoft.ContainerRegistry` resource provider — which is required to create an Azure Container Registry (ACR). This is a one-time setup (it needs to be done if not already done for your Azure subscription).
```
az provider register --namespace Microsoft.ContainerRegistry
```
- It takes some time for this registration process to complete. Wait for some time before proceeding. You can monitor progress of the registration using
```bash
az provider show -n Microsoft.ContainerRegistry
```
- Check the `registrationStatus` field in the output. Wait till it becomes __Registered__.

Now create the ACR registry.
```bash
az acr create --name myAppRegistry --resource-group my-app-rg --sku Basic --admin-enabled true
```

> Replace `myAppRegistry` with a **globally unique name** (e.g. `myAppRegistry1234`). This becomes your registry's domain like: `myAppRegistry.azurecr.io`

⚠️ __Note__: When you run this you are provisioning a Basic-tier ACR, which is billable — but minimal. For Basic-tier charges are ~$0.167/day (≈ $5/month). Charges begin immediately upon creation, even if you don’t push anything. You can always delete it when not in use:

```bash
az acr delete --name myAppRegistry --resource-group my-app-rg
```
> Do not forget to replace `myAppRegistry` with the **globally unique name** (e.g. `myAppRegistry1234`) you registered with!

⚠️ __IMPORTANT__: It goes without saying - henceforth all reference to `myAppRegistry` have to be replaced with the name of the registry you created.

---

### 3B. Log in to ACR and Tag Images

#### Step 1: Get login server name

```bash
az acr show --name myAppRegistry --query loginServer --output tsv
```

Suppose it outputs:

```
myappregistry.azurecr.io
```

#### Step 2: Log in to ACR with Docker

```bash
az acr login --name myAppRegistry
```

---

### 3C. Tag and Push Images

#### Tag Angular and Backend Images

```bash
docker tag my-app-frontend myappregistry.azurecr.io/my-app-frontend:latest
docker tag my-app-backend myappregistry.azurecr.io/my-app-backend:latest
```

#### Push Images to ACR

```bash
docker push myappregistry.azurecr.io/my-app-frontend:latest
docker push myappregistry.azurecr.io/my-app-backend:latest
```

---

### 3D. Optional: Update `docker-compose.yml` for Production Use

If you are planning to deploy via Kubernetes (AKS), you **don't need to change compose right now**. But for testing locally using the images pushed to Azure registry you can do so.

```yaml
frontend:
  image: myappregistry.azurecr.io/my-app-frontend:latest
  ports:
    - "4200:80"
  depends_on:
    - backend

backend:
  image: myappregistry.azurecr.io/my-app-backend:latest
  ports:
    - "3000:3000"
  environment:
    - MONGO_URL=mongodb://mongo:27017/myapp
  depends_on:
    - mongo
```

- Make sure you're logged in to ACR first
```bash
az acr login --name myAppRegistry
```
- Then run the app
```bash
docker-compose up
```
➡️ Docker will now pull images from ACR, not build them locally!

---

### ✅ Step 3 Checklist

* [ ] ACR created and accessible
* [ ] Docker images tagged and pushed
* [ ] Able to pull images from ACR

---

## Step 4: Create Azure DevOps Account
To create an **Azure DevOps account** and start using [https://dev.azure.com/](https://dev.azure.com/), follow these steps. These steps is likely already set up for your organization / teams.

### Step 4A: Sign in with a Microsoft Account

1. Go to: [https://dev.azure.com](https://dev.azure.com)
2. Click **"Sign in"**
3. Use a **Microsoft account** (e.g., `@outlook.com`, `@hotmail.com`, or any email registered with Microsoft)

   * If you don’t have one, click **"Create one!"**


### Step 4B: Set Up Your First Organization

After signing in:

1. You'll be prompted to **create an organization**
2. Enter:

   * **Organization name** (must be unique across Azure DevOps)
   * **Region** (choose one close to your location)
3. Click **Continue**

🔁 You'll now be taken to:
`https://dev.azure.com/<your-organization-name>`

---

### Step 4C: Create a Project

1. Click **"New Project"**
2. Enter:

   * **Project name** (e.g., `my-app-deployment`)
   * Visibility: Leave as **Private**
3. Click **Create**

This will create a project with boards, repos, pipelines, etc.

---

## Optional: Connect Azure DevOps to Your Azure Subscription

To use pipelines for ACR/AKS deployments:

1. Go to **Project Settings > Service connections**
2. Click **"New service connection"**
3. Choose **Azure Resource Manager**
4. Use **Service Principal (automatic)** if you're the owner of the Azure account

---

## What You Get with Azure DevOps

| Capability             | Description                                                              |
| ---------------------- | ------------------------------------------------------------------------ |
| **Azure Repos**      | Git repositories with branch policies, pull requests, and code reviews   |
| **Azure Pipelines**  | Build, test, and deploy your app automatically using CI/CD pipelines     |
| **Azure Boards**     | Agile project tracking: Kanban boards, backlogs, user stories, sprints   |
| **Azure Artifacts**  | Host and share package feeds (npm, NuGet, Maven, Python) with versioning |
| **Azure Test Plans** | Manual and automated test case management (more useful for QA teams)     |

---

## **Step 5: Set Up Azure Pipelines for Build & Push to ACR**

### What We'll Do

1. Create a GitHub repo (if not already)
2. Connect GitHub to Azure DevOps
3. Set up an Azure DevOps project + pipeline
4. Add a `azure-pipelines.yml` to build & push Docker images to ACR
5. Configure ACR credentials securely
6. Run pipeline and verify pushed images

---

### 4A. Prerequisites

* ✅ Azure DevOps account: [https://dev.azure.com/](https://dev.azure.com/)
* ✅ Azure Container Registry created (`myappregistry.azurecr.io`)
* ✅ Source code in GitHub or Azure Repos
* ✅ `docker-compose.yml`, Dockerfiles are already working

---

### 4B. Create a Pipeline in Azure DevOps

#### Step 1: Create an Azure DevOps Project

1. Go to [https://dev.azure.com](https://dev.azure.com)
2. Click **New Project**
3. Name it something like `my-app-deployment`

---

#### Step 2: Connect GitHub Repo to Azure DevOps

1. Go to **Pipelines > Create Pipeline**
2. Choose **GitHub** as the source
3. Authorize Azure DevOps if prompted
4. Select your repository

---

### 4C. Create `azure-pipelines.yml` at the root of your repo

```yaml
trigger:
  branches:
    include:
      - main

variables:
  ACR_NAME: myappregistry
  IMAGE_TAG: $(Build.BuildId)

stages:
  - stage: BuildAndPush
    jobs:
      - job: DockerBuild
        displayName: Build and Push Docker Images
        pool:
          vmImage: ubuntu-latest
        steps:
          - task: AzureCLI@2
            inputs:
              azureSubscription: '<YOUR-AZURE-SERVICE-CONNECTION-NAME>'
              scriptType: bash
              scriptLocation: inlineScript
              inlineScript: |
                az acr login --name $ACR_NAME

                echo "Building frontend..."
                docker build -t $ACR_NAME.azurecr.io/my-app-frontend:$(IMAGE_TAG) ./frontend
                docker push $ACR_NAME.azurecr.io/my-app-frontend:$(IMAGE_TAG)

                echo "Building backend..."
                docker build -t $ACR_NAME.azurecr.io/my-app-backend:$(IMAGE_TAG) ./backend
                docker push $ACR_NAME.azurecr.io/my-app-backend:$(IMAGE_TAG)
```

---

### 4D. Set Up Azure DevOps Service Connection to Azure

1. In Azure DevOps → **Project Settings > Service Connections**
2. Click **New service connection > Azure Resource Manager**
3. Choose **Service principal (automatic)**, select your Azure subscription
4. Give it a name, e.g., `my-azure-connection`
5. Grant access to the ACR resource group (used in `azureSubscription:` above)

---

### 4E. Commit and Push the Pipeline File

Commit `azure-pipelines.yml` to the root of your GitHub repo. Azure DevOps will automatically trigger a build (because of the `trigger:`).

---

### 4F. Monitor Pipeline

1. Go to **Pipelines > \[Your Pipeline Name]**
2. Monitor the output
3. If successful, verify on ACR:

```bash
az acr repository list --name myappregistry --output table
```

---

## Summary

| Task                            | Status |
| ------------------------------- | ------ |
| Connect GitHub to DevOps        | ✅      |
| Define `azure-pipelines.yml`    | ✅      |
| Create Azure service connection | ✅      |
| Build & push to ACR via CI      | ✅      |

