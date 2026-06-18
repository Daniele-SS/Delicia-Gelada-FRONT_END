/*******************************************************************************************
objetivo: Arquivo responável por gerar funções dos filtros
autor: Mayara Martins
versão:1.0.0
data:17/06/2026
********************************************************************************************/

import { getBebidas, getCategorias, getTipos } from './api.js'

let todasBebidas = []

let dadosBebida = {
    cards: [
        { img: './img/Measuring Cup.png', alt: 'copo medidor', titulo: '350 ml', descricaoCard: 'Volume' },
        { img: './img/teor-alcoolico.png', alt: 'porcentagem', titulo: '18%', descricaoCard: 'Teor Alcoólico' },
        { img: './img/Winter.png', alt: 'perfil', titulo: 'Refrescante', descricaoCard: 'Perfil' }
    ],
    preparo: 'Em uma coqueteleira, adicione todos os ingredientes com gelo. Agite bem e coe em um copo com gelo. Finalize com rodelas de laranja.',
    harmoniza: ['Frutos do mar', 'Saladas frescas', 'Petiscos leves'],
    dica: 'Fica ainda melhor com gelo e servido em um copo alto!'
}

//função para criar o menuHamburguer
export async function menuHamburguer() {
    try {
        const btnHamburger = document.getElementById('btn-hamburger');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuOverlay = document.getElementById('menu-overlay');

        // Inicialmente escondido
        mobileMenu.classList.add('hidden');
        menuOverlay.classList.add('hidden');

        // Função para abrir/fechar menu
        btnHamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            menuOverlay.classList.toggle('hidden');
        })

        // Fechar menu ao clicar no overlay
        menuOverlay.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuOverlay.classList.add('hidden');
        })

    } catch (error) {
        return false
    }
}

//aqui popula essa sessão com as categorias já cadastradas
export async function popularCategorias() {
    try {
        const json = await getCategorias()
        const categorias = json.response
        const container = document.getElementById('categorias').querySelector('div')

        while (container.firstChild) {
            container.removeChild(container.firstChild)
        }

        document.getElementById('container-produtos').classList.remove('hidden')

        categorias.forEach(categoria => {
            const link = document.createElement('a')
            link.href = '#'
            link.classList.add('block')
            link.addEventListener('click', (e) => {
                e.preventDefault()
                filtrarPorCategoria(categoria.nome)
                document.getElementById('container-produtos')
                    .scrollIntoView({ behavior: 'smooth' })
            })

            const card = document.createElement('div')
            card.className = 'bg-white rounded-full shadow-lg p-6 flex flex-col items-center text-center w-[150px] md:w-[190px] xl:w-[220px] transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl'

            const img = document.createElement('img')
            img.src = categoria.foto
            img.alt = categoria.nome
            img.className = 'w-[80px] h-[80px] md:w-[105px] md:h-[105px] xl:w-[120px] xl:h-[120px] rounded-full object-cover mb-3'
            card.appendChild(img)

            const titulo = document.createElement('h3')
            titulo.textContent = categoria.nome
            titulo.className = 'text-[12px] md:text-[14px] xl:text-[16px] font-medium'
            card.appendChild(titulo)

            const descricao = document.createElement('p')
            descricao.textContent = categoria.descricao || ''
            descricao.className = 'text-[10px] md:text-[12px] xl:text-[14px] text-gray-600 mt-1'
            card.appendChild(descricao)

            link.appendChild(card)
            container.appendChild(link)
        })
    } catch (error) {
        return false
    }
}


const containerProdutos = document.createElement('div')
containerProdutos.className = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 sm:gap-8 md:gap-12 lg:gap-12 xl:gap-12'

//cria os cards das bebidas, responsivo
function renderizarBebidas(lista) {
    try {
        const containerPai = document.getElementById('produtos'); // Alterado para buscar a div interna do HTML
        if (!containerPai) return;

        // Limpeza segura apenas dos produtos, não da página toda
        while (containerPai.firstChild) {
            containerPai.removeChild(containerPai.firstChild);
        }

        if (!lista || lista.length === 0) {
            const msg = document.createElement('p');
            msg.textContent = 'Nenhuma bebida encontrada para este filtro.';
            msg.className = 'col-span-full text-center text-gray-500 my-10';
            containerPai.appendChild(msg);
            return;
        }

        // Substitua apenas o trecho de criação do card dentro do forEach na função renderizarBebidas:

        lista.forEach(bebida => {
            // CARD PRINCIPAL - Removemos larguras fixas e usamos w-full e flex-col h-full
            const card = document.createElement('div');
            card.className = 'bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 w-full flex flex-col h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl';

            // IMAGEM
            const img = document.createElement('img');
            // Altura fixa com object-cover para padronizar o tamanho das imagens
            img.className = 'w-full h-[180px] xl:h-[240px] object-cover';
            img.src = (bebida.imagem && bebida.imagem.startsWith('http')) ? bebida.imagem : './img/logo.png';
            img.alt = bebida.nome;

            // CONTAINER INFO - Adicionado flex-grow para empurrar o botão sempre pro final
            const info = document.createElement('div');
            info.className = 'flex flex-col flex-grow p-4';

            const nome = document.createElement('h3');
            nome.className = 'font-bold text-[14px] xl:text-[18px] text-gray-800 line-clamp-1';
            nome.textContent = bebida.nome || 'Bebida Sem Nome';

            const categoria = document.createElement('span');
            categoria.className = 'text-[#00C3D0] text-[12px] xl:text-[14px] font-medium mt-1';
            categoria.textContent = (bebida.categorias && bebida.categorias.length > 0) ? bebida.categorias[0].nome : 'Geral';

            const descricao = document.createElement('p');
            descricao.className = 'text-[12px] xl:text-[14px] text-gray-600 mt-2 line-clamp-2'; 
            descricao.textContent = bebida.descricao || 'Bebida especial da casa.';

            // Container para o preço e botão ficarem no rodapé do card
            const rodape = document.createElement('div');
            rodape.className = 'mt-auto pt-4';

            const preco = document.createElement('h4');
            preco.className = 'font-bold text-[16px] xl:text-[20px] text-[#FF9100]';
            const valor = Number(bebida.preco) || 0;
            preco.textContent = `R$ ${valor.toFixed(2).replace('.', ',')}`;

            const btn = document.createElement('button');
            btn.className = 'w-full h-[36px] xl:h-[44px] flex justify-center items-center border-2 border-[#00C3D0] text-[#00C3D0] rounded-full mt-3 text-[13px] xl:text-[15px] font-bold hover:bg-[#00C3D0] hover:text-white transition-colors';
            btn.textContent = 'VER DETALHES';

            btn.addEventListener('click', () => {
                criarCardDetalhesBebida(bebida);
            });

            // MONTAGEM
            info.appendChild(nome);
            info.appendChild(categoria);
            info.appendChild(descricao);
            
            rodape.appendChild(preco);
            rodape.appendChild(btn);
            info.appendChild(rodape);

            card.appendChild(img);
            card.appendChild(info);

            containerPai.appendChild(card);
        });

    } catch (error) {
        console.error("Erro no renderizarBebidas:", error);
    }
}

//cria o car de detalhes das bebidas, acionado pelo botão ver etalhes
async function criarCardDetalhesBebida(bebida) {
    try {
        const json = await getTipos();
        const tipos = (json && json.response) 
            ? json.response.find(tipo => Number(tipo.id) === Number(bebida.id_tipo_bebida)) || {} 
            : {};

        // 1. EXTRAÇÃO E TRATAMENTO DE DADOS
        const volume = bebida.volume || tipos.volume || '350 ml';
        let teor = bebida.teor_alcoolico || tipos.teor_alcoolico || '0';
        if (!String(teor).includes('%')) teor += '%';

        const perfil = bebida.perfil_sabor || tipos.perfil_sabor || 'Refrescante';
        const preparo = bebida.modo_preparo || tipos.modo_preparo || 'Modo de preparo padrão.';
        const dica = bebida.dica_delicia || tipos.dica_delicia || 'Aproveite seu drink gelado!';
        const ingredientesRaw = bebida.ingredientes || tipos.ingredientes || 'Ingredientes não informados';
        
        const precoFormatado = Number(bebida.preco || 0).toFixed(2).replace('.', ',');
        const categoriaNome = (bebida.categorias && bebida.categorias.length > 0) ? bebida.categorias[0].nome : 'Categoria Geral';
        const imagemSrc = (bebida.imagem && bebida.imagem.startsWith('http')) ? bebida.imagem : './img/logo.png';
        const descricaoCurta = bebida.descricao || ingredientesRaw;

        // 2. SELEÇÃO DE CONTAINERS
        const containerPrincipal = document.getElementById('container-produtos');
        const gridProdutos = document.getElementById('produtos');
        gridProdutos.classList.add('hidden');

        // 3. CRIAÇÃO DO CONTAINER PRINCIPAL
        const cardDetalhes = document.createElement('div');
        cardDetalhes.id = 'view-detalhes-ativo';
        cardDetalhes.className = 'w-full max-w-[1200px] mx-auto p-4 md:p-8 fade-in';

        // --- BOTÃO VOLTAR ---
        const btnVoltar = document.createElement('button');
        btnVoltar.id = 'btn-voltar-detalhes';
        btnVoltar.className = 'flex items-center text-gray-500 hover:text-[#00C3D0] transition-colors mb-6 text-[32px] cursor-pointer bg-transparent border-none';
        btnVoltar.innerHTML = '&#8249;'; // Seta para esquerda
        cardDetalhes.appendChild(btnVoltar);

        // --- BLOCO SUPERIOR (IMAGEM + INFO) ---
        const topWrapper = document.createElement('div');
        topWrapper.className = 'flex flex-col md:flex-row gap-8 xl:gap-16 items-center md:items-start';

        // Coluna Esquerda: Imagem
        const imgContainer = document.createElement('div');
        imgContainer.className = 'w-full md:w-[45%]';
        const img = document.createElement('img');
        img.src = imagemSrc;
        img.alt = bebida.nome;
        img.className = 'w-full max-h-[500px] object-cover rounded-[10px] shadow-lg';
        imgContainer.appendChild(img);

        // Coluna Direita: Informações
        const infoContainer = document.createElement('div');
        infoContainer.className = 'w-full md:w-[55%] flex flex-col justify-center';

        const titulo = document.createElement('h1');
        titulo.className = 'text-[32px] md:text-[48px] font-bold text-black leading-tight';
        titulo.textContent = bebida.nome;

        const catSpan = document.createElement('span');
        catSpan.className = 'text-[#00C3D0] text-[20px] md:text-[24px] font-medium mt-1';
        catSpan.textContent = categoriaNome;

        const descP = document.createElement('p');
        descP.className = 'text-[18px] md:text-[22px] text-gray-700 mt-3 leading-snug';
        descP.textContent = descricaoCurta;

        const precoH2 = document.createElement('h2');
        precoH2.className = 'text-[32px] md:text-[40px] font-bold text-black mt-6';
        precoH2.textContent = `R$ ${precoFormatado}`;

        // Wrapper dos 3 Mini Cards (Volume, Teor, Perfil)
        const miniCardsWrapper = document.createElement('div');
        miniCardsWrapper.className = 'flex gap-4 mt-8 w-full justify-between sm:justify-start';

        // Função auxiliar para montar os mini cards
        const criarMiniCard = (iconSrc, value, label) => {
            const div = document.createElement('div');
            div.className = 'bg-[#EEF7F8] rounded-[10px] py-4 px-2 flex flex-col items-center justify-center w-full max-w-[130px]';
            
            const icone = document.createElement('img');
            icone.src = iconSrc;
            icone.className = 'w-8 h-8 mb-2';
            
            const spanValue = document.createElement('span');
            spanValue.className = 'font-bold text-[16px] text-black text-center';
            spanValue.textContent = value;
            
            const spanLabel = document.createElement('span');
            spanLabel.className = 'text-[12px] md:text-[14px] text-gray-600';
            spanLabel.textContent = label;

            div.append(icone, spanValue, spanLabel);
            return div;
        };

        miniCardsWrapper.appendChild(criarMiniCard('./img/Measuring Cup.png', volume, 'Volume'));
        miniCardsWrapper.appendChild(criarMiniCard('./img/teor-alcoolico.png', teor, 'Teor Alcoólico'));
        miniCardsWrapper.appendChild(criarMiniCard('./img/Winter.png', perfil, 'Perfil'));

        infoContainer.append(titulo, catSpan, descP, precoH2, miniCardsWrapper);
        topWrapper.append(imgContainer, infoContainer);
        cardDetalhes.appendChild(topWrapper);

        // --- LINHA DIVISÓRIA ---
        const hr = document.createElement('hr');
        hr.className = 'my-10 md:my-14 border-gray-200';
        cardDetalhes.appendChild(hr);

        // --- BLOCO DO MEIO (3 COLUNAS) ---
        const midWrapper = document.createElement('div');
        midWrapper.className = 'grid grid-cols-1 md:grid-cols-3 gap-8 text-center';

        // Função auxiliar para lidar com quebras de linha (<br>) no DOM
        const adicionarComQuebraDeLinha = (elementoPai, arrayDeTextos) => {
            arrayDeTextos.forEach((texto, index) => {
                elementoPai.appendChild(document.createTextNode(texto.trim()));
                if (index < arrayDeTextos.length - 1) {
                    elementoPai.appendChild(document.createElement('br'));
                }
            });
        };

        // Coluna 1: Ingredientes
        const colIngredientes = document.createElement('div');
        colIngredientes.className = 'flex flex-col items-center';
        const titleIngredientes = document.createElement('h3');
        titleIngredientes.className = 'font-bold text-[18px] md:text-[20px] text-black mb-4';
        titleIngredientes.textContent = 'Ingredientes';
        const pIngredientes = document.createElement('p');
        pIngredientes.className = 'text-[16px] text-gray-700 leading-relaxed';
        adicionarComQuebraDeLinha(pIngredientes, ingredientesRaw.split(','));
        colIngredientes.append(titleIngredientes, pIngredientes);

        // Coluna 2: Modo de preparo
        const colPreparo = document.createElement('div');
        colPreparo.className = 'flex flex-col items-center px-4 border-t md:border-t-0 md:border-l md:border-r border-gray-200 pt-6 md:pt-0';
        const titlePreparo = document.createElement('h3');
        titlePreparo.className = 'font-bold text-[18px] md:text-[20px] text-black mb-4';
        titlePreparo.textContent = 'Modo de preparo';
        const pPreparo = document.createElement('p');
        pPreparo.className = 'text-[16px] text-gray-700 leading-relaxed max-w-[300px]';
        pPreparo.textContent = preparo;
        colPreparo.append(titlePreparo, pPreparo);

        // Coluna 3: Harmoniza com
        const colHarmoniza = document.createElement('div');
        colHarmoniza.className = 'flex flex-col items-center border-t md:border-t-0 border-gray-200 pt-6 md:pt-0';
        const titleHarmoniza = document.createElement('h3');
        titleHarmoniza.className = 'font-bold text-[18px] md:text-[20px] text-black mb-4';
        titleHarmoniza.textContent = 'Harmoniza com';
        const pHarmoniza = document.createElement('p');
        pHarmoniza.className = 'text-[16px] text-gray-700 leading-relaxed';
        adicionarComQuebraDeLinha(pHarmoniza, ['Frutos do mar', 'Saladas frescas', 'Petiscos leves']);
        colHarmoniza.append(titleHarmoniza, pHarmoniza);

        midWrapper.append(colIngredientes, colPreparo, colHarmoniza);
        cardDetalhes.appendChild(midWrapper);

        // --- BLOCO INFERIOR (DICA DELÍCIA) ---
        const dicaWrapper = document.createElement('div');
        dicaWrapper.className = 'bg-[#EEF7F8] rounded-[10px] p-6 mt-12 mb-8 flex flex-col sm:flex-row items-center gap-4';

        const dicaIcon = document.createElement('div');
        dicaIcon.className = 'text-[32px] md:text-[40px]';
        dicaIcon.textContent = '💡';

        const dicaTextContainer = document.createElement('div');
        dicaTextContainer.className = 'flex flex-col sm:flex-row sm:items-center w-full gap-2 text-center sm:text-left';

        const dicaTitle = document.createElement('span');
        dicaTitle.className = 'font-bold text-[18px] text-black whitespace-nowrap';
        dicaTitle.textContent = 'Dica Delícia';

        const dicaSeparator = document.createElement('span');
        dicaSeparator.className = 'hidden sm:block text-gray-300 mx-2';
        dicaSeparator.textContent = '|';

        const dicaTextSpan = document.createElement('span');
        dicaTextSpan.className = 'text-[16px] text-gray-600';
        dicaTextSpan.textContent = dica;

        dicaTextContainer.append(dicaTitle, dicaSeparator, dicaTextSpan);
        dicaWrapper.append(dicaIcon, dicaTextContainer);
        cardDetalhes.appendChild(dicaWrapper);

        // 4. ADICIONA À TELA
        containerPrincipal.appendChild(cardDetalhes);

        // 5. EVENTO DE VOLTAR
        btnVoltar.addEventListener('click', () => {
            cardDetalhes.remove();
            gridProdutos.classList.remove('hidden');
        });

    } catch (error) {
        console.error("Erro ao criar tela de detalhes:", error);
    }
}

//função para iniciar a pagina
//função para iniciar a pagina
export async function iniciarPagina() {

    try {
        // Exibe o modal e espera a resposta (true ou false)
        const ehMaiorDe18 = await modalTelaInicial()

        const json = await getBebidas(ehMaiorDe18)
        todasBebidas = json.response
        if (!todasBebidas || todasBebidas.length == 0) {
            console.error('API veio vazia')
            return
        }

        console.log("BEBIDAS:", todasBebidas)
        renderizarBebidas(todasBebidas.slice(0, 4))

        await carregarCategorias()
        await carregarTipos()
        configurarEventos()

    } catch (error) {
        return false
    }
}

function modalTelaInicial() {
    return new Promise((resolve) => {
        const modal = document.getElementById('age-gate-modal')
        const btnSim = document.getElementById('btn-maior-idade')
        const btnNao = document.getElementById('btn-menor-idade')

        if (!modal) {
            resolve(true)
            return
        }

        // Verifica no navegador se o usuário já respondeu antes na mesma aba
        const jaVerificou = sessionStorage.getItem('idadeVerificada')
        if (jaVerificou) {
            modal.classList.add('hidden')
            resolve(jaVerificou === 'true')
            return
        }

        // Se clicou em SIM (Maior de idade)
        btnSim.addEventListener('click', () => {
            sessionStorage.setItem('idadeVerificada', 'true')
            modal.classList.add('hidden')
            resolve(true)
        })

        // Se clicou em NÃO (Menor de idade)
        btnNao.addEventListener('click', () => {
            sessionStorage.setItem('idadeVerificada', 'false')
            modal.classList.add('hidden')
            resolve(false)
        })
    })
}

//função para configurar todos os eventos seja click ou enter utilizado na pagina
function configurarEventos() {

    try {
        const btnTodos = document.getElementById('btn-ver-todos')
        const btnBusca = document.getElementById('btn-busca')
        const inputBusca = document.getElementById('busca-nome')
        const categoria = document.getElementById('categoria')
        const tipo = document.getElementById('tipo')
        const btnPreco = document.getElementById('btn-preco')
        const inputPesquisar = document.getElementById('input-pesquisar')
        const btnPesquisar = document.getElementById('botao-pesquisar')

        btnTodos.addEventListener('click', () => {
            renderizarBebidas(todasBebidas)
        })

        btnBusca.addEventListener('click', buscarPorNome)

        inputBusca.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') buscarPorNome()
        })

        categoria.addEventListener('change', filtrarTodos)
        tipo.addEventListener('change', filtrarTodos)

        btnPreco.addEventListener('click', filtrarPreco)

        inputPesquisar.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') buscaInputPesquisar()
        })

        btnPesquisar.addEventListener('click', buscaInputPesquisar)

        // console.log(document.getElementById('botao-pesquisar'))

    } catch (error) {
        return false
    }
}

//função para a busca por nome do drink
function buscarPorNome() {

    try {
        const valor = document.getElementById('busca-nome').value.toLowerCase()

        const filtrados = todasBebidas.filter(b =>
            (b.nome || '').toLowerCase().includes(valor)
        )

        renderizarBebidas(filtrados)

    } catch (error) {
        return false
    }
}

//filtra as bebidas por categoria e tipo, 
function filtrarTodos() {
    try {
        const categoriaSelecionada = document.getElementById('categoria').value;
        const tipoSelecionado = document.getElementById('tipo').value;

        const filtrados = todasBebidas.filter(b => {
            const categoriaAPI = (b.categorias && b.categorias.length > 0) ? b.categorias[0].nome : '';
            
            // Aceita se o select estiver na opção padrão ('Categoria' ou 'Tipo') OU se houver match
            const matchCategoria = !categoriaSelecionada || categoriaSelecionada === 'Categoria' || categoriaAPI === categoriaSelecionada;
            const matchTipo = !tipoSelecionado || tipoSelecionado === 'Tipo' || Number(b.id_tipo_bebida) === Number(tipoSelecionado);

            return matchCategoria && matchTipo;
        });

        renderizarBebidas(filtrados);
    } catch (error) {
        console.error("Erro no filtro múltiplo:", error);
    }
}

// Em filtrarPorCategoria, adicione isto para que ele volte ao normal ao invés de quebrar
function filtrarPorCategoria(nomeCategoria) {
    try {
        if (!nomeCategoria || nomeCategoria === 'Todos') {
             renderizarBebidas(todasBebidas);
             return;
        }

        const filtrados = todasBebidas.filter(b => {
            const categoriaAPI = (b.categorias && b.categorias.length > 0) ? b.categorias[0].nome : '';
            return categoriaAPI.toLowerCase() === nomeCategoria.toLowerCase();
        });

        renderizarBebidas(filtrados);
    } catch (error) {
        console.error("Erro ao filtrar categoria circular:", error);
    }
}

//Função para carregar o dropdown de tipo
async function carregarTipos() {

    try {
        const json = await getTipos()
        const tipos = json.response
        console.log(tipos)

        const select = document.getElementById('tipo')

        //limpe os elementos dentro do container
        while (select.firstChild) {
            select.removeChild(select.firstChild)
        }

        const optionDefault = document.createElement('option')
        optionDefault.value = ''
        optionDefault.textContent = 'Tipo'
        select.appendChild(optionDefault)

        tipos.forEach(tipo => {

            const option = document.createElement('option')
            option.value = tipo.id
            option.textContent = tipo.nome

            select.appendChild(option)
        })

    } catch (error) {
        return false
    }
}

//função para carregar o dropdown de categorias
async function carregarCategorias() {
    try {
        const json = await getCategorias()
        const categorias = json.response
        console.log(categorias)

        const select = document.getElementById('categoria')

        while (select.firstChild) {
            select.removeChild(select.firstChild)
        }

        const option1 = document.createElement('option')
        option1.value = ''
        option1.textContent = 'Categoria'
        select.appendChild(option1)

        categorias.forEach(categoria => {

            const option2 = document.createElement('option')
            option2.value = categoria.nome
            option2.textContent = categoria.nome

            select.appendChild(option2)
        })
    } catch (error) {
        return false
    }
}

//fuunção para filtrar pelo preço
function filtrarPreco() {
    try {
        const min = Number(document.getElementById('preco-min').value)
        const max = Number(document.getElementById('preco-max').value)

        const filtrados = todasBebidas.filter(valor => {

            const preco = Number(valor.preco)

            //se não houver minimo passa todos os preços, se tiver o preço precisa ser maior ou igual 
            //se não houver minimo passa todos os preços, se tiver o preço precisa ser menor ou igual 
            const calculo = (!min || preco >= min) && (!max || preco <= max)

            return calculo
        })

        renderizarBebidas(filtrados)

    } catch (error) {
        return false
    }
}

//função para campo de busca de produtos
function buscaInputPesquisar() {
    try {

        const input = document.getElementById('input-pesquisar')
        //.trim() remove espaços em branco no começo e no fim
        const valor = input.value.trim().toLowerCase()

        // se não digitou nada, volta tudo
        if (!valor) {
            renderizarBebidas(todasBebidas.slice(0, 4))
        }

        const filtrados = todasBebidas.filter(bebida => {
            //"?" ajuda a retornar undefined caso nao encontre o nome
            const nome = bebida.nome?.toLowerCase() || ''
            //metodo para verificar se um texto contém outro texto dentro dele
            const pesquisa = nome.includes(valor)

            return pesquisa
        })

        renderizarBebidas(filtrados)

        //faz com que tenha um scroll até o catalogo após a pesquisa
        document.getElementById('catalogo')
            .scrollIntoView({ behavior: 'smooth' })

    } catch (error) {
        return false
    }
}


