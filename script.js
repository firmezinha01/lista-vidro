// 🔁 Carregar produtos da API e exibir na tabela
async function carregarProdutos() {
  const res = await fetch('/.netlify/functions/getVidros');
  const dados = await res.json();

  const tabela = document.getElementById('tabelaVidros');
  tabela.innerHTML = '';
  dados.forEach(produto => {
    tabela.innerHTML += `
      <tr>
        <td>${produto.nome}</td>
        <td>R$ ${produto.preco.toFixed(2)}</td>
        <td>
          <button class="edit" onclick="editarProduto(${produto.id}, '${produto.nome}', ${produto.preco}, '${produto.categoria || ''}')">Editar</button>
          <button class="delete" onclick="excluirProduto(${produto.id})">Excluir</button>
        </td>
      </tr>
    `;
  });
}

// ➕ Adicionar novo produto
async function adicionarProduto() {
  const nome = document.getElementById('novoNome').value;
  const preco = parseFloat(document.getElementById('novoPreco').value);
  const categoria = document.getElementById('novaCategoria').value;

  if (!nome || isNaN(preco) || !categoria) {
    alert("Preencha todos os campos!");
    return;
  }

  await fetch('/api/vidros', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, preco, categoria })
  });

  document.getElementById('novoNome').value = '';
  document.getElementById('novoPreco').value = '';
  document.getElementById('novaCategoria').value = '';

  carregarProdutos();
}

// 🔍 Filtrar produtos
async function filtrarProdutos() {
  const nome = document.getElementById('filtroNome').value;
  const precoMin = parseFloat(document.getElementById('precoMin').value) || 0;
  const precoMax = parseFloat(document.getElementById('precoMax').value) || Infinity;
  const categoria = document.getElementById('novaCategoria').value;

  const query = `/api/vidros?nome=${nome}&min=${precoMin}&max=${precoMax}&categoria=${categoria}`;
  const res = await fetch(query);
  const dados = await res.json();

  const tabela = document.getElementById('tabelaVidros');
  tabela.innerHTML = '';
  dados.forEach(produto => {
    tabela.innerHTML += `
      <tr>
        <td>${produto.nome}</td>
        <td>R$ ${produto.preco.toFixed(2)}</td>
        <td>
          <button class="edit" onclick="editarProduto(${produto.id}, '${produto.nome}', ${produto.preco}, '${produto.categoria || ''}')">Editar</button>
          <button class="delete" onclick="excluirProduto(${produto.id})">Excluir</button>
        </td>
      </tr>
    `;
  });
}

// ✏️ Editar produto
async function editarProduto(id, nomeAtual, precoAtual, categoriaAtual) {
  const novoNome = prompt("Novo nome:", nomeAtual);
  const novoPreco = prompt("Novo preço:", precoAtual);
  const novaCategoria = prompt("Nova categoria:", categoriaAtual);

  if (!novoNome || isNaN(parseFloat(novoPreco)) || !novaCategoria) {
    alert("Dados inválidos!");
    return;
  }

  await fetch(`/api/vidros/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: novoNome,
      preco: parseFloat(novoPreco),
      categoria: novaCategoria
    })
  });

  carregarProdutos();
}

// 🗑️ Excluir produto
async function excluirProduto(id) {
  if (confirm("Tem certeza que deseja excluir este produto?")) {
    await fetch(`/api/vidros/${id}`, { method: 'DELETE' });
    carregarProdutos();
  }
}

// 🚀 Inicializa carregamento ao abrir a página
window.onload = carregarProdutos;
