/**
 * ---------------------------------------------------------------
 *  LEITOR DE CURRÍCULOS
 *  Lê o texto de dentro do arquivo (PDF ou Word) e tenta descobrir
 *  nome, e-mail, telefone, cidade e cargo do candidato.
 *
 *  Roda inteiro no navegador — os arquivos não passam por servidor
 *  nenhum além do seu próprio Supabase.
 * ---------------------------------------------------------------
 */

export type DadosExtraidos = {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  cargo_atual: string;
  linkedin: string;
  texto: string;
  confianca: "alta" | "media" | "baixa";
};

/* ----------------------- LEITURA DOS ARQUIVOS ----------------------- */

async function lerPdf(arquivo: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const buffer = await arquivo.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;

  let texto = "";
  const limite = Math.min(pdf.numPages, 5); // 5 páginas bastam
  for (let i = 1; i <= limite; i++) {
    const pagina = await pdf.getPage(i);
    const conteudo = await pagina.getTextContent();
    texto +=
      conteudo.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ") + "\n";
  }
  return texto;
}

async function lerWord(arquivo: File): Promise<string> {
  const mammoth = await import("mammoth");
  const buffer = await arquivo.arrayBuffer();
  const r = await mammoth.extractRawText({ arrayBuffer: buffer });
  return r.value;
}

/* ------------------------- RECONHECIMENTO --------------------------- */

const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

// Palavras que aparecem em currículos mas nunca são nome de pessoa
const NAO_E_NOME = new RegExp(
  [
    "curr[ií]culo", "curriculum", "vitae", "dados\\s+pessoais",
    "informa[çc][õo]es", "contato", "perfil", "resumo", "objetivo",
    "experi[êe]ncia", "forma[çc][ãa]o", "escolaridade", "qualifica",
    "habilidade", "compet[êe]ncia", "idioma", "refer[êe]ncia",
    "endere[çc]o", "telefone", "e-?mail", "celular", "whatsapp",
    "linkedin", "nascimento", "estado\\s+civil",
  ].join("|"),
  "i",
);

const PALAVRAS_CARGO = new RegExp(
  [
    "assistente", "auxiliar", "analista", "coordenador", "gerente",
    "diretor", "supervisor", "t[ée]cnico", "operador", "vendedor",
    "atendente", "recepcionista", "motorista", "desenvolvedor",
    "programador", "engenheiro", "advogado", "contador", "enfermeir",
    "professor", "estagi[áa]rio", "consultor", "secret[áa]ri",
    "estoquista", "repositor", "soldador", "eletricista", "mec[âa]nico",
    "cozinheir", "gar[çc]om", "porteiro", "zelador",
  ].join("|"),
  "i",
);

function limpar(t: string) {
  return t.replace(/\s+/g, " ").trim();
}

function acharEmail(texto: string) {
  const m = texto.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  if (!m) return "";
  // descarta e-mails de exemplo/imagem
  const bom = m.find(
    (e) => !/exemplo|example|seuemail|email@|@email\.|\.png|\.jpg/i.test(e),
  );
  return (bom ?? m[0]).toLowerCase();
}

function acharTelefone(texto: string) {
  const padroes = [
    /\(?\d{2}\)?\s?9\s?\d{4}[-\s]?\d{4}/g, // celular com DDD
    /\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4}/g,   // fixo/celular
  ];
  for (const p of padroes) {
    const m = texto.match(p);
    if (m) {
      for (const bruto of m) {
        const so = bruto.replace(/\D/g, "");
        // 10 ou 11 dígitos e não pode ser CPF/CEP/data
        if (so.length >= 10 && so.length <= 11 && !/^0{3}/.test(so)) {
          if (so.length === 11) {
            return `(${so.slice(0, 2)}) ${so.slice(2, 7)}-${so.slice(7)}`;
          }
          return `(${so.slice(0, 2)}) ${so.slice(2, 6)}-${so.slice(6)}`;
        }
      }
    }
  }
  return "";
}

function acharNome(texto: string, nomeArquivo: string) {
  const linhas = texto
    .split("\n")
    .map(limpar)
    .filter(Boolean)
    .slice(0, 15);

  // 1) Depois de um rótulo "Nome:"
  const rotulo = texto.match(/nome\s*(?:completo)?\s*[:\-]\s*([^\n]{4,60})/i);
  if (rotulo) {
    const c = limpar(rotulo[1]);
    if (c.split(" ").length >= 2 && !NAO_E_NOME.test(c)) return titulo(c);
  }

  // 2) Primeiras linhas: 2 a 5 palavras, só letras, sem cara de cargo
  for (const linha of linhas) {
    if (linha.length < 5 || linha.length > 60) continue;
    if (NAO_E_NOME.test(linha)) continue;
    if (/\d|@/.test(linha)) continue;
    // "Vendedora - Loja XYZ" é cargo/empresa, não nome de pessoa
    if (PALAVRAS_CARGO.test(linha)) continue;
    if (/[-–|,\/•:]/.test(linha)) continue;
    if (/\b(ltda|s\.?a\.?|me|epp|eireli|loja|empresa|comercio|com[ée]rcio)\b/i.test(linha))
      continue;

    const palavras = linha.split(" ").filter(Boolean);
    if (palavras.length < 2 || palavras.length > 5) continue;

    const soLetras = palavras.every((p) =>
      /^[A-Za-zÀ-ÿ'.-]+$/.test(p),
    );
    if (soLetras) return titulo(linha);
  }

  // 3) Último recurso: o nome do arquivo
  const doArquivo = nomeArquivo
    .replace(/\.[^.]+$/, "")
    .replace(/(curr[ií]culo|curriculum|cv|resume)/gi, "")
    .replace(/[_\-.]+/g, " ")
    .replace(/\d/g, "");
  const c = limpar(doArquivo);
  if (c.split(" ").filter(Boolean).length >= 2) return titulo(c);

  return "";
}

function titulo(t: string) {
  const minusculas = ["de", "da", "do", "das", "dos", "e"];
  return t
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((p, i) =>
      i > 0 && minusculas.includes(p) ? p : p.charAt(0).toUpperCase() + p.slice(1),
    )
    .join(" ");
}

function acharCidadeEstado(texto: string) {
  // "Belo Horizonte - MG" / "Belo Horizonte/MG"
  const m = texto.match(
    /([A-ZÀ-Ý][a-zà-ÿ]+(?:\s+(?:de|do|da|dos|das)?\s*[A-ZÀ-Ý]?[a-zà-ÿ]+){0,3})\s*[-–\/,]\s*(A[CLPM]|BA|CE|DF|ES|GO|MA|M[TSG]|P[ABREI]|R[JNSOR]|S[CPE]|TO)\b/,
  );
  if (m) return { cidade: limpar(m[1]), estado: m[2].toUpperCase() };

  const uf = texto.match(/\b(?:UF|estado)\s*[:\-]\s*([A-Z]{2})\b/i);
  if (uf && UFS.includes(uf[1].toUpperCase())) {
    return { cidade: "", estado: uf[1].toUpperCase() };
  }
  return { cidade: "", estado: "" };
}

function acharCargo(texto: string) {
  const rotulo = texto.match(
    /(?:cargo|fun[çc][ãa]o|objetivo|[áa]rea de interesse)\s*[:\-]\s*([^\n]{3,50})/i,
  );
  if (rotulo) return titulo(limpar(rotulo[1]));

  for (const linha of texto.split("\n").map(limpar).slice(0, 20)) {
    if (linha.length > 4 && linha.length < 50 && PALAVRAS_CARGO.test(linha)) {
      if (!/@|\d{4}/.test(linha)) return titulo(linha);
    }
  }
  return "";
}

function acharLinkedin(texto: string) {
  const m = texto.match(/(?:linkedin\.com\/in\/|linkedin:\s*)([\w-]{3,})/i);
  return m ? `linkedin.com/in/${m[1]}` : "";
}

/* --------------------------- FUNÇÃO PRINCIPAL ----------------------- */

export async function extrairDoArquivo(arquivo: File): Promise<DadosExtraidos> {
  const ext = (arquivo.name.split(".").pop() ?? "").toLowerCase();

  let texto = "";
  try {
    if (ext === "pdf") texto = await lerPdf(arquivo);
    else if (ext === "docx" || ext === "doc") texto = await lerWord(arquivo);
  } catch {
    texto = ""; // imagem ou arquivo protegido: preenche na mão
  }

  const email = acharEmail(texto);
  const nome = acharNome(texto, arquivo.name);
  const telefone = acharTelefone(texto);
  const { cidade, estado } = acharCidadeEstado(texto);

  // Confiança: quanto mais campos achou, mais confiável
  let pontos = 0;
  if (nome) pontos += 2;
  if (email) pontos += 2;
  if (telefone) pontos += 1;
  const confianca = pontos >= 4 ? "alta" : pontos >= 2 ? "media" : "baixa";

  return {
    nome,
    email,
    telefone,
    cidade,
    estado,
    cargo_atual: acharCargo(texto),
    linkedin: acharLinkedin(texto),
    texto: texto.slice(0, 4000),
    confianca,
  };
}
