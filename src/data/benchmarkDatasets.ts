/**
 * Standard Labelled Benchmark Datasets for Legal Contract Risk Evaluation
 *
 * Provides curated, ground-truth annotated contract clauses for independent evaluation.
 */

export interface BenchmarkDataset {
  id: string;
  name: string;
  description: string;
  clauseCount: number;
  csvContent: string;
}

const COMMERCIAL_BENCHMARK_CSV = `clause,ground_truth,risk_category
"The client shall pay the service provider for the services rendered. The payment deadline shall be determined by the service provider.",Risky,High
"The service provider may terminate this agreement at any time without notice. The client shall not have the right to terminate this agreement.",Risky,High
"The client shall be responsible for all losses, claims, damages, and expenses of any kind, regardless of their cause.",Risky,High
"The parties shall maintain the confidentiality of all confidential information. The agreement does not specify how long this obligation will continue.",Risky,Medium
"Any disputes arising under this agreement shall be resolved according to applicable law.",Risky,Medium
"Client shall pay all undisputed invoice amounts within thirty (30) calendar days of receipt of invoice (Net 30).",Not Risky,Low
"Either party may terminate this Agreement without cause at any time upon thirty (30) calendar days prior written notice to the other party.",Not Risky,Low
"Each party shall defend, indemnify, and hold harmless the other party against third-party claims arising out of its gross negligence or willful misconduct.",Not Risky,Low
"These confidentiality obligations shall survive for a period of three (3) years following the termination of this Agreement, except for trade secrets.",Not Risky,Low
"This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware without regard to conflicts of law.",Not Risky,Low
"Service Provider disclaims all warranties, express or implied, including merchantability, and provides deliverables entirely as-is without any warranties of any kind.",Risky,Medium
"Client agrees that during the term and for three years thereafter, Client shall not engage in any competing business worldwide nor hire any employee of Provider.",Risky,High
"Deposits and advance retainer fees shall be non-refundable under all circumstances, even in the event of provider non-performance.",Risky,High
"In the event of any payment delinquency, Service Provider reserves the right to immediately accelerate all future contract fees in its sole discretion.",Risky,High
"Either party may terminate immediately if the other party commits a material breach and fails to cure such breach within thirty (30) days of written notice.",Not Risky,Low
"Except for indemnity obligations or willful breach, neither party aggregate liability under this agreement shall exceed the fees paid in the preceding 12 months.",Not Risky,Low
"Client may withhold payment of invoice items disputed in good faith upon written notice within ten (10) business days of invoice receipt.",Not Risky,Low
"Confidentiality exclusions shall apply to information that is public, previously known, or independently developed without access.",Not Risky,Low
"Service Provider shall have sole and absolute discretion to terminate this agreement at any time upon oral notice.",Risky,High
"Client shall indemnify provider for all expenses including losses arising from any cause whatsoever without limitation.",Risky,High
"Any dispute shall be submitted to good-faith senior executive negotiations for thirty days prior to commencing formal litigation.",Not Risky,Low
"The parties mutually agree that disputes shall be submitted exclusively to binding arbitration under the rules of the American Arbitration Association.",Not Risky,Low
"Client agrees to assume unlimited liability for all damages incurred by provider during the project term.",Risky,High
"All reimbursable travel expenses shall require Client prior written approval before incurring.",Not Risky,Low
"Service Provider shall maintain reasonable care and commercial standards in performing the professional services.",Not Risky,Low`;

const PROCUREMENT_BENCHMARK_CSV = `clause,label,severity
"Client shall pay invoices within forty-five (45) days of receipt following written acceptance of deliverables.",Not Risky,Low
"Vendor may adjust contract fees at any time upon five days notice at vendor sole discretion.",Risky,High
"Both parties agree to mutual bilateral indemnification for third-party intellectual property infringement claims.",Not Risky,Low
"Customer assumes total responsibility for all claims and costs regardless of their cause or origin.",Risky,High
"Confidential information shall be marked in writing and protected for two (2) years post-termination.",Not Risky,Low
"Agreement duration and exit rights shall be determined at the sole discretion of the vendor without notice.",Risky,High
"Either party may terminate for convenience upon sixty (60) days prior written notice.",Not Risky,Low
"Vendor disclaims all warranties of merchantability and makes no representations regarding deliverables.",Risky,Medium
"Governing law shall be the laws of the State of New York with exclusive venue in New York County.",Not Risky,Low
"Client shall not recruit or hire any vendor personnel during the term and for two years thereafter.",Risky,High
"Prepaid balances shall be non-refundable under any circumstance even upon cancellation.",Risky,High
"Undisputed invoices shall be payable Net 30 with 1.5% interest per month on overdue balances.",Not Risky,Low`;

export const BENCHMARK_DATASETS: BenchmarkDataset[] = [
  {
    id: 'commercial-25',
    name: 'Commercial Contract Risk Benchmark (25 Clauses)',
    description: 'Balanced multi-domain test set including Payment, Termination, Indemnity, Confidentiality, IP, and Non-Compete clauses with annotated ground truth.',
    clauseCount: 25,
    csvContent: COMMERCIAL_BENCHMARK_CSV
  },
  {
    id: 'procurement-12',
    name: 'Enterprise Procurement & Vendor Test Set (12 Clauses)',
    description: 'Enterprise procurement clauses focusing on price acceleration, unilateral discretion, and bilateral risk allocation.',
    clauseCount: 12,
    csvContent: PROCUREMENT_BENCHMARK_CSV
  }
];

export const SAMPLE_CSV_TEMPLATE = `clause,ground_truth,risk_category
"The payment deadline shall be determined by the service provider.",Risky,High
"Client shall pay undisputed invoices within thirty (30) days of receipt (Net 30).",Not Risky,Low
"The service provider may terminate this agreement at any time without notice.",Risky,High
"Either party may terminate for convenience upon thirty (30) days written notice.",Not Risky,Low
"The client shall be responsible for all losses regardless of their cause.",Risky,High
"Each party shall defend and indemnify the other against third-party claims from gross negligence.",Not Risky,Low`;
