// Rebuild the portfolio demo from the actual application, with a local-only
// adapter. Never copy environment files or contact the real provider.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.resolve(process.argv[2]||path.join(root,'..','lead-local'));
const require=createRequire(path.join(source,'package.json'));
const {build}=require('esbuild');
const out=path.join(root,'projects','lead-local');
let page=await fs.readFile(path.join(source,'app','page.tsx'),'utf8');
function replaceOnce(before,after){if(!page.includes(before))throw Error('Source changed; review demo adapter: '+before.slice(0,100));page=page.replace(before,after);}
function replaceRange(start,end,replacement){const a=page.indexOf(start),b=page.indexOf(end,a);if(a<0||b<0)throw Error('Source changed; review adapter markers.');page=page.slice(0,a)+replacement+page.slice(b);}
replaceOnce("const historyKey='lead-local:leads:v1', shortlistKey='lead-local:shortlist:v2';","const historyKey='portfolio:lead-local:demo:leads', shortlistKey='portfolio:lead-local:demo:shortlist';");
page=page.replaceAll('lead-local:brand','portfolio:lead-local:demo:brand').replaceAll('/brand/${brand}.png','./brand/${brand}.png').replaceAll('/brand/${b}.png','./brand/${b}.png');
replaceOnce('<a href="/" className="brand">','<a href="../../" className="brand" aria-label="Voltar ao portfólio">');
replaceOnce("[region,setRegion]=useState('')","[region,setRegion]=useState('Brodowski, SP')");
replaceRange('  function requireKey()', '  async function discover(', `  function requireKey(){return true;}
  async function post<T>(route:string,body:unknown,_signal:AbortSignal):Promise<T>{
    if(route!=='/api/discover')throw Error('Esta demonstração não utiliza APIs.');
    const input=body as {niches:string;region:string;limit:number};
    const categories=input.niches.split(',').map(s=>s.trim()).filter(Boolean);
    const data={prospects:demoProspects.map((p,i)=>({...p,id:'demo-'+i,
      niche:categories[i%categories.length]||p.niche,city:input.region+' · exemplo fictício',
      name:['Horizonte Local','Espaço Acolher','Ponto do Bairro'][i]+' · fictício',
      opportunity:'Uma página para apresentar os serviços e facilitar o primeiro contato.',
      evidence:'Empresa fictícia para explorar a interface. Nenhuma busca ou verificação foi realizada.',
      contact:'Contato ilustrativo · não enviar mensagens',sources:[],demo:true})).slice(0,input.limit),
      excluded:[],warnings:['Demonstração com dados fictícios. Nichos e região personalizam o exemplo, sem pesquisar empresas reais.'],sources:[],searchedAt:new Date().toISOString()};
    return data as T;
  }
`);
replaceRange('    if(p.demo){','    const existing=',`    if(p.demo){setCurrent({id:p.id,name:p.name,address:p.city,status:'Exemplo',created:new Date().toISOString(),demo:true,dossier:{...demo,
      business:p.name,summary:'Exemplo fictício para explorar o fluxo do Lead Local. Nenhuma pesquisa real foi realizada.',
      facts:['Empresa, contatos e localização são fictícios nesta demonstração.'],
      uncertainties:['No sistema completo, confirme os dados e o contato antes de abordar.'],opportunities:[p.opportunity],
      approach:\`Oi! Tudo bem? Sou o \${seller||'Thiago'}. Tive uma ideia de página pra mostrar os serviços de vocês e facilitar o contato. Posso te mostrar?\`,
      presentation:'Nós criamos páginas simples com os serviços e o contato do negócio. A pessoa encontra o que precisa e chama vocês direto. Querem ver uma ideia?',
      valuePlan:'A ideia é reunir os serviços, a localização e o contato numa página fácil de abrir pelo celular. Podemos começar pelo essencial. Faz sentido pra vocês?',
      questions:['Qual serviço vocês querem destacar?','Como os clientes chegam até vocês hoje?','Quem pode aprovar o conteúdo e as fotos?'],
      landingPrompt:\`Crie uma landing page para \${p.name}, negócio fictício do nicho \${p.niche}. Objetivo: apresentar serviços e facilitar contato. Não invente depoimentos, preços, endereço, telefone ou credenciais. Use [CONFIRMAR] para pendências. Estruture hero com CTA, serviços confirmados, apresentação, localização e contato. Priorize celular, acessibilidade, contraste, SEO básico e desempenho. Nenhum formulário deve simular envio. Mostre as pendências antes de publicar.\`
    }});return;}
`);
replaceOnce("if(current.demo){setPlan({...demoPreview,headline:current.name==='Patas & Companhia'?demoPreview.headline:'Conheça nosso espaço. Vamos conversar?',services:demoPreview.services});return;}","if(current.demo){setPlan({...demoPreview,headline:'Conheça nosso espaço. Vamos conversar?',subheading:'Uma ideia de página para apresentar os serviços e facilitar o primeiro contato.',services:demoPreview.services});return;}");
replaceOnce('<div className="content">','<div className="content"><div className="demo-banner"><span><strong>Demonstração interativa</strong> · Dados fictícios, sem pesquisa real ou uso de API.</span><a href="../../">Voltar ao portfólio ↗</a></div>');
replaceRange('<button onClick={()=>setSettings(true)} className="connection">','</header>', '<a className="connection" href="https://lead-local.thalc.chatgpt.site" target="_blank" rel="noreferrer">Abrir sistema completo <ArrowUpRight size={14}/></a>');
replaceOnce('Sua chave fica só nesta sessão. As consultas usam a cota do seu Gemini.','Exemplo fictício. Nenhuma chave, consulta externa ou consumo de cota.');
replaceOnce('Site não encontrado é uma pista, não uma certeza. Confirme com o responsável antes de propor.','Dados demonstrativos. No sistema completo, revise as fontes e confirme se o negócio já tem site.');
replaceOnce('A IA propõe textos e cores. Você recebe uma imagem de página, pronta para baixar e apresentar como conceito.','No sistema completo, a IA propõe textos e cores. Aqui você pode editar e baixar uma prévia fictícia com o mesmo formato.');
replaceRange('<p>Conecte o Gemini para pesquisar negócios','<label htmlFor="seller">','<p>Esta é a demonstração pública do Lead Local. Personalize o nome e explore as seis opções de identidade. Não solicitamos API keys.</p>');
replaceOnce('<button className="text-button" onClick={()=>setApiKey(\'\')}>Desconectar</button>','<a className="text-button" href="../../">Voltar ao portfólio</a>');
replaceOnce('A chave não é salva nem enviada ao GitHub. Ao recarregar, conecte novamente.','Esta demonstração não solicita chaves e não envia dados ao Gemini.');
replaceOnce('Explorar exemplo sem usar a chave','Explorar exemplo fictício');
if(page.includes('const r=await fetch(')||page.includes('id="gemini-key"'))throw Error('Provider or key input leaked into demo.');
const bundled=await build({stdin:{contents:page+`\nimport {createRoot} from 'react-dom/client';createRoot(document.getElementById('root')!).render(<Page/>);`,resolveDir:source,sourcefile:'portfolio-demo.tsx',loader:'tsx'},bundle:true,write:false,format:'esm',platform:'browser',target:['es2022'],minify:true,jsx:'automatic',alias:{'@':source},define:{'process.env.NODE_ENV':'"production"'},legalComments:'inline'});
const js=bundled.outputFiles[0].text;
const preflight=await fs.readFile(path.join(source,'node_modules','tailwindcss','preflight.css'),'utf8');
const css=preflight+'\n'+(await fs.readFile(path.join(source,'app','globals.css'),'utf8')).replace('@import "tailwindcss";','')+`
.demo-banner{display:flex;gap:16px;justify-content:space-between;align-items:center;margin-bottom:27px;padding:12px 15px;background:#e7eddf;border:1px solid #d6dfcc;border-radius:10px;font-size:11px;color:#53684c}.demo-banner a{white-space:nowrap;text-decoration:underline}.demo-banner strong{color:#286b54}@media(max-width:580px){.demo-banner{align-items:flex-start;flex-direction:column;gap:6px;font-size:10px}}
`;
const stamp=createHash('sha256').update(js+css).digest('hex').slice(0,12);
await fs.mkdir(path.join(out,'brand'),{recursive:true});
for(let i=1;i<=6;i++)await fs.copyFile(path.join(source,'public','brand',`A${i}.png`),path.join(out,'brand',`A${i}.png`));
await fs.writeFile(path.join(out,'demo.js'),js);
await fs.writeFile(path.join(out,'styles.css'),css);
await fs.writeFile(path.join(out,'index.html'),`<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lead Local · Demonstração | Thiago Alcarás</title><meta name="description" content="Explore o design atual do Lead Local: descoberta por nicho e região, mensagens humanas e prévia de site em PNG. Demonstração com dados fictícios, sem API."><link rel="icon" href="./brand/A1.png"><link rel="stylesheet" href="./styles.css?v=${stamp}"></head><body><div id="root"><p style="padding:32px;font-family:Arial,sans-serif">Carregando a demonstração do Lead Local…</p></div><noscript><p>Ative o JavaScript para explorar o exemplo interativo. <a href="../../">Voltar ao portfólio</a>.</p></noscript><script type="module" src="./demo.js?v=${stamp}"></script></body></html>\n`);
await fs.writeFile(path.join(out,'README.md'),`# Demonstração pública do Lead Local\n\nInterface derivada do projeto Lead Local, com adaptador local e dados fictícios. Sem API, chave ou chamadas ao Gemini. Imagens originais do cão reaproveitadas sem edição.\n\nPara sincronizar após mudanças no aplicativo, com Node 22+ e dependências do Lead Local instaladas:\n\n\`\`\`sh\nnode scripts/sync-lead-local-demo.mjs ../lead-local\n\`\`\`\n\nO adaptador falha se os marcadores esperados mudarem, para exigir revisão em vez de publicar uma integração incorreta. O bundle React inclui as notificações de licença de dependências.\n\nVersão dos assets: ${stamp}.\n`);
console.log(`Lead Local demo synchronized: ${stamp} (${Math.round(js.length/1024)} KB JS)`);
