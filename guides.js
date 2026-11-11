/* Übungsanleitungen, fest eingebaut. Die App findet sie über den Übungsnamen. */
window.SATZ_GUIDES = [
  {
    name: 'Schrägbankdrücken KH',
    muscles: 'Obere Brust, vordere Schulter, Trizeps',
    setup: 'Bank auf 30 bis 45 Grad stellen. Hanteln auf die Oberschenkel stellen und beim Zurücklehnen mit den Knien in die Startposition bringen. Schulterblätter zusammen und nach unten ziehen, Füße fest auf den Boden.',
    steps: ['Hanteln über der oberen Brust strecken, Handflächen zeigen nach vorn oder leicht zueinander.', 'Kontrolliert absenken, bis die Hanteln neben der Brust sind. Ellbogen etwa 45 bis 60 Grad vom Körper.', 'Kurz unten halten, dann in einem leichten Bogen nach oben und innen drücken.', 'Oben nicht durchschlagen, die Spannung bleibt in der Brust.'],
    cues: ['Schulterblätter bleiben die ganze Zeit fixiert.', 'Unterarme stehen senkrecht unter den Hanteln.', 'Po bleibt auf der Bank.'],
    mistakes: ['Bank zu steil: Dann arbeitet vor allem die Schulter.', 'Ellbogen weit seitlich ausgestellt.', 'Hanteln oben zusammenschlagen und die Spannung verlieren.'],
    breathing: 'Beim Absenken einatmen, beim Drücken ausatmen.'
  },
  {
    name: 'Brustpresse Maschine',
    muscles: 'Brust, vordere Schulter, Trizeps',
    setup: 'Sitz so einstellen, dass die Griffe auf Höhe der mittleren Brust sind. Rücken fest an die Lehne, Schulterblätter zurück und nach unten.',
    steps: ['Griffe fassen, Handgelenke gerade.', 'Nach vorn drücken, bis die Arme fast gestreckt sind.', 'Langsam zurückführen, bis du eine Dehnung in der Brust spürst.', 'Ohne Pause die nächste Wiederholung starten.'],
    cues: ['Schultern bleiben unten, nicht zu den Ohren ziehen.', 'Rückweg kontrolliert, etwa 2 Sekunden.', 'Ellbogen etwas unter Schulterhöhe.'],
    mistakes: ['Sitz zu hoch oder zu tief eingestellt.', 'Schultern rollen nach vorn, wenn es schwer wird.', 'Gewicht hinten auf den Stapel fallen lassen.'],
    breathing: 'Beim Drücken ausatmen, beim Zurückführen einatmen.'
  },
  {
    name: 'Cable Fly tief → hoch',
    muscles: 'Obere Brust, vordere Schulter',
    setup: 'Beide Seilzüge ganz unten einstellen, Einzelgriffe. Mittig zwischen die Türme stellen, ein Schritt nach vorn, Oberkörper leicht nach vorn, Arme leicht gebeugt.',
    steps: ['Griffe neben den Hüften, Handflächen zeigen nach vorn oben.', 'In einem Bogen nach vorn oben führen, bis sich die Hände auf Kinnhöhe vor dem Körper treffen.', 'Oben die Brust bewusst anspannen.', 'Langsam im gleichen Bogen zurück, bis du eine Dehnung spürst.'],
    cues: ['Der Ellbogenwinkel bleibt die ganze Zeit gleich.', 'Die Bewegung kommt aus der Schulter, nicht aus dem Ellbogen.', 'Brust raus, Schultern unten.'],
    mistakes: ['Arme beugen und strecken: Dann wird es eine Drückbewegung.', 'Zu viel Gewicht und Schwung aus dem Oberkörper.', 'Hände über den Kopf hinaus führen.'],
    breathing: 'Beim Hochführen ausatmen, beim Zurückgehen einatmen.'
  },
  {
    name: 'Seitheben Kabel',
    muscles: 'Seitliche Schulter',
    setup: 'Seilzug ganz unten, Einzelgriff. Seitlich zum Turm stellen und mit der Hand greifen, die weiter vom Turm weg ist. Das Kabel läuft vor dem Körper.',
    steps: ['Arm leicht gebeugt, Griff vor der Hüfte.', 'Arm seitlich anheben, bis er etwa waagerecht ist.', 'Kurz halten, dann langsam absenken, ohne das Gewicht abzulegen.'],
    cues: ['Der Ellbogen führt, die Hand ist nicht höher als der Ellbogen.', 'Oberkörper ruhig, leicht zum Turm geneigt ist in Ordnung.', 'Schulter bleibt unten.'],
    mistakes: ['Mit dem Oberkörper Schwung holen.', 'Schulter hochziehen, dann übernimmt der Nacken.', 'Zu schnell absenken.'],
    breathing: 'Beim Anheben ausatmen, beim Absenken einatmen.',
    extra: 'Dropset: Nach dem letzten Satz sofort das Gewicht um etwa 25 % reduzieren und ohne Pause weitermachen, bis die Technik nicht mehr sauber ist.'
  },
  {
    name: 'Overhead-Trizepsextension Kabel',
    aliases: ['Overhead-Extension'],
    muscles: 'Trizeps, vor allem der lange Kopf',
    setup: 'Seil am Kabelzug auf Hüft- bis Brusthöhe. Mit dem Rücken zum Turm stellen, Seil über den Kopf nehmen, einen Schritt nach vorn, Oberkörper leicht nach vorn gelehnt. Alternativ mit einer Kurzhantel im Sitzen.',
    steps: ['Ellbogen zeigen nach vorn, Hände hinter dem Kopf, der Trizeps ist gedehnt.', 'Unterarme nach vorn oben strecken, bis die Arme gerade sind.', 'Oben die Seilenden leicht auseinanderziehen.', 'Langsam zurück in die Dehnung.'],
    cues: ['Oberarme bleiben ruhig, nur die Unterarme bewegen sich.', 'Ellbogen eher eng, nicht weit ausstellen.', 'Bauch fest, kein Hohlkreuz.'],
    mistakes: ['Ellbogen wandern nach unten, dann helfen Brust und Schultern mit.', 'Nur halbe Bewegung ohne Dehnung.', 'Mit dem Oberkörper wippen.'],
    breathing: 'Beim Strecken ausatmen, beim Zurückgehen einatmen.'
  },
  {
    name: 'Trizepsdrücken Seil',
    muscles: 'Trizeps',
    setup: 'Seil am oberen Kabelzug. Aufrecht stehen, leicht nach vorn gelehnt, Ellbogen seitlich am Körper.',
    steps: ['Seil auf Brusthöhe greifen, Ellbogen am Körper.', 'Nach unten drücken, bis die Arme gestreckt sind. Unten die Seilenden nach außen ziehen.', 'Kurz anspannen, dann langsam zurück bis etwa 90 Grad im Ellbogen.'],
    cues: ['Ellbogen bleiben am Körper fixiert.', 'Handgelenke gerade.', 'Schultern unten.'],
    mistakes: ['Ellbogen wandern nach vorn und hinten.', 'Oberkörper drückt mit.', 'Seil kommt beim Zurückgehen bis vors Gesicht.'],
    breathing: 'Beim Drücken ausatmen, beim Zurückgehen einatmen.'
  },
  {
    name: 'Klimmzüge',
    muscles: 'Latissimus, oberer Rücken, Bizeps',
    setup: 'Stange etwas mehr als schulterbreit im Obergriff fassen. Frei hängen, Beine ruhig, Bauch angespannt. Zu schwer? Mit Widerstandsband oder an der Klimmzugmaschine mit Unterstützung.',
    steps: ['Zuerst die Schulterblätter nach unten ziehen.', 'Ellbogen Richtung Hüfte ziehen, bis das Kinn über der Stange ist.', 'Kontrolliert ablassen, bis die Arme fast gestreckt sind.'],
    cues: ['Brust Richtung Stange, nicht nur das Kinn.', 'Kein Schwung aus den Beinen.', 'Unten nicht passiv in die Schultern fallen.'],
    mistakes: ['Schwung holen.', 'Nur halbe Wiederholungen.', 'Schultern zu den Ohren hochgezogen.'],
    breathing: 'Beim Hochziehen ausatmen, beim Ablassen einatmen.'
  },
  {
    name: 'Einarmiger Latzug',
    muscles: 'Latissimus',
    setup: 'Einzelgriff am oberen Kabelzug. Am Latzug sitzen oder seitlich knien, Oberkörper leicht zur Arbeitsseite geneigt.',
    steps: ['Arm oben gestreckt, der Lat ist gedehnt.', 'Ellbogen nach unten zur Hüfte ziehen, die Hand kommt neben die Schulter.', 'Kurz halten, dann langsam nach oben in die Dehnung.'],
    cues: ['Der Ellbogen führt die Bewegung.', 'Oberkörper bleibt ruhig.', 'Schulter unten halten.'],
    mistakes: ['Mit dem Oberkörper drehen und reißen.', 'Hand zieht zu weit vor dem Körper, dann arbeitet vor allem der Bizeps.', 'Oben keine volle Dehnung.'],
    breathing: 'Beim Ziehen ausatmen, beim Zurückgehen einatmen.'
  },
  {
    name: 'Enges Kabelrudern',
    muscles: 'Mittlerer Rücken, Latissimus, hintere Schulter, Bizeps',
    setup: 'V-Griff am unteren Kabelzug. Füße auf die Stützen, Knie leicht gebeugt, Oberkörper aufrecht.',
    steps: ['Griff mit gestreckten Armen, Schultern leicht nach vorn gedehnt.', 'Griff zum Bauchnabel ziehen, Ellbogen eng am Körper, Schulterblätter zusammen.', 'Kurz halten, dann langsam nach vorn zurück.'],
    cues: ['Oberkörper bleibt fast senkrecht.', 'Brust raus.', 'Ellbogen eng am Körper.'],
    mistakes: ['Mit dem Oberkörper weit nach hinten lehnen.', 'Rundrücken.', 'Schultern zu den Ohren ziehen.'],
    breathing: 'Beim Ziehen ausatmen, beim Zurückgehen einatmen.'
  },
  {
    name: 'Straight-Arm-Pulldown',
    muscles: 'Latissimus',
    setup: 'Gerade Stange oder Seil am oberen Kabelzug. Einen Schritt zurück, Hüfte leicht gebeugt, Arme fast gestreckt vor dem Körper.',
    steps: ['Griff auf Augenhöhe, Arme leicht gebeugt.', 'Mit gestreckten Armen in einem Bogen bis zu den Oberschenkeln ziehen.', 'Unten den Lat anspannen, dann langsam zurück bis auf Kopfhöhe.'],
    cues: ['Der Ellbogenwinkel bleibt fix.', 'Schultern unten, Brust raus.', 'Die Bewegung kommt aus der Schulter.'],
    mistakes: ['Arme beugen: Dann wird es Trizepsdrücken.', 'Mit dem Oberkörper wippen.', 'Zu schwer und dabei rund werden.'],
    breathing: 'Beim Ziehen ausatmen, beim Zurückgehen einatmen.'
  },
  {
    name: 'Reverse Fly Maschine',
    muscles: 'Hintere Schulter, oberer Rücken',
    setup: 'Butterfly-Maschine umgekehrt nutzen: Mit der Brust zum Polster sitzen, Griffe auf Schulterhöhe. Sitz entsprechend einstellen.',
    steps: ['Griffe mit leicht gebeugten Armen fassen.', 'Arme seitlich nach hinten führen, bis sie etwa in Linie mit dem Körper sind.', 'Langsam nach vorn zurück.'],
    cues: ['Die Bewegung kommt aus der hinteren Schulter.', 'Brust bleibt am Polster.', 'Lieber leichter und sauber.'],
    mistakes: ['Schultern hochziehen.', 'Mit Schwung arbeiten.', 'Arme stark beugen und mit Rudern nachhelfen.'],
    breathing: 'Beim Öffnen ausatmen, beim Zurückgehen einatmen.'
  },
  {
    name: 'Schrägbank-Curls KH',
    muscles: 'Bizeps, vor allem der lange Kopf',
    setup: 'Bank auf 45 bis 60 Grad. Zurücklehnen, die Arme hängen senkrecht nach unten, Handflächen zeigen nach vorn.',
    steps: ['Hanteln hängen gestreckt, der Bizeps ist gedehnt.', 'Hanteln hochcurlen, die Oberarme bleiben senkrecht.', 'Oben kurz anspannen, dann langsam ganz absenken.'],
    cues: ['Ellbogen bleiben hinten, nicht nach vorn ziehen.', 'Unten ganz strecken.', 'Kopf und Rücken bleiben an der Bank.'],
    mistakes: ['Ellbogen nach vorn schwingen.', 'Zu schwer und nur halbe Bewegung.', 'Vom Polster abheben.'],
    breathing: 'Beim Hochcurlen ausatmen, beim Absenken einatmen.'
  },
  {
    name: 'Hammercurls',
    muscles: 'Oberarmmuskel (Brachialis), Unterarm, Bizeps',
    setup: 'Stehen oder sitzen, Kurzhanteln im neutralen Griff (Daumen zeigen nach vorn), Arme seitlich am Körper.',
    steps: ['Hantel im neutralen Griff hochcurlen.', 'Oben kurz halten.', 'Langsam absenken, bis der Arm fast gestreckt ist.'],
    cues: ['Ellbogen bleiben am Körper.', 'Handgelenk gerade.', 'Kein Schwung aus der Hüfte.'],
    mistakes: ['Oberkörper schwingt mit.', 'Ellbogen wandern nach vorn.', 'Zu schnell ablassen.'],
    breathing: 'Beim Hochcurlen ausatmen, beim Absenken einatmen.'
  },
  {
    name: 'Kniebeuge',
    muscles: 'Oberschenkel vorn, Gesäß, Adduktoren, Rumpf',
    setup: 'Langhantel im Rack auf Schulterhöhe. Stange auf den oberen Rücken legen, Hände etwas mehr als schulterbreit, Schulterblätter zusammen. Ausheben, zwei Schritte zurück, Füße etwa schulterbreit, Zehen leicht nach außen. Sicherheitsablagen auf passende Höhe stellen.',
    steps: ['Tief einatmen und den Bauch fest anspannen.', 'Hüfte und Knie gleichzeitig beugen, Knie in Richtung der Zehen schieben.', 'So tief gehen, wie du den Rücken gerade halten kannst, idealerweise Hüfte mindestens auf Kniehöhe.', 'Aus der Fußmitte kraftvoll nach oben drücken.'],
    cues: ['Der ganze Fuß bleibt am Boden.', 'Knie folgen den Zehen und fallen nicht nach innen.', 'Brust bleibt oben, Blick nach vorn.'],
    mistakes: ['Knie fallen nach innen.', 'Fersen heben ab.', 'Unten rund werden oder viel zu flach bleiben.'],
    breathing: 'Vor jeder Wiederholung tief einatmen und halten, oben ausatmen.'
  },
  {
    name: 'Beinpresse',
    muscles: 'Oberschenkel vorn, Gesäß',
    setup: 'Rücken und Po fest ans Polster. Füße schulterbreit mittig auf die Plattform.',
    steps: ['Sicherung lösen, die Beine sind fast gestreckt.', 'Plattform kontrolliert absenken, bis die Knie etwa 90 Grad oder tiefer gebeugt sind, solange der Po am Polster bleibt.', 'Über die ganze Fußsohle nach oben drücken, Knie nicht ganz durchstrecken.'],
    cues: ['Po und unterer Rücken bleiben am Polster.', 'Knie zeigen in Richtung der Zehen.', 'Gleichmäßiges Tempo.'],
    mistakes: ['Knie oben durchdrücken.', 'So tief gehen, dass das Becken abkippt.', 'Knie fallen nach innen.'],
    breathing: 'Beim Absenken einatmen, beim Drücken ausatmen.'
  },
  {
    name: 'Beinstrecker',
    muscles: 'Oberschenkel vorn (Quadrizeps)',
    setup: 'Rückenlehne so einstellen, dass das Knie auf Höhe der Drehachse liegt. Polster knapp über dem Sprunggelenk.',
    steps: ['Griffe fassen, Rücken an die Lehne.', 'Beine strecken, bis sie gerade sind.', 'Oben 1 Sekunde anspannen, dann langsam absenken.'],
    cues: ['Po bleibt auf dem Sitz.', 'Kontrollierte Bewegung ohne Schwung.', 'Zehen zeigen nach oben.'],
    mistakes: ['Mit Schwung hochkicken.', 'Gewicht unten fallen lassen.', 'Drehachse falsch eingestellt.'],
    breathing: 'Beim Strecken ausatmen, beim Absenken einatmen.'
  },
  {
    name: 'Beinbeuger sitzend',
    muscles: 'Beinbeuger (Oberschenkelrückseite)',
    setup: 'Knie an der Drehachse, das Polster über den Oberschenkeln fest einstellen. Unterschenkelpolster knapp über den Fersen.',
    steps: ['Aus gestreckten Beinen die Fersen nach unten hinten ziehen.', 'So weit beugen wie möglich, kurz halten.', 'Langsam wieder strecken.'],
    cues: ['Oberkörper leicht nach vorn lehnen verstärkt die Dehnung.', 'Oberschenkel bleiben fest unter dem Polster.', 'Volle Streckung am Ende.'],
    mistakes: ['Nur halbe Bewegung.', 'Mit dem Oberkörper reißen.', 'Zu schnell zurück.'],
    breathing: 'Beim Beugen ausatmen, beim Strecken einatmen.'
  },
  {
    name: 'Wadenheben an der Beinpresse',
    muscles: 'Waden (Zwillingswadenmuskel)',
    setup: 'In der Beinpresse sitzen, nur die Fußballen unten an der Plattform, Fersen frei. Beine fast gestreckt, Knie nicht durchgedrückt. Sicherung griffbereit lassen.',
    steps: ['Fersen tief sinken lassen und die Wade dehnen.', 'Über die Fußballen die Plattform wegdrücken, so weit wie möglich.', 'Oben 1 Sekunde halten, dann langsam zurück in die Dehnung.'],
    cues: ['Unten 1 bis 2 Sekunden in der Dehnung bleiben.', 'Knie bleiben im gleichen Winkel.', 'Kraft über den großen Zeh.'],
    mistakes: ['Wippen ohne volle Bewegung.', 'Mit den Knien mitdrücken.', 'Füße rutschen ab, deshalb nie ohne Sicherung schwer arbeiten.'],
    breathing: 'Beim Hochdrücken ausatmen, beim Absenken einatmen.'
  },
  {
    name: 'Kabelcurls',
    muscles: 'Bizeps',
    setup: 'Gerade Stange oder SZ-Griff am unteren Kabelzug. Aufrecht stehen, Ellbogen seitlich am Körper.',
    steps: ['Griff im Untergriff, Arme gestreckt.', 'Hochcurlen bis kurz vor die Schultern, Ellbogen bleiben am Körper.', 'Langsam ablassen bis zur vollen Streckung.'],
    cues: ['Das Kabel hält die Spannung, also auch unten nicht locker lassen.', 'Handgelenke gerade.', 'Oberkörper ruhig.'],
    mistakes: ['Mit dem Rücken Schwung holen.', 'Ellbogen wandern nach vorn.', 'Oben ausruhen und Spannung verlieren.'],
    breathing: 'Beim Hochcurlen ausatmen, beim Absenken einatmen.'
  },
  {
    name: 'Schulterdrücken KH',
    muscles: 'Vordere und seitliche Schulter, Trizeps',
    setup: 'Bank fast senkrecht stellen (80 bis 90 Grad). Hanteln auf Schulterhöhe, Handflächen nach vorn, Ellbogen leicht vor dem Körper.',
    steps: ['Bauch fest, Rücken an der Lehne.', 'Hanteln über den Kopf drücken, bis die Arme fast gestreckt sind.', 'Kontrolliert zurück auf Kinn- bis Schulterhöhe.'],
    cues: ['Unterarme stehen senkrecht.', 'Kein starkes Hohlkreuz.', 'Hanteln oben nah zusammen, aber nicht zusammenschlagen.'],
    mistakes: ['Zu tief absenken, sodass die Schulter nach vorn kippt.', 'Hohlkreuz oder Brücke machen.', 'Mit den Beinen Schwung holen.'],
    breathing: 'Beim Drücken ausatmen, beim Absenken einatmen.'
  },
  {
    name: 'Flachbank KH',
    muscles: 'Brust, vordere Schulter, Trizeps',
    setup: 'Flachbank. Hanteln auf die Oberschenkel stellen und beim Hinlegen mit den Knien in die Startposition bringen. Schulterblätter zusammen und nach unten, Füße fest auf den Boden.',
    steps: ['Hanteln über der Brust strecken.', 'Kontrolliert absenken, bis die Hanteln seitlich auf Brusthöhe sind. Ellbogen etwa 45 bis 60 Grad vom Körper.', 'In einem leichten Bogen nach oben und innen drücken.'],
    cues: ['Schulterblätter fixiert lassen.', 'Unten eine Dehnung in der Brust spüren.', 'Unterarme senkrecht.'],
    mistakes: ['Ellbogen ganz seitlich ausstellen.', 'Hanteln unten zu weit absenken, bis die Schulter nach vorn rollt.', 'Po hebt von der Bank ab.'],
    breathing: 'Beim Absenken einatmen, beim Drücken ausatmen.'
  },
  {
    name: 'Seitheben KH',
    muscles: 'Seitliche Schulter',
    setup: 'Aufrecht stehen, leicht nach vorn geneigt, Kurzhanteln seitlich oder leicht vor dem Körper, Arme leicht gebeugt.',
    steps: ['Hanteln seitlich anheben, bis die Arme etwa waagerecht sind.', 'Oben kurz halten.', 'Langsam absenken, unten nicht ablegen.'],
    cues: ['Ellbogen führt, die kleinen Finger sind nicht höher als die Daumen.', 'Schultern bleiben unten.', 'Kontrolliertes Tempo, kein Schwung.'],
    mistakes: ['Mit Hüfte und Oberkörper Schwung holen.', 'Schultern zu den Ohren ziehen.', 'Arme weit über Schulterhöhe heben.'],
    breathing: 'Beim Anheben ausatmen, beim Absenken einatmen.',
    extra: 'Myo-Reps: Nach dem letzten regulären Satz 3 bis 5 tiefe Atemzüge Pause, dann 3 bis 5 Wiederholungen. Das 3- bis 4-mal wiederholen, bis du keine 3 mehr schaffst.'
  },
  {
    name: 'Pec Deck',
    muscles: 'Brust',
    setup: 'Sitz so einstellen, dass die Griffe auf Brust- bis Schulterhöhe sind. Rücken an die Lehne, Schulterblätter zurück.',
    steps: ['Griffe mit leicht gebeugten Armen fassen, die Brust ist gedehnt.', 'Arme in einem Bogen vor der Brust zusammenführen.', 'Kurz anspannen, dann langsam zurück, bis die Brust gedehnt ist.'],
    cues: ['Schultern bleiben hinten und unten.', 'Ellbogenwinkel bleibt gleich.', 'Langsamer Rückweg.'],
    mistakes: ['Schultern rollen nach vorn.', 'Zu weit nach hinten öffnen.', 'Mit Schwung zuklappen.'],
    breathing: 'Beim Zusammenführen ausatmen, beim Öffnen einatmen.'
  },
  {
    name: 'Schrägbank-Kabelfly',
    muscles: 'Obere Brust',
    setup: 'Schrägbank auf 30 bis 45 Grad mittig zwischen zwei Kabeltürme stellen, Kabel ganz unten, Einzelgriffe.',
    steps: ['Mit leicht gebeugten Armen starten, die Hände sind seitlich auf Brusthöhe.', 'Arme in einem Bogen über der oberen Brust zusammenführen.', 'Langsam zurück, bis die Brust gedehnt ist.'],
    cues: ['Ellbogenwinkel bleibt gleich.', 'Schulterblätter bleiben an der Bank fixiert.', 'Kontrollierter Rückweg.'],
    mistakes: ['Aus dem Fly wird ein Drücken.', 'Schultern lösen sich von der Bank.', 'Hände treffen sich zu weit oben über dem Gesicht.'],
    breathing: 'Beim Zusammenführen ausatmen, beim Öffnen einatmen.'
  },
  {
    name: 'French Press (SZ oder Kabel)',
    muscles: 'Trizeps, vor allem der lange Kopf',
    setup: 'Auf der Flachbank liegen, SZ-Stange mit engem Griff über der Brust strecken. Mit Kabel: Bank vor den unteren Kabelzug stellen und Stange oder Seil nutzen.',
    steps: ['Oberarme leicht nach hinten geneigt fixieren.', 'Nur aus dem Ellbogen die Stange hinter die Stirn absenken.', 'Unterarme wieder strecken, bis kurz vor durchgestreckt.'],
    cues: ['Die Oberarme bewegen sich kaum.', 'Ellbogen zeigen nach oben, nicht nach außen.', 'Langsam absenken, die Stange ist nah am Kopf.'],
    mistakes: ['Ellbogen gehen weit auseinander.', 'Oberarme bewegen sich mit, dann wird es ein Drücken.', 'Zu schwer und unkontrolliert in Kopfnähe.'],
    breathing: 'Beim Absenken einatmen, beim Strecken ausatmen.'
  },
  {
    name: 'Trizepsmaschine',
    muscles: 'Trizeps',
    setup: 'Sitz so einstellen, dass die Ellbogen auf dem Polster liegen und auf Höhe der Drehachse sind.',
    steps: ['Griffe fassen, Ellbogen auf dem Polster.', 'Arme strecken, bis sie gerade sind.', 'Langsam zurück bis etwa 90 Grad oder etwas tiefer.'],
    cues: ['Ellbogen bleiben auf dem Polster.', 'Schultern unten.', 'Oben kurz anspannen.'],
    mistakes: ['Ellbogen heben ab.', 'Mit dem Oberkörper nach vorn drücken.', 'Gewicht zurückfallen lassen.'],
    breathing: 'Beim Strecken ausatmen, beim Zurückgehen einatmen.'
  },
  {
    name: 'Rudern mit Brustauflage',
    muscles: 'Oberer und mittlerer Rücken, Latissimus, hintere Schulter',
    setup: 'Brust fest ans Polster, an der Maschine oder auf einer Schrägbank mit Kurzhanteln. Füße fest, Arme hängen gestreckt.',
    steps: ['Schulterblätter leicht nach vorn, Arme gestreckt.', 'Ellbogen nach hinten ziehen und die Schulterblätter zusammenführen.', 'Kurz halten, dann langsam zurück bis zur vollen Streckung.'],
    cues: ['Brust bleibt am Polster.', 'Ellbogen etwa 45 Grad vom Körper für den oberen Rücken, enger für den Lat.', 'Kein Schwung.'],
    mistakes: ['Brust hebt vom Polster ab.', 'Schultern zu den Ohren ziehen.', 'Nur halbe Bewegung.'],
    breathing: 'Beim Ziehen ausatmen, beim Zurückgehen einatmen.'
  },
  {
    name: 'Latzug Neutralgriff',
    muscles: 'Latissimus, Bizeps, oberer Rücken',
    setup: 'Neutralgriff (Handflächen zeigen zueinander) am Latzug. Oberschenkel fest unter das Polster, Oberkörper leicht zurückgelehnt.',
    steps: ['Arme gestreckt, die Schultern sind oben gedehnt.', 'Griff zur oberen Brust ziehen, Ellbogen nach unten.', 'Langsam nach oben zurück.'],
    cues: ['Brust raus, Schulterblätter nach unten.', 'Ellbogen zeigen nach unten, nicht nach hinten.', 'Oberkörper bleibt im gleichen Winkel.'],
    mistakes: ['Weit zurücklehnen und reißen.', 'Schultern bleiben oben.', 'Oben keine volle Streckung.'],
    breathing: 'Beim Ziehen ausatmen, beim Zurückgehen einatmen.'
  },
  {
    name: 'Einarmiges Kabelrudern',
    muscles: 'Latissimus, mittlerer Rücken',
    setup: 'Einzelgriff am Kabelzug auf Brust- oder Hüfthöhe, im Sitzen oder in Schrittstellung.',
    steps: ['Arm gestreckt, eine leichte Drehung zum Kabel ist erlaubt.', 'Ellbogen nah am Körper nach hinten zur Hüfte ziehen.', 'Langsam zurück, die Schulter darf nach vorn in die Dehnung.'],
    cues: ['Ellbogen führt.', 'Oberkörper dreht nur wenig mit.', 'Hinten kurz halten.'],
    mistakes: ['Mit dem ganzen Körper ziehen.', 'Schulter hochziehen.', 'Keine volle Dehnung vorn.'],
    breathing: 'Beim Ziehen ausatmen, beim Zurückgehen einatmen.'
  },
  {
    name: 'Face Pulls',
    muscles: 'Hintere Schulter, Rotatorenmanschette, oberer Rücken',
    setup: 'Seil am Kabelzug auf Gesichtshöhe oder etwas höher. Seilenden im Obergriff fassen, einen Schritt zurück.',
    steps: ['Arme gestreckt, leicht zurückgelehnt.', 'Seil zum Gesicht ziehen, Hände auseinander, Ellbogen hoch und nach außen.', 'Am Ende die Hände nach hinten drehen, kurz halten, langsam zurück.'],
    cues: ['Ellbogen auf Schulterhöhe oder höher.', 'Leichtes Gewicht, saubere Bewegung.', 'Schultern unten.'],
    mistakes: ['Zu schwer und mit dem Körper ziehen.', 'Ellbogen sinken ab, dann wird es Rudern.', 'Am Ende nicht nach hinten drehen.'],
    breathing: 'Beim Ziehen ausatmen, beim Zurückgehen einatmen.'
  },
  {
    name: 'Bayesian Curls',
    muscles: 'Bizeps, in gedehnter Position',
    setup: 'Einzelgriff am unteren Kabelzug. Mit dem Rücken zum Turm stellen, ein Schritt nach vorn, der Arm ist hinter dem Körper.',
    steps: ['Arm hängt leicht hinter dem Körper, der Bizeps ist gedehnt.', 'Hochcurlen, der Oberarm bleibt hinter der Körperlinie.', 'Langsam zurück in die Dehnung.'],
    cues: ['Oberarm bleibt fix.', 'Unten volle Dehnung.', 'Aufrecht bleiben.'],
    mistakes: ['Ellbogen nach vorn ziehen.', 'Schulter rollt nach vorn.', 'Zu viel Gewicht.'],
    breathing: 'Beim Hochcurlen ausatmen, beim Absenken einatmen.'
  },
  {
    name: 'Scottcurl-Maschine',
    muscles: 'Bizeps',
    setup: 'Sitz so einstellen, dass die Achseln am oberen Rand des Polsters liegen und die Ellbogen auf Höhe der Drehachse sind.',
    steps: ['Griffe im Untergriff, Arme fast gestreckt.', 'Hochcurlen, bis die Unterarme fast senkrecht sind.', 'Langsam ganz zurück.'],
    cues: ['Oberarme bleiben aufs Polster gedrückt.', 'Unten fast ganz strecken, aber kontrolliert.', 'Po bleibt auf dem Sitz.'],
    mistakes: ['Unten fallen lassen, das belastet den Ellbogen.', 'Nur halbe Bewegung.', 'Schultern hochziehen.'],
    breathing: 'Beim Hochcurlen ausatmen, beim Absenken einatmen.'
  },
  {
    name: 'Rumänisches Kreuzheben',
    muscles: 'Beinbeuger, Gesäß, unterer Rücken',
    setup: 'Langhantel oder Kurzhanteln hüftbreit im Obergriff, aufrecht stehen, Knie leicht gebeugt.',
    steps: ['Hüfte nach hinten schieben, die Stange gleitet nah an den Oberschenkeln nach unten.', 'Absenken, bis du eine starke Dehnung in den Beinbeugern spürst, meist knapp unter dem Knie.', 'Hüfte nach vorn bringen und aufrichten, oben den Po anspannen.'],
    cues: ['Der Rücken bleibt gerade.', 'Knie bleiben im gleichen leichten Winkel.', 'Stange bleibt nah am Körper.'],
    mistakes: ['Rundrücken.', 'In die Knie gehen statt die Hüfte zu beugen.', 'Stange weit vor dem Körper.'],
    breathing: 'Oben einatmen und den Bauch fest machen, beim Aufrichten ausatmen.'
  },
  {
    name: 'Bulgarian Split Squats',
    muscles: 'Oberschenkel vorn, Gesäß',
    setup: 'Rücken zur Bank, einen Fuß mit dem Spann hinten auf die Bank legen. Der vordere Fuß steht so weit vorn, dass das Knie unten etwa über dem Fuß ist. Kurzhanteln seitlich halten.',
    steps: ['Aufrecht stehen, das Gewicht liegt auf dem vorderen Bein.', 'Senkrecht nach unten gehen, bis das hintere Knie fast den Boden berührt.', 'Über die ganze Fußsohle vorn nach oben drücken.'],
    cues: ['Vorderes Knie folgt den Zehen.', 'Oberkörper leicht nach vorn heißt mehr Gesäß, aufrecht heißt mehr Oberschenkel.', 'Das hintere Bein bleibt locker.'],
    mistakes: ['Vorderer Fuß zu nah an der Bank.', 'Knie fällt nach innen.', 'Mit dem hinteren Bein drücken.'],
    breathing: 'Beim Absenken einatmen, beim Hochdrücken ausatmen.'
  },
  {
    name: 'Beinbeuger liegend',
    muscles: 'Beinbeuger (Oberschenkelrückseite)',
    setup: 'Bauchlage, die Knie liegen knapp über der Polsterkante auf Höhe der Drehachse, das Polster über den Fersen.',
    steps: ['Hüfte bleibt fest auf dem Polster.', 'Fersen in Richtung Po ziehen.', 'Kurz halten, dann langsam strecken.'],
    cues: ['Griffe festhalten, Oberkörper ruhig.', 'Volle Streckung am Ende.', 'Gleichmäßiges Tempo.'],
    mistakes: ['Hüfte hebt ab und es entsteht ein Hohlkreuz.', 'Mit Schwung hochziehen.', 'Gewicht beim Strecken fallen lassen.'],
    breathing: 'Beim Beugen ausatmen, beim Strecken einatmen.'
  },
  {
    name: 'Adduktoren',
    muscles: 'Innere Oberschenkel (Adduktoren)',
    setup: 'An der Adduktorenmaschine sitzen, die Polster liegen an der Innenseite der Knie. Die Startweite so wählen, dass eine angenehme Dehnung entsteht.',
    steps: ['Rücken an die Lehne.', 'Beine kontrolliert zusammenführen.', 'Kurz halten, dann langsam öffnen bis zur Dehnung.'],
    cues: ['Langsamer Rückweg.', 'Oberkörper aufrecht.', 'Startweite nur so groß, wie es angenehm ist.'],
    mistakes: ['Startweite zu groß.', 'Mit Schwung zuklappen.', 'Gewicht beim Öffnen fallen lassen.'],
    breathing: 'Beim Zusammenführen ausatmen, beim Öffnen einatmen.'
  },
  {
    name: 'Wadenheben sitzend',
    muscles: 'Waden, vor allem der Schollenmuskel',
    setup: 'Knie unter das Polster, Fußballen auf die Stufe, Fersen frei.',
    steps: ['Sicherung lösen und die Fersen tief absenken.', 'Auf die Zehenspitzen hochdrücken, so weit wie möglich.', 'Oben halten, dann langsam in die Dehnung.'],
    cues: ['Unten 1 bis 2 Sekunden in der Dehnung bleiben.', 'Volle Bewegung statt Wippen.', 'Kraft über den großen Zeh.'],
    mistakes: ['Nur im oberen Bereich wippen.', 'Zu schnell.', 'Mit den Händen am Polster mitdrücken.'],
    breathing: 'Beim Hochdrücken ausatmen, beim Absenken einatmen.'
  }
];
