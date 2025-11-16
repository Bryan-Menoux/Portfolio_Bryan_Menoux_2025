import PocketBase from "pocketbase";

// Détection de l'environnement
const isLocal =
  typeof window !== "undefined"
    ? window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    : process.env.NODE_ENV !== "production";

// URL de PocketBase
const baseUrl = isLocal
  ? "http://127.0.0.1:8090"
  : "https://portfolio.bryan-menoux.fr";

const pb = new PocketBase(baseUrl);

export default pb;
export const POCKETBASE_URL = baseUrl;

// ============================================
// CONSTANTES
// ============================================

const COLLECTION_COMPETENCES = "competences";
const COLLECTION_PROJETS = "projets";

// ============================================
// UTILITAIRES
// ============================================

const formatCompetence = (competence) => ({
  id: competence.id,
  nom: competence.nom,
  niveau: competence.level || 0,
  description: competence.description || "",
  anneesExperience: competence.anneesExperience || 0,
  icone: competence.icone
    ? pb.files.getURL(competence, competence.icone)
    : null,
  categorie: competence.categorie,
  created: competence.created,
  updated: competence.updated,
}); // ============================================
// FONCTIONS - COMPETENCES
// ============================================

export async function getAllCompetences() {
  try {
    const records = await pb.collection(COLLECTION_COMPETENCES).getFullList({
      sort: "categorie,nom",
    });
    return records.map(formatCompetence);
  } catch (err) {
    console.error("Erreur lors de la récupération des compétences :", err);
    throw err;
  }
}

export async function getCompetencesByCategory() {
  try {
    const records = await pb.collection(COLLECTION_COMPETENCES).getFullList({
      sort: "categorie,nom",
    });

    const grouped = {};
    records.forEach((comp) => {
      if (!grouped[comp.categorie]) {
        grouped[comp.categorie] = [];
      }
      grouped[comp.categorie].push(formatCompetence(comp));
    });

    return grouped;
  } catch (err) {
    console.error("Erreur lors du regroupement des compétences :", err);
    throw err;
  }
}

export async function getCompetencesBySpecificCategory(categorie) {
  try {
    const records = await pb.collection(COLLECTION_COMPETENCES).getFullList({
      filter: `categorie = "${categorie}"`,
      sort: "nom",
    });
    return records.map(formatCompetence);
  } catch (err) {
    console.error(
      `Erreur lors de la récupération des compétences (${categorie}) :`,
      err
    );
    throw err;
  }
}

export async function getCompetenceById(id) {
  try {
    const record = await pb.collection(COLLECTION_COMPETENCES).getOne(id);
    return formatCompetence(record);
  } catch (err) {
    console.error("Erreur lors de la récupération de la compétence :", err);
    throw err;
  }
}

export async function createCompetence(data) {
  try {
    const record = await pb.collection(COLLECTION_COMPETENCES).create({
      nom: data.nom,
      level: data.niveau,
      categorie: data.categorie,
      description: data.description || "",
      anneesExperience: data.anneesExperience || 0,
      icone: data.icone || null,
      projet: data.projet || null,
    });
    return formatCompetence(record);
  } catch (err) {
    console.error("Erreur lors de la création de la compétence :", err);
    throw err;
  }
}

export async function updateCompetence(id, data) {
  try {
    const updateData = {};
    if (data.nom !== undefined) updateData.nom = data.nom;
    if (data.niveau !== undefined) updateData.level = data.niveau;
    if (data.categorie !== undefined) updateData.categorie = data.categorie;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.anneesExperience !== undefined)
      updateData.anneesExperience = data.anneesExperience;
    if (data.icone !== undefined) updateData.icone = data.icone;
    if (data.projet !== undefined) updateData.projet = data.projet;

    const record = await pb
      .collection(COLLECTION_COMPETENCES)
      .update(id, updateData);
    return formatCompetence(record);
  } catch (err) {
    console.error("Erreur lors de la modification de la compétence :", err);
    throw err;
  }
}

export async function deleteCompetence(id) {
  try {
    await pb.collection(COLLECTION_COMPETENCES).delete(id);
    console.log(`Compétence ${id} supprimée avec succès`);
    return true;
  } catch (err) {
    console.error("Erreur lors de la suppression de la compétence :", err);
    return false;
  }
}

export async function uploadCompetenceIcon(competenceId, file) {
  try {
    const formData = new FormData();
    formData.append("icone", file);

    const record = await pb
      .collection(COLLECTION_COMPETENCES)
      .update(competenceId, formData);
    return formatCompetence(record);
  } catch (err) {
    console.error("Erreur lors du téléchargement de l'icône :", err);
    throw err;
  }
}

export async function deleteCompetenceIcon(competenceId) {
  try {
    const record = await pb
      .collection(COLLECTION_COMPETENCES)
      .update(competenceId, { icone: null });
    return formatCompetence(record);
  } catch (err) {
    console.error("Erreur lors de la suppression de l'icône :", err);
    throw err;
  }
}

export async function searchCompetences(searchTerm) {
  try {
    const records = await pb.collection(COLLECTION_COMPETENCES).getFullList({
      filter: `nom ~ "${searchTerm}"`,
      sort: "nom",
    });
    return records.map(formatCompetence);
  } catch (err) {
    console.error("Erreur lors de la recherche :", err);
    throw err;
  }
}

export async function getCompetenceCategories() {
  try {
    const records = await pb.collection(COLLECTION_COMPETENCES).getFullList();
    const categories = [...new Set(records.map((c) => c.categorie))];
    return categories;
  } catch (err) {
    console.error("Erreur lors de la récupération des catégories :", err);
    return [];
  }
}

export async function getCompetencesStats() {
  try {
    const records = await pb.collection(COLLECTION_COMPETENCES).getFullList();

    const stats = {
      total: records.length,
      byCategory: {},
      averageLevel: 0,
    };

    let totalLevel = 0;
    records.forEach((comp) => {
      if (!stats.byCategory[comp.categorie]) {
        stats.byCategory[comp.categorie] = 0;
      }
      stats.byCategory[comp.categorie]++;
      totalLevel += comp.niveau;
    });

    stats.averageLevel =
      records.length > 0 ? Math.round(totalLevel / records.length) : 0;

    return stats;
  } catch (err) {
    console.error("Erreur lors de la récupération des statistiques :", err);
    throw err;
  }
}

export async function getCompetencesPaginated(page = 1, perPage = 6) {
  try {
    const records = await pb
      .collection(COLLECTION_COMPETENCES)
      .getPage(page, perPage, { sort: "categorie,nom" });

    return {
      page: records.page,
      perPage: records.perPage,
      totalItems: records.totalItems,
      totalPages: records.totalPages,
      items: records.items.map(formatCompetence),
    };
  } catch (err) {
    console.error("Erreur lors de la récupération paginée :", err);
    throw err;
  }
}

// ============================================
// FONCTIONS - PROJETS
// ============================================

const formatProjet = (projet) => {
  // Récupère les noms des compétences si la relation expand est disponible
  let stackNames = [];
  if (
    projet.expand &&
    projet.expand.stack &&
    Array.isArray(projet.expand.stack)
  ) {
    stackNames = projet.expand.stack.map((comp) => comp.nom);
  }

  // Récupère les infos supplémentaires si la relation expand est disponible
  let infoSuppArray = [];
  if (
    projet.expand &&
    projet.expand.infoSupp &&
    Array.isArray(projet.expand.infoSupp)
  ) {
    infoSuppArray = projet.expand.infoSupp.map(
      (info) => info.title || info.nom || info.name || ""
    );
  } else if (projet.infoSupp && Array.isArray(projet.infoSupp)) {
    // Fallback si expand n'est pas disponible et infoSupp est un array
    infoSuppArray = projet.infoSupp;
  } else if (typeof projet.infoSupp === "string") {
    // Fallback si c'est une string
    infoSuppArray = [projet.infoSupp];
  }

  return {
    id: projet.id,
    titre: projet.nom || projet.titre || "",
    description: projet.description || "",
    infoSupp: infoSuppArray,
    logo: projet.logo ? pb.files.getURL(projet, projet.logo) : null,
    stacks: stackNames.length > 0 ? stackNames : projet.stacks || [],
    favori: projet.favori || false,
    created: projet.created,
    updated: projet.updated,
  };
};

export async function getAllProjets() {
  try {
    const records = await pb.collection(COLLECTION_PROJETS).getFullList({
      sort: "created",
      expand: "stack,infoSupp",
    });
    return records.map(formatProjet);
  } catch (err) {
    console.error("Erreur lors de la récupération des projets :", err);
    throw err;
  }
}

export async function getFavoriProjets() {
  try {
    const records = await pb.collection(COLLECTION_PROJETS).getFullList({
      filter: "favori = true",
      sort: "created",
      expand: "stack,infoSupp",
    });
    return records.map(formatProjet);
  } catch (err) {
    console.error("Erreur lors de la récupération des projets favoris :", err);
    throw err;
  }
}

export async function getProjetById(id) {
  try {
    const record = await pb.collection(COLLECTION_PROJETS).getOne(id);
    return formatProjet(record);
  } catch (err) {
    console.error("Erreur lors de la récupération du projet :", err);
    throw err;
  }
}

export async function createProjet(data) {
  try {
    const record = await pb.collection(COLLECTION_PROJETS).create({
      titre: data.titre,
      description: data.description || "",
      infoSupp: data.infoSupp || "",
      logo: data.logo || null,
      stacks: data.stacks || [],
    });
    return formatProjet(record);
  } catch (err) {
    console.error("Erreur lors de la création du projet :", err);
    throw err;
  }
}

export async function updateProjet(id, data) {
  try {
    const updateData = {};
    if (data.titre !== undefined) updateData.titre = data.titre;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.infoSupp !== undefined) updateData.infoSupp = data.infoSupp;
    if (data.logo !== undefined) updateData.logo = data.logo;
    if (data.stacks !== undefined) updateData.stacks = data.stacks;

    const record = await pb
      .collection(COLLECTION_PROJETS)
      .update(id, updateData);
    return formatProjet(record);
  } catch (err) {
    console.error("Erreur lors de la modification du projet :", err);
    throw err;
  }
}

export async function deleteProjet(id) {
  try {
    await pb.collection(COLLECTION_PROJETS).delete(id);
    console.log(`Projet ${id} supprimé avec succès`);
    return true;
  } catch (err) {
    console.error("Erreur lors de la suppression du projet :", err);
    return false;
  }
}
