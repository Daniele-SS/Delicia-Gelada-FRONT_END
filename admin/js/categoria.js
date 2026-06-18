/***********************************************************************************
 * Objetivo: Arquivo de manipulação do painel administrativo - Categorias
 * Data: 16/06/2026
 * Autora: Daniele Silva Santos / Jean Costa
 * Versão: 1.0
 ***********************************************************************************/
'use strict'

const BASE_URL = 'http://localhost:3000/v1/fynix/deliciagelada'

// ==========================================
// FUNÇÃO AUXILIAR: ÍCONES SVG SEGUROS
// ==========================================
function criarIconeSVG(tipo) {
    const svgNS = "http://www.w3.org/2000/svg"
    const svg = document.createElementNS(svgNS, "svg")
    svg.setAttribute("fill", "none")
    svg.setAttribute("viewBox", "0 0 24 24")
    svg.setAttribute("stroke-width", "2")
    svg.setAttribute("stroke", "currentColor")
    svg.setAttribute("class", "w-6 h-6")

    const path = document.createElementNS(svgNS, "path")
    path.setAttribute("stroke-linecap", "round")
    path.setAttribute("stroke-linejoin", "round")

    if (tipo === 'editar') {
        path.setAttribute("d", "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10")
    } else if (tipo === 'excluir') {
        path.setAttribute("d", "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0")
    }

    svg.appendChild(path)
    return svg
}

// ==========================================
// 1. CADASTRAR CATEGORIA (POST)
// ==========================================
window.salvarNovaCategoria = async function(event) {
    if (event) event.preventDefault()

    const nomeInput = document.getElementById('nomeCategoria')
    const descInput = document.getElementById('descricaoCategoria')
    const fotoInput = document.getElementById('imagemCategoria')
    const statusCheckbox = document.getElementById('categoriaAtiva')

    const nomeValor = nomeInput ? nomeInput.value.trim() : ''
    const descValor = descInput ? descInput.value.trim() : ''
    const arquivoFoto = fotoInput && fotoInput.files ? fotoInput.files[0] : null
    
    // Status: 2 = Ativo, 1 = Inativo (Baseado no seu BD)
    const idStatusValor = statusCheckbox && statusCheckbox.checked ? 2 : 1

    if (!nomeValor || !arquivoFoto) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos Obrigatórios',
            text: 'Preencha o nome e selecione uma imagem de capa para a categoria!',
            confirmButtonColor: '#FF9800'
        })
        return
    }

    // Usando FormData para enviar a imagem física para a Azure
    const formData = new FormData()
    formData.append('nome', nomeValor)
    formData.append('descricao', descValor)
    formData.append('id_status', idStatusValor)
    formData.append('foto', arquivoFoto)

    // Recupera o token de segurança para não dar erro 401
    const token = localStorage.getItem('tokenDeliciaGelada')

    try {
        const resposta = await fetch(`${BASE_URL}/categoria`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
                // Não enviamos Content-Type com FormData, o navegador ajusta sozinho
            },
            body: formData
        })

        const dados = await resposta.json()

        if (resposta.status === 201 || resposta.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Categoria cadastrada com sucesso!',
                showConfirmButton: false,
                timer: 1500
            })
            
            // Limpa o formulário para um novo cadastro
            if (nomeInput) nomeInput.value = ''
            if (descInput) descInput.value = ''
            if (fotoInput) fotoInput.value = ''
            if (statusCheckbox) statusCheckbox.checked = true
            
            // Limpa a imagem de preview
            const previewImg = document.getElementById('previewCategoria')
            if (previewImg) {
                previewImg.src = ''
                previewImg.classList.add('hidden')
            }
            const textoUpload = document.getElementById('textoUploadCategoria')
            if (textoUpload) textoUpload.classList.remove('hidden')

            if (nomeInput) nomeInput.focus()

            if (document.getElementById('tabela-categorias')) {
                listarCategorias()
            }

        }  else {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: dados.message || 'Erro ao cadastrar a categoria. Verifique os dados.',
                confirmButtonColor: '#005A9C'
            })
        }
    } catch (erro) {
        console.error('Erro na API:', erro)
        Swal.fire({
            icon: 'error',
            title: 'Erro de Conexão',
            text: 'Falha ao conectar com o servidor.',
            confirmButtonColor: '#005A9C'
        })
    }
}

// ==========================================
// 2. LISTAR CATEGORIAS (GET)
// ==========================================
window.listarCategorias = async function() {
    try {
        const resposta = await fetch(`${BASE_URL}/categoria`)
        const dados = await resposta.json()

        if (resposta.ok && dados.response) {
            const lista = dados.response
            const tabelaBody = document.querySelector('#tabela-categorias tbody') // Ajuste o ID conforme seu HTML de listagem

            if (!tabelaBody) return

            while (tabelaBody.firstChild) {
                tabelaBody.removeChild(tabelaBody.firstChild)
            }

            lista.forEach(categoria => {
                const tr = document.createElement('tr')
                tr.className = 'border-b border-gray-200 hover:bg-gray-50 transition text-center'

                // Coluna da Foto e Nome
                const tdNome = document.createElement('td')
                tdNome.className = 'py-4 px-6 text-sm font-semibold text-[#005A9C] text-left flex items-center gap-3'
                
                const img = document.createElement('img')
                img.src = categoria.foto || '../img/placeholder.png'
                img.className = 'w-10 h-10 rounded-md object-cover border border-gray-300'
                
                const spanNome = document.createElement('span')
                spanNome.textContent = categoria.nome

                tdNome.appendChild(img)
                tdNome.appendChild(spanNome)
                tr.appendChild(tdNome)

                // Coluna da Descrição
                const tdDesc = document.createElement('td')
                tdDesc.className = 'py-4 px-6 text-sm text-gray-600 border-l border-gray-200 truncate max-w-xs'
                tdDesc.textContent = categoria.descricao || '-'
                tr.appendChild(tdDesc)

                // Coluna do Status
                const tdStatus = document.createElement('td')
                tdStatus.className = 'py-4 px-6 text-sm border-l border-gray-200 text-center'
                const spanStatus = document.createElement('span')
                

                // Trava de segurança dupla: tenta ler a palavra, se não achar, tenta ler o número.
                let statusTexto = 'inativo'
                if (categoria.status_categoria) {
                    statusTexto = String(categoria.status_categoria).trim().toLowerCase()
                } else if (categoria.id_status === 2) {
                    statusTexto = 'ativo'
                }

                if (statusTexto === 'ativo') {
                    spanStatus.className = 'bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-xs'
                    spanStatus.textContent = 'Ativo'
                } else {
                    spanStatus.className = 'bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold text-xs'
                    spanStatus.textContent = 'Inativo'
                }
                
                tdStatus.appendChild(spanStatus)
                tr.appendChild(tdStatus)

                // Coluna de Ações
                const tdAcoes = document.createElement('td')
                tdAcoes.className = 'py-4 px-6 border-l border-gray-200'
                
                const divAcoes = document.createElement('div')
                divAcoes.className = 'flex items-center justify-center gap-5'

                const btnEditar = document.createElement('button')
                btnEditar.className = 'text-gray-800 hover:text-[#005A9C] transition'
                btnEditar.title = "Editar"
                btnEditar.appendChild(criarIconeSVG('editar'))
                btnEditar.addEventListener('click', (e) => {
                    e.stopPropagation()
                    abrirModalEdicaoCategoria(categoria)
                })
                divAcoes.appendChild(btnEditar)

                const btnExcluir = document.createElement('button')
                btnExcluir.className = 'text-gray-800 hover:text-red-600 transition'
                btnExcluir.title = "Excluir"
                btnExcluir.appendChild(criarIconeSVG('excluir'))
                btnExcluir.addEventListener('click', (e) => {
                    e.stopPropagation()
                    deletarCategoria(categoria.id)
                })
                divAcoes.appendChild(btnExcluir)

                tdAcoes.appendChild(divAcoes)
                tr.appendChild(tdAcoes)
                tabelaBody.appendChild(tr)
            })
        }
    } catch (erro) {
        console.error('Erro ao buscar categorias:', erro)
    }
}

// ==========================================
// 3. DELETAR CATEGORIA (DELETE)
// ==========================================
window.deletarCategoria = async function(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter a exclusão desta Categoria!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
        const token = localStorage.getItem('tokenDeliciaGelada')
        try {
            const resposta = await fetch(`${BASE_URL}/categoria/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            })

            if (resposta.ok) {
                Swal.fire('Excluída!', 'A Categoria foi removida com sucesso.', 'success')
                listarCategorias()
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Não foi possível excluir a categoria. Verifique se existem bebidas vinculadas a ela.',
                    confirmButtonColor: '#005A9C'
                })
            }
        } catch (erro) {
            console.error('Erro ao deletar categoria:', erro)
        }
    }
}

// ==========================================
// 4. ATUALIZAR CATEGORIA (PUT / MODAL)
// ==========================================
let categoriaAtualEditando = null;

// Função chamada quando clica no botão do lápis na tabela
window.abrirModalEdicaoCategoria = function(categoria) {
    categoriaAtualEditando = categoria;
    const modal = document.getElementById('modal-editar-categoria');
    
    // Preenche os campos do modal HTML com os dados do banco
    document.getElementById('editCatNome').value = categoria.nome;
    document.getElementById('editCatDesc').value = categoria.descricao || '';
    
    // Abre o modal
    modal.classList.remove('hidden');
}

// Fechar o modal (Botão Cancelar ou no X)
window.fecharModal = function() {
    const modal = document.getElementById('modal-editar-categoria');
    if (modal) modal.classList.add('hidden');
    categoriaAtualEditando = null;
}

// Salvar as alterações (Botão Salvar Alterações)
window.salvarEdicaoModal = async function() {
    if (!categoriaAtualEditando) return;

    const nomeValor = document.getElementById('editCatNome').value.trim();
    const descValor = document.getElementById('editCatDesc').value.trim();

    if (!nomeValor) {
        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'O nome da categoria não pode ficar vazio!',
            confirmButtonColor: '#FF9800'
        });
        return;
    }

    // A sua API retorna 'ativo' ou 'inativo' no GET, precisamos converter de volta para número (2 ou 1) para salvar
    const statusId = categoriaAtualEditando.status_categoria?.toLowerCase() === 'ativo' ? 2 : 1;

    // Montando o pacote JSON exatamente como o seu controller exige
    const payload = {
        nome: nomeValor,
        descricao: descValor,
        foto: categoriaAtualEditando.foto, // Mantém a foto original da Azure intacta
        id_status: statusId // Mantém o status original intacto
    };

    const token = localStorage.getItem('tokenDeliciaGelada');

    try {
        const resposta = await fetch(`${BASE_URL}/categoria/${categoriaAtualEditando.id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(payload)
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Atualizado!',
                text: 'Categoria atualizada com sucesso!',
                showConfirmButton: false,
                timer: 1500
            });
            fecharModal(); // Fecha o visual do modal
            listarCategorias(); // Recarrega a tabela limpinha
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: dados.message || 'Falha ao atualizar a categoria.',
                confirmButtonColor: '#005A9C'
            });
        }
    } catch (erro) {
        console.error('Erro na atualização:', erro);
    }
}

// ==========================================
// INICIALIZAÇÃO DA PÁGINA DE LISTAGEM
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    carregarPerfilLogado()
    // Identifica se estamos na tela de listagem de categorias
    if (document.getElementById('tabela-categorias')) {
        listarCategorias()
    }
})