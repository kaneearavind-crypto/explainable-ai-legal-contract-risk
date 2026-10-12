/**
 * Rigorous Statistical Evaluation Metrics for Model Performance
 *
 * Implements standard mathematical definitions of:
 * - Accuracy, Precision, Recall, F1-Score
 * - Binary Confusion Matrix (TP, TN, FP, FN)
 * - Multi-class Per-Class Precision, Recall, F1, Macro-F1, and Weighted-F1
 *
 * Safe division by zero handling in all cases.
 */

export interface BinaryConfusionMatrix {
  truePositive: number;  // Actual: Risky, Predicted: Risky
  trueNegative: number;  // Actual: Not Risky, Predicted: Not Risky
  falsePositive: number; // Actual: Not Risky, Predicted: Risky (Type I error)
  falseNegative: number; // Actual: Risky, Predicted: Not Risky (Type II error)
  total: number;
}

export interface BinaryMetrics {
  accuracy: number;     // (TP + TN) / Total
  precision: number;    // TP / (TP + FP)
  recall: number;       // TP / (TP + FN) - Sensitivity
  specificity: number;  // TN / (TN + FP)
  f1Score: number;      // 2 * (Precision * Recall) / (Precision + Recall)
  confusionMatrix: BinaryConfusionMatrix;
}

export interface PerClassMetric {
  className: string;
  support: number;      // Count of actual samples in this class
  truePositive: number;
  falsePositive: number;
  falseNegative: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface MultiClassConfusionMatrix {
  classes: string[];
  matrix: number[][]; // matrix[actualIdx][predictedIdx]
}

export interface MultiClassMetrics {
  accuracy: number;
  macroPrecision: number;
  macroRecall: number;
  macroF1: number;
  weightedF1: number;
  perClass: Record<string, PerClassMetric>;
  confusionMatrix: MultiClassConfusionMatrix;
}

export interface EvaluatedSample {
  id: string;
  index: number;
  clauseText: string;
  actualLabel: string;
  predictedLabel: string;
  actualBinary: 'Risky' | 'Not Risky';
  predictedBinary: 'Risky' | 'Not Risky';
  actualMultiClass: string;
  predictedMultiClass: string;
  isBinaryCorrect: boolean;
  isMultiClassCorrect: boolean;
  confidence: number;
  detectedFactors: string[];
  explanation: string;
}

export interface FullEvaluationReport {
  evaluationDate: string;
  datasetSize: number;
  validSamplesCount: number;
  invalidSamplesCount: number;
  correctPredictionsCount: number;
  incorrectPredictionsCount: number;
  binaryMetrics: BinaryMetrics;
  multiClassMetrics: MultiClassMetrics;
  classDistribution: Record<string, number>;
  predictedDistribution: Record<string, number>;
  samples: EvaluatedSample[];
  pipelineMethod: 'Deterministic Legal NLP Pipeline' | 'Gemini AI Pipeline';
}

/**
 * Calculates standard binary metrics safely handling zero denominators.
 */
export function calculateBinaryMetrics(
  samples: { actual: 'Risky' | 'Not Risky'; predicted: 'Risky' | 'Not Risky' }[]
): BinaryMetrics {
  let tp = 0;
  let tn = 0;
  let fp = 0;
  let fn = 0;

  for (const s of samples) {
    if (s.actual === 'Risky' && s.predicted === 'Risky') {
      tp++;
    } else if (s.actual === 'Not Risky' && s.predicted === 'Not Risky') {
      tn++;
    } else if (s.actual === 'Not Risky' && s.predicted === 'Risky') {
      fp++;
    } else if (s.actual === 'Risky' && s.predicted === 'Not Risky') {
      fn++;
    }
  }

  const total = tp + tn + fp + fn;
  const accuracy = total > 0 ? (tp + tn) / total : 0;
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const specificity = tn + fp > 0 ? tn / (tn + fp) : 0;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return {
    accuracy,
    precision,
    recall,
    specificity,
    f1Score,
    confusionMatrix: {
      truePositive: tp,
      trueNegative: tn,
      falsePositive: fp,
      falseNegative: fn,
      total
    }
  };
}

/**
 * Calculates multi-class metrics (e.g. Low, Medium, High).
 */
export function calculateMultiClassMetrics(
  samples: { actual: string; predicted: string }[],
  targetClasses: string[] = ['Low', 'Medium', 'High']
): MultiClassMetrics {
  // Ensure all present classes are tracked
  const classSet = new Set<string>(targetClasses);
  samples.forEach(s => {
    if (s.actual) classSet.add(s.actual);
    if (s.predicted) classSet.add(s.predicted);
  });
  const classes = Array.from(classSet);

  const n = classes.length;
  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  let totalCorrect = 0;
  const totalSamples = samples.length;

  for (const s of samples) {
    const actIdx = classes.indexOf(s.actual);
    const predIdx = classes.indexOf(s.predicted);
    if (actIdx >= 0 && predIdx >= 0) {
      matrix[actIdx][predIdx]++;
      if (actIdx === predIdx) {
        totalCorrect++;
      }
    }
  }

  const accuracy = totalSamples > 0 ? totalCorrect / totalSamples : 0;
  const perClass: Record<string, PerClassMetric> = {};

  let sumPrecision = 0;
  let sumRecall = 0;
  let sumF1 = 0;
  let weightedF1Sum = 0;
  let totalSupport = 0;

  for (let i = 0; i < n; i++) {
    const cName = classes[i];
    const tp = matrix[i][i];

    // FP: column sum minus TP
    let fp = 0;
    for (let r = 0; r < n; r++) {
      if (r !== i) fp += matrix[r][i];
    }

    // FN: row sum minus TP
    let fn = 0;
    for (let col = 0; col < n; col++) {
      if (col !== i) fn += matrix[i][col];
    }

    // Support is row sum
    const support = tp + fn;
    totalSupport += support;

    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    perClass[cName] = {
      className: cName,
      support,
      truePositive: tp,
      falsePositive: fp,
      falseNegative: fn,
      precision,
      recall,
      f1Score
    };

    sumPrecision += precision;
    sumRecall += recall;
    sumF1 += f1Score;
    weightedF1Sum += f1Score * support;
  }

  const macroPrecision = n > 0 ? sumPrecision / n : 0;
  const macroRecall = n > 0 ? sumRecall / n : 0;
  const macroF1 = n > 0 ? sumF1 / n : 0;
  const weightedF1 = totalSupport > 0 ? weightedF1Sum / totalSupport : 0;

  return {
    accuracy,
    macroPrecision,
    macroRecall,
    macroF1,
    weightedF1,
    perClass,
    confusionMatrix: {
      classes,
      matrix
    }
  };
}
