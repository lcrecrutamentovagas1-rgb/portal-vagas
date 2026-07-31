# 🆕 Duas novidades: nomes e ranking de candidatos

---

# 1️⃣ Currículos com nome de arquivo bagunçado

## O problema que você encontrou

O currículo da Pamela chegou como:

```
04-07-2025 14-21-29.ANEXE SEU CURRÍCULO-.172329
```

O sistema antigo tentava tirar o nome do arquivo e produzia lixo:

| Nome do arquivo | Antes ❌ | Agora ✅ |
|---|---|---|
| `04-07-2025...ANEXE SEU CURRÍCULO...` | "Anexe Seu" | *(vazio — não inventa)* |
| `documento_scan_0001.pdf` | "Documento Scan" | *(vazio)* |
| `WhatsApp Image 2025-07-04 at...` | "Whatsapp Image At" | *(vazio)* |
| `Curriculo_Ana_Paula_Costa.docx` | Ana Paula Costa | Ana Paula Costa |

## O que mudei

**a) Filtro de palavras de sistema.** O leitor agora reconhece e descarta
palavras como *anexe, seu, documento, scan, whatsapp, screenshot, image,
formulário, resposta* — além de datas, horas e números.

**b) Só aceita se parecer nome de verdade.** Precisa ter de 2 a 5 palavras,
cada uma com vogal e tamanho plausível. **Se não parecer nome, deixa em
branco** em vez de inventar. É melhor um campo vazio (que você preenche) do
que um nome errado no banco.

**c) 🌟 Busca o nome perto do e-mail (novidade).** Esta é a que resolve o seu
caso. Mesmo com o arquivo sem nome, se dentro do currículo existir:

```
Pamela Joana Rosa
pamela.rosa@gmail.com
```

...o sistema encontra **"Pamela Joana Rosa"** — olhando a linha do e-mail e as
vizinhas.

### Testei com 9 casos reais

Os 5 arquivos-lixo agora ficam **vazios** (sem inventar), os 4 com nome real
funcionam, e o caso da Pamela é reconhecido pelo texto interno. ✅

> 💡 **Na prática:** ao importar, os que ficarem sem nome aparecem com o campo
> em **vermelho**. Você abre o currículo, vê o nome e digita. São poucos
> segundos por candidato, e o dado fica correto.

---

# 2️⃣ 🏆 Melhores candidatos para cada vaga

Sim, dá para fazer! Criei um sistema que **lê todos os currículos e ordena os
candidatos** por compatibilidade com a vaga.

## Como usar

1. Vá em **`/admin/vagas`**
2. Na vaga desejada, clique no botão verde **🏆 Melhores candidatos**

Você verá a lista **ordenada do melhor para o pior**, com:

- 🥇 Posição no ranking
- 📊 Barra de compatibilidade (0 a 100%)
- ✅ **A favor:** o que contou pontos
- ⚠️ **Atenção:** o que faltou
- 🏷️ Os termos da vaga encontrados no currículo
- 📄 Botão para abrir o currículo e falar por WhatsApp

## Como a nota é calculada

| Critério | Peso | O que olha |
|---|---|---|
| **Palavras-chave** | 50 pts | Termos da vaga que aparecem no currículo |
| **Cargo** | 20 pts | Cargo do candidato x título da vaga |
| **Área** | 15 pts | Mesma área profissional |
| **Localização** | 15 pts | Mesma cidade / estado (remoto = ok) |

Ainda avisa se a **pretensão salarial** passa do teto da vaga.

## Inclui o banco de talentos

Por padrão o ranking analisa **os inscritos na vaga + todos os currículos
importados**. Assim, alguém que mandou currículo meses atrás pode ser o ideal
para a vaga de hoje.

Dá para alternar com o botão **"Ver só os inscritos"**.

## Exemplo real (testado)

Para uma vaga de *Auxiliar Administrativo em BH*:

```
1. 🏆 Experiência na área + mesma cidade    ████████████████████ 100%
      ✓ 15 termos batem | cargo combina | mesma área | mesma cidade

2.    Boa, mas de outra cidade              █████████████████░░░  83%
      ✓ 10 termos batem | cargo combina | mesmo estado

3.    PDF escaneado (sem texto)             ████████░░░░░░░░░░░░  40%
      ⚠ currículo sem texto legível

4.    Soldador (área diferente)             ███░░░░░░░░░░░░░░░░░  15%
      ⚠ área diferente
```

---

## ⚠️ Os limites — leia antes de confiar na nota

Vou ser honesto sobre o que este sistema **não** é:

**❌ Não é inteligência artificial.** Ele compara palavras. Não entende
contexto, não avalia caráter, não mede potencial.

**❌ Não sabe ler PDF escaneado.** Currículo que é foto fica com nota baixa
**mesmo sendo excelente** — o sistema simplesmente não consegue ler. Por isso
limito a nota desses a 40% e mostro o aviso, para você não descartar por
engano.

**❌ Pode favorecer quem escreve bonito.** Um candidato que usa as mesmas
palavras do anúncio pontua mais que outro igualmente capaz, mas com currículo
enxuto.

**✅ O que ele é:** um jeito de não começar do zero quando chegam 200
currículos. Ele organiza a fila — **você decide**.

### Minha recomendação

- Use a nota para **escolher por onde começar a ler**
- **Sempre abra o currículo** dos melhores antes de decidir
- Dê uma olhada nos de nota baixa que tenham o aviso *"sem texto legível"*
- Nunca descarte alguém só pelo número

> ⚖️ Além de justo, isso protege você: decisão de contratação baseada só em
> automação pode gerar problema legal e injustiça real.

---

## 📦 Como colocar no ar

Baixe o **`portal-vagas-completo.zip`** atualizado e envie para o GitHub
(mesmo processo do `COMO-USAR-O-ZIP.md`).

**Arquivos novos desta atualização:**
- `src/lib/compatibilidade.ts` — o cálculo da nota
- `src/components/ListaRankeada.tsx` — a tela do ranking
- `src/app/admin/vagas/[id]/candidatos/page.tsx` — a página

**Alterados:**
- `src/lib/extrair-dados.ts` — leitura de nomes melhorada
- `src/app/admin/vagas/page.tsx` — botão "Melhores candidatos"

> ℹ️ **Não precisa mexer no banco de dados** desta vez. O ranking usa o texto
> que já é guardado na importação.
