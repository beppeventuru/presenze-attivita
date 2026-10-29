# Presenze · La tua attività

Web app installabile (PWA) su Android, pubblicata con GitHub Pages: https://beppeventuru.github.io/presenze-attivita/. Agenda e presenze sono salvate localmente nel browser del dispositivo (`localStorage`).

## Funzioni presenti

- aggiunta manuale di attività con data, orari, note e ore effettive facoltative;
- importazione eventi dal calendario principale Google (`primary`), con intervallo di 12 mesi passati e 12 futuri;
- una casella indipendente per ogni ora prevista: una sessione di tre ore mostra tre caselle;
- riepilogo mensile delle sole ore spuntate, con eventuali frazioni finali conteggiate in minuti;
- esportazione della timesheet in CSV.

## Google Calendar

Per la sincronizzazione occorre creare un progetto Google Cloud, abilitare Calendar API, configurare una schermata di consenso e un client OAuth di tipo applicazione web, quindi aggiungere l'origine HTTPS pubblicata tra le origini JavaScript autorizzate. Al primo uso, il pulsante chiede il Client ID pubblico; viene salvato localmente. La bozza usa il consenso Google e il permesso di sola lettura. Non chiede né memorizza la password Google o il token di accesso. La sincronizzazione usa per ora il calendario principale `primary`.

Per importare gli appuntamenti basta il permesso di sola lettura `calendar.events.readonly`. Le nuove attività vengono create solo nell'agenda interna dell'app e non sono scritte su Google Calendar.

## Installazione sul telefono

Apri l'URL in Chrome sul POCO e scegli **Installa app** oppure **Aggiungi a schermata Home** dal menu.

La pubblicazione si aggiorna a ogni push sul ramo `main`. Pages usa GitHub Actions come sorgente. Per Google Calendar crea un client OAuth web nel progetto Google Cloud, abilita Calendar API e aggiungi come origine JavaScript autorizzata `https://beppeventuru.github.io` (senza il percorso `/presenze-attivita/`). Al primo uso, il pulsante di sincronizzazione chiede il Client ID.

Il manifest include icone PNG da 192 e 512 pixel, richieste dai criteri d'installazione Chrome; il sito deve essere pubblicato via HTTPS. I requisiti sono descritti nella [guida GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) e nella [guida Chrome alle PWA installabili](https://developer.chrome.com/docs/lighthouse/pwa/installable-manifest/).

La timesheet rimane sul singolo dispositivo in questa versione. Per condividerla tra più dispositivi servirà aggiungere un archivio remoto e l'accesso utente.

