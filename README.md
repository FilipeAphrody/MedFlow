# MedFlow - Sistema de Gestão Clínica

## Visão Geral

**MedFlow** é um sistema web responsivo de gestão clínica desenvolvido para modernizar e centralizar os processos de clínicas médicas e clínicas-escola. A plataforma oferece funcionalidades essenciais para gerenciar pacientes, agendamentos, prontuários eletrônicos, controle de ponto de alunos e relatórios acadêmicos.

## Características Principais

### 1. **Gestão de Pacientes**
- Cadastro completo de pacientes com dados pessoais
- Armazenamento de histórico médico e alergias
- Busca e filtro de pacientes por nome ou CPF
- Atualização de informações de contato

### 2. **Agenda Digital de Consultas**
- Agendamento de consultas com data, hora e duração
- Visualização da agenda por dia com navegação entre datas
- Associação de pacientes, médicos/professores e salas
- Registro de status (agendada, concluída, cancelada, não compareceu)

### 3. **Prontuários Eletrônicos**
- Registro de atendimentos com queixa, diagnóstico e tratamento
- Prescrições e observações clínicas
- Histórico completo de consultas por paciente
- Interface intuitiva para consulta de registros

### 4. **Controle de Ponto de Alunos**
- Check-in e check-out digital
- Cálculo automático de horas trabalhadas
- Histórico de presença com status (presente, ausente, atrasado)
- Visualização de registros diários e históricos

### 5. **Relatórios Acadêmicos**
- Upload de relatórios por alunos
- Aprovação e feedback de supervisores
- Acompanhamento de desempenho acadêmico
- Controle de status (submetido, aprovado, rejeitado, revisão solicitada)

### 6. **Controle de Acesso Baseado em Perfil**
- **Admin**: Acesso completo ao sistema
- **Recepcionista**: Gestão de pacientes e agendamentos
- **Médico/Professor**: Registros médicos e supervisão
- **Aluno**: Ponto, relatórios e histórico
- **Supervisor**: Acompanhamento de alunos

## Arquitetura Técnica

### Stack de Tecnologias

| Camada | Tecnologia | Descrição |
|--------|-----------|-----------|
| **Frontend** | React 19 + Tailwind CSS 4 | Interface responsiva e moderna |
| **Backend** | Express.js + tRPC | API type-safe com roteamento automático |
| **Banco de Dados** | MySQL + Drizzle ORM | Persistência de dados com migrations automáticas |
| **Autenticação** | Manus OAuth | Autenticação segura integrada |
| **Estado** | React Query (tRPC) | Gerenciamento de estado e cache |
| **UI Components** | shadcn/ui | Componentes acessíveis e customizáveis |

### Estrutura do Banco de Dados

O sistema utiliza 10 tabelas principais:

1. **users** - Usuários do sistema com roles
2. **patients** - Informações de pacientes
3. **appointments** - Agendamentos de consultas
4. **medicalRecords** - Prontuários eletrônicos
5. **students** - Dados acadêmicos de alunos
6. **teachers** - Informações de professores/supervisores
7. **attendance** - Registro de ponto de alunos
8. **studentReports** - Relatórios acadêmicos
9. **rooms** - Salas de consulta
10. **clinicStatistics** - Estatísticas da clínica

## Funcionalidades por Perfil

### Recepcionista
- ✅ Cadastrar novos pacientes
- ✅ Agendar consultas
- ✅ Visualizar agenda diária/semanal
- ✅ Acessar relatórios básicos de atendimentos

### Médico/Professor
- ✅ Registrar atendimentos (prontuários)
- ✅ Visualizar agenda de consultas
- ✅ Acompanhar alunos (se supervisor)
- ✅ Avaliar relatórios acadêmicos

### Aluno
- ✅ Registrar ponto (entrada/saída)
- ✅ Visualizar histórico de presença
- ✅ Enviar relatórios acadêmicos
- ✅ Acompanhar desempenho

### Administrador
- ✅ Gerenciar usuários e permissões
- ✅ Gerenciar salas de consulta
- ✅ Visualizar estatísticas da clínica
- ✅ Acesso completo a todas as funcionalidades

## Como Usar

### Instalação e Setup

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
# Criar arquivo .env com as variáveis necessárias

# Iniciar servidor de desenvolvimento
pnpm dev

# Executar migrações do banco de dados
pnpm db:push
```

### Variáveis de Ambiente Necessárias

```
DATABASE_URL=mysql://usuario:senha@localhost:3306/medflow
JWT_SECRET=sua_chave_secreta_aqui
VITE_APP_ID=seu_app_id_manus
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_TITLE=MedFlow
VITE_APP_LOGO=https://seu-logo.png
```

## Fluxos de Uso Principais

### 1. Cadastro de Paciente
1. Acesse **Recepção** → **Pacientes**
2. Clique em **Novo Paciente**
3. Preencha os dados pessoais (nome, CPF, data de nascimento obrigatórios)
4. Clique em **Criar Paciente**

### 2. Agendamento de Consulta
1. Acesse **Recepção** → **Agenda de Consultas**
2. Clique em **Nova Consulta**
3. Selecione o paciente, sala (opcional) e data/hora
4. Clique em **Agendar Consulta**

### 3. Registro de Atendimento
1. Acesse **Registros Médicos**
2. Selecione o paciente na lista
3. Clique em **Novo Registro**
4. Preencha queixa, diagnóstico, tratamento e prescrição
5. Clique em **Salvar Registro**

### 4. Controle de Ponto (Aluno)
1. Acesse **Meu Estágio** → **Registro de Ponto**
2. Clique em **Registrar Entrada** no início do dia
3. Clique em **Registrar Saída** ao final do dia
4. Visualize o histórico de ponto

### 5. Envio de Relatório Acadêmico
1. Acesse **Meu Estágio** → **Meus Relatórios**
2. Clique em **Novo Relatório**
3. Preencha título e conteúdo
4. Clique em **Enviar Relatório**
5. Acompanhe o status de aprovação

## Segurança e Conformidade

- **Autenticação OAuth**: Integração com Manus OAuth para login seguro
- **Controle de Acesso**: Permissões baseadas em roles de usuário
- **Proteção de Dados**: Dados sensíveis protegidos no banco de dados
- **LGPD**: Estrutura pronta para conformidade com Lei Geral de Proteção de Dados
- **Validação**: Validação de entrada em todos os formulários

## Roadmap Futuro

### MVP (Versão Atual)
- ✅ Gestão básica de pacientes
- ✅ Agendamento de consultas
- ✅ Prontuários eletrônicos
- ✅ Controle de ponto de alunos
- ✅ Relatórios acadêmicos

### Versão 2.0 (Planejado)
- 📋 Portal do paciente para acesso online
- 📋 Lembretes por email/SMS
- 📋 Dashboard com indicadores de produtividade
- 📋 Exportação de relatórios em PDF/Excel
- 📋 Integração com sistemas de convênios

### Versão 3.0+ (Futuro)
- 📋 Módulo financeiro completo
- 📋 Integração com TISS/SUS
- 📋 Emissão digital de receitas e atestados
- 📋 Integração com WhatsApp
- 📋 Aplicativo mobile

## Suporte e Contribuição

Para reportar bugs, sugerir melhorias ou contribuir com o projeto, entre em contato com a equipe de desenvolvimento.

## Licença

Sistema desenvolvido para fins acadêmicos e comerciais. Todos os direitos reservados.

---

**Versão**: 1.0.0  
**Data de Lançamento**: Outubro 2025  
**Status**: MVP Completo

