class Aluno {
  // História 2: notas privadas, acessadas só via get/set
  #nome;
  #nota1;
  #nota2;
  #nota3;

  constructor(nome, nota1, nota2, nota3) {
    this.#nome = nome;
    this.#nota1 = Aluno.#validarNota(nota1);
    this.#nota2 = Aluno.#validarNota(nota2);
    this.#nota3 = Aluno.#validarNota(nota3);
  }

  // Método estático privado: garante que a nota é um número entre 0 e 10
  static #validarNota(nota) {
    const n = Number(nota);
    if (nota === '' || nota === null || Number.isNaN(n) || n < 0 || n > 10) {
      throw new Error('A nota deve ser um número entre 0 e 10.');
    }
    return n;
  }

  // A média e o estado são calculados na hora, então nunca ficam desatualizados
  gerarMedia() {
    return (this.#nota1 + this.#nota2 + this.#nota3) / 3;
  }

  gerarEstado() {
    const media = this.gerarMedia();
    if (media >= 6) return 'Aprovado';
    if (media >= 3) return 'Recuperação';
    return 'Reprovado';
  }

  // Getters
  getNome() { return this.#nome; }
  getNota1() { return this.#nota1; }
  getNota2() { return this.#nota2; }
  getNota3() { return this.#nota3; }
  getMedia() { return this.gerarMedia(); }
  getEstado() { return this.gerarEstado(); }

  // Setters
  setNome(nome) { this.#nome = nome; }
  setNota1(nota) { this.#nota1 = Aluno.#validarNota(nota); }
  setNota2(nota) { this.#nota2 = Aluno.#validarNota(nota); }
  setNota3(nota) { this.#nota3 = Aluno.#validarNota(nota); }

  // Altera as 3 notas de uma vez: valida todas antes de gravar qualquer uma
  setNotas(nota1, nota2, nota3) {
    const n1 = Aluno.#validarNota(nota1);
    const n2 = Aluno.#validarNota(nota2);
    const n3 = Aluno.#validarNota(nota3);
    this.#nota1 = n1;
    this.#nota2 = n2;
    this.#nota3 = n3;
  }
} //fim da classe
