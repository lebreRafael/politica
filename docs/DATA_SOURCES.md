# Fontes de Dados para Transparência Política Brasileira

## 📊 APIs Oficiais do Governo

### 1. Câmara dos Deputados - Dados Abertos
**URL**: https://dadosabertos.camara.leg.br/
**Documentação**: https://dadosabertos.camara.leg.br/swagger/api.html

#### Endpoints Principais:
- **Deputados**: `/deputados`
- **Votações**: `/votacoes`
- **Proposições**: `/proposicoes`
- **Partidos**: `/partidos`
- **Comissões**: `/comissoes`

#### Limitações:
- Rate limiting: ~100 requests/minute
- Dados históricos limitados
- Algumas votações podem estar incompletas

#### Exemplo de Uso:
```bash
curl "https://dadosabertos.camara.leg.br/api/v2/deputados"
```

### 2. Senado Federal - Dados Abertos
**URL**: https://www.senado.leg.br/dados-abertos/
**API**: https://legis.senado.leg.br/dadosabertos

#### Endpoints Principais:
- **Senadores**: `/senador/lista/atual`
- **Votações**: `/votacao/senador/{id}`
- **Matérias**: `/materia/{id}`

#### Limitações:
- API menos estruturada que a da Câmara
- Dados em formato XML
- Documentação limitada

### 3. Portal da Transparência
**URL**: https://www.portaltransparencia.gov.br/
**API**: https://www.portaltransparencia.gov.br/api-de-dados

#### Dados Disponíveis:
- Gastos parlamentares
- Viagens oficiais
- Benefícios
- Patrimônio declarado

## 🔗 APIs de Terceiros

### 1. Dados Abertos Brasil
**URL**: https://dados.gov.br/
**Descrição**: Portal agregador de dados abertos do governo

### 2. Serenata de Amor
**URL**: https://serenata.ai/
**GitHub**: https://github.com/okfn-brasil/serenata-de-amor
**Descrição**: Projeto open-source que monitora gastos parlamentares

### 3. Politicos.org.br
**URL**: https://politicos.org.br/
**Descrição**: Base de dados de políticos brasileiros

### 4. Congresso em Números
**URL**: https://congressoemfoco.uol.com.br/congresso-em-numeros/
**Descrição**: Estatísticas e análises do Congresso

## 📈 Dados Adicionais

### 1. IBGE (Instituto Brasileiro de Geografia e Estatística)
**URL**: https://www.ibge.gov.br/
**Dados**: População por estado, indicadores socioeconômicos

### 2. TSE (Tribunal Superior Eleitoral)
**URL**: https://www.tse.jus.br/
**Dados**: Resultados eleitorais, estatísticas de votação

### 3. STF (Supremo Tribunal Federal)
**URL**: https://www.stf.jus.br/
**Dados**: Decisões sobre constitucionalidade de leis

## 🛠️ Estratégias de Implementação

### Fase 1: Dados Básicos
1. **Deputados e Senadores**
   - Lista completa com informações básicas
   - Fotos e dados de contato
   - Histórico de mandatos

2. **Votações Recentes**
   - Últimas 100 votações de cada parlamentar
   - Dados de presença e posicionamento

### Fase 2: Análise Avançada
1. **Padrões de Voto**
   - Análise de tendências
   - Comparação entre parlamentares
   - Identificação de blocos de voto

2. **Temas e Propostas**
   - Categorização por tema
   - Análise de impacto
   - Histórico de tramitação

### Fase 3: Funcionalidades Avançadas
1. **Alertas e Notificações**
   - Novas votações
   - Mudanças de posicionamento
   - Propostas de interesse

2. **Análise Preditiva**
   - Probabilidade de aprovação
   - Tendências futuras
   - Impacto eleitoral

## 🔧 Ferramentas de Desenvolvimento

### Web Scraping
- **Puppeteer**: Para sites sem API
- **Cheerio**: Para parsing HTML
- **Selenium**: Para sites dinâmicos

### Processamento de Dados
- **Python**: Pandas, NumPy
- **Node.js**: Axios, Cheerio
- **R**: Para análises estatísticas

### Armazenamento
- **PostgreSQL**: Dados estruturados
- **Redis**: Cache e sessões
- **Elasticsearch**: Busca avançada

## 📋 Checklist de Implementação

### [ ] Configuração Inicial
- [ ] Setup do projeto Next.js
- [ ] Configuração do banco de dados
- [ ] Implementação da API base

### [ ] Coleta de Dados
- [ ] Integração com API da Câmara
- [ ] Integração com API do Senado
- [ ] Sistema de cache e atualização

### [ ] Processamento
- [ ] Normalização de dados
- [ ] Cálculo de estatísticas
- [ ] Análise de padrões

### [ ] Interface
- [ ] Páginas de listagem
- [ ] Perfis detalhados
- [ ] Gráficos e visualizações

### [ ] Funcionalidades
- [ ] Sistema de busca
- [ ] Filtros avançados
- [ ] Comparações

## ⚠️ Considerações Legais

### Uso de Dados
- Dados oficiais são de domínio público
- Respeitar rate limits das APIs
- Atribuir fontes adequadamente

### Privacidade
- Não coletar dados pessoais desnecessários
- Respeitar LGPD
- Implementar políticas de privacidade

### Responsabilidade
- Verificar acurácia dos dados
- Manter transparência sobre fontes
- Permitir correções de usuários

## 🚀 Próximos Passos

1. **Validação das APIs**
   - Testar endpoints principais
   - Verificar qualidade dos dados
   - Identificar limitações

2. **Prototipagem**
   - Criar MVP com dados básicos
   - Testar com usuários reais
   - Iterar baseado no feedback

3. **Escalabilidade**
   - Implementar sistema de cache
   - Otimizar consultas
   - Preparar para crescimento

## 📞 Contatos Úteis

- **Câmara dos Deputados**: dadosabertos@camara.leg.br
- **Senado Federal**: dadosabertos@senado.leg.br
- **Portal da Transparência**: ouvidoria@cgugov.br

---

*Este documento será atualizado conforme novas fontes de dados sejam descobertas ou APIs sejam modificadas.* 