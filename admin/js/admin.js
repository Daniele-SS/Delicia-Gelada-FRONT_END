/***********************************************************************************
 * Objetivo: Arquivo de manipulação do painel administrativo
 * Data: 16/06/2026
 * Autor: Jean Costa
 * Versão: 2.1 (Com Login Integrado e sem ponto-e-vírgula)
 ***********************************************************************************/
'use strict'

// ==========================================
// 1. FUNÇÕES DE INTERFACE (LOGIN E UPLOAD)
// ==========================================
window.toggleSenha = function() {
    const input = document.getElementById('inputSenha')
    const iconeOlho = document.getElementById('iconeOlho')
    
    if (!input || !iconeOlho) return

    while (iconeOlho.firstChild) {
        iconeOlho.removeChild(iconeOlho.firstChild)
    }

    const svgNS = "http://www.w3.org/2000/svg"

    if (input.type === 'password') {
        input.type = 'text'
        
        const path1 = document.createElementNS(svgNS, "path")
        path1.setAttribute("stroke-linecap", "round")
        path1.setAttribute("stroke-linejoin", "round")
        path1.setAttribute("stroke-width", "2")
        path1.setAttribute("d", "M15 12a3 3 0 11-6 0 3 3 0 016 0z")

        const path2 = document.createElementNS(svgNS, "path")
        path2.setAttribute("stroke-linecap", "round")
        path2.setAttribute("stroke-linejoin", "round")
        path2.setAttribute("stroke-width", "2")
        path2.setAttribute("d", "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z")

        iconeOlho.appendChild(path1)
        iconeOlho.appendChild(path2)

    } else {
        input.type = 'password'
        
        const path1 = document.createElementNS(svgNS, "path")
        path1.setAttribute("stroke-linecap", "round")
        path1.setAttribute("stroke-linejoin", "round")
        path1.setAttribute("stroke-width", "2")
        path1.setAttribute("d", "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21")
        
        iconeOlho.appendChild(path1)
    }
}

window.previewImagem = function(event, previewId = 'preview', textoId = 'textoUpload') {
    const input = event.target
    const preview = document.getElementById(previewId)
    const textoUpload = document.getElementById(textoId)
    
    if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
            if (preview && textoUpload) {
                preview.src = e.target.result
                preview.classList.remove('hidden')
                textoUpload.classList.add('hidden')
            }
        }
        reader.readAsDataURL(input.files[0])
    }
}

// ==========================================
// 2. FUNÇÕES DE MODAL LEGADO (Categoria e Bebida)
// ==========================================
window.fecharModalLegado = function() {
    document.querySelectorAll('[id^="modal-editar"]').forEach(m => m.classList.add('hidden'))
}

window.salvarEdicaoModalLegado = function() {
    if (!window.linhaSendoEditada) return
    const celulas = window.linhaSendoEditada.querySelectorAll('td')

    if (document.getElementById('modal-editar-categoria')?.classList.contains('hidden') === false) {
        celulas[0].innerText = document.getElementById('editCatNome').value
        celulas[1].innerText = document.getElementById('editCatDesc').value
    } else if (document.getElementById('modal-editar-bebida')?.classList.contains('hidden') === false) {
        celulas[0].innerText = document.getElementById('editBebNome').value
        celulas[1].innerText = document.getElementById('editBebCat').value
        celulas[2].innerText = document.getElementById('editBebTipo').value
        
        celulas[3].textContent = '' 
        const spanPreco = document.createElement('span')
        spanPreco.className = 'bg-[#E4F3F4] text-[#005A9C] px-3 py-1.5 rounded-full text-xs font-bold'
        spanPreco.textContent = document.getElementById('editBebPreco').value
        celulas[3].appendChild(spanPreco)
    } 
    
    alert('Alteração local salva com sucesso!')
    fecharModalLegado()
}

// ==========================================
// 3. LÓGICA GERAL DE BUSCA E TABELAS ESTÁTICAS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const inputBusca = document.querySelector('main input[type="text"]')
    const tabelaBody = document.querySelector('table tbody')

    if (tabelaBody && inputBusca) {
        inputBusca.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase()
            tabelaBody.querySelectorAll('tr').forEach(tr => {
                if(!tr.querySelector('th')) {
                    tr.style.display = tr.textContent.toLowerCase().includes(termo) ? '' : 'none'
                }
            })
        })
    }

    if (tabelaBody && !document.getElementById('tabela-cargos') && !document.getElementById('tabelaTiposBebida') && !document.getElementById('tela-lista-admins')) {
        tabelaBody.addEventListener('click', (e) => {
            const btnEditar = e.target.closest('button[title="Editar"]')
            const btnExcluir = e.target.closest('button[title="Excluir"]')

            if (btnEditar) {
                window.linhaSendoEditada = btnEditar.closest('tr')
                const c = window.linhaSendoEditada.querySelectorAll('td')
                
                if (document.getElementById('modal-editar-categoria')) {
                    document.getElementById('editCatNome').value = c[0].innerText.trim()
                    document.getElementById('editCatDesc').value = c[1].innerText.trim()
                    document.getElementById('modal-editar-categoria').classList.remove('hidden')
                } else if (document.getElementById('modal-editar-bebida')) {
                    document.getElementById('editBebNome').value = c[0].innerText.trim()
                    document.getElementById('editBebCat').value = c[1].innerText.trim()
                    document.getElementById('editBebTipo').value = c[2].innerText.trim()
                    document.getElementById('editBebPreco').value = c[3].innerText.trim()
                    document.getElementById('modal-editar-bebida').classList.remove('hidden')
                } 
            }
            if (btnExcluir && confirm('Deseja excluir este item?')) {
                btnExcluir.closest('tr').remove()
            }
        })
    }
})

// ==========================================
// 4. RECUPERAÇÃO DE SENHA
// ==========================================
window.recuperarSenha = function(event) {
    if (event) event.preventDefault()

    const emailInput = document.querySelector('input[type="email"]')
    const emailValor = emailInput ? emailInput.value.trim() : ''

    if (!emailValor) {
        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'Por favor, digite o seu email corporativo para recuperar a senha!',
            confirmButtonColor: '#FF9800'
        })
        return
    }

    Swal.fire({
        icon: 'success',
        title: 'Email Enviado!',
        text: 'Se este email estiver cadastrado, você receberá um link com as instruções para redefinir sua senha.',
        confirmButtonColor: '#FF9800'
    }).then(() => {
        window.location.href = '../../admin.html'
    })
}

// ==========================================
// 5. AUTENTICAÇÃO / LOGIN API
// ==========================================
window.fazerLogin = async function(event) {
    if (event) event.preventDefault()

    const emailInput = document.getElementById('inputEmail')
    const senhaInput = document.getElementById('inputSenha')

    const emailValor = emailInput ? emailInput.value.trim() : ''
    const senhaValor = senhaInput ? senhaInput.value.trim() : ''

    if (!emailValor || !senhaValor) {
        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'Por favor, preencha o e-mail e a senha!',
            confirmButtonColor: '#FF9800'
        })
        return
    }

    try {
        const resposta = await fetch('https://delicia-gelada-api.cleverapps.io/v1/fynix/deliciagelada/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailValor, senha: senhaValor })
        })

        const dados = await resposta.json()

        if (resposta.status === 200 && dados.status === true) {
            
            // Guarda o Token JWT no armazenamento local do navegador
            localStorage.setItem('tokenDeliciaGelada', dados.token)

            Swal.fire({
                icon: 'success',
                title: 'Bem-vindo!',
                text: 'Login realizado com sucesso.',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = './admin/pages/dashboard.html'
            })

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Acesso Negado',
                text: dados.message || 'E-mail ou senha incorretos.',
                confirmButtonColor: '#005A9C'
            })
        }
    } catch (erro) {
        console.error('Erro ao fazer login:', erro)
        Swal.fire({
            icon: 'error',
            title: 'Erro de Conexão',
            text: 'Falha ao conectar com o servidor.',
            confirmButtonColor: '#005A9C'
        })
    }
}

// ==========================================
// 6. CARREGAR PERFIL DO USUÁRIO LOGADO
// ==========================================
window.carregarPerfilLogado = async function() {
    console.log('✅ carregarPerfilLogado do admin.js executando')
    const token = localStorage.getItem('tokenDeliciaGelada')
    
    // Se não tem token, bloqueia a tela e expulsa pro login
    if (!token) {
        window.location.href = '../../admin.html'
        return
    }

    try {
        // Descriptografa a parte pública do JWT para pegar o ID do usuário
        const payloadDecoded = JSON.parse(atob(token.split('.')[1]))
        
        // O JWT geralmente salva o ID como "id" ou "id_usuario"
        const userId = payloadDecoded.userID?.id

        if (userId) {
            // Busca os dados completos do usuário no banco usando o ID
            const resposta = await fetch(`https://delicia-gelada-api.cleverapps.io/v1/fynix/deliciagelada/usuario/${userId}`, {
                headers: { 'Authorization': 'Bearer ' + token }
            })
            
            const dados = await resposta.json()

            if (resposta.ok && dados.response) {
                const usuario = dados.response
                
                // Injeta os dados na tela
                const imgPerfil = document.getElementById('foto-admin-sidebar')
                const txtNome = document.getElementById('nome-admin-sidebar')
                const txtCargo = document.getElementById('cargo-admin-sidebar')

                // Se tiver foto salva na Azure, ele mostra. Se não, mantém a padrão.
                if (imgPerfil && usuario.foto) imgPerfil.src = usuario.foto
                
                // Pega o primeiro nome (separando por espaço)
                if (txtNome && usuario.nome) {
                    txtNome.textContent = usuario.nome.split(' ')[0] 
                }
                
                if (txtCargo && usuario.cargo) {
                    txtCargo.textContent = usuario.cargo
                }
            }
        }
    } catch (erro) {
        console.error('Erro ao carregar perfil do token:', erro)
    }
}

// ==========================================
// 7. FAZER LOGOUT
// ==========================================
window.fazerLogout = function() {
    // Apaga o token do cofre do navegador
    localStorage.removeItem('tokenDeliciaGelada')
    // Redireciona para o login
    window.location.href = '../../admin.html'
}

// ==========================================
// INICIALIZAÇÃO DE PÁGINAS PROTEGIDAS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('foto-admin-sidebar')) {
        carregarPerfilLogado()
    }
})