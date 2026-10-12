export interface PartyRisks {
  client: string[];
  provider: string[];
}

export interface RedlinePreset {
  name: string;
  label: string;
  description: string;
  text: string;
  deletions: string[];
  insertions: string[];
}

export interface TunableOption {
  id: string;
  label: string;
  description: string;
  type: 'select' | 'boolean' | 'number';
  defaultValue: any;
  options?: { value: any; label: string }[];
}

export interface ClauseAnalysis {
  id: string;
  number: number;
  title: string;
  category: 'Commercial & Payment' | 'Term & Termination' | 'Liability & Risk Allocation' | 'IP & Confidentiality' | 'Dispute & Governance';
  originalText: string;
  riskSeverity: 'Critical' | 'High' | 'Medium' | 'Low';
  riskSummary: string;
  ambiguities: string[];
  partyRisks: PartyRisks;
  legalDoctrines: string[];
  balancedRedline: string;
  redlinePresets: {
    balanced: RedlinePreset;
    clientProtective: RedlinePreset;
    providerProtective: RedlinePreset;
  };
  negotiationPoints: {
    clientPosition: string;
    compromisePosition: string;
    walkawayThreshold: string;
  };
  tunableOptions: TunableOption[];
  generateTunableText: (settings: Record<string, any>) => string;
}

export const ILLUSTRATIVE_CLAUSES: ClauseAnalysis[] = [
  {
    id: 'clause-1-payment',
    number: 1,
    title: 'Payment',
    category: 'Commercial & Payment',
    originalText:
      'The client shall pay the service provider for the services rendered. The payment deadline shall be determined by the service provider.',
    riskSeverity: 'High',
    riskSummary:
      'Unilateral payment deadline grants the provider unconstrained discretion to accelerate invoices, demand immediate remittance, or claim default without milestone verification.',
    ambiguities: [
      'Undefined Compensation Mechanics: Lacks stated fee structure (fixed fee, time & materials, hourly cap, or milestone tranches), currency, or invoicing cadence.',
      'Subjective "Services Rendered": No acceptance testing, deliverable sign-off criteria, or client inspection window prior to payment obligation crystallizing.',
      'Unilateral Payment Deadline: Grants service provider absolute arbitrary authority to set payment due dates (e.g., immediate on receipt, Net-0, or post-dated demands).',
      'Absence of Dispute Protocol: No mechanism for withholding disputed amounts in good faith without triggering technical breach or suspension of services.',
      'Omission of Incidental Costs: Silent on out-of-pocket expenses, travel reimbursement caps, applicable sales taxes, and statutory late payment interest.'
    ],
    partyRisks: {
      client: [
        'Unpredictable Cash Flow: The provider could arbitrarily issue an invoice due in 24 hours, placing the client in immediate contractual default.',
        'Compelled Payment for Defective Work: Client must pay before verifying whether deliverables meet specifications, leaving no leverage for remediation.',
        'Lack of Expense Caps: Potential to be billed for unexpected ancillary expenses not contemplated during scope definition.'
      ],
      provider: [
        'Vague Obligation Under Ambiguity: In many jurisdictions, open payment terms require court determination of "reasonable time" (e.g., UCC § 2-310), triggering protracted collection disputes.',
        'No Stated Late Penalties: Without an explicit interest rate (e.g. 1.5% per month), the provider cannot easily claim interest on delinquent accounts without proving statutory prejudgment damages.'
      ]
    },
    legalDoctrines: [
      'Unilateral Discretion & Good Faith: Open price/time terms are subject to the implied covenant of good faith and fair dealing; unfettered unilateral discretion invites litigation.',
      'Condition Precedent to Payment: Standard commercial contracts condition payment on receipt of an itemized invoice and formal deliverable acceptance.',
      'Prompt Payment Standards: Commercial standard across tech and professional services defaults to Net 30 days after invoice issuance.'
    ],
    balancedRedline:
      '1. Payment and Invoicing.\n(a) Fees. Client shall pay Service Provider the agreed fees set forth in the applicable Statement of Work ("SOW") upon satisfactory completion and written acceptance of the designated deliverables.\n(b) Invoicing & Terms. Service Provider shall issue itemized invoices on a monthly basis. Client shall pay all undisputed invoice amounts within thirty (30) calendar days of receipt of the invoice ("Net 30").\n(c) Invoice Disputes. In the event Client disputes any portion of an invoice in good faith, Client shall notify Service Provider in writing within ten (10) business days of receipt, detailing the grounds for dispute. The parties shall negotiate in good faith to resolve the dispute, and Client may withhold payment of only the disputed portion without penalty while paying all undisputed amounts.',
    redlinePresets: {
      balanced: {
        name: 'Balanced Standard',
        label: 'Balanced (Net 30)',
        description: 'Standard commercial practice: Net 30, deliverable acceptance criteria, and 10-day invoice dispute protocol.',
        text:
          '1. Payment and Invoicing.\nClient shall pay Service Provider for services rendered in accordance with the fee schedule specified in Exhibit A. Service Provider shall submit monthly itemized invoices. Client shall remit payment within thirty (30) days of receipt of an uncontested invoice. Client may withhold payment of items disputed in good faith upon written notice within ten (10) business days of receipt, while paying undisputed sums.',
        deletions: ['The payment deadline shall be determined by the service provider.'],
        insertions: [
          'in accordance with the fee schedule specified in Exhibit A.',
          'Service Provider shall submit monthly itemized invoices.',
          'remit payment within thirty (30) days of receipt of an uncontested invoice.',
          'Client may withhold payment of items disputed in good faith upon written notice within ten (10) business days.'
        ]
      },
      clientProtective: {
        name: 'Client-Protective',
        label: 'Client-Favorable (Net 45 + Acceptance)',
        description: 'Extended Net 45 terms, formal 14-day deliverable acceptance milestone, and clear cap on incidental expenses.',
        text:
          '1. Fees, Acceptance, and Payment.\nPayment is conditioned upon Client\'s prior written acceptance of each deliverable following a fourteen (14) day inspection period. Fees shall be strictly capped as set forth in the SOW. Undisputed fees shall be payable within forty-five (45) calendar days following acceptance and receipt of a compliant invoice. All reimbursable expenses require Client\'s prior written approval.',
        deletions: ['The payment deadline shall be determined by the service provider.'],
        insertions: [
          'Payment is conditioned upon Client\'s prior written acceptance after a 14-day inspection period.',
          'payable within forty-five (45) calendar days following acceptance.',
          'All reimbursable expenses require prior written approval.'
        ]
      },
      providerProtective: {
        name: 'Provider-Protective',
        label: 'Provider-Favorable (Net 15 + Late Interest)',
        description: 'Accelerated Net 15 terms, 1.5% monthly late payment interest, and immediate right to suspend services upon default.',
        text:
          '1. Payment Terms & Late Charges.\nClient shall pay all invoices within fifteen (15) calendar days of invoice date. Overdue amounts shall accrue interest at 1.5% per month or the maximum legal rate. If any undisputed payment is past due by more than ten (10) days, Service Provider may suspend performance upon three (3) days\' notice without liability.',
        deletions: ['The payment deadline shall be determined by the service provider.'],
        insertions: [
          'within fifteen (15) calendar days of invoice date.',
          'accrue interest at 1.5% per month or maximum legal rate.',
          'Service Provider may suspend performance upon three (3) days\' notice without liability.'
        ]
      }
    },
    negotiationPoints: {
      clientPosition:
        '"We cannot sign open-ended payment terms or cede deadline control. Invoices must be subject to deliverable acceptance with Net 30 terms and a clear dispute carve-out."',
      compromisePosition:
        'Offer Net 30 payment from invoice receipt, agree to pay 50% upfront for direct vendor disbursements if applicable, and implement a 10-day invoice dispute notification window.',
      walkawayThreshold:
        'Reject any clause granting the vendor unilateral discretion to accelerate deadlines or declare default without prior invoice receipt and cure opportunity.'
    },
    tunableOptions: [
      {
        id: 'netDays',
        label: 'Payment Window',
        description: 'Number of calendar days after invoice receipt for payment.',
        type: 'select',
        defaultValue: 30,
        options: [
          { value: 15, label: 'Net 15 Days (Vendor Favorable)' },
          { value: 30, label: 'Net 30 Days (Market Standard)' },
          { value: 45, label: 'Net 45 Days (Enterprise Standard)' },
          { value: 60, label: 'Net 60 Days (Client Extended)' }
        ]
      },
      {
        id: 'disputeDays',
        label: 'Dispute Notice Window',
        description: 'Days within which client must flag invoice discrepancies in good faith.',
        type: 'select',
        defaultValue: 10,
        options: [
          { value: 7, label: '7 Business Days' },
          { value: 10, label: '10 Business Days (Standard)' },
          { value: 15, label: '15 Business Days' }
        ]
      },
      {
        id: 'includeLateFee',
        label: 'Late Payment Interest Clause',
        description: 'Apply monthly interest fee on overdue undisputed sums.',
        type: 'boolean',
        defaultValue: true
      }
    ],
    generateTunableText: (settings: Record<string, any>) => {
      const net = settings.netDays || 30;
      const dispute = settings.disputeDays || 10;
      const lateFee = settings.includeLateFee
        ? ' Undisputed overdue amounts shall accrue interest at the lesser of one and one-half percent (1.5%) per month or the maximum statutory rate permitted by law.'
        : '';
      return `1. Payment and Invoicing.\n(a) Fees. Client shall pay Service Provider the agreed fees set forth in the applicable Statement of Work upon satisfactory completion and written acceptance of designated services.\n(b) Invoicing & Terms. Service Provider shall submit itemized invoices monthly. Client shall pay undisputed amounts within ${net} calendar days of receipt of the invoice ("Net ${net}").${lateFee}\n(c) Invoice Disputes. Client may withhold disputed amounts in good faith provided Client delivers written notice detailing the discrepancy within ${dispute} business days of invoice receipt.`;
    }
  },
  {
    id: 'clause-2-termination',
    number: 2,
    title: 'Termination',
    category: 'Term & Termination',
    originalText:
      'The service provider may terminate this agreement at any time without notice. The client shall not have the right to terminate this agreement.',
    riskSeverity: 'Critical',
    riskSummary:
      'Extreme unilateral exit asymmetry: the provider can abandon performance on zero notice while the client is perpetually locked in, risking contract invalidation for lack of consideration/mutuality.',
    ambiguities: [
      'Total Absence of Mutuality: Unilateral right for one party while stripping the counterpart of all termination rights violates fundamental fairness and invites judicial challenge.',
      'Lack of Distinction Between Cause and Convenience: "At any time without notice" conflates breach-driven termination with voluntary exit.',
      'Silence on Work-in-Progress & IP Transfer: No stipulation regarding deliverable handover, source files, or transition assistance upon abrupt vendor departure.',
      'Prepaid Fees & Accrued Liabilities: No provision for refund of unearned advances or compensation for work completed up to termination.',
      'Perpetual Client Lock-In: Even if the provider completely halts service or commits fraud, the plain text denies the client any exit right.'
    ],
    partyRisks: {
      client: [
        'Business Disruption / Vendor Stranding: Provider can abandon critical systems or active workflows immediately with zero transition window.',
        'Inability to Exit for Cause: Client remains bound even if provider fails to deliver, breaches confidentiality, or charges exorbitant unexpected sums.',
        'Sunk Cost Trap: Advance retainers or deposits risk forfeiture without explicit refund guarantees upon provider-initiated cancellation.'
      ],
      provider: [
        'Enforceability & Illusory Contract Risk: Under established common law doctrine (Restatement (Second) of Contracts § 77), an agreement where one party can terminate at will without notice while the other cannot may be declared illusory for lack of mutual consideration.',
        'Unconscionability Doctrine: High probability of being struck down by courts under unconscionability doctrines (e.g. UCC § 2-302).'
      ]
    },
    legalDoctrines: [
      'Mutuality of Obligation: A contract must bind both parties; where one party reserves unfettered right to terminate without notice while denying exit to the other, promises may be illusory.',
      'Termination for Cause vs. Convenience: Commercial agreements require a cure period (typically 30 days) for material breach, and symmetrical advance notice (typically 30–60 days) for convenience.',
      'Equitable Restitution & Wind-Down: Post-termination duties must govern return of proprietary materials, transition periods, and pro-rata accounting.'
    ],
    balancedRedline:
      '2. Term and Termination.\n(a) Termination for Convenience. Either party may terminate this Agreement without cause at any time upon thirty (30) calendar days\' prior written notice to the other party.\n(b) Termination for Material Cause. Either party may terminate this Agreement immediately upon written notice if the other party: (i) commits a material breach of this Agreement and fails to cure such breach within thirty (30) days of receiving written notice specifying the breach; or (ii) becomes insolvent, files for bankruptcy, or enters receivership.\n(c) Effect of Termination. Upon termination, Client shall pay Service Provider for all conforming services satisfactorily performed through the effective date of termination. Service Provider shall promptly deliver to Client all completed and in-progress deliverables, work product, and Client Confidential Information.',
    redlinePresets: {
      balanced: {
        name: 'Balanced Standard',
        label: 'Balanced (Mutual Convenience & Cause)',
        description: 'Bilateral 30-day notice for convenience, 30-day cure period for material breach, and pro-rata settlement.',
        text:
          '2. Term and Termination.\nEither party may terminate this Agreement for convenience upon thirty (30) days\' written notice. Either party may terminate immediately if the other party breaches any material term and fails to cure within thirty (30) days of written notice. Upon termination, Client shall pay for services completed through the termination date, and Service Provider shall deliver all work product generated to date.',
        deletions: [
          'The service provider may terminate this agreement at any time without notice.',
          'The client shall not have the right to terminate this agreement.'
        ],
        insertions: [
          'Either party may terminate this Agreement for convenience upon thirty (30) days\' written notice.',
          'Either party may terminate immediately if the other party breaches any material term and fails to cure within thirty (30) days.',
          'Client shall pay for services completed through termination date; Service Provider shall deliver all work product generated.'
        ]
      },
      clientProtective: {
        name: 'Client-Protective',
        label: 'Client-Favorable (Short Notice & Full Work Product)',
        description: 'Client can terminate for convenience on 14 days\' notice; provider requires 60 days; immediate exit on provider breach with full refund.',
        text:
          '2. Termination and Wind-Down.\nClient may terminate this Agreement at any time, with or without cause, upon fourteen (14) days\' prior written notice. Service Provider may terminate only upon sixty (60) days\' prior written notice. Client may terminate immediately without penalty for Service Provider\'s material breach or failure to meet milestone deadlines. In all termination scenarios, Service Provider shall deliver all partial and finished work product and refund unearned prepaid fees within seven (7) days.',
        deletions: [
          'The service provider may terminate this agreement at any time without notice.',
          'The client shall not have the right to terminate this agreement.'
        ],
        insertions: [
          'Client may terminate at any time upon fourteen (14) days\' notice.',
          'Service Provider may terminate only upon sixty (60) days\' notice.',
          'Immediate exit on provider failure; full delivery of partial work and refund of unearned fees.'
        ]
      },
      providerProtective: {
        name: 'Provider-Protective',
        label: 'Provider-Favorable (Minimum Commitment & Non-Refundable)',
        description: 'Mutual 30-day notice, non-refundable retainers, and client payment of demobilization / cancellation costs.',
        text:
          '2. Term & Mutual Termination.\nEither party may terminate upon thirty (30) days\' written notice. In the event of early termination by Client without Provider default, Client shall pay for all work rendered, committed non-cancellable third-party expenses, and a wind-down fee equal to 10% of remaining contract value. Prepaid deposits are non-refundable.',
        deletions: [
          'The service provider may terminate this agreement at any time without notice.',
          'The client shall not have the right to terminate this agreement.'
        ],
        insertions: [
          'Either party may terminate upon thirty (30) days\' written notice.',
          'Client covers committed third-party expenses and 10% wind-down fee on client convenience exit.'
        ]
      }
    },
    negotiationPoints: {
      clientPosition:
        '"An asymmetric zero-notice exit is non-negotiable and legally untenable. We require bilateral termination rights with at least 30 days notice for convenience and a 30-day cure period for cause."',
      compromisePosition:
        'Agree that client will compensate provider for non-cancellable third-party expenses incurred prior to notice of convenience termination, in exchange for full mutual exit rights.',
      walkawayThreshold:
        'Walk away immediately if provider insists on sole discretionary termination or denies client termination rights for cause.'
    },
    tunableOptions: [
      {
        id: 'convenienceNoticeDays',
        label: 'Convenience Notice Period',
        description: 'Advance written notice required for termination without cause.',
        type: 'select',
        defaultValue: 30,
        options: [
          { value: 14, label: '14 Days (Fast Track)' },
          { value: 30, label: '30 Days (Standard Market)' },
          { value: 60, label: '60 Days (Enterprise Enterprise)' }
        ]
      },
      {
        id: 'curePeriodDays',
        label: 'Material Breach Cure Period',
        description: 'Time granted to remedy a breach before termination takes effect.',
        type: 'select',
        defaultValue: 30,
        options: [
          { value: 15, label: '15 Days (Accelerated Cure)' },
          { value: 30, label: '30 Days (Standard Cure)' },
          { value: 45, label: '45 Days (Extended Cure)' }
        ]
      },
      {
        id: 'deliverableHandoff',
        label: 'Mandatory Deliverable Handoff',
        description: 'Explicit clause compelling transfer of all work product and data upon exit.',
        type: 'boolean',
        defaultValue: true
      }
    ],
    generateTunableText: (settings: Record<string, any>) => {
      const notice = settings.convenienceNoticeDays || 30;
      const cure = settings.curePeriodDays || 30;
      const handoff = settings.deliverableHandoff
        ? '\n(c) Wind-Down & Deliverables. Service Provider shall promptly deliver to Client all completed work product, partial deliverables, and Client materials. Client shall pay for services satisfactorily rendered up to the effective termination date.'
        : '';
      return `2. Term and Termination.\n(a) Termination for Convenience. Either party may terminate this Agreement without cause upon ${notice} calendar days' prior written notice to the other party.\n(b) Termination for Material Breach. Either party may terminate immediately upon written notice if the other party materially breaches any provision of this Agreement and fails to cure such breach within ${cure} days of receipt of written notice.${handoff}`;
    }
  },
  {
    id: 'clause-3-indemnity',
    number: 3,
    title: 'Indemnity',
    category: 'Liability & Risk Allocation',
    originalText:
      'The client shall be responsible for all losses, claims, damages, and expenses of any kind, regardless of their cause.',
    riskSeverity: 'Critical',
    riskSummary:
      'Catastrophic, unlimited strict liability clause making the client a blank-check insurer for the provider, even covering the provider’s own negligence, illegal acts, or internal failures.',
    ambiguities: [
      'Elimination of Proximate Cause: The phrase "regardless of their cause" completely severs the legal causation requirement, exposing the client to liability even when entirely faultless.',
      'Inclusion of Provider\'s Own Fault: Does not carve out provider\'s sole negligence, gross negligence, intentional misconduct, or statutory violations.',
      'Unbounded Direct vs. Third-Party Scope: Indemnity is traditionally meant to defend against third-party lawsuits; here, it could be misconstrued as an internal guarantee covering provider\'s operating losses.',
      'No Liability Ceiling: Uncapped and decoupled from contract fees, creating unlimited existential enterprise liability.',
      'Lack of Defense Procedures: Contains no requirement for prompt written notice, right to select defense counsel, or prohibition against unilateral settlements.'
    ],
    partyRisks: {
      client: [
        'Bankruptcy / Ruinous Exposure: Client could be billed for damages caused by the provider\'s own careless actions, software bugs, or third-party trademark infringement.',
        'Loss of Insurance Coverage: Most Commercial General Liability (CGL) and Errors & Omissions (E&O) insurance policies strictly exclude liability assumed under contract where liability would not exist under common law tort.',
        'No Control Over Legal Defense: Client has no statutory say in defense strategy or settlement amounts negotiated by provider.'
      ],
      provider: [
        'Judicial Invalidation (Public Policy): In many jurisdictions (e.g. California, New York, Texas), contracts that attempt to indemnify a party against its own gross negligence, willful misconduct, or strict liability violations are void as against public policy.',
        'Reputational & Deal-Breaking Friction: Including such aggressive indemnity creates instant distrust and red-flag escalation with corporate legal teams.'
      ]
    },
    legalDoctrines: [
      'Express Negligence Doctrine: Clauses purporting to indemnify a party for its own negligence must be stated in clear, unambiguous terms; even then, gross negligence cannot be indemnified.',
      'Third-Party Claims Limitation: Legitimate indemnification should be restricted to third-party claims, awards, and reasonable legal defense costs.',
      'Mutual Limitation of Liability (LoL) Interplay: Indemnity obligations must be balanced against or capped within an aggregate liability ceiling (e.g., 12 months fees paid).'
    ],
    balancedRedline:
      '3. Indemnification and Limitation of Liability.\n(a) Mutual Indemnification. Each party ("Indemnifying Party") shall defend, indemnify, and hold harmless the other party, its officers, and employees ("Indemnified Party") against third-party claims, suits, damages, and reasonable attorney fees arising out of: (i) the Indemnifying Party\'s gross negligence or willful misconduct; (ii) material breach of this Agreement; or (iii) infringement of third-party intellectual property rights by its deliverables or materials.\n(b) Exceptions. Neither party shall be liable to indemnify the other to the extent the claim results from the Indemnified Party\'s own negligence, unauthorized modifications, or misuse.\n(c) Indemnification Procedures. The Indemnified Party shall: (i) provide prompt written notice of any claim; (ii) grant the Indemnifying Party sole control over defense and settlement (with no settlement admitting liability without consent); and (iii) provide reasonable cooperation.',
    redlinePresets: {
      balanced: {
        name: 'Balanced Standard',
        label: 'Balanced (Mutual Third-Party & IP)',
        description: 'Bilateral indemnity for gross negligence, IP infringement, and material breach with strict procedural safeguards.',
        text:
          '3. Mutual Indemnification.\nEach party shall defend and indemnify the other party from and against third-party claims, liabilities, and reasonable legal fees arising directly from the indemnifying party\'s gross negligence, willful misconduct, or infringement of third-party intellectual property rights. Neither party shall indemnify for damages resulting from the other party\'s own fault. The indemnified party must provide prompt notice and allow control of defense.',
        deletions: ['The client shall be responsible for all losses, claims, damages, and expenses of any kind, regardless of their cause.'],
        insertions: [
          'Mutual indemnification for both parties.',
          'Limited to third-party claims arising directly from gross negligence, willful misconduct, or IP infringement.',
          'Carve-out for damages resulting from counterpart\'s own fault.',
          'Prompt notice and defense control procedural protections.'
        ]
      },
      clientProtective: {
        name: 'Client-Protective',
        label: 'Client-Favorable (Provider IP & Data Breach Indemnity)',
        description: 'Provider indemnifies client for deliverable defects, IP infringement, and data breaches; client liability capped strictly.',
        text:
          '3. Provider Indemnification of Client.\nService Provider shall defend, indemnify, and hold harmless Client against any and all claims, losses, liabilities, and expenses arising out of: (a) infringement of any patent, copyright, or trademark by the deliverables; (b) breach of data privacy or confidentiality; or (c) Service Provider\'s negligence or breach of contract. Client shall have no indemnification obligations under this Agreement.',
        deletions: ['The client shall be responsible for all losses, claims, damages, and expenses of any kind, regardless of their cause.'],
        insertions: [
          'Service Provider indemnifies Client for IP infringement, confidentiality/data breach, and negligence.',
          'Client bears zero indemnification obligations under this Agreement.'
        ]
      },
      providerProtective: {
        name: 'Provider-Protective',
        label: 'Provider-Favorable (Client Materials & Aggregate Cap)',
        description: 'Client indemnifies provider for client-provided content; both indemnities capped at total fees paid in last 12 months.',
        text:
          '3. Limited Indemnification.\nClient shall indemnify Service Provider against third-party claims arising from Client-supplied specifications, data, or materials. Provider liability for indemnity shall not exceed the total fees paid by Client under this Agreement in the twelve (12) months preceding the claim. Excludes indirect, punitive, or consequential damages.',
        deletions: ['regardless of their cause.'],
        insertions: [
          'Limited to third-party claims from Client-supplied materials.',
          'Liability capped at fees paid in preceding 12 months.',
          'Exclusion of consequential and punitive damages.'
        ]
      }
    },
    negotiationPoints: {
      clientPosition:
        '"An uncapped indemnity for \'all losses regardless of cause\' is an uninsurable strict liability guarantee. We require bilateral third-party indemnity limited to gross negligence, willful misconduct, and IP infringement with procedural controls."',
      compromisePosition:
        'Agree that each side indemnifies only for its own breaches and IP violations, with a clear carve-out for the other party\'s contributory negligence, and subject to an aggregate liability cap.',
      walkawayThreshold:
        'Never accept indemnity for the vendor\'s own negligence, direct (non-third-party) claims, or unbounded losses "regardless of cause".'
    },
    tunableOptions: [
      {
        id: 'indemnityScope',
        label: 'Indemnity Structure',
        description: 'Determine whether indemnity is bilateral or limited to specific risks.',
        type: 'select',
        defaultValue: 'mutual',
        options: [
          { value: 'mutual', label: 'Mutual (Both Parties Reciprocal)' },
          { value: 'providerOnly', label: 'Vendor-Only (Client Protected)' },
          { value: 'cappedMutual', label: 'Mutual + 12-Month Fee Cap' }
        ]
      },
      {
        id: 'faultThreshold',
        label: 'Fault Threshold Trigger',
        description: 'Legal standard required to trigger indemnification obligation.',
        type: 'select',
        defaultValue: 'gross_negligence',
        options: [
          { value: 'gross_negligence', label: 'Gross Negligence & Willful Misconduct (Standard)' },
          { value: 'negligence', label: 'Simple Negligence & Material Breach' }
        ]
      },
      {
        id: 'ipInfringement',
        label: 'Explicit IP Infringement Warranty & Defense',
        description: 'Include express defense against third-party patent/copyright claims.',
        type: 'boolean',
        defaultValue: true
      }
    ],
    generateTunableText: (settings: Record<string, any>) => {
      const scope = settings.indemnityScope || 'mutual';
      const fault =
        settings.faultThreshold === 'negligence'
          ? 'negligence, willful misconduct, or material breach'
          : 'gross negligence, willful misconduct, or intentional breach';
      const ip = settings.ipInfringement
        ? ' or (iii) infringement of any third-party intellectual property rights by its deliverables or provided materials.'
        : '.';

      if (scope === 'providerOnly') {
        return `3. Indemnification.\nService Provider shall defend, indemnify, and hold harmless Client and its officers from and against any third-party claims, damages, liabilities, and reasonable legal costs arising out of: (i) Service Provider's ${fault}${ip}\nClient shall provide prompt written notice and cooperate in the defense. In no event shall Client indemnify Service Provider.`;
      }

      const capText =
        scope === 'cappedMutual'
          ? '\n(c) Liability Cap. Each party\'s aggregate indemnification liability shall be capped at the total fees paid or payable by Client in the preceding twelve (12) months, excluding IP infringement claims.'
          : '';

      return `3. Mutual Indemnification.\n(a) Defense & Indemnity. Each party ("Indemnifying Party") shall defend, indemnify, and hold harmless the other party ("Indemnified Party") against third-party claims, liabilities, and reasonable attorney fees arising out of: (i) the Indemnifying Party's ${fault}; (ii) breach of confidentiality obligations;${ip}\n(b) Exclusions & Procedure. Neither party shall indemnify the other to the extent any claim is caused by the Indemnified Party's own fault. The Indemnified Party must provide prompt notice and allow control of defense.${capText}`;
    }
  },
  {
    id: 'clause-4-confidentiality',
    number: 4,
    title: 'Confidentiality',
    category: 'IP & Confidentiality',
    originalText:
      'The parties shall maintain the confidentiality of all confidential information. The agreement does not specify how long this obligation will continue.',
    riskSeverity: 'Medium',
    riskSummary:
      'Perpetual, undefined confidentiality obligation lacks definition of protected data, standard exclusions (e.g., publicly known information), standard of care, or return/destruction protocol.',
    ambiguities: [
      'Undefined "Confidential Information": Does not define what constitutes confidential information (e.g., written marking requirements, oral disclosure confirmation, trade secrets vs. general commercial data).',
      'Missing Duration / Survival Period: The draft explicitly notes that duration is unspecified. In practical law, silence could either mean perpetual (onerous) or terminating with the contract (insufficient).',
      'Omission of Standard Carve-Outs: Lacks customary exceptions (publicly available information, prior possession, independent development, lawful receipt from third party).',
      'No Standard of Care: Does not articulate whether parties must exercise "reasonable care" or the same degree of care used for their own sensitive information.',
      'Absence of Compelled Disclosure Protocol: No provisions allowing disclosure pursuant to court order or government subpoena with prior notice to the disclosing party.',
      'No Return or Destruction Mandate: Fails to dictate what happens to stored digital copies, backups, and physical notes upon agreement termination.'
    ],
    partyRisks: {
      client: [
        'Perpetual Compliance Burden: An open-ended duration creates infinite record-retention liabilities, complicating routine vendor transitions, audits, and cloud backups.',
        'Risk of Accidental Contamination: Without clear definition and marking rules, general feedback or business ideas might be retroactively claimed as confidential.'
      ],
      provider: [
        'Career / Knowledge Mobility Threat: Without explicit carve-outs for independent development or generalized skills, provider risks claims when serving other clients in the same industry.',
        'Vulnerability to Contempt for Legal Disclosures: Lacks legal safe harbor if compelled by regulatory subpoena or judicial discovery order.'
      ]
    },
    legalDoctrines: [
      'Standard Survival Terms: Commercial standard ranges from two (2) to five (5) years post-termination, with indefinite protection reserved solely for statutory trade secrets (Defend Trade Secrets Act / UTSA).',
      'Five Customary Exceptions: Information is not confidential if it is: (1) already public, (2) rightfully known prior to disclosure, (3) independently developed without access, (4) lawfully obtained from a third party, or (5) required to be disclosed by operation of law.',
      'Reasonable Degree of Care: Receiving parties must protect confidential data using at least the same degree of care as their own similar data, but no less than reasonable care.'
    ],
    balancedRedline:
      '4. Confidentiality.\n(a) Definition. "Confidential Information" means all non-public technical, business, or financial information disclosed by one party ("Discloser") to the other ("Recipient") that is marked as confidential or that reasonably should be understood to be confidential given its nature.\n(b) Standard of Care & Use. Recipient shall use the same degree of care it uses for its own confidential information (and no less than a reasonable standard of care) and shall not use or disclose Discloser\'s Confidential Information except to perform its obligations under this Agreement.\n(c) Exclusions. Confidential Information does not include information that: (i) is or becomes publicly known through no breach by Recipient; (ii) was already known to Recipient without confidentiality restriction; (iii) is independently developed without reference to Discloser\'s information; or (iv) is rightfully received from a third party without restriction.\n(d) Legally Compelled Disclosure. Recipient may disclose Confidential Information to the extent required by law or court order, provided prompt advance notice is given to Discloser where permitted.\n(e) Term of Obligation. These obligations shall survive for a period of three (3) years following the termination or expiration of this Agreement, except for trade secrets, which shall be maintained for so long as they remain protected under applicable law.\n(f) Return of Materials. Upon written request or termination, Recipient shall promptly return or certify destruction of all Confidential Information, subject to routine encrypted disaster recovery backups.',
    redlinePresets: {
      balanced: {
        name: 'Balanced Standard',
        label: 'Balanced (3-Year Survival & 5 Standard Carve-Outs)',
        description: 'Clear marking standard, standard 5 exclusions, legally compelled disclosure safe harbor, and 3-year term (perpetual for trade secrets).',
        text:
          '4. Confidentiality Obligations.\nEach party agrees to hold the other\'s Confidential Information in confidence using at least reasonable care, and not use or disclose it except to perform this Agreement. Excludes information that is public, previously known, independently developed, or rightfully obtained from third parties. These obligations survive for three (3) years post-termination, except for trade secrets which survive indefinitely. Upon termination, confidential files shall be returned or destroyed upon request.',
        deletions: ['The agreement does not specify how long this obligation will continue.'],
        insertions: [
          'Defined scope with reasonable standard of care.',
          'Standard exclusions for public information, prior knowledge, and independent development.',
          'Obligations survive for three (3) years post-termination (indefinitely for trade secrets).',
          'Return or destruction of materials upon termination.'
        ]
      },
      clientProtective: {
        name: 'Client-Protective',
        label: 'Client-Favorable (5-Year Survival + High Care)',
        description: 'Five-year survival, strict customer data protection, mandatory immediate return of all copies, and injunctive relief without bond.',
        text:
          '4. Client Confidentiality and Data Protection.\nService Provider shall safeguard Client Confidential Information with the highest degree of care. In no event shall Service Provider disclose or reverse engineer any Client data. Obligations shall survive for five (5) years following contract expiration (perpetually for trade secrets and customer data). Client shall be entitled to seek immediate injunctive relief without posting bond in case of breach.',
        deletions: ['The agreement does not specify how long this obligation will continue.'],
        insertions: [
          'Highest standard of care for Client data.',
          'Five (5) year survival period (perpetual for trade secrets and customer data).',
          'Express entitlement to injunctive relief without posting bond.'
        ]
      },
      providerProtective: {
        name: 'Provider-Protective',
        label: 'Provider-Favorable (2-Year Survival + Residuals Clause)',
        description: 'Two-year duration, strict written marking requirement, and explicit residuals clause protecting general skills and know-how.',
        text:
          '4. Mutual Confidentiality & Residuals.\nConfidential information must be designated in writing as "Confidential" at the time of disclosure. Obligation lasts for two (2) years from disclosure date. Nothing in this clause prevents Service Provider from using general skills, concepts, or know-how retained in intangible human memory ("Residuals Clause").',
        deletions: ['The agreement does not specify how long this obligation will continue.'],
        insertions: [
          'Strict written marking requirement.',
          'Two (2) year sunset from disclosure date.',
          'Residuals clause allowing use of retained general knowledge and skills.'
        ]
      }
    },
    negotiationPoints: {
      clientPosition:
        '"An undefined confidentiality clause provides zero predictability. We require explicit trade secret protection, clear definitions, standard exclusions, and at least a 3-year survival period."',
      compromisePosition:
        'Agree on 3 years survival for regular commercial confidential information, indefinite survival for trade secrets, and standard carve-outs for information required by court subpoena.',
      walkawayThreshold:
        'Reject any agreement that lacks exceptions for public information or court-ordered disclosure, or provides zero duration definition.'
    },
    tunableOptions: [
      {
        id: 'survivalYears',
        label: 'Survival Duration',
        description: 'Post-termination duration of confidentiality obligations.',
        type: 'select',
        defaultValue: 3,
        options: [
          { value: 2, label: '2 Years (Fast Moving / Tech)' },
          { value: 3, label: '3 Years (Market Standard)' },
          { value: 5, label: '5 Years (Enterprise / FinTech)' }
        ]
      },
      {
        id: 'tradeSecretPerpetual',
        label: 'Perpetual Trade Secret Protection',
        description: 'Keep trade secrets protected indefinitely for as long as they qualify by law.',
        type: 'boolean',
        defaultValue: true
      },
      {
        id: 'includeResiduals',
        label: 'Residual Knowledge Carve-Out',
        description: 'Permit use of general intangible ideas/skills retained in unprompted memory.',
        type: 'boolean',
        defaultValue: false
      }
    ],
    generateTunableText: (settings: Record<string, any>) => {
      const years = settings.survivalYears || 3;
      const tradeSecret = settings.tradeSecretPerpetual
        ? ', provided that trade secrets shall remain confidential for so long as they qualify as trade secrets under applicable law'
        : '';
      const residuals = settings.includeResiduals
        ? '\n(d) Residuals. Nothing herein shall preclude either party from using general ideas, concepts, or know-how retained in intangible human memory without reference to written confidential records.'
        : '';

      return `4. Confidentiality.\n(a) Definition & Standard. "Confidential Information" includes proprietary non-public information marked as confidential or reasonably understood as such. Each party shall use at least reasonable care to protect the other's Confidential Information.\n(b) Exclusions. Obligations shall not apply to information that is: (i) public; (ii) previously known; (iii) independently developed; (iv) received lawfully from a third party; or (v) required by law to be disclosed with reasonable notice.\n(c) Survival Term. These confidentiality obligations shall survive for ${years} years from the date of termination or expiration of this Agreement${tradeSecret}.${residuals}\n(d) Return of Materials. Upon written request, each party shall promptly return or certify destruction of all tangible copies of confidential information.`;
    }
  },
  {
    id: 'clause-5-dispute',
    number: 5,
    title: 'Dispute Resolution',
    category: 'Dispute & Governance',
    originalText:
      'Any disputes arising under this agreement shall be resolved according to applicable law.',
    riskSeverity: 'Medium',
    riskSummary:
      'Complete jurisdictional vacuum: lacks designated governing law, chosen forum, venue, dispute escalation ladder, or waiver of expensive jury trials.',
    ambiguities: [
      'Omission of Governing Law: "Applicable law" is a meaningless tautology that fails to identify a specific jurisdiction (e.g. State of Delaware, State of New York, England & Wales).',
      'Missing Forum & Venue: Does not specify which courts (state or federal) or arbitration tribunal hold jurisdiction, inviting "forum shopping" battles.',
      'No Structured Escalation Ladder: No requirement for initial good-faith executive negotiation or non-binding mediation before filing an expensive lawsuit.',
      'Silence on Dispute Mechanism: Leaves open whether disputes are litigated in court or submitted to binding arbitration (e.g., AAA, JAMS, ICC).',
      'Absence of Attorney Fee Shifting: Without an explicit prevailing party clause, each side must absorb heavy legal fees under the American Rule regardless of bad faith.',
      'No Emergency Injunctive Relief Exception: No carve-out allowing immediate court injunctions to halt ongoing IP infringement or confidentiality leaks.'
    ],
    partyRisks: {
      client: [
        'Multi-Jurisdictional Litigation: Risk of being sued in an inconvenient, distant, or unfamiliar foreign court with disadvantageous local procedural rules.',
        'Immediate Premature Lawsuits: Counterpart can file a lawsuit immediately without attempting a sensible business discussion between executives.'
      ],
      provider: [
        'Prolonged Conflict of Laws Disputes: Spending substantial legal retainers merely fighting over where the lawsuit should be heard before ever addressing substantive claims.',
        'Inability to Recover Legal Fees: Even when completely vindicated against an unjustified breach claim, provider cannot recover legal defense costs under the default American Rule.'
      ]
    },
    legalDoctrines: [
      'Choice of Law vs. Choice of Forum: Parties must separately designate which body of substantive law governs the contract and which judicial or arbitral body has exclusive jurisdiction.',
      'Stepped Dispute Resolution Ladder: Best practices employ a tiered ladder: 30-day good faith executive negotiation → non-binding mediation → binding arbitration or litigation.',
      'American Rule vs. Prevailing Party Fee Shifting: Under US law, each party pays its own attorney fees unless contractually modified; prevailing party clauses deter frivolous lawsuits.'
    ],
    balancedRedline:
      '5. Governing Law and Dispute Resolution.\n(a) Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without giving effect to any choice or conflict of law principles.\n(b) Informal Negotiation. Prior to initiating formal legal proceedings, the parties agree to make good-faith efforts to resolve any dispute through direct negotiations between designated senior executives for a period of at least thirty (30) calendar days following written notice of dispute.\n(c) Jurisdiction and Venue. Any legal action, suit, or proceeding arising out of or relating to this Agreement that is not resolved informally shall be instituted exclusively in the federal or state courts located in New Castle County, Delaware. Each party irrevocably consents to the personal jurisdiction and venue of such courts.\n(d) Equitable Relief. Notwithstanding the foregoing, either party may seek emergency injunctive or other equitable relief in any court of competent jurisdiction to protect its intellectual property or confidential information.\n(e) Attorney\'s Fees. In any formal action or proceeding to enforce the terms of this Agreement, the prevailing party shall be entitled to recover its reasonable attorney\'s fees and court costs from the non-prevailing party.',
    redlinePresets: {
      balanced: {
        name: 'Balanced Standard',
        label: 'Balanced (Delaware Law + Stepped Escalation + Prevailing Party)',
        description: 'Neutral Delaware law, 30-day executive discussion requirement, exclusive court venue, and prevailing party attorney fee recovery.',
        text:
          '5. Governing Law and Dispute Resolution.\nThis Agreement is governed by the laws of the State of Delaware without regard to conflict of laws principles. The parties shall first attempt to resolve disputes through 30 days of good-faith senior executive negotiations. If unresolved, disputes shall be submitted exclusively to state or federal courts in Delaware. The prevailing party shall be entitled to recover reasonable attorney fees and costs. Either party may seek emergency injunctive relief for IP or confidentiality breaches.',
        deletions: ['Any disputes arising under this agreement shall be resolved according to applicable law.'],
        insertions: [
          'Governed by Delaware law without conflict of laws principles.',
          '30-day good-faith senior executive negotiation requirement.',
          'Exclusive state or federal court jurisdiction in Delaware.',
          'Prevailing party attorney fees and costs recovery.',
          'Emergency injunctive relief carve-out for IP/confidentiality.'
        ]
      },
      clientProtective: {
        name: 'Client-Protective',
        label: 'Client-Favorable (Client\'s Home State + Mediation)',
        description: 'Governed by Client\'s principal place of business, mandatory mediation before suit, and jury trial waiver.',
        text:
          '5. Dispute Resolution and Governing Law.\nThis Agreement shall be governed by the laws of the state where Client maintains its principal corporate office. Any dispute shall first be submitted to mandatory mediation before a mutually agreed mediator. If mediation fails, exclusive venue shall reside in courts within Client\'s home county. The parties mutually waive any right to trial by jury.',
        deletions: ['Any disputes arising under this agreement shall be resolved according to applicable law.'],
        insertions: [
          'Governed by law of Client\'s principal corporate office state.',
          'Mandatory mediation requirement.',
          'Exclusive venue in Client\'s home county.',
          'Mutual waiver of jury trial.'
        ]
      },
      providerProtective: {
        name: 'Provider-Protective',
        label: 'Provider-Favorable (Binding AAA Arbitration)',
        description: 'Binding expedited AAA arbitration in provider\'s headquarters city, confidentiality of proceedings, and class-action waiver.',
        text:
          '5. Governing Law & Binding Arbitration.\nThis Agreement shall be governed by the laws of the State of New York. Any dispute shall be settled by binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules before a single arbitrator. Arbitration proceedings and awards shall remain strictly confidential. Each party waives the right to participate in any class action.',
        deletions: ['Any disputes arising under this agreement shall be resolved according to applicable law.'],
        insertions: [
          'Governed by the laws of the State of New York.',
          'Binding arbitration administered by the American Arbitration Association (AAA).',
          'Strict confidentiality of proceedings and class-action waiver.'
        ]
      }
    },
    negotiationPoints: {
      clientPosition:
        '"\'Applicable law\' invites multi-state jurisdictional squabbles. We require a specified governing law, local or neutral venue, and a mandatory 30-day executive discussion period before anyone files a complaint."',
      compromisePosition:
        'Choose a neutral, well-established corporate jurisdiction (such as Delaware or New York) with mutual consent to court venue, coupled with prevailing party fee shifting to deter bad-faith litigation.',
      walkawayThreshold:
        'Do not agree to an ambiguous dispute clause that could subject you to litigation in an unpredictable foreign jurisdiction without emergency injunctive relief protection.'
    },
    tunableOptions: [
      {
        id: 'governingJurisdiction',
        label: 'Governing Jurisdiction',
        description: 'Substantive state body of contract law.',
        type: 'select',
        defaultValue: 'Delaware',
        options: [
          { value: 'Delaware', label: 'Delaware (Corporate Standard)' },
          { value: 'New York', label: 'New York (Commercial Standard)' },
          { value: 'California', label: 'California (Tech Standard)' },
          { value: 'England & Wales', label: 'England & Wales (International)' }
        ]
      },
      {
        id: 'resolutionMethod',
        label: 'Dispute Mechanism',
        description: 'Forum for resolving non-negotiable formal disputes.',
        type: 'select',
        defaultValue: 'courts',
        options: [
          { value: 'courts', label: 'Exclusive Court Litigation' },
          { value: 'arbitration', label: 'Binding AAA Arbitration' }
        ]
      },
      {
        id: 'prevailingPartyFees',
        label: 'Prevailing Party Attorney Fees',
        description: 'Winner recovers reasonable legal fees and costs.',
        type: 'boolean',
        defaultValue: true
      }
    ],
    generateTunableText: (settings: Record<string, any>) => {
      const state = settings.governingJurisdiction || 'Delaware';
      const method = settings.resolutionMethod || 'courts';
      const fees = settings.prevailingPartyFees
        ? '\n(d) Attorney Fees. In any action to enforce this Agreement, the prevailing party shall be entitled to recover reasonable attorney fees and court costs.'
        : '';

      const forumText =
        method === 'arbitration'
          ? `(c) Binding Arbitration. If unresolved through negotiation, disputes shall be finally settled by binding arbitration in accordance with the Commercial Arbitration Rules of the American Arbitration Association (AAA) before a single arbitrator in ${state}.`
          : `(c) Exclusive Venue. The parties irrevocably submit to the exclusive jurisdiction and venue of the state and federal courts located in ${state}.`;

      return `5. Governing Law and Dispute Resolution.\n(a) Governing Law. This Agreement shall be governed by and construed in accordance with the laws of ${state}, without regard to conflicts of law principles.\n(b) Pre-Dispute Negotiation. The parties agree to attempt in good faith to resolve any dispute through discussions between senior executives for at least thirty (30) days prior to commencing formal legal proceedings.\n${forumText}${fees}\n(e) Injunctive Relief. Nothing herein shall prevent either party from seeking immediate equitable or injunctive relief from any court of competent jurisdiction to protect against unauthorized disclosure of confidential information or IP infringement.`;
    }
  }
];
