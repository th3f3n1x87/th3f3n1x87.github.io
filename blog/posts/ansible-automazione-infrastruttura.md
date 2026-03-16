---
title: Ansible: Automazione dell'Infrastruttura senza Segreti
date: 2026-02-28
author: Valerio Simeraro
tags: [ansible, automation, devops, iac]
---

# Ansible: Automazione dell'Infrastruttura senza Segreti

Ho smesso di fare modifiche manuali sui server il giorno in cui ho perso tre ore a debuggare una configurazione "temporanea" che era live da 6 mesi. La soluzione si chiama **Ansible**.

---

## Perché Ansible e non gli altri?

| Tool | Agentless | Linguaggio | Learning Curve |
|---|---|---|---|
| **Ansible** | ✅ Sì | YAML + Jinja2 | Bassa |
| Puppet | ❌ No | Ruby DSL | Alta |
| Chef | ❌ No | Ruby | Alta |
| Terraform | ✅ Sì | HCL | Media |

Ansible è **agentless**: si connette via SSH ai tuoi server e non richiede nessun agent installato. Per un sysadmin, questo è oro.

---

## Concetti Fondamentali

### Inventory
L'elenco dei tuoi host:

```ini
# inventory.ini
[webservers]
web01.example.com
web02.example.com

[dbservers]
db01.example.com ansible_user=postgres

[all:vars]
ansible_python_interpreter=/usr/bin/python3
```

### Playbook
Il cuore di Ansible. Un file YAML che descrive cosa fare su quali host:

```yaml
---
- name: Setup Web Server
  hosts: webservers
  become: yes  # sudo
  
  tasks:
    - name: Installa Nginx
      apt:
        name: nginx
        state: present
        update_cache: yes

    - name: Avvia e abilita Nginx
      systemd:
        name: nginx
        state: started
        enabled: yes

    - name: Copia configurazione
      template:
        src: templates/nginx.conf.j2
        dest: /etc/nginx/nginx.conf
      notify: Reload Nginx

  handlers:
    - name: Reload Nginx
      systemd:
        name: nginx
        state: reloaded
```

---

## Variables e Vault

Non mettere mai password in chiaro nei playbook. Usa **Ansible Vault**:

```bash
# Crea un file cifrato
ansible-vault create group_vars/all/secrets.yml

# Modifica
ansible-vault edit group_vars/all/secrets.yml

# Esegui il playbook con password vault
ansible-playbook site.yml --ask-vault-pass
```

---

## Ruoli: Organizza il Codice

I **Roles** sono il modo corretto per strutturare playbook complessi:

```
roles/
└── webserver/
    ├── tasks/
    │   └── main.yml
    ├── handlers/
    │   └── main.yml
    ├── templates/
    │   └── nginx.conf.j2
    ├── vars/
    │   └── main.yml
    └── defaults/
        └── main.yml
```

---

## Tips da Produzione

1. **`--check` mode**: esegui in dry-run senza cambiare nulla. Indispensabile.
2. **`--diff`**: mostra esattamente cosa cambierebbe nei file.
3. **Tag i tuoi task**: `ansible-playbook site.yml --tags "nginx"` per eseguire solo una parte.
4. **`ansible-lint`**: installa sempre il linter. Salva dalle sorprese.
5. **Idempotenza**: scrivi task che possono girare N volte senza effetti collaterali.

---

## Il Comando che Uso di Più

```bash
# Test connessione a tutti gli host
ansible all -m ping

# Esegui comando ad-hoc
ansible webservers -m command -a "systemctl status nginx"

# Playbook in dry-run
ansible-playbook site.yml --check --diff
```

Con Ansible, la tua infrastruttura diventa **codice versionabile, documentazione vivente e strumento di disaster recovery** allo stesso tempo.
