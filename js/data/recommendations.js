export const RECOMMENDATIONS = {
  REC_FIRE_001: { title: "Installer un détecteur de fumée", why: "Un détecteur de fumée donne l'alerte en quelques secondes en cas d'incendie, souvent avant que la fumée ne soit visible ou sentie.", action: "Installez un détecteur de fumée fonctionnel à chaque étage, testez-le et changez la pile au moins une fois par an." },
  REC_FIRE_002: { title: "Vérifier ou obtenir un extincteur", why: "Un extincteur accessible permet de maîtriser un départ de feu avant qu'il ne se propage.", action: "Placez un extincteur dans un endroit accessible, vérifiez sa date de péremption et remplacez-le si nécessaire." },
  REC_ELEC_001: { title: "Faire inspecter l'installation électrique", why: "Une installation vieillissante ou non inspectée est une cause fréquente d'incendie domestique.", action: "Faites appel à un électricien qualifié pour une inspection complète, panneau électrique inclus." },
  REC_ELEC_002: { title: "Réparer ou protéger les câbles endommagés", why: "Un fil dénudé peut provoquer un choc électrique ou un court-circuit à l'origine d'un incendie.", action: "Remplacez ou gainez tout câble endommagé, et évitez de faire passer des rallonges sous des tapis ou meubles." },
  REC_GAS_001: { title: "Installer un détecteur de gaz / monoxyde de carbone", why: "Le monoxyde de carbone est invisible et inodore — un détecteur est souvent le seul moyen de le repérer à temps.", action: "Installez un détecteur fonctionnel près des zones de cuisson ou des appareils à combustion." },
  REC_GAS_002: { title: "Vérifier régulièrement les tuyaux et raccords de gaz", why: "Une fuite non détectée peut s'accumuler et provoquer une explosion ou une intoxication.", action: "Inspectez visuellement et olfactivement vos tuyaux et raccords de gaz au moins une fois par mois." },
  REC_WATER_001: { title: "Repérer la vanne d'arrêt principale d'eau", why: "En cas de fuite ou de rupture de tuyau, fermer l'eau rapidement limite les dégâts matériels.", action: "Localisez la vanne principale dès aujourd'hui et assurez-vous que tous les adultes du foyer savent la manipuler." },
  REC_WATER_002: { title: "Inspecter les tuyaux et raccords pour des fuites", why: "Une fuite lente et non détectée peut endommager la structure de la maison et favoriser les moisissures.", action: "Vérifiez régulièrement sous les éviers et autour des appareils raccordés à l'eau." },
  REC_INTRU_001: { title: "Réparer ou installer des serrures fonctionnelles", why: "Une serrure défaillante est souvent le point d'entrée le plus simple pour une intrusion.", action: "Vérifiez chaque porte et fenêtre, en particulier les accès secondaires, et réparez les serrures défectueuses." },
  REC_INTRU_002: { title: "Ajouter un éclairage ou un système de sécurité", why: "Un extérieur éclairé ou surveillé dissuade la plupart des tentatives d'intrusion opportunistes.", action: "Installez un éclairage extérieur automatique ou un système simple d'alarme/caméra à l'entrée principale." },
  REC_PEOPLE_001: { title: "Établir un plan d'évacuation familial", why: "En situation d'urgence, un plan connu de tous fait gagner des secondes précieuses et évite la panique.", action: "Définissez avec votre foyer un point de rassemblement et un itinéraire de sortie." },
  REC_PEOPLE_002: { title: "Sécuriser les produits dangereux", why: "Les produits chimiques et médicaments sont une cause fréquente d'accidents domestiques chez les enfants.", action: "Rangez ces produits dans une armoire fermée à clé ou en hauteur, hors de vue et de portée des enfants." },
};

export function getRecommendationById(recommendationId) {
  const found = RECOMMENDATIONS[recommendationId];
  if (!found) throw new Error(`Unknown recommendation id: "${recommendationId}"`);
  return found;
}
