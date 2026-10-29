# Presenze · La tua attività

Web app installabile (PWA) su Android, pubblicata con GitHub Pages: https://beppeventuru.github.io/presenze-attivita/.

## Funzioni

- Importa gli eventi dal solo calendario Google **SCU Hackability**.
- Conferma ogni ora prevista con una casella indipendente.
- Aggiunge e modifica attività direttamente nell’app.
- Mostra il riepilogo mensile delle ore confermate ed esporta la timesheet in CSV.
- Sincronizza agenda e presenze tra i dispositivi con Firebase Authentication e Cloud Firestore.

## Sincronizzazione e privacy

Per attivare la sincronizzazione sul dispositivo, premi **Sincronizza dispositivi** e accedi con Google. L’accesso Google identifica l’utente; Firestore limita lettura e scrittura ai dati associati all’UID autenticato. Il progetto Firebase è sul piano Spark gratuito e Firestore usa la regione europea di Milano.

Le attività aggiunte o modificate nell’app vengono salvate su Firestore e sugli altri dispositivi collegati. Non vengono mai scritte su Google Calendar. L’importazione calendario usa il progetto Google Cloud `Presenze Attivita`, il calendario SCU Hackability e il solo permesso `calendar.events.readonly`.

Il modulo Firebase contiene la configurazione web pubblica dell’app. Non contiene client secret o password. La sicurezza dei dati è applicata dalle regole Firestore.

## Installazione

Apri l’URL in Chrome sul telefono e scegli **Installa app** oppure **Aggiungi a schermata Home** dal menu. La PWA richiede HTTPS; GitHub Pages pubblica l’app dal ramo `main`.
