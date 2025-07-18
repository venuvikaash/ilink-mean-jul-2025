# What is Kubernetes?

You're working with containerized Angular and Express apps, and Kubernetes enters the picture as the **next-level orchestrator** for running those containers **reliably and at scale**.

---

## 🧠 What is **Kubernetes**?

**Kubernetes (K8s)** is an open-source system for automating:

* **Deployment**
* **Scaling**
* **Monitoring**
* **Management**
  of **containerized applications**.

Think of it like the **brain** that tells containers:

* *“Start here”*, *“restart that if it crashes”*, *“scale to 5 instances”*, *“expose this on port 80”*, etc.

---

## 🧱 What is a **Kubernetes Cluster**?

A **Kubernetes cluster** is a group of machines (**nodes**) that run your containerized apps, managed by the Kubernetes system.

It has two main parts:

| Part              | Description                                                            |
| ----------------- | ---------------------------------------------------------------------- |
| **Control Plane** | The "manager" — makes decisions (scheduling, scaling, healing)         |
| **Worker Nodes**  | Where your actual app containers run (Angular, Express, MongoDB, etc.) |

You interact with the cluster via the CLI tool `kubectl`.

---

## When should we Run Kubernetes **Locally**?

To:

* Test your app **before** deploying to the cloud
* Simulate the full setup: multiple containers (frontend, backend, database)
* Learn how Kubernetes handles services, networking, volumes, etc.

### Local options include:

* **Docker Desktop (with Kubernetes)** — all-in-one setup for Mac/Windows
* **Minikube** — a lightweight VM-based cluster
* **kind** — Kubernetes in Docker

### Pod vs Cluster
| Component   | Role                                                     |
| ----------- | -------------------------------------------------------- |
| **Pod**     | Runs your container (e.g., MongoDB or Express.js app)    |
| **Service** | Exposes that Pod (to other pods or to the outside world) |
