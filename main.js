// Todas as turmas do sistema (cada turma guarda seus alunos)
const turmas = [];

function abrirTurmas() {
  Interface.abrirTurmas(turmas);
}

function btnSalvarTurma() {
  const t = Interface.salvarTurma();
  if (t !== null) {
    turmas.push(t);
    Interface.abrirTurmas(turmas);
  }
}

function cadastroAluno() {
  Interface.cadastrar(turmas);
}

function btnSalvar() {
  const resultado = Interface.salvarAluno(turmas);
  if (resultado !== null) {
    resultado.turma.adicionarAluno(resultado.aluno);
  }
}

function listarAluno() {
  Interface.listar(turmas);
}

function editarAluno(i) {
  Interface.editar(turmas, i);
}

function cancelarEdicao() {
  Interface.cancelarEdicao(turmas);
}

function salvarEdicao(i) {
  Interface.salvarEdicao(turmas, i);
}
