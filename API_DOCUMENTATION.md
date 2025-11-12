# MedFlow API Documentation

## Visão Geral

A API do MedFlow é construída com **tRPC**, um framework que oferece type-safety end-to-end entre frontend e backend. Todas as chamadas são feitas através de procedimentos tRPC que garantem tipagem automática.

## Autenticação

Todas as chamadas de API requerem autenticação via Manus OAuth. O usuário é automaticamente injetado no contexto de cada procedimento protegido.

```typescript
// Procedimento protegido - requer autenticação
protectedProcedure.query(({ ctx }) => {
  // ctx.user contém as informações do usuário autenticado
  console.log(ctx.user.id, ctx.user.role);
});
```

## Endpoints da API

### Autenticação

#### `auth.me`
Retorna as informações do usuário autenticado.

```typescript
const { data: user } = trpc.auth.me.useQuery();
```

**Resposta:**
```json
{
  "id": 1,
  "openId": "user123",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "receptionist",
  "createdAt": "2025-10-23T00:00:00Z"
}
```

#### `auth.logout`
Faz logout do usuário autenticado.

```typescript
const logout = trpc.auth.logout.useMutation();
logout.mutate();
```

---

### Pacientes

#### `patients.list`
Lista todos os pacientes cadastrados.

```typescript
const { data: patients } = trpc.patients.list.useQuery();
```

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "Maria Santos",
    "cpf": "123.456.789-00",
    "dateOfBirth": "1990-05-15T00:00:00Z",
    "phone": "(11) 98765-4321",
    "email": "maria@example.com",
    "address": "Rua das Flores, 123",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567",
    "medicalHistory": "Hipertensão",
    "allergies": "Penicilina"
  }
]
```

#### `patients.getById`
Obtém informações de um paciente específico.

```typescript
const { data: patient } = trpc.patients.getById.useQuery({ id: 1 });
```

#### `patients.getByCPF`
Busca um paciente pelo CPF.

```typescript
const { data: patient } = trpc.patients.getByCPF.useQuery({ cpf: "123.456.789-00" });
```

#### `patients.create`
Cria um novo paciente.

```typescript
const createPatient = trpc.patients.create.useMutation();
await createPatient.mutateAsync({
  name: "João Silva",
  cpf: "987.654.321-00",
  dateOfBirth: new Date("1985-03-20"),
  phone: "(11) 91234-5678",
  email: "joao@example.com",
  address: "Av. Paulista, 1000",
  city: "São Paulo",
  state: "SP",
  zipCode: "01311-100"
});
```

#### `patients.update`
Atualiza informações de um paciente.

```typescript
const updatePatient = trpc.patients.update.useMutation();
await updatePatient.mutateAsync({
  id: 1,
  phone: "(11) 99999-8888",
  email: "novo-email@example.com"
});
```

---

### Agendamentos

#### `appointments.getByPatient`
Lista agendamentos de um paciente.

```typescript
const { data: appointments } = trpc.appointments.getByPatient.useQuery({ patientId: 1 });
```

#### `appointments.getByDoctor`
Lista agendamentos de um médico/professor.

```typescript
const { data: appointments } = trpc.appointments.getByDoctor.useQuery({ doctorId: 1 });
```

#### `appointments.getByDate`
Lista agendamentos de um dia específico.

```typescript
const { data: appointments } = trpc.appointments.getByDate.useQuery({ 
  date: new Date("2025-10-23") 
});
```

#### `appointments.create`
Cria um novo agendamento.

```typescript
const createAppointment = trpc.appointments.create.useMutation();
await createAppointment.mutateAsync({
  patientId: 1,
  doctorId: 2,
  roomId: 1,
  appointmentDate: new Date("2025-10-25T14:30:00"),
  duration: 30,
  notes: "Consulta de rotina"
});
```

#### `appointments.update`
Atualiza status de um agendamento.

```typescript
const updateAppointment = trpc.appointments.update.useMutation();
await updateAppointment.mutateAsync({
  id: 1,
  status: "completed",
  notes: "Consulta realizada com sucesso"
});
```

---

### Registros Médicos

#### `medicalRecords.getByPatient`
Lista registros médicos de um paciente.

```typescript
const { data: records } = trpc.medicalRecords.getByPatient.useQuery({ patientId: 1 });
```

#### `medicalRecords.create`
Cria um novo registro médico (prontuário).

```typescript
const createRecord = trpc.medicalRecords.create.useMutation();
await createRecord.mutateAsync({
  appointmentId: 1,
  patientId: 1,
  doctorId: 2,
  complaint: "Dor de cabeça persistente",
  diagnosis: "Enxaqueca",
  treatment: "Repouso e medicação",
  prescription: "Dipirona 500mg - 1 comprimido a cada 6 horas",
  notes: "Paciente apresenta melhora com repouso"
});
```

---

### Alunos

#### `students.getByUser`
Obtém informações acadêmicas de um aluno.

```typescript
const { data: student } = trpc.students.getByUser.useQuery({ userId: 1 });
```

#### `students.getBySupervisor`
Lista alunos supervisionados por um professor.

```typescript
const { data: students } = trpc.students.getBySupervisor.useQuery({ supervisorId: 1 });
```

#### `students.create`
Registra um novo aluno no sistema.

```typescript
const createStudent = trpc.students.create.useMutation();
await createStudent.mutateAsync({
  userId: 1,
  registration: "2025001",
  course: "Enfermagem",
  semester: 4,
  supervisorId: 2
});
```

---

### Professores

#### `teachers.list`
Lista todos os professores/supervisores.

```typescript
const { data: teachers } = trpc.teachers.list.useQuery();
```

#### `teachers.getByUser`
Obtém informações de um professor específico.

```typescript
const { data: teacher } = trpc.teachers.getByUser.useQuery({ userId: 1 });
```

#### `teachers.create`
Registra um novo professor no sistema.

```typescript
const createTeacher = trpc.teachers.create.useMutation();
await createTeacher.mutateAsync({
  userId: 1,
  specialization: "Clínica Geral",
  licenseNumber: "CRM123456",
  department: "Clínica Médica"
});
```

---

### Controle de Ponto

#### `attendance.getByStudent`
Lista registros de ponto de um aluno.

```typescript
const { data: records } = trpc.attendance.getByStudent.useQuery({ studentId: 1 });
```

#### `attendance.checkIn`
Registra entrada do aluno.

```typescript
const checkIn = trpc.attendance.checkIn.useMutation();
await checkIn.mutateAsync({ studentId: 1 });
```

#### `attendance.checkOut`
Registra saída do aluno.

```typescript
const checkOut = trpc.attendance.checkOut.useMutation();
await checkOut.mutateAsync({ attendanceId: 1 });
```

---

### Relatórios Acadêmicos

#### `studentReports.getByStudent`
Lista relatórios de um aluno.

```typescript
const { data: reports } = trpc.studentReports.getByStudent.useQuery({ studentId: 1 });
```

#### `studentReports.getBySupervisor`
Lista relatórios para avaliação de um supervisor.

```typescript
const { data: reports } = trpc.studentReports.getBySupervisor.useQuery({ supervisorId: 1 });
```

#### `studentReports.create`
Cria um novo relatório acadêmico.

```typescript
const createReport = trpc.studentReports.create.useMutation();
await createReport.mutateAsync({
  studentId: 1,
  supervisorId: 2,
  reportDate: new Date(),
  title: "Relatório de Atividades - Outubro 2025",
  content: "Durante o mês de outubro, participei de 15 atendimentos..."
});
```

#### `studentReports.updateStatus`
Atualiza o status de um relatório.

```typescript
const updateStatus = trpc.studentReports.updateStatus.useMutation();
await updateStatus.mutateAsync({
  reportId: 1,
  status: "approved",
  feedback: "Excelente trabalho! Continue assim."
});
```

---

### Salas

#### `rooms.list`
Lista todas as salas de consulta disponíveis.

```typescript
const { data: rooms } = trpc.rooms.list.useQuery();
```

#### `rooms.create`
Cria uma nova sala de consulta.

```typescript
const createRoom = trpc.rooms.create.useMutation();
await createRoom.mutateAsync({
  name: "Sala 1 - Clínica Geral",
  description: "Sala para atendimentos de clínica geral",
  capacity: 1
});
```

---

## Tratamento de Erros

Todos os procedimentos retornam erros estruturados com código e mensagem:

```typescript
try {
  await trpc.patients.create.mutateAsync(data);
} catch (error) {
  if (error.data?.code === 'CONFLICT') {
    console.log("Paciente já existe");
  }
  if (error.data?.code === 'NOT_FOUND') {
    console.log("Recurso não encontrado");
  }
}
```

## Paginação e Filtros

Atualmente, os endpoints retornam todos os registros. Para versões futuras, será implementado:

- Paginação com `skip` e `take`
- Filtros avançados
- Ordenação customizável
- Busca full-text

## Rate Limiting

Não há rate limiting implementado no MVP. Para produção, recomenda-se:

- Implementar rate limiting por IP
- Implementar rate limiting por usuário
- Implementar cache com Redis

## Exemplos de Uso Completo

### Exemplo 1: Criar Paciente e Agendar Consulta

```typescript
// Criar paciente
const createPatient = trpc.patients.create.useMutation();
const patient = await createPatient.mutateAsync({
  name: "Ana Silva",
  cpf: "111.222.333-44",
  dateOfBirth: new Date("1990-01-15")
});

// Agendar consulta
const createAppointment = trpc.appointments.create.useMutation();
await createAppointment.mutateAsync({
  patientId: patient.id,
  appointmentDate: new Date("2025-10-25T14:00:00"),
  duration: 30
});
```

### Exemplo 2: Registrar Atendimento

```typescript
// Obter registros médicos do paciente
const { data: records } = trpc.medicalRecords.getByPatient.useQuery({ patientId: 1 });

// Criar novo registro
const createRecord = trpc.medicalRecords.create.useMutation();
await createRecord.mutateAsync({
  appointmentId: 1,
  patientId: 1,
  complaint: "Dor nas costas",
  diagnosis: "Hérnia de disco",
  treatment: "Fisioterapia",
  prescription: "Ibuprofeno 400mg"
});
```

---

**Versão da API**: 1.0.0  
**Última Atualização**: Outubro 2025

