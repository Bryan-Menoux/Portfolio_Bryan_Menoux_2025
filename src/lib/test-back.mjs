import pb, { POCKETBASE_URL } from "./pocketbase.mjs";

console.log("🔌 Connection to PocketBase:", POCKETBASE_URL);

// Sécurité : login admin PocketBase
const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "testMdp25_";

async function seed() {
  try {
    console.log("🔐 Authenticating admin…");

    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);

    console.log("✅ Authentication successful");

    const projets = [
      // =============================
      // 🚀 REBIRTH
      // =============================
      {
        nom: "Rebirth",
        description:
          'Rebirth est un projet conceptuel qui explore le rôle des livres dans la renaissance d\'une civilisation en déclin. Inspiré par "Le Livre d\'Eli" et "Fahrenheit 451", le site offre une expérience mobile immersive et interactive, développée en pur HTML, CSS et JavaScript.',
        contexte:
          "Rebirth est un projet MMI autour du thème Préhistoire du futur. Il s’agit d’un site web imaginé à partir d’un objet choisi pour être envoyé dans un passé ou un futur, afin d’en réinventer le sens.",
        pourquoi:
          "J’ai choisi le livre pour sa capacité à traverser le temps. Témoignage du passé et porteur de sens pour l’avenir, il incarne transmission, savoir et renaissance, et s’imposait comme un point de départ idéal pour Rebirth.",
        description_fonts:
          "J’ai fait le choix d’utiliser Playfair Display pour les titres principaux afin d’apporter de l’élégance et de la singularité. Pour les sous-titres, j’ai retenu Poppins, une typographie moderne et lisible qui crée un bon contraste avec les titres. Enfin, Montserrat pour le corps de texte assure une lecture fluide et sobre, renforçant la clarté du projet.",
        description_palette:
          "J’ai fait le choix d’utiliser des teintes sobres afin de faciliter la lecture et de mettre en valeur le contenu. Les nuances de vert viennent, quant à elles, installer une ambiance sauvage et post-apocalyptique, en soulignant le contraste entre déclin et renaissance. Cet équilibre renforce à la fois la clarté fonctionnelle et l’atmosphère du projet.",
        description_logo:
          "Je suis assez rapidement venu à l’idée du phénix pour représenter Rebirth. Symbole universel de renaissance et de transformation, il s’est imposé naturellement comme le choix le plus cohérent avec le concept du projet. J’ai donc directement décidé de partir sur cette piste, en travaillant un design épuré qui exprime la force du symbole tout en restant lisible et marquant.",
        points_cle:
          "Ce design était destiné uniquement au mobile. J’ai donc travaillé à optimiser le contenu pour offrir une expérience fluide et responsive sur tous les types d’écrans mobiles. L’objectif était de garantir une accessibilité claire et agréable pour chaque utilisateur.",
        accessibilite:
          "J’ai travaillé l’accessibilité de mon site en veillant à une gestion adaptée des tailles de texte et à un choix de couleurs respectueuses de tous les utilisateurs.",
        responsivite:
          "Le design a été pensé uniquement pour mobile, ce qui m’a permis de concentrer mon travail de responsivité sur un panel restreint d’appareils et ainsi proposer une expérience optimale.",
        contraintes:
          "Pour ce projet, je devais travailler uniquement avec HTML, CSS et JavaScript pur, sans framework ni librairie. Cette contrainte m’a appris à concevoir un site simple mais efficace, en soignant particulièrement sa structure afin d’améliorer son référencement et son accessibilité.",
        approche:
          "Je suis parti d’un code simple et clair en respectant les bases du HTML, du CSS et du JavaScript. J’ai travaillé la structure du site en utilisant les bonnes balises pour optimiser le seo de ma page ainsi que son accessibilité pour les lecteurs d’écran afin de rendre mon site accessible également aux personnes malvoyantes.",
        apprentissage:
          "Ce projet m’a permis de consolider mes bases en HTML, CSS et JavaScript en travaillant sans frameworks ni librairies. J’ai appris à structurer un site de manière simple et efficace, tout en gardant en tête le référencement et l’accessibilité. J’ai également pris conscience de l’importance d’une bonne organisation du code et d’un design pensé avant tout pour l’utilisateur.",
        lien: "",
        favori: false,
      },

      // =============================
      // 🌿 CINÉNATURE
      // =============================
      {
        nom: "Cinénature",
        description:
          "CinéNature est un projet de site réalisé pour un festival fictif de cinéma éco-responsable qui se déroule sur la presqu’île du Malsaucy près de Belfort. Le site met en avant la programmation, les invités et les engagements écologiques du festival, tout en proposant une expérience claire et immersive. Il a été développé en utilisant HTML, CSS et JavaScript.",
        contexte:
          "CinéNature est un projet réalisé seul dans le cadre d’une SAÉ du BUT MMI. L’objectif était de concevoir le site vitrine d’un festival fictif en travaillant à la fois sur son identité visuelle et sur son développement technique.",
        pourquoi:
          "Le sujet du festival m’a été imposé dans le cadre de la SAÉ. Je devais concevoir un design cohérent autour de cette thématique puis le développer en site, de façon à mettre en valeur la programmation et l’identité éco-responsable de CinéNature.",
        description_fonts:
          "J’ai fait le choix d’utiliser Poppins pour l’ensemble des titres (H1, H2, H3) afin d’apporter cohérence, modernité et lisibilité. Pour le corps de texte, j’ai retenu Montserrat, une typographie sobre et claire qui assure un confort de lecture optimal et renforce l’accessibilité du projet.",
        description_palette:
          "J’ai fait le choix d’utiliser des teintes sobres et lumineuses afin de garantir une lecture claire et de mettre en valeur le contenu. Les nuances de bleu apportent une atmosphère apaisante et immersive, tandis que le vert rappelle directement l’aspect écologique du projet et son lien avec la nature. Les tons neutres comme le blanc et le beige équilibrent l’ensemble pour renforcer la clarté et installer une ambiance cohérente.",
        description_logo:
          "Je suis rapidement venu à l’idée de créer un logo qui représente à la fois la nature et le cinéma. Le popcorn évoque directement l’univers cinématographique, tandis que la couronne de feuilles rappelle l’ancrage écologique du projet. Le liseret apporte une dimension plus élégante, inspirée des dorures que l’on associe aux cinémas et aux théâtres. J’ai donc choisi un design simple et lisible, capable de refléter l’identité de CinéNature tout en restant marquant.",
        points_cle:
          "Le design de CinéNature a été pensé pour être accessible sur tous les supports, du mobile à l’ordinateur. J’ai travaillé la responsivité et l’optimisation du contenu afin d’assurer une navigation fluide et intuitive. L’objectif était de garantir une expérience claire, agréable et accessible pour chaque utilisateur.",
        accessibilite:
          "J’ai travaillé l’accessibilité du site en adaptant les tailles de texte pour assurer une lecture confortable et en choisissant des couleurs respectueuses de tous les utilisateurs.",
        responsivite:
          "J’ai veillé à ce que le site s’adapte naturellement aux différents formats d’écran afin de garantir une navigation fluide et agréable partout.",
        contraintes:
          "Pour développer CinéNature, j’ai utilisé le framework Astro pour structurer le site et JavaScript pour lui ajouter de l’interactivité. Pour la mise en forme, j’ai choisi TailwindCSS afin d’assurer un design clair, moderne et facile à maintenir. J’ai également intégré PocketBase pour gérer l’ensemble des contenus du festival ainsi que la base de données (billetterie, comptes utilisateurs, informations pratiques), ce qui a permis de rendre le site à la fois fonctionnel et complet.",
        approche:
          "Je suis parti d’une base claire avec Astro pour structurer le site et TailwindCSS pour assurer une mise en forme moderne et cohérente. J’ai veillé à utiliser une structure sémantique adaptée afin d’optimiser le référencement et de garantir l’accessibilité, notamment pour les lecteurs d’écran et les personnes malvoyantes.",
        apprentissage:
          "Ce projet m’a permis de renforcer mes compétences avec Astro et TailwindCSS, tout en explorant l’usage de PocketBase pour gérer des contenus dynamiques. J’ai appris à organiser efficacement un site, à travailler la responsivité pour tous les supports et à concevoir une expérience accessible. J’ai également pris conscience de l’importance d’une structure claire et d’un design pensé pour l’utilisateur.",
        lien: "",
        favori: false,
      },

      // =============================
      // 🐝 BEEUS
      // =============================
      {
        nom: "BeeUs",
        description:
          "BeeUs est un projet de plateforme sociale pensée pour faciliter les rencontres et l’intégration des étudiants dans leur ville. Inspiré par les besoins concrets de la vie étudiante, le site propose une expérience fluide et accessible, conçue avec Astro, React, TailwindCSS et PocketBase.",
        contexte:
          "BeeUs est mon projet de second semestre en groupe en BUT MMI. Il s’agit d’une plateforme web imaginée pour proposer des fonctionnalités originales, avec pour objectif de créer une expérience sociale innovante centrée sur les étudiants.",
        pourquoi:
          "Nous avons choisi ce projet car, en tant qu’étudiants, nous avons nous-mêmes connu l’arrivée dans une nouvelle ville sans repères. Cette expérience nous a permis de nous mettre dans la peau de nos futurs utilisateurs et de donner encore plus de sens à notre travail.",
        description_fonts:
          "Nous avons fait le choix d’utiliser Red Hat Display pour les titres principaux afin de donner du caractère et de la présence à l’identité de BeeUs. Pour les sous-titres, nous avons retenu Poppins, une typographie moderne et polyvalente qui crée un bon équilibre visuel. Enfin, nous avons choisi d’utiliser Montserrat pour le corps de texte qui garantit une lecture fluide et claire, renforçant l’accessibilité et la cohérence du projet.",
        description_palette:
          "Nous avons fait le choix d’associer des teintes sobres pour assurer une bonne lisibilité et mettre en valeur le contenu, à des couleurs vives comme le bleu, le violet, le rose et le jaune pour refléter l’énergie et la convivialité de BeeUs. Cet équilibre permet de renforcer la clarté fonctionnelle tout en installant une atmosphère dynamique et sociale, fidèle à l’esprit du projet.",
        description_logo:
          "Nous sommes assez rapidement venus à l’idée d’un symbole rappelant une ruche, en lien direct avec le nom BeeUs et l’univers des abeilles. Ce choix nous a permis de représenter visuellement l’idée de communauté, de connexion et de solidarité entre étudiants. Après plusieurs essais, nous avons retenu un design géométrique et épuré représentant une alvéole, à la fois moderne, lisible et facilement déclinable, qui traduit l’identité sociale et collaborative du projet.",
        points_cle:
          "BeeUs a été conçu pour s’adapter à tous les supports, du mobile à l’ordinateur. La responsivité et l’optimisation du contenu garantissent une navigation fluide et intuitive, avec une expérience claire et agréable pour chaque utilisateur.",
        accessibilite:
          "Nous avons travaillé l’accessibilité de BeeUs en adaptant les tailles de texte pour assurer une lecture confortable. L’accessibilité a été pensée dès le départ pour garantir la même expérience sur tout les supports.",
        responsivite:
          "Le design de BeeUs a été pensé pour s’adapter à tous les supports. Cette approche nous a permis de travailler la responsivité de manière globale et d’offrir une expérience cohérente et optimale, à tout les utilisateurs.",
        contraintes:
          "Pour ce projet, nous devions travailler avec le framework Astro. Nous pouvions utiliser React, non pas comme framework mais comme librairie, afin d’ajouter de l’interactivité sans gérer le rendu serveur. Le site devait être entièrement responsive sur tous les supports et respecter les règles de la RGPD, ce qui a orienté nos choix techniques et de conception.",
        approche:
          "Nous avons travaillé avec Astro en framework et utilisé React en librairie pour l’interactivité, en veillant à garder un code clair et bien structuré. L’un des points essentiels du développement a été d’optimiser le site aussi bien pour mobile que pour desktop, afin d’assurer une expérience fluide et accessible sur tous les supports.",
        apprentissage:
          "Ce projet m’a permis de travailler avec Astro et d’explorer l’usage de React pour l’interactivité. J’ai appris à gérer une base de données conséquente comprenant des comptes utilisateurs, des posts et des connexions, tout en assurant la sécurité et le respect de la RGPD. J’ai également renforcé mes compétences en responsivité, en référencement et en accessibilité.",
        lien: "",
        favori: false,
      },
    ];

    for (const projet of projets) {
      console.log(`➡️ Création de : ${projet.nom}`);
      await pb.collection("projets").create(projet);
    }

    console.log("🎉 Tous les projets ont été créés avec succès !");
  } catch (err) {
    console.error("❌ Erreur lors du seed :", err);
  }
}

seed();
