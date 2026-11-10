class Turma {
  // História 3: turma tem professor, nome do curso e conjunto de alunos
  #professor;
  #curso;
  #alunos = [];

  constructor(professor, curso) {
    this.#professor = professor;
    this.#curso = curso;
  }

  getProfessor() { return this.#professor; }
  getCurso() { return this.#curso; }
  setProfessor(professor) { this.#professor = professor; }
  setCurso(curso) { this.#curso = curso; }

  adicionarAluno(aluno) {
    this.#alunos.push(aluno);
  }

  // Devolve uma cópia do array (os objetos Aluno são os mesmos, então editar nota funciona)
  getAlunos() {
    return [...this.#alunos];
  }

  getQuantidade() {
    return this.#alunos.length;
  }
} //fim da classe
