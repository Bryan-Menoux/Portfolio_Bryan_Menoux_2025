import PocketBase from "pocketbase";

// =============================================================
// CONFIGURATION DES URL POCKETBASE
// =============================================================
const isBrowser = typeof window !== "undefined";
// URL PUBLIQUE DE POCKETBASE ACCESSIBLE DEPUIS LE NAVIGATEUR
const PUBLIC_PB_URL = "https://portfolio.bryan-menoux.fr:8082";

// URL INTERNE (BACKEND / PM2)
const INTERNAL_URL = "http://127.0.0.1:8082";

// URL DEV (LOCAL)
const DEV_URL = "http://127.0.0.1:8090";
const envUrl =
  typeof process !== "undefined" && process.env?.POCKETBASE_URL
    ? process.env.POCKETBASE_URL
    : null;

const isDevServer =
  typeof process !== "undefined" && process.env?.LOCAL_DEV === "true";

const baseUrl = isBrowser
  ? PUBLIC_PB_URL // Toujours HTTPS côté navigateur
  : envUrl || (isDevServer ? DEV_URL : INTERNAL_URL);

export const pb = new PocketBase(baseUrl);
export const POCKETBASE_URL = baseUrl;

export const getFileUrl = (collectionId, recordId, filename) => {
  if (!filename) return null;
  return `${baseUrl}/api/files/${collectionId}/${recordId}/${filename}`;
};

// =============================================================
// CONSTANTES
// =============================================================

const COLLECTION_COMPETENCES = "competences";
const COLLECTION_PROJETS = "projets";

// =============================================================
// FORMATAGE - COMPÉTENCES
// =============================================================

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
});

// =============================================================
// FONCTIONS - COMPÉTENCES
// =============================================================

export async function getAllCompetences() {
  const records = await pb.collection(COLLECTION_COMPETENCES).getFullList({
    sort: "categorie,nom",
  });
  return records.map(formatCompetence);
}

export async function getCompetencesByCategory() {
  const records = await pb.collection(COLLECTION_COMPETENCES).getFullList({
    sort: "categorie,nom",
  });

  const grouped = {};
  records.forEach((comp) => {
    if (!grouped[comp.categorie]) grouped[comp.categorie] = [];
    grouped[comp.categorie].push(formatCompetence(comp));
  });

  return grouped;
}

export async function getCompetencesBySpecificCategory(categorie) {
  const records = await pb.collection(COLLECTION_COMPETENCES).getFullList({
    filter: `categorie = "${categorie}"`,
    sort: "nom",
  });
  return records.map(formatCompetence);
}

export async function getCompetenceById(id) {
  const record = await pb.collection(COLLECTION_COMPETENCES).getOne(id);
  return formatCompetence(record);
}

export async function createCompetence(data) {
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
}

export async function updateCompetence(id, data) {
  const record = await pb.collection(COLLECTION_COMPETENCES).update(id, {
    nom: data.nom,
    level: data.niveau,
    categorie: data.categorie,
    description: data.description,
    anneesExperience: data.anneesExperience,
    icone: data.icone,
    projet: data.projet,
  });

  return formatCompetence(record);
}

export async function deleteCompetence(id) {
  await pb.collection(COLLECTION_COMPETENCES).delete(id);
  return true;
}

export async function uploadCompetenceIcon(competenceId, file) {
  const fd = new FormData();
  fd.append("icone", file);

  const record = await pb
    .collection(COLLECTION_COMPETENCES)
    .update(competenceId, fd);

  return formatCompetence(record);
}

export async function deleteCompetenceIcon(competenceId) {
  const record = await pb
    .collection(COLLECTION_COMPETENCES)
    .update(competenceId, { icone: null });

  return formatCompetence(record);
}

export async function searchCompetences(searchTerm) {
  const records = await pb.collection(COLLECTION_COMPETENCES).getFullList({
    filter: `nom ~ "${searchTerm}"`,
    sort: "nom",
  });
  return records.map(formatCompetence);
}

export async function getCompetenceCategories() {
  const records = await pb.collection(COLLECTION_COMPETENCES).getFullList();
  return [...new Set(records.map((c) => c.categorie))];
}

export async function getCompetencesStats() {
  const records = await pb.collection(COLLECTION_COMPETENCES).getFullList();

  const stats = {
    total: records.length,
    byCategory: {},
    averageLevel: 0,
  };

  let totalLevel = 0;

  records.forEach((comp) => {
    stats.byCategory[comp.categorie] =
      (stats.byCategory[comp.categorie] || 0) + 1;
    totalLevel += comp.level || 0;
  });

  stats.averageLevel =
    records.length > 0 ? Math.round(totalLevel / records.length) : 0;

  return stats;
}

export async function getCompetencesPaginated(page = 1, perPage = 6) {
  const records = await pb
    .collection(COLLECTION_COMPETENCES)
    .getList(page, perPage, { sort: "categorie,nom" });

  return {
    page: records.page,
    perPage: records.perPage,
    totalItems: records.totalItems,
    totalPages: records.totalPages,
    items: records.items.map(formatCompetence),
  };
}

// =============================================================
// FORMATAGE - PROJETS
// =============================================================

const formatProjet = (projet) => {
  const file = (filename) =>
    filename ? getFileUrl(projet.collectionId, projet.id, filename) : null;

  const stackNames =
    projet.expand?.stack?.map((comp) => comp.nom) || projet.stacks || [];

  const infoSuppArray = projet.expand?.infoSupp
    ? projet.expand.infoSupp.map(
        (info) => info.title || info.nom || info.name || ""
      )
    : Array.isArray(projet.infoSupp)
    ? projet.infoSupp
    : typeof projet.infoSupp === "string"
    ? [projet.infoSupp]
    : [];

  return {
    id: projet.id,
    collectionId: projet.collectionId,

    titre: projet.nom || projet.titre || "",
    description: projet.description || "",
    contexte: projet.contexte || "",
    pourquoi: projet.pourquoi || "",
    infoSupp: infoSuppArray,

    logo: file(projet.logo),
    concept_visualisation: file(projet.concept_visualisation),
    moodboard: file(projet.moodboard),
    maquette_visualisation: file(projet.maquette_visualisation),

    recherche_logos: Array.isArray(projet.recherche_logos)
      ? projet.recherche_logos.map((f) => pb.files.getURL(projet, f))
      : projet.recherche_logos,

    stacks: stackNames,

    favori: projet.favori || false,
    slug: projet.slug || "",
    created: projet.created,
    updated: projet.updated,
  };
};

// =============================================================
// FONCTIONS - PROJETS
// =============================================================

export async function getAllProjets() {
  const records = await pb.collection(COLLECTION_PROJETS).getFullList({
    sort: "created",
    expand: "stack,infoSupp",
  });
  return records.map(formatProjet);
}

export async function getFavoriProjets() {
  const records = await pb.collection(COLLECTION_PROJETS).getFullList({
    filter: "favori = true",
    sort: "created",
    expand: "stack,infoSupp",
  });
  return records.map(formatProjet);
}

export async function getProjetById(id) {
  const record = await pb
    .collection(COLLECTION_PROJETS)
    .getOne(id, { expand: "stack,infoSupp" });
  return formatProjet(record);
}

export async function getProjetBySlug(slug) {
  const record = await pb
    .collection(COLLECTION_PROJETS)
    .getFirstListItem(`slug = "${slug}"`, {
      expand: "stack,infoSupp",
    });

  return formatProjet(record);
}

export async function createProjet(data) {
  const record = await pb.collection(COLLECTION_PROJETS).create({
    titre: data.titre,
    description: data.description || "",
    infoSupp: data.infoSupp || "",
    logo: data.logo || null,
    stacks: data.stacks || [],
  });
  return formatProjet(record);
}

export async function updateProjet(id, data) {
  const record = await pb.collection(COLLECTION_PROJETS).update(id, {
    titre: data.titre,
    description: data.description,
    infoSupp: data.infoSupp,
    logo: data.logo,
    stacks: data.stacks,
  });

  return formatProjet(record);
}

export async function deleteProjet(id) {
  await pb.collection(COLLECTION_PROJETS).delete(id);
  return true;
}
