/***********************************************************************************
 * Objetivo: Arquivo responsável pela manipulação dos elementos da página de ADMIN
 * Data: 12/06/2026
 * Autora: Daniele Silva Santos
 * Versão: 1.1 (Refatorado para múltiplas páginas)
 ***********************************************************************************/

// Função para mostrar/ocultar a senha na tela de Login
function toggleSenha() {
  const input = document.getElementById('inputSenha');
  if (input) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}

// Função para exibir o preview da imagem selecionada na tela "Adicionar Bebida"
function previewImagem(event) {
  const input = event.target;
  const preview = document.getElementById('preview');
  const textoUpload = document.getElementById('textoUpload');

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      if (preview && textoUpload) {
        preview.src = e.target.result;
        preview.classList.remove('hidden'); // Mostra a imagem
        textoUpload.classList.add('hidden'); // Esconde o texto/ícone
      }
    }
    
    reader.readAsDataURL(input.files[0]);
  }
}

// Função para salvar a bebida (Será conectada com o seu backend Node.js futuramente)
function salvarNovaBebida(event) {
  event.preventDefault(); // Evita o recarregamento padrão se estiver dentro de um form
  console.log('Botão Salvar Produto clicado! Lógica de integração com API entrará aqui.');
  // Aqui virá a lógica do fetch() ou axios()
}