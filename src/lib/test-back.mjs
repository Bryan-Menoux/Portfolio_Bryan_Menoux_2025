import { getAllCompetences, updateCompetence } from "./pocketbase.mjs";

const competencesToUpdate = [
  // ======================
  // FRONTEND
  // ======================
  {
    nom: "HTML",
    categorie: "frontend",
    niveau: 90,
    description:
      "Langage de balisage permettant de structurer le contenu des pages web grâce à la sémantique HTML5.",
    anneesExperience: 3,
  },
  {
    nom: "CSS",
    categorie: "frontend",
    niveau: 80,
    description:
      "Langage de style utilisé pour la mise en forme, le responsive design et la conception d'interfaces modernes.",
    anneesExperience: 3,
  },
  {
    nom: "JavaScript",
    categorie: "frontend",
    niveau: 80,
    description:
      "Langage de programmation permettant d'ajouter de l'interactivité, manipuler le DOM et communiquer avec des APIs.",
    anneesExperience: 2,
  },
  {
    nom: "TypeScript",
    categorie: "frontend",
    niveau: 60,
    description:
      "Sur-ensemble typé de JavaScript permettant un développement plus robuste grâce au typage statique.",
    anneesExperience: 0.4,
  },
  {
    nom: "React",
    categorie: "frontend",
    niveau: 75,
    description:
      "Bibliothèque JavaScript utilisée pour créer des interfaces utilisateur réactives basées sur les hooks et les composants.",
    anneesExperience: 0.8,
  },
  {
    nom: "Astro",
    categorie: "frontend",
    niveau: 90,
    description:
      "Framework moderne orienté performance permettant de combiner des composants provenant de différentes technologies.",
    anneesExperience: 0.9,
  },
  {
    nom: "Tailwind CSS",
    categorie: "frontend",
    niveau: 95,
    description:
      "Framework CSS utilitaire permettant de créer rapidement des interfaces cohérentes et responsive via des classes atomiques.",
    anneesExperience: 0.8,
  },
  {
    nom: "Three.js",
    categorie: "frontend",
    niveau: 35,
    description:
      "Bibliothèque JavaScript permettant de manipuler WebGL pour afficher des scènes 3D dans le navigateur.",
    anneesExperience: 0.2,
  },
  {
    nom: "Alpine.js",
    categorie: "frontend",
    niveau: 45,
    description:
      "Micro-framework JavaScript permettant d’ajouter de l’interactivité directement dans le HTML.",
    anneesExperience: 0.5,
  },

  // ======================
  // BACKEND
  // ======================
  {
    nom: "Node.js",
    categorie: "backend",
    niveau: 70,
    description:
      "Environnement permettant d’exécuter du JavaScript côté serveur pour créer des scripts, API et automations.",
    anneesExperience: 0.9,
  },
  {
    nom: "Python",
    categorie: "backend",
    niveau: 40,
    description:
      "Langage polyvalent utilisé pour l'automatisation, les scripts, l’analyse ou le développement backend.",
    anneesExperience: 4,
  },
  {
    nom: "Django",
    categorie: "backend",
    niveau: 25,
    description:
      "Framework web en Python basé sur une architecture MVC permettant de créer rapidement des applications robustes.",
    anneesExperience: 2,
  },
  {
    nom: "PHP",
    categorie: "backend",
    niveau: 55,
    description:
      "Langage historique du web permettant de générer du contenu dynamique côté serveur.",
    anneesExperience: 0.3,
  },
  {
    nom: "PocketBase",
    categorie: "backend",
    niveau: 90,
    description:
      "Backend open-source offrant base de données, API REST, authentification et stockage dans un système unifié.",
    anneesExperience: 0.9,
  },

  // ======================
  // OUTILS
  // ======================
  {
    nom: "GitHub",
    categorie: "outils",
    niveau: 80,
    description:
      "Plateforme de gestion de versions Git idéale pour collaborer et déployer des projets modernes.",
    anneesExperience: 1,
  },
  {
    nom: "Figma",
    categorie: "outils",
    niveau: 85,
    description:
      "Outil de design collaboratif permettant de concevoir des interfaces utilisateur et des prototypes interactifs.",
    anneesExperience: 1,
  },
  {
    nom: "Adobe Illustrator",
    categorie: "outils",
    niveau: 50,
    description:
      "Outil de création vectorielle utilisé pour les logos, icônes et illustrations scalables.",
    anneesExperience: 1,
  },
  {
    nom: "Photoshop",
    categorie: "outils",
    niveau: 70,
    description:
      "Logiciel de retouche et de manipulation d’images utilisé pour la création de visuels web et print.",
    anneesExperience: 2,
  },
  {
    nom: "DaVinci Resolve",
    categorie: "outils",
    niveau: 30,
    description:
      "Logiciel de montage vidéo et d’étalonnage professionnel, utilisé pour la colorimétrie et le montage avancé.",
    anneesExperience: 2,
  },
  {
    nom: "Premiere Pro",
    categorie: "outils",
    niveau: 55,
    description:
      "Logiciel de montage vidéo permettant de produire des vidéos professionnelles avec transitions et effets.",
    anneesExperience: 0.5,
  },
  {
    nom: "Visual Studio Code",
    categorie: "outils",
    niveau: 95,
    description:
      "Éditeur de code moderne et extensible, central dans le développement web grâce à ses nombreuses extensions.",
    anneesExperience: 1,
  },
  {
    nom: "Notion",
    categorie: "outils",
    niveau: 90,
    description:
      "Outil de gestion de projets et de documentation permettant d’organiser efficacement un workflow.",
    anneesExperience: 0.8,
  },
];

export async function seedCompetences() {
  console.log("🔄 Mise à jour des compétences…");

  const records = await getAllCompetences();
  let updated = 0;
  let errors = 0;

  for (const competence of competencesToUpdate) {
    const found = records.find((r) => r.nom === competence.nom);

    if (!found) {
      console.warn(`⚠️ Compétence non trouvée : ${competence.nom}`);
      continue;
    }

    try {
      await updateCompetence(found.id, {
        niveau: competence.niveau,
        description: competence.description,
        anneesExperience: competence.anneesExperience,
        categorie: competence.categorie,
      });

      console.log(`✅ Mis à jour : ${competence.nom}`);
      updated++;
    } catch (err) {
      console.error(`❌ Erreur pour ${competence.nom} :`, err.message);
      errors++;
    }
  }

  console.log("\n========== RÉSULTAT ==========");
  console.log(`✔️ Mises à jour : ${updated}`);
  console.log(`❌ Erreurs : ${errors}`);
  console.log("==============================\n");
}

seedCompetences().catch(console.error);
