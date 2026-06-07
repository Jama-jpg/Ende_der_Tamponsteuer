/* All timeline events, grouped by era.
   spur: 'A' = Produkte (rot), 'B' = Stigma & Aktivismus (dunkelgrau), 'C' = MwSt (rot)
   era:  1–6 (matches scene-era-N.js numbering) */

export const EVENTS = [
  // ── ERA 1: Steinzeit → 1972 ──────────────────────────────────────
  { era: 1, spur: 'A', year: '~Steinzeit',   title: 'Free Bleeding & Naturmaterialien',
    text: 'Moos, Gras, Tierfelle – oder einfach kein Schutz.\nMenstruation galt als natürlicher Zustand.' },
  { era: 1, spur: 'A', year: 'Mittelalter',  title: 'Lose Stofflappen',
    text: 'Unter weiten Röcken, keine Unterwäsche.\nKeine feste Form.' },
  { era: 1, spur: 'A', year: '19. Jh.',      title: 'Handgenähte Stoffbinden',
    text: 'Aus Wollresten, geteilt im Haushalt,\ngewaschen und wiederverwendet.' },
  { era: 1, spur: 'A', year: '1896',         title: 'Lister\'s Towel',
    text: 'Erste Einwegbinde. Mangels Klebetechnik\nnur mit Menstruationsgürtel tragbar.' },
  { era: 1, spur: 'A', year: '1920er',       title: 'Kotex-Binde',
    text: 'Krankenschwestern entdeckten zufällig:\nZellstoff-Verbandmaterial funktioniert als Binde.' },
  { era: 1, spur: 'A', year: '1933–1950',    title: 'Der Tampon kommt',
    text: '1933: Erster Tampon mit Applikator (Tampax).\n1937: Erste Menstruationstasse aus Latex.\n1950: o.b.-Tampon ohne Applikator (DE).' },
  { era: 1, spur: 'A', year: '1970er',       title: 'Selbstklebend & unsichtbar',
    text: 'Erste selbstklebende Binden.\nDer Gürtel wird überflüssig.' },

  { era: 1, spur: 'B', year: '~Steinzeit',   title: 'Macht oder Gefahr',
    text: 'Je nach Kultur: übernatürliche Kraft,\nMacht oder Gefahr.' },
  { era: 1, spur: 'B', year: 'Mittelalter',  title: '„Evas Fluch"',
    text: 'Blut als Sünde. Frauen galten als rituell unrein\nund wurden isoliert.' },
  { era: 1, spur: 'B', year: '1811',         title: 'Zur „Krankheit" erklärt',
    text: 'Frauen galten als biologisch minderwertig.\nDie Periode: eine „verpasste Schwangerschaft".' },
  { era: 1, spur: 'B', year: '1896',         title: 'Kommerzieller Flop',
    text: 'Binden wurden in neutralem Papier verkauft.\nBeim Kauf: diskrete Zettel – das Wort durfte nicht ausgesprochen werden.' },
  { era: 1, spur: 'B', year: '1920er',       title: 'Ein „technisches Problem"',
    text: 'Die Periode soll gelöst werden,\ndamit Frauen in Fabriken arbeiten können.' },
  { era: 1, spur: 'B', year: '1933–1958',    title: 'Moralische Panik',
    text: 'Religiöse Stimmen: Tampon gefährde die Jungfräulichkeit.\n1958: Studie widerlegt das „Menotoxin"-Märchen.' },
  { era: 1, spur: 'B', year: '1970er',       title: 'Periode „weg-gehygiest"',
    text: 'Werbung zeigt blaue statt rote Flüssigkeit.\nDas Ideal: bloß nicht auffallen.' },

  // ── ERA 2: 1973–2001 ─────────────────────────────────────────────
  { era: 2, spur: 'A', year: '1970er',       title: 'Selbstklebend (Ende Spur A)',
    text: 'Wasserdichte Einlagen, kein Gürtel mehr.\nDie Produktlinie ist vollständig.' },

  { era: 2, spur: 'B', year: '1973',         title: 'Erste Stimmen – UK',
    text: 'Feministische Aktivistinnen gehen erstmals\nauf die Straße. Argument: Exotische Tiere\nsind steuerfrei – Binden nicht.' },
  { era: 2, spur: 'B', year: '1985',         title: 'Ein Wort im Fernsehen',
    text: 'Courteney Cox spricht als erste Person\nim US-TV das Wort „Period" aus – in einer\nTampon-Werbung. Ein Skandal. Und ein Anfang.' },
  { era: 2, spur: 'B', year: '1986',         title: 'Erster Gesetzentwurf – USA',
    text: 'Abgeordnete Gloria Molina bringt in\nKalifornien den ersten Gesetzesentwurf zur\nAbschaffung der Tamponsteuer ein. Veto.' },
  { era: 2, spur: 'B', year: '2000',         title: 'Menstrual Avengers',
    text: 'Australien: Aktivistinnen in Superheldinnen-\nKostümen stürmen das Rathaus Melbourne.\nKampf gegen 10 % Warensteuer.' },

  { era: 2, spur: 'C', year: '1. Jän. 1973', title: 'MwSt-Einführung Österreich',
    text: 'Österreich führt die moderne MwSt ein.\nLebensmittel, Bücher, Kaviar: 8 % (Grundbedarf).\nTampons, Binden: 16 % (Normalsatz).\nKein Beschluss – nur eine Lücke im Gesetz.' },
  { era: 2, spur: 'C', year: '1984',         title: 'Steigerung auf 20 %',
    text: 'Lebensmittel: 10 %.\nTampons: 20 %.\nDieser Abstand bleibt 36 Jahre lang bestehen.' },

  // ── ERA 3: 2002–2014 ─────────────────────────────────────────────
  { era: 3, spur: 'A', year: '2002',         title: 'Mooncup – das letzte Produkt',
    text: 'Mooncup aus Silikon: nachhaltig,\nwiederverwendbar, langlebig.\nSpur A endet. Alle Produkte sind erfunden.' },

  { era: 3, spur: 'B', year: '2002+',        title: 'Aktivismus wächst',
    text: 'Die Produkte sind da.\nWas jetzt fehlt: Gerechtigkeit.' },

  { era: 3, spur: 'C', year: '2004',         title: 'Kenia: 0 % – erster Sieg',
    text: 'Kenia schafft als erstes Land der Welt\ndie Steuer auf Periodenprodukte ab.\n(Irland hatte 0 % schon immer als Ausnahme.)' },

  // ── ERA 4: 2015–2019 ─────────────────────────────────────────────
  { era: 4, spur: 'B', year: '2015',         title: '„No Tax on Tampons" – Kanada',
    text: '74.000 Unterschriften. Die Regierung lenkt ein.' },
  { era: 4, spur: 'B', year: '2016',         title: 'Das Jahr des Aufschreis',
    text: 'USA: 5 Frauen klagen, Obama unterstützt.\nSchweiz: 13 Brunnen in Zürich blutrot.\nÖsterreich: erdbeerwoche schreibt an Minister\nSchelling. Antwort: Nein.' },
  { era: 4, spur: 'B', year: '2017',         title: '#FreePeriods – UK',
    text: 'Die 17-jährige Amika George:\n1 von 10 Mädchen kann sich keine Produkte\nleisten. 137.000 Mädchen schwänzten deswegen\ndie Schule. Petition: 300.000 Unterschriften.\nÖsterreich: 30.000 auf aufstehn.at.' },
  { era: 4, spur: 'B', year: '2018',         title: 'Schottland: kostenlos in Schulen',
    text: 'Erstes Land weltweit mit kostenloser\nAbgabe in Schulen und Unis für alle\nStudierenden.' },
  { era: 4, spur: 'B', year: '2019',         title: 'National Period Day',
    text: 'USA: 60 Kundgebungen in 50 Bundesstaaten.\nÖsterreich: erdbeerwoche, Viva la Vulva,\nFrauenvolksbegehren + aufstehn.at\ndemonstrieren vor dem Finanzministerium.' },

  { era: 4, spur: 'C', year: '2015',         title: 'Kanada: 0 %',
    text: 'Nach der Petition: vollständige Abschaffung.' },
  { era: 4, spur: 'C', year: '2018',         title: 'Indien: 0 % (Binden)',
    text: '#TaxFreeWings + Bollywood-Star Akshay Kumar\nführen einen landesweiten Protest.\nDie 12 % Steuer fällt auf 0 %.' },
  { era: 4, spur: 'C', year: '2019',         title: 'Deutschland: 7 %',
    text: 'Das „Tampon-Buch" wird viral.\n#keinluxus: 180.000 Unterschriften.\nSteuer sinkt von 19 % auf 7 %.' },

  // ── ERA 5: 2020–2021 ─────────────────────────────────────────────
  { era: 5, spur: 'B', year: 'Dez. 2020',    title: 'Slipeinlagen-Drama',
    text: 'Kurz vor dem Parlamentsbeschluss: Slipeinlagen\nsollen von der Senkung ausgenommen werden.\nerdbeerwoche-Community startet digitalen Alarm.\nFinanzminister lenkt in letzter Minute ein.' },

  { era: 5, spur: 'C', year: 'Jän. 2020',    title: 'Regierungsprogramm',
    text: 'Die Senkung wird offiziell ins türkis-grüne\nRegierungsprogramm aufgenommen.\nMenstruation ist jetzt ein politisches Ziel.' },
  { era: 5, spur: 'C', year: '1. Jän. 2021',  title: '20 % → 10 % – Erster Sieg!',
    text: 'Nach fünf Jahren Kampf:\nEine Packung Tampons à 5,00 € kostet jetzt\n4,50 €. Laut WU Wien: fast die gesamte\nErsparnis kam bei den Konsument*innen an.' },

  // ── ERA 6: 2022–2026 ─────────────────────────────────────────────
  { era: 6, spur: 'B', year: '2022–2025',     title: 'Forderung: 0 % + kostenlos',
    text: 'SPÖ (Selma Yildirim) und NGOs fordern,\ndie EU-Freigabe sofort zu nutzen.\nForderung: nicht nur 0 % – auch kostenlose\nAbgabe in Schulen & öffentlichen Gebäuden.\nVorbild: Schottland.' },

  { era: 6, spur: 'C', year: 'Apr. 2022',    title: 'EU öffnet die Tür',
    text: 'EU-Finanzminister reformieren das MwSt-Recht.\nMitgliedstaaten dürfen nun 0 % auf\nPeriodenprodukte anwenden.\nBis dahin war 0 % für Österreich nicht möglich.' },
  { era: 6, spur: 'C', year: '1. Jän. 2026',  title: '0 % – Das Ziel!',
    text: 'Steuerfrei: Tampons, Binden, Slipeinlagen,\nMenstruationstassen, Periodenunterwäsche,\nKondome, Pille, Spirale und mehr.\n„Es darf nicht vom Geldbörserl abhängen."\n— Frauenministerin Sabine Dolenc-Holzleitner' },
];

/* Colour by spur */
export const SPUR_COLORS = {
  A: { fill: '#D63335', text: '#ffffff', label: 'SPUR A · PRODUKTE'  },
  B: { fill: '#3a3a32', text: '#ffffff', label: 'SPUR B · AKTIVISMUS' },
  C: { fill: '#D63335', text: '#ffffff', label: 'SPUR C · MEHRWERTSTEUER' },
};
