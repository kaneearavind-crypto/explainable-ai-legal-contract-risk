/**
 * Explainable Legal Risk Classifier Pipeline
 *
 * Implements the core risk detection logic used across the application.
 * Analyzes clauses for legal asymmetries, missing procedural safeguards,
 * unconstrained discretion, and uninsurable liabilities.
 */

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type BinaryRiskLabel = 'Risky' | 'Not Risky';

export interface PredictionResult {
  binaryLabel: BinaryRiskLabel;
  multiClassLabel: RiskLevel;
  confidence: number; // 0.0 to 1.0
  detectedRiskFactors: string[];
  explanation: string;
}

export interface RulePattern {
  id: string;
  name: string;
  severity: RiskLevel;
  weight: number;
  regex: RegExp;
  description: string;
}

// Explainable legal risk rule patterns
const RISK_PATTERNS: RulePattern[] = [
  {
    id: 'unilateral_term',
    name: 'Unilateral Termination Without Notice',
    severity: 'Critical',
    weight: 45,
    regex: /(terminate\s+(this\s+agreement\s+)?(at\s+any\s+time\s+)?without\s+notice|client\s+shall\s+not\s+have\s+the\s+right\s+to\s+terminate|sole\s+and\s+absolute\s+discretion\s+to\s+terminate)/i,
    description: 'Permits one-sided termination with zero notice while denying counterparty reciprocal exit rights.'
  },
  {
    id: 'strict_indemnity',
    name: 'Uncapped Strict Liability Indemnity',
    severity: 'Critical',
    weight: 50,
    regex: /(responsible\s+for\s+all\s+(losses|claims|damages).+regardless\s+of\s+(their\s+)?cause|indemnify.+regardless\s+of\s+cause|indemnify.+arising\s+from\s+any\s+cause\s+whatsoever)/i,
    description: 'Eliminates legal proximate cause and covers counterparty’s own gross negligence or internal failures.'
  },
  {
    id: 'unilateral_discretion',
    name: 'Unilateral Payment or Deadline Determination',
    severity: 'High',
    weight: 35,
    regex: /(deadline\s+shall\s+be\s+determined\s+by|fees?\s+determined\s+at\s+the\s+(sole\s+)?discretion|payment\s+deadline\s+determined\s+by\s+the\s+service\s+provider|sole\s+discretion\s+of\s+the\s+provider)/i,
    description: 'Grants sole discretionary power to alter payment schedules, accelerate deadlines, or set unilateral rates.'
  },
  {
    id: 'perpetual_confidentiality',
    name: 'Indefinite / Undefined Confidentiality',
    severity: 'Medium',
    weight: 25,
    regex: /(does\s+not\s+specify\s+how\s+long|perpetual\s+confidentiality\s+obligation|maintain\s+confidentiality\s+in\s+perpetuity\s+without\s+exception)/i,
    description: 'Confidentiality obligations lack customary survival sunset periods or standard disclosure carve-outs.'
  },
  {
    id: 'unspecified_jurisdiction',
    name: 'Jurisdictional Vacuum / Ambiguous Law',
    severity: 'Medium',
    weight: 20,
    regex: /(resolved\s+according\s+to\s+applicable\s+law|applicable\s+law\s+without\s+specifying|disputes?\s+resolved\s+pursuant\s+to\s+general\s+law)/i,
    description: 'Fails to designate an exclusive governing law, court venue, or dispute escalation mechanism.'
  },
  {
    id: 'uncapped_liability',
    name: 'Uncapped Aggregate Liability',
    severity: 'Critical',
    weight: 40,
    regex: /(without\s+limitation\s+of\s+liability|unlimited\s+liability|no\s+cap\s+on\s+liability|shall\s+not\s+be\s+limited\s+by\s+the\s+fees\s+paid)/i,
    description: 'Exposes counterparty to unlimited commercial damages without standard aggregate caps.'
  },
  {
    id: 'restrictive_covenant',
    name: 'Overbroad Non-Compete / Exclusivity',
    severity: 'High',
    weight: 35,
    regex: /(shall\s+not\s+engage\s+in\s+any\s+competing\s+business|shall\s+not\s+hire\s+any\s+employee\s+associated\s+with|worldwide\s+non-compete|exclusive\s+working\s+relationship)/i,
    description: 'Imposes severe restrictions on trade, hiring, or commercial client engagements.'
  },
  {
    id: 'asymmetric_penalty',
    name: 'Asymmetric Penalties / Forfeiture',
    severity: 'High',
    weight: 30,
    regex: /(deposits?\s+(are|shall\s+be)\s+non-refundable|liquidated\s+damages\s+equal\s+to|forfeiture\s+of\s+all\s+fees|immediate\s+forfeiture)/i,
    description: 'Imposes non-refundable retainers or punitive damages on one side only.'
  },
  {
    id: 'disclaimer_all_warranties',
    name: 'Blanket Disclaimer of All Warranties',
    severity: 'Medium',
    weight: 25,
    regex: /(as-is\s+without\s+any\s+warranties\s+of\s+any\s+kind|disclaims\s+all\s+warranties,\s+express\s+or\s+implied,\s+including\s+merchantability)/i,
    description: 'Disclaims all statutory warranties of fitness, merchantability, or non-infringement.'
  }
];

// Patterns that signal balanced, standard, or protective language
const BALANCED_PATTERNS = [
  /net\s+30/i,
  /prior\s+written\s+notice/i,
  /good-faith\s+negotiation/i,
  /cure\s+(such\s+breach\s+)?within\s+(thirty|30|fifteen|15)\s+days/i,
  /mutual\s+indemnif/i,
  /each\s+party\s+shall\s+defend/i,
  /excluding\s+information\s+that\s+is\s+public/i,
  /laws\s+of\s+the\s+state\s+of\s+(delaware|new\s+york|california)/i,
  /aggregate\s+liability\s+shall\s+not\s+exceed/i,
  /reasonable\s+care/i
];

/**
 * Predicts legal contract risk for a given clause text.
 * NOTE: The prediction pipeline evaluates ONLY the clause text.
 * Ground-truth labels are never passed or seen by this function.
 */
export function predictClauseRisk(clauseText: string): PredictionResult {
  if (!clauseText || typeof clauseText !== 'string' || clauseText.trim().length === 0) {
    return {
      binaryLabel: 'Not Risky',
      multiClassLabel: 'Low',
      confidence: 0.5,
      detectedRiskFactors: ['Empty or Whitespace Clause'],
      explanation: 'Clause text is empty.'
    };
  }

  const cleanText = clauseText.trim();
  const detectedFactors: string[] = [];
  let riskScore = 0;
  let highestSeverity: RiskLevel = 'Low';

  // Evaluate risk rules
  for (const rule of RISK_PATTERNS) {
    if (rule.regex.test(cleanText)) {
      detectedFactors.push(`${rule.name}: ${rule.description}`);
      riskScore += rule.weight;

      if (rule.severity === 'Critical') {
        highestSeverity = 'Critical';
      } else if (rule.severity === 'High' && highestSeverity !== 'Critical') {
        highestSeverity = 'High';
      } else if (rule.severity === 'Medium' && highestSeverity === 'Low') {
        highestSeverity = 'Medium';
      }
    }
  }

  // Check mitigating / balanced patterns
  let mitigationCount = 0;
  for (const pattern of BALANCED_PATTERNS) {
    if (pattern.test(cleanText)) {
      mitigationCount++;
    }
  }

  // Adjust score for balanced patterns
  const netRiskScore = Math.max(0, riskScore - mitigationCount * 20);

  // Determine multi-class label
  let multiClassLabel: RiskLevel;
  if (netRiskScore >= 45 || highestSeverity === 'Critical') {
    multiClassLabel = 'High';
  } else if (netRiskScore >= 20 || highestSeverity === 'High' || highestSeverity === 'Medium') {
    multiClassLabel = 'Medium';
  } else {
    multiClassLabel = 'Low';
  }

  // Determine binary label
  // In legal contract risk analysis, Medium, High, and Critical represent clauses requiring redlining / review ('Risky')
  const binaryLabel: BinaryRiskLabel = multiClassLabel === 'Low' ? 'Not Risky' : 'Risky';

  // Calculate confidence (0.5 to 0.99)
  const confidence = Math.min(
    0.99,
    Math.max(0.6, 0.5 + Math.abs(netRiskScore - 20) / 100)
  );

  let explanation: string;
  if (detectedFactors.length > 0) {
    explanation = `Flagged ${detectedFactors.length} legal risk indicator(s): ${detectedFactors[0]}. Net risk score: ${netRiskScore}.`;
  } else if (mitigationCount > 0) {
    explanation = `Clause contains standard balanced commercial safeguards (${mitigationCount} mitigating clause patterns detected).`;
  } else {
    explanation = 'Neutral commercial provision without high-risk asymmetric patterns.';
  }

  return {
    binaryLabel,
    multiClassLabel,
    confidence: Number(confidence.toFixed(2)),
    detectedRiskFactors: detectedFactors,
    explanation
  };
}

/**
 * Normalizes user-provided ground-truth labels into standard format
 */
export function normalizeGroundTruthLabel(rawLabel: string): {
  binary: BinaryRiskLabel | null;
  multiClass: RiskLevel | null;
  normalizedString: string;
} {
  if (!rawLabel) {
    return { binary: null, multiClass: null, normalizedString: '' };
  }

  const clean = rawLabel.trim().toLowerCase().replace(/[-_]/g, ' ');

  // Binary mappings
  if (
    clean === 'risky' ||
    clean === 'risk' ||
    clean === 'high risk' ||
    clean === 'critical' ||
    clean === 'high' ||
    clean === 'medium' ||
    clean === 'medium risk' ||
    clean === 'unsafe' ||
    clean === '1' ||
    clean === 'true'
  ) {
    // Determine multiclass if specific
    let multi: RiskLevel = 'High';
    if (clean === 'medium' || clean === 'medium risk') multi = 'Medium';
    if (clean === 'critical') multi = 'Critical';
    if (clean === 'high' || clean === 'high risk') multi = 'High';
    if (clean === 'risky' || clean === 'risk') multi = 'High';

    return { binary: 'Risky', multiClass: multi, normalizedString: rawLabel.trim() };
  }

  if (
    clean === 'not risky' ||
    clean === 'not-risky' ||
    clean === 'non risky' ||
    clean === 'low' ||
    clean === 'low risk' ||
    clean === 'safe' ||
    clean === 'balanced' ||
    clean === 'standard' ||
    clean === '0' ||
    clean === 'false'
  ) {
    return { binary: 'Not Risky', multiClass: 'Low', normalizedString: rawLabel.trim() };
  }

  return { binary: null, multiClass: null, normalizedString: rawLabel.trim() };
}
