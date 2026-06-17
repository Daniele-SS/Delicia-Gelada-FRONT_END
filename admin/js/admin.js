/***********************************************************************************
 * Objetivo: Arquivo de manipulação do painel administrativo
 * Data: 16/06/2026
 * Versão: 1.6 (Limpa e Funcional)
 ***********************************************************************************/

// 1. FUNÇÕES DE INTERFACE (LOGIN E UPLOAD)
function toggleSenha() {
    const input = document.getElementById('inputSenha');
    const iconeOlho = document.getElementById('iconeOlho');
    if (!input || !iconeOlho) return;

    if (input.type === 'password') {
        input.type = 'text';
        iconeOlho.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />`;
    } else {
        input.type = 'password';
        iconeOlho.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />`;
    }
}

window.previewImagem = function(event, previewId = 'preview', textoId = 'textoUpload') {
    const input = event.target;
    const preview = document.getElementById(previewId);
    const textoUpload = document.getElementById(textoId);
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (preview && textoUpload) {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
                textoUpload.classList.add('hidden');
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// 2. FUNÇÕES DE MODAL
window.fecharModal = function() {
    document.querySelectorAll('[id^="modal-editar"]').forEach(m => m.classList.add('hidden'));
}

window.salvarEdicaoModal = function() {
    if (!window.linhaSendoEditada) return;
    const celulas = window.linhaSendoEditada.querySelectorAll('td');

    if (document.getElementById('modal-editar-categoria')?.classList.contains('hidden') === false) {
        celulas[0].innerText = document.getElementById('editCatNome').value;
        celulas[1].innerText = document.getElementById('editCatDesc').value;
    } else if (document.getElementById('modal-editar-bebida')?.classList.contains('hidden') === false) {
        celulas[0].innerText = document.getElementById('editBebNome').value;
        celulas[1].innerText = document.getElementById('editBebCat').value;
        celulas[2].innerText = document.getElementById('editBebTipo').value;
        celulas[3].innerHTML = `<span class="bg-[#E4F3F4] text-[#005A9C] px-3 py-1.5 rounded-full text-xs font-bold">${document.getElementById('editBebPreco').value}</span>`;
    } else if (document.getElementById('modal-editar-admin')?.classList.contains('hidden') === false) {
        celulas[0].innerText = document.getElementById('editAdmNome').value;
        celulas[1].innerText = document.getElementById('editAdmEmail').value;
    } else if (document.getElementById('modal-editar-cargo')?.classList.contains('hidden') === false) {
            celulas[0].innerText = document.getElementById('editCargoNome').value;
        }
    alert('Alteração salva com sucesso!');
    fecharModal();
}

// 3. LÓGICA GERAL DA TABELA
document.addEventListener('DOMContentLoaded', () => {
    const inputBusca = document.querySelector('main input[type="text"]');
    const tabelaBody = document.querySelector('table tbody');

    if (tabelaBody) {
        if (inputBusca) {
            inputBusca.addEventListener('input', (e) => {
                const termo = e.target.value.toLowerCase();
                tabelaBody.querySelectorAll('tr').forEach(tr => {
                    tr.style.display = tr.textContent.toLowerCase().includes(termo) ? '' : 'none';
                });
            });
        }

        tabelaBody.addEventListener('click', (e) => {
            const btnEditar = e.target.closest('button[title="Editar"]');
            const btnExcluir = e.target.closest('button[title="Excluir"]');

            if (btnEditar) {
                window.linhaSendoEditada = btnEditar.closest('tr');
                const c = window.linhaSendoEditada.querySelectorAll('td');
                
                if (document.getElementById('modal-editar-categoria')) {
                    document.getElementById('editCatNome').value = c[0].innerText.trim();
                    document.getElementById('editCatDesc').value = c[1].innerText.trim();
                    document.getElementById('modal-editar-categoria').classList.remove('hidden');
                } else if (document.getElementById('modal-editar-bebida')) {
                    document.getElementById('editBebNome').value = c[0].innerText.trim();
                    document.getElementById('editBebCat').value = c[1].innerText.trim();
                    document.getElementById('editBebTipo').value = c[2].innerText.trim();
                    document.getElementById('editBebPreco').value = c[3].innerText.trim();
                    document.getElementById('modal-editar-bebida').classList.remove('hidden');
                } else if (document.getElementById('modal-editar-admin')) {
                    document.getElementById('editAdmNome').value = c[0].innerText.trim();
                    document.getElementById('editAdmEmail').value = c[1].innerText.trim();
                    document.getElementById('modal-editar-admin').classList.remove('hidden');
                } else if (document.getElementById('modal-editar-cargo')) {
                    document.getElementById('editCargoNome').value = c[0].innerText.trim();
                    document.getElementById('modal-editar-cargo').classList.remove('hidden');
                }
            }
            if (btnExcluir && confirm('Deseja excluir este item?')) {
                btnExcluir.closest('tr').remove();
            }
        });
    }
});