---
title: Firewall su Linux nel 2024: nftables è il Futuro
date: 2026-01-20
author: Valerio Simeraro
tags: [linux, networking, security, firewall]
---

# Firewall su Linux nel 2024: nftables è il Futuro

`iptables` ha fatto il suo tempo. Tecnicamente ancora funziona, ma su tutte le distro moderne — da Debian 12 a RHEL 9 — il default è ormai **nftables**. È tempo di impararlo.

---

## Perché Passare a nftables?

| Caratteristica | iptables | nftables |
|---|---|---|
| Tabelle separate (ip, ip6, arp) | ✅ Sì (confuso) | ❌ No, tutto unificato |
| Syntax | Verbosa | Compatta |
| Performance | Normale | Migliorata (lookup maps) |
| Transazione atomica | ❌ No | ✅ Sì |
| Tool moderno | `iptables` | `nft` |

---

## Struttura di nftables

```
Table → Chain → Rule
```

- **Table**: namespace per un address family (`ip`, `ip6`, `inet`, `arp`)
- **Chain**: simile alle chain di iptables (INPUT, OUTPUT, FORWARD)
- **Rule**: la singola regola di filtro

---

## Configurazione Base

```bash
# Installazione (Debian/Ubuntu)
apt install nftables
systemctl enable --now nftables

# Verifica regole attive
nft list ruleset
```

### Ruleset Essenziale per un Server

```nft
#!/usr/sbin/nft -f

flush ruleset

table inet filter {
    chain input {
        type filter hook input priority 0; policy drop;

        # Consenti loopback
        iifname lo accept

        # Connessioni stabilite
        ct state established,related accept

        # ICMP/Ping
        ip protocol icmp accept
        ip6 nexthdr icmpv6 accept

        # SSH solo da rete interna
        tcp dport 22 ip saddr 192.168.1.0/24 accept

        # HTTP/HTTPS
        tcp dport { 80, 443 } accept

        # Log e drop tutto il resto
        log prefix "[nftables DROP] " drop
    }

    chain forward {
        type filter hook forward priority 0; policy drop;
    }

    chain output {
        type filter hook output priority 0; policy accept;
    }
}
```

```bash
# Applica il file
nft -f /etc/nftables.conf

# Verifica sintassi senza applicare
nft -c -f /etc/nftables.conf
```

---

## Maps: la Potenza Nascosta

I **maps** di nftables non esistono in iptables. Permettono lookup O(1) invece di liste di regole:

```nft
# Blocca set di IP malevoli (aggiornabile dinamicamente)
set blocklist {
    type ipv4_addr
    flags interval
    elements = { 192.168.99.0/24, 10.0.0.1 }
}

chain input {
    ip saddr @blocklist drop
}

# Aggiungi IP al blocklist a runtime senza riavviare il firewall
nft add element inet filter blocklist { 1.2.3.4 }
```

---

## Migrazione da iptables

```bash
# Tool ufficiale di migrazione
apt install iptables-nft

# Converti le tue regole attuali
iptables-save | iptables-restore-translate -4 > /etc/nftables.conf

# Verifica e adatta il file generato
nft -c -f /etc/nftables.conf
```

---

## Tips per la Produzione

1. **Sempre `flush ruleset` all'inizio**: garantisce uno stato pulito e deterministico.
2. **Testa le regole prima di applicarle**: `nft -c -f file.nft`.
3. **Usa `ct state established,related accept`**: o bloccherai il traffico di ritorno.
4. **Versionamento**: metti `/etc/nftables.conf` sotto Git. Un errore di firewall blocca l'accesso SSH.
5. **Rate limiting nativo**: `limit rate 3/minute burst 5 packets` integrato nel linguaggio.
