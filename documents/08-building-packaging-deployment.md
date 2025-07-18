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

> `backend-service` is the service name we will define in `docker-compose.yml`.

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

## Optional: Connect Azure DevOps to Your Azure Subscription (same done in 5C - refer for more details)

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

1. Create an Azure repo (if not already)
2. Connect the Azure repo to Azure DevOps
3. Set up an Azure DevOps project + pipeline
4. Add a `azure-pipelines.yml` to build & push Docker images to ACR
5. Configure ACR credentials securely
6. Run pipeline and verify pushed images

---

### 5A. Prerequisites

* ✅ Azure DevOps account: [https://dev.azure.com/](https://dev.azure.com/)
* ✅ Azure Container Registry created (`myappregistry.azurecr.io`)
* ✅ Source code in GitHub or Azure Repos
* ✅ `docker-compose.yml`, Dockerfiles are already working

- For setting up source code in Azure repos, first create the Azure repo

* Go to [https://dev.azure.com](https://dev.azure.com)
* Open your project (e.g., `my-app-deployment`)
* Navigate to **Repos > Files**
* Choose - Push an existing repository from command line
```
git remote add origin https://<your-organization-name>@dev.azure.com/<your-organization-name>/my-app-deployment/_git/my-app-deployment
git push -u origin --all
```
- __NOTE__: The first `my-app-deployment` in the URL is the project name, and the second `my-app-deployment` in the URL is the repo name.

- Then follow these inside `my-app/` in order to set up the project as a Git project and push to the repo. Create a `.gitignore` file
```
# Ignore node_modules for both frontend and backend
node_modules/
**/node_modules/

# Logs
*.log
logs/
*.pid

# Environment files
.env
.env.local
.env.*

# OS-specific
.DS_Store
Thumbs.db

# Build output
**/dist/
**/build/
**/.angular/
**/coverage/
**/.next/
**/.turbo/
**/.vercel/

# Docker-related
**/*.local.yml
docker-compose.override.yml

# IDE-specific
.vscode/
.idea/
*.swp
```
- Next initialize `my-app` as a Git project
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://dev.azure.com/<org>/<project>/_git/<repo-name>
git push -u origin main
```
- You should now find your files in the Azure Devops project -> Repos -> Files.
#### Troubleshooting

##### If Prompted for Login

Azure DevOps will ask for credentials — use:

* Your **Microsoft account username/password**, OR
* Use **Personal Access Token (PAT)** as the password

To generate a PAT:

1. Go to [https://dev.azure.com](https://dev.azure.com)
2. Top-right → User menu → **"Personal access tokens"**
3. Create a new token (scopes: "Code (Read and write)")

Then use it in the terminal when prompted for a password.

---

__NOTE__: If you use GitHUb instead of Azure repos you need to connect GitHub Repo to Azure DevOps

1. Go to **Pipelines > Create Pipeline**
2. Choose **GitHub** as the source
3. Authorize Azure DevOps if prompted
4. Select your repository

---

### 5B. Create `azure-pipelines.yml` at the root of your repo

```
my-app/
├── backend/               # Express.js + MongoDB API
│   ├── Dockerfile
│   └── ...
├── frontend/              # Angular app
│   ├── Dockerfile
│   └── ...
├── docker-compose.yml     # (for local dev, optional but helpful)
├── azure-pipelines.yml    # (for building Docker images of the frontend and backend apps and push to ACR)
└── README.md
```

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

### 5C. Set Up Azure DevOps Service Connection to Azure (if not already done in the optional step in 4C)

1. In Azure DevOps → **Project Settings > Service Connections**
2. Click **New service connection > Azure Resource Manager**
3. Choose **Service principal (automatic)**, select your Azure subscription
4. Give it a name, e.g., `my-app-service-connection`
5. Grant access to the ACR resource group (used in `azureSubscription:` above) - i.e. `my-app-rg`

#### What is a Service Connection
A **Service Connection** in Azure DevOps is a **secure bridge between Azure DevOps and your Azure subscription or other external services**. It allows Azure Pipelines to **authenticate and perform operations in your Azure environment** (like deploying resources, pushing Docker images, or running CLI commands).  

In the context of your current setup (pushing Docker images to ACR and deploying to AKS):

#### **Why you need a Service Connection:**

| Purpose                          | Role of Service Connection                                    |
| -------------------------------- | ------------------------------------------------------------- |
| Push Docker images to ACR     | Authenticates `az acr login`, `docker push`, etc.             |
| Deploy to AKS                 | Authenticates access to your AKS cluster (`kubectl`, etc.)    |
| Use Azure CLI/ARM in pipeline | Grants Azure CLI/ARM template tasks permission to run actions |
| Provision Azure resources     | Enables Infra-as-Code setups (e.g., Bicep, Terraform)         |

---

#### 🔒 Security Benefits

* Uses a **Service Principal** under the hood with **scoped permissions**.
* You can restrict it to a **specific Resource Group**.
* It avoids exposing credentials in YAML or environment variables.

---

### 5D. One-Time Setup: Create Pipeline from Azure DevOps UI

1. Go to your Azure DevOps project
2. Click on **Pipelines > Pipelines**
3. Click **"New Pipeline"**
4. Choose **Azure Repos Git** (assuming you are using Azure Repos)
5. Select your repo (e.g., `my-app`/ `my-app-deployment`)
6. It will detect `azure-pipelines.yml` — click **"Continue"**
7. Click **"Run"** to trigger the first build
8. From now on, all future commits to `main` will trigger the pipeline automatically (thanks to this section in your YAML):

   ```yaml
   trigger:
     branches:
       include:
         - main
   ```

#### Troubleshooting
- You may see this error
```
##[error] No hosted parallelism has been purchased or granted. To request a free parallelism grant, please fill out the following form https://aka.ms/azpipelines-parallelism-request
```
Microsoft no longer grants free hosted build agents (parallelism) by default for newly created Azure DevOps organizations, even if you have free Azure credits. Azure Pipelines uses hosted agents to run your builds. For new orgs: You must request Microsoft to activate the free parallelism (hosted agents) even for public or personal projects.

##### ✅ How to Fix It

1. 📄 Go to this Microsoft request form:
   👉 [https://aka.ms/azpipelines-parallelism-request](https://aka.ms/azpipelines-parallelism-request)

2. Fill out the form with:

   * Your **DevOps organization name** (e.g. `https://dev.azure.com/your-org-name`)
   * State that you’re using it for **personal learning** or **non-commercial OSS**
   * Mention that you're using your **Azure free credits** and would like to enable the free hosted agent pool

3. Microsoft usually grants **1 free parallel job** within **a few hours to a day**

---

##### 🧭 What You Can Do Meanwhile

While waiting, you have 2 options:

---

###### Option A: **Run builds using a Self-hosted Agent (on your own machine)**

1. Go to **Project Settings > Agent Pools**
2. Click **Add pool → New agent pool** (e.g. `SelfHostedPool`)
3. Add an agent on your own machine:

   * Instructions: [https://learn.microsoft.com/en-us/azure/devops/pipelines/agents/v2-windows?view=azure-devops](https://learn.microsoft.com/en-us/azure/devops/pipelines/agents/v2-windows?view=azure-devops)
4. Use this pool in your YAML:

   ```yaml
   pool:
     name: SelfHostedPool
   ```

---

###### Option B: **Wait for the grant and retry the pipeline**

Once granted, you can simply trigger your pipeline again — no changes needed.

---

### 5E. Monitor Pipeline

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

---

## Step 6: Installing Kubernetes CLI tool `kubectl`
To interact with your Azure Kubernetes Service (AKS) cluster, you’ll need the Kubernetes CLI tool called `kubectl`. It may already be installed if you have installed Docker Desktop. You can check by running
```
kubectl version --client
```
- If not already present, go ahead and install

### How to Install `kubectl` (Kubernetes CLI)

#### For macOS (Homebrew):

```bash
brew install kubectl
```

To upgrade later:

```bash
brew upgrade kubectl
```

---

#### For Windows (Using Chocolatey):

```powershell
choco install kubernetes-cli
```

---

#### For Ubuntu/Debian:

```bash
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl

sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg

echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | \
sudo tee /etc/apt/sources.list.d/kubernetes.list

sudo apt-get update
sudo apt-get install -y kubectl
```

---

### Verify Installation

After installation, run:

```bash
kubectl version --client
```

---

## Step 7: Create Kubernetes YAML Files

You’ll need to create the following files inside a `k8s` folder at the root of your project:

```
my-app/
│
├── k8s/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── mongo-deployment.yaml
│   └── mongo-service.yaml
```

__NOTE__: Both .yml and .yaml are valid and supported file extensions for YAML files. They are functionally identical — it's purely a matter of convention and preference.  

However, in the Kubernetes ecosystem, the more common and widely used extension is .yaml.

---

### 1. `backend-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: <ACR_NAME>.azurecr.io/my-app-backend:<TAG>
          ports:
            - containerPort: 3000
          env:
            - name: MONGO_URL
              value: "mongodb://mongo:27017/mydb"
```

> Replace `<ACR_NAME>` with your ACR name and `<TAG>` with a tag like `latest` or `$(Build.BuildId)`.

---

### 2. `backend-service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
```

---

### 3. `frontend-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: <ACR_NAME>.azurecr.io/my-app-frontend:<TAG>
          ports:
            - containerPort: 80
          env:
            - name: BACKEND_URL
              value: "http://backend-service:3000/api"
```

---

### 4. `frontend-service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  type: LoadBalancer
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
```

---

### 5. `mongo-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongo
  template:
    metadata:
      labels:
        app: mongo
    spec:
      containers:
        - name: mongo
          image: mongo:8.0
          ports:
            - containerPort: 27017
          volumeMounts:
            - name: mongo-data
              mountPath: /data/db
          env:
            - name: MONGO_INITDB_ROOT_USERNAME
              value: root
            - name: MONGO_INITDB_ROOT_PASSWORD
              value: example
      volumes:
        - name: mongo-data
          emptyDir: {}
```

---

### 6. `mongo-service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mongo
spec:
  selector:
    app: mongo
  ports:
    - protocol: TCP
      port: 27017
      targetPort: 27017
```

---

### Notes

* These YAMLs use internal service names (like `backend-service`) for communication within the cluster.
* `frontend` is exposed as a **LoadBalancer**, making the Angular app accessible over the internet.

---

### Step 7 Checklist

1. Created the `k8s/` directory and added these 6 files.
2. Replaced the `<ACR_NAME>` and `<TAG>` placeholders.

---


## Step 8: Enable Kubernetes in Docker Desktop
Before proceeding let's verify that **Kubernetes is enabled** in Docker Desktop and your local cluster is ready for Step 9.

---

## 1. Check if Kubernetes is Enabled in Docker Desktop

### Option A: GUI Check

1. Open **Docker Desktop**
2. Go to **Settings > Kubernetes**
3. Make sure:

   * **"Enable Kubernetes"** is checked
   * Wait for the **Kubernetes status** to say "Running" (Bottom-left corner with Kubernetes icon turns green).

If it's not checked, enable it and click **Apply & Restart**. It might take a few minutes.

---

## 2. Check via CLI

You can also verify from terminal:

```sh
kubectl cluster-info
```

### Expected Output:

```
Kubernetes control plane is running at https://localhost:6443
CoreDNS is running at ...
```

If you get an error like:

```
The connection to the server localhost:8080 was refused
```

→ it means Kubernetes is **not yet enabled**.

---

## ✅ 3. Optional: Check Current Context

Make sure the active context points to Docker Desktop:

```sh
kubectl config current-context
```

### Expected:

```
docker-desktop
```

---

## ✅ Summary

| Step                         | Expected ✅                         |
| ---------------------------- | ---------------------------------- |
| Docker Desktop is running    | Yes                                |
| Kubernetes is enabled        | "Running" status in Docker Desktop |
| `kubectl cluster-info` works | Shows API Server address           |
| Current context is correct   | `docker-desktop`                   |


## Step 9: Running the app in a Kubernetes cluster locally
You can now:
* Deploy apps (`kubectl apply -f`)
* Create services, volumes, and ingress controllers
* Simulate production setup — right from your system

### Apply MongoDB Deployment & Service YAML

Let's proceed with deploying your MongoDB service to the local cluster. From the `my-app` folder
```bash
kubectl apply -f k8s/mongo-deployment.yaml
kubectl apply -f k8s/mongo-service.yaml
```

Once applied, verify that it’s running:

```bash
kubectl get pods
kubectl get services
```

You should see:

* A pod like `mongo-xxxxxxx` with `STATUS: Running`
* A service `mongo` exposing port `27017` (typically as a **ClusterIP**)

---

## Step 10: Create a `backend-config.yaml` Kubernetes ConfigMap:

This will provide the `MONGO_URL` environment variable to the container.

```yaml
# k8s/backend-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: backend-config
data:
  MONGO_URL: mongodb://mongo:27017/myapp
```

> This uses the name `mongo` which is the **service name** — Kubernetes resolves that to the Pod IP automatically.

- Reference this ConfigMap in your backend deployment:

In `backend-deployment.yaml`, under the container spec:

```yaml
envFrom:
  - configMapRef:
      name: backend-config
```

So the full container spec might look like this:

```yaml
containers:
  - name: backend
    image: myapp-backend:dev
    ports:
      - containerPort: 3000
    envFrom:
      - configMapRef:
          name: backend-config
```

- Apply the ConfigMap:

```bash
kubectl apply -f k8s/backend-config.yaml
```

Then apply or re-apply your backend deployment.
```bash
kubectl apply -f k8s/backend-deployment.yaml
```
This will create the backend Pod, using the config from the ConfigMap you just applied

- This will fail to pull the `my-app-backend` image from ACR as the image is private. You need to either provide the Kubernetes cluster **credentials** to access it or make it public (not recommended).
- Option 1 is explained below - start from Step 2 if already logged in. For brevity we choose Option 2  and make the image public (in the Azure web app).

Let's walk through how to **create an Azure service principal**, **grant it access to ACR**, and **use it to create a Kubernetes image pull secret** so your local cluster can pull from your private Azure Container Registry (ACR).

---

### ✅ Step-by-Step: Enable Kubernetes to Pull from Private ACR

---

#### 🔐 **Step 1: Log in to Azure CLI**

Make sure you're logged in and your subscription is selected:

```bash
az login
az account set --subscription "<YOUR_SUBSCRIPTION_ID_OR_NAME>"
```

---

#### 🆔 **Step 2: Create Service Principal for ACR Access**

```bash
az ad sp create-for-rbac \
  --name my-acr-pull-sp \
  --role acrpull \
  --scopes $(az acr show --name <ACR_NAME> --query id --output tsv)
```

* Replace `<ACR_NAME>` with your ACR name (e.g., `myappregistry`)
* This will output:

```json
{
  "appId": "xxxx-xxxx-xxxx",
  "displayName": "my-acr-pull-sp",
  "password": "xxxx-xxxx-xxxx",
  "tenant": "xxxx-xxxx-xxxx"
}
```

Copy these values — you’ll need them in the next step.

---

#### 🔑 **Step 3: Create Kubernetes Secret**

Run this from your terminal (still within the same project directory):

```bash
kubectl create secret docker-registry acr-secret \
  --docker-server=<ACR_NAME>.azurecr.io \
  --docker-username=<appId> \
  --docker-password=<password> \
  --docker-email=any@example.com
```

* Replace:

  * `<ACR_NAME>` = your registry name
  * `<appId>` and `<password>` = from previous step
  * email = dummy is fine

✅ This secret will now let Kubernetes pull private images from your ACR.

---

#### 📝 **Step 4: Patch `backend-deployment.yaml`**

Update your `spec.template.spec` to include:

```yaml
      imagePullSecrets:
        - name: acr-secret
```

Example:

```yaml
spec:
  containers:
    - name: backend
      image: myappregistry.azurecr.io/my-app-backend:latest
      ports:
        - containerPort: 3000
  imagePullSecrets:
    - name: acr-secret
```

---

#### 🚀 **Step 5: Re-apply the deployment**

```bash
kubectl apply -f k8s/backend-deployment.yaml
```

### Summary

| What changed?                     | Why?                                    |
| --------------------------------- | --------------------------------------- |
| Used `MONGO_URL` from environment | Better portability                      |
| Used ConfigMap to set it          | Kubernetes-native way to configure apps |


Here’s a quick summary of what’s working so far:

| Component        | Status    | Notes                                        |
| ---------------- | --------- | -------------------------------------------- |
| **MongoDB Pod**  | ✅ Running | Service name: `mongo`, ClusterIP only        |
| **Backend Pod**  | ✅ Running | Connected to Mongo via ConfigMap `MONGO_URL` |
| **K8s Services** | ✅ OK      | `mongo` service reachable inside the cluster |

---

### ✅ Next Step (Optional, but useful for testing):

To confirm the backend is **really connected and working**, you can **temporarily expose** it via a `NodePort` or `LoadBalancer` service and test the API.

Here's an example `backend-service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
  type: ClusterIP  # Or use NodePort for local and LoadBalancer if on cloud (no need for forwarding step below, but not portable for different environments)
```

Then:
```bash
kubectl apply -f k8s/backend-service.yaml
```
Run:
```bash
kubectl get services
```
- For local testing, port-forward like this (no YAML change):
```bash
kubectl port-forward svc/backend-service 3000:3000
```
- Just press Ctrl+C in the terminal to terminate the port forwarding.
- Or, run it as a background service (Linux/Mac way shown below)
```bash
kubectl port-forward svc/backend-service 3000:3000 &
```
- Note the PID to kill it later in this case.
- Test with a request (Or simply open the above URL in the browser to get the response from the backend)
```
curl http://localhost:3000/api/hello
```

---

Since your backend and MongoDB are up and running locally in Kubernetes, let’s now proceed to __Deploy the Frontend to Kubernetes__.

### Create Frontend Deployment and Service YAMLs
- Add the Kubernetes secret `spec.template.spec.imagePullSecret` to `frontend-deployment.yaml` so that the image can be pulled from your private ACR
```yaml
imagePullSecrets:
    - name: acr-secret
```
- Apply the frontend deployment and service

```bash
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```
- Visit `http://localhost` in the browser to see the app running!
- __Note__: Not sure if this is needed (may work without it) - if above does not work, try setting this.
```bash
kubectl port-forward svc/frontend 4200:80
```

At this point, you should have:

* ✅ **MongoDB pod and service** running
* ✅ **Backend pod and service** successfully deployed and connecting to Mongo
* ✅ **Frontend pod and service** serving the app and forwarding requests to backend

---

## Step 11: Deploying your setup to Azure Kubernetes Service (AKS) with monitoring and diagnostics support

#### **Step 11A: Create AKS Cluster**

You need to register to use the **`Microsoft.OperationalInsights`**, **`Microsoft.Insights`** resource provider, which is required for **Azure Monitor and AKS diagnostics**.

Run these commands in your terminal (replace with your subscription ID if needed), and __wait for the registrations to complete__.

```bash
az provider register --namespace Microsoft.OperationalInsights
az provider register --namespace Microsoft.Insights
```

You can also register other providers like:

```bash
az provider register --namespace Microsoft.ContainerService
az provider register --namespace Microsoft.Network
az provider register --namespace Microsoft.Compute
```

These are commonly required when working with AKS.

- Wait a Few Seconds, Then Check Status for the provider registrations. For eg. for `Microsoft.OperationalInsights`

```bash
az provider show --namespace Microsoft.OperationalInsights --query "registrationState"
```

When it shows __Registered__ you are ready to move on to the next step.

- Generate an SSH key that helps connect to the cluster (the following works in Linux, Mac - check how to do the same for Windows)
```bash
cd ~/.ssh
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
- Name the key as azure - 2 files are generated (public `azure.pub` and private key `azure`). Keep the private key with 400 permissions (check `chmod` command for the same).

- Now create the cluter

```bash
az aks create \
  --resource-group my-app-rg \
  --name myAKSCluster \
  --location eastus \
  --node-count 1 \
  --node-vm-size Standard_B2s \
  --enable-addons monitoring \
  --ssh-key-value ~/.ssh/azure.pub \
  --attach-acr myappregistry
```

#### **Step 2: Get AKS Credentials**

```bash
az aks get-credentials --resource-group my-app-rg --name myAKSCluster
```

> This merges AKS kubeconfig with your local `kubectl` configuration.

- Confirm You're Now Targeting AKS
```bash
kubectl config get-contexts
```
You’ll see a list — make sure the one with the * (current) is the AKS one (e.g., `myAKSCluster`).
- Or you can also check
```bash
kubectl config current-context
```

#### **Step 3: Create ACR Pull Permissions for AKS**

__NOTE__: This step may not be necessary as the ACR was attached at the time of cluster creation - If using private ACR

```bash
az aks update \
  --name myAKSCluster \
  --resource-group my-app-rg \
  --attach-acr myAppRegistry
```

#### **Step 4: Apply K8s YAMLs**

Use the same YAMLs you've already created:

```bash
kubectl apply -f k8s/
```
- This is the same as
```bash
kubectl apply -f k8s/mongo-deployment.yaml
kubectl apply -f k8s/mongo-service.yaml
kubectl apply -f k8s/backend-config.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

Once pods are in Running state, confirm frontend is reachable:
```bash
kubectl get svc frontend
```
Look for the `EXTERNAL-IP`, and open that IP in your browser.

---

## Step 12: Monitoring and Logging with Azure Monitor

Let's now set up **monitoring and logging** for your AKS cluster. Azure provides a native integration with **Azure Monitor**, which includes:

* **Container Insights** for visualizing pod health, CPU/memory usage, and more.
* **Log Analytics Workspace** for querying logs from your containers, nodes, and Kubernetes control plane.

---

- Create a Log Analytics Workspace (if you don't already have one)

```bash
az monitor log-analytics workspace create \
  --resource-group my-app-rg \
  --workspace-name myLogAnalyticsWS
```

- Enable monitoring for your AKS cluster

```bash
az aks enable-addons \
  --resource-group my-app-rg \
  --name myAKSCluster \
  --addons monitoring \
  --workspace-resource-id $(az monitor log-analytics workspace show \
      --resource-group my-app-rg \
      --workspace-name myLogAnalyticsWS \
      --query id -o tsv)
```

This will:

* Automatically install the **OMS Agent** to collect logs/metrics.
* Send logs to the Log Analytics Workspace.

---

- View Logs and Metrics

#### Pod and Container Logs

* Go to Azure Portal → **Monitor** → **Logs**
* Select your Log Analytics Workspace
* Use a Kusto query like:

```kusto
ContainerLog
| where TimeGenerated > ago(1h)
| where LogEntry contains "error"
```

#### Cluster and Node Metrics

* Go to AKS resource → **Insights** (left pane)
* Use the **Workbooks**, **Live Metrics**, and **Performance** tabs

---

### Optional: Set Alerts (e.g., pod restart count, CPU > 80%)

Example:

```bash
az monitor metrics alert create \
  --name "HighCPUAlert" \
  --resource-group myResourceGroup \
  --scopes $(az aks show -g myResourceGroup -n myAKSCluster --query id -o tsv) \
  --condition "avg ContainerCPUUsage > 80" \
  --description "CPU usage high in AKS containers"
```
---


## Step 13: **Overview of enabling SonarQube rules, tracking issues, and managing issue resolution/closure**
This is useful if you're integrating SonarQube into a CI/CD pipeline (like Azure DevOps) or doing manual reviews.

### 1. **Understanding SonarQube Rules**

SonarQube detects issues in your code using a set of **rules** defined per language (Java, JavaScript, Python, etc.).

* Each **rule** represents a best practice, bug risk, code smell, or security hotspot.
* Rules are grouped under a **Quality Profile**.
* A **Quality Profile** defines which rules are active for a given language.

🔹 Example rule: *"Files should not have too many lines of code."*
🔹 Example type: `Bug`, `Vulnerability`, `Code Smell`, `Security Hotspot`.

---

### 2. **Enabling and Customizing Rules**

You can enable/disable rules per language via the **Quality Profiles**:

#### Steps:

1. Log in to SonarQube (http\://<your-sonarqube-host>)
2. Go to **Quality Profiles** (top menu)
3. Select the language (e.g., JavaScript)
4. Select a profile (e.g., `Sonar way`)
5. Click on **"Activate More Rules"** or **"Deactivate"** existing rules as needed

💡 Tip: You can also **create a custom Quality Profile** based on the default and assign it to your project.

---

### 3. **Issue Detection and Tracking**

When you scan your code using `sonar-scanner` or integrate it into a CI pipeline:

* Issues are detected and categorized (Bug, Code Smell, Vulnerability).
* Each issue includes:

  * Description
  * Severity (`BLOCKER`, `CRITICAL`, `MAJOR`, `MINOR`, `INFO`)
  * Rule key
  * Suggested fix

Issues can be viewed by:

* Project Dashboard → **Issues** tab
* Filters: By severity, rule, status, assignee, etc.

---

### 4. **Issue Lifecycle and Closure**

Each issue has a **status**:

* `Open` – Newly detected issue.
* `Confirmed` – Validated by a developer or reviewer.
* `Resolved` – Marked as fixed (in the next analysis, it's checked again).
* `Closed` – No longer considered an issue (either truly fixed or marked as “Won’t Fix” / “False Positive”).

#### Actions You Can Perform:

* **Assign** issues to a developer.
* **Comment** on an issue (for audit trail or discussion).
* **Mark as**:

  * ✔️ `Fixed` – If you’ve fixed it in code.
  * ❌ `False Positive` – Legit code that violates the rule.
  * 🚫 `Won’t Fix` – Acknowledge the issue, but choose not to fix.

💡 You can also configure **issue exclusions** or **suppress warnings** in code using comments (language-specific).

---

### 5. **Tracking Over Time**

* The **"Measures" tab** shows trends in code quality, debt ratio, and issue types.
* The **"Leak Period"** helps focus on **new code issues** introduced since the last version.

---

### Integrations

* SonarQube integrates with **Azure DevOps**, **GitHub**, **GitLab**, etc.
* You can configure **pull request decoration** and **fail builds on quality gate failure**.

---

### Want a Summary?

* **Rules** define what to check (quality gates use rules).
* **Quality Profile** is the collection of rules applied to a project.
* **Issues** are violations detected per rule.
* **Statuses** like *open*, *confirmed*, *resolved*, *closed* help manage the issue life cycle.

---

