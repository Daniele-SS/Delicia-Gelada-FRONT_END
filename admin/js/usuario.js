/***********************************************************************************
 * Objetivo: Arquivo de manipulação do painel administrativo
 * Data: 16/06/2026
 * Autor: Jean Costa
 * Versão: 1.0
 ***********************************************************************************/
'use strict'

const BASE_URL = 'https://delicia-gelada-api.cleverapps.io/v1/fynix/deliciagelada'

// ==========================================
// FUNÇÃO AUXILIAR: CRIAR ÍCONES SVG SEGUROS (Sem innerHTML)
// ==========================================
function criarIconeSVG(tipo) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("fill", "none");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("class", "w-6 h-6");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");

    if (tipo === 'editar') {
        path.setAttribute("d", "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10");
    } else if (tipo === 'excluir') {
        path.setAttribute("d", "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0");
    }

    svg.appendChild(path);
    return svg;
}

// ==========================================
// CARREGAR CARGOS NO SELECT (GET)
// ==========================================
window.carregarCargosSelect = async function() {
    const selectCargo = document.getElementById('cargoAdmin');
    if (!selectCargo) return;

    try {
        const resposta = await fetch(`${BASE_URL}/cargo`);
        const dados = await resposta.json();
        
        if (resposta.ok && dados.response) {
            const cargos = dados.response;
            
            while (selectCargo.options.length > 1) {
                selectCargo.remove(1);
            }
            
            cargos.forEach(cargo => {
                const option = document.createElement('option');
                option.value = cargo.id; 
                option.textContent = cargo.nome; 
                selectCargo.appendChild(option);
            });
        }
    } catch (erro) {
        console.error('Erro ao buscar cargos:', erro);
    }
}

// ==========================================
// 1. CADASTRAR ADMIN / USUÁRIO (POST)
// ==========================================
window.salvarNovoAdmin = async function(event) {
    if (event) event.preventDefault()

    const nomeInput = document.getElementById('nomeAdmin')
    const emailInput = document.getElementById('emailAdmin')
    const cargoSelect = document.getElementById('cargoAdmin')
    const senhaInput = document.getElementById('senhaAdmin')
    const fotoInput = document.getElementById('imagemAdmin') 

    const nomeValor = nomeInput ? nomeInput.value.trim() : ''
    const emailValor = emailInput ? emailInput.value.trim() : ''
    const idCargoValor = cargoSelect ? cargoSelect.value : ''
    const senhaValor = senhaInput ? senhaInput.value.trim() : ''
    
    const arquivoFoto = fotoInput && fotoInput.files ? fotoInput.files[0] : null

    if (!nomeValor || !emailValor || !idCargoValor || !senhaValor || !arquivoFoto) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos Obrigatórios',
            text: 'Preencha todos os campos e selecione uma foto de perfil!',
            confirmButtonColor: '#FF9800'
        })
        return
    }

    const formData = new FormData()
    formData.append('nome', nomeValor)
    formData.append('email', emailValor) 
    formData.append('email_corporativo', emailValor) 
    formData.append('senha', senhaValor)
    formData.append('id_cargo', idCargoValor)
    formData.append('foto', arquivoFoto)

    try {
        const resposta = await fetch(`${BASE_URL}/usuario`, {
            method: 'POST',
            body: formData 
        })

        const dados = await resposta.json()

        if (resposta.status === 201 || resposta.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Administrador cadastrado com sucesso!',
                showConfirmButton: false,
                timer: 1500
            })

            if (nomeInput) nomeInput.value = ''
            if (emailInput) emailInput.value = ''
            if (cargoSelect) cargoSelect.value = ''
            if (senhaInput) senhaInput.value = ''
            if (fotoInput) fotoInput.value = ''
            
            const previewImg = document.getElementById('preview');
            if (previewImg) {
                previewImg.src = ''
                previewImg.classList.add('hidden')
            }
            const textoUpload = document.getElementById('textoUpload')
            if (textoUpload) textoUpload.classList.remove('hidden')

            if (nomeInput) nomeInput.focus()

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: dados.message || 'Erro ao cadastrar.',
                confirmButtonColor: '#005A9C'
            })
        }
    } catch (erro) {
        console.error('Erro na API:', erro);
        Swal.fire({
            icon: 'error',
            title: 'Erro de Conexão',
            text: 'Falha ao conectar com o servidor.',
            confirmButtonColor: '#005A9C'
        })
    }
}

// ==========================================
// 2. LISTAR ADMINS (GET)
// ==========================================
window.listarAdmins = async function() {
    try {
        const resposta = await fetch(`${BASE_URL}/usuario`);
        const dados = await resposta.json();

        if (resposta.ok && dados.response) {
            const lista = dados.response;
            const tabelaBody = document.querySelector('table tbody');
            
            if (!tabelaBody) return;
            
            while (tabelaBody.firstChild) {
                tabelaBody.removeChild(tabelaBody.firstChild);
            }

            lista.forEach(admin => {
                const tr = document.createElement('tr');
                tr.className = 'border-b border-gray-200 hover:bg-gray-50 transition text-center';

                // Nome
                const tdNome = document.createElement('td');
                tdNome.className = 'py-4 px-6 text-sm font-semibold text-[#005A9C] text-left';
                tdNome.textContent = admin.nome;
                tr.appendChild(tdNome);

                // E-mail
                const tdEmail = document.createElement('td');
                tdEmail.className = 'py-4 px-6 text-sm text-gray-600 border-l border-gray-200';
                tdEmail.textContent = admin.email_corporativo || admin.email;
                tr.appendChild(tdEmail);

                // Cargo (Ajustado para usar o cargo retornado pelo banco ao invés de "último acesso")
                const tdCargo = document.createElement('td');
                tdCargo.className = 'py-4 px-6 text-sm text-gray-600 border-l border-gray-200';
                tdCargo.textContent = admin.cargo || '-';
                tr.appendChild(tdCargo);

                const tdAcoes = document.createElement('td');
                tdAcoes.className = 'py-4 px-6 border-l border-gray-200';
                
                const divAcoes = document.createElement('div');
                divAcoes.className = 'flex items-center justify-center gap-5';

                const btnEditar = document.createElement('button');
                btnEditar.className = 'text-gray-800 hover:text-[#005A9C] transition';
                btnEditar.title = "Editar";
                btnEditar.appendChild(criarIconeSVG('editar'));
                
                btnEditar.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    abrirModalEdicaoAdmin(admin);
                });
                divAcoes.appendChild(btnEditar);

                const btnExcluir = document.createElement('button');
                btnExcluir.className = 'text-gray-800 hover:text-red-600 transition';
                btnExcluir.title = "Excluir";
                btnExcluir.appendChild(criarIconeSVG('excluir'));
                
                btnExcluir.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    deletarAdmin(admin.id);
                });
                divAcoes.appendChild(btnExcluir);

                tdAcoes.appendChild(divAcoes);
                tr.appendChild(tdAcoes);
                tabelaBody.appendChild(tr);
            });
        }
    } catch (erro) {
        console.error('Erro ao buscar admins:', erro);
    }
}

// ==========================================
// 3. ATUALIZAR ADMIN (PUT)
// ==========================================
window.atualizarAdmin = async function(id) {
    const nomeValor = document.getElementById('editAdmNome')?.value.trim();
    const emailValor = document.getElementById('editAdmEmail')?.value.trim();
    const senhaValor = document.getElementById('editAdmSenha')?.value.trim();

    if (!nomeValor || !emailValor) {
        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'Nome e E-mail não podem ser vazios!',
            confirmButtonColor: '#FF9800'
        });
        return;
    }

    const payload = {
        nome: nomeValor,
        email: emailValor,
        email_corporativo: emailValor
    };

    if (senhaValor) {
        payload.senha = senhaValor;
    }

    // Nota: Requer JWT válido caso o endpoint valide token (headers: { 'Authorization': 'Bearer ' + token })
    try {
        const resposta = await fetch(`${BASE_URL}/usuario/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (resposta.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Atualizado!',
                text: 'Admin atualizado com sucesso!',
                showConfirmButton: false,
                timer: 1500
            });
            fecharModal();
            listarAdmins();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao atualizar o Administrador.',
                confirmButtonColor: '#005A9C'
            });
        }
    } catch (erro) {
        console.error('Erro na atualização:', erro);
    }
}

// ==========================================
// 4. DELETAR ADMIN (DELETE)
// ==========================================
window.deletarAdmin = async function(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter a exclusão deste Administrador!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        // Nota: Requer JWT válido caso o endpoint valide token
        try {
            const resposta = await fetch(`${BASE_URL}/usuario/${id}`, {
                method: 'DELETE'
            });

            if (resposta.ok) {
                Swal.fire('Excluído!', 'O Administrador foi removido.', 'success');
                listarAdmins();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Não foi possível excluir o administrador.',
                    confirmButtonColor: '#005A9C'
                });
            }
        } catch (erro) {
            console.error('Erro ao deletar:', erro);
        }
    }
}

// ==========================================
// MODAL E INICIALIZAÇÃO
// ==========================================
window.abrirModalEdicaoAdmin = function(admin) {
    const modal = document.getElementById('modal-editar-admin');
    const btnSalvar = document.getElementById('btnSalvarEdicaoAdmin'); 
    
    if (modal && btnSalvar) {
        document.getElementById('editAdmNome').value = admin.nome || '';
        document.getElementById('editAdmEmail').value = admin.email_corporativo || admin.email || '';
        document.getElementById('editAdmSenha').value = ''; // Sempre vazio por segurança
        
        // Preview da foto se existir
        const previewImg = document.getElementById('previewEditAdm');
        const textUpload = document.getElementById('textoUploadEditAdm');
        
        if (admin.foto && previewImg && textUpload) {
            previewImg.src = admin.foto;
            previewImg.classList.remove('hidden');
            textUpload.classList.add('hidden');
        }

        btnSalvar.onclick = () => atualizarAdmin(admin.id);
        modal.classList.remove('hidden');
    }
}

window.fecharModal = function() {
    const modal = document.getElementById('modal-editar-admin');
    if (modal) modal.classList.add('hidden');
}



document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cargoAdmin')) {
        carregarCargosSelect()
    }
    const inputBusca = document.querySelector('input[placeholder="Buscar administrador..."]')
    if (inputBusca || document.getElementById('tela-lista-admins')) {
        listarAdmins()
    }
})