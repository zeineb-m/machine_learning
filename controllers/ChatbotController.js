import axios from 'axios';

export const askChatbot = async (req, res) => {
  const { message } = req.body;


  const accountingKeywords = [

    "bonjour","bilan", "facture", "comptable", "fiscal", "tva", "impôt", "charges", "budget",
    "écriture", "journal", "déclaration", "gestion", "exercice", "résultat",
    "plan comptable", "trésorerie", "amortissement", "comptabilité", "finance",
    "dépenses", "recettes", "passif", "actif", "immobilisation", "livre comptable",
    "audit", "contrôle", "revenu", "analyse financière", "soldes", "bénéfice", "perte",
    "documents fiscaux", "débit", "crédit", "fournisseur", "client", "numéro de compte",
    "banque", "fiche de paie", "charges sociales", "cotisation", "régularisation",
    "TVA collectée", "TVA déductible", "marge", "report à nouveau", "évaluation",
    "note de frais", "trimestre", "mensualité", "livraison", "provision",
    "gestion financière", "trésorerie prévisionnelle", "comptabilité analytique",
    "planification", "rapprochement bancaire", "bulletin de paie", "livre de comptes",
    "centre de coût", "immobilisations corporelles", "immobilisations incorporelles",
    "capitaux propres", "fonds de roulement", "charges fixes", "charges variables",
    "flux de trésorerie", "coût de revient", "situation comptable", "journal des ventes",
    "journal des achats", "stock", "bilan comptable", "rentabilité", "provision pour charges",
  
 
    "balance sheet", "invoice", "accountant", "tax", "vat", "income tax", "expenses",
    "budget", "journal entry", "ledger", "statement", "financial year", "profit", "loss",
    "chart of accounts", "cash flow", "depreciation", "accounting", "finance", "payroll",
    "revenue", "assets", "liabilities", "amortization", "bookkeeping", "audit", "control",
    "income", "financial analysis", "equity", "gain", "losses", "fiscal documents",
    "debit", "credit", "supplier", "customer", "account number", "bank", "pay slip",
    "social charges", "contribution", "adjustment", "collected VAT", "deductible VAT",
    "margin", "retained earnings", "valuation", "expense report", "quarter",
    "monthly payment", "delivery", "provision", "financial management", "cash forecast",
    "fixed assets", "cost accounting", "planning", "bank reconciliation", "payslip",
    "cost center", "book of accounts", "general ledger", "trial balance", "gross margin",
    "net income", "dividend", "tax return", "account reconciliation", "internal control",
    "financial reporting", "intangible assets", "tangible assets", "working capital",
    "break-even point", "payable", "receivable", "inventory", "purchase ledger",
    "sales ledger", "profitability"
  ];
  


  const isAccountingRelated = accountingKeywords.some(keyword =>
    message.toLowerCase().includes(keyword)
  );

  if (!isAccountingRelated) {
    return res.json({
      reply: "Je suis un assistant spécialisé dans la gestion comptable. Veuillez poser une question liée à ce domaine.",
    });
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Chatbot-Comptable',
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Erreur avec OpenRouter.' });
  }
};
