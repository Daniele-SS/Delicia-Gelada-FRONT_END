/***********************************************************************************
 * Objetivo: Arquivo de manipulação do painel administrativo - Bebidas
 * Data: 18/06/2026
 * Autor: Jean Costa
 * Versão: 1.0
 ***********************************************************************************/
'use strict'

const BASE_URL = 'https://delicia-gelada-api.cleverapps.io/v1/fynix/deliciagelada'

// ==========================================
// FUNÇÃO AUXILIAR: ÍCONES SVG SEGUROS (SEM INNERHTML)
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
// 1. CADASTRAR BEBIDA (POST com FormData)
// ==========================================
window.salvarNovaBebida = async function(event) {
    if (event) event.preventDefault()

    const nomeInput = document.getElementById('nomeBebida')
    const descInput = document.getElementById('descricaoBebida')
    const precoInput = document.getElementById('precoBebida')
    const tipoSelect = document.getElementById('tipoBebida')
    const categoriaSelect = document.getElementById('categoriaBebida')
    const fotoInput = document.getElementById('imagemBebida')
    const statusCheckbox = document.getElementById('produtoAtivo')

    const formData = new FormData()
    formData.append('nome', nomeInput.value.trim())
    formData.append('descricao', descInput.value.trim())
    formData.append('preco', precoInput.value.replace(',', '.'))
    formData.append('id_tipo_bebida', tipoSelect.value) 
    formData.append('id_categoria', categoriaSelect.value)
    formData.append('id_status', statusCheckbox.checked ? 1 : 2) 
    formData.append('imagem', fotoInput.files[0]) // Enviando como 'imagem'
    formData.append('id_usuario', 1) 

    const token = localStorage.getItem('tokenDeliciaGelada')

    try {
        const resposta = await fetch(`${BASE_URL}/bebida`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            body: formData
        })

        if (resposta.status === 201) {
            Swal.fire({ icon: 'success', title: 'Sucesso!', text: 'Bebida cadastrada!', timer: 1500, showConfirmButton: false })
            nomeInput.value = ''
            descInput.value = ''
            precoInput.value = ''
            fotoInput.value = ''
            
            // Recarrega se a tabela existir
            if(document.getElementById('tabela-bebidas')) listarBebidas() 
        } else {
            Swal.fire({ icon: 'error', title: 'Erro', text: 'Falha ao cadastrar bebida.' })
        }
    } catch (erro) {
        console.error(erro)
    }
}

// ==========================================
// 2. LISTAR BEBIDAS (GET)
// ==========================================
window.listarBebidas = async function() {
    try {
        const token = localStorage.getItem('tokenDeliciaGelada')
        const resposta = await fetch(`${BASE_URL}/bebida`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })
        
        const dados = await resposta.json()
        
        if (resposta.ok && dados.response) {
            const tabelaBody = document.querySelector('#tabela-bebidas tbody')
            if (!tabelaBody) return

            while (tabelaBody.firstChild) {
                tabelaBody.removeChild(tabelaBody.firstChild)
            }

            dados.response.forEach(bebida => {
                const nomeCategoria = bebida.categorias && bebida.categorias.length > 0 ? bebida.categorias[0].nome : 'Sem Categoria'
                const precoFormatado = Number(bebida.preco).toFixed(2).replace('.', ',')

                const tr = document.createElement('tr')
                tr.className = 'border-b border-gray-200 hover:bg-gray-50 transition text-center'
                
                // Coluna: Imagem e Nome
                const tdNome = document.createElement('td')
                tdNome.className = 'py-4 px-6 text-sm font-semibold text-[#005A9C] text-left flex items-center gap-3'
                const img = document.createElement('img')
                img.src = bebida.imagem
                img.alt = bebida.nome
                img.className = 'w-10 h-10 rounded-md object-cover border border-gray-300'
                const spanNome = document.createElement('span')
                spanNome.textContent = bebida.nome
                tdNome.appendChild(img)
                tdNome.appendChild(spanNome)
                tr.appendChild(tdNome)

                // Coluna: Categoria
                const tdCat = document.createElement('td')
                tdCat.className = 'py-4 px-6 text-sm text-gray-600 border-l border-gray-200'
                tdCat.textContent = nomeCategoria
                tr.appendChild(tdCat)

                // Coluna: Tipo (Dica: Se você trouxe o nome do tipo na sua VIEW, pode usar bebida.tipo_bebida aqui)
                const tdTipo = document.createElement('td')
                tdTipo.className = 'py-4 px-6 text-sm text-gray-600 border-l border-gray-200'
                tdTipo.textContent = 'Drink' 
                tr.appendChild(tdTipo)

                // Coluna: Preço
                const tdPreco = document.createElement('td')
                tdPreco.className = 'py-4 px-6 text-sm text-gray-600 border-l border-gray-200'
                const spanPreco = document.createElement('span')
                spanPreco.className = 'bg-[#E4F3F4] text-[#005A9C] px-3 py-1.5 rounded-full text-xs font-bold'
                spanPreco.textContent = `R$ ${precoFormatado}`
                tdPreco.appendChild(spanPreco)
                tr.appendChild(tdPreco)

                // Coluna: Ações
                const tdAcoes = document.createElement('td')
                tdAcoes.className = 'py-4 px-6 border-l border-gray-200'
                const divAcoes = document.createElement('div')
                divAcoes.className = 'flex items-center justify-center gap-5'

                // Criação do Botão de Editar
                const btnEditar = document.createElement('button')
                btnEditar.className = 'text-gray-800 hover:text-[#005A9C] transition'
                btnEditar.title = 'Editar'
                btnEditar.addEventListener('click', () => editarBebida(bebida.id))
                btnEditar.appendChild(criarIconeSVG('editar')) // Deixe apenas UM appendChild para o editar

                // Criação do Botão de Excluir
                const btnExcluir = document.createElement('button')
                btnExcluir.className = 'text-gray-800 hover:text-red-600 transition'
                btnExcluir.title = 'Excluir'
                btnExcluir.addEventListener('click', () => deletarBebida(bebida.id))
                btnExcluir.appendChild(criarIconeSVG('excluir'))

                divAcoes.appendChild(btnEditar)
                divAcoes.appendChild(btnExcluir)
                tdAcoes.appendChild(divAcoes)
                tr.appendChild(tdAcoes)

                tabelaBody.appendChild(tr)


            })
        } else {
            console.error("A API retornou sucesso mas não encontrou lista de bebidas:", dados)
        }
    } catch (erro) {
        console.error('Erro ao listar bebidas:', erro)
    }
}

// ==========================================
// 3. DELETAR BEBIDA (DELETE)
// ==========================================
window.deletarBebida = async function(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: "Esta ação é irreversível!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const token = localStorage.getItem('tokenDeliciaGelada');
            const resposta = await fetch(`${BASE_URL}/bebida/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            });

            if (resposta.ok) {
                Swal.fire('Excluído!', 'A Bebida foi removida com sucesso.', 'success');
                listarBebidas();
            } else {
                const erro = await resposta.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao excluir',
                    text: erro.message || 'Verifique o banco de dados.',
                    confirmButtonColor: '#005A9C'
                });
            }
        } catch (erro) {
            console.error('Erro de rede ao deletar:', erro);
            Swal.fire('Erro', 'Falha ao conectar com o servidor.', 'error');
        }
    }
}

// ==========================================
// 4. CARREGAR SELECTS (CADASTRAR BEBIDA)
// ==========================================
async function carregarSelects() {
    try {
        const selectCat = document.getElementById('categoriaBebida')
        const selectTipo = document.getElementById('tipoBebida')

        // Se os elementos não existem na página, não faz nada
        if (!selectCat || !selectTipo) return;

        // Limpa de forma segura (sem innerHTML)
        while (selectCat.firstChild) selectCat.removeChild(selectCat.firstChild)
        while (selectTipo.firstChild) selectTipo.removeChild(selectTipo.firstChild)

        // Adiciona opção padrão Categoria
        const optCatDefault = document.createElement('option')
        optCatDefault.value = ""
        optCatDefault.textContent = "Selecione uma categoria..."
        selectCat.appendChild(optCatDefault)

        // Popular Categorias
        const resCat = await fetch(`${BASE_URL}/categoria`)
        const dadosCat = await resCat.json()
        
        if(dadosCat.response) {
            dadosCat.response.forEach(cat => {
                const option = document.createElement('option')
                option.value = cat.id
                option.textContent = cat.nome
                selectCat.appendChild(option)
            })
        }

        // Adiciona opção padrão Tipo
        const optTipoDefault = document.createElement('option')
        optTipoDefault.value = ""
        optTipoDefault.textContent = "Selecione um tipo de bebida..."
        selectTipo.appendChild(optTipoDefault)

        // Popular Tipos de Bebida
        const resTipo = await fetch(`${BASE_URL}/tipobebida`)
        const dadosTipo = await resTipo.json()
        
        if(dadosTipo.response) {
            dadosTipo.response.forEach(tipo => {
                const option = document.createElement('option')
                option.value = tipo.id
                option.textContent = tipo.nome
                selectTipo.appendChild(option)
            })
        }

    } catch (erro) {
        console.error('Erro ao carregar dados dos selects:', erro)
        Swal.fire('Erro', 'Não foi possível carregar as opções.', 'error')
    }
}

// ==========================================
// 5. EDITAR BEBIDA (PUT)
// ==========================================

// Variável global para guardar o ID da bebida que está a ser editada
let bebidaEditandoId = null; 

window.editarBebida = async function(id) {
    try {
        // 1. Busca os dados atuais da bebida pelo ID
        const resposta = await fetch(`${BASE_URL}/bebida/${id}`);
        const dados = await resposta.json();

        if (resposta.ok && dados.response) {
            const bebida = dados.response;
            bebidaEditandoId = bebida.id; // Guarda o ID

            // 2. Preenche a modal com os dados
            document.getElementById('editBebNome').value = bebida.nome;
            
            // Tratamento para preço (volta ao formato original com ponto para facilitar se precisar converter)
            document.getElementById('editBebPreco').value = bebida.preco;
            
            // Para categoria e tipo, idealmente teríamos um select, mas como o HTML tem um input text:
            const nomeCategoria = bebida.categorias && bebida.categorias.length > 0 ? bebida.categorias[0].nome : '';
            document.getElementById('editBebCat').value = nomeCategoria;
            
            const nomeTipo = bebida.tipo || bebida.nome_tipo || '';
            document.getElementById('editBebTipo').value = nomeTipo;

            // 3. Mostra a imagem atual no preview, se existir
            const preview = document.getElementById('previewEditBeb');
            const textoUpload = document.getElementById('textoUploadEditBeb');
            
            if (bebida.imagem && bebida.imagem.startsWith('http')) {
                preview.src = bebida.imagem;
                preview.classList.remove('hidden');
                textoUpload.classList.add('hidden');
            } else {
                preview.src = '';
                preview.classList.add('hidden');
                textoUpload.classList.remove('hidden');
            }

            // 4. Mostra a modal
            document.getElementById('modal-editar-bebida').classList.remove('hidden');
        } else {
            Swal.fire('Erro', 'Não foi possível carregar os dados da bebida.', 'error');
        }
    } catch (erro) {
        console.error('Erro ao buscar bebida para edição:', erro);
    }
}

window.fecharModal = function() {
    document.getElementById('modal-editar-bebida').classList.add('hidden');
    bebidaEditandoId = null;
    
    // Limpa o input de arquivo e o preview ao fechar
    const inputFicheiro = document.getElementById('editBebImagem');
    if(inputFicheiro) inputFicheiro.value = '';
    
    document.getElementById('previewEditBeb').src = '';
    document.getElementById('previewEditBeb').classList.add('hidden');
    document.getElementById('textoUploadEditBeb').classList.remove('hidden');
}

window.salvarEdicaoModal = async function() {
    if (!bebidaEditandoId) return;

    // A edição, por lidar com imagens possivelmente novas, também deve usar FormData
    const formData = new FormData();
    
    const nome = document.getElementById('editBebNome').value.trim();
    const preco = document.getElementById('editBebPreco').value.trim().replace(',', '.');
    const inputFicheiro = document.getElementById('editBebImagem');
    
    // Atenção: Aqui assumimos que se a categoria ou tipo forem alterados, o backend aceita o nome ou precisa do ID.
    // O seu HTML atual tem inputs de texto para Categoria e Tipo na modal de edição. 
    // Para simplificar, vou enviar apenas os dados principais se não existirem IDs explícitos na modal.
    
    formData.append('nome', nome);
    formData.append('preco', preco);
    
    // Se o utilizador selecionou uma nova imagem, anexa ao FormData
    if (inputFicheiro.files && inputFicheiro.files[0]) {
        formData.append('imagem', inputFicheiro.files[0]);
    }
    
    // (Opcional) Reenvie o status atual para evitar que o backend apague, caso o seu controller exija.
    // formData.append('id_status', 1);

    const token = localStorage.getItem('tokenDeliciaGelada');

    try {
        const resposta = await fetch(`${BASE_URL}/bebida/${bebidaEditandoId}`, {
            method: 'PUT',
            headers: { 'Authorization': 'Bearer ' + token },
            body: formData
        });

        if (resposta.ok) {
            Swal.fire({ icon: 'success', title: 'Sucesso!', text: 'Bebida atualizada com sucesso!', timer: 1500, showConfirmButton: false });
            fecharModal();
            listarBebidas(); // Recarrega a tabela
        } else {
            const erro = await resposta.json();
            Swal.fire({ icon: 'error', title: 'Erro', text: erro.message || 'Falha ao atualizar bebida.' });
        }
    } catch (erro) {
        console.error('Erro na atualização:', erro);
        Swal.fire('Erro', 'Falha ao ligar ao servidor.', 'error');
    }
}

// ==========================================
// 6. CARREGAR PERFIL DO USUÁRIO LOGADO
// ==========================================
window.carregarPerfilLogado = async function() {
    const token = localStorage.getItem('tokenDeliciaGelada')
    
    // Elementos da tela
    const imgPerfil = document.getElementById('foto-admin-sidebar')
    const txtNome = document.getElementById('nome-admin-sidebar')
    const txtCargo = document.getElementById('cargo-admin-sidebar')

    if (!token) return

    try {
        const payloadDecoded = JSON.parse(atob(token.split('.')[1]))
        const userId = payloadDecoded.userID.id

        const resposta = await fetch(`http://localhost:3000/v1/fynix/deliciagelada/usuario/${userId}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
        
        const dados = await resposta.json()

        if (resposta.ok && dados.response) {
            const usuario = dados.response
            
            console.log("DADOS DO USUÁRIO RECEBIDOS:", usuario) // Isso vai mostrar a foto real

            if (txtNome && usuario.nome) txtNome.textContent = usuario.nome.split(' ')[0]
            if (txtCargo && usuario.cargo) txtCargo.textContent = usuario.cargo
            
            if (imgPerfil && usuario.foto) {
                console.log("TENTANDO APLICAR FOTO:", usuario.foto)
                imgPerfil.src = usuario.foto 
            } else {
                console.warn("A foto do usuário está vazia ou o ID 'foto-admin-sidebar' não foi encontrado.")
            }
        }
    } catch (erro) {
        console.error('Erro ao buscar perfil:', erro)
    }
}

function carregarPerfilUsuario() {
    // Busca as informações no localStorage. Se não achar, usa valores padrão
    const nomeLogado = localStorage.getItem('nomeUsuario') || 'Administrador'; 
    const fotoLogado = localStorage.getItem('fotoUsuario'); // O link da Azure
    const cargoLogado = localStorage.getItem('cargoUsuario') || 'Membro'; 
    
    // Pega os elementos na tela
    const elementoNome = document.getElementById('nome-usuario-sidebar');
    const elementoFoto = document.getElementById('foto-usuario-sidebar');
    const elementoCargo = document.getElementById('cargo-usuario-sidebar');
    
    // Substitui as informações na tela
    if (elementoNome) elementoNome.textContent = nomeLogado;
    if (elementoCargo) elementoCargo.textContent = cargoLogado;
    
    // Só substitui a foto se realmente tiver um link no localStorage, senão mantém a padrão
    if (elementoFoto && fotoLogado) {
        elementoFoto.src = fotoLogado;
    }
}

// ==========================================
// INICIALIZAÇÃO ÚNICA E DEFINITIVA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    carregarPerfilLogado()
    
    // 1. Carrega as funcionalidades da página de bebidas
    if (document.getElementById('categoriaBebida')) {
        carregarSelects()
    }
    if (document.getElementById('tabela-bebidas')) {
        listarBebidas()
    }

    // 2. Carrega o perfil do usuário
    // Chamamos a função oficial que usa o Token e a API
    if (document.getElementById('foto-admin-sidebar')) {
        console.log("Menu lateral detectado. Iniciando carregamento do perfil...")
        carregarPerfilLogado() 
    }
})