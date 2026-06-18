/***********************************************************************************
 * Objetivo: Arquivo de manipulação do painel bebida
 * Data: 18/06/2026
 * Autor: Anderson Ribeiro
 * Versão: 1.0
 ***********************************************************************************/
'use strict'

// Definir a URL base da API
const BASE_URL = 'http://localhost:3000/v1/fynix/deliciagelada'

function mostrarFeedback(mensagem, tipo = 'erro') {
    let feedback = document.getElementById('feedback-msg')

    if (!feedback) {
        feedback = document.createElement('div')
        feedback.id = 'feedback-msg'
        feedback.className = 'fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg text-white text-sm font-bold transition-all transform duration-300'
        document.body.appendChild(feedback)
    }

    feedback.textContent = mensagem
    
    const bgClasse = tipo === 'sucesso' ? 'bg-green-500' : 'bg-red-500'
    
    feedback.className = `fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg text-white text-sm font-bold transition-all transform duration-300 ${bgClasse} opacity-0 translate-x-full`

    void feedback.offsetWidth;

    feedback.classList.remove('opacity-0', 'translate-x-full')
    feedback.classList.add('opacity-100', 'translate-x-0')

    if (feedback.timeoutId) {
        clearTimeout(feedback.timeoutId)
    }

    feedback.timeoutId = setTimeout(() => {
        feedback.classList.remove('opacity-100', 'translate-x-0')
        feedback.classList.add('opacity-0', 'translate-x-full')
    }, 2000)
}

// ==========================================
// 1. CADASTRAR (POST com FormData)
// ==========================================
async function salvarNovaBebida() {
    // Capturar os valores do formulário
    const nomeInput         = document.getElementById('nomeBebida')?.value.trim()
    const categoriaSelect   = document.getElementById('categoriaBebida')?.value.trim()
    const descricaoInput    = document.getElementById('descricaoBebida')?.value.trim()
    const ativoCheckbox     = document.getElementById('produtoAtivo')?.checked ?? true
    const id_status         = ativoCheckbox ? 1 : 2
    const tipoSelect        = document.getElementById('tipoBebida')?.value.trim()
    const precoInput        = document.getElementById('precoBebida')?.value.trim()
    
    // Captura o ARQUIVO de imagem real do input correspondente
    const fileInput         = document.getElementById('imagemBebida') 
    const arquivoImagem     = fileInput?.files ? fileInput.files[0] : null

    // ==========================================
    // 1.1. VALIDAÇÕES DOS CAMPOS
    // ==========================================
    if (!nomeInput || nomeInput.length > 80) {
        mostrarFeedback('O nome da bebida é obrigatório e deve ter no máximo 80 caracteres.')
        return;
    } 
    
    if (!categoriaSelect || categoriaSelect === "") {
        mostrarFeedback('Por favor, selecione uma categoria.');
        return;
    }

    if (!descricaoInput) {
        mostrarFeedback('A descrição da bebida é um campo obrigatório.')
        return;
    }

    if (!tipoSelect || tipoSelect === "") {
        mostrarFeedback('Por favor, selecione o tipo da bebida.')
        return;
    }

    if (!arquivoImagem) {
        mostrarFeedback('Por favor, selecione ou arraste uma imagem para a bebida.')
        return;
    }

    const precoFormatado = precoInput ? precoInput.replace(',', '.') : '';
    const precoNumerico = parseFloat(precoFormatado);

    if (!precoInput || isNaN(precoNumerico) || precoNumerico <= 0) {
        mostrarFeedback('Por favor, insira um preço válido e que seja acima de R$ 0,00')
        return;
    }

    // ==========================================
    // 1.2. MONTAGEM DO FORM-DATA (Para o Multer)
    // ==========================================
    const formData = new FormData()
    
    formData.append('nome', nomeInput)
    formData.append('id_categoria', categoriaSelect)
    formData.append('descricao', descricaoInput)
    formData.append('id_status', id_status)
    formData.append('tipo', tipoSelect)
    formData.append('preco', precoNumerico)
    
    formData.append('imagem', arquivoImagem) 

    try {
        const resposta = await fetch(`${BASE_URL}/bebida`, {
            method: 'POST',
            body: formData 
        })

        if (resposta.status === 201) {
            mostrarFeedback('Bebida cadastrada com sucesso!', 'sucesso')
            
            // Limpar o formulário após salvar
            if (document.getElementById('nomeBebida')) document.getElementById('nomeBebida').value = ''
            if (document.getElementById('categoriaBebida')) document.getElementById('categoriaBebida').value = ''
            if (document.getElementById('descricaoBebida')) document.getElementById('descricaoBebida').value = ''
            if (document.getElementById('produtoAtivo')) document.getElementById('produtoAtivo').checked = true
            if (document.getElementById('tipoBebida')) document.getElementById('tipoBebida').value = ''
            if (document.getElementById('precoBebida')) document.getElementById('precoBebida').value = ''
            if (fileInput) fileInput.value = ''
            
        } else {
            const erro = await resposta.json()
            console.error('Erro da API:', erro)
            mostrarFeedback(erro.message || 'Erro ao cadastrar bebida. Tente novamente.')
        }
    } catch (erro) {
        console.error('Erro na requisição:', erro)
        mostrarFeedback('Não foi possível conectar ao servidor. Verifique se o backend está rodando.')
    }
}


// ==========================================
// CARREGAR CATEGORIAS NO SELECT (GET)
// ==========================================
window.carregarCategoriaSelect = async function() {
    const selectCategoria = document.getElementById('categoriaBebida');
    if (!selectCategoria) return;

    try {
        const resposta = await fetch(`${BASE_URL}/categoria`);
        const dados = await resposta.json();

        console.log('Retorno da API de Categorias:', dados);
        
        if (resposta.ok && dados.response) {
            const listaCategorias = dados.response; 
            
            while (selectCategoria.options.length > 1) {
                selectCategoria.remove(1);
            }
            
            listaCategorias.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id; 
                option.textContent = item.nome; 
                selectCategoria.appendChild(option);
            });
        } else {
            console.warn('A API respondeu com sucesso, mas o campo "response" não foi encontrado ou está vazio.');
        }
    } catch (erro) {
        console.error('Erro ao buscar categorias:', erro);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.carregarCategoriaSelect();
});
