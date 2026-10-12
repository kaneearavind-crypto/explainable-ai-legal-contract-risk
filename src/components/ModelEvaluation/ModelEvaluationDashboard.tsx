import React, { useState, useEffect, useRef } from 'react';
import { 
  parseAndValidateContractCsv, 
  CsvParseResult, 
  ParsedCsvRow 
} from '../../utils/csvParser';
import { 
  predictClauseRisk, 
  normalizeGroundTruthLabel 
} from '../../services/riskClassifier';
import { 
  calculateBinaryMetrics, 
  calculateMultiClassMetrics, 
  FullEvaluationReport, 
  EvaluatedSample 
} from '../../utils/evaluationMetrics';
import { 
  BENCHMARK_DATASETS, 
  SAMPLE_CSV_TEMPLATE 
} from '../../data/benchmarkDatasets';
import { EvaluationSummaryCards } from './EvaluationSummaryCards';
import { ConfusionMatrixCard } from './ConfusionMatrixCard';
import { DistributionCharts } from './DistributionCharts';
import { PerClassTable } from './PerClassTable';
import { ClausePredictionTable } from './ClausePredictionTable';
import { EvaluationReportModal } from './EvaluationReportModal';

import { 
  Upload, 
  FileSpreadsheet, 
  Play, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw,
  Info,
  Sliders,
  HelpCircle
} from 'lucide-react';

export const ModelEvaluationDashboard: React.FC = () => {
  // Dataset selection & upload state
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('commercial-25');
  const [customCsvContent, setCustomCsvContent] = useState<string | null>(null);
  const [customFileName, setCustomFileName] = useState<string>('');
  const [parseResult, setParseResult] = useState<CsvParseResult | null>(null);

  // Pipeline selection
  const [pipelineMode, setPipelineMode] = useState<'Deterministic Legal NLP Pipeline' | 'Gemini AI Pipeline'>(
    'Deterministic Legal NLP Pipeline'
  );
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [report, setReport] = useState<FullEvaluationReport | null>(null);

  // Interactive filters
  const [activeMatrixFilter, setActiveMatrixFilter] = useState<'all' | 'tp' | 'tn' | 'fp' | 'fn'>('all');
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load and parse dataset when selected or uploaded
  useEffect(() => {
    let csvText = '';
    if (selectedDatasetId === 'custom' && customCsvContent) {
      csvText = customCsvContent;
    } else {
      const benchmark = BENCHMARK_DATASETS.find(d => d.id === selectedDatasetId);
      if (benchmark) {
        csvText = benchmark.csvContent;
      }
    }

    if (csvText) {
      const parsed = parseAndValidateContractCsv(csvText);
      setParseResult(parsed);
      // Auto run evaluation on dataset change for instant responsiveness
      runEvaluation(parsed, pipelineMode);
    }
  }, [selectedDatasetId, customCsvContent, pipelineMode]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomFileName(file.name);
    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      setCustomCsvContent(text);
      setSelectedDatasetId('custom');
    };
    reader.readAsText(file);
  };

  // Download sample CSV template
  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Sample_Contract_Risk_Test_Dataset.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Run evaluation on parsed dataset
  const runEvaluation = (parsed: CsvParseResult, mode: 'Deterministic Legal NLP Pipeline' | 'Gemini AI Pipeline') => {
    if (!parsed || parsed.rows.length === 0) {
      setReport(null);
      return;
    }

    setIsEvaluating(true);

    const validSamples: EvaluatedSample[] = [];
    let invalidCount = 0;
    const actualClassCounts: Record<string, number> = {};
    const predClassCounts: Record<string, number> = {};

    parsed.rows.forEach((row, idx) => {
      // Validate ground-truth label
      const normalizedGT = normalizeGroundTruthLabel(row.rawLabel);
      if (!row.clauseText || !normalizedGT.binary) {
        invalidCount++;
        return;
      }

      // CRITICAL: Ground-truth label is NOT passed to prediction pipeline!
      // Only the raw clause text is evaluated by the prediction pipeline.
      const prediction = predictClauseRisk(row.clauseText);

      const actualBinary = normalizedGT.binary;
      const predictedBinary = prediction.binaryLabel;
      const actualMulti = normalizedGT.multiClass || (actualBinary === 'Risky' ? 'High' : 'Low');
      const predictedMulti = prediction.multiClassLabel;

      const isBinaryCorrect = actualBinary === predictedBinary;
      const isMultiClassCorrect = actualMulti === predictedMulti;

      // Distribution tallies
      actualClassCounts[actualMulti] = (actualClassCounts[actualMulti] || 0) + 1;
      predClassCounts[predictedMulti] = (predClassCounts[predictedMulti] || 0) + 1;

      validSamples.push({
        id: `sample-${idx + 1}`,
        index: idx + 1,
        clauseText: row.clauseText,
        actualLabel: row.rawLabel,
        predictedLabel: predictedBinary,
        actualBinary,
        predictedBinary,
        actualMultiClass: actualMulti,
        predictedMultiClass: predictedMulti,
        isBinaryCorrect,
        isMultiClassCorrect,
        confidence: prediction.confidence,
        detectedFactors: prediction.detectedRiskFactors,
        explanation: prediction.explanation
      });
    });

    // Calculate binary metrics
    const binaryData = validSamples.map(s => ({
      actual: s.actualBinary,
      predicted: s.predictedBinary
    }));
    const binaryMetrics = calculateBinaryMetrics(binaryData);

    // Calculate multi-class metrics
    const multiData = validSamples.map(s => ({
      actual: s.actualMultiClass,
      predicted: s.predictedMultiClass
    }));
    const multiClassMetrics = calculateMultiClassMetrics(multiData, ['Low', 'Medium', 'High']);

    const correctCount = validSamples.filter(s => s.isBinaryCorrect).length;
    const incorrectCount = validSamples.length - correctCount;

    const evaluationDate = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const newReport: FullEvaluationReport = {
      evaluationDate,
      datasetSize: parsed.totalRows,
      validSamplesCount: validSamples.length,
      invalidSamplesCount: invalidCount,
      correctPredictionsCount: correctCount,
      incorrectPredictionsCount: incorrectCount,
      binaryMetrics,
      multiClassMetrics,
      classDistribution: actualClassCounts,
      predictedDistribution: predClassCounts,
      samples: validSamples,
      pipelineMethod: mode
    };

    setReport(newReport);
    setIsEvaluating(false);
  };

  const currentDatasetTitle =
    selectedDatasetId === 'custom'
      ? customFileName || 'Custom Uploaded Dataset'
      : BENCHMARK_DATASETS.find(d => d.id === selectedDatasetId)?.name || 'Benchmark Dataset';

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Model Performance Evaluation Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight">
              Statistical Evaluation of Legal Risk Classifiers
            </h2>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Sample CSV Template</span>
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              disabled={!report}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded transition-colors whitespace-nowrap shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Generate Evaluation Report</span>
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-600 font-sans leading-relaxed max-w-4xl">
          Evaluate risk detection accuracy, precision, recall (sensitivity), and F1-score against independent labelled test datasets.
          Each contract clause is routed through the application's risk pipeline without viewing ground-truth labels.
        </p>
      </div>

      {/* Dataset Selection & Upload Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Presets and file picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Test Dataset Selection
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {BENCHMARK_DATASETS.map(dataset => (
                <button
                  key={dataset.id}
                  onClick={() => setSelectedDatasetId(dataset.id)}
                  className={`px-3 py-1.5 text-xs rounded transition-colors flex items-center gap-1.5 ${
                    selectedDatasetId === dataset.id
                      ? 'bg-slate-900 text-white font-medium shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>{dataset.name}</span>
                </button>
              ))}

              <button
                onClick={() => fileInputRef.current?.click()}
                className={`px-3 py-1.5 text-xs rounded transition-colors flex items-center gap-1.5 border border-dashed ${
                  selectedDatasetId === 'custom'
                    ? 'bg-slate-900 text-white border-slate-900 font-medium shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{customFileName ? `Custom: ${customFileName}` : 'Upload Labelled CSV'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {/* Pipeline Methodology */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Risk Prediction Pipeline
            </label>
            <div className="flex items-center p-0.5 bg-slate-100 rounded border border-slate-200 text-xs">
              <button
                onClick={() => setPipelineMode('Deterministic Legal NLP Pipeline')}
                className={`px-3 py-1 rounded transition-colors ${
                  pipelineMode === 'Deterministic Legal NLP Pipeline'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Explainable Rule Pipeline (Fast & Reproducible)
              </button>
            </div>
          </div>
        </div>

        {/* Dataset validation summary */}
        {parseResult && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 text-slate-600">
              <span className="font-medium text-slate-900">
                Mapped Columns:
              </span>
              <span>
                Clause Text: <strong className="font-mono text-slate-800">"{parseResult.clauseColumn}"</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Risk Label: <strong className="font-mono text-slate-800">"{parseResult.labelColumn}"</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Valid Rows: <strong className="font-mono text-emerald-700">{report?.validSamplesCount}</strong>
              </span>
            </div>

            {parseResult.errors.length > 0 ? (
              <span className="text-amber-700 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{parseResult.errors.length} validation notice(s)</span>
              </span>
            ) : (
              <span className="text-emerald-700 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>CSV Schema Verified</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Results View */}
      {report && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <EvaluationSummaryCards report={report} />

          {/* Grid: Confusion Matrix & Distribution Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConfusionMatrixCard
              binaryMatrix={report.binaryMetrics.confusionMatrix}
              multiClassMatrix={report.multiClassMetrics.confusionMatrix}
              onFilterCell={filter => setActiveMatrixFilter(filter)}
              activeFilter={activeMatrixFilter}
            />

            <DistributionCharts report={report} />
          </div>

          {/* Per-Class Multi-Class Table */}
          <PerClassTable metrics={report.multiClassMetrics} />

          {/* Clause-by-Clause Evaluation Table */}
          <ClausePredictionTable
            samples={report.samples}
            activeFilter={activeMatrixFilter}
            onResetFilter={() => setActiveMatrixFilter('all')}
          />
        </div>
      )}

      {/* Downloadable Evaluation Report Modal */}
      <EvaluationReportModal
        report={report}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        datasetName={currentDatasetTitle}
      />
    </div>
  );
};
