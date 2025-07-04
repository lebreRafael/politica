# Política - Transparência Eleitoral

Um site focado em facilitar (resumir, priorizar e organizar) informações sobre eleições para o cidadão comum que não tem tempo de estudar política a fundo.

## 🎯 Objetivo

Criar uma ferramenta transparente que mostre todos os candidatos ao Congresso brasileiro e cada voto que fizeram em mandatos anteriores/atuais. Incluindo todas as propostas que votaram a favor, contra ou se abstiveram.

## 📊 Fontes de Dados Disponíveis

### APIs Oficiais do Governo

- **Portal da Transparência**: https://www.portaltransparencia.gov.br/
- **Dados Abertos da Câmara**: https://dadosabertos.camara.leg.br/
- **Dados Abertos do Senado**: https://www.senado.leg.br/dados-abertos/
- **API da Câmara dos Deputados**: https://dadosabertos.camara.leg.br/swagger/api.html

### APIs de Terceiros

- **Dados Abertos Brasil**: https://dados.gov.br/
- **Serenata de Amor**: https://serenata.ai/
- **Politicos.org.br**: https://politicos.org.br/

## 🏗️ Arquitetura Proposta

### Frontend

- **Framework**: Next.js com TypeScript
- **UI**: Tailwind CSS + Headless UI
- **Gráficos**: Chart.js ou D3.js
- **Estado**: Zustand ou Redux Toolkit

### Backend

- **API**: Node.js com Express ou Fastify
- **Banco de Dados**: PostgreSQL
- **Cache**: Redis
- **Scraping**: Puppeteer ou Cheerio

### Infraestrutura

- **Deploy**: Vercel (frontend) + Railway/Render (backend)
- **Monitoramento**: Sentry
- **Analytics**: Google Analytics

## 📋 Funcionalidades Planejadas

### MVP (Fase 1)

- [ ] Lista de todos os deputados/senadores
- [ ] Histórico de votações por parlamentar
- [ ] Filtros por partido, estado, período
- [ ] Busca por nome do parlamentar

### Fase 2

- [ ] Análise de votações por tema (saúde, educação, etc.)
- [ ] Comparação entre parlamentares
- [ ] Gráficos de tendências de voto
- [ ] Notificações de novas votações

### Fase 3

- [ ] App mobile
- [ ] Integração com redes sociais
- [ ] Sistema de alertas personalizados
- [ ] API pública para desenvolvedores

### Fase 4 - Dashboard do Dia Atual

- [ ] Dashboard mostrando propostas em discussão/votação no dia atual
- [ ] Atualizações periódicas (a cada 15-30 minutos) das votações
- [ ] Notificações por email para votações importantes
- [ ] Agenda do dia com horários das sessões
- [ ] Integração com links para transmissões oficiais das sessões
- [ ] Resumo das principais propostas do dia
- [ ] Status de presença dos parlamentares nas sessões

### Fase 5 - Propostas em Espera

- [ ] Dashboard de propostas aguardando votação há muito tempo
- [ ] Filtros por tempo de espera (30, 60, 90, 180, 365 dias)
- [ ] Categorização por tipo de proposta e tema
- [ ] Análise de propostas "engavetadas" ou com baixa prioridade
- [ ] Alertas para propostas que ultrapassam prazos legais
- [ ] Comparação de tempo médio de tramitação por tema
- [ ] Gráficos de tendência de tempo de espera ao longo do tempo
- [ ] Sistema de priorização baseado em impacto social e urgência

## 🚀 Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença GNU GPL v3. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contato

- **GitHub**: [@lebreRafael](https://github.com/lebreRafael)
- **Email**: [seu-email@exemplo.com]

---

**Nota**: Este projeto é uma iniciativa de código aberto para promover transparência política no Brasil. Todas as contribuições são bem-vindas!
