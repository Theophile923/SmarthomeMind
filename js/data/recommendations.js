/**
 * recommendations.js
 * ---------------------
 * Written content shown for each risk. Pure data — priority/ordering is
 * decided in RecommendationEngine.js, not here.
 *
 * MULTI-LANGUAGE: title/why/action are objects keyed by language code
 * (fr/en/sw/zh). Use getRecommendationContent() below to read the right
 * language — never read the fields directly.
 *
 * Translations were produced by an AI. French and English are the most
 * reliable; Swahili and Chinese are a solid first pass but, since this
 * content is safety-related, worth a native-speaker review before being
 * fully relied upon.
 */

export const RECOMMENDATIONS = {
  REC_FIRE_001: {
    title: { fr: "Installer un détecteur de fumée", en: "Install a smoke detector", sw: "Sakinisha kigunduzi cha moshi", zh: "安装烟雾探测器" },
    why: {
      fr: "Un détecteur de fumée donne l'alerte en quelques secondes en cas d'incendie, souvent avant que la fumée ne soit visible ou sentie — c'est la différence entre évacuer à temps ou non.",
      en: "A smoke detector gives an alert within seconds of a fire starting, often before smoke is visible or smelled — the difference between evacuating in time or not.",
      sw: "Kigunduzi cha moshi hutoa tahadhari ndani ya sekunde chache moto unapoanza, mara nyingi kabla moshi haujaonekana au kunuswa.",
      zh: "烟雾探测器能在火灾发生后几秒钟内发出警报，通常在烟雾被看到或闻到之前——这决定了能否及时疏散。",
    },
    action: {
      fr: "Installez un détecteur de fumée fonctionnel à chaque étage, testez-le et changez la pile au moins une fois par an.",
      en: "Install a working smoke detector on every floor, test it, and change the battery at least once a year.",
      sw: "Sakinisha kigunduzi cha moshi kinachofanya kazi kwenye kila ghorofa, kijaribu, na ubadilishe betri angalau mara moja kwa mwaka.",
      zh: "在每层楼安装可用的烟雾探测器，进行测试，并至少每年更换一次电池。",
    },
  },
  REC_FIRE_002: {
    title: { fr: "Vérifier ou obtenir un extincteur", en: "Check or get a fire extinguisher", sw: "Kagua au pata kizima moto", zh: "检查或购置灭火器" },
    why: {
      fr: "Un extincteur accessible permet de maîtriser un départ de feu avant qu'il ne se propage.",
      en: "An accessible extinguisher lets you control a small fire before it spreads.",
      sw: "Kizima moto kinachofikika kinaruhusu kudhibiti moto mdogo kabla haujaenea.",
      zh: "易于取用的灭火器能让您在小火蔓延之前将其控制住。",
    },
    action: {
      fr: "Placez un extincteur dans un endroit accessible (cuisine ou couloir), vérifiez sa date de péremption et remplacez-le si nécessaire.",
      en: "Place an extinguisher somewhere accessible (kitchen or hallway), check its expiration date, and replace it if needed.",
      sw: "Weka kizima moto mahali panapofikika (jikoni au ukumbini), angalia tarehe yake ya mwisho, na kibadilishe ikiwa inahitajika.",
      zh: "将灭火器放在易于取用的地方（厨房或走廊），检查其过期日期，如有需要请更换。",
    },
  },
  REC_ELEC_001: {
    title: { fr: "Faire inspecter l'installation électrique", en: "Have your electrical system inspected", sw: "Kagusha mfumo wa umeme", zh: "检查电气系统" },
    why: {
      fr: "Une installation vieillissante ou non inspectée est une cause fréquente d'incendie domestique.",
      en: "Aging or uninspected wiring is a common cause of house fires.",
      sw: "Mfumo wa umeme uliozeeka au usiokaguliwa ni chanzo cha kawaida cha moto wa nyumbani.",
      zh: "老化或未经检查的电气系统是家庭火灾的常见原因。",
    },
    action: {
      fr: "Faites appel à un électricien qualifié pour une inspection complète, panneau électrique inclus.",
      en: "Hire a qualified electrician for a full inspection, including the electrical panel.",
      sw: "Mwite fundi umeme aliyehitimu kwa ukaguzi kamili, ikiwa ni pamoja na paneli ya umeme.",
      zh: "聘请合格电工进行全面检查，包括配电盘。",
    },
  },
  REC_ELEC_002: {
    title: { fr: "Réparer ou protéger les câbles endommagés", en: "Repair or protect damaged cables", sw: "Rekebisha au linda nyaya zilizoharibika", zh: "修复或保护受损电线" },
    why: {
      fr: "Un fil dénudé peut provoquer un choc électrique ou un court-circuit à l'origine d'un incendie.",
      en: "A bare wire can cause an electric shock or a short circuit that starts a fire.",
      sw: "Waya uliowazi unaweza kusababisha mshtuko wa umeme au mzunguko mfupi unaosababisha moto.",
      zh: "裸露的电线可能导致触电或短路引发火灾。",
    },
    action: {
      fr: "Remplacez ou gainez tout câble endommagé, et évitez de faire passer des rallonges sous des tapis ou des meubles.",
      en: "Replace or sheathe any damaged cable, and avoid running extension cords under rugs or furniture.",
      sw: "Badilisha au funika waya yoyote iliyoharibika, na epuka kupitisha waya za ziada chini ya mazulia au samani.",
      zh: "更换或包裹任何损坏的电线，避免将延长线放在地毯或家具下方。",
    },
  },
  REC_GAS_001: {
    title: { fr: "Installer un détecteur de gaz / monoxyde de carbone", en: "Install a gas / carbon monoxide detector", sw: "Sakinisha kigunduzi cha gesi/monoksidi kaboni", zh: "安装燃气/一氧化碳探测器" },
    why: {
      fr: "Le monoxyde de carbone est invisible et inodore — un détecteur est souvent le seul moyen de le repérer à temps.",
      en: "Carbon monoxide is invisible and odorless — a detector is often the only way to catch it in time.",
      sw: "Monoksidi kaboni haionekani na haina harufu — kigunduzi mara nyingi ndiyo njia pekee ya kuigundua kwa wakati.",
      zh: "一氧化碳无色无味——探测器往往是及时发现它的唯一方法。",
    },
    action: {
      fr: "Installez un détecteur fonctionnel près des zones de cuisson ou des appareils à combustion, et testez-le régulièrement.",
      en: "Install a working detector near cooking areas or combustion appliances, and test it regularly.",
      sw: "Sakinisha kigunduzi kinachofanya kazi karibu na maeneo ya kupikia au vifaa vinavyochoma, na kijaribu mara kwa mara.",
      zh: "在烹饪区域或燃烧设备附近安装可用的探测器，并定期测试。",
    },
  },
  REC_GAS_002: {
    title: { fr: "Vérifier régulièrement les tuyaux et raccords de gaz", en: "Regularly check gas pipes and connections", sw: "Kagua mara kwa mara mabomba na viunganisho vya gesi", zh: "定期检查燃气管道和接头" },
    why: {
      fr: "Une fuite non détectée peut s'accumuler et provoquer une explosion ou une intoxication.",
      en: "An undetected leak can build up and cause an explosion or poisoning.",
      sw: "Uvujaji usiogunduliwa unaweza kujikusanya na kusababisha mlipuko au sumu.",
      zh: "未被发现的泄漏可能积聚并导致爆炸或中毒。",
    },
    action: {
      fr: "Inspectez visuellement et olfactivement vos tuyaux et raccords de gaz au moins une fois par mois.",
      en: "Visually and olfactorily inspect your gas pipes and connections at least once a month.",
      sw: "Kagua kwa macho na kwa harufu mabomba na viunganisho vyako vya gesi angalau mara moja kwa mwezi.",
      zh: "每月至少目视和嗅闻检查一次燃气管道和接头。",
    },
  },
  REC_WATER_001: {
    title: { fr: "Repérer la vanne d'arrêt principale d'eau", en: "Locate the main water shut-off valve", sw: "Tafuta bomba kuu la kuzima maji", zh: "找到总水阀位置" },
    why: {
      fr: "En cas de fuite ou de rupture de tuyau, fermer l'eau rapidement limite les dégâts matériels.",
      en: "In case of a leak or burst pipe, shutting off water quickly limits property damage.",
      sw: "Endapo kuna uvujaji au bomba kupasuka, kuzima maji haraka hupunguza uharibifu wa mali.",
      zh: "如发生漏水或管道破裂，及时关闭水源可减少财产损失。",
    },
    action: {
      fr: "Localisez la vanne principale dès aujourd'hui et assurez-vous que tous les adultes du foyer savent la manipuler.",
      en: "Locate the main valve today, and make sure every adult in the household knows how to use it.",
      sw: "Tafuta bomba kuu leo, na hakikisha kila mtu mzima nyumbani anajua jinsi ya kulitumia.",
      zh: "今天就找到总水阀的位置，并确保家中每位成年人都知道如何使用它。",
    },
  },
  REC_WATER_002: {
    title: { fr: "Inspecter les tuyaux et raccords pour des fuites", en: "Inspect pipes and connections for leaks", sw: "Kagua mabomba na viunganisho kwa uvujaji", zh: "检查管道和接头是否漏水" },
    why: {
      fr: "Une fuite lente et non détectée peut endommager la structure de la maison et favoriser les moisissures.",
      en: "A slow, undetected leak can damage the structure of the house and encourage mold.",
      sw: "Uvujaji wa polepole usiogunduliwa unaweza kuharibu muundo wa nyumba na kusababisha ukungu.",
      zh: "缓慢且未被发现的漏水可能损坏房屋结构并滋生霉菌。",
    },
    action: {
      fr: "Vérifiez régulièrement sous les éviers et autour des appareils raccordés à l'eau, et réparez toute trace d'humidité.",
      en: "Regularly check under sinks and around water-connected appliances, and repair any sign of moisture.",
      sw: "Angalia mara kwa mara chini ya sinki na karibu na vifaa vilivyounganishwa na maji.",
      zh: "定期检查水槽下方及连接水源的电器周围。",
    },
  },
  REC_INTRU_001: {
    title: { fr: "Réparer ou installer des serrures fonctionnelles", en: "Repair or install working locks", sw: "Rekebisha au sakinisha kufuli zinazofanya kazi", zh: "修复或安装可用的锁" },
    why: {
      fr: "Une serrure défaillante est souvent le point d'entrée le plus simple pour une intrusion.",
      en: "A faulty lock is often the easiest entry point for an intrusion.",
      sw: "Kufuli iliyoharibika mara nyingi ndiyo njia rahisi zaidi ya kuingilia.",
      zh: "损坏的锁往往是入侵者最容易利用的入口。",
    },
    action: {
      fr: "Vérifiez chaque porte et fenêtre, en particulier les accès secondaires, et réparez ou remplacez les serrures défectueuses.",
      en: "Check every door and window, especially secondary entrances, and repair or replace faulty locks.",
      sw: "Kagua kila mlango na dirisha, hasa milango ya ziada, na rekebisha au badilisha kufuli zilizoharibika.",
      zh: "检查每一扇门窗，尤其是次要入口，修复或更换损坏的锁。",
    },
  },
  REC_INTRU_002: {
    title: { fr: "Ajouter un éclairage ou un système de sécurité", en: "Add lighting or a security system", sw: "Ongeza taa au mfumo wa usalama", zh: "增加照明或安全系统" },
    why: {
      fr: "Un extérieur éclairé ou surveillé dissuade la plupart des tentatives d'intrusion opportunistes.",
      en: "A lit or monitored exterior deters most opportunistic intrusion attempts.",
      sw: "Eneo la nje lililowashwa au linalofuatiliwa huzuia majaribio mengi ya kuingilia ya kubahatisha.",
      zh: "有照明或被监控的室外区域可以阻止大多数机会型入侵企图。",
    },
    action: {
      fr: "Installez un éclairage extérieur automatique ou un système simple d'alarme/caméra à l'entrée principale.",
      en: "Install automatic outdoor lighting or a simple alarm/camera system at the main entrance.",
      sw: "Sakinisha taa za nje za kiotomatiki au mfumo rahisi wa kengele/kamera kwenye mlango mkuu.",
      zh: "在主入口安装自动室外照明或简单的警报器/摄像头系统。",
    },
  },
  REC_PEOPLE_001: {
    title: { fr: "Établir un plan d'évacuation familial", en: "Set up a family evacuation plan", sw: "Anzisha mpango wa uokoaji wa familia", zh: "制定家庭疏散计划" },
    why: {
      fr: "En situation d'urgence, un plan connu de tous fait gagner des secondes précieuses et évite la panique.",
      en: "In an emergency, a plan everyone knows saves precious seconds and prevents panic.",
      sw: "Wakati wa dharura, mpango unaojulikana na wote huokoa sekunde muhimu na kuzuia hofu.",
      zh: "在紧急情况下，一个大家都熟知的计划能节省宝贵的时间并防止恐慌。",
    },
    action: {
      fr: "Définissez avec votre foyer un point de rassemblement et un itinéraire de sortie, et révisez-le une fois par an.",
      en: "Agree with your household on a meeting point and an exit route, and review it once a year.",
      sw: "Kubaliana na wanakaya kuhusu sehemu ya kukutana na njia ya kutoka, na kuipitia mara moja kwa mwaka.",
      zh: "与家人商定一个集合点和撤离路线，并每年回顾一次。",
    },
  },
  REC_PEOPLE_002: {
    title: { fr: "Sécuriser les produits dangereux", en: "Secure dangerous products", sw: "Linda bidhaa hatari", zh: "妥善存放危险物品" },
    why: {
      fr: "Les produits chimiques et médicaments sont une cause fréquente d'accidents domestiques chez les enfants.",
      en: "Chemicals and medication are a common cause of household accidents among children.",
      sw: "Kemikali na dawa ni chanzo cha kawaida cha ajali za nyumbani kwa watoto.",
      zh: "化学品和药物是儿童家庭事故的常见原因。",
    },
    action: {
      fr: "Rangez ces produits dans une armoire fermée à clé ou en hauteur, hors de vue et de portée des enfants.",
      en: "Store these products in a locked cabinet or high up, out of sight and reach of children.",
      sw: "Hifadhi bidhaa hizi kwenye kabati lililofungwa au mahali pa juu, mbali na macho na mikono ya watoto.",
      zh: "将这些物品存放在锁好的柜子或高处，儿童看不到也拿不到的地方。",
    },
  },
};

/** Quick lookup helper: get recommendation content by its id. */
export function getRecommendationById(recommendationId) {
  const found = RECOMMENDATIONS[recommendationId];
  if (!found) {
    throw new Error(`Unknown recommendation id: "${recommendationId}"`);
  }
  return found;
}

/**
 * Reads title/why/action for a recommendation in the given language,
 * falling back to French for anything missing.
 */
export function getRecommendationContent(recommendation, lang) {
  return {
    title: recommendation.title[lang] || recommendation.title.fr,
    why: recommendation.why[lang] || recommendation.why.fr,
    action: recommendation.action[lang] || recommendation.action.fr,
  };
}
