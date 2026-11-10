class Interface {
  // guarda qual aluno está em edição: { turma: indiceDaTurma, aluno: indiceDoAluno }
  static #editando = null;

  // ---------- utilitários ----------
  static #esc(texto) {
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  static #mostrarAba(nome) {
    for (const n of ['turma', 'cadastrar', 'listar']) {
      document.getElementById('btn-' + n).classList.toggle('active', n === nome);
      document.getElementById('tab-' + n).classList.toggle('active', n === nome);
    }
  }

  static #preencherSelects(turmas) {
    for (const id of ['sel-turma-cadastrar', 'sel-turma-listar']) {
      const sel = document.getElementById(id);
      const atual = sel.value;
      sel.innerHTML = '';
      turmas.forEach((t, i) => {
        const op = document.createElement('option');
        op.value = i;
        op.textContent = t.getCurso() + ' - Prof. ' + t.getProfessor();
        sel.appendChild(op);
      });
      if (atual !== '' && Number(atual) < turmas.length) sel.value = atual;
    }
  }

  // ---------- Aba: Turmas ----------
  static abrirTurmas(turmas) {
    Interface.#mostrarAba('turma');
    const div = document.getElementById('turmas');
    if (turmas.length === 0) {
      div.innerHTML = '<p>Nenhuma turma cadastrada ainda.</p>';
      return;
    }
    let html = '<table><tr><th>Curso</th><th>Professor</th><th>Alunos</th></tr>';
    for (const t of turmas) {
      html +=
        '<tr><td>' + Interface.#esc(t.getCurso()) + '</td>' +
        '<td>' + Interface.#esc(t.getProfessor()) + '</td>' +
        '<td>' + t.getQuantidade() + '</td></tr>';
    }
    html += '</table>';
    div.innerHTML = html;
  }

  static salvarTurma() {
    const professor = document.getElementById('professor').value.trim();
    const curso = document.getElementById('curso').value.trim();
    if (professor === '' || curso === '') {
      alert('Informe o professor e o nome do curso.');
      return null;
    }
    const t = new Turma(professor, curso);
    document.getElementById('professor').value = '';
    document.getElementById('curso').value = '';
    alert('turma cadastrada');
    return t;
  }

  // ---------- Aba: Cadastrar Aluno ----------
  static cadastrar(turmas) {
    Interface.#mostrarAba('cadastrar');
    Interface.#preencherSelects(turmas);
    // não deixa cadastrar aluno sem turma
    const semTurma = turmas.length === 0;
    document.getElementById('aviso-sem-turma').style.display = semTurma ? 'block' : 'none';
    document.getElementById('btn-salvar-aluno').disabled = semTurma;
    document.getElementById('sel-turma-cadastrar').disabled = semTurma;
  }

  static #lerNota(id) {
    const valor = document.getElementById(id).value.trim().replace(',', '.');
    return valor;
  }

  // Devolve { turma, aluno } ou null se não foi possível cadastrar
  static salvarAluno(turmas) {
    if (turmas.length === 0) {
      alert('Cadastre uma turma antes de cadastrar alunos.');
      return null;
    }
    const nome = document.getElementById('nome').value.trim();
    if (nome === '') {
      alert('Informe o nome do aluno.');
      return null;
    }
    const turma = turmas[Number(document.getElementById('sel-turma-cadastrar').value)];
    try {
      const aluno = new Aluno(
        nome,
        Interface.#lerNota('n1'),
        Interface.#lerNota('n2'),
        Interface.#lerNota('n3')
      );
      alert('aluno cadastrado');
      for (const id of ['nome', 'n1', 'n2', 'n3']) {
        document.getElementById(id).value = '';
      }
      return { turma, aluno };
    } catch (erro) {
      alert(erro.message);
      return null;
    }
  }

  // ---------- Aba: Listar Alunos (com edição de notas) ----------
  static listar(turmas) {
    Interface.#mostrarAba('listar');
    Interface.#preencherSelects(turmas);
    const div = document.getElementById('alunos');

    if (turmas.length === 0) {
      div.innerHTML = '<p>Nenhuma turma cadastrada ainda.</p>';
      return;
    }

    const indiceTurma = Number(document.getElementById('sel-turma-listar').value);
    const alunos = turmas[indiceTurma].getAlunos();

    if (alunos.length === 0) {
      div.innerHTML = '<p>Nenhum aluno cadastrado nesta turma.</p>';
      return;
    }

    let lista = '<table>';
    lista +=
      '<tr><th>Nome</th><th>Nota 1</th><th>Nota 2</th><th>Nota 3</th>' +
      '<th>Média</th><th>Situação</th><th>Ações</th></tr>';

    for (let i = 0; i < alunos.length; i++) {
      const a = alunos[i];
      const editando =
        Interface.#editando !== null &&
        Interface.#editando.turma === indiceTurma &&
        Interface.#editando.aluno === i;

      lista += '<tr><td>' + Interface.#esc(a.getNome()) + '</td>';

      if (editando) {
        lista +=
          '<td><input class="nota-edit" id="edit-n1" value="' + a.getNota1() + '"></td>' +
          '<td><input class="nota-edit" id="edit-n2" value="' + a.getNota2() + '"></td>' +
          '<td><input class="nota-edit" id="edit-n3" value="' + a.getNota3() + '"></td>';
      } else {
        lista +=
          '<td>' + a.getNota1().toFixed(1) + '</td>' +
          '<td>' + a.getNota2().toFixed(1) + '</td>' +
          '<td>' + a.getNota3().toFixed(1) + '</td>';
      }

      lista +=
        '<td>' + a.getMedia().toFixed(2) + '</td>' +
        '<td>' + a.getEstado() + '</td>';

      if (editando) {
        lista +=
          '<td><button class="btn-mini ok" onclick="salvarEdicao(' + i + ')">Salvar</button> ' +
          '<button class="btn-mini" onclick="cancelarEdicao()">Cancelar</button></td>';
      } else {
        lista +=
          '<td><button class="btn-mini" onclick="editarAluno(' + i + ')">Editar</button></td>';
      }
      lista += '</tr>';
    }
    lista += '</table>';
    div.innerHTML = lista;
  }

  static editar(turmas, indiceAluno) {
    const indiceTurma = Number(document.getElementById('sel-turma-listar').value);
    Interface.#editando = { turma: indiceTurma, aluno: indiceAluno };
    Interface.listar(turmas);
  }

  static cancelarEdicao(turmas) {
    Interface.#editando = null;
    Interface.listar(turmas);
  }

  static salvarEdicao(turmas, indiceAluno) {
    const indiceTurma = Number(document.getElementById('sel-turma-listar').value);
    const aluno = turmas[indiceTurma].getAlunos()[indiceAluno];
    try {
      aluno.setNotas(
        Interface.#lerNota('edit-n1'),
        Interface.#lerNota('edit-n2'),
        Interface.#lerNota('edit-n3')
      );
      Interface.#editando = null;
      Interface.listar(turmas);
    } catch (erro) {
      alert(erro.message); // continua em modo edição
    }
  }
} //fim da classe
