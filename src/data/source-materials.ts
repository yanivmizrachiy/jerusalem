/**
 * קטלוג מקור מנורמל — נוצר מחילוץ משמר־קישורים של שני מסמכי משרד החינוך.
 *
 * כל משאב מוגדר כאן פעם אחת בלבד. `sourceMaterialPlacements` קובע באילו
 * שכבות, נושאים ואוספים הוא מוצג. כך אותו משאב יכול להופיע בכמה מקומות
 * בלי לשכפל את ההגדרה הקנונית שלו.
 *
 * עובדות השימור:
 * - 146 רשומות קישור במקור.
 * - 145 משאבים קנוניים: כפילות הצעידה מוזגה; התנגשות Yael_arabic נשמרה
 *   כשני רישומי בדיקה נפרדים כי הכותרות אינן קשורות.
 * - 8 שורות מקור לא־ריקות ללא קישור נשמרות ב־`sourceNoLinkRows`.
 */

export type SourceGrade = 'z' | 'h' | 't';
export type SourceDomain = 'algebra' | 'geometry';
export type SourcePedagogicalType =
  | 'teaching-unit'
  | 'interactive-activity'
  | 'worksheet'
  | 'game'
  | 'test'
  | 'assessment-guide'
  | 'summary-task'
  | 'formula-sheet'
  | 'presentation'
  | 'resource-repository'
  | 'teacher-guide'
  | 'multi-activity-collection';
export type SourceDeliveryMode = 'digital' | 'printable' | 'hybrid';
export type SourceItemKind = 'site' | 'doc' | 'drive' | 'pdf' | 'canva' | 'flip' | 'maf' | 'link';

export interface SourceMaterialResource {
  id: string;
  title: string;
  note: string;
  url: string;
  embed?: string;
  download?: string;
  kind: SourceItemKind;
  grades: SourceGrade[];
  domains: SourceDomain[];
  sourceTopicIds: string[];
  collections: string[];
  resourceType: SourcePedagogicalType;
  delivery: SourceDeliveryMode;
  source: string;
  sourceRecordIds: string[];
  evidence: string[];
  needsReview: boolean;
  reviewReason?: string;
  excludedFromTeachingMaterials: boolean;
}

export interface SourceMaterialPlacement {
  resourceId: string;
  grade: SourceGrade;
  topicChapterIds: string[];
  collectionChapterIds: string[];
}

export const sourceMaterialResources: SourceMaterialResource[] = [
  {
    "id": "src-game-z-00576add9b0f",
    "title": "שרשרת הצבות (כולל מס' שלילי)",
    "note": "קרדיט: מתמטיקה משולבת-מכון ויצמן",
    "url": "https://drive.google.com/file/d/0B58MLTJub4KJSXdDd3VuN1pRMjJlLXBXUFNUd1lybzkwVEx3/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · מתמטיקה משולבת-מכון ויצמן",
    "sourceRecordIds": [
      "game-z-00576add9b0f"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: ביטויים אלגבריים.",
      "Source subtopic: הצבה בביטוי אלגברי."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/0B58MLTJub4KJSXdDd3VuN1pRMjJlLXBXUFNUd1lybzkwVEx3/preview",
    "download": "https://drive.google.com/uc?export=download&id=0B58MLTJub4KJSXdDd3VuN1pRMjJlLXBXUFNUd1lybzkwVEx3"
  },
  {
    "id": "src-game-z-c9ff7e0990e6",
    "title": "מלחמה אלגברית - הצבות — קלפים מוגדלים למלחמה אלגברית - הצבות — מלחמה",
    "note": "קרדיט: מתמטיקה משולבת-מכון ויצמן",
    "url": "https://drive.google.com/file/d/0B58MLTJub4KJVExfT2xHVzREVFBMcEk0elBoRE4yU212OFh3/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · מתמטיקה משולבת-מכון ויצמן",
    "sourceRecordIds": [
      "game-z-c9ff7e0990e6"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: ביטויים אלגבריים.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/0B58MLTJub4KJVExfT2xHVzREVFBMcEk0elBoRE4yU212OFh3/preview",
    "download": "https://drive.google.com/uc?export=download&id=0B58MLTJub4KJVExfT2xHVzREVFBMcEk0elBoRE4yU212OFh3"
  },
  {
    "id": "src-game-z-2240924d847e",
    "title": "מלחמה אלגברית - הצבות — קלפים מוגדלים למלחמה אלגברית - הצבות — קלפים",
    "note": "קרדיט: מתמטיקה משולבת-מכון ויצמן",
    "url": "https://docs.google.com/document/d/15hekTJiLyBAmYHlKR26LEcMClqqKmDPxxDh1HrJFECU/edit",
    "kind": "doc",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · מתמטיקה משולבת-מכון ויצמן",
    "sourceRecordIds": [
      "game-z-2240924d847e"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: ביטויים אלגבריים.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/15hekTJiLyBAmYHlKR26LEcMClqqKmDPxxDh1HrJFECU/preview",
    "download": "https://docs.google.com/document/d/15hekTJiLyBAmYHlKR26LEcMClqqKmDPxxDh1HrJFECU/export?format=pdf"
  },
  {
    "id": "src-game-z-9345687178d9",
    "title": "הצבה בביטויים - שאלות במעגל",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/18BVQuw1ZNOOb3RL-hpGQZ2cx4x5O92OE/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-z-9345687178d9"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: ביטויים אלגבריים.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/18BVQuw1ZNOOb3RL-hpGQZ2cx4x5O92OE/preview",
    "download": "https://drive.google.com/uc?export=download&id=18BVQuw1ZNOOb3RL-hpGQZ2cx4x5O92OE"
  },
  {
    "id": "src-game-z-6d10346fe069",
    "title": "כספת הצבה רמה א — כספת הצבה רמה ב — כספת",
    "note": "ללא מספרים מכוונים קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1ydD3fi6YseAUrA3pBadlEMaPt9aWlW87/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-z-6d10346fe069"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: ביטויים אלגבריים.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1ydD3fi6YseAUrA3pBadlEMaPt9aWlW87/preview",
    "download": "https://drive.google.com/uc?export=download&id=1ydD3fi6YseAUrA3pBadlEMaPt9aWlW87"
  },
  {
    "id": "src-game-z-37b4e8418036",
    "title": "כספת הצבה רמה א — כספת הצבה רמה ב — כספת",
    "note": "ללא מספרים מכוונים קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1G0mNshi_aYrHnQ3FXCKVuQehKwbcfpTa/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-z-37b4e8418036"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: ביטויים אלגבריים.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1G0mNshi_aYrHnQ3FXCKVuQehKwbcfpTa/preview",
    "download": "https://drive.google.com/uc?export=download&id=1G0mNshi_aYrHnQ3FXCKVuQehKwbcfpTa"
  },
  {
    "id": "src-game-z-78f405097bb9",
    "title": "משחק הצבה והרכבת משפט",
    "note": "מדפיסים את הדף הראשון לכולם, את שאר הדפים מדפיסים ותולים ברחבי הכיתה. קרדיט: סמיון ויינר",
    "url": "https://drive.google.com/file/d/1r0vpRrdT7ZzCe3wgpj7-8IghQAMaFw7X/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · סמיון ויינר",
    "sourceRecordIds": [
      "game-z-78f405097bb9"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: ביטויים אלגבריים.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1r0vpRrdT7ZzCe3wgpj7-8IghQAMaFw7X/preview",
    "download": "https://drive.google.com/uc?export=download&id=1r0vpRrdT7ZzCe3wgpj7-8IghQAMaFw7X"
  },
  {
    "id": "src-game-z-463d12bf9544",
    "title": "קוד הסתרים חנוכה",
    "note": "הצבה במשחק חנוכה קרדיט: אליזהר לוי",
    "url": "https://drive.google.com/file/d/1iDU_OuKWewHBwbBWKVB-TSvRPK4TBtXh/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · אליזהר לוי",
    "sourceRecordIds": [
      "game-z-463d12bf9544"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: ביטויים אלגבריים.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1iDU_OuKWewHBwbBWKVB-TSvRPK4TBtXh/preview",
    "download": "https://drive.google.com/uc?export=download&id=1iDU_OuKWewHBwbBWKVB-TSvRPK4TBtXh"
  },
  {
    "id": "src-game-z-9927455e10df",
    "title": "משחק כיתתי מהסוג של ג'אפרדי",
    "note": "משחק כיתתי לסיכום הנושאים | נדרש מחשב להקרנת הצגת קרדיט: סמיון ויינר",
    "url": "https://docs.google.com/presentation/d/16MWH-7zGTAEsRJpBMu-zY2soR4yy-ui0nNMIfDX_QTo/edit",
    "kind": "doc",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ],
    "collections": [
      "games",
      "summaries"
    ],
    "resourceType": "game",
    "delivery": "digital",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · סמיון ויינר",
    "sourceRecordIds": [
      "game-z-9927455e10df"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: ביטויים אלגבריים.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/presentation/d/16MWH-7zGTAEsRJpBMu-zY2soR4yy-ui0nNMIfDX_QTo/preview",
    "download": "https://docs.google.com/presentation/d/16MWH-7zGTAEsRJpBMu-zY2soR4yy-ui0nNMIfDX_QTo/export/pdf"
  },
  {
    "id": "src-game-z-65da3d977eff",
    "title": "חגי-תשרי-הצבה",
    "note": "קרדיט: אלינור לוי",
    "url": "https://drive.google.com/file/d/19VJ-k4oQwOU7PLDUb5qRZoBeDn8OLT9-/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · אלינור לוי",
    "sourceRecordIds": [
      "game-z-65da3d977eff"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: ביטויים אלגבריים.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/19VJ-k4oQwOU7PLDUb5qRZoBeDn8OLT9-/preview",
    "download": "https://drive.google.com/uc?export=download&id=19VJ-k4oQwOU7PLDUb5qRZoBeDn8OLT9-"
  },
  {
    "id": "src-game-z-c6276f21e166",
    "title": "תשחץ - כינוס איברים דומים וחוק הפילוג",
    "note": "כינוס איברים דומים וחוק הפילוג קרדיט: סמיון ויינר",
    "url": "https://drive.google.com/file/d/1wpkFTyypoltjoLLrHINgyRosjm3947ih/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · סמיון ויינר",
    "sourceRecordIds": [
      "game-z-c6276f21e166"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: ביטויים אלגבריים.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1wpkFTyypoltjoLLrHINgyRosjm3947ih/preview",
    "download": "https://drive.google.com/uc?export=download&id=1wpkFTyypoltjoLLrHINgyRosjm3947ih"
  },
  {
    "id": "src-game-z-5e82a6f250e8",
    "title": "כינוס איברים דומים",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1_yTHzVIzQrWlV_OHdG6jaE3OqCBFkF3p/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-z-5e82a6f250e8"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: ביטויים אלגבריים.",
      "Source subtopic: כינוס איברים דומים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1_yTHzVIzQrWlV_OHdG6jaE3OqCBFkF3p/preview",
    "download": "https://drive.google.com/uc?export=download&id=1_yTHzVIzQrWlV_OHdG6jaE3OqCBFkF3p"
  },
  {
    "id": "src-game-z-60363fb6650a",
    "title": "כינוס איברים דומים -דף פעילות",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/15O2GP9z-CAOjlIN_LDzAyhDO7iTDUJU_/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-z-60363fb6650a"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: ביטויים אלגבריים.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/15O2GP9z-CAOjlIN_LDzAyhDO7iTDUJU_/preview",
    "download": "https://drive.google.com/uc?export=download&id=15O2GP9z-CAOjlIN_LDzAyhDO7iTDUJU_"
  },
  {
    "id": "src-game-z-a7ad3a34d489",
    "title": "שטיחון משוואות",
    "note": "Explicitly listed in the Grade 7 section of the official games document.",
    "url": "https://drive.google.com/file/d/0B58MLTJub4KJQ3RBV1Y4Z0czUVBsa1JaTmhTQTVNSjJmaWVZ/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "equations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך",
    "sourceRecordIds": [
      "game-z-a7ad3a34d489"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: משוואות.",
      "Source subtopic: פתרון משוואות."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/0B58MLTJub4KJQ3RBV1Y4Z0czUVBsa1JaTmhTQTVNSjJmaWVZ/preview",
    "download": "https://drive.google.com/uc?export=download&id=0B58MLTJub4KJQ3RBV1Y4Z0czUVBsa1JaTmhTQTVNSjJmaWVZ"
  },
  {
    "id": "src-game-z-3ae158381dbe",
    "title": "קלפי משוואות",
    "note": "פיתוח חוש למבנה דרך קלפי ציורים וקלפי משוואות קרדיט: מרכז מורים ארצי ליסודי+שגית רסולי",
    "url": "https://docs.google.com/presentation/d/1OIi9h4XEfnQJqEhyuZVRNPA8fIF56KjCu_3SuwTIV2M/edit",
    "kind": "doc",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "equations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "hybrid",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · מרכז מורים ארצי ליסודי+שגית רסולי",
    "sourceRecordIds": [
      "game-z-3ae158381dbe"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: משוואות.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/presentation/d/1OIi9h4XEfnQJqEhyuZVRNPA8fIF56KjCu_3SuwTIV2M/preview",
    "download": "https://docs.google.com/presentation/d/1OIi9h4XEfnQJqEhyuZVRNPA8fIF56KjCu_3SuwTIV2M/export/pdf"
  },
  {
    "id": "src-game-z-bda6b0c4a124",
    "title": "משחק זכרון",
    "note": "קרדיט: מתמטיקה משולבת-מכון ויצמן",
    "url": "https://drive.google.com/file/d/0B58MLTJub4KJLU90OEJybzRwZWoxSnVxTHZxZU1LZy1GajBZ/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "equations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · מתמטיקה משולבת-מכון ויצמן",
    "sourceRecordIds": [
      "game-z-bda6b0c4a124"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: משוואות.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/0B58MLTJub4KJLU90OEJybzRwZWoxSnVxTHZxZU1LZy1GajBZ/preview",
    "download": "https://drive.google.com/uc?export=download&id=0B58MLTJub4KJLU90OEJybzRwZWoxSnVxTHZxZU1LZy1GajBZ"
  },
  {
    "id": "src-game-z-1fb342ad0a97",
    "title": "הפוך בה",
    "note": "לוטו פתרון משוואות",
    "url": "https://drive.google.com/file/d/0B58MLTJub4KJOTM0NjByVFc3TFlZNVZuSWRkYTVFNEpJUmpV/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "equations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך",
    "sourceRecordIds": [
      "game-z-1fb342ad0a97"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: משוואות.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/0B58MLTJub4KJOTM0NjByVFc3TFlZNVZuSWRkYTVFNEpJUmpV/preview",
    "download": "https://drive.google.com/uc?export=download&id=0B58MLTJub4KJOTM0NjByVFc3TFlZNVZuSWRkYTVFNEpJUmpV"
  },
  {
    "id": "src-game-z-101d82415598",
    "title": "משוואות- רצועות להמחשה",
    "note": "כל רצועה מהווה משוואה שיש לבנות ולפתור קרדיט: (רשא סלאמה)",
    "url": "https://drive.google.com/file/d/1mfHCYjT2z37fBpnU2dy3KHW3A56LzGQ2/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "equations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · (רשא סלאמה)",
    "sourceRecordIds": [
      "game-z-101d82415598"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: משוואות.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1mfHCYjT2z37fBpnU2dy3KHW3A56LzGQ2/preview",
    "download": "https://drive.google.com/uc?export=download&id=1mfHCYjT2z37fBpnU2dy3KHW3A56LzGQ2"
  },
  {
    "id": "src-game-z-9d2549a4296f",
    "title": "משוואות - סודוקו שרשרת",
    "note": "ללא מספרים מכוונים קרדיט: סמיון ויינר",
    "url": "https://drive.google.com/file/d/19nXDQgprWNuPZ22hcCVTILqnPMUDcAfq/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "equations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · סמיון ויינר",
    "sourceRecordIds": [
      "game-z-9d2549a4296f"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: משוואות.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/19nXDQgprWNuPZ22hcCVTILqnPMUDcAfq/preview",
    "download": "https://drive.google.com/uc?export=download&id=19nXDQgprWNuPZ22hcCVTILqnPMUDcAfq"
  },
  {
    "id": "src-game-z-6821aaaaa55c",
    "title": "דפי צביעה משוואות",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1XfwN_dvLnNbdDX-qyVcRmdGF_knEeDfw/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "equations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-z-6821aaaaa55c"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: משוואות.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1XfwN_dvLnNbdDX-qyVcRmdGF_knEeDfw/preview",
    "download": "https://drive.google.com/uc?export=download&id=1XfwN_dvLnNbdDX-qyVcRmdGF_knEeDfw"
  },
  {
    "id": "src-game-z-f12830e08dc1",
    "title": "פאזל משוואות",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/19Yf_rfxwqMlmtS0UTuQuc7RkRVrGhFQD/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "equations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-z-f12830e08dc1"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: משוואות.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/19Yf_rfxwqMlmtS0UTuQuc7RkRVrGhFQD/preview",
    "download": "https://drive.google.com/uc?export=download&id=19Yf_rfxwqMlmtS0UTuQuc7RkRVrGhFQD"
  },
  {
    "id": "src-game-z-f01af038baa3",
    "title": "משוואות דרך ציורים",
    "note": "פיתוח ראייה תבניתית בפתרון משוואות קרדיט: מרכז ארצי למורים יסודי",
    "url": "https://drive.google.com/file/d/0B58MLTJub4KJRV93a3B0cVZrOGNxT1FrRlV0M0FIVXc3Z0tv/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "equations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · מרכז ארצי למורים יסודי",
    "sourceRecordIds": [
      "game-z-f01af038baa3"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: משוואות.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/0B58MLTJub4KJRV93a3B0cVZrOGNxT1FrRlV0M0FIVXc3Z0tv/preview",
    "download": "https://drive.google.com/uc?export=download&id=0B58MLTJub4KJRV93a3B0cVZrOGNxT1FrRlV0M0FIVXc3Z0tv"
  },
  {
    "id": "src-game-z-b63873233827",
    "title": "משחק המשוואות",
    "note": "Explicitly listed in the Grade 7 section of the official games document.",
    "url": "https://drive.google.com/file/d/1jwTFLneQhpWDqRLa-dfvrsGJ2X594XsB/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "equations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך",
    "sourceRecordIds": [
      "game-z-b63873233827"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: משוואות.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1jwTFLneQhpWDqRLa-dfvrsGJ2X594XsB/preview",
    "download": "https://drive.google.com/uc?export=download&id=1jwTFLneQhpWDqRLa-dfvrsGJ2X594XsB"
  },
  {
    "id": "src-game-z-ceb0b551eb94",
    "title": "בינגו משוואות",
    "note": "קרדיט: בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1EWBJkIuvhMB5cPXQ-YT2L2QQVOoVcric/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "equations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · בתיה מירזאיב",
    "sourceRecordIds": [
      "game-z-ceb0b551eb94"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: משוואות.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1EWBJkIuvhMB5cPXQ-YT2L2QQVOoVcric/preview",
    "download": "https://drive.google.com/uc?export=download&id=1EWBJkIuvhMB5cPXQ-YT2L2QQVOoVcric"
  },
  {
    "id": "src-game-z-02b2223a8bfd",
    "title": "מצאו את השאלה - תיבה וקוביה",
    "note": "קרדיט: סמיון ויינר",
    "url": "https://drive.google.com/file/d/1e45R7ZhhpK9JA-NM_1AEiIjV_rQwOjvp/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "box-cube"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · סמיון ויינר",
    "sourceRecordIds": [
      "game-z-02b2223a8bfd"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: תיבה וקוביה.",
      "Source subtopic: תיבה וקוביה."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1e45R7ZhhpK9JA-NM_1AEiIjV_rQwOjvp/preview",
    "download": "https://drive.google.com/uc?export=download&id=1e45R7ZhhpK9JA-NM_1AEiIjV_rQwOjvp"
  },
  {
    "id": "src-game-z-012df6acfa6c",
    "title": "צוללות",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1RWlg7OnV8PYz8mkrCgHbe4If_YyL701y/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "coordinate-system"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-z-012df6acfa6c"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: מערכת צירים.",
      "Source subtopic: נקודות במערכת צירים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1RWlg7OnV8PYz8mkrCgHbe4If_YyL701y/preview",
    "download": "https://drive.google.com/uc?export=download&id=1RWlg7OnV8PYz8mkrCgHbe4If_YyL701y"
  },
  {
    "id": "src-game-z-31c69d9825d3",
    "title": "בינגו סימון נקודות",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/16ZxvyGr9GzyP_uSRlO2MkskmespGasDL/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "coordinate-system"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-z-31c69d9825d3"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: מערכת צירים.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/16ZxvyGr9GzyP_uSRlO2MkskmespGasDL/preview",
    "download": "https://drive.google.com/uc?export=download&id=16ZxvyGr9GzyP_uSRlO2MkskmespGasDL"
  },
  {
    "id": "src-game-z-19d5dcec2194",
    "title": "ארבע בשורה, לוח הגרלה — ארבע",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1aDsLy2UIdTq8ndaGkmqAo06mY1xSNZwe/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "coordinate-system"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-z-19d5dcec2194"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: מערכת צירים.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1aDsLy2UIdTq8ndaGkmqAo06mY1xSNZwe/preview",
    "download": "https://drive.google.com/uc?export=download&id=1aDsLy2UIdTq8ndaGkmqAo06mY1xSNZwe"
  },
  {
    "id": "src-game-z-62287bbdf55d",
    "title": "ארבע בשורה, לוח הגרלה — לוח",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1aj1VLQAJyzw34KC7igXy3MOhfiWKmIJq/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "coordinate-system"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-z-62287bbdf55d"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: מערכת צירים.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1aj1VLQAJyzw34KC7igXy3MOhfiWKmIJq/preview",
    "download": "https://drive.google.com/uc?export=download&id=1aj1VLQAJyzw34KC7igXy3MOhfiWKmIJq"
  },
  {
    "id": "src-game-z-f7c4b5d53e29",
    "title": "פעילות לפתיחת שנה",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1IXG7D8goYt1ZY6UKwCetZXywxQR5sXqv/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "equations",
      "order-of-operations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-z-f7c4b5d53e29"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: חוקי פעולות חשבון.",
      "Source subtopic: סדר פעולות, משוואות בציורים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1IXG7D8goYt1ZY6UKwCetZXywxQR5sXqv/preview",
    "download": "https://drive.google.com/uc?export=download&id=1IXG7D8goYt1ZY6UKwCetZXywxQR5sXqv"
  },
  {
    "id": "src-game-z-f42791d62bf0",
    "title": "סדר פעולות חשבון - צביעת פרפר",
    "note": "מתאים לחנ\"מ קרדיט: סמיון ויינר",
    "url": "https://drive.google.com/file/d/1_V-1kKUxPiJHrPwJCZ5tLGJLSXh1ku8J/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "order-of-operations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · סמיון ויינר",
    "sourceRecordIds": [
      "game-z-f42791d62bf0"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: חוקי פעולות חשבון.",
      "Source subtopic: סדר פעולות חשבון."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1_V-1kKUxPiJHrPwJCZ5tLGJLSXh1ku8J/preview",
    "download": "https://drive.google.com/uc?export=download&id=1_V-1kKUxPiJHrPwJCZ5tLGJLSXh1ku8J"
  },
  {
    "id": "src-game-z-ba0b5e482c5f",
    "title": "לוחות בינגו",
    "note": "ללא שורש ריבועי וחזקות קרדיט: סמיון ויינר",
    "url": "https://drive.google.com/file/d/1eKFKpJJnQ_CQDKGQ3oTG5Pv3D4pyj4b2/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "order-of-operations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · סמיון ויינר",
    "sourceRecordIds": [
      "game-z-ba0b5e482c5f"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: חוקי פעולות חשבון.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1eKFKpJJnQ_CQDKGQ3oTG5Pv3D4pyj4b2/preview",
    "download": "https://drive.google.com/uc?export=download&id=1eKFKpJJnQ_CQDKGQ3oTG5Pv3D4pyj4b2"
  },
  {
    "id": "src-game-z-4f0b4eca7eb2",
    "title": "חוק הפילוג-מבוך",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1zCJWaWVZtj97Gtl47HZ6MrA7p7pz2zOC/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive",
      "order-of-operations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-z-4f0b4eca7eb2"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: חוקי פעולות חשבון.",
      "Source subtopic: חוק הפילוג-פישוט."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1zCJWaWVZtj97Gtl47HZ6MrA7p7pz2zOC/preview",
    "download": "https://drive.google.com/uc?export=download&id=1zCJWaWVZtj97Gtl47HZ6MrA7p7pz2zOC"
  },
  {
    "id": "src-game-z-3e926d886ff2",
    "title": "הזמר במסיכה - סדר פעולות חשבון",
    "note": "עם שורש ריבועי וחזקות קרדיט: סמיון ויינר",
    "url": "https://drive.google.com/file/d/1nKKpt8Jr3i5D2l-2BkZ7aXMXuT8ZKARz/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "order-of-operations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · סמיון ויינר",
    "sourceRecordIds": [
      "game-z-3e926d886ff2"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: חוקי פעולות חשבון.",
      "Source subtopic: סדר פעולות חשבון עם חזקות ושורשים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1nKKpt8Jr3i5D2l-2BkZ7aXMXuT8ZKARz/preview",
    "download": "https://drive.google.com/uc?export=download&id=1nKKpt8Jr3i5D2l-2BkZ7aXMXuT8ZKARz"
  },
  {
    "id": "src-game-z-602b96061488",
    "title": "סביבון המספרים המכוונים",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/13Tv8DffOYQnBbdgenFXyXHO_5ZpqTege/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "directed-numbers"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-z-602b96061488"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: מספרים מכוונים.",
      "Source subtopic: פעולות חשבון במספרים מכוונים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/13Tv8DffOYQnBbdgenFXyXHO_5ZpqTege/preview",
    "download": "https://drive.google.com/uc?export=download&id=13Tv8DffOYQnBbdgenFXyXHO_5ZpqTege"
  },
  {
    "id": "src-game-z-21f195d851f1",
    "title": "כפל וחילוק מספרים מכוונים",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1KET_BpSUBP6zJePpJ6JA0F7khb5ge_if/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "directed-numbers"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-z-21f195d851f1"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: מספרים מכוונים.",
      "Source subtopic: כפל וחילוק מספרים מכוונים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1KET_BpSUBP6zJePpJ6JA0F7khb5ge_if/preview",
    "download": "https://drive.google.com/uc?export=download&id=1KET_BpSUBP6zJePpJ6JA0F7khb5ge_if"
  },
  {
    "id": "src-game-z-e31795fef3c2",
    "title": "דף 1, דף 2 — דף",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1vqr4hNJWg9ilvZdXOGDiwaa_Dg6tkptw/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "directed-numbers"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-z-e31795fef3c2"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: מספרים מכוונים.",
      "Source subtopic: חיבור וחיסור מספרים מכוונים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1vqr4hNJWg9ilvZdXOGDiwaa_Dg6tkptw/preview",
    "download": "https://drive.google.com/uc?export=download&id=1vqr4hNJWg9ilvZdXOGDiwaa_Dg6tkptw"
  },
  {
    "id": "src-game-z-fbae9c9dcc77",
    "title": "דף 1, דף 2 — דף",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1r0JmqGJ_KJ6QvrudlowfJg0ENQgszBvX/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "directed-numbers"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-z-fbae9c9dcc77"
    ],
    "evidence": [
      "Explicitly listed in the Grade 7 section of the official games document.",
      "Source topic: מספרים מכוונים.",
      "Source subtopic: חיבור וחיסור מספרים מכוונים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1r0JmqGJ_KJ6QvrudlowfJg0ENQgszBvX/preview",
    "download": "https://drive.google.com/uc?export=download&id=1r0JmqGJ_KJ6QvrudlowfJg0ENQgszBvX"
  },
  {
    "id": "src-game-h-6cbeef0c951a",
    "title": "נקודות חיתוך עם ציר ה X",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/12ZkzbGVvyKFQ94r2V5iFDfE3FEG_A4b9/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "linear-function"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-h-6cbeef0c951a"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: פונקציה קווית.",
      "Source subtopic: נקודות חיתוך עם ציר ה X."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/12ZkzbGVvyKFQ94r2V5iFDfE3FEG_A4b9/preview",
    "download": "https://drive.google.com/uc?export=download&id=12ZkzbGVvyKFQ94r2V5iFDfE3FEG_A4b9"
  },
  {
    "id": "src-game-h-67ac155f019d",
    "title": "פאזל פונקציה קווית",
    "note": "Explicitly listed in the Grade 8 section of the official games document.",
    "url": "https://drive.google.com/file/d/0B58MLTJub4KJR2JvZTJEa2tobEI1ZE43UWlxYU9PNktQUEM4/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "linear-function"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך",
    "sourceRecordIds": [
      "game-h-67ac155f019d"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: פונקציה קווית.",
      "Source subtopic: ייצוגים שונים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/0B58MLTJub4KJR2JvZTJEa2tobEI1ZE43UWlxYU9PNktQUEM4/preview",
    "download": "https://drive.google.com/uc?export=download&id=0B58MLTJub4KJR2JvZTJEa2tobEI1ZE43UWlxYU9PNktQUEM4"
  },
  {
    "id": "src-game-h-496135f41e40",
    "title": "הנחיות למשחק התאמות- פונקציה קווית — קלפים למשחק התאמות- פונקציה קווית — הנחיות",
    "note": "קרדיט: underground",
    "url": "https://drive.google.com/file/d/1cO0bTl1tmRvpwfB_4nzYvBzNbDNvWmt6/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "linear-function"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · underground",
    "sourceRecordIds": [
      "game-h-496135f41e40"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: פונקציה קווית.",
      "Source subtopic: ייצוג אלגברי ותכונות הישר."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1cO0bTl1tmRvpwfB_4nzYvBzNbDNvWmt6/preview",
    "download": "https://drive.google.com/uc?export=download&id=1cO0bTl1tmRvpwfB_4nzYvBzNbDNvWmt6"
  },
  {
    "id": "src-game-h-807bccfd80e5",
    "title": "הנחיות למשחק התאמות- פונקציה קווית — קלפים למשחק התאמות- פונקציה קווית — קלפים",
    "note": "קרדיט: underground",
    "url": "https://drive.google.com/file/d/1PS4unIXpY82K8YCx_D3BnmRizIhShe6R/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "linear-function"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · underground",
    "sourceRecordIds": [
      "game-h-807bccfd80e5"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: פונקציה קווית.",
      "Source subtopic: ייצוג אלגברי ותכונות הישר."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1PS4unIXpY82K8YCx_D3BnmRizIhShe6R/preview",
    "download": "https://drive.google.com/uc?export=download&id=1PS4unIXpY82K8YCx_D3BnmRizIhShe6R"
  },
  {
    "id": "src-game-h-5f1c6a2e5e03",
    "title": "לוטו פונקציה קווית",
    "note": "Explicitly listed in the Grade 8 section of the official games document.",
    "url": "https://drive.google.com/file/d/0B58MLTJub4KJYnQtOHhfTlpyc3doOGNneU9kcmNyLU9pMUZj/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "linear-function",
      "equations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך",
    "sourceRecordIds": [
      "game-h-5f1c6a2e5e03"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: פונקציה קווית.",
      "Source subtopic: משוואת ישר."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/0B58MLTJub4KJYnQtOHhfTlpyc3doOGNneU9kcmNyLU9pMUZj/preview",
    "download": "https://drive.google.com/uc?export=download&id=0B58MLTJub4KJYnQtOHhfTlpyc3doOGNneU9kcmNyLU9pMUZj"
  },
  {
    "id": "src-game-h-a050967f185b",
    "title": "פונקציה קווית , דף הסבר — פונקציה",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1mYBk-eykdXp5FY309UjAUReV7xzAemlE/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "linear-function"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-h-a050967f185b"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: פונקציה קווית.",
      "Source subtopic: נקודות חיתוך עם הצירים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1mYBk-eykdXp5FY309UjAUReV7xzAemlE/preview",
    "download": "https://drive.google.com/uc?export=download&id=1mYBk-eykdXp5FY309UjAUReV7xzAemlE"
  },
  {
    "id": "src-game-h-a4bd43f4ebf3",
    "title": "פונקציה קווית , דף הסבר — דף",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1lwRO_nEtHkK_ao-ovM5rrfcvW6qp-fuA/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "linear-function"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-h-a4bd43f4ebf3"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: פונקציה קווית.",
      "Source subtopic: נקודות חיתוך עם הצירים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1lwRO_nEtHkK_ao-ovM5rrfcvW6qp-fuA/preview",
    "download": "https://drive.google.com/uc?export=download&id=1lwRO_nEtHkK_ao-ovM5rrfcvW6qp-fuA"
  },
  {
    "id": "src-game-h-f3a21b552630",
    "title": "חי צומח דומם פונקציה קווית — טופס הגרלת הפונקציות — חי",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/17vrIe9gllzNmBMFLWWY6CkyGA6EgaVGM/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "linear-function"
    ],
    "collections": [
      "games",
      "summaries"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-h-f3a21b552630"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: פונקציה קווית.",
      "Source subtopic: מאפייני הפונקציה הקווית סיכום."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/17vrIe9gllzNmBMFLWWY6CkyGA6EgaVGM/preview",
    "download": "https://drive.google.com/uc?export=download&id=17vrIe9gllzNmBMFLWWY6CkyGA6EgaVGM"
  },
  {
    "id": "src-game-h-58cc4f488e83",
    "title": "חי צומח דומם פונקציה קווית — טופס הגרלת הפונקציות — טופס",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1tyaMalmiUJqUuD_yg3m-GgGqy3Tthgkz/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "linear-function"
    ],
    "collections": [
      "games",
      "summaries"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-h-58cc4f488e83"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: פונקציה קווית.",
      "Source subtopic: מאפייני הפונקציה הקווית סיכום."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1tyaMalmiUJqUuD_yg3m-GgGqy3Tthgkz/preview",
    "download": "https://drive.google.com/uc?export=download&id=1tyaMalmiUJqUuD_yg3m-GgGqy3Tthgkz"
  },
  {
    "id": "src-game-h-fe374680a0bb",
    "title": "דומינו מעבר בין ייצוגים",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1aABS-7aIxHHGOZu7smLqMEWau6cAG2My/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "linear-function"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-h-fe374680a0bb"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: פונקציה קווית.",
      "Source subtopic: ייצוגים שונים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1aABS-7aIxHHGOZu7smLqMEWau6cAG2My/preview",
    "download": "https://drive.google.com/uc?export=download&id=1aABS-7aIxHHGOZu7smLqMEWau6cAG2My"
  },
  {
    "id": "src-game-h-266e772cc1d9",
    "title": "מאפייני הפונקציה הקווית-דומינו",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1ONlDY-y0Hi9QIiuFScsjw6duZuww-Mnp/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "linear-function"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-h-266e772cc1d9"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: פונקציה קווית.",
      "Source subtopic: מאפייני הפונקציה הקווית."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1ONlDY-y0Hi9QIiuFScsjw6duZuww-Mnp/preview",
    "download": "https://drive.google.com/uc?export=download&id=1ONlDY-y0Hi9QIiuFScsjw6duZuww-Mnp"
  },
  {
    "id": "src-game-h-3d3adea92f4d",
    "title": "כרטיסיות להגרלה, לוחות בינגו — כרטיסיות",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1CvFY7Hmn7TnB5znR-No0xCFi2Rkpj2fw/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "linear-function",
      "equations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-h-3d3adea92f4d"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: פונקציה קווית.",
      "Source subtopic: משוואת ישר."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1CvFY7Hmn7TnB5znR-No0xCFi2Rkpj2fw/preview",
    "download": "https://drive.google.com/uc?export=download&id=1CvFY7Hmn7TnB5znR-No0xCFi2Rkpj2fw"
  },
  {
    "id": "src-game-h-7c9e1de73af8",
    "title": "כרטיסיות להגרלה, לוחות בינגו — לוחות",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/14hZs2m5xp0L3oW9kohOcrvFe4tlHtJfG/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "linear-function",
      "equations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-h-7c9e1de73af8"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: פונקציה קווית.",
      "Source subtopic: משוואת ישר."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/14hZs2m5xp0L3oW9kohOcrvFe4tlHtJfG/preview",
    "download": "https://drive.google.com/uc?export=download&id=14hZs2m5xp0L3oW9kohOcrvFe4tlHtJfG"
  },
  {
    "id": "src-game-h-b928fe90f53f",
    "title": "המירוץ לפונקצייה קווית , הוראות משחק — המירוץ",
    "note": "קרדיט: עטרה קרבלו",
    "url": "https://drive.google.com/file/d/1ZZ0ImWSvVnrRza06t-K5PLDWgreua2Uq/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "linear-function"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · עטרה קרבלו",
    "sourceRecordIds": [
      "game-h-b928fe90f53f"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: פונקציה קווית.",
      "Source subtopic: ייצוג אלגברי של ישר."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1ZZ0ImWSvVnrRza06t-K5PLDWgreua2Uq/preview",
    "download": "https://drive.google.com/uc?export=download&id=1ZZ0ImWSvVnrRza06t-K5PLDWgreua2Uq"
  },
  {
    "id": "src-game-h-a6b435cade25",
    "title": "המירוץ לפונקצייה קווית , הוראות משחק — הוראות",
    "note": "קרדיט: עטרה קרבלו",
    "url": "https://drive.google.com/file/d/1Ti5qKp2cJ9G_t9bZbwh37xUQFVx9wvcK/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "linear-function"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · עטרה קרבלו",
    "sourceRecordIds": [
      "game-h-a6b435cade25"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: פונקציה קווית.",
      "Source subtopic: ייצוג אלגברי של ישר."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1Ti5qKp2cJ9G_t9bZbwh37xUQFVx9wvcK/preview",
    "download": "https://drive.google.com/uc?export=download&id=1Ti5qKp2cJ9G_t9bZbwh37xUQFVx9wvcK"
  },
  {
    "id": "src-game-h-79f1eccd96f9",
    "title": "פונקציה קווית בחנוכה",
    "note": "פעילויות לחנוכה קרדיט: בתיה מירזאיב",
    "url": "https://drive.google.com/drive/folders/1Sv2iLXVFe_QYhe_3hEIAqCuN_YrlLM7A",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "linear-function",
      "equations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "hybrid",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · בתיה מירזאיב",
    "sourceRecordIds": [
      "game-h-79f1eccd96f9"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: פונקציה קווית.",
      "Source subtopic: שיפוע, משוואת ישר."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/embeddedfolderview?id=1Sv2iLXVFe_QYhe_3hEIAqCuN_YrlLM7A#list"
  },
  {
    "id": "src-game-h-9f82314057a2",
    "title": "סודוקו שיפוע של ישר",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1fS_mN2dliEm7Cn68oj_5QfYqWdKz4Zor/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "linear-function"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-h-9f82314057a2"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: פונקציה קווית.",
      "Source subtopic: שיפוע של ישר."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1fS_mN2dliEm7Cn68oj_5QfYqWdKz4Zor/preview",
    "download": "https://drive.google.com/uc?export=download&id=1fS_mN2dliEm7Cn68oj_5QfYqWdKz4Zor"
  },
  {
    "id": "src-game-h-e9d5af06be0e",
    "title": "התאמה בין גרף לביטוי אלגברי של פונק קווית",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1MFXIXNuttHszM09u3hw1N0jBOBsSSg8a/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "linear-function"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-h-e9d5af06be0e"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: פונקציה קווית.",
      "Source subtopic: התאמה בין גרף לפונקציה."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1MFXIXNuttHszM09u3hw1N0jBOBsSSg8a/preview",
    "download": "https://drive.google.com/uc?export=download&id=1MFXIXNuttHszM09u3hw1N0jBOBsSSg8a"
  },
  {
    "id": "src-game-h-5c715a3e0e8d",
    "title": "משוואות עם מכנים",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1pJQ9iYD8vafi8fdFxhSc6iWl1Y6Ogd8Q/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "equations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-h-5c715a3e0e8d"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: משוואות.",
      "Source subtopic: משוואות עם מכנה מספרי."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1pJQ9iYD8vafi8fdFxhSc6iWl1Y6Ogd8Q/preview",
    "download": "https://drive.google.com/uc?export=download&id=1pJQ9iYD8vafi8fdFxhSc6iWl1Y6Ogd8Q"
  },
  {
    "id": "src-game-h-7a1e51bbee6f",
    "title": "משחק התאמות",
    "note": "פיתוח חוש למבנה במערכת משוואות קרדיט: השראה ממרכז מורים + שגית רסולי",
    "url": "https://docs.google.com/presentation/d/1wV1Wo6zCWIbw84-jyszG5iMW26eu5uszEtNDOaN1fZg/edit",
    "kind": "doc",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "systems-of-equations"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "hybrid",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · השראה ממרכז מורים + שגית רסולי",
    "sourceRecordIds": [
      "game-h-7a1e51bbee6f"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: מערכת משוואות.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/presentation/d/1wV1Wo6zCWIbw84-jyszG5iMW26eu5uszEtNDOaN1fZg/preview",
    "download": "https://docs.google.com/presentation/d/1wV1Wo6zCWIbw84-jyszG5iMW26eu5uszEtNDOaN1fZg/export/pdf"
  },
  {
    "id": "src-game-h-3daa1d1692a2",
    "title": "קופסת בריחה",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1JJoPuFFjX_vutc_KIFb6f8xaKAMqRDfW/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "statistics-graph-reading"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-h-3daa1d1692a2"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: סטטיסטיקה.",
      "Source subtopic: ייצוגים שונים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1JJoPuFFjX_vutc_KIFb6f8xaKAMqRDfW/preview",
    "download": "https://drive.google.com/uc?export=download&id=1JJoPuFFjX_vutc_KIFb6f8xaKAMqRDfW"
  },
  {
    "id": "src-game-h-f2730e69ef22",
    "title": "דגלים - חישוב שטחים והיקפים + פיתגורס",
    "note": "יח\"ל חקר דגלים ממדינות שונות (שטחים והיקפים, חפיפה) קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1vAPRdD_9iEpv5zYFbVC0wPmVRWblckgv/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "areas-perimeters-pythagoras"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-h-f2730e69ef22"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: שטחים והיקפים.",
      "Source subtopic: חישובי שטחים והיקפים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1vAPRdD_9iEpv5zYFbVC0wPmVRWblckgv/preview",
    "download": "https://drive.google.com/uc?export=download&id=1vAPRdD_9iEpv5zYFbVC0wPmVRWblckgv"
  },
  {
    "id": "src-game-h-6b5c3f25c553",
    "title": "תרגול זוויות ומשוואות",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1h7f8xrivFTRtLCg9qEj1Zt7FX2g0X2bz/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "equations",
      "angles"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-h-6b5c3f25c553"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: זוויות ומשוואות.",
      "Source subtopic: חישוב זוויות."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1h7f8xrivFTRtLCg9qEj1Zt7FX2g0X2bz/preview",
    "download": "https://drive.google.com/uc?export=download&id=1h7f8xrivFTRtLCg9qEj1Zt7FX2g0X2bz"
  },
  {
    "id": "src-game-h-15fa15fef39c",
    "title": "בינגו",
    "note": "בינגו עם שאלות קצרות על החומר שנלמד בכיתה ח קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1Hygy1Ar3pH9OBUrMLmvaaIZJibSkM1Gp/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [],
    "collections": [
      "games",
      "summaries"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-h-15fa15fef39c"
    ],
    "evidence": [
      "Explicitly listed in the Grade 8 section of the official games document.",
      "Source topic: כל הנושאים כיתה ח' סיכום.",
      "Source subtopic: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1Hygy1Ar3pH9OBUrMLmvaaIZJibSkM1Gp/preview",
    "download": "https://drive.google.com/uc?export=download&id=1Hygy1Ar3pH9OBUrMLmvaaIZJibSkM1Gp"
  },
  {
    "id": "src-game-t-f96bc54899bb",
    "title": "מחפשים את הדלתון ערכת משחק — ערכת פתרונות — מחפשים",
    "note": "מתאים לפעילות חוץ לבוגרי כיתה ט' או לתחילת כיתה י' קרדיט: אסנת גבאי, מירב ארבל, שירן פרץ",
    "url": "https://drive.google.com/file/d/1e6zEavypSn7CqTSWpbydQKYnKKKnSYOk/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "quadrilaterals",
      "kite",
      "similarity-pythagoras"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · אסנת גבאי, מירב ארבל, שירן פרץ",
    "sourceRecordIds": [
      "game-t-f96bc54899bb"
    ],
    "evidence": [
      "Explicitly listed in the Grade 9 section of the official games document.",
      "Source topic: מרובעים.",
      "Source subtopic: דמיון משולשים, חפיפת משולשים, קטע | אמצעים במשולש.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1e6zEavypSn7CqTSWpbydQKYnKKKnSYOk/preview",
    "download": "https://drive.google.com/uc?export=download&id=1e6zEavypSn7CqTSWpbydQKYnKKKnSYOk"
  },
  {
    "id": "src-game-t-ee9cbe3251c4",
    "title": "מחפשים את הדלתון ערכת משחק — ערכת פתרונות — ערכת",
    "note": "מתאים לפעילות חוץ לבוגרי כיתה ט' או לתחילת כיתה י' קרדיט: אסנת גבאי, מירב ארבל, שירן פרץ",
    "url": "https://drive.google.com/file/d/19WKZCSEjsJHSmZReyDGysUMYB8SRXtbV/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "quadrilaterals",
      "kite",
      "similarity-pythagoras"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · אסנת גבאי, מירב ארבל, שירן פרץ",
    "sourceRecordIds": [
      "game-t-ee9cbe3251c4"
    ],
    "evidence": [
      "Explicitly listed in the Grade 9 section of the official games document.",
      "Source topic: מרובעים.",
      "Source subtopic: דמיון משולשים, חפיפת משולשים, קטע | אמצעים במשולש.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/19WKZCSEjsJHSmZReyDGysUMYB8SRXtbV/preview",
    "download": "https://drive.google.com/uc?export=download&id=19WKZCSEjsJHSmZReyDGysUMYB8SRXtbV"
  },
  {
    "id": "src-game-t-b2c647299984",
    "title": "התאמת משפטים בגיאומטריה",
    "note": "מתאים לכל שכבת גיל. מומלץ לבחור חלק מהמשפטים , לגזור ולהתאים בין המשפט בייצוגים שונים",
    "url": "https://drive.google.com/file/d/0B58MLTJub4KJN0pGTnZvZzdQX2syWk8tem80bDdtWUF5SDRz/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "geometry-theorems-proofs"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך",
    "sourceRecordIds": [
      "game-t-b2c647299984"
    ],
    "evidence": [
      "Explicitly listed in the Grade 9 section of the official games document.",
      "Source topic: כל המשפטים שנלמדו בגיאומטריה.",
      "Source subtopic: התאמת משפטים בייצוג מילולי/שרטוט/ | כתיב מתמטי."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/0B58MLTJub4KJN0pGTnZvZzdQX2syWk8tem80bDdtWUF5SDRz/preview",
    "download": "https://drive.google.com/uc?export=download&id=0B58MLTJub4KJN0pGTnZvZzdQX2syWk8tem80bDdtWUF5SDRz"
  },
  {
    "id": "src-game-t-d0d5af728b47",
    "title": "בינגו גיאומטריה",
    "note": "יש לגזור את הדף השני (תכונות) ולהכניס לקופסא. לשלוף כל פעם את אחת מהתכונות. | לכל תלמיד או לזוגות יש לחלק את הדף הראשון הכולל את הצורות הגיאומטריות קרדיט: רגינה צ'ולסקי, | ד\"ר רויטל איזיק",
    "url": "https://drive.google.com/file/d/1M1QiMJJbIoJ8QeAwq6TTMiNXwoS9TpM0/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "geometry-theorems-proofs"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · רגינה צ'ולסקי, | ד\"ר רויטל איזיק",
    "sourceRecordIds": [
      "game-t-d0d5af728b47"
    ],
    "evidence": [
      "Explicitly listed in the Grade 9 section of the official games document.",
      "Source topic: גיאומטריה.",
      "Source subtopic: משפטים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1M1QiMJJbIoJ8QeAwq6TTMiNXwoS9TpM0/preview",
    "download": "https://drive.google.com/uc?export=download&id=1M1QiMJJbIoJ8QeAwq6TTMiNXwoS9TpM0"
  },
  {
    "id": "src-game-t-4511fce03b20",
    "title": "דומינו חוק הפילוג המורחב. — דף פעילות — דומינו",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1G41LJTpqJW9LJl1AgNOGROaag9VQOQps/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "algebraic-technique"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-t-4511fce03b20"
    ],
    "evidence": [
      "Explicitly listed in the Grade 9 section of the official games document.",
      "Source topic: חוק הפילוג.",
      "Source subtopic: חוק הפילוג המורחב."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1G41LJTpqJW9LJl1AgNOGROaag9VQOQps/preview",
    "download": "https://drive.google.com/uc?export=download&id=1G41LJTpqJW9LJl1AgNOGROaag9VQOQps"
  },
  {
    "id": "src-game-t-13edad04d513",
    "title": "דומינו חוק הפילוג המורחב. — דף פעילות — דף",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1-2THi57lkjXNZIoLyFVevLiFdLNSaKn0/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "algebraic-technique"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-t-13edad04d513"
    ],
    "evidence": [
      "Explicitly listed in the Grade 9 section of the official games document.",
      "Source topic: חוק הפילוג.",
      "Source subtopic: חוק הפילוג המורחב."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1-2THi57lkjXNZIoLyFVevLiFdLNSaKn0/preview",
    "download": "https://drive.google.com/uc?export=download&id=1-2THi57lkjXNZIoLyFVevLiFdLNSaKn0"
  },
  {
    "id": "src-game-t-9fbb30cdc0e3",
    "title": "שטיחון פירוק לגורמים",
    "note": "Explicitly listed in the Grade 9 section of the official games document.",
    "url": "https://drive.google.com/file/d/0B58MLTJub4KJLXMyRU5kYTFqbDF2QnAxU2tmTkFiaFdrN2gw/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "algebraic-technique"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך",
    "sourceRecordIds": [
      "game-t-9fbb30cdc0e3"
    ],
    "evidence": [
      "Explicitly listed in the Grade 9 section of the official games document.",
      "Source topic: פירוק לגורמים.",
      "Source subtopic: נוסחאות הכפל המקוצר, פירוק לגורמים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/0B58MLTJub4KJLXMyRU5kYTFqbDF2QnAxU2tmTkFiaFdrN2gw/preview",
    "download": "https://drive.google.com/uc?export=download&id=0B58MLTJub4KJLXMyRU5kYTFqbDF2QnAxU2tmTkFiaFdrN2gw"
  },
  {
    "id": "src-game-t-ea21f3af58b3",
    "title": "פאזל פירוק לגורמים",
    "note": "Explicitly listed in the Grade 9 section of the official games document.",
    "url": "https://drive.google.com/file/d/0B58MLTJub4KJZXdqVzhkMFMzQ2I0OEh5Z2xWNWtzc3dCM1BB/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "algebraic-technique"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך",
    "sourceRecordIds": [
      "game-t-ea21f3af58b3"
    ],
    "evidence": [
      "Explicitly listed in the Grade 9 section of the official games document.",
      "Source topic: פירוק לגורמים.",
      "Source subtopic: חוק הפילוג המורחב, נוסחאות הכפל המקוצר, | פירוק לגורמים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/0B58MLTJub4KJZXdqVzhkMFMzQ2I0OEh5Z2xWNWtzc3dCM1BB/preview",
    "download": "https://drive.google.com/uc?export=download&id=0B58MLTJub4KJZXdqVzhkMFMzQ2I0OEh5Z2xWNWtzc3dCM1BB"
  },
  {
    "id": "src-game-t-76669b599f22",
    "title": "נוסחאות כפל מקוצר",
    "note": "משחק התאמות והצעה לדף עבודה קרדיט: שגית רסולי",
    "url": "https://docs.google.com/presentation/d/1AMdQlzavKloRRTm8_KqgY1uqBgRFwX4nDOMGgpp-Cyg/edit",
    "kind": "doc",
    "grades": [
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "algebraic-technique"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "hybrid",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · שגית רסולי",
    "sourceRecordIds": [
      "game-t-76669b599f22"
    ],
    "evidence": [
      "Explicitly listed in the Grade 9 section of the official games document.",
      "Source topic: פירוק לגורמים.",
      "Source subtopic: נוסחאות כפל מקוצר."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/presentation/d/1AMdQlzavKloRRTm8_KqgY1uqBgRFwX4nDOMGgpp-Cyg/preview",
    "download": "https://docs.google.com/presentation/d/1AMdQlzavKloRRTm8_KqgY1uqBgRFwX4nDOMGgpp-Cyg/export/pdf"
  },
  {
    "id": "src-game-t-168e283baaa2",
    "title": "דומינו- התאמה בין פונקציה לגרף",
    "note": "Explicitly listed in the Grade 9 section of the official games document.",
    "url": "https://drive.google.com/file/d/0B58MLTJub4KJSE1PRkh2YzZCRWs0SFhUM2ZkTFh1SDFLX2JN/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "functions-preanalysis"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך",
    "sourceRecordIds": [
      "game-t-168e283baaa2"
    ],
    "evidence": [
      "Explicitly listed in the Grade 9 section of the official games document.",
      "Source topic: פונקציה קווית וריבועית.",
      "Source subtopic: התאמת גרף לפונקציה."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/0B58MLTJub4KJSE1PRkh2YzZCRWs0SFhUM2ZkTFh1SDFLX2JN/preview",
    "download": "https://drive.google.com/uc?export=download&id=0B58MLTJub4KJSE1PRkh2YzZCRWs0SFhUM2ZkTFh1SDFLX2JN"
  },
  {
    "id": "src-game-t-c006d81e537d",
    "title": "פאזל הצבות",
    "note": "Explicitly listed in the Grade 9 section of the official games document.",
    "url": "https://drive.google.com/file/d/1iDh-9zXCWsmOShH2i4QK_Tul2xmGTdLI/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "functions-preanalysis"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך",
    "sourceRecordIds": [
      "game-t-c006d81e537d"
    ],
    "evidence": [
      "Explicitly listed in the Grade 9 section of the official games document.",
      "Source topic: פונקציה קווית וריבועית.",
      "Source subtopic: התאמת הצבה לפונקציה מתאימה."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1iDh-9zXCWsmOShH2i4QK_Tul2xmGTdLI/preview",
    "download": "https://drive.google.com/uc?export=download&id=1iDh-9zXCWsmOShH2i4QK_Tul2xmGTdLI"
  },
  {
    "id": "src-game-t-05373c5c4a26",
    "title": "פאזל פרבולות.",
    "note": "Explicitly listed in the Grade 9 section of the official games document.",
    "url": "https://drive.google.com/file/d/1XwAwycAIiTKZLO9pYmqUEmHpQiJwXQ6Z/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "quadratic-function"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך",
    "sourceRecordIds": [
      "game-t-05373c5c4a26"
    ],
    "evidence": [
      "Explicitly listed in the Grade 9 section of the official games document.",
      "Source topic: פונקציה ריבועית.",
      "Source subtopic: נק' על פונקציה ריבועית."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1XwAwycAIiTKZLO9pYmqUEmHpQiJwXQ6Z/preview",
    "download": "https://drive.google.com/uc?export=download&id=1XwAwycAIiTKZLO9pYmqUEmHpQiJwXQ6Z"
  },
  {
    "id": "src-game-t-38f83b261a02",
    "title": "בינגו זיהוי מקדמים של פונקציה ריבועית — כרטיסיות הגרלה — בינגו",
    "note": "מתאים לרמה ט' מצומצמת קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1FlY_Nia16uiHuHZ4YcVsc0NFdYD24cy0/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "quadratic-function"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-t-38f83b261a02"
    ],
    "evidence": [
      "Explicitly listed in the Grade 9 section of the official games document.",
      "Source topic: פונקציה ריבועית.",
      "Source subtopic: מקדמי פונקציה ריבועית."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1FlY_Nia16uiHuHZ4YcVsc0NFdYD24cy0/preview",
    "download": "https://drive.google.com/uc?export=download&id=1FlY_Nia16uiHuHZ4YcVsc0NFdYD24cy0"
  },
  {
    "id": "src-game-t-8253c1eb9506",
    "title": "בינגו זיהוי מקדמים של פונקציה ריבועית — כרטיסיות הגרלה — כרטיסיות",
    "note": "מתאים לרמה ט' מצומצמת קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1cRl5CoSX8V3LJRJC4a5SWDZN5TTIoRxQ/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "quadratic-function"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-t-8253c1eb9506"
    ],
    "evidence": [
      "Explicitly listed in the Grade 9 section of the official games document.",
      "Source topic: פונקציה ריבועית.",
      "Source subtopic: מקדמי פונקציה ריבועית."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1cRl5CoSX8V3LJRJC4a5SWDZN5TTIoRxQ/preview",
    "download": "https://drive.google.com/uc?export=download&id=1cRl5CoSX8V3LJRJC4a5SWDZN5TTIoRxQ"
  },
  {
    "id": "src-game-t-84a73f3b5de9",
    "title": "מאפייני הפונקציה הריבועית-דומינו",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1My2W7rFT_6GEyIfvLc1szpuRcv6Riw37/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "quadratic-function"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-t-84a73f3b5de9"
    ],
    "evidence": [
      "Explicitly listed in the Grade 9 section of the official games document.",
      "Source topic: פונקציה ריבועית.",
      "Source subtopic: תכונות הפונקציה הריבועית."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1My2W7rFT_6GEyIfvLc1szpuRcv6Riw37/preview",
    "download": "https://drive.google.com/uc?export=download&id=1My2W7rFT_6GEyIfvLc1szpuRcv6Riw37"
  },
  {
    "id": "src-game-t-6a25b23e0c4e",
    "title": "בינגו קודקוד הפרבולה לוחות, גלגל הגרלה — לוחות",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://drive.google.com/file/d/1pyIYapxU3X-lGUZQp8Cn1KtiwlYBBoGq/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "quadratic-function"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-t-6a25b23e0c4e"
    ],
    "evidence": [
      "Explicitly listed in the Grade 9 section of the official games document.",
      "Source topic: פונקציה ריבועית.",
      "Source subtopic: מציאת קודקוד הפרבולה בייצוגים אלגבריים שונים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1pyIYapxU3X-lGUZQp8Cn1KtiwlYBBoGq/preview",
    "download": "https://drive.google.com/uc?export=download&id=1pyIYapxU3X-lGUZQp8Cn1KtiwlYBBoGq"
  },
  {
    "id": "src-game-t-3b8a123059d1",
    "title": "בינגו קודקוד הפרבולה לוחות, גלגל הגרלה — גלגל",
    "note": "קרדיט: למידה זה שם המשחק- | בתיה מירזאיב",
    "url": "https://wheelofnames.com/he/2gb-ted?fbclid=IwAR2LScs14mOs6zN2faQNgzE0EUjGcgAZf5civJn8gEFh8uHhZWzSdceZN9U",
    "kind": "link",
    "grades": [
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "quadratic-function"
    ],
    "collections": [
      "games"
    ],
    "resourceType": "game",
    "delivery": "printable",
    "source": "מתוך משחקים מתמטיקה — משרד החינוך · למידה זה שם המשחק- | בתיה מירזאיב",
    "sourceRecordIds": [
      "game-t-3b8a123059d1"
    ],
    "evidence": [
      "Explicitly listed in the Grade 9 section of the official games document.",
      "Source topic: פונקציה ריבועית.",
      "Source subtopic: מציאת קודקוד הפרבולה בייצוגים אלגבריים שונים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false
  },
  {
    "id": "src-curriculum-dfa0b51f00ee",
    "title": "שטח משולש במערכת צירים-צוות המודל חטב - ערבית — שטח",
    "note": "משימת חקר - חישוב שטח משולש במערכת צירים, של משולש שצלעותיו אינן מקבילות לאחד הצירים",
    "url": "https://drive.google.com/file/d/1SXW6Lg9jwYkQVmMJQaAaWsFun2i7ShSv/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "areas-perimeters"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-dfa0b51f00ee"
    ],
    "evidence": [
      "Explicit source grade label: ז'.",
      "Source topic: שטח משולש במערכת צירים.",
      "Source description: משימת חקר - חישוב שטח משולש במערכת צירים, של משולש שצלעותיו אינן מקבילות לאחד הצירים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1SXW6Lg9jwYkQVmMJQaAaWsFun2i7ShSv/preview",
    "download": "https://drive.google.com/uc?export=download&id=1SXW6Lg9jwYkQVmMJQaAaWsFun2i7ShSv"
  },
  {
    "id": "src-curriculum-5164db8ab8b5",
    "title": "שטח משולש במערכת צירים-צוות המודל חטב - ערבית — ערבית",
    "note": "משימת חקר - חישוב שטח משולש במערכת צירים, של משולש שצלעותיו אינן מקבילות לאחד הצירים",
    "url": "https://docs.google.com/document/d/1B57C_rBaNO5MIWAzrHgYjd8nOVGuMarS/edit",
    "kind": "doc",
    "grades": [
      "z"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "areas-perimeters"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-5164db8ab8b5"
    ],
    "evidence": [
      "Explicit source grade label: ז'.",
      "Source topic: שטח משולש במערכת צירים.",
      "Source description: משימת חקר - חישוב שטח משולש במערכת צירים, של משולש שצלעותיו אינן מקבילות לאחד הצירים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1B57C_rBaNO5MIWAzrHgYjd8nOVGuMarS/preview",
    "download": "https://docs.google.com/document/d/1B57C_rBaNO5MIWAzrHgYjd8nOVGuMarS/export?format=pdf"
  },
  {
    "id": "src-curriculum-ce1a6eb8d15b",
    "title": "משימה מסכמת אינטגרטיבית מערכת צירים-צוות המודל חטב - ערבית — משימה",
    "note": "משימה מסכמת אינטגרטיבית",
    "url": "https://drive.google.com/file/d/1MD7vTbiDb0AhRj8d26qkOgsrFd85VrWd/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [],
    "sourceTopicIds": [
      "coordinate-system"
    ],
    "collections": [
      "summaries",
      "printable"
    ],
    "resourceType": "summary-task",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-ce1a6eb8d15b"
    ],
    "evidence": [
      "Explicit source grade label: ז'.",
      "Source topic: מערכת צירים.",
      "Source description: משימה מסכמת אינטגרטיבית."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1MD7vTbiDb0AhRj8d26qkOgsrFd85VrWd/preview",
    "download": "https://drive.google.com/uc?export=download&id=1MD7vTbiDb0AhRj8d26qkOgsrFd85VrWd"
  },
  {
    "id": "src-curriculum-809af3373f22",
    "title": "משימה מסכמת אינטגרטיבית מערכת צירים-צוות המודל חטב - ערבית — ערבית",
    "note": "משימה מסכמת אינטגרטיבית",
    "url": "https://drive.google.com/file/d/1cfqrDYJNP0ieA64cTSGM13OpSYsoBo1D/view",
    "kind": "drive",
    "grades": [
      "z"
    ],
    "domains": [],
    "sourceTopicIds": [
      "coordinate-system"
    ],
    "collections": [
      "summaries",
      "printable"
    ],
    "resourceType": "summary-task",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-809af3373f22"
    ],
    "evidence": [
      "Explicit source grade label: ז'.",
      "Source topic: מערכת צירים.",
      "Source description: משימה מסכמת אינטגרטיבית."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1cfqrDYJNP0ieA64cTSGM13OpSYsoBo1D/preview",
    "download": "https://drive.google.com/uc?export=download&id=1cfqrDYJNP0ieA64cTSGM13OpSYsoBo1D"
  },
  {
    "id": "src-curriculum-71f88b7ed752",
    "title": "משולש שווה שוקיים וחפיפת משולשים במערכת צירים - שגית רסולי",
    "note": "תרגיל העוסק בישרים במערכת צירים, משולשים חופפים, משולש שווה שוקיים ועוד.",
    "url": "https://docs.google.com/document/d/1xAIcMljEP47jDT-6ApRddcrgKYQm_N49szsaXTJF3jc/edit",
    "kind": "doc",
    "grades": [
      "h"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "congruent-triangles",
      "similar-triangles",
      "similarity-pythagoras"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-71f88b7ed752"
    ],
    "evidence": [
      "Explicit source grade label: ח'.",
      "Source topic: חפיפת משולשים, משולש שווה שוקיים, משפט פיתגורס, דמיון משולשים.",
      "Source description: תרגיל העוסק בישרים במערכת צירים, משולשים חופפים, משולש שווה שוקיים ועוד.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1xAIcMljEP47jDT-6ApRddcrgKYQm_N49szsaXTJF3jc/preview",
    "download": "https://docs.google.com/document/d/1xAIcMljEP47jDT-6ApRddcrgKYQm_N49szsaXTJF3jc/export?format=pdf"
  },
  {
    "id": "src-curriculum-433698c54bce",
    "title": "גיאומטריה במערכת צירים - כיתה ח'",
    "note": "אוסף שאלות בגיאומטריה במערכת צירים הכוללות חפיפה ומשולש שווה שוקיים",
    "url": "https://docs.google.com/document/d/1YxrwU_YoHY1QxFN-fNkCGBYxpjw7Yi0T1CwlZvrPP2E/edit",
    "kind": "doc",
    "grades": [
      "h"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "congruent-triangles",
      "similar-triangles",
      "similarity-pythagoras"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "multi-activity-collection",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-433698c54bce"
    ],
    "evidence": [
      "Explicit source grade label: ח' הטרוגני.",
      "Source topic: חפיפת משולשים, משולש שווה שוקיים, משפט פיתגורס, דמיון משולשים.",
      "Source description: אוסף שאלות בגיאומטריה במערכת צירים הכוללות חפיפה ומשולש שווה שוקיים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1YxrwU_YoHY1QxFN-fNkCGBYxpjw7Yi0T1CwlZvrPP2E/preview",
    "download": "https://docs.google.com/document/d/1YxrwU_YoHY1QxFN-fNkCGBYxpjw7Yi0T1CwlZvrPP2E/export?format=pdf"
  },
  {
    "id": "src-curriculum-4e721f0cd2ec",
    "title": "גיאומטריה במערכת צירים-צוות מודל",
    "note": "אוסף שאלות בגיאומטריה במערכת צירים הכוללות חפיפה ומשולש שווה שוקיים ומשפט פיתגורס",
    "url": "https://docs.google.com/document/d/1sugmqnlO4RuCLMr3ZTdV-1Es43ytcFNj/edit",
    "kind": "doc",
    "grades": [
      "h"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "congruent-triangles",
      "similar-triangles",
      "similarity-pythagoras"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "multi-activity-collection",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-4e721f0cd2ec"
    ],
    "evidence": [
      "Explicit source grade label: ח'.",
      "Source topic: חפיפת משולשים, משולש שווה שוקיים, משפט פיתגורס, דמיון משולשים.",
      "Source description: אוסף שאלות בגיאומטריה במערכת צירים הכוללות חפיפה ומשולש שווה שוקיים ומשפט פיתגורס."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1sugmqnlO4RuCLMr3ZTdV-1Es43ytcFNj/preview",
    "download": "https://docs.google.com/document/d/1sugmqnlO4RuCLMr3ZTdV-1Es43ytcFNj/export?format=pdf"
  },
  {
    "id": "src-curriculum-965663be4bab",
    "title": "מרובעים במערכת צירים מרכז מורים ערבית — מרובעים",
    "note": "מדריך למורה מרכז מורים | הפעילות עוסקת בפונקציות קוויות וצורות גיאומטריות שיוצרים הגרפים שלהן במערכת צירים. הנושאים במשימות ישרים מקבילים, חיתוך בין ישרים, חפיפת משולשים, דמיון משולשים, תכונות ומשפטים הקשורים במשולשים שווי שוקיים או משולשים ישרי זווית, משפט פיתגורס.",
    "url": "https://drive.google.com/file/d/1mT8m92tciox2JV_CtD8fryFdXhhs9LQ5/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "parallel-lines",
      "congruent-triangles",
      "similar-triangles",
      "quadrilaterals",
      "similarity-pythagoras",
      "geometry-theorems-proofs",
      "functions-preanalysis"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "teacher-guide",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-965663be4bab"
    ],
    "evidence": [
      "Explicit source grade label: ח'.",
      "Source topic: חפיפת משולשים, משולש שווה שוקיים, משפט פיתגורס, דמיון משולשים.",
      "Source description: מדריך למורה מרכז מורים | הפעילות עוסקת בפונקציות קוויות וצורות גיאומטריות שיוצרים הגרפים שלהן במערכת צירים. הנושאים במשימות ישרים מקבילים, חיתוך בין ישרים, חפיפת משולשים, דמיון משולשים, תכונות ומשפטים הקשורים במשולשים שווי שוקיים או משולשים ישרי זווית, משפט פיתגורס.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1mT8m92tciox2JV_CtD8fryFdXhhs9LQ5/preview",
    "download": "https://drive.google.com/uc?export=download&id=1mT8m92tciox2JV_CtD8fryFdXhhs9LQ5"
  },
  {
    "id": "src-curriculum-dd36680d816e",
    "title": "מרובעים במערכת צירים מרכז מורים ערבית — ערבית",
    "note": "מדריך למורה מרכז מורים | הפעילות עוסקת בפונקציות קוויות וצורות גיאומטריות שיוצרים הגרפים שלהן במערכת צירים. הנושאים במשימות ישרים מקבילים, חיתוך בין ישרים, חפיפת משולשים, דמיון משולשים, תכונות ומשפטים הקשורים במשולשים שווי שוקיים או משולשים ישרי זווית, משפט פיתגורס.",
    "url": "https://newhighmath.haifa.ac.il/images/data2/8th_grade_complementary_/Arabic/integrative_squares_Arabic.pdf",
    "kind": "pdf",
    "grades": [
      "h"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "parallel-lines",
      "congruent-triangles",
      "similar-triangles",
      "quadrilaterals",
      "similarity-pythagoras",
      "geometry-theorems-proofs",
      "functions-preanalysis"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "teacher-guide",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-dd36680d816e"
    ],
    "evidence": [
      "Explicit source grade label: ח'.",
      "Source topic: חפיפת משולשים, משולש שווה שוקיים, משפט פיתגורס, דמיון משולשים.",
      "Source description: מדריך למורה מרכז מורים | הפעילות עוסקת בפונקציות קוויות וצורות גיאומטריות שיוצרים הגרפים שלהן במערכת צירים. הנושאים במשימות ישרים מקבילים, חיתוך בין ישרים, חפיפת משולשים, דמיון משולשים, תכונות ומשפטים הקשורים במשולשים שווי שוקיים או משולשים ישרי זווית, משפט פיתגורס.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://newhighmath.haifa.ac.il/images/data2/8th_grade_complementary_/Arabic/integrative_squares_Arabic.pdf#toolbar=0&navpanes=0&view=FitH",
    "download": "https://newhighmath.haifa.ac.il/images/data2/8th_grade_complementary_/Arabic/integrative_squares_Arabic.pdf"
  },
  {
    "id": "src-curriculum-0b4b09cdce63",
    "title": "דלתון ומשולש שווה שוקיים במערכת צירים",
    "note": "אוסף שאלות בגיאומטריה במערכת צירים הכוללות משולש שווה שוקיים, תיכון במשולש, דלתון ומשפט פיתגורס",
    "url": "https://drive.google.com/file/d/1xxGttqyu1KLTR-n6GJ1p_OEpzGNaAlXa/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "kite",
      "similarity-pythagoras"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "multi-activity-collection",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-0b4b09cdce63"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: דלתון ומשולש שווה שוקיים.",
      "Source description: אוסף שאלות בגיאומטריה במערכת צירים הכוללות משולש שווה שוקיים, תיכון במשולש, דלתון ומשפט פיתגורס."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1xxGttqyu1KLTR-n6GJ1p_OEpzGNaAlXa/preview",
    "download": "https://drive.google.com/uc?export=download&id=1xxGttqyu1KLTR-n6GJ1p_OEpzGNaAlXa"
  },
  {
    "id": "src-curriculum-e2583f30eda8",
    "title": "טרפז במערכת צירים - ערבית — טרפז",
    "note": "דוגמא לשאלה המשלבת גיאומטריה במישור גיאומטריה אנליטית",
    "url": "https://docs.google.com/document/d/1l1vU2zkvIIegsrkBMC_vmObrqeTSH4fi/edit",
    "kind": "doc",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "trapezoid"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-e2583f30eda8"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: טרפז.",
      "Source description: דוגמא לשאלה המשלבת גיאומטריה במישור גיאומטריה אנליטית."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1l1vU2zkvIIegsrkBMC_vmObrqeTSH4fi/preview",
    "download": "https://docs.google.com/document/d/1l1vU2zkvIIegsrkBMC_vmObrqeTSH4fi/export?format=pdf"
  },
  {
    "id": "src-curriculum-fc0d096cc4bd",
    "title": "טרפז במערכת צירים - ערבית — ערבית",
    "note": "דוגמא לשאלה המשלבת גיאומטריה במישור גיאומטריה אנליטית",
    "url": "https://docs.google.com/document/d/1CSr07HFrwj4INueuphiEtbmhl7kNMCUu/edit",
    "kind": "doc",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "trapezoid"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-fc0d096cc4bd"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: טרפז.",
      "Source description: דוגמא לשאלה המשלבת גיאומטריה במישור גיאומטריה אנליטית."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1CSr07HFrwj4INueuphiEtbmhl7kNMCUu/preview",
    "download": "https://docs.google.com/document/d/1CSr07HFrwj4INueuphiEtbmhl7kNMCUu/export?format=pdf"
  },
  {
    "id": "src-curriculum-124e4cb32286",
    "title": "גאומטריה במערכת צירים",
    "note": "גאומטריה במערכת צירים (אחרי דלתון וטרפז)- מיה קורן",
    "url": "https://docs.google.com/document/d/1bxhgS5kb3JSuUtvVTEij8I4GkmPSDrmd/edit",
    "kind": "doc",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "kite",
      "trapezoid"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-124e4cb32286"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: טרפז.",
      "Source description: גאומטריה במערכת צירים (אחרי דלתון וטרפז)- מיה קורן."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1bxhgS5kb3JSuUtvVTEij8I4GkmPSDrmd/preview",
    "download": "https://docs.google.com/document/d/1bxhgS5kb3JSuUtvVTEij8I4GkmPSDrmd/export?format=pdf"
  },
  {
    "id": "src-curriculum-6c64b9167a39",
    "title": "מקבילית במערכת צירים",
    "note": "דוגמאות לשאלות המשלבות גיאומטריה במישור גיאומטריה אנליטית",
    "url": "https://docs.google.com/document/d/1k3y59u-KM-HkHA-8bo3IGtwmxyvRdtJb/edit",
    "kind": "doc",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "parallelogram"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-6c64b9167a39"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: מקבילית.",
      "Source description: דוגמאות לשאלות המשלבות גיאומטריה במישור גיאומטריה אנליטית."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1k3y59u-KM-HkHA-8bo3IGtwmxyvRdtJb/preview",
    "download": "https://docs.google.com/document/d/1k3y59u-KM-HkHA-8bo3IGtwmxyvRdtJb/export?format=pdf"
  },
  {
    "id": "src-curriculum-61ae8c71bc15",
    "title": "מקבילית במערכת צירים מרכז מורים ערבית — מקבילית",
    "note": "מדריך למורה מרכז מורים",
    "url": "https://drive.google.com/file/d/1qmWFrivU2WhsdTGeWazQYiOZMDKEu8ff/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "parallelogram"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "teacher-guide",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-61ae8c71bc15"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: מקבילית.",
      "Source description: מדריך למורה מרכז מורים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1qmWFrivU2WhsdTGeWazQYiOZMDKEu8ff/preview",
    "download": "https://drive.google.com/uc?export=download&id=1qmWFrivU2WhsdTGeWazQYiOZMDKEu8ff"
  },
  {
    "id": "src-curriculum-3c5d41a9d58f",
    "title": "מקבילית במערכת צירים מרכז מורים ערבית — ערבית",
    "note": "מדריך למורה מרכז מורים",
    "url": "https://drive.google.com/file/d/1mpDn2O0_tO-MStIxodGOfeO2o9boYhI8/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "parallelogram"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "teacher-guide",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-3c5d41a9d58f"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: מקבילית.",
      "Source description: מדריך למורה מרכז מורים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1mpDn2O0_tO-MStIxodGOfeO2o9boYhI8/preview",
    "download": "https://drive.google.com/uc?export=download&id=1mpDn2O0_tO-MStIxodGOfeO2o9boYhI8"
  },
  {
    "id": "src-curriculum-ecc009634bfd",
    "title": "תרגול אינטגרטיבי מקבילית - — ערבית — תרגול",
    "note": "דף אינטגרטיבי לכיתה ט' אחרי מקבילית-מיה קורן",
    "url": "https://docs.google.com/document/d/1-qd0PBe-IzDBSB2rYQJaN5c19iIOBEkz/edit",
    "kind": "doc",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "parallelogram"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-ecc009634bfd"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: מקבילית.",
      "Source description: דף אינטגרטיבי לכיתה ט' אחרי מקבילית-מיה קורן."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1-qd0PBe-IzDBSB2rYQJaN5c19iIOBEkz/preview",
    "download": "https://docs.google.com/document/d/1-qd0PBe-IzDBSB2rYQJaN5c19iIOBEkz/export?format=pdf"
  },
  {
    "id": "src-curriculum-965bf8827411",
    "title": "תרגול אינטגרטיבי מקבילית - — ערבית — ערבית",
    "note": "דף אינטגרטיבי לכיתה ט' אחרי מקבילית-מיה קורן",
    "url": "https://drive.google.com/file/d/1gYZ5levIZJjkZnmNfKP4iwKqqqLn9I32/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "parallelogram"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-965bf8827411"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: מקבילית.",
      "Source description: דף אינטגרטיבי לכיתה ט' אחרי מקבילית-מיה קורן."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1gYZ5levIZJjkZnmNfKP4iwKqqqLn9I32/preview",
    "download": "https://drive.google.com/uc?export=download&id=1gYZ5levIZJjkZnmNfKP4iwKqqqLn9I32"
  },
  {
    "id": "src-curriculum-ee20bc58b48f",
    "title": "מלבן במערכת צירים — מלבן במערכת צירים-אוסף תרגילים — מלבן",
    "note": "דוגמא לשאלה המשלבת גיאומטריה במישור גיאומטריה אנליטית",
    "url": "https://docs.google.com/document/d/1UBzHw---TVR0cxNU3kiMg8Kqky5Ekkg2/edit",
    "kind": "doc",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "rectangle-rhombus"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "multi-activity-collection",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-ee20bc58b48f"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: מלבן.",
      "Source description: דוגמא לשאלה המשלבת גיאומטריה במישור גיאומטריה אנליטית."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1UBzHw---TVR0cxNU3kiMg8Kqky5Ekkg2/preview",
    "download": "https://docs.google.com/document/d/1UBzHw---TVR0cxNU3kiMg8Kqky5Ekkg2/export?format=pdf"
  },
  {
    "id": "src-curriculum-fe13dbb77b28",
    "title": "מלבן במערכת צירים — מלבן במערכת צירים-אוסף תרגילים — מלבן",
    "note": "דוגמא לשאלה המשלבת גיאומטריה במישור גיאומטריה אנליטית",
    "url": "https://docs.google.com/document/d/1XIxCz3Ty1qkTQDL7Lj8RMVo_d8P1gVHI/edit",
    "kind": "doc",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "rectangle-rhombus"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "multi-activity-collection",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-fe13dbb77b28"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: מלבן.",
      "Source description: דוגמא לשאלה המשלבת גיאומטריה במישור גיאומטריה אנליטית."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1XIxCz3Ty1qkTQDL7Lj8RMVo_d8P1gVHI/preview",
    "download": "https://docs.google.com/document/d/1XIxCz3Ty1qkTQDL7Lj8RMVo_d8P1gVHI/export?format=pdf"
  },
  {
    "id": "src-curriculum-05c3d6e31666",
    "title": "גיאומטריה במערכת צירים-צוות מודל ערבית — גיאומטריה",
    "note": "התרגילים ניתנים לפתרון בעזרת גיאומטריה בלבד",
    "url": "https://docs.google.com/document/d/1TCrowZ5wA77iQ4XGqRpse1JMQ4CD8BB0oFVNIJb1cHU/edit",
    "kind": "doc",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "rectangle-rhombus"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-05c3d6e31666"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: מלבן ומעויין.",
      "Source description: התרגילים ניתנים לפתרון בעזרת גיאומטריה בלבד."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1TCrowZ5wA77iQ4XGqRpse1JMQ4CD8BB0oFVNIJb1cHU/preview",
    "download": "https://docs.google.com/document/d/1TCrowZ5wA77iQ4XGqRpse1JMQ4CD8BB0oFVNIJb1cHU/export?format=pdf"
  },
  {
    "id": "src-curriculum-87c0868756a0",
    "title": "גיאומטריה במערכת צירים-צוות מודל ערבית — ערבית",
    "note": "התרגילים ניתנים לפתרון בעזרת גיאומטריה בלבד",
    "url": "https://drive.google.com/file/d/12Q8IaJFau1XFPNPLSeu3BLjnnzyPmqGO/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "rectangle-rhombus"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-87c0868756a0"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: מלבן ומעויין.",
      "Source description: התרגילים ניתנים לפתרון בעזרת גיאומטריה בלבד."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/12Q8IaJFau1XFPNPLSeu3BLjnnzyPmqGO/preview",
    "download": "https://drive.google.com/uc?export=download&id=12Q8IaJFau1XFPNPLSeu3BLjnnzyPmqGO"
  },
  {
    "id": "src-curriculum-2122131e0624",
    "title": "גאומטריה במערכת צירים מרכז מורים ערבית — גאומטריה",
    "note": "מדריך למורה מרכז מורים",
    "url": "https://drive.google.com/file/d/1GubLSnEq51NSWWEgCf4rEz1ZVzU5Zddf/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "areas-perimeters",
      "similarity-pythagoras"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "teacher-guide",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-2122131e0624"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: שטחים, היקפים (כולל דמיון).",
      "Source description: מדריך למורה מרכז מורים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1GubLSnEq51NSWWEgCf4rEz1ZVzU5Zddf/preview",
    "download": "https://drive.google.com/uc?export=download&id=1GubLSnEq51NSWWEgCf4rEz1ZVzU5Zddf"
  },
  {
    "id": "src-curriculum-34fb7bbd1911",
    "title": "גאומטריה במערכת צירים מרכז מורים ערבית — ערבית",
    "note": "מדריך למורה מרכז מורים",
    "url": "https://drive.google.com/file/d/1uL8a08T1gz1tHqkkGTMBgveDiYGDzgG5/view",
    "kind": "drive",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "areas-perimeters",
      "similarity-pythagoras"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "teacher-guide",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-34fb7bbd1911"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: שטחים, היקפים (כולל דמיון).",
      "Source description: מדריך למורה מרכז מורים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/1uL8a08T1gz1tHqkkGTMBgveDiYGDzgG5/preview",
    "download": "https://drive.google.com/uc?export=download&id=1uL8a08T1gz1tHqkkGTMBgveDiYGDzgG5"
  },
  {
    "id": "src-curriculum-8854cf7a3fff",
    "title": "גיאומטריה אוקלידית בשילוב גיאומטריה אנליטית",
    "note": "קובץ שאלות ברוח תוכנית לימודים חדשה בחט\"ע, לתלמידי ח' ו- ט' רמה רגילה ועמ\"ט בנושא גיאומטריה אוקלידית וגיאומטריה אנליטית. חלק מהשאלות מתוך ספרי הלימוד המאושרים וחלק עיבוד מתוך שאלות בתכנית לימודים חדשה.",
    "url": "https://docs.google.com/document/d/1xFWiF1c1OzHmKqwUaRrQzN705ysa1_XCG7LTBsk-YiI/edit",
    "kind": "doc",
    "grades": [
      "h",
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "areas-perimeters",
      "similarity-pythagoras"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-8854cf7a3fff"
    ],
    "evidence": [
      "Explicit source grade label: ח' ו- ט' רמה רגילה ועמ\"ט.",
      "Source topic: שטחים, היקפים (כולל דמיון).",
      "Source description: קובץ שאלות ברוח תוכנית לימודים חדשה בחט\"ע, לתלמידי ח' ו- ט' רמה רגילה ועמ\"ט בנושא גיאומטריה אוקלידית וגיאומטריה אנליטית. חלק מהשאלות מתוך ספרי הלימוד המאושרים וחלק עיבוד מתוך שאלות בתכנית לימודים חדשה.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1xFWiF1c1OzHmKqwUaRrQzN705ysa1_XCG7LTBsk-YiI/preview",
    "download": "https://docs.google.com/document/d/1xFWiF1c1OzHmKqwUaRrQzN705ysa1_XCG7LTBsk-YiI/export?format=pdf"
  },
  {
    "id": "src-curriculum-ad6a4647940a",
    "title": "היקף ושטח מעגל-מרכז מורים",
    "note": "אוסף משימות העוסקות בהיקף מעגל ושטח עיגול.",
    "url": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3485-circle",
    "kind": "link",
    "grades": [
      "z"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "circle"
    ],
    "collections": [
      "digital",
      "printable"
    ],
    "resourceType": "multi-activity-collection",
    "delivery": "hybrid",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-ad6a4647940a"
    ],
    "evidence": [
      "Explicit source grade label: ז'.",
      "Source topic: היקף ושטח מעגל.",
      "Source description: אוסף משימות העוסקות בהיקף מעגל ושטח עיגול.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false
  },
  {
    "id": "src-curriculum-41af23ea0ea3",
    "title": "ישרים מקבילים-מרכז מורים",
    "note": "הפעילות עוסקת בגיאומטריה חישובית בהקשר של ישרים מקבילים וישר חותך, בבעיות אורייניות. המשימות כולן כתובות באופן מדורג, בדרגת קושי עולה, כך שכל התלמידים יכולים להתקדם במענה עליהן.הפעילות מתאימה לשלב בו לומדים גיאומטריה בגישה קדם דדוקטיבית, אך מזמנת דיון גם במושגים כמו משפט ומשפט הפוך, כהכנה לשלב הדדוקטיבי.",
    "url": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3514-2022-09-21-14-01-52",
    "kind": "link",
    "grades": [
      "h"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "parallel-lines",
      "functions-preanalysis"
    ],
    "collections": [
      "digital",
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "hybrid",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-41af23ea0ea3"
    ],
    "evidence": [
      "Explicit source grade label: ח'.",
      "Source topic: ישרים מקבילים.",
      "Source description: הפעילות עוסקת בגיאומטריה חישובית בהקשר של ישרים מקבילים וישר חותך, בבעיות אורייניות. המשימות כולן כתובות באופן מדורג, בדרגת קושי עולה, כך שכל התלמידים יכולים להתקדם במענה עליהן.הפעילות מתאימה לשלב בו לומדים גיאומטריה בגישה קדם דדוקטיבית, אך מזמנת דיון גם במושגים כמו משפט ומשפט הפוך, כהכנה לשלב הדדוקטיבי.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false
  },
  {
    "id": "src-curriculum-53c5674cdbb1",
    "title": "חפיפת משולשים - מרכז מורים",
    "note": "הפעילות עוסקת בגיאומטריה חישובית בהקשר של חפיפת משולשים בבעיות אוריינות. הנתונים במשימות נמסרים באמצעות תיאור מצב מחיי היום-יום (לדוגמה מרחק בין צמתים) ולא \"מוגשים\" באופן ישיר באמצעות שמות של נקודות או שוויון בין אורכי קטעים, אלא מסתתרים בתוך הכתוב. אי לכך, נדרש תהליך של קריאה יסודית ופענוח של הנתונים מתוך הסיטואציה המתוארת.",
    "url": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3513-2022-09-21-13-52-32",
    "kind": "link",
    "grades": [
      "h"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "congruent-triangles"
    ],
    "collections": [
      "digital",
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "hybrid",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-53c5674cdbb1"
    ],
    "evidence": [
      "Explicit source grade label: ח' רמות נמוכות.",
      "Source topic: חפיפת משולשים.",
      "Source description: הפעילות עוסקת בגיאומטריה חישובית בהקשר של חפיפת משולשים בבעיות אוריינות. הנתונים במשימות נמסרים באמצעות תיאור מצב מחיי היום-יום (לדוגמה מרחק בין צמתים) ולא \"מוגשים\" באופן ישיר באמצעות שמות של נקודות או שוויון בין אורכי קטעים, אלא מסתתרים בתוך הכתוב. אי לכך, נדרש תהליך של קריאה יסודית ופענוח של הנתונים מתוך הסיטואציה המתוארת.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false
  },
  {
    "id": "src-curriculum-b3e599064912",
    "title": "פיתגורס ודמיון בהקשר של חיי היומיום — -שגית רסולי",
    "note": "אוסף תרגילים בנושא משפט פיתגורס דמיון משולשים בהקשר של חיי היומיום.",
    "url": "https://docs.google.com/document/d/19Jco4Ir2upDEMq26epX4jeBfPB32nBQUxNMDzdpFe3M/edit",
    "kind": "doc",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "similar-triangles",
      "similarity-pythagoras"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "multi-activity-collection",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-b3e599064912"
    ],
    "evidence": [
      "Explicit source grade label: ט' מצומצמת.",
      "Source topic: משפט פיתגורס.",
      "Source description: אוסף תרגילים בנושא משפט פיתגורס דמיון משולשים בהקשר של חיי היומיום.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/19Jco4Ir2upDEMq26epX4jeBfPB32nBQUxNMDzdpFe3M/preview",
    "download": "https://docs.google.com/document/d/19Jco4Ir2upDEMq26epX4jeBfPB32nBQUxNMDzdpFe3M/export?format=pdf"
  },
  {
    "id": "src-curriculum-41afdc2da59e",
    "title": "חפיפת משולשים ודמיון-מרכז מורים",
    "note": "המשימות עוסקות בחפיפה ודמיון של משולשים ומיועד לתלמידים בכיתות ח'. בקובץ יש התייחסות גם למשפט פיתגורס. השאלות מדורגות, מתחילות במשימות פשוטות ומתפתחות למשימות מורכבות יותר, כך שהן יכולות להתאים לתלמידים ברמות שונות.",
    "url": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3532-congruence-of-triangles-and-similarily-excellence-8thgrade",
    "kind": "link",
    "grades": [
      "h"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "congruent-triangles",
      "similar-triangles",
      "similarity-pythagoras"
    ],
    "collections": [
      "digital",
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "hybrid",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-41afdc2da59e"
    ],
    "evidence": [
      "Explicit source grade label: ח' מצויינות.",
      "Source topic: דמיון משולשים.",
      "Source description: המשימות עוסקות בחפיפה ודמיון של משולשים ומיועד לתלמידים בכיתות ח'. בקובץ יש התייחסות גם למשפט פיתגורס. השאלות מדורגות, מתחילות במשימות פשוטות ומתפתחות למשימות מורכבות יותר, כך שהן יכולות להתאים לתלמידים ברמות שונות.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false
  },
  {
    "id": "src-curriculum-9fc3f4092d81",
    "title": "גיאומטריה חישובית דמיון- מרכז מורים",
    "note": "המשימות עוסקות בגיאומטריה חישובית בהקשר של מצבים מחיי היום-יום. בפתרון המתמטי משתמשים בנושאים בדמיון משולשים, משפט פיתגורס, אחוזים ויחידות מידה. המשימות נכתבו בשתי גרסאות, כך שניתן להתאימן לתלמידים ברמה המצומצמת או לתלמידים ברמה הגבוהה יותר.",
    "url": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3504-geometry",
    "kind": "link",
    "grades": [
      "h",
      "t"
    ],
    "domains": [
      "geometry",
      "algebra"
    ],
    "sourceTopicIds": [
      "similar-triangles",
      "percentages-word-problems",
      "similarity-pythagoras"
    ],
    "collections": [
      "digital",
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "hybrid",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-9fc3f4092d81"
    ],
    "evidence": [
      "Explicit source grade label: ח'-ט'.",
      "Source topic: דמיון משולשים.",
      "Source description: המשימות עוסקות בגיאומטריה חישובית בהקשר של מצבים מחיי היום-יום. בפתרון המתמטי משתמשים בנושאים בדמיון משולשים, משפט פיתגורס, אחוזים ויחידות מידה. המשימות נכתבו בשתי גרסאות, כך שניתן להתאימן לתלמידים ברמה המצומצמת או לתלמידים ברמה הגבוהה יותר.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false
  },
  {
    "id": "src-curriculum-f3d7f73d5789",
    "title": "דמיון משולשים בשילוב פיתגורס — -שגית רסולי",
    "note": "קובץ שאלות ברוח תוכנית לימודים חדשה בחט\"ע, לתלמידי ז', ח' ו-ט' מצומצמת בנושא דמיון משולשים בשילוב פיתגורס. חלק מהשאלות מתוך ספרי הלימוד המאושרים וחלק עיבוד מתוך שאלות בתכנית לימודים חדשה.",
    "url": "https://docs.google.com/document/d/1Wo4c5Ap7PDJ_QY41i4XwHDuHyABo8Mltxru_sJeFYuM/edit",
    "kind": "doc",
    "grades": [
      "h",
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "similar-triangles",
      "similarity-pythagoras"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-f3d7f73d5789"
    ],
    "evidence": [
      "Explicit source grade label: ח', ט' מצומצמת.",
      "Source topic: דמיון משולשים.",
      "Source description: קובץ שאלות ברוח תוכנית לימודים חדשה בחט\"ע, לתלמידי ז', ח' ו-ט' מצומצמת בנושא דמיון משולשים בשילוב פיתגורס. חלק מהשאלות מתוך ספרי הלימוד המאושרים וחלק עיבוד מתוך שאלות בתכנית לימודים חדשה.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1Wo4c5Ap7PDJ_QY41i4XwHDuHyABo8Mltxru_sJeFYuM/preview",
    "download": "https://docs.google.com/document/d/1Wo4c5Ap7PDJ_QY41i4XwHDuHyABo8Mltxru_sJeFYuM/export?format=pdf"
  },
  {
    "id": "src-curriculum-dedbd97793c1",
    "title": "סביב משולשים ומלבנים מרכז מורים ערבית — סביב",
    "note": "מדריך למורה מרכז מורים",
    "url": "https://drive.google.com/file/d/108noHe2bTP1lb1wGIyYzEMqOJtut-W-Q/view",
    "kind": "drive",
    "grades": [
      "h"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [],
    "collections": [
      "summaries",
      "printable"
    ],
    "resourceType": "teacher-guide",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-dedbd97793c1"
    ],
    "evidence": [
      "Explicit source grade label: ח'.",
      "Source topic: שאלות אינטגרטיביות.",
      "Source description: מדריך למורה מרכז מורים."
    ],
    "needsReview": true,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/file/d/108noHe2bTP1lb1wGIyYzEMqOJtut-W-Q/preview",
    "download": "https://drive.google.com/uc?export=download&id=108noHe2bTP1lb1wGIyYzEMqOJtut-W-Q",
    "reviewReason": "The source says only 'around triangles and rectangles' and 'teacher guide'; it does not support one exact topic placement."
  },
  {
    "id": "src-curriculum-ef917264500e",
    "title": "סביב משולשים ומלבנים מרכז מורים ערבית — ערבית",
    "note": "מדריך למורה מרכז מורים",
    "url": "https://newhighmath.haifa.ac.il/images/data2/8th_grade_complementary_/Arabic/integrative_triangles_Arabic.pdf",
    "kind": "pdf",
    "grades": [
      "h"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [],
    "collections": [
      "summaries",
      "printable"
    ],
    "resourceType": "teacher-guide",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-ef917264500e"
    ],
    "evidence": [
      "Explicit source grade label: ח'.",
      "Source topic: שאלות אינטגרטיביות.",
      "Source description: מדריך למורה מרכז מורים."
    ],
    "needsReview": true,
    "excludedFromTeachingMaterials": false,
    "embed": "https://newhighmath.haifa.ac.il/images/data2/8th_grade_complementary_/Arabic/integrative_triangles_Arabic.pdf#toolbar=0&navpanes=0&view=FitH",
    "download": "https://newhighmath.haifa.ac.il/images/data2/8th_grade_complementary_/Arabic/integrative_triangles_Arabic.pdf",
    "reviewReason": "Arabic companion file for the same ambiguous integrative Grade 8 resource; do not invent a single topic."
  },
  {
    "id": "src-curriculum-b58c2b6e9f58",
    "title": "שאלות אינטגרטיביות פונקציה קווית, דמיון וחפיפת משולשים- מרכז מורים",
    "note": "המשימות בפעילות משלבות בין התחום האלגברי והתחום הגיאומטרי. בתחום האלגברי נדרשות מיומנויות הקשורות לתכונות הפונקציה הקווית ובתחום הגיאומטרי המשימות עוסקות בחפיפת משולשים, דמיון משולשים ותכונות של משולשים שווי שוקיים. השאלות מדורגות ומתאימות לתלמידי כיתות ח' ברמות הגבוהות אך ניתן לעשות בהן שימוש גם בכיתה ט' כחזרה וריענון על הפרקים שנלמדו בכיתה ח'.",
    "url": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3503-integrative",
    "kind": "link",
    "grades": [
      "h",
      "t"
    ],
    "domains": [
      "geometry",
      "algebra"
    ],
    "sourceTopicIds": [
      "congruent-triangles",
      "similar-triangles",
      "linear-function",
      "similarity-pythagoras"
    ],
    "collections": [
      "digital",
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "hybrid",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-b58c2b6e9f58"
    ],
    "evidence": [
      "Explicit source grade label: ח'- ט'.",
      "Source topic: שאלות אינטגרטיביות.",
      "Source description: המשימות בפעילות משלבות בין התחום האלגברי והתחום הגיאומטרי. בתחום האלגברי נדרשות מיומנויות הקשורות לתכונות הפונקציה הקווית ובתחום הגיאומטרי המשימות עוסקות בחפיפת משולשים, דמיון משולשים ותכונות של משולשים שווי שוקיים. השאלות מדורגות ומתאימות לתלמידי כיתות ח' ברמות הגבוהות אך ניתן לעשות בהן שימוש גם בכיתה ט' כחזרה וריענון על הפרקים שנלמדו בכיתה ח'.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false
  },
  {
    "id": "src-curriculum-3380820b5724",
    "title": "דלתון- יחידה שפותחה במסגרת מחקר במכללת אחווה",
    "note": "למידת נושא הדלתון באופן עצמאי פעילות חקר בעזרת יישומונים",
    "url": "https://www.geogebra.org/m/mh97mcnc",
    "kind": "link",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "kite"
    ],
    "collections": [
      "digital"
    ],
    "resourceType": "interactive-activity",
    "delivery": "digital",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-3380820b5724"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: דלתון.",
      "Source description: למידת נושא הדלתון באופן עצמאי פעילות חקר בעזרת יישומונים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false
  },
  {
    "id": "src-curriculum-e89100e098c9",
    "title": "שאלות בגיאומטריה מרובעים -כיתה ט' מצויינות מרכז מורים",
    "note": "שאלות מתפתחות העוסקות בתכונות של מרובעים לכיתה ט' (ללא קטע אמצעים), תכונות של משולש ישר זווית, שטחים של משולשים ומרובעים, שימוש בפרמטרים. הפעילות תומכת בעידוד הוכחה בדרכים שונות, יצירת שיח מתמטי של גילוי ומספקות אפשרות לחזרה מקיפה על כל הנושאים הנ\"ל.",
    "url": "https://newhighmath.haifa.ac.il/index.php/458-9th-grade-activities/3529-quadrilaterals-9grade-excellence",
    "kind": "link",
    "grades": [
      "t"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "areas-perimeters",
      "quadrilaterals",
      "geometry-theorems-proofs"
    ],
    "collections": [
      "digital",
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "hybrid",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-e89100e098c9"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: משפחת המרובעים.",
      "Source description: שאלות מתפתחות העוסקות בתכונות של מרובעים לכיתה ט' (ללא קטע אמצעים), תכונות של משולש ישר זווית, שטחים של משולשים ומרובעים, שימוש בפרמטרים. הפעילות תומכת בעידוד הוכחה בדרכים שונות, יצירת שיח מתמטי של גילוי ומספקות אפשרות לחזרה מקיפה על כל הנושאים הנ\"ל.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false
  },
  {
    "id": "src-curriculum-28af0eb34fa4",
    "title": "יעל מעצבת מסגרות-מרכז מורים ערבית — יעל",
    "note": "בפעילות נזרעים זרעים לקראת פתרון בעיות ערך קיצון שנלמדות בכיתה ט' ובחטיבה העליונה.",
    "url": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3484-yael-designs-frames",
    "kind": "link",
    "grades": [
      "z",
      "h"
    ],
    "domains": [
      "geometry",
      "algebra"
    ],
    "sourceTopicIds": [
      "areas-perimeters",
      "algebraic-expressions-distributive"
    ],
    "collections": [
      "digital",
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "hybrid",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-28af0eb34fa4"
    ],
    "evidence": [
      "Explicit source grade label: ז'- ח'.",
      "Source topic: שטחים, והיקפים, ביטויים אלגבריים.",
      "Source description: בפעילות נזרעים זרעים לקראת פתרון בעיות ערך קיצון שנלמדות בכיתה ט' ובחטיבה העליונה.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false
  },
  {
    "id": "src-curriculum-d45210f8a97c",
    "title": "יעל מעצבת מסגרות-מרכז מורים ערבית — ערבית",
    "note": "בפעילות נזרעים זרעים לקראת פתרון בעיות ערך קיצון שנלמדות בכיתה ט' ובחטיבה העליונה.",
    "url": "https://newhighmath.haifa.ac.il/images/data2/arabic_2022/Yael_arabic.pdf",
    "kind": "pdf",
    "grades": [
      "z",
      "h"
    ],
    "domains": [
      "geometry",
      "algebra"
    ],
    "sourceTopicIds": [
      "areas-perimeters",
      "algebraic-expressions-distributive"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-d45210f8a97c"
    ],
    "evidence": [
      "Explicit source grade label: ז'- ח'.",
      "Source topic: שטחים, והיקפים, ביטויים אלגבריים.",
      "Source description: בפעילות נזרעים זרעים לקראת פתרון בעיות ערך קיצון שנלמדות בכיתה ט' ובחטיבה העליונה.."
    ],
    "needsReview": true,
    "excludedFromTeachingMaterials": false,
    "embed": "https://newhighmath.haifa.ac.il/images/data2/arabic_2022/Yael_arabic.pdf#toolbar=0&navpanes=0&view=FitH",
    "download": "https://newhighmath.haifa.ac.il/images/data2/arabic_2022/Yael_arabic.pdf",
    "reviewReason": "Do not merge automatically. The same PDF URL is attached to two unrelated titles/topics (Yael frames vs. walking activity), indicating a likely erroneous hyperlink in the source document."
  },
  {
    "id": "src-curriculum-ba33882d0751",
    "title": "שטחים והיקפים - שגית רסולי",
    "note": "קובץ שאלות ברוח תוכנית לימודים חדשה בחט\"ע, לתלמידי ז', ח' ו-ט' מצומצמת בנושא שטחים והיקפים. חלק מהשאלות מתוך ספרי הלימוד המאושרים וחלק עיבוד מתוך שאלות בתכנית לימודים חדשה.",
    "url": "https://docs.google.com/document/d/1fMGLyqjotD1MHFygNwHlp9CcrnrAdsOdZucAUiCiHzk/edit",
    "kind": "doc",
    "grades": [
      "h",
      "t"
    ],
    "domains": [
      "geometry",
      "algebra"
    ],
    "sourceTopicIds": [
      "areas-perimeters",
      "algebraic-expressions-distributive"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-ba33882d0751"
    ],
    "evidence": [
      "Explicit source grade label: ח', ט' מצומצמת.",
      "Source topic: שטחים, והיקפים, ביטויים אלגבריים.",
      "Source description: קובץ שאלות ברוח תוכנית לימודים חדשה בחט\"ע, לתלמידי ז', ח' ו-ט' מצומצמת בנושא שטחים והיקפים. חלק מהשאלות מתוך ספרי הלימוד המאושרים וחלק עיבוד מתוך שאלות בתכנית לימודים חדשה.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1fMGLyqjotD1MHFygNwHlp9CcrnrAdsOdZucAUiCiHzk/preview",
    "download": "https://docs.google.com/document/d/1fMGLyqjotD1MHFygNwHlp9CcrnrAdsOdZucAUiCiHzk/export?format=pdf"
  },
  {
    "id": "src-curriculum-ad690fa39e57",
    "title": "ביטויים אלגבריים היקפים בחצר- מרכז מורים ארצי",
    "note": "פעילות פתיחה לשיעור בנושא ביטויים אלגבריים המתייחסת להיקפים ושטחים של מלבנים - חלקת דשא ובריכה. הפעילות עוסקת מבחינה אלגברית בכינוס איברים דומים. מוצעות למשימה שלוש גרסאות ברמות שונות.",
    "url": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3523-algebraic-patterns-7th-grade",
    "kind": "link",
    "grades": [
      "z"
    ],
    "domains": [
      "geometry",
      "algebra"
    ],
    "sourceTopicIds": [
      "areas-perimeters",
      "algebraic-expressions-distributive"
    ],
    "collections": [
      "digital",
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "hybrid",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-ad690fa39e57"
    ],
    "evidence": [
      "Explicit source grade label: ז'.",
      "Source topic: שטחים, והיקפים, ביטויים אלגבריים.",
      "Source description: פעילות פתיחה לשיעור בנושא ביטויים אלגבריים המתייחסת להיקפים ושטחים של מלבנים - חלקת דשא ובריכה. הפעילות עוסקת מבחינה אלגברית בכינוס איברים דומים. מוצעות למשימה שלוש גרסאות ברמות שונות.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false
  },
  {
    "id": "src-curriculum-e137bb19fd28",
    "title": "על צעידה ופעילות גופנית",
    "note": "משימה אוריינית הדורשת קריאה ופענוח נתונים מתוך פיסקת מידע ויכולה להתאים לתלמידים ברמות הגבוהות בכיתות ח",
    "url": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3486-jogging",
    "kind": "link",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "percentages-word-problems",
      "graph-reading-literacy"
    ],
    "collections": [
      "digital",
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "hybrid",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-e137bb19fd28",
      "curriculum-0c91d1dd9857"
    ],
    "evidence": [
      "Explicit source grade label: ח'.",
      "Source topic: שאלה מילולית -אוריינית.",
      "Source description: משימה אוריינית הדורשת קריאה ופענוח נתונים מתוך פיסקת מידע ויכולה להתאים לתלמידים ברמות הגבוהות בכיתות ח.",
      "Source topic: שאלות מילוליות, אחוזים.",
      "Source description: משימה אוריינית הדורשת קריאה ופענוח נתונים מתוך פסקת מידע."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false
  },
  {
    "id": "src-curriculum-b3340c60869d",
    "title": "על צעידה ופעילות גופנית מרכז מורים ערבית — ערבית",
    "note": "משימה אוריינית הדורשת קריאה ופענוח נתונים מתוך פסקת מידע",
    "url": "https://newhighmath.haifa.ac.il/images/data2/arabic_2022/Yael_arabic.pdf",
    "kind": "pdf",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "percentages-word-problems",
      "graph-reading-literacy"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-b3340c60869d"
    ],
    "evidence": [
      "Explicit source grade label: ח'.",
      "Source topic: שאלות מילוליות, אחוזים.",
      "Source description: משימה אוריינית הדורשת קריאה ופענוח נתונים מתוך פסקת מידע."
    ],
    "needsReview": true,
    "excludedFromTeachingMaterials": false,
    "embed": "https://newhighmath.haifa.ac.il/images/data2/arabic_2022/Yael_arabic.pdf#toolbar=0&navpanes=0&view=FitH",
    "download": "https://newhighmath.haifa.ac.il/images/data2/arabic_2022/Yael_arabic.pdf",
    "reviewReason": "Do not merge automatically. The same PDF URL is attached to two unrelated titles/topics (Yael frames vs. walking activity), indicating a likely erroneous hyperlink in the source document."
  },
  {
    "id": "src-curriculum-9ac235d75c82",
    "title": "אחוזים וסטטיסטיקה - אייל שלמה ושגית",
    "note": "קובץ שאלות ברוח תוכנית לימודים חדשה בחט\"ע, לתלמידי ז', ח' ו-ט' מצומצמת בנושא סטטיסטיקה ואחוזים. חלק מהשאלות מתוך ספרי הלימוד המאושרים וחלק עיבוד מתוך שאלות בתכנית לימודים חדשה.",
    "url": "https://docs.google.com/document/d/1u-VJ8nCocfmzpF3vYpImEcmrcAghHyqf5eN-4IWxrJs/edit",
    "kind": "doc",
    "grades": [
      "z",
      "h",
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "percentages-word-problems",
      "statistics-graph-reading"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-9ac235d75c82"
    ],
    "evidence": [
      "Explicit source grade label: ז', ח', ט' מצומצמת.",
      "Source topic: אחוזים וסטטיסטיקה.",
      "Source description: קובץ שאלות ברוח תוכנית לימודים חדשה בחט\"ע, לתלמידי ז', ח' ו-ט' מצומצמת בנושא סטטיסטיקה ואחוזים. חלק מהשאלות מתוך ספרי הלימוד המאושרים וחלק עיבוד מתוך שאלות בתכנית לימודים חדשה.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1u-VJ8nCocfmzpF3vYpImEcmrcAghHyqf5eN-4IWxrJs/preview",
    "download": "https://docs.google.com/document/d/1u-VJ8nCocfmzpF3vYpImEcmrcAghHyqf5eN-4IWxrJs/export?format=pdf"
  },
  {
    "id": "src-curriculum-664df64180ed",
    "title": "אוסף שאלות תנועה - \"נעים אחרת\"",
    "note": "Explicit source grade label: ז'-ט'.",
    "url": "https://docs.google.com/document/d/1F-xVahx8g_A088aCLmuuqBvG4IU6Le1iGmvdC9jvGzA/edit",
    "kind": "doc",
    "grades": [
      "z",
      "h",
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "percentages-word-problems"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "multi-activity-collection",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-664df64180ed"
    ],
    "evidence": [
      "Explicit source grade label: ז'-ט'.",
      "Source topic: שאלות תנועה.",
      "Source description: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1F-xVahx8g_A088aCLmuuqBvG4IU6Le1iGmvdC9jvGzA/preview",
    "download": "https://docs.google.com/document/d/1F-xVahx8g_A088aCLmuuqBvG4IU6Le1iGmvdC9jvGzA/export?format=pdf"
  },
  {
    "id": "src-curriculum-2f6066661864",
    "title": "טיול בנהריה -מרכז מורים ארצי ערבית — טיול",
    "note": "מרכז מורים- פענוח מידע ופירוש של נתונים, המרות בין ייצוגים",
    "url": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3483-trip-to-nahariyya",
    "kind": "link",
    "grades": [
      "z",
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "statistics-graph-reading",
      "graph-reading-literacy"
    ],
    "collections": [
      "digital",
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "hybrid",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-2f6066661864"
    ],
    "evidence": [
      "Explicit source grade label: ז'-ח' הקבצות גבוהות.",
      "Source topic: קריאת גרפים.",
      "Source description: מרכז מורים- פענוח מידע ופירוש של נתונים, המרות בין ייצוגים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false
  },
  {
    "id": "src-curriculum-566566b1dd8d",
    "title": "טיול בנהריה -מרכז מורים ארצי ערבית — ערבית",
    "note": "מרכז מורים- פענוח מידע ופירוש של נתונים, המרות בין ייצוגים",
    "url": "https://newhighmath.haifa.ac.il/images/data2/arabic_2022/trip_to_Nahariyah_arabic.pdf",
    "kind": "pdf",
    "grades": [
      "z",
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "statistics-graph-reading",
      "graph-reading-literacy"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-566566b1dd8d"
    ],
    "evidence": [
      "Explicit source grade label: ז'-ח' הקבצות גבוהות.",
      "Source topic: קריאת גרפים.",
      "Source description: מרכז מורים- פענוח מידע ופירוש של נתונים, המרות בין ייצוגים."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://newhighmath.haifa.ac.il/images/data2/arabic_2022/trip_to_Nahariyah_arabic.pdf#toolbar=0&navpanes=0&view=FitH",
    "download": "https://newhighmath.haifa.ac.il/images/data2/arabic_2022/trip_to_Nahariyah_arabic.pdf"
  },
  {
    "id": "src-curriculum-f2a9bd1f1dcd",
    "title": "קריאת גרפים- מרכז מורים",
    "note": "יחידת לימוד העוסקת בקריאת גרפים ומיועדת לתלמידי כיתות ח' ו-ט'. המשימות עוסקות בנושאים שונים, בחלקן מכילות יישומונים.",
    "url": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3564-reading-graphs",
    "kind": "link",
    "grades": [
      "h",
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "statistics-graph-reading",
      "graph-reading-literacy"
    ],
    "collections": [
      "digital"
    ],
    "resourceType": "teaching-unit",
    "delivery": "digital",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-f2a9bd1f1dcd"
    ],
    "evidence": [
      "Explicit source grade label: ח', ט'.",
      "Source topic: קריאת גרפים.",
      "Source description: יחידת לימוד העוסקת בקריאת גרפים ומיועדת לתלמידי כיתות ח' ו-ט'. המשימות עוסקות בנושאים שונים, בחלקן מכילות יישומונים.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false
  },
  {
    "id": "src-curriculum-a69849f5cece",
    "title": "אי שוויון במערכת צירים",
    "note": "פתרונות אפשריים של אי שיוויון, האם נקודה נמצאת על ישר, התאמה בין אי שיוויון לתיאור גרפי, ישרים מקבילים לצירים.",
    "url": "https://docs.google.com/document/d/1rxCtQl49hEVgIV6-S3dYxgW7pMuBjDlk3Y9XLlZ0hVU/edit",
    "kind": "doc",
    "grades": [
      "h"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "parallel-lines",
      "inequalities"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-a69849f5cece"
    ],
    "evidence": [
      "Explicit source grade label: ח'.",
      "Source topic: אי שוויון במערכת צירים.",
      "Source description: פתרונות אפשריים של אי שיוויון, האם נקודה נמצאת על ישר, התאמה בין אי שיוויון לתיאור גרפי, ישרים מקבילים לצירים.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1rxCtQl49hEVgIV6-S3dYxgW7pMuBjDlk3Y9XLlZ0hVU/preview",
    "download": "https://docs.google.com/document/d/1rxCtQl49hEVgIV6-S3dYxgW7pMuBjDlk3Y9XLlZ0hVU/export?format=pdf"
  },
  {
    "id": "src-curriculum-57ceeac1ffe1",
    "title": "שאלות אוריינות - בערבית — שאלות",
    "note": "אוסף שאלות מותאמות לתלמידי כיתה ט' רמה מצומצמת מתוך קובץ שאלות של תכ\"ל החדשה בחט\"ע",
    "url": "https://docs.google.com/document/d/1NZMcSUPxyR5E8PGKgTpklYKDMiY-RRSiSDZES2bqX7Y/edit",
    "kind": "doc",
    "grades": [
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "quadratic-function",
      "graph-reading-literacy"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "multi-activity-collection",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-57ceeac1ffe1"
    ],
    "evidence": [
      "Explicit source grade label: ט' רמה מצומצמת.",
      "Source topic: פונקציה ריבועית.",
      "Source description: אוסף שאלות מותאמות לתלמידי כיתה ט' רמה מצומצמת מתוך קובץ שאלות של תכ\"ל החדשה בחט\"ע."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1NZMcSUPxyR5E8PGKgTpklYKDMiY-RRSiSDZES2bqX7Y/preview",
    "download": "https://docs.google.com/document/d/1NZMcSUPxyR5E8PGKgTpklYKDMiY-RRSiSDZES2bqX7Y/export?format=pdf"
  },
  {
    "id": "src-curriculum-3c37ff462079",
    "title": "שאלות אוריינות - בערבית — בערבית",
    "note": "אוסף שאלות מותאמות לתלמידי כיתה ט' רמה מצומצמת מתוך קובץ שאלות של תכ\"ל החדשה בחט\"ע",
    "url": "https://docs.google.com/document/d/1ieeBkPA8clvRnnUmt2r2CdEJr6d5oPFl5Xz-HEV-4Fg/edit",
    "kind": "doc",
    "grades": [
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "quadratic-function",
      "graph-reading-literacy"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "multi-activity-collection",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-3c37ff462079"
    ],
    "evidence": [
      "Explicit source grade label: ט' רמה מצומצמת.",
      "Source topic: פונקציה ריבועית.",
      "Source description: אוסף שאלות מותאמות לתלמידי כיתה ט' רמה מצומצמת מתוך קובץ שאלות של תכ\"ל החדשה בחט\"ע."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1ieeBkPA8clvRnnUmt2r2CdEJr6d5oPFl5Xz-HEV-4Fg/preview",
    "download": "https://docs.google.com/document/d/1ieeBkPA8clvRnnUmt2r2CdEJr6d5oPFl5Xz-HEV-4Fg/export?format=pdf"
  },
  {
    "id": "src-curriculum-948028aeab70",
    "title": "לטיול יצאנו - ערבית — לטיול",
    "note": "שאלה אוריינית המשלבת אלגברה ופונקציות מתוך קובץ שאלות של תכ\"ל החדשה בחט\"ע",
    "url": "https://docs.google.com/document/d/1A_CZpF0td3iztbdhv1igv3AhAUuDmDnDUzdNoXWyFTM/edit",
    "kind": "doc",
    "grades": [
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "quadratic-function",
      "graph-reading-literacy",
      "functions-preanalysis"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-948028aeab70"
    ],
    "evidence": [
      "Explicit source grade label: ט' רמה מצומצמת.",
      "Source topic: פונקציה ריבועית.",
      "Source description: שאלה אוריינית המשלבת אלגברה ופונקציות מתוך קובץ שאלות של תכ\"ל החדשה בחט\"ע."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1A_CZpF0td3iztbdhv1igv3AhAUuDmDnDUzdNoXWyFTM/preview",
    "download": "https://docs.google.com/document/d/1A_CZpF0td3iztbdhv1igv3AhAUuDmDnDUzdNoXWyFTM/export?format=pdf"
  },
  {
    "id": "src-curriculum-49cdd7293889",
    "title": "לטיול יצאנו - ערבית — ערבית",
    "note": "שאלה אוריינית המשלבת אלגברה ופונקציות מתוך קובץ שאלות של תכ\"ל החדשה בחט\"ע",
    "url": "https://docs.google.com/document/d/1g-p0L_Gs5zLmhw5CzZusdNkQn-SyRM2A/edit",
    "kind": "doc",
    "grades": [
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "quadratic-function",
      "graph-reading-literacy",
      "functions-preanalysis"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-49cdd7293889"
    ],
    "evidence": [
      "Explicit source grade label: ט' רמה מצומצמת.",
      "Source topic: פונקציה ריבועית.",
      "Source description: שאלה אוריינית המשלבת אלגברה ופונקציות מתוך קובץ שאלות של תכ\"ל החדשה בחט\"ע."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1g-p0L_Gs5zLmhw5CzZusdNkQn-SyRM2A/preview",
    "download": "https://docs.google.com/document/d/1g-p0L_Gs5zLmhw5CzZusdNkQn-SyRM2A/export?format=pdf"
  },
  {
    "id": "src-curriculum-d7c7d623c835",
    "title": "פעולות על פונקציה ריבועית- — שרית ביטון",
    "note": "תרגיל מסכם פעולות שונות על פונקציה ריבועית",
    "url": "https://docs.google.com/document/d/16VXwSEegU9nJxw2wPOgvHm5MKPQhFfXqur8JfRkavzk/edit",
    "kind": "doc",
    "grades": [
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "quadratic-function"
    ],
    "collections": [
      "summaries",
      "printable"
    ],
    "resourceType": "summary-task",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-d7c7d623c835"
    ],
    "evidence": [
      "Explicit source grade label: ט' קבוצות חזקות.",
      "Source topic: פונקציה ריבועית.",
      "Source description: תרגיל מסכם פעולות שונות על פונקציה ריבועית."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/16VXwSEegU9nJxw2wPOgvHm5MKPQhFfXqur8JfRkavzk/preview",
    "download": "https://docs.google.com/document/d/16VXwSEegU9nJxw2wPOgvHm5MKPQhFfXqur8JfRkavzk/export?format=pdf"
  },
  {
    "id": "src-curriculum-7998ebc4f091",
    "title": "זוויות בעין מתמטית-מרכז מורים ארצי",
    "note": "אוסף משימות בנושא של סוגי זוויות המכיל פעילויות מיון קצרות המחדדות הבנה. המשימות מתאימות לתלמידי כיתות ז' ברמות השונות ומאפשרות לכל תלמיד בכיתה לענות עליהן בהתאם ליכולותיו.",
    "url": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3524-angles-from-a-mathematic-view-7th-grade",
    "kind": "link",
    "grades": [
      "z"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "angles"
    ],
    "collections": [
      "digital",
      "printable"
    ],
    "resourceType": "multi-activity-collection",
    "delivery": "hybrid",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-7998ebc4f091"
    ],
    "evidence": [
      "Explicit source grade label: ז'.",
      "Source topic: זוויות.",
      "Source description: אוסף משימות בנושא של סוגי זוויות המכיל פעילויות מיון קצרות המחדדות הבנה. המשימות מתאימות לתלמידי כיתות ז' ברמות השונות ומאפשרות לכל תלמיד בכיתה לענות עליהן בהתאם ליכולותיו.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false
  },
  {
    "id": "src-curriculum-5fc92fca0b51",
    "title": "זוויות בעין מתמטית- מרכז מורים ארצי",
    "note": "אוסף משימות בנושא של סוגי זוויות המכיל פעילויות מיון קצרות המחדדות הבנה. המשימות מתאימות לתלמידי כיתות ח' ברמות השונות ומאפשרות לכל תלמיד בכיתה לענות עליהן בהתאם ליכולותיו.",
    "url": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3525-angles-from-a-mathematic-view-8th-grade",
    "kind": "link",
    "grades": [
      "h"
    ],
    "domains": [
      "geometry"
    ],
    "sourceTopicIds": [
      "angles"
    ],
    "collections": [
      "digital",
      "printable"
    ],
    "resourceType": "multi-activity-collection",
    "delivery": "hybrid",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-5fc92fca0b51"
    ],
    "evidence": [
      "Explicit source grade label: ח'.",
      "Source topic: זוויות.",
      "Source description: אוסף משימות בנושא של סוגי זוויות המכיל פעילויות מיון קצרות המחדדות הבנה. המשימות מתאימות לתלמידי כיתות ח' ברמות השונות ומאפשרות לכל תלמיד בכיתה לענות עליהן בהתאם ליכולותיו.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false
  },
  {
    "id": "src-curriculum-c773865b385c",
    "title": "שאלות קצרות פונקציות-דיה זגורי",
    "note": "אוסף שאלות קצרות לרמה בינונית וגבוהה",
    "url": "https://docs.google.com/document/d/1Gm5BwHm6ka3sVzGCycSfyWoAUtmrw7j7mzGut-hVm-k/edit",
    "kind": "doc",
    "grades": [
      "t"
    ],
    "domains": [],
    "sourceTopicIds": [
      "functions-preanalysis"
    ],
    "collections": [
      "printable"
    ],
    "resourceType": "multi-activity-collection",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-c773865b385c"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: פונקציות.",
      "Source description: אוסף שאלות קצרות לרמה בינונית וגבוהה."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1Gm5BwHm6ka3sVzGCycSfyWoAUtmrw7j7mzGut-hVm-k/preview",
    "download": "https://docs.google.com/document/d/1Gm5BwHm6ka3sVzGCycSfyWoAUtmrw7j7mzGut-hVm-k/export?format=pdf"
  },
  {
    "id": "src-curriculum-d72b06a2b074",
    "title": "אוסף שאלות קצרות בנושא פונקציה ריבועית- מרכז מורים ארצי",
    "note": "אוסף משימות העוסק בייצוגים שונים של פונקציה ריבועית ובמעבר ביניהם. המשימות הן משימות קצרות שמטרתן לחדד, להעמיק את ההבנה ולעורר שיח מתמטי בכיתה. המשימות מתאימות לתלמידי כיתה ט' ברמות הגבוהות.",
    "url": "https://newhighmath.haifa.ac.il/index.php/458-9th-grade-activities/3526-parabola-short-questions-9th-grade",
    "kind": "link",
    "grades": [
      "t"
    ],
    "domains": [
      "algebra"
    ],
    "sourceTopicIds": [
      "quadratic-function",
      "functions-preanalysis"
    ],
    "collections": [
      "digital",
      "printable"
    ],
    "resourceType": "multi-activity-collection",
    "delivery": "hybrid",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-d72b06a2b074"
    ],
    "evidence": [
      "Explicit source grade label: ט' קבוצות חזקות.",
      "Source topic: פונקציות.",
      "Source description: אוסף משימות העוסק בייצוגים שונים של פונקציה ריבועית ובמעבר ביניהם. המשימות הן משימות קצרות שמטרתן לחדד, להעמיק את ההבנה ולעורר שיח מתמטי בכיתה. המשימות מתאימות לתלמידי כיתה ט' ברמות הגבוהות.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false
  },
  {
    "id": "src-curriculum-b6608b4a72db",
    "title": "תיקיית חומרים לכיתות ז-ט",
    "note": "Explicit source grade label: ז'-ט'.",
    "url": "https://drive.google.com/drive/folders/1CDvufsgap28Tg6A0-yz7a51IbhRHePqa",
    "kind": "drive",
    "grades": [
      "z",
      "h",
      "t"
    ],
    "domains": [],
    "sourceTopicIds": [
      "graph-reading-literacy"
    ],
    "collections": [
      "enrichment",
      "digital",
      "printable"
    ],
    "resourceType": "resource-repository",
    "delivery": "hybrid",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-b6608b4a72db"
    ],
    "evidence": [
      "Explicit source grade label: ז'-ט'.",
      "Source topic: שאלות אוריינות ברוח תכנית הלימודים החדשה.",
      "Source description: (none)."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://drive.google.com/embeddedfolderview?id=1CDvufsgap28Tg6A0-yz7a51IbhRHePqa#list"
  },
  {
    "id": "src-curriculum-b3c69260da62",
    "title": "אוסף שאלות מבחינות בגרות מותאמות לחט\"ב",
    "note": "Explicit source grade label: (missing).",
    "url": "https://docs.google.com/document/d/1crBTxtZp4SXD0b07QRc4Kl8PCI1dX-fqkRpaW4b_KFI/edit",
    "kind": "doc",
    "grades": [],
    "domains": [],
    "sourceTopicIds": [],
    "collections": [
      "summaries",
      "enrichment",
      "printable"
    ],
    "resourceType": "multi-activity-collection",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-b3c69260da62"
    ],
    "evidence": [
      "Explicit source grade label: (missing).",
      "Source topic: שאלות מבחינות בגרות תכנית לימודים חדשה.",
      "Source description: (none)."
    ],
    "needsReview": true,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/document/d/1crBTxtZp4SXD0b07QRc4Kl8PCI1dX-fqkRpaW4b_KFI/preview",
    "download": "https://docs.google.com/document/d/1crBTxtZp4SXD0b07QRc4Kl8PCI1dX-fqkRpaW4b_KFI/export?format=pdf",
    "reviewReason": "Adapted matriculation-question collection with no explicit grade label. Preserve it, but do not assign a grade or topic without evidence."
  },
  {
    "id": "src-curriculum-012bc422a750",
    "title": "מקבצי שאלות",
    "note": "אוסף שאלות לפי נושאים בפריסות ההוראה בחודשים ספטמבר-דצמבר",
    "url": "https://docs.google.com/presentation/d/1FqmJw3SPcAcw1LS5J7hv9D19VSg3AzQLOXunF-JUprw/edit",
    "kind": "doc",
    "grades": [
      "z",
      "h",
      "t"
    ],
    "domains": [],
    "sourceTopicIds": [],
    "collections": [
      "summaries",
      "digital",
      "printable"
    ],
    "resourceType": "multi-activity-collection",
    "delivery": "hybrid",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-012bc422a750"
    ],
    "evidence": [
      "Explicit source grade label: ז'-ט'.",
      "Source topic: מקבצי שאלות לסיכום מחצית.",
      "Source description: אוסף שאלות לפי נושאים בפריסות ההוראה בחודשים ספטמבר-דצמבר."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/presentation/d/1FqmJw3SPcAcw1LS5J7hv9D19VSg3AzQLOXunF-JUprw/preview",
    "download": "https://docs.google.com/presentation/d/1FqmJw3SPcAcw1LS5J7hv9D19VSg3AzQLOXunF-JUprw/export/pdf"
  },
  {
    "id": "src-curriculum-106460e3dbb7",
    "title": "מקבצי שאלות",
    "note": "אוסף שאלות לסיכום שנה לפי פריסות הוראה תשפ\"ג",
    "url": "https://docs.google.com/presentation/d/1O0Um78b3fTuOAwBhyz2KrFQXaAMqVGuglJ6wvlwHZ28/edit",
    "kind": "doc",
    "grades": [
      "z",
      "h",
      "t"
    ],
    "domains": [],
    "sourceTopicIds": [],
    "collections": [
      "summaries",
      "digital",
      "printable"
    ],
    "resourceType": "multi-activity-collection",
    "delivery": "hybrid",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-106460e3dbb7"
    ],
    "evidence": [
      "Explicit source grade label: ז'-ט'.",
      "Source topic: מקבצי שאלות לסיכום שנה.",
      "Source description: אוסף שאלות לסיכום שנה לפי פריסות הוראה תשפ\"ג."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/presentation/d/1O0Um78b3fTuOAwBhyz2KrFQXaAMqVGuglJ6wvlwHZ28/preview",
    "download": "https://docs.google.com/presentation/d/1O0Um78b3fTuOAwBhyz2KrFQXaAMqVGuglJ6wvlwHZ28/export/pdf"
  },
  {
    "id": "src-curriculum-6f44d59030f7",
    "title": "עברית , ערבית — עברית",
    "note": "קובץ תרגילים לתלמידים המיועדים ללמוד ברמת 4 יח\"ל בחטיבה העליונה. הדוגמאות נועדו להציג מהי הרמה הנדרשת ללמידה ברמת 4 יח\"ל בתיכון.",
    "url": "https://docs.google.com/document/d/1GZtHat8xbY0r2OR9XpHW5Y4AtbJIuv0NJSR2CD9gHNc/edit",
    "kind": "doc",
    "grades": [
      "t"
    ],
    "domains": [],
    "sourceTopicIds": [],
    "collections": [],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-6f44d59030f7"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: מקבץ שאלות לבוגרי ט' הלומדים בתיכון ברמת 4 יח\"ל.",
      "Source description: קובץ תרגילים לתלמידים המיועדים ללמוד ברמת 4 יח\"ל בחטיבה העליונה. הדוגמאות נועדו להציג מהי הרמה הנדרשת ללמידה ברמת 4 יח\"ל בתיכון.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": true,
    "embed": "https://docs.google.com/document/d/1GZtHat8xbY0r2OR9XpHW5Y4AtbJIuv0NJSR2CD9gHNc/preview",
    "download": "https://docs.google.com/document/d/1GZtHat8xbY0r2OR9XpHW5Y4AtbJIuv0NJSR2CD9gHNc/export?format=pdf"
  },
  {
    "id": "src-curriculum-1e51225a3948",
    "title": "עברית , ערבית — ערבית",
    "note": "קובץ תרגילים לתלמידים המיועדים ללמוד ברמת 4 יח\"ל בחטיבה העליונה. הדוגמאות נועדו להציג מהי הרמה הנדרשת ללמידה ברמת 4 יח\"ל בתיכון.",
    "url": "https://docs.google.com/document/d/1nrBT1UoqdqbzjkSAduCGZTt8Wd-sCEmeLZkp9w-4-ls/edit",
    "kind": "doc",
    "grades": [
      "t"
    ],
    "domains": [],
    "sourceTopicIds": [],
    "collections": [],
    "resourceType": "worksheet",
    "delivery": "printable",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-1e51225a3948"
    ],
    "evidence": [
      "Explicit source grade label: ט'.",
      "Source topic: מקבץ שאלות לבוגרי ט' הלומדים בתיכון ברמת 4 יח\"ל.",
      "Source description: קובץ תרגילים לתלמידים המיועדים ללמוד ברמת 4 יח\"ל בחטיבה העליונה. הדוגמאות נועדו להציג מהי הרמה הנדרשת ללמידה ברמת 4 יח\"ל בתיכון.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": true,
    "embed": "https://docs.google.com/document/d/1nrBT1UoqdqbzjkSAduCGZTt8Wd-sCEmeLZkp9w-4-ls/preview",
    "download": "https://docs.google.com/document/d/1nrBT1UoqdqbzjkSAduCGZTt8Wd-sCEmeLZkp9w-4-ls/export?format=pdf"
  },
  {
    "id": "src-curriculum-e221681c4d5e",
    "title": "מחצית א' מחצית ב' — מחצית",
    "note": "חומרי למידה שהוכנו על ידי צוות ההדרכה הארצי במתמטיקה חט\"ב. החומרים מכילים תרגול בנושאים מרכזיים בתוכנית ההוראה מחצית א' ומחצית ב'.",
    "url": "https://docs.google.com/presentation/d/1jYhdm7kN9m4LpvDaJ_SQ1iG557pe4WyCjB_xAKv8bew/edit",
    "kind": "doc",
    "grades": [
      "z",
      "h",
      "t"
    ],
    "domains": [],
    "sourceTopicIds": [],
    "collections": [
      "summaries",
      "digital",
      "printable"
    ],
    "resourceType": "multi-activity-collection",
    "delivery": "hybrid",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-e221681c4d5e"
    ],
    "evidence": [
      "Explicit source grade label: ז'-ט'.",
      "Source topic: חוברות לסיום מחצית וסוף שנה.",
      "Source description: חומרי למידה שהוכנו על ידי צוות ההדרכה הארצי במתמטיקה חט\"ב. החומרים מכילים תרגול בנושאים מרכזיים בתוכנית ההוראה מחצית א' ומחצית  ב'.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/presentation/d/1jYhdm7kN9m4LpvDaJ_SQ1iG557pe4WyCjB_xAKv8bew/preview",
    "download": "https://docs.google.com/presentation/d/1jYhdm7kN9m4LpvDaJ_SQ1iG557pe4WyCjB_xAKv8bew/export/pdf"
  },
  {
    "id": "src-curriculum-e93c575a0b04",
    "title": "מחצית א' מחצית ב' — מחצית",
    "note": "חומרי למידה שהוכנו על ידי צוות ההדרכה הארצי במתמטיקה חט\"ב. החומרים מכילים תרגול בנושאים מרכזיים בתוכנית ההוראה מחצית א' ומחצית ב'.",
    "url": "https://docs.google.com/presentation/d/1yMOTmEavx3mgUDbeIzLT_mSpJmcpe6_8HmieZhLpSN4/edit",
    "kind": "doc",
    "grades": [
      "z",
      "h",
      "t"
    ],
    "domains": [],
    "sourceTopicIds": [],
    "collections": [
      "summaries",
      "digital",
      "printable"
    ],
    "resourceType": "multi-activity-collection",
    "delivery": "hybrid",
    "source": "מתוך חומרים לחט״ב ברוח תכנית הלימודים החדשה",
    "sourceRecordIds": [
      "curriculum-e93c575a0b04"
    ],
    "evidence": [
      "Explicit source grade label: ז'-ט'.",
      "Source topic: חוברות לסיום מחצית וסוף שנה.",
      "Source description: חומרי למידה שהוכנו על ידי צוות ההדרכה הארצי במתמטיקה חט\"ב. החומרים מכילים תרגול בנושאים מרכזיים בתוכנית ההוראה מחצית א' ומחצית  ב'.."
    ],
    "needsReview": false,
    "excludedFromTeachingMaterials": false,
    "embed": "https://docs.google.com/presentation/d/1yMOTmEavx3mgUDbeIzLT_mSpJmcpe6_8HmieZhLpSN4/preview",
    "download": "https://docs.google.com/presentation/d/1yMOTmEavx3mgUDbeIzLT_mSpJmcpe6_8HmieZhLpSN4/export/pdf"
  }
];

export const sourceMaterialPlacements: SourceMaterialPlacement[] = [
  {
    "resourceId": "src-game-z-00576add9b0f",
    "grade": "z",
    "topicChapterIds": [
      "z-expressions"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-c9ff7e0990e6",
    "grade": "z",
    "topicChapterIds": [
      "z-expressions"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-2240924d847e",
    "grade": "z",
    "topicChapterIds": [
      "z-expressions"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-9345687178d9",
    "grade": "z",
    "topicChapterIds": [
      "z-expressions"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-6d10346fe069",
    "grade": "z",
    "topicChapterIds": [
      "z-expressions"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-37b4e8418036",
    "grade": "z",
    "topicChapterIds": [
      "z-expressions"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-78f405097bb9",
    "grade": "z",
    "topicChapterIds": [
      "z-expressions"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-463d12bf9544",
    "grade": "z",
    "topicChapterIds": [
      "z-expressions"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-9927455e10df",
    "grade": "z",
    "topicChapterIds": [
      "z-expressions"
    ],
    "collectionChapterIds": [
      "mischakim",
      "sikumim"
    ]
  },
  {
    "resourceId": "src-game-z-65da3d977eff",
    "grade": "z",
    "topicChapterIds": [
      "z-expressions"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-c6276f21e166",
    "grade": "z",
    "topicChapterIds": [
      "z-expressions"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-5e82a6f250e8",
    "grade": "z",
    "topicChapterIds": [
      "z-expressions"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-60363fb6650a",
    "grade": "z",
    "topicChapterIds": [
      "z-expressions"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-a7ad3a34d489",
    "grade": "z",
    "topicChapterIds": [
      "z-equations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-3ae158381dbe",
    "grade": "z",
    "topicChapterIds": [
      "z-equations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-bda6b0c4a124",
    "grade": "z",
    "topicChapterIds": [
      "z-equations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-1fb342ad0a97",
    "grade": "z",
    "topicChapterIds": [
      "z-equations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-101d82415598",
    "grade": "z",
    "topicChapterIds": [
      "z-equations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-9d2549a4296f",
    "grade": "z",
    "topicChapterIds": [
      "z-equations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-6821aaaaa55c",
    "grade": "z",
    "topicChapterIds": [
      "z-equations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-f12830e08dc1",
    "grade": "z",
    "topicChapterIds": [
      "z-equations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-f01af038baa3",
    "grade": "z",
    "topicChapterIds": [
      "z-equations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-b63873233827",
    "grade": "z",
    "topicChapterIds": [
      "z-equations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-ceb0b551eb94",
    "grade": "z",
    "topicChapterIds": [
      "z-equations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-02b2223a8bfd",
    "grade": "z",
    "topicChapterIds": [
      "z-box-cube"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-012df6acfa6c",
    "grade": "z",
    "topicChapterIds": [
      "z-coordinate-system"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-31c69d9825d3",
    "grade": "z",
    "topicChapterIds": [
      "z-coordinate-system"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-19d5dcec2194",
    "grade": "z",
    "topicChapterIds": [
      "z-coordinate-system"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-62287bbdf55d",
    "grade": "z",
    "topicChapterIds": [
      "z-coordinate-system"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-f7c4b5d53e29",
    "grade": "z",
    "topicChapterIds": [
      "z-equations",
      "z-order-operations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-f42791d62bf0",
    "grade": "z",
    "topicChapterIds": [
      "z-order-operations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-ba0b5e482c5f",
    "grade": "z",
    "topicChapterIds": [
      "z-order-operations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-4f0b4eca7eb2",
    "grade": "z",
    "topicChapterIds": [
      "z-expressions",
      "z-order-operations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-3e926d886ff2",
    "grade": "z",
    "topicChapterIds": [
      "z-order-operations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-602b96061488",
    "grade": "z",
    "topicChapterIds": [
      "z-directed-numbers"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-21f195d851f1",
    "grade": "z",
    "topicChapterIds": [
      "z-directed-numbers"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-e31795fef3c2",
    "grade": "z",
    "topicChapterIds": [
      "z-directed-numbers"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-z-fbae9c9dcc77",
    "grade": "z",
    "topicChapterIds": [
      "z-directed-numbers"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-6cbeef0c951a",
    "grade": "h",
    "topicChapterIds": [
      "h-linear-function"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-67ac155f019d",
    "grade": "h",
    "topicChapterIds": [
      "h-linear-function"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-496135f41e40",
    "grade": "h",
    "topicChapterIds": [
      "h-linear-function"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-807bccfd80e5",
    "grade": "h",
    "topicChapterIds": [
      "h-linear-function"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-5f1c6a2e5e03",
    "grade": "h",
    "topicChapterIds": [
      "h-linear-function",
      "h-equations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-a050967f185b",
    "grade": "h",
    "topicChapterIds": [
      "h-linear-function"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-a4bd43f4ebf3",
    "grade": "h",
    "topicChapterIds": [
      "h-linear-function"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-f3a21b552630",
    "grade": "h",
    "topicChapterIds": [
      "h-linear-function"
    ],
    "collectionChapterIds": [
      "mischakim",
      "sikumim"
    ]
  },
  {
    "resourceId": "src-game-h-58cc4f488e83",
    "grade": "h",
    "topicChapterIds": [
      "h-linear-function"
    ],
    "collectionChapterIds": [
      "mischakim",
      "sikumim"
    ]
  },
  {
    "resourceId": "src-game-h-fe374680a0bb",
    "grade": "h",
    "topicChapterIds": [
      "h-linear-function"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-266e772cc1d9",
    "grade": "h",
    "topicChapterIds": [
      "h-linear-function"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-3d3adea92f4d",
    "grade": "h",
    "topicChapterIds": [
      "h-linear-function",
      "h-equations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-7c9e1de73af8",
    "grade": "h",
    "topicChapterIds": [
      "h-linear-function",
      "h-equations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-b928fe90f53f",
    "grade": "h",
    "topicChapterIds": [
      "h-linear-function"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-a6b435cade25",
    "grade": "h",
    "topicChapterIds": [
      "h-linear-function"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-79f1eccd96f9",
    "grade": "h",
    "topicChapterIds": [
      "h-linear-function",
      "h-equations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-9f82314057a2",
    "grade": "h",
    "topicChapterIds": [
      "h-linear-function"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-e9d5af06be0e",
    "grade": "h",
    "topicChapterIds": [
      "h-linear-function"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-5c715a3e0e8d",
    "grade": "h",
    "topicChapterIds": [
      "h-equations"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-7a1e51bbee6f",
    "grade": "h",
    "topicChapterIds": [
      "h-systems"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-3daa1d1692a2",
    "grade": "h",
    "topicChapterIds": [
      "h-statistics"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-f2730e69ef22",
    "grade": "h",
    "topicChapterIds": [
      "h-areas-pythagoras"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-6b5c3f25c553",
    "grade": "h",
    "topicChapterIds": [
      "h-equations",
      "h-angles"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-h-15fa15fef39c",
    "grade": "h",
    "topicChapterIds": [],
    "collectionChapterIds": [
      "mischakim",
      "sikumim"
    ]
  },
  {
    "resourceId": "src-game-t-f96bc54899bb",
    "grade": "t",
    "topicChapterIds": [
      "t-quadrilaterals",
      "t-kite",
      "t-similarity-pythagoras"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-t-ee9cbe3251c4",
    "grade": "t",
    "topicChapterIds": [
      "t-quadrilaterals",
      "t-kite",
      "t-similarity-pythagoras"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-t-b2c647299984",
    "grade": "t",
    "topicChapterIds": [
      "t-proofs"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-t-d0d5af728b47",
    "grade": "t",
    "topicChapterIds": [
      "t-proofs"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-t-4511fce03b20",
    "grade": "t",
    "topicChapterIds": [
      "t-technique"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-t-13edad04d513",
    "grade": "t",
    "topicChapterIds": [
      "t-technique"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-t-9fbb30cdc0e3",
    "grade": "t",
    "topicChapterIds": [
      "t-technique"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-t-ea21f3af58b3",
    "grade": "t",
    "topicChapterIds": [
      "t-technique"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-t-76669b599f22",
    "grade": "t",
    "topicChapterIds": [
      "t-technique"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-t-168e283baaa2",
    "grade": "t",
    "topicChapterIds": [
      "t-preanalysis"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-t-c006d81e537d",
    "grade": "t",
    "topicChapterIds": [
      "t-preanalysis"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-t-05373c5c4a26",
    "grade": "t",
    "topicChapterIds": [
      "t-quadratic"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-t-38f83b261a02",
    "grade": "t",
    "topicChapterIds": [
      "t-quadratic"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-t-8253c1eb9506",
    "grade": "t",
    "topicChapterIds": [
      "t-quadratic"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-t-84a73f3b5de9",
    "grade": "t",
    "topicChapterIds": [
      "t-quadratic"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-t-6a25b23e0c4e",
    "grade": "t",
    "topicChapterIds": [
      "t-quadratic"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-game-t-3b8a123059d1",
    "grade": "t",
    "topicChapterIds": [
      "t-quadratic"
    ],
    "collectionChapterIds": [
      "mischakim"
    ]
  },
  {
    "resourceId": "src-curriculum-dfa0b51f00ee",
    "grade": "z",
    "topicChapterIds": [
      "z-coordinate-system",
      "z-areas-perimeters"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-5164db8ab8b5",
    "grade": "z",
    "topicChapterIds": [
      "z-coordinate-system",
      "z-areas-perimeters"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-ce1a6eb8d15b",
    "grade": "z",
    "topicChapterIds": [
      "z-coordinate-system"
    ],
    "collectionChapterIds": [
      "sikumim"
    ]
  },
  {
    "resourceId": "src-curriculum-809af3373f22",
    "grade": "z",
    "topicChapterIds": [
      "z-coordinate-system"
    ],
    "collectionChapterIds": [
      "sikumim"
    ]
  },
  {
    "resourceId": "src-curriculum-71f88b7ed752",
    "grade": "h",
    "topicChapterIds": [
      "h-coordinate-geometry",
      "h-congruent",
      "h-similar",
      "h-areas-pythagoras"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-433698c54bce",
    "grade": "h",
    "topicChapterIds": [
      "h-coordinate-geometry",
      "h-congruent",
      "h-similar",
      "h-areas-pythagoras"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-4e721f0cd2ec",
    "grade": "h",
    "topicChapterIds": [
      "h-coordinate-geometry",
      "h-congruent",
      "h-similar",
      "h-areas-pythagoras"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-965663be4bab",
    "grade": "h",
    "topicChapterIds": [
      "h-coordinate-geometry",
      "h-parallel",
      "h-congruent",
      "h-similar",
      "h-areas-pythagoras",
      "h-linear-function"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-dd36680d816e",
    "grade": "h",
    "topicChapterIds": [
      "h-coordinate-geometry",
      "h-parallel",
      "h-congruent",
      "h-similar",
      "h-areas-pythagoras",
      "h-linear-function"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-0b4b09cdce63",
    "grade": "t",
    "topicChapterIds": [
      "t-coordinate-geometry",
      "t-kite",
      "t-similarity-pythagoras"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-e2583f30eda8",
    "grade": "t",
    "topicChapterIds": [
      "t-coordinate-geometry",
      "t-trapezoid"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-fc0d096cc4bd",
    "grade": "t",
    "topicChapterIds": [
      "t-coordinate-geometry",
      "t-trapezoid"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-124e4cb32286",
    "grade": "t",
    "topicChapterIds": [
      "t-coordinate-geometry",
      "t-kite",
      "t-trapezoid"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-6c64b9167a39",
    "grade": "t",
    "topicChapterIds": [
      "t-coordinate-geometry",
      "t-parallelogram"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-61ae8c71bc15",
    "grade": "t",
    "topicChapterIds": [
      "t-coordinate-geometry",
      "t-parallelogram"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-3c5d41a9d58f",
    "grade": "t",
    "topicChapterIds": [
      "t-coordinate-geometry",
      "t-parallelogram"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-ecc009634bfd",
    "grade": "t",
    "topicChapterIds": [
      "t-parallelogram"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-965bf8827411",
    "grade": "t",
    "topicChapterIds": [
      "t-parallelogram"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-ee20bc58b48f",
    "grade": "t",
    "topicChapterIds": [
      "t-coordinate-geometry",
      "t-rectangle-rhombus"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-fe13dbb77b28",
    "grade": "t",
    "topicChapterIds": [
      "t-coordinate-geometry",
      "t-rectangle-rhombus"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-05c3d6e31666",
    "grade": "t",
    "topicChapterIds": [
      "t-coordinate-geometry",
      "t-rectangle-rhombus"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-87c0868756a0",
    "grade": "t",
    "topicChapterIds": [
      "t-coordinate-geometry",
      "t-rectangle-rhombus"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-2122131e0624",
    "grade": "t",
    "topicChapterIds": [
      "t-coordinate-geometry",
      "t-similarity-pythagoras"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-34fb7bbd1911",
    "grade": "t",
    "topicChapterIds": [
      "t-coordinate-geometry",
      "t-similarity-pythagoras"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-8854cf7a3fff",
    "grade": "h",
    "topicChapterIds": [
      "h-coordinate-geometry",
      "h-areas-pythagoras"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-8854cf7a3fff",
    "grade": "t",
    "topicChapterIds": [
      "t-coordinate-geometry",
      "t-similarity-pythagoras"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-ad6a4647940a",
    "grade": "z",
    "topicChapterIds": [
      "z-circle"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-41af23ea0ea3",
    "grade": "h",
    "topicChapterIds": [
      "h-parallel",
      "h-linear-function"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-53c5674cdbb1",
    "grade": "h",
    "topicChapterIds": [
      "h-congruent"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-b3e599064912",
    "grade": "t",
    "topicChapterIds": [
      "t-similarity-pythagoras"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-41afdc2da59e",
    "grade": "h",
    "topicChapterIds": [
      "h-congruent",
      "h-similar",
      "h-areas-pythagoras"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-9fc3f4092d81",
    "grade": "h",
    "topicChapterIds": [
      "h-similar",
      "h-percentages",
      "h-areas-pythagoras"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-9fc3f4092d81",
    "grade": "t",
    "topicChapterIds": [
      "t-similarity-pythagoras",
      "t-literacy"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-f3d7f73d5789",
    "grade": "h",
    "topicChapterIds": [
      "h-similar",
      "h-areas-pythagoras"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-f3d7f73d5789",
    "grade": "t",
    "topicChapterIds": [
      "t-similarity-pythagoras"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-dedbd97793c1",
    "grade": "h",
    "topicChapterIds": [],
    "collectionChapterIds": [
      "sikumim"
    ]
  },
  {
    "resourceId": "src-curriculum-ef917264500e",
    "grade": "h",
    "topicChapterIds": [],
    "collectionChapterIds": [
      "sikumim"
    ]
  },
  {
    "resourceId": "src-curriculum-b58c2b6e9f58",
    "grade": "h",
    "topicChapterIds": [
      "h-congruent",
      "h-similar",
      "h-linear-function",
      "h-areas-pythagoras"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-b58c2b6e9f58",
    "grade": "t",
    "topicChapterIds": [
      "t-proofs",
      "t-similarity-pythagoras",
      "t-preanalysis"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-3380820b5724",
    "grade": "t",
    "topicChapterIds": [
      "t-kite"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-e89100e098c9",
    "grade": "t",
    "topicChapterIds": [
      "t-coordinate-geometry",
      "t-quadrilaterals",
      "t-proofs"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-28af0eb34fa4",
    "grade": "z",
    "topicChapterIds": [
      "z-areas-perimeters",
      "z-expressions"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-28af0eb34fa4",
    "grade": "h",
    "topicChapterIds": [
      "h-areas-pythagoras",
      "h-equations"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-d45210f8a97c",
    "grade": "z",
    "topicChapterIds": [
      "z-areas-perimeters",
      "z-expressions"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-d45210f8a97c",
    "grade": "h",
    "topicChapterIds": [
      "h-areas-pythagoras",
      "h-equations"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-ba33882d0751",
    "grade": "h",
    "topicChapterIds": [
      "h-areas-pythagoras",
      "h-equations"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-ba33882d0751",
    "grade": "t",
    "topicChapterIds": [
      "t-coordinate-geometry",
      "t-technique"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-ad690fa39e57",
    "grade": "z",
    "topicChapterIds": [
      "z-areas-perimeters",
      "z-expressions"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-e137bb19fd28",
    "grade": "h",
    "topicChapterIds": [
      "h-percentages",
      "h-statistics"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-b3340c60869d",
    "grade": "h",
    "topicChapterIds": [
      "h-percentages",
      "h-statistics"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-9ac235d75c82",
    "grade": "z",
    "topicChapterIds": [
      "z-percentages",
      "z-coordinate-system"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-9ac235d75c82",
    "grade": "h",
    "topicChapterIds": [
      "h-percentages",
      "h-statistics"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-9ac235d75c82",
    "grade": "t",
    "topicChapterIds": [
      "t-literacy"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-664df64180ed",
    "grade": "z",
    "topicChapterIds": [
      "z-percentages"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-664df64180ed",
    "grade": "h",
    "topicChapterIds": [
      "h-percentages"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-664df64180ed",
    "grade": "t",
    "topicChapterIds": [
      "t-literacy"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-2f6066661864",
    "grade": "z",
    "topicChapterIds": [
      "z-coordinate-system"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-2f6066661864",
    "grade": "h",
    "topicChapterIds": [
      "h-statistics"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-566566b1dd8d",
    "grade": "z",
    "topicChapterIds": [
      "z-coordinate-system"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-566566b1dd8d",
    "grade": "h",
    "topicChapterIds": [
      "h-statistics"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-f2a9bd1f1dcd",
    "grade": "h",
    "topicChapterIds": [
      "h-statistics"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-f2a9bd1f1dcd",
    "grade": "t",
    "topicChapterIds": [
      "t-literacy"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-a69849f5cece",
    "grade": "h",
    "topicChapterIds": [
      "h-coordinate-geometry",
      "h-parallel",
      "h-inequalities"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-57ceeac1ffe1",
    "grade": "t",
    "topicChapterIds": [
      "t-quadratic",
      "t-literacy"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-3c37ff462079",
    "grade": "t",
    "topicChapterIds": [
      "t-quadratic",
      "t-literacy"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-948028aeab70",
    "grade": "t",
    "topicChapterIds": [
      "t-quadratic",
      "t-literacy",
      "t-preanalysis"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-49cdd7293889",
    "grade": "t",
    "topicChapterIds": [
      "t-quadratic",
      "t-literacy",
      "t-preanalysis"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-d7c7d623c835",
    "grade": "t",
    "topicChapterIds": [
      "t-quadratic"
    ],
    "collectionChapterIds": [
      "sikumim"
    ]
  },
  {
    "resourceId": "src-curriculum-7998ebc4f091",
    "grade": "z",
    "topicChapterIds": [
      "z-angles"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-5fc92fca0b51",
    "grade": "h",
    "topicChapterIds": [
      "h-angles"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-c773865b385c",
    "grade": "t",
    "topicChapterIds": [
      "t-preanalysis"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-d72b06a2b074",
    "grade": "t",
    "topicChapterIds": [
      "t-quadratic",
      "t-preanalysis"
    ],
    "collectionChapterIds": []
  },
  {
    "resourceId": "src-curriculum-b6608b4a72db",
    "grade": "z",
    "topicChapterIds": [
      "z-coordinate-system"
    ],
    "collectionChapterIds": [
      "haashara"
    ]
  },
  {
    "resourceId": "src-curriculum-b6608b4a72db",
    "grade": "h",
    "topicChapterIds": [
      "h-statistics"
    ],
    "collectionChapterIds": [
      "haashara"
    ]
  },
  {
    "resourceId": "src-curriculum-b6608b4a72db",
    "grade": "t",
    "topicChapterIds": [
      "t-literacy"
    ],
    "collectionChapterIds": [
      "haashara"
    ]
  },
  {
    "resourceId": "src-curriculum-012bc422a750",
    "grade": "z",
    "topicChapterIds": [],
    "collectionChapterIds": [
      "sikumim"
    ]
  },
  {
    "resourceId": "src-curriculum-012bc422a750",
    "grade": "h",
    "topicChapterIds": [],
    "collectionChapterIds": [
      "sikumim"
    ]
  },
  {
    "resourceId": "src-curriculum-012bc422a750",
    "grade": "t",
    "topicChapterIds": [],
    "collectionChapterIds": [
      "sikumim"
    ]
  },
  {
    "resourceId": "src-curriculum-106460e3dbb7",
    "grade": "z",
    "topicChapterIds": [],
    "collectionChapterIds": [
      "sikumim"
    ]
  },
  {
    "resourceId": "src-curriculum-106460e3dbb7",
    "grade": "h",
    "topicChapterIds": [],
    "collectionChapterIds": [
      "sikumim"
    ]
  },
  {
    "resourceId": "src-curriculum-106460e3dbb7",
    "grade": "t",
    "topicChapterIds": [],
    "collectionChapterIds": [
      "sikumim"
    ]
  },
  {
    "resourceId": "src-curriculum-e221681c4d5e",
    "grade": "z",
    "topicChapterIds": [],
    "collectionChapterIds": [
      "sikumim"
    ]
  },
  {
    "resourceId": "src-curriculum-e221681c4d5e",
    "grade": "h",
    "topicChapterIds": [],
    "collectionChapterIds": [
      "sikumim"
    ]
  },
  {
    "resourceId": "src-curriculum-e221681c4d5e",
    "grade": "t",
    "topicChapterIds": [],
    "collectionChapterIds": [
      "sikumim"
    ]
  },
  {
    "resourceId": "src-curriculum-e93c575a0b04",
    "grade": "z",
    "topicChapterIds": [],
    "collectionChapterIds": [
      "sikumim"
    ]
  },
  {
    "resourceId": "src-curriculum-e93c575a0b04",
    "grade": "h",
    "topicChapterIds": [],
    "collectionChapterIds": [
      "sikumim"
    ]
  },
  {
    "resourceId": "src-curriculum-e93c575a0b04",
    "grade": "t",
    "topicChapterIds": [],
    "collectionChapterIds": [
      "sikumim"
    ]
  }
];

export const sourceLinkLedger = [
  {
    "sourceRecordId": "curriculum-dfa0b51f00ee",
    "resourceId": "src-curriculum-dfa0b51f00ee",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 1,
    "sourceOrder": 1,
    "title": "שטח משולש במערכת צירים-צוות המודל חטב - ערבית — שטח",
    "canonicalUrl": "https://drive.google.com/file/d/1SXW6Lg9jwYkQVmMJQaAaWsFun2i7ShSv",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "areas-perimeters"
    ]
  },
  {
    "sourceRecordId": "curriculum-5164db8ab8b5",
    "resourceId": "src-curriculum-5164db8ab8b5",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 1,
    "sourceOrder": 2,
    "title": "שטח משולש במערכת צירים-צוות המודל חטב - ערבית — ערבית",
    "canonicalUrl": "https://docs.google.com/document/d/1B57C_rBaNO5MIWAzrHgYjd8nOVGuMarS",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "areas-perimeters"
    ]
  },
  {
    "sourceRecordId": "curriculum-ce1a6eb8d15b",
    "resourceId": "src-curriculum-ce1a6eb8d15b",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 2,
    "sourceOrder": 3,
    "title": "משימה מסכמת אינטגרטיבית מערכת צירים-צוות המודל חטב - ערבית — משימה",
    "canonicalUrl": "https://drive.google.com/file/d/1MD7vTbiDb0AhRj8d26qkOgsrFd85VrWd",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "coordinate-system"
    ]
  },
  {
    "sourceRecordId": "curriculum-809af3373f22",
    "resourceId": "src-curriculum-809af3373f22",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 2,
    "sourceOrder": 4,
    "title": "משימה מסכמת אינטגרטיבית מערכת צירים-צוות המודל חטב - ערבית — ערבית",
    "canonicalUrl": "https://drive.google.com/file/d/1cfqrDYJNP0ieA64cTSGM13OpSYsoBo1D",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "coordinate-system"
    ]
  },
  {
    "sourceRecordId": "curriculum-71f88b7ed752",
    "resourceId": "src-curriculum-71f88b7ed752",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 3,
    "sourceOrder": 5,
    "title": "משולש שווה שוקיים וחפיפת משולשים במערכת צירים - שגית רסולי",
    "canonicalUrl": "https://docs.google.com/document/d/1xAIcMljEP47jDT-6ApRddcrgKYQm_N49szsaXTJF3jc",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "congruent-triangles",
      "similar-triangles",
      "similarity-pythagoras"
    ]
  },
  {
    "sourceRecordId": "curriculum-433698c54bce",
    "resourceId": "src-curriculum-433698c54bce",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 4,
    "sourceOrder": 6,
    "title": "גיאומטריה במערכת צירים - כיתה ח'",
    "canonicalUrl": "https://docs.google.com/document/d/1YxrwU_YoHY1QxFN-fNkCGBYxpjw7Yi0T1CwlZvrPP2E",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "congruent-triangles",
      "similar-triangles",
      "similarity-pythagoras"
    ]
  },
  {
    "sourceRecordId": "curriculum-4e721f0cd2ec",
    "resourceId": "src-curriculum-4e721f0cd2ec",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 5,
    "sourceOrder": 7,
    "title": "גיאומטריה במערכת צירים-צוות מודל",
    "canonicalUrl": "https://docs.google.com/document/d/1sugmqnlO4RuCLMr3ZTdV-1Es43ytcFNj",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "congruent-triangles",
      "similar-triangles",
      "similarity-pythagoras"
    ]
  },
  {
    "sourceRecordId": "curriculum-965663be4bab",
    "resourceId": "src-curriculum-965663be4bab",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 6,
    "sourceOrder": 8,
    "title": "מרובעים במערכת צירים מרכז מורים ערבית — מרובעים",
    "canonicalUrl": "https://drive.google.com/file/d/1mT8m92tciox2JV_CtD8fryFdXhhs9LQ5",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "parallel-lines",
      "congruent-triangles",
      "similar-triangles",
      "quadrilaterals",
      "similarity-pythagoras",
      "geometry-theorems-proofs",
      "functions-preanalysis"
    ]
  },
  {
    "sourceRecordId": "curriculum-dd36680d816e",
    "resourceId": "src-curriculum-dd36680d816e",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 6,
    "sourceOrder": 9,
    "title": "מרובעים במערכת צירים מרכז מורים ערבית — ערבית",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/images/data2/8th_grade_complementary_/Arabic/integrative_squares_Arabic.pdf",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "parallel-lines",
      "congruent-triangles",
      "similar-triangles",
      "quadrilaterals",
      "similarity-pythagoras",
      "geometry-theorems-proofs",
      "functions-preanalysis"
    ]
  },
  {
    "sourceRecordId": "curriculum-0b4b09cdce63",
    "resourceId": "src-curriculum-0b4b09cdce63",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 7,
    "sourceOrder": 10,
    "title": "דלתון ומשולש שווה שוקיים במערכת צירים",
    "canonicalUrl": "https://drive.google.com/file/d/1xxGttqyu1KLTR-n6GJ1p_OEpzGNaAlXa",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "kite",
      "similarity-pythagoras"
    ]
  },
  {
    "sourceRecordId": "curriculum-e2583f30eda8",
    "resourceId": "src-curriculum-e2583f30eda8",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 8,
    "sourceOrder": 11,
    "title": "טרפז במערכת צירים - ערבית — טרפז",
    "canonicalUrl": "https://docs.google.com/document/d/1l1vU2zkvIIegsrkBMC_vmObrqeTSH4fi",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "trapezoid"
    ]
  },
  {
    "sourceRecordId": "curriculum-fc0d096cc4bd",
    "resourceId": "src-curriculum-fc0d096cc4bd",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 8,
    "sourceOrder": 12,
    "title": "טרפז במערכת צירים - ערבית — ערבית",
    "canonicalUrl": "https://docs.google.com/document/d/1CSr07HFrwj4INueuphiEtbmhl7kNMCUu",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "trapezoid"
    ]
  },
  {
    "sourceRecordId": "curriculum-124e4cb32286",
    "resourceId": "src-curriculum-124e4cb32286",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 9,
    "sourceOrder": 13,
    "title": "גאומטריה במערכת צירים",
    "canonicalUrl": "https://docs.google.com/document/d/1bxhgS5kb3JSuUtvVTEij8I4GkmPSDrmd",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "kite",
      "trapezoid"
    ]
  },
  {
    "sourceRecordId": "curriculum-6c64b9167a39",
    "resourceId": "src-curriculum-6c64b9167a39",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 10,
    "sourceOrder": 14,
    "title": "מקבילית במערכת צירים",
    "canonicalUrl": "https://docs.google.com/document/d/1k3y59u-KM-HkHA-8bo3IGtwmxyvRdtJb",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "parallelogram"
    ]
  },
  {
    "sourceRecordId": "curriculum-61ae8c71bc15",
    "resourceId": "src-curriculum-61ae8c71bc15",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 11,
    "sourceOrder": 15,
    "title": "מקבילית במערכת צירים מרכז מורים ערבית — מקבילית",
    "canonicalUrl": "https://drive.google.com/file/d/1qmWFrivU2WhsdTGeWazQYiOZMDKEu8ff",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "parallelogram"
    ]
  },
  {
    "sourceRecordId": "curriculum-3c5d41a9d58f",
    "resourceId": "src-curriculum-3c5d41a9d58f",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 11,
    "sourceOrder": 16,
    "title": "מקבילית במערכת צירים מרכז מורים ערבית — ערבית",
    "canonicalUrl": "https://drive.google.com/file/d/1mpDn2O0_tO-MStIxodGOfeO2o9boYhI8",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "parallelogram"
    ]
  },
  {
    "sourceRecordId": "curriculum-ecc009634bfd",
    "resourceId": "src-curriculum-ecc009634bfd",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 12,
    "sourceOrder": 17,
    "title": "תרגול אינטגרטיבי מקבילית - — ערבית — תרגול",
    "canonicalUrl": "https://docs.google.com/document/d/1-qd0PBe-IzDBSB2rYQJaN5c19iIOBEkz",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "parallelogram"
    ]
  },
  {
    "sourceRecordId": "curriculum-965bf8827411",
    "resourceId": "src-curriculum-965bf8827411",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 12,
    "sourceOrder": 18,
    "title": "תרגול אינטגרטיבי מקבילית - — ערבית — ערבית",
    "canonicalUrl": "https://drive.google.com/file/d/1gYZ5levIZJjkZnmNfKP4iwKqqqLn9I32",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "parallelogram"
    ]
  },
  {
    "sourceRecordId": "curriculum-ee20bc58b48f",
    "resourceId": "src-curriculum-ee20bc58b48f",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 13,
    "sourceOrder": 19,
    "title": "מלבן במערכת צירים — מלבן במערכת צירים-אוסף תרגילים — מלבן",
    "canonicalUrl": "https://docs.google.com/document/d/1UBzHw---TVR0cxNU3kiMg8Kqky5Ekkg2",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "rectangle-rhombus"
    ]
  },
  {
    "sourceRecordId": "curriculum-fe13dbb77b28",
    "resourceId": "src-curriculum-fe13dbb77b28",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 13,
    "sourceOrder": 20,
    "title": "מלבן במערכת צירים — מלבן במערכת צירים-אוסף תרגילים — מלבן",
    "canonicalUrl": "https://docs.google.com/document/d/1XIxCz3Ty1qkTQDL7Lj8RMVo_d8P1gVHI",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "rectangle-rhombus"
    ]
  },
  {
    "sourceRecordId": "curriculum-05c3d6e31666",
    "resourceId": "src-curriculum-05c3d6e31666",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 14,
    "sourceOrder": 21,
    "title": "גיאומטריה במערכת צירים-צוות מודל ערבית — גיאומטריה",
    "canonicalUrl": "https://docs.google.com/document/d/1TCrowZ5wA77iQ4XGqRpse1JMQ4CD8BB0oFVNIJb1cHU",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "rectangle-rhombus"
    ]
  },
  {
    "sourceRecordId": "curriculum-87c0868756a0",
    "resourceId": "src-curriculum-87c0868756a0",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 14,
    "sourceOrder": 22,
    "title": "גיאומטריה במערכת צירים-צוות מודל ערבית — ערבית",
    "canonicalUrl": "https://drive.google.com/file/d/12Q8IaJFau1XFPNPLSeu3BLjnnzyPmqGO",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "rectangle-rhombus"
    ]
  },
  {
    "sourceRecordId": "curriculum-2122131e0624",
    "resourceId": "src-curriculum-2122131e0624",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 15,
    "sourceOrder": 23,
    "title": "גאומטריה במערכת צירים מרכז מורים ערבית — גאומטריה",
    "canonicalUrl": "https://drive.google.com/file/d/1GubLSnEq51NSWWEgCf4rEz1ZVzU5Zddf",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "areas-perimeters",
      "similarity-pythagoras"
    ]
  },
  {
    "sourceRecordId": "curriculum-34fb7bbd1911",
    "resourceId": "src-curriculum-34fb7bbd1911",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 15,
    "sourceOrder": 24,
    "title": "גאומטריה במערכת צירים מרכז מורים ערבית — ערבית",
    "canonicalUrl": "https://drive.google.com/file/d/1uL8a08T1gz1tHqkkGTMBgveDiYGDzgG5",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "areas-perimeters",
      "similarity-pythagoras"
    ]
  },
  {
    "sourceRecordId": "curriculum-8854cf7a3fff",
    "resourceId": "src-curriculum-8854cf7a3fff",
    "source": "curriculum-document",
    "sourceTable": 0,
    "sourceRow": 16,
    "sourceOrder": 25,
    "title": "גיאומטריה אוקלידית בשילוב גיאומטריה אנליטית",
    "canonicalUrl": "https://docs.google.com/document/d/1xFWiF1c1OzHmKqwUaRrQzN705ysa1_XCG7LTBsk-YiI",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "h",
      "t"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "areas-perimeters",
      "similarity-pythagoras"
    ]
  },
  {
    "sourceRecordId": "curriculum-ad6a4647940a",
    "resourceId": "src-curriculum-ad6a4647940a",
    "source": "curriculum-document",
    "sourceTable": 1,
    "sourceRow": 1,
    "sourceOrder": 26,
    "title": "היקף ושטח מעגל-מרכז מורים",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3485-circle",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "circle"
    ]
  },
  {
    "sourceRecordId": "curriculum-41af23ea0ea3",
    "resourceId": "src-curriculum-41af23ea0ea3",
    "source": "curriculum-document",
    "sourceTable": 1,
    "sourceRow": 2,
    "sourceOrder": 27,
    "title": "ישרים מקבילים-מרכז מורים",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3514-2022-09-21-14-01-52",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "parallel-lines",
      "functions-preanalysis"
    ]
  },
  {
    "sourceRecordId": "curriculum-53c5674cdbb1",
    "resourceId": "src-curriculum-53c5674cdbb1",
    "source": "curriculum-document",
    "sourceTable": 1,
    "sourceRow": 3,
    "sourceOrder": 28,
    "title": "חפיפת משולשים - מרכז מורים",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3513-2022-09-21-13-52-32",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "congruent-triangles"
    ]
  },
  {
    "sourceRecordId": "curriculum-b3e599064912",
    "resourceId": "src-curriculum-b3e599064912",
    "source": "curriculum-document",
    "sourceTable": 1,
    "sourceRow": 4,
    "sourceOrder": 29,
    "title": "פיתגורס ודמיון בהקשר של חיי היומיום — -שגית רסולי",
    "canonicalUrl": "https://docs.google.com/document/d/19Jco4Ir2upDEMq26epX4jeBfPB32nBQUxNMDzdpFe3M",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "similar-triangles",
      "similarity-pythagoras"
    ]
  },
  {
    "sourceRecordId": "curriculum-41afdc2da59e",
    "resourceId": "src-curriculum-41afdc2da59e",
    "source": "curriculum-document",
    "sourceTable": 1,
    "sourceRow": 5,
    "sourceOrder": 30,
    "title": "חפיפת משולשים ודמיון-מרכז מורים",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3532-congruence-of-triangles-and-similarily-excellence-8thgrade",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "congruent-triangles",
      "similar-triangles",
      "similarity-pythagoras"
    ]
  },
  {
    "sourceRecordId": "curriculum-9fc3f4092d81",
    "resourceId": "src-curriculum-9fc3f4092d81",
    "source": "curriculum-document",
    "sourceTable": 1,
    "sourceRow": 6,
    "sourceOrder": 31,
    "title": "גיאומטריה חישובית דמיון- מרכז מורים",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3504-geometry",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "h",
      "t"
    ],
    "sourceTopicIds": [
      "similar-triangles",
      "percentages-word-problems",
      "similarity-pythagoras"
    ]
  },
  {
    "sourceRecordId": "curriculum-f3d7f73d5789",
    "resourceId": "src-curriculum-f3d7f73d5789",
    "source": "curriculum-document",
    "sourceTable": 1,
    "sourceRow": 7,
    "sourceOrder": 32,
    "title": "דמיון משולשים בשילוב פיתגורס — -שגית רסולי",
    "canonicalUrl": "https://docs.google.com/document/d/1Wo4c5Ap7PDJ_QY41i4XwHDuHyABo8Mltxru_sJeFYuM",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "h",
      "t"
    ],
    "sourceTopicIds": [
      "similar-triangles",
      "similarity-pythagoras"
    ]
  },
  {
    "sourceRecordId": "curriculum-dedbd97793c1",
    "resourceId": "src-curriculum-dedbd97793c1",
    "source": "curriculum-document",
    "sourceTable": 1,
    "sourceRow": 8,
    "sourceOrder": 33,
    "title": "סביב משולשים ומלבנים מרכז מורים ערבית — סביב",
    "canonicalUrl": "https://drive.google.com/file/d/108noHe2bTP1lb1wGIyYzEMqOJtut-W-Q",
    "outcome": "needs-review",
    "reason": "The source says only 'around triangles and rectangles' and 'teacher guide'; it does not support one exact topic placement.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": []
  },
  {
    "sourceRecordId": "curriculum-ef917264500e",
    "resourceId": "src-curriculum-ef917264500e",
    "source": "curriculum-document",
    "sourceTable": 1,
    "sourceRow": 8,
    "sourceOrder": 34,
    "title": "סביב משולשים ומלבנים מרכז מורים ערבית — ערבית",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/images/data2/8th_grade_complementary_/Arabic/integrative_triangles_Arabic.pdf",
    "outcome": "needs-review",
    "reason": "Arabic companion file for the same ambiguous integrative Grade 8 resource; do not invent a single topic.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": []
  },
  {
    "sourceRecordId": "curriculum-b58c2b6e9f58",
    "resourceId": "src-curriculum-b58c2b6e9f58",
    "source": "curriculum-document",
    "sourceTable": 1,
    "sourceRow": 9,
    "sourceOrder": 35,
    "title": "שאלות אינטגרטיביות פונקציה קווית, דמיון וחפיפת משולשים- מרכז מורים",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3503-integrative",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "h",
      "t"
    ],
    "sourceTopicIds": [
      "congruent-triangles",
      "similar-triangles",
      "linear-function",
      "similarity-pythagoras"
    ]
  },
  {
    "sourceRecordId": "curriculum-3380820b5724",
    "resourceId": "src-curriculum-3380820b5724",
    "source": "curriculum-document",
    "sourceTable": 1,
    "sourceRow": 10,
    "sourceOrder": 36,
    "title": "דלתון- יחידה שפותחה במסגרת מחקר במכללת אחווה",
    "canonicalUrl": "https://www.geogebra.org/m/mh97mcnc",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "kite"
    ]
  },
  {
    "sourceRecordId": "curriculum-e89100e098c9",
    "resourceId": "src-curriculum-e89100e098c9",
    "source": "curriculum-document",
    "sourceTable": 1,
    "sourceRow": 11,
    "sourceOrder": 37,
    "title": "שאלות בגיאומטריה מרובעים -כיתה ט' מצויינות מרכז מורים",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/index.php/458-9th-grade-activities/3529-quadrilaterals-9grade-excellence",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "areas-perimeters",
      "quadrilaterals",
      "geometry-theorems-proofs"
    ]
  },
  {
    "sourceRecordId": "curriculum-28af0eb34fa4",
    "resourceId": "src-curriculum-28af0eb34fa4",
    "source": "curriculum-document",
    "sourceTable": 2,
    "sourceRow": 1,
    "sourceOrder": 38,
    "title": "יעל מעצבת מסגרות-מרכז מורים ערבית — יעל",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3484-yael-designs-frames",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "z",
      "h"
    ],
    "sourceTopicIds": [
      "areas-perimeters",
      "algebraic-expressions-distributive"
    ]
  },
  {
    "sourceRecordId": "curriculum-d45210f8a97c",
    "resourceId": "src-curriculum-d45210f8a97c",
    "source": "curriculum-document",
    "sourceTable": 2,
    "sourceRow": 1,
    "sourceOrder": 39,
    "title": "יעל מעצבת מסגרות-מרכז מורים ערבית — ערבית",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/images/data2/arabic_2022/Yael_arabic.pdf",
    "outcome": "needs-review",
    "reason": "Do not merge automatically. The same PDF URL is attached to two unrelated titles/topics (Yael frames vs. walking activity), indicating a likely erroneous hyperlink in the source document.",
    "grades": [
      "z",
      "h"
    ],
    "sourceTopicIds": [
      "areas-perimeters",
      "algebraic-expressions-distributive"
    ]
  },
  {
    "sourceRecordId": "curriculum-ba33882d0751",
    "resourceId": "src-curriculum-ba33882d0751",
    "source": "curriculum-document",
    "sourceTable": 2,
    "sourceRow": 2,
    "sourceOrder": 40,
    "title": "שטחים והיקפים - שגית רסולי",
    "canonicalUrl": "https://docs.google.com/document/d/1fMGLyqjotD1MHFygNwHlp9CcrnrAdsOdZucAUiCiHzk",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "h",
      "t"
    ],
    "sourceTopicIds": [
      "areas-perimeters",
      "algebraic-expressions-distributive"
    ]
  },
  {
    "sourceRecordId": "curriculum-ad690fa39e57",
    "resourceId": "src-curriculum-ad690fa39e57",
    "source": "curriculum-document",
    "sourceTable": 2,
    "sourceRow": 3,
    "sourceOrder": 41,
    "title": "ביטויים אלגבריים היקפים בחצר- מרכז מורים ארצי",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3523-algebraic-patterns-7th-grade",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "areas-perimeters",
      "algebraic-expressions-distributive"
    ]
  },
  {
    "sourceRecordId": "curriculum-0c91d1dd9857",
    "resourceId": "src-curriculum-e137bb19fd28",
    "source": "curriculum-document",
    "sourceTable": 2,
    "sourceRow": 4,
    "sourceOrder": 42,
    "title": "על צעידה ופעילות גופנית מרכז מורים ערבית — על",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3486-jogging",
    "outcome": "merged-evidence",
    "reason": "Same activity and canonical URL as curriculum-e137bb19fd28; retained as a second evidence row.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "percentages-word-problems",
      "graph-reading-literacy"
    ]
  },
  {
    "sourceRecordId": "curriculum-b3340c60869d",
    "resourceId": "src-curriculum-b3340c60869d",
    "source": "curriculum-document",
    "sourceTable": 2,
    "sourceRow": 4,
    "sourceOrder": 43,
    "title": "על צעידה ופעילות גופנית מרכז מורים ערבית — ערבית",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/images/data2/arabic_2022/Yael_arabic.pdf",
    "outcome": "needs-review",
    "reason": "Do not merge automatically. The same PDF URL is attached to two unrelated titles/topics (Yael frames vs. walking activity), indicating a likely erroneous hyperlink in the source document.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "percentages-word-problems",
      "graph-reading-literacy"
    ]
  },
  {
    "sourceRecordId": "curriculum-9ac235d75c82",
    "resourceId": "src-curriculum-9ac235d75c82",
    "source": "curriculum-document",
    "sourceTable": 2,
    "sourceRow": 5,
    "sourceOrder": 44,
    "title": "אחוזים וסטטיסטיקה - אייל שלמה ושגית",
    "canonicalUrl": "https://docs.google.com/document/d/1u-VJ8nCocfmzpF3vYpImEcmrcAghHyqf5eN-4IWxrJs",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "z",
      "h",
      "t"
    ],
    "sourceTopicIds": [
      "percentages-word-problems",
      "statistics-graph-reading"
    ]
  },
  {
    "sourceRecordId": "curriculum-664df64180ed",
    "resourceId": "src-curriculum-664df64180ed",
    "source": "curriculum-document",
    "sourceTable": 2,
    "sourceRow": 6,
    "sourceOrder": 45,
    "title": "אוסף שאלות תנועה - \"נעים אחרת\"",
    "canonicalUrl": "https://docs.google.com/document/d/1F-xVahx8g_A088aCLmuuqBvG4IU6Le1iGmvdC9jvGzA",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "z",
      "h",
      "t"
    ],
    "sourceTopicIds": [
      "percentages-word-problems"
    ]
  },
  {
    "sourceRecordId": "curriculum-2f6066661864",
    "resourceId": "src-curriculum-2f6066661864",
    "source": "curriculum-document",
    "sourceTable": 2,
    "sourceRow": 7,
    "sourceOrder": 46,
    "title": "טיול בנהריה -מרכז מורים ארצי ערבית — טיול",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3483-trip-to-nahariyya",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "z",
      "h"
    ],
    "sourceTopicIds": [
      "statistics-graph-reading",
      "graph-reading-literacy"
    ]
  },
  {
    "sourceRecordId": "curriculum-566566b1dd8d",
    "resourceId": "src-curriculum-566566b1dd8d",
    "source": "curriculum-document",
    "sourceTable": 2,
    "sourceRow": 7,
    "sourceOrder": 47,
    "title": "טיול בנהריה -מרכז מורים ארצי ערבית — ערבית",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/images/data2/arabic_2022/trip_to_Nahariyah_arabic.pdf",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "z",
      "h"
    ],
    "sourceTopicIds": [
      "statistics-graph-reading",
      "graph-reading-literacy"
    ]
  },
  {
    "sourceRecordId": "curriculum-f2a9bd1f1dcd",
    "resourceId": "src-curriculum-f2a9bd1f1dcd",
    "source": "curriculum-document",
    "sourceTable": 2,
    "sourceRow": 8,
    "sourceOrder": 48,
    "title": "קריאת גרפים- מרכז מורים",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3564-reading-graphs",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "h",
      "t"
    ],
    "sourceTopicIds": [
      "statistics-graph-reading",
      "graph-reading-literacy"
    ]
  },
  {
    "sourceRecordId": "curriculum-e137bb19fd28",
    "resourceId": "src-curriculum-e137bb19fd28",
    "source": "curriculum-document",
    "sourceTable": 2,
    "sourceRow": 9,
    "sourceOrder": 49,
    "title": "על צעידה ופעילות גופנית מרכז מורים",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3486-jogging",
    "outcome": "included",
    "reason": "Same canonical URL and same Grade 8 activity as another source row.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "percentages-word-problems",
      "graph-reading-literacy"
    ]
  },
  {
    "sourceRecordId": "curriculum-a69849f5cece",
    "resourceId": "src-curriculum-a69849f5cece",
    "source": "curriculum-document",
    "sourceTable": 2,
    "sourceRow": 10,
    "sourceOrder": 50,
    "title": "אי שוויון במערכת צירים",
    "canonicalUrl": "https://docs.google.com/document/d/1rxCtQl49hEVgIV6-S3dYxgW7pMuBjDlk3Y9XLlZ0hVU",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "coordinate-system",
      "parallel-lines",
      "inequalities"
    ]
  },
  {
    "sourceRecordId": "curriculum-57ceeac1ffe1",
    "resourceId": "src-curriculum-57ceeac1ffe1",
    "source": "curriculum-document",
    "sourceTable": 3,
    "sourceRow": 1,
    "sourceOrder": 51,
    "title": "שאלות אוריינות - בערבית — שאלות",
    "canonicalUrl": "https://docs.google.com/document/d/1NZMcSUPxyR5E8PGKgTpklYKDMiY-RRSiSDZES2bqX7Y",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "quadratic-function",
      "graph-reading-literacy"
    ]
  },
  {
    "sourceRecordId": "curriculum-3c37ff462079",
    "resourceId": "src-curriculum-3c37ff462079",
    "source": "curriculum-document",
    "sourceTable": 3,
    "sourceRow": 1,
    "sourceOrder": 52,
    "title": "שאלות אוריינות - בערבית — בערבית",
    "canonicalUrl": "https://docs.google.com/document/d/1ieeBkPA8clvRnnUmt2r2CdEJr6d5oPFl5Xz-HEV-4Fg",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "quadratic-function",
      "graph-reading-literacy"
    ]
  },
  {
    "sourceRecordId": "curriculum-948028aeab70",
    "resourceId": "src-curriculum-948028aeab70",
    "source": "curriculum-document",
    "sourceTable": 3,
    "sourceRow": 2,
    "sourceOrder": 53,
    "title": "לטיול יצאנו - ערבית — לטיול",
    "canonicalUrl": "https://docs.google.com/document/d/1A_CZpF0td3iztbdhv1igv3AhAUuDmDnDUzdNoXWyFTM",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "quadratic-function",
      "graph-reading-literacy",
      "functions-preanalysis"
    ]
  },
  {
    "sourceRecordId": "curriculum-49cdd7293889",
    "resourceId": "src-curriculum-49cdd7293889",
    "source": "curriculum-document",
    "sourceTable": 3,
    "sourceRow": 2,
    "sourceOrder": 54,
    "title": "לטיול יצאנו - ערבית — ערבית",
    "canonicalUrl": "https://docs.google.com/document/d/1g-p0L_Gs5zLmhw5CzZusdNkQn-SyRM2A",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "quadratic-function",
      "graph-reading-literacy",
      "functions-preanalysis"
    ]
  },
  {
    "sourceRecordId": "curriculum-d7c7d623c835",
    "resourceId": "src-curriculum-d7c7d623c835",
    "source": "curriculum-document",
    "sourceTable": 3,
    "sourceRow": 3,
    "sourceOrder": 55,
    "title": "פעולות על פונקציה ריבועית- — שרית ביטון",
    "canonicalUrl": "https://docs.google.com/document/d/16VXwSEegU9nJxw2wPOgvHm5MKPQhFfXqur8JfRkavzk",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "quadratic-function"
    ]
  },
  {
    "sourceRecordId": "curriculum-7998ebc4f091",
    "resourceId": "src-curriculum-7998ebc4f091",
    "source": "curriculum-document",
    "sourceTable": 4,
    "sourceRow": 1,
    "sourceOrder": 56,
    "title": "זוויות בעין מתמטית-מרכז מורים ארצי",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3524-angles-from-a-mathematic-view-7th-grade",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "angles"
    ]
  },
  {
    "sourceRecordId": "curriculum-5fc92fca0b51",
    "resourceId": "src-curriculum-5fc92fca0b51",
    "source": "curriculum-document",
    "sourceTable": 4,
    "sourceRow": 2,
    "sourceOrder": 57,
    "title": "זוויות בעין מתמטית- מרכז מורים ארצי",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3525-angles-from-a-mathematic-view-8th-grade",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "angles"
    ]
  },
  {
    "sourceRecordId": "curriculum-c773865b385c",
    "resourceId": "src-curriculum-c773865b385c",
    "source": "curriculum-document",
    "sourceTable": 4,
    "sourceRow": 3,
    "sourceOrder": 58,
    "title": "שאלות קצרות פונקציות-דיה זגורי",
    "canonicalUrl": "https://docs.google.com/document/d/1Gm5BwHm6ka3sVzGCycSfyWoAUtmrw7j7mzGut-hVm-k",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "functions-preanalysis"
    ]
  },
  {
    "sourceRecordId": "curriculum-d72b06a2b074",
    "resourceId": "src-curriculum-d72b06a2b074",
    "source": "curriculum-document",
    "sourceTable": 4,
    "sourceRow": 4,
    "sourceOrder": 59,
    "title": "אוסף שאלות קצרות בנושא פונקציה ריבועית- מרכז מורים ארצי",
    "canonicalUrl": "https://newhighmath.haifa.ac.il/index.php/458-9th-grade-activities/3526-parabola-short-questions-9th-grade",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "quadratic-function",
      "functions-preanalysis"
    ]
  },
  {
    "sourceRecordId": "curriculum-b6608b4a72db",
    "resourceId": "src-curriculum-b6608b4a72db",
    "source": "curriculum-document",
    "sourceTable": 5,
    "sourceRow": 1,
    "sourceOrder": 60,
    "title": "תיקיית חומרים לכיתות ז-ט",
    "canonicalUrl": "https://drive.google.com/drive/folders/1CDvufsgap28Tg6A0-yz7a51IbhRHePqa",
    "outcome": "included",
    "reason": "Instructional source link with an explicit source row.",
    "grades": [
      "z",
      "h",
      "t"
    ],
    "sourceTopicIds": [
      "graph-reading-literacy"
    ]
  },
  {
    "sourceRecordId": "curriculum-b3c69260da62",
    "resourceId": "src-curriculum-b3c69260da62",
    "source": "curriculum-document",
    "sourceTable": 5,
    "sourceRow": 2,
    "sourceOrder": 61,
    "title": "אוסף שאלות מבחינות בגרות מותאמות לחט\"ב",
    "canonicalUrl": "https://docs.google.com/document/d/1crBTxtZp4SXD0b07QRc4Kl8PCI1dX-fqkRpaW4b_KFI",
    "outcome": "needs-review",
    "reason": "Adapted matriculation-question collection with no explicit grade label. Preserve it, but do not assign a grade or topic without evidence.",
    "grades": [],
    "sourceTopicIds": []
  },
  {
    "sourceRecordId": "curriculum-012bc422a750",
    "resourceId": "src-curriculum-012bc422a750",
    "source": "curriculum-document",
    "sourceTable": 5,
    "sourceRow": 3,
    "sourceOrder": 62,
    "title": "מקבצי שאלות",
    "canonicalUrl": "https://docs.google.com/presentation/d/1FqmJw3SPcAcw1LS5J7hv9D19VSg3AzQLOXunF-JUprw",
    "outcome": "included",
    "reason": "Semester-summary collection explicitly intended for Grades 7-9; collection placement is sufficient.",
    "grades": [
      "z",
      "h",
      "t"
    ],
    "sourceTopicIds": []
  },
  {
    "sourceRecordId": "curriculum-106460e3dbb7",
    "resourceId": "src-curriculum-106460e3dbb7",
    "source": "curriculum-document",
    "sourceTable": 5,
    "sourceRow": 4,
    "sourceOrder": 63,
    "title": "מקבצי שאלות",
    "canonicalUrl": "https://docs.google.com/presentation/d/1O0Um78b3fTuOAwBhyz2KrFQXaAMqVGuglJ6wvlwHZ28",
    "outcome": "included",
    "reason": "Year-summary collection explicitly intended for Grades 7-9; collection placement is sufficient.",
    "grades": [
      "z",
      "h",
      "t"
    ],
    "sourceTopicIds": []
  },
  {
    "sourceRecordId": "curriculum-6f44d59030f7",
    "resourceId": "src-curriculum-6f44d59030f7",
    "source": "curriculum-document",
    "sourceTable": 5,
    "sourceRow": 5,
    "sourceOrder": 64,
    "title": "עברית , ערבית — עברית",
    "canonicalUrl": "https://docs.google.com/document/d/1GZtHat8xbY0r2OR9XpHW5Y4AtbJIuv0NJSR2CD9gHNc",
    "outcome": "excluded-from-teaching-materials",
    "reason": "Hebrew four-unit upper-secondary preparation resource for Grade 9 graduates; preserve outside Grade 9 Teaching Materials.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": []
  },
  {
    "sourceRecordId": "curriculum-1e51225a3948",
    "resourceId": "src-curriculum-1e51225a3948",
    "source": "curriculum-document",
    "sourceTable": 5,
    "sourceRow": 5,
    "sourceOrder": 65,
    "title": "עברית , ערבית — ערבית",
    "canonicalUrl": "https://docs.google.com/document/d/1nrBT1UoqdqbzjkSAduCGZTt8Wd-sCEmeLZkp9w-4-ls",
    "outcome": "excluded-from-teaching-materials",
    "reason": "Arabic four-unit upper-secondary preparation resource for Grade 9 graduates; preserve outside Grade 9 Teaching Materials.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": []
  },
  {
    "sourceRecordId": "curriculum-e221681c4d5e",
    "resourceId": "src-curriculum-e221681c4d5e",
    "source": "curriculum-document",
    "sourceTable": 5,
    "sourceRow": 6,
    "sourceOrder": 66,
    "title": "מחצית א' מחצית ב' — מחצית",
    "canonicalUrl": "https://docs.google.com/presentation/d/1jYhdm7kN9m4LpvDaJ_SQ1iG557pe4WyCjB_xAKv8bew",
    "outcome": "included",
    "reason": "End-of-semester booklet collection for Grades 7-9; no single topic should be invented.",
    "grades": [
      "z",
      "h",
      "t"
    ],
    "sourceTopicIds": []
  },
  {
    "sourceRecordId": "curriculum-e93c575a0b04",
    "resourceId": "src-curriculum-e93c575a0b04",
    "source": "curriculum-document",
    "sourceTable": 5,
    "sourceRow": 6,
    "sourceOrder": 67,
    "title": "מחצית א' מחצית ב' — מחצית",
    "canonicalUrl": "https://docs.google.com/presentation/d/1yMOTmEavx3mgUDbeIzLT_mSpJmcpe6_8HmieZhLpSN4",
    "outcome": "included",
    "reason": "End-of-year booklet collection for Grades 7-9; no single topic should be invented.",
    "grades": [
      "z",
      "h",
      "t"
    ],
    "sourceTopicIds": []
  },
  {
    "sourceRecordId": "game-z-00576add9b0f",
    "resourceId": "src-game-z-00576add9b0f",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 1,
    "sourceOrder": 1,
    "title": "שרשרת הצבות (כולל מס' שלילי)",
    "canonicalUrl": "https://drive.google.com/file/d/0B58MLTJub4KJSXdDd3VuN1pRMjJlLXBXUFNUd1lybzkwVEx3",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ]
  },
  {
    "sourceRecordId": "game-z-c9ff7e0990e6",
    "resourceId": "src-game-z-c9ff7e0990e6",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 2,
    "sourceOrder": 2,
    "title": "מלחמה אלגברית - הצבות — קלפים מוגדלים למלחמה אלגברית - הצבות — מלחמה",
    "canonicalUrl": "https://drive.google.com/file/d/0B58MLTJub4KJVExfT2xHVzREVFBMcEk0elBoRE4yU212OFh3",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ]
  },
  {
    "sourceRecordId": "game-z-2240924d847e",
    "resourceId": "src-game-z-2240924d847e",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 2,
    "sourceOrder": 3,
    "title": "מלחמה אלגברית - הצבות — קלפים מוגדלים למלחמה אלגברית - הצבות — קלפים",
    "canonicalUrl": "https://docs.google.com/document/d/15hekTJiLyBAmYHlKR26LEcMClqqKmDPxxDh1HrJFECU",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ]
  },
  {
    "sourceRecordId": "game-z-9345687178d9",
    "resourceId": "src-game-z-9345687178d9",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 3,
    "sourceOrder": 4,
    "title": "הצבה בביטויים - שאלות במעגל",
    "canonicalUrl": "https://drive.google.com/file/d/18BVQuw1ZNOOb3RL-hpGQZ2cx4x5O92OE",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ]
  },
  {
    "sourceRecordId": "game-z-6d10346fe069",
    "resourceId": "src-game-z-6d10346fe069",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 4,
    "sourceOrder": 5,
    "title": "כספת הצבה רמה א — כספת הצבה רמה ב — כספת",
    "canonicalUrl": "https://drive.google.com/file/d/1ydD3fi6YseAUrA3pBadlEMaPt9aWlW87",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ]
  },
  {
    "sourceRecordId": "game-z-37b4e8418036",
    "resourceId": "src-game-z-37b4e8418036",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 4,
    "sourceOrder": 6,
    "title": "כספת הצבה רמה א — כספת הצבה רמה ב — כספת",
    "canonicalUrl": "https://drive.google.com/file/d/1G0mNshi_aYrHnQ3FXCKVuQehKwbcfpTa",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ]
  },
  {
    "sourceRecordId": "game-z-78f405097bb9",
    "resourceId": "src-game-z-78f405097bb9",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 5,
    "sourceOrder": 7,
    "title": "משחק הצבה והרכבת משפט",
    "canonicalUrl": "https://drive.google.com/file/d/1r0vpRrdT7ZzCe3wgpj7-8IghQAMaFw7X",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ]
  },
  {
    "sourceRecordId": "game-z-463d12bf9544",
    "resourceId": "src-game-z-463d12bf9544",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 6,
    "sourceOrder": 8,
    "title": "קוד הסתרים חנוכה",
    "canonicalUrl": "https://drive.google.com/file/d/1iDU_OuKWewHBwbBWKVB-TSvRPK4TBtXh",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ]
  },
  {
    "sourceRecordId": "game-z-9927455e10df",
    "resourceId": "src-game-z-9927455e10df",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 7,
    "sourceOrder": 9,
    "title": "משחק כיתתי מהסוג של ג'אפרדי",
    "canonicalUrl": "https://docs.google.com/presentation/d/16MWH-7zGTAEsRJpBMu-zY2soR4yy-ui0nNMIfDX_QTo",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ]
  },
  {
    "sourceRecordId": "game-z-65da3d977eff",
    "resourceId": "src-game-z-65da3d977eff",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 8,
    "sourceOrder": 10,
    "title": "חגי-תשרי-הצבה",
    "canonicalUrl": "https://drive.google.com/file/d/19VJ-k4oQwOU7PLDUb5qRZoBeDn8OLT9-",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ]
  },
  {
    "sourceRecordId": "game-z-c6276f21e166",
    "resourceId": "src-game-z-c6276f21e166",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 9,
    "sourceOrder": 11,
    "title": "תשחץ - כינוס איברים דומים וחוק הפילוג",
    "canonicalUrl": "https://drive.google.com/file/d/1wpkFTyypoltjoLLrHINgyRosjm3947ih",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ]
  },
  {
    "sourceRecordId": "game-z-5e82a6f250e8",
    "resourceId": "src-game-z-5e82a6f250e8",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 10,
    "sourceOrder": 12,
    "title": "כינוס איברים דומים",
    "canonicalUrl": "https://drive.google.com/file/d/1_yTHzVIzQrWlV_OHdG6jaE3OqCBFkF3p",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ]
  },
  {
    "sourceRecordId": "game-z-60363fb6650a",
    "resourceId": "src-game-z-60363fb6650a",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 11,
    "sourceOrder": 13,
    "title": "כינוס איברים דומים -דף פעילות",
    "canonicalUrl": "https://drive.google.com/file/d/15O2GP9z-CAOjlIN_LDzAyhDO7iTDUJU_",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive"
    ]
  },
  {
    "sourceRecordId": "game-z-a7ad3a34d489",
    "resourceId": "src-game-z-a7ad3a34d489",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 12,
    "sourceOrder": 14,
    "title": "שטיחון משוואות",
    "canonicalUrl": "https://drive.google.com/file/d/0B58MLTJub4KJQ3RBV1Y4Z0czUVBsa1JaTmhTQTVNSjJmaWVZ",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "equations"
    ]
  },
  {
    "sourceRecordId": "game-z-3ae158381dbe",
    "resourceId": "src-game-z-3ae158381dbe",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 13,
    "sourceOrder": 15,
    "title": "קלפי משוואות",
    "canonicalUrl": "https://docs.google.com/presentation/d/1OIi9h4XEfnQJqEhyuZVRNPA8fIF56KjCu_3SuwTIV2M",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "equations"
    ]
  },
  {
    "sourceRecordId": "game-z-bda6b0c4a124",
    "resourceId": "src-game-z-bda6b0c4a124",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 14,
    "sourceOrder": 16,
    "title": "משחק זכרון",
    "canonicalUrl": "https://drive.google.com/file/d/0B58MLTJub4KJLU90OEJybzRwZWoxSnVxTHZxZU1LZy1GajBZ",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "equations"
    ]
  },
  {
    "sourceRecordId": "game-z-1fb342ad0a97",
    "resourceId": "src-game-z-1fb342ad0a97",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 15,
    "sourceOrder": 17,
    "title": "הפוך בה",
    "canonicalUrl": "https://drive.google.com/file/d/0B58MLTJub4KJOTM0NjByVFc3TFlZNVZuSWRkYTVFNEpJUmpV",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "equations"
    ]
  },
  {
    "sourceRecordId": "game-z-101d82415598",
    "resourceId": "src-game-z-101d82415598",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 16,
    "sourceOrder": 18,
    "title": "משוואות- רצועות להמחשה",
    "canonicalUrl": "https://drive.google.com/file/d/1mfHCYjT2z37fBpnU2dy3KHW3A56LzGQ2",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "equations"
    ]
  },
  {
    "sourceRecordId": "game-z-9d2549a4296f",
    "resourceId": "src-game-z-9d2549a4296f",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 17,
    "sourceOrder": 19,
    "title": "משוואות - סודוקו שרשרת",
    "canonicalUrl": "https://drive.google.com/file/d/19nXDQgprWNuPZ22hcCVTILqnPMUDcAfq",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "equations"
    ]
  },
  {
    "sourceRecordId": "game-z-6821aaaaa55c",
    "resourceId": "src-game-z-6821aaaaa55c",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 18,
    "sourceOrder": 20,
    "title": "דפי צביעה משוואות",
    "canonicalUrl": "https://drive.google.com/file/d/1XfwN_dvLnNbdDX-qyVcRmdGF_knEeDfw",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "equations"
    ]
  },
  {
    "sourceRecordId": "game-z-f12830e08dc1",
    "resourceId": "src-game-z-f12830e08dc1",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 19,
    "sourceOrder": 21,
    "title": "פאזל משוואות",
    "canonicalUrl": "https://drive.google.com/file/d/19Yf_rfxwqMlmtS0UTuQuc7RkRVrGhFQD",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "equations"
    ]
  },
  {
    "sourceRecordId": "game-z-f01af038baa3",
    "resourceId": "src-game-z-f01af038baa3",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 20,
    "sourceOrder": 22,
    "title": "משוואות דרך ציורים",
    "canonicalUrl": "https://drive.google.com/file/d/0B58MLTJub4KJRV93a3B0cVZrOGNxT1FrRlV0M0FIVXc3Z0tv",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "equations"
    ]
  },
  {
    "sourceRecordId": "game-z-b63873233827",
    "resourceId": "src-game-z-b63873233827",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 21,
    "sourceOrder": 23,
    "title": "משחק המשוואות",
    "canonicalUrl": "https://drive.google.com/file/d/1jwTFLneQhpWDqRLa-dfvrsGJ2X594XsB",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "equations"
    ]
  },
  {
    "sourceRecordId": "game-z-ceb0b551eb94",
    "resourceId": "src-game-z-ceb0b551eb94",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 22,
    "sourceOrder": 24,
    "title": "בינגו משוואות",
    "canonicalUrl": "https://drive.google.com/file/d/1EWBJkIuvhMB5cPXQ-YT2L2QQVOoVcric",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "equations"
    ]
  },
  {
    "sourceRecordId": "game-z-02b2223a8bfd",
    "resourceId": "src-game-z-02b2223a8bfd",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 23,
    "sourceOrder": 25,
    "title": "מצאו את השאלה - תיבה וקוביה",
    "canonicalUrl": "https://drive.google.com/file/d/1e45R7ZhhpK9JA-NM_1AEiIjV_rQwOjvp",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "box-cube"
    ]
  },
  {
    "sourceRecordId": "game-z-012df6acfa6c",
    "resourceId": "src-game-z-012df6acfa6c",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 24,
    "sourceOrder": 26,
    "title": "צוללות",
    "canonicalUrl": "https://drive.google.com/file/d/1RWlg7OnV8PYz8mkrCgHbe4If_YyL701y",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "coordinate-system"
    ]
  },
  {
    "sourceRecordId": "game-z-31c69d9825d3",
    "resourceId": "src-game-z-31c69d9825d3",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 25,
    "sourceOrder": 27,
    "title": "בינגו סימון נקודות",
    "canonicalUrl": "https://drive.google.com/file/d/16ZxvyGr9GzyP_uSRlO2MkskmespGasDL",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "coordinate-system"
    ]
  },
  {
    "sourceRecordId": "game-z-19d5dcec2194",
    "resourceId": "src-game-z-19d5dcec2194",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 26,
    "sourceOrder": 28,
    "title": "ארבע בשורה, לוח הגרלה — ארבע",
    "canonicalUrl": "https://drive.google.com/file/d/1aDsLy2UIdTq8ndaGkmqAo06mY1xSNZwe",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "coordinate-system"
    ]
  },
  {
    "sourceRecordId": "game-z-62287bbdf55d",
    "resourceId": "src-game-z-62287bbdf55d",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 26,
    "sourceOrder": 29,
    "title": "ארבע בשורה, לוח הגרלה — לוח",
    "canonicalUrl": "https://drive.google.com/file/d/1aj1VLQAJyzw34KC7igXy3MOhfiWKmIJq",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "coordinate-system"
    ]
  },
  {
    "sourceRecordId": "game-z-f7c4b5d53e29",
    "resourceId": "src-game-z-f7c4b5d53e29",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 27,
    "sourceOrder": 30,
    "title": "פעילות לפתיחת שנה",
    "canonicalUrl": "https://drive.google.com/file/d/1IXG7D8goYt1ZY6UKwCetZXywxQR5sXqv",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "equations",
      "order-of-operations"
    ]
  },
  {
    "sourceRecordId": "game-z-f42791d62bf0",
    "resourceId": "src-game-z-f42791d62bf0",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 28,
    "sourceOrder": 31,
    "title": "סדר פעולות חשבון - צביעת פרפר",
    "canonicalUrl": "https://drive.google.com/file/d/1_V-1kKUxPiJHrPwJCZ5tLGJLSXh1ku8J",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "order-of-operations"
    ]
  },
  {
    "sourceRecordId": "game-z-ba0b5e482c5f",
    "resourceId": "src-game-z-ba0b5e482c5f",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 29,
    "sourceOrder": 32,
    "title": "לוחות בינגו",
    "canonicalUrl": "https://drive.google.com/file/d/1eKFKpJJnQ_CQDKGQ3oTG5Pv3D4pyj4b2",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "order-of-operations"
    ]
  },
  {
    "sourceRecordId": "game-z-4f0b4eca7eb2",
    "resourceId": "src-game-z-4f0b4eca7eb2",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 30,
    "sourceOrder": 33,
    "title": "חוק הפילוג-מבוך",
    "canonicalUrl": "https://drive.google.com/file/d/1zCJWaWVZtj97Gtl47HZ6MrA7p7pz2zOC",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "algebraic-expressions-distributive",
      "order-of-operations"
    ]
  },
  {
    "sourceRecordId": "game-z-3e926d886ff2",
    "resourceId": "src-game-z-3e926d886ff2",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 31,
    "sourceOrder": 34,
    "title": "הזמר במסיכה - סדר פעולות חשבון",
    "canonicalUrl": "https://drive.google.com/file/d/1nKKpt8Jr3i5D2l-2BkZ7aXMXuT8ZKARz",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "order-of-operations"
    ]
  },
  {
    "sourceRecordId": "game-z-602b96061488",
    "resourceId": "src-game-z-602b96061488",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 32,
    "sourceOrder": 35,
    "title": "סביבון המספרים המכוונים",
    "canonicalUrl": "https://drive.google.com/file/d/13Tv8DffOYQnBbdgenFXyXHO_5ZpqTege",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "directed-numbers"
    ]
  },
  {
    "sourceRecordId": "game-z-21f195d851f1",
    "resourceId": "src-game-z-21f195d851f1",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 33,
    "sourceOrder": 36,
    "title": "כפל וחילוק מספרים מכוונים",
    "canonicalUrl": "https://drive.google.com/file/d/1KET_BpSUBP6zJePpJ6JA0F7khb5ge_if",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "directed-numbers"
    ]
  },
  {
    "sourceRecordId": "game-z-e31795fef3c2",
    "resourceId": "src-game-z-e31795fef3c2",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 34,
    "sourceOrder": 37,
    "title": "דף 1, דף 2 — דף",
    "canonicalUrl": "https://drive.google.com/file/d/1vqr4hNJWg9ilvZdXOGDiwaa_Dg6tkptw",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "directed-numbers"
    ]
  },
  {
    "sourceRecordId": "game-z-fbae9c9dcc77",
    "resourceId": "src-game-z-fbae9c9dcc77",
    "source": "games-document",
    "sourceTable": 0,
    "sourceRow": 34,
    "sourceOrder": 38,
    "title": "דף 1, דף 2 — דף",
    "canonicalUrl": "https://drive.google.com/file/d/1r0JmqGJ_KJ6QvrudlowfJg0ENQgszBvX",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "z"
    ],
    "sourceTopicIds": [
      "directed-numbers"
    ]
  },
  {
    "sourceRecordId": "game-h-6cbeef0c951a",
    "resourceId": "src-game-h-6cbeef0c951a",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 1,
    "sourceOrder": 39,
    "title": "נקודות חיתוך עם ציר ה X",
    "canonicalUrl": "https://drive.google.com/file/d/12ZkzbGVvyKFQ94r2V5iFDfE3FEG_A4b9",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "linear-function"
    ]
  },
  {
    "sourceRecordId": "game-h-67ac155f019d",
    "resourceId": "src-game-h-67ac155f019d",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 2,
    "sourceOrder": 40,
    "title": "פאזל פונקציה קווית",
    "canonicalUrl": "https://drive.google.com/file/d/0B58MLTJub4KJR2JvZTJEa2tobEI1ZE43UWlxYU9PNktQUEM4",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "linear-function"
    ]
  },
  {
    "sourceRecordId": "game-h-496135f41e40",
    "resourceId": "src-game-h-496135f41e40",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 3,
    "sourceOrder": 41,
    "title": "הנחיות למשחק התאמות- פונקציה קווית — קלפים למשחק התאמות- פונקציה קווית — הנחיות",
    "canonicalUrl": "https://drive.google.com/file/d/1cO0bTl1tmRvpwfB_4nzYvBzNbDNvWmt6",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "linear-function"
    ]
  },
  {
    "sourceRecordId": "game-h-807bccfd80e5",
    "resourceId": "src-game-h-807bccfd80e5",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 3,
    "sourceOrder": 42,
    "title": "הנחיות למשחק התאמות- פונקציה קווית — קלפים למשחק התאמות- פונקציה קווית — קלפים",
    "canonicalUrl": "https://drive.google.com/file/d/1PS4unIXpY82K8YCx_D3BnmRizIhShe6R",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "linear-function"
    ]
  },
  {
    "sourceRecordId": "game-h-5f1c6a2e5e03",
    "resourceId": "src-game-h-5f1c6a2e5e03",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 4,
    "sourceOrder": 43,
    "title": "לוטו פונקציה קווית",
    "canonicalUrl": "https://drive.google.com/file/d/0B58MLTJub4KJYnQtOHhfTlpyc3doOGNneU9kcmNyLU9pMUZj",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "linear-function",
      "equations"
    ]
  },
  {
    "sourceRecordId": "game-h-a050967f185b",
    "resourceId": "src-game-h-a050967f185b",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 5,
    "sourceOrder": 44,
    "title": "פונקציה קווית , דף הסבר — פונקציה",
    "canonicalUrl": "https://drive.google.com/file/d/1mYBk-eykdXp5FY309UjAUReV7xzAemlE",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "linear-function"
    ]
  },
  {
    "sourceRecordId": "game-h-a4bd43f4ebf3",
    "resourceId": "src-game-h-a4bd43f4ebf3",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 5,
    "sourceOrder": 45,
    "title": "פונקציה קווית , דף הסבר — דף",
    "canonicalUrl": "https://drive.google.com/file/d/1lwRO_nEtHkK_ao-ovM5rrfcvW6qp-fuA",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "linear-function"
    ]
  },
  {
    "sourceRecordId": "game-h-f3a21b552630",
    "resourceId": "src-game-h-f3a21b552630",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 6,
    "sourceOrder": 46,
    "title": "חי צומח דומם פונקציה קווית — טופס הגרלת הפונקציות — חי",
    "canonicalUrl": "https://drive.google.com/file/d/17vrIe9gllzNmBMFLWWY6CkyGA6EgaVGM",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "linear-function"
    ]
  },
  {
    "sourceRecordId": "game-h-58cc4f488e83",
    "resourceId": "src-game-h-58cc4f488e83",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 6,
    "sourceOrder": 47,
    "title": "חי צומח דומם פונקציה קווית — טופס הגרלת הפונקציות — טופס",
    "canonicalUrl": "https://drive.google.com/file/d/1tyaMalmiUJqUuD_yg3m-GgGqy3Tthgkz",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "linear-function"
    ]
  },
  {
    "sourceRecordId": "game-h-fe374680a0bb",
    "resourceId": "src-game-h-fe374680a0bb",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 7,
    "sourceOrder": 48,
    "title": "דומינו מעבר בין ייצוגים",
    "canonicalUrl": "https://drive.google.com/file/d/1aABS-7aIxHHGOZu7smLqMEWau6cAG2My",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "linear-function"
    ]
  },
  {
    "sourceRecordId": "game-h-266e772cc1d9",
    "resourceId": "src-game-h-266e772cc1d9",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 8,
    "sourceOrder": 49,
    "title": "מאפייני הפונקציה הקווית-דומינו",
    "canonicalUrl": "https://drive.google.com/file/d/1ONlDY-y0Hi9QIiuFScsjw6duZuww-Mnp",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "linear-function"
    ]
  },
  {
    "sourceRecordId": "game-h-3d3adea92f4d",
    "resourceId": "src-game-h-3d3adea92f4d",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 9,
    "sourceOrder": 50,
    "title": "כרטיסיות להגרלה, לוחות בינגו — כרטיסיות",
    "canonicalUrl": "https://drive.google.com/file/d/1CvFY7Hmn7TnB5znR-No0xCFi2Rkpj2fw",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "linear-function",
      "equations"
    ]
  },
  {
    "sourceRecordId": "game-h-7c9e1de73af8",
    "resourceId": "src-game-h-7c9e1de73af8",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 9,
    "sourceOrder": 51,
    "title": "כרטיסיות להגרלה, לוחות בינגו — לוחות",
    "canonicalUrl": "https://drive.google.com/file/d/14hZs2m5xp0L3oW9kohOcrvFe4tlHtJfG",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "linear-function",
      "equations"
    ]
  },
  {
    "sourceRecordId": "game-h-b928fe90f53f",
    "resourceId": "src-game-h-b928fe90f53f",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 10,
    "sourceOrder": 52,
    "title": "המירוץ לפונקצייה קווית , הוראות משחק — המירוץ",
    "canonicalUrl": "https://drive.google.com/file/d/1ZZ0ImWSvVnrRza06t-K5PLDWgreua2Uq",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "linear-function"
    ]
  },
  {
    "sourceRecordId": "game-h-a6b435cade25",
    "resourceId": "src-game-h-a6b435cade25",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 10,
    "sourceOrder": 53,
    "title": "המירוץ לפונקצייה קווית , הוראות משחק — הוראות",
    "canonicalUrl": "https://drive.google.com/file/d/1Ti5qKp2cJ9G_t9bZbwh37xUQFVx9wvcK",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "linear-function"
    ]
  },
  {
    "sourceRecordId": "game-h-79f1eccd96f9",
    "resourceId": "src-game-h-79f1eccd96f9",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 11,
    "sourceOrder": 54,
    "title": "פונקציה קווית בחנוכה",
    "canonicalUrl": "https://drive.google.com/drive/folders/1Sv2iLXVFe_QYhe_3hEIAqCuN_YrlLM7A",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "linear-function",
      "equations"
    ]
  },
  {
    "sourceRecordId": "game-h-9f82314057a2",
    "resourceId": "src-game-h-9f82314057a2",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 12,
    "sourceOrder": 55,
    "title": "סודוקו שיפוע של ישר",
    "canonicalUrl": "https://drive.google.com/file/d/1fS_mN2dliEm7Cn68oj_5QfYqWdKz4Zor",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "linear-function"
    ]
  },
  {
    "sourceRecordId": "game-h-e9d5af06be0e",
    "resourceId": "src-game-h-e9d5af06be0e",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 13,
    "sourceOrder": 56,
    "title": "התאמה בין גרף לביטוי אלגברי של פונק קווית",
    "canonicalUrl": "https://drive.google.com/file/d/1MFXIXNuttHszM09u3hw1N0jBOBsSSg8a",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "linear-function"
    ]
  },
  {
    "sourceRecordId": "game-h-5c715a3e0e8d",
    "resourceId": "src-game-h-5c715a3e0e8d",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 14,
    "sourceOrder": 57,
    "title": "משוואות עם מכנים",
    "canonicalUrl": "https://drive.google.com/file/d/1pJQ9iYD8vafi8fdFxhSc6iWl1Y6Ogd8Q",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "equations"
    ]
  },
  {
    "sourceRecordId": "game-h-7a1e51bbee6f",
    "resourceId": "src-game-h-7a1e51bbee6f",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 15,
    "sourceOrder": 58,
    "title": "משחק התאמות",
    "canonicalUrl": "https://docs.google.com/presentation/d/1wV1Wo6zCWIbw84-jyszG5iMW26eu5uszEtNDOaN1fZg",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "systems-of-equations"
    ]
  },
  {
    "sourceRecordId": "game-h-3daa1d1692a2",
    "resourceId": "src-game-h-3daa1d1692a2",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 16,
    "sourceOrder": 59,
    "title": "קופסת בריחה",
    "canonicalUrl": "https://drive.google.com/file/d/1JJoPuFFjX_vutc_KIFb6f8xaKAMqRDfW",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "statistics-graph-reading"
    ]
  },
  {
    "sourceRecordId": "game-h-f2730e69ef22",
    "resourceId": "src-game-h-f2730e69ef22",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 17,
    "sourceOrder": 60,
    "title": "דגלים - חישוב שטחים והיקפים + פיתגורס",
    "canonicalUrl": "https://drive.google.com/file/d/1vAPRdD_9iEpv5zYFbVC0wPmVRWblckgv",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "areas-perimeters-pythagoras"
    ]
  },
  {
    "sourceRecordId": "game-h-6b5c3f25c553",
    "resourceId": "src-game-h-6b5c3f25c553",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 18,
    "sourceOrder": 61,
    "title": "תרגול זוויות ומשוואות",
    "canonicalUrl": "https://drive.google.com/file/d/1h7f8xrivFTRtLCg9qEj1Zt7FX2g0X2bz",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": [
      "equations",
      "angles"
    ]
  },
  {
    "sourceRecordId": "game-h-15fa15fef39c",
    "resourceId": "src-game-h-15fa15fef39c",
    "source": "games-document",
    "sourceTable": 1,
    "sourceRow": 19,
    "sourceOrder": 62,
    "title": "בינגו",
    "canonicalUrl": "https://drive.google.com/file/d/1Hygy1Ar3pH9OBUrMLmvaaIZJibSkM1Gp",
    "outcome": "included",
    "reason": "Whole-grade Grade 8 summary bingo; no single mathematical topic should be invented.",
    "grades": [
      "h"
    ],
    "sourceTopicIds": []
  },
  {
    "sourceRecordId": "game-t-f96bc54899bb",
    "resourceId": "src-game-t-f96bc54899bb",
    "source": "games-document",
    "sourceTable": 2,
    "sourceRow": 1,
    "sourceOrder": 63,
    "title": "מחפשים את הדלתון ערכת משחק — ערכת פתרונות — מחפשים",
    "canonicalUrl": "https://drive.google.com/file/d/1e6zEavypSn7CqTSWpbydQKYnKKKnSYOk",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "quadrilaterals",
      "kite",
      "similarity-pythagoras"
    ]
  },
  {
    "sourceRecordId": "game-t-ee9cbe3251c4",
    "resourceId": "src-game-t-ee9cbe3251c4",
    "source": "games-document",
    "sourceTable": 2,
    "sourceRow": 1,
    "sourceOrder": 64,
    "title": "מחפשים את הדלתון ערכת משחק — ערכת פתרונות — ערכת",
    "canonicalUrl": "https://drive.google.com/file/d/19WKZCSEjsJHSmZReyDGysUMYB8SRXtbV",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "quadrilaterals",
      "kite",
      "similarity-pythagoras"
    ]
  },
  {
    "sourceRecordId": "game-t-b2c647299984",
    "resourceId": "src-game-t-b2c647299984",
    "source": "games-document",
    "sourceTable": 2,
    "sourceRow": 2,
    "sourceOrder": 65,
    "title": "התאמת משפטים בגיאומטריה",
    "canonicalUrl": "https://drive.google.com/file/d/0B58MLTJub4KJN0pGTnZvZzdQX2syWk8tem80bDdtWUF5SDRz",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "geometry-theorems-proofs"
    ]
  },
  {
    "sourceRecordId": "game-t-d0d5af728b47",
    "resourceId": "src-game-t-d0d5af728b47",
    "source": "games-document",
    "sourceTable": 2,
    "sourceRow": 3,
    "sourceOrder": 66,
    "title": "בינגו גיאומטריה",
    "canonicalUrl": "https://drive.google.com/file/d/1M1QiMJJbIoJ8QeAwq6TTMiNXwoS9TpM0",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "geometry-theorems-proofs"
    ]
  },
  {
    "sourceRecordId": "game-t-4511fce03b20",
    "resourceId": "src-game-t-4511fce03b20",
    "source": "games-document",
    "sourceTable": 2,
    "sourceRow": 4,
    "sourceOrder": 67,
    "title": "דומינו חוק הפילוג המורחב. — דף פעילות — דומינו",
    "canonicalUrl": "https://drive.google.com/file/d/1G41LJTpqJW9LJl1AgNOGROaag9VQOQps",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "algebraic-technique"
    ]
  },
  {
    "sourceRecordId": "game-t-13edad04d513",
    "resourceId": "src-game-t-13edad04d513",
    "source": "games-document",
    "sourceTable": 2,
    "sourceRow": 4,
    "sourceOrder": 68,
    "title": "דומינו חוק הפילוג המורחב. — דף פעילות — דף",
    "canonicalUrl": "https://drive.google.com/file/d/1-2THi57lkjXNZIoLyFVevLiFdLNSaKn0",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "algebraic-technique"
    ]
  },
  {
    "sourceRecordId": "game-t-9fbb30cdc0e3",
    "resourceId": "src-game-t-9fbb30cdc0e3",
    "source": "games-document",
    "sourceTable": 2,
    "sourceRow": 5,
    "sourceOrder": 69,
    "title": "שטיחון פירוק לגורמים",
    "canonicalUrl": "https://drive.google.com/file/d/0B58MLTJub4KJLXMyRU5kYTFqbDF2QnAxU2tmTkFiaFdrN2gw",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "algebraic-technique"
    ]
  },
  {
    "sourceRecordId": "game-t-ea21f3af58b3",
    "resourceId": "src-game-t-ea21f3af58b3",
    "source": "games-document",
    "sourceTable": 2,
    "sourceRow": 6,
    "sourceOrder": 70,
    "title": "פאזל פירוק לגורמים",
    "canonicalUrl": "https://drive.google.com/file/d/0B58MLTJub4KJZXdqVzhkMFMzQ2I0OEh5Z2xWNWtzc3dCM1BB",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "algebraic-technique"
    ]
  },
  {
    "sourceRecordId": "game-t-76669b599f22",
    "resourceId": "src-game-t-76669b599f22",
    "source": "games-document",
    "sourceTable": 2,
    "sourceRow": 7,
    "sourceOrder": 71,
    "title": "נוסחאות כפל מקוצר",
    "canonicalUrl": "https://docs.google.com/presentation/d/1AMdQlzavKloRRTm8_KqgY1uqBgRFwX4nDOMGgpp-Cyg",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "algebraic-technique"
    ]
  },
  {
    "sourceRecordId": "game-t-168e283baaa2",
    "resourceId": "src-game-t-168e283baaa2",
    "source": "games-document",
    "sourceTable": 2,
    "sourceRow": 8,
    "sourceOrder": 72,
    "title": "דומינו- התאמה בין פונקציה לגרף",
    "canonicalUrl": "https://drive.google.com/file/d/0B58MLTJub4KJSE1PRkh2YzZCRWs0SFhUM2ZkTFh1SDFLX2JN",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "functions-preanalysis"
    ]
  },
  {
    "sourceRecordId": "game-t-c006d81e537d",
    "resourceId": "src-game-t-c006d81e537d",
    "source": "games-document",
    "sourceTable": 2,
    "sourceRow": 9,
    "sourceOrder": 73,
    "title": "פאזל הצבות",
    "canonicalUrl": "https://drive.google.com/file/d/1iDh-9zXCWsmOShH2i4QK_Tul2xmGTdLI",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "functions-preanalysis"
    ]
  },
  {
    "sourceRecordId": "game-t-05373c5c4a26",
    "resourceId": "src-game-t-05373c5c4a26",
    "source": "games-document",
    "sourceTable": 2,
    "sourceRow": 10,
    "sourceOrder": 74,
    "title": "פאזל פרבולות.",
    "canonicalUrl": "https://drive.google.com/file/d/1XwAwycAIiTKZLO9pYmqUEmHpQiJwXQ6Z",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "quadratic-function"
    ]
  },
  {
    "sourceRecordId": "game-t-38f83b261a02",
    "resourceId": "src-game-t-38f83b261a02",
    "source": "games-document",
    "sourceTable": 2,
    "sourceRow": 11,
    "sourceOrder": 75,
    "title": "בינגו זיהוי מקדמים של פונקציה ריבועית — כרטיסיות הגרלה — בינגו",
    "canonicalUrl": "https://drive.google.com/file/d/1FlY_Nia16uiHuHZ4YcVsc0NFdYD24cy0",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "quadratic-function"
    ]
  },
  {
    "sourceRecordId": "game-t-8253c1eb9506",
    "resourceId": "src-game-t-8253c1eb9506",
    "source": "games-document",
    "sourceTable": 2,
    "sourceRow": 11,
    "sourceOrder": 76,
    "title": "בינגו זיהוי מקדמים של פונקציה ריבועית — כרטיסיות הגרלה — כרטיסיות",
    "canonicalUrl": "https://drive.google.com/file/d/1cRl5CoSX8V3LJRJC4a5SWDZN5TTIoRxQ",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "quadratic-function"
    ]
  },
  {
    "sourceRecordId": "game-t-84a73f3b5de9",
    "resourceId": "src-game-t-84a73f3b5de9",
    "source": "games-document",
    "sourceTable": 2,
    "sourceRow": 12,
    "sourceOrder": 77,
    "title": "מאפייני הפונקציה הריבועית-דומינו",
    "canonicalUrl": "https://drive.google.com/file/d/1My2W7rFT_6GEyIfvLc1szpuRcv6Riw37",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "quadratic-function"
    ]
  },
  {
    "sourceRecordId": "game-t-6a25b23e0c4e",
    "resourceId": "src-game-t-6a25b23e0c4e",
    "source": "games-document",
    "sourceTable": 2,
    "sourceRow": 13,
    "sourceOrder": 78,
    "title": "בינגו קודקוד הפרבולה לוחות, גלגל הגרלה — לוחות",
    "canonicalUrl": "https://drive.google.com/file/d/1pyIYapxU3X-lGUZQp8Cn1KtiwlYBBoGq",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "quadratic-function"
    ]
  },
  {
    "sourceRecordId": "game-t-3b8a123059d1",
    "resourceId": "src-game-t-3b8a123059d1",
    "source": "games-document",
    "sourceTable": 2,
    "sourceRow": 13,
    "sourceOrder": 79,
    "title": "בינגו קודקוד הפרבולה לוחות, גלגל הגרלה — גלגל",
    "canonicalUrl": "https://wheelofnames.com/he/2gb-ted?fbclid=IwAR2LScs14mOs6zN2faQNgzE0EUjGcgAZf5civJn8gEFh8uHhZWzSdceZN9U",
    "outcome": "included",
    "reason": "Instructional game link in an explicit Grade 7-9 source section.",
    "grades": [
      "t"
    ],
    "sourceTopicIds": [
      "quadratic-function"
    ]
  }
] as const;

export const sourceNoLinkRows = [
  {
    "source": "games-document",
    "sourceDocumentId": "1AQNue5voom-CuO3opIJMjQoIzy5Ryl1dXPLd-c8IW-M",
    "sourceTable": 1,
    "sourceRow": 20,
    "grade": "h",
    "domainRaw": "גאומטרי",
    "domainHint": "geometry",
    "topicRaw": "כל הנושאים כיתה ח' סיכום",
    "subtopic": "",
    "resourceCell": "",
    "credit": "",
    "notes": "",
    "linkCount": 0,
    "outcome": "no-link-detected",
    "reason": "The DOCX row contains no hyperlink relationship. Do not invent a URL."
  },
  {
    "source": "games-document",
    "sourceDocumentId": "1AQNue5voom-CuO3opIJMjQoIzy5Ryl1dXPLd-c8IW-M",
    "sourceTable": 1,
    "sourceRow": 21,
    "grade": "h",
    "domainRaw": "גאומטרי",
    "domainHint": "geometry",
    "topicRaw": "כל הנושאים כיתה ח' סיכום",
    "subtopic": "",
    "resourceCell": "",
    "credit": "",
    "notes": "",
    "linkCount": 0,
    "outcome": "no-link-detected",
    "reason": "The DOCX row contains no hyperlink relationship. Do not invent a URL."
  },
  {
    "source": "games-document",
    "sourceDocumentId": "1AQNue5voom-CuO3opIJMjQoIzy5Ryl1dXPLd-c8IW-M",
    "sourceTable": 1,
    "sourceRow": 22,
    "grade": "h",
    "domainRaw": "גאומטרי",
    "domainHint": "geometry",
    "topicRaw": "כל הנושאים כיתה ח' סיכום",
    "subtopic": "",
    "resourceCell": "",
    "credit": "",
    "notes": "",
    "linkCount": 0,
    "outcome": "no-link-detected",
    "reason": "The DOCX row contains no hyperlink relationship. Do not invent a URL."
  },
  {
    "source": "games-document",
    "sourceDocumentId": "1AQNue5voom-CuO3opIJMjQoIzy5Ryl1dXPLd-c8IW-M",
    "sourceTable": 2,
    "sourceRow": 14,
    "grade": "t",
    "domainRaw": "אלגברי",
    "domainHint": "algebra",
    "topicRaw": "פונקציה ריבועית",
    "subtopic": "",
    "resourceCell": "",
    "credit": "",
    "notes": "",
    "linkCount": 0,
    "outcome": "no-link-detected",
    "reason": "The DOCX row contains no hyperlink relationship. Do not invent a URL."
  },
  {
    "source": "games-document",
    "sourceDocumentId": "1AQNue5voom-CuO3opIJMjQoIzy5Ryl1dXPLd-c8IW-M",
    "sourceTable": 2,
    "sourceRow": 15,
    "grade": "t",
    "domainRaw": "אלגברי",
    "domainHint": "algebra",
    "topicRaw": "פונקציה ריבועית",
    "subtopic": "",
    "resourceCell": "",
    "credit": "",
    "notes": "",
    "linkCount": 0,
    "outcome": "no-link-detected",
    "reason": "The DOCX row contains no hyperlink relationship. Do not invent a URL."
  },
  {
    "source": "games-document",
    "sourceDocumentId": "1AQNue5voom-CuO3opIJMjQoIzy5Ryl1dXPLd-c8IW-M",
    "sourceTable": 2,
    "sourceRow": 16,
    "grade": "t",
    "domainRaw": "אלגברי",
    "domainHint": "algebra",
    "topicRaw": "פונקציה ריבועית",
    "subtopic": "",
    "resourceCell": "",
    "credit": "",
    "notes": "",
    "linkCount": 0,
    "outcome": "no-link-detected",
    "reason": "The DOCX row contains no hyperlink relationship. Do not invent a URL."
  },
  {
    "source": "games-document",
    "sourceDocumentId": "1AQNue5voom-CuO3opIJMjQoIzy5Ryl1dXPLd-c8IW-M",
    "sourceTable": 2,
    "sourceRow": 17,
    "grade": "t",
    "domainRaw": "אלגברי",
    "domainHint": "algebra",
    "topicRaw": "פונקציה ריבועית",
    "subtopic": "",
    "resourceCell": "",
    "credit": "",
    "notes": "",
    "linkCount": 0,
    "outcome": "no-link-detected",
    "reason": "The DOCX row contains no hyperlink relationship. Do not invent a URL."
  },
  {
    "source": "curriculum-document",
    "sourceDocumentId": "1RYQQdKawSDPYYCDlUrm2MzcrNskv1SZQKHTNf8JJPuo",
    "sourceTable": 3,
    "sourceRow": 4,
    "topicRaw": "פונקציה ריבועית",
    "resourceCell": "",
    "gradeLabel": "",
    "grades": [],
    "audienceHints": [],
    "notes": "",
    "linkCount": 0,
    "outcome": "no-link-detected",
    "reason": "The DOCX row contains no hyperlink relationship. Do not invent a URL."
  }
] as const;

const sourceById = new Map(sourceMaterialResources.map((resource) => [resource.id, resource]));

const resourcesForIds = (ids: string[]) =>
  ids.map((id) => sourceById.get(id)).filter((resource): resource is SourceMaterialResource => Boolean(resource));

export const sourceMaterialsForTopic = (grade: SourceGrade, chapterId: string) =>
  resourcesForIds(
    sourceMaterialPlacements
      .filter((placement) => placement.grade === grade && placement.topicChapterIds.includes(chapterId))
      .map((placement) => placement.resourceId)
  );

export const sourceMaterialsForCollection = (grade: SourceGrade, chapterId: string) =>
  resourcesForIds(
    sourceMaterialPlacements
      .filter((placement) => placement.grade === grade && placement.collectionChapterIds.includes(chapterId))
      .map((placement) => placement.resourceId)
  );

export const sourceUpperSecondaryTransitionResources = sourceMaterialResources.filter(
  (resource) => resource.excludedFromTeachingMaterials
);

export const sourceNeedsReviewResources = sourceMaterialResources.filter((resource) => resource.needsReview);

export const sourceCatalogConservation = {
  sourceLinkRecords: sourceLinkLedger.length,
  canonicalSourceResources: sourceMaterialResources.length,
  safeDuplicateMerges: sourceLinkLedger.filter((record) => record.outcome === 'merged-evidence').length,
  sourceLinkConflictsRetained: sourceMaterialResources.filter(
    (resource) => resource.reviewReason?.includes('same PDF URL') || resource.reviewReason?.includes('unrelated')
  ).length,
  excludedFromTeachingMaterials: sourceUpperSecondaryTransitionResources.length,
  needsReview: sourceNeedsReviewResources.length,
  noLinkRows: sourceNoLinkRows.length,
} as const;
