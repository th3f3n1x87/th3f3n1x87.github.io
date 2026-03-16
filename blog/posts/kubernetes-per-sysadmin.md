---
title: Kubernetes per SysAdmin: da Zero a Cluster
date: 2026-03-10
author: Valerio Simeraro
tags: [kubernetes, devops, containers, linux]
---

# Kubernetes per SysAdmin: da Zero a Cluster

Se sei un sistemista con esperienza su Linux e vuoi capire Kubernetes **senza il solito marketing**, sei nel posto giusto.
Niente "trasformazione digitale". Solo tecnica.

---

## Cos'è Kubernetes (davvero)?

Kubernetes (K8s) è un **orchestratore di container**: gestisce il ciclo di vita, la scalabilità e la disponibilità dei tuoi container in modo completamente automatico.

> _"Descrivi lo stato che vuoi, Kubernetes ci pensa a mantenerlo."_

La differenza con Docker standalone è enorme: con K8s non gestisci i container **uno ad uno**, ma gestisci il **desired state** del tuo sistema intero.

---

## Architettura Core

Un cluster Kubernetes è composto da:

### Control Plane (ex Master)
| Componente | Ruolo |
|---|---|
| `api-server` | Punto de entrata per ogni comando `kubectl` |
| `etcd` | Database distribuito: la "memoria" del cluster |
| `scheduler` | Decide su quale nodo girare nuovi pod |
| `controller-manager` | Mantiene lo stato desiderato (es. replica pod crashati) |

### Worker Nodes
| Componente | Ruolo |
|---|---|
| `kubelet` | Agente su ogni nodo, riceve ordini dall'API server |
| `kube-proxy` | Gestisce il networking dei pod |
| Container Runtime | Docker, containerd, CRI-O |

---

## Il Pod: l'Unità Base

Non esiste il concetto di "container" in K8s. L'unità minima è il **Pod**: uno o più container che condividono rete e storage.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-test
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
```

Crea il pod:
```bash
kubectl apply -f pod.yaml
kubectl get pods
kubectl describe pod nginx-test
```

---

## Deployment: Pod con Superpoderi

Non crei mai pod direttamente in produzione. Usi un **Deployment** che gestisce repliche, rolling update e rollback.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

---

## Service: Esporre i Tuoi Pod

Un pod ha un IP privato che cambia ad ogni riavvio. Il **Service** è l'astrazione che lo espone in modo stabile.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  type: NodePort
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30007
```

---

## Tips da Produzione

1. **Imposta sempre i `resource limits`**: senza, un pod può consumare tutta la RAM del nodo.
2. **Usa `namespaces`** per separare ambienti (dev, staging, prod) sullo stesso cluster.
3. **Non usare `latest` come tag**: specifica sempre la versione esatta dell'immagine.
4. **`kubectl rollout undo deployment/nome`** per rollback immediato in caso di problemi.
5. **Liveness e Readiness Probe**: insegnano a K8s quando un pod è davvero sano.

---

## Conclusione

Kubernetes sembra intimidatorio all'inizio, ma è **estremamente logico**: tutto si riduce a risorse YAML che descrivono uno stato. Il Control Plane fa il resto.

Il prossimo step? Helm per il package management, e un Ingress Controller per gestire il traffico HTTP.
