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

//função para filtrar as categorias, o card redondo
function filtrarPorCategoria(nomeCategoria) {

    try {
        const filtrados = todasBebidas.filter(b => {

            const categoria = b.categorias?.[0]?.nome || ''

            return categoria.toLowerCase() == nomeCategoria.toLowerCase()
        })

        renderizarBebidas(filtrados)

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

        while (containerProdutos.firstChild) {
            containerProdutos.removeChild(containerProdutos.firstChild)
        }

        const container = document.getElementById('container-produtos')
        container.className = 'flex justify-center'

        while (container.firstChild) {
            container.removeChild(container.firstChild)
        }

        if (!lista || lista.length == 0) {
            const msg = document.createElement('p')
            msg.textContent = 'nenhuma bebida encontrada'
            container.appendChild(msg)
            return
        }

        containerProdutos.classList.remove('hidden')

        lista.forEach(bebida => {

            // CARD PRINCIPAL

            const card = document.createElement('div')
            card.className =
                'card-bebida bg-white rounded-[10px] overflow-hidden shadow-xl border border-gray-100 w-[147px] sm:w-[190px] md:w-[207px] xl:w-[277px] h-[290px] xl:h-[423px] flex flex-wrap transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl mt-8'

            // IMAGEM
            const img = document.createElement('img')
            img.className = 'img-bebida w-full h-[150px] xl:h-[229px] object-cover'
            img.src = bebida.imagem
            img.alt = bebida.nome

            // CONTAINER INFO
            const info = document.createElement('div')
            info.className = 'flex flex-col justify-between pl-3'

            const nome = document.createElement('h3')
            nome.className = 'nome-bebida font-bold text-[11px] xl:text-[16px]'
            nome.textContent = bebida.nome

            const categoria = document.createElement('span')
            categoria.className = 'categoria-bebida text-[#00C3D0] text-[10px] xl:text-[14px] mt-1'
            categoria.textContent = bebida.categorias?.[0]?.nome || ''

            const descricao = document.createElement('p')
            descricao.className = 'descricao-bebida text-[10px] xl:text-[14px] mt-1 leading-[20px]'
            descricao.textContent = bebida.descricao

            const preco = document.createElement('h4')
            preco.className = 'preco-bebida font-bold mt-1 text-[11px] xl:text-[16px]'
            preco.textContent = `R$ ${bebida.preco}`

            // BOTÃO
            const divBtn = document.createElement('div')
            divBtn.className = 'flex justify-center w-full'

            const btn = document.createElement('button')
            btn.className = 'botao-card-ver-detalhes w-[99px] xl:w-[187px] h-[23px] xl:h-[45px] flex justify-center items-center border border-[#00C3D0] text-[#00C3D0] rounded-full mt-2 text-[11px] xl:text-[16px] font-semibold'
            btn.textContent = 'VER DETALHES'

            // EVENTO DO BOTÃO (abre detalhes)
            btn.addEventListener('click', () => {
                criarCardDetalhesBebida(bebida)
            })

            divBtn.appendChild(btn)

            // MONTAGEM
            info.appendChild(nome)
            info.appendChild(categoria)
            info.appendChild(descricao)
            info.appendChild(preco)

            card.appendChild(img)
            card.appendChild(info)
            card.appendChild(divBtn)

            containerProdutos.appendChild(card)

        })

        container.appendChild(containerProdutos)

    } catch (error) {
        return false
    }
}

//cria o car de detalhes das bebidas, acionado pelo botão ver etalhes
async function criarCardDetalhesBebida(bebida) {

    try {

        const json = await getTipos()
        const tipos = json.response

        // Oculta os cards
        containerProdutos.classList.add('hidden')

        // Container principal
        const cardDetalhes = document.createElement('div')
        cardDetalhes.classList.add('p-2', 'pl-4', 'xl:p-6', 'xl:pl-10')

        const btnVoltar = document.createElement('button')
        btnVoltar.classList.add('botao-voltar')

        // Cria a imagem
        const imgVoltar = document.createElement('img')
        imgVoltar.src = './img/Forward.png'
        imgVoltar.alt = 'seta para voltar'
        // Adiciona a imagem dentro do botão
        btnVoltar.appendChild(imgVoltar)

        // Adiciona o botão ao card de detalhes
        cardDetalhes.appendChild(btnVoltar)

        const containerImgInfo = document.createElement('div')
        containerImgInfo.className = 'sm:flex lg:flex xl:flex'
        // Imagem
        const img = document.createElement('img')
        img.src = bebida.imagem
        img.alt = bebida.nome
        img.className = 'w-[244px] h-[241px] ml-12 sm:w-[244px] sm:h-[241px] lg:w-[244px] lg:h-[241px] xl:w-[449px] xl:h-[467px] rounded-[10px] object-cover'
        containerImgInfo.appendChild(img)
        cardDetalhes.appendChild(containerImgInfo)

        // Informações iniciais
        const containerInfo = document.createElement('div')
        containerInfo.className = "flex flex-col justify-between sm:pl-6 lg:pl-6 xl:pl-6"

        const nome = document.createElement('h3')
        nome.textContent = bebida.nome
        nome.className = 'font-bold text-[18px] xl:text-[48px]'
        containerInfo.appendChild(nome)
        // containerImgInfo.appendChild(containerInfo)
        // cardDetalhes.appendChild(containerImgInfo)

        const categoria = document.createElement('span')
        categoria.textContent = bebida.categorias?.[0]?.nome || ''
        categoria.className = 'text-[#00C3D0] text-[18px] lg:text-[20px] xl:text-[36px] mt-1'
        containerInfo.appendChild(categoria)
        // containerImgInfo.appendChild(containerInfo)
        // cardDetalhes.appendChild(containerImgInfo)

        const descricao = document.createElement('p')
        descricao.textContent = bebida.descricao
        descricao.className = 'text-[18px] lg:text-[20px] xl:text-[36px] mt-1 leading-[20px]'
        containerInfo.appendChild(descricao)
        // containerImgInfo.appendChild(containerInfo)
        // cardDetalhes.appendChild(containerImgInfo)

        const preco = document.createElement('h4')
        preco.textContent = `R$${bebida.preco}`
        preco.className = 'font-bold mt-2 mb-4 xl:mb-0 xl:mt-6 text-[18px] lg:text-[24px] xl:text-[48px]'
        containerInfo.appendChild(preco)
        containerImgInfo.appendChild(containerInfo)
        cardDetalhes.appendChild(containerImgInfo)

        // Cards extras (volume, teor, perfil)
        const cardsExtras = document.createElement('div')
        cardsExtras.className = 'flex justify-between'

        // inicio do card
        const cardDiv = document.createElement('div')
        cardDiv.className = 'bg-[#E4F3F4] w-[91px] h-[74px] xl:w-[168px] xl:h-[144px] rounded-[10px] xl:mt-14 flex flex-col items-center justify-center xl:gap-2'

        // imagem
        const imgCard = document.createElement('img')
        imgCard.src = './img/Measuring Cup.png'
        imgCard.alt = 'copo medidor'
        imgCard.className = 'w-[20px] h-[20px] xl:w-[50px] xl:h-[50px]'
        cardDiv.appendChild(imgCard)

        const titulo = document.createElement('h4')
        titulo.textContent = tipos.volume
        titulo.className = 'font-bold text-[12px] xl:text-[20px]'
        cardDiv.appendChild(titulo)

        const descricaoCard = document.createElement('h4')
        descricaoCard.textContent = 'Volume'
        descricaoCard.className = 'text-[12px] xl:text-[20px]'
        cardDiv.appendChild(descricaoCard)
        // fim do card 

        //inicio card 2
        const cardDiv2 = document.createElement('div')
        cardDiv2.className = 'bg-[#E4F3F4] w-[91px] h-[74px] xl:w-[168px] xl:h-[144px] rounded-[10px] xl:mt-14 flex flex-col items-center justify-center xl:gap-2'

        const imgCard2 = document.createElement('img')
        imgCard2.src = './img/teor-alcoolico.png'
        imgCard2.alt = 'porcentagem de teor alcoolico'
        imgCard2.className = 'w-[20px] h-[20px] xl:w-[50px] xl:h-[50px]'
        cardDiv2.appendChild(imgCard2)

        const titulo2 = document.createElement('h4')
        titulo2.textContent = tipos.teor_alcoolico
        titulo2.className = 'font-bold text-[12px] xl:text-[20px]'
        cardDiv2.appendChild(titulo2)

        const descricaoCard2 = document.createElement('h4')
        descricaoCard2.textContent = 'Teor Alcoólico'
        descricaoCard2.className = 'text-[12px] xl:text-[20px]'
        cardDiv2.appendChild(descricaoCard2)
        //fim do card 2

        //inicio card 3
        const cardDiv3 = document.createElement('div')
        cardDiv3.className = 'bg-[#E4F3F4] w-[91px] h-[74px] xl:w-[168px] xl:h-[144px] rounded-[10px] xl:mt-14 flex flex-col items-center justify-center xl:gap-2'

        const imgCard3 = document.createElement('img')
        imgCard3.src = './img/Winter.png'
        imgCard3.alt = 'perfil'
        imgCard3.className = 'w-[20px] h-[20px] xl:w-[50px] xl:h-[50px]'
        cardDiv3.appendChild(imgCard3)

        const titulo3 = document.createElement('h4')
        titulo3.textContent = tipos.volume
        titulo3.className = 'font-bold text-[12px] xl:text-[20px]'
        cardDiv3.appendChild(titulo3)

        const descricaoCard3 = document.createElement('h4')
        descricaoCard3.textContent = 'Volume'
        descricaoCard3.className = 'text-[12px] xl:text-[20px]'
        cardDiv3.appendChild(descricaoCard3)
        //fim do card 3

        cardsExtras.appendChild(cardDiv)
        cardsExtras.appendChild(cardDiv2)
        cardsExtras.appendChild(cardDiv3)

        containerInfo.appendChild(cardsExtras)
        containerImgInfo.appendChild(containerInfo)
        cardDetalhes.appendChild(containerImgInfo)

        //linha
        const linha = document.createElement('hr')
        linha.className = 'bg-[#D9D9D9] xl:w-full mt-6 xl:mt-14'
        cardDetalhes.appendChild(linha)

        // Informações adicionais (ingredientes, preparo, harmonização)
        const infoAdicional = document.createElement('div')
        infoAdicional.className = 'flex flex-col md:flex-row justify-center p-4 md:gap-36 gap-8'

        // Ingredientes
        const ingDiv = document.createElement('div')
        ingDiv.className = 'flex flex-col items-center'
        const ingTitulo = document.createElement('h4')
        ingTitulo.textContent = 'Ingredientes'
        ingTitulo.className = 'font-bold mb-2'
        ingDiv.appendChild(ingTitulo)
        const p = document.createElement('p')
        p.textContent = bebida.descricao
        ingDiv.appendChild(p)
        infoAdicional.appendChild(ingDiv)

        // Modo de preparo
        const prepDiv = document.createElement('div')
        prepDiv.className = 'flex flex-col items-center mb-4 md:mb-0 text-center'
        const preparo = document.createElement('h4')
        preparo.textContent = 'Modo de preparo'
        preparo.className = 'font-bold mb-2'
        prepDiv.appendChild(preparo)
        const prepP = document.createElement('p')
        prepP.textContent = dadosBebida.preparo
        prepDiv.appendChild(prepP)
        infoAdicional.appendChild(prepDiv)

        // Harmoniza com
        const harmDiv = document.createElement('div')
        harmDiv.className = 'flex flex-col items-center'
        const harmoniza = document.createElement('h4')
        harmoniza.textContent = 'Harmoniza com'
        harmoniza.className = 'font-bold mb-2'
        harmDiv.appendChild(harmoniza)
        dadosBebida.harmoniza.forEach(h => {
            const p = document.createElement('p')
            p.textContent = h
            harmDiv.appendChild(p)
        })
        infoAdicional.appendChild(harmDiv)

        cardDetalhes.appendChild(infoAdicional)

        // Dica
        const dicaDiv = document.createElement('div')
        dicaDiv.className = 'flex justify-center mt-4'
        const dica = document.createElement('div')
        dica.className = 'bg-[#E4F3F4] flex justify-start items-center w-full gap-2 h-10 xl:gap-20 xl:w-[1274px] xl:h-[90px] xl:pl-8 rounded-[10px]'
        const dicaImg = document.createElement('img')
        dicaImg.src = './img/Idea.png'
        dicaImg.alt = 'lampada de ideia'
        dicaImg.className = 'w-[20px] xl:w-[25px] xl:h-[25px]'
        dica.appendChild(dicaImg)

        const dicaTitulo = document.createElement('h4')
        dicaTitulo.className = 'font-bold text-[10px] xl:text-[24px]'
        dicaTitulo.textContent = 'Dica Delícia'
        dica.appendChild(dicaTitulo)

        const dicaText = document.createElement('h4')
        dicaText.className = 'text-[#8E8E93] text-[10px] xl:text-[24px]'
        dicaText.textContent = dadosBebida.dica
        dica.appendChild(dicaText)

        dicaDiv.appendChild(dica)
        cardDetalhes.appendChild(dicaDiv)

        // Adiciona o card de detalhes ao DOM
        // O DOM (Document Object Model) é a representação da página HTML como uma árvore de elementos,
        // onde cada tag, atributo ou texto é um nó que pode ser acessado e manipulado pelo JavaScript.
        // Ele permite:
        // 1. Selecionar elementos da página (querySelector, getElementById, etc.)
        // 2. Alterar conteúdo e estilos dos elementos
        // 3. Adicionar ou remover elementos dinamicamente
        // 4. Capturar e responder a eventos do usuário (click, input, scroll, etc.)
        // Em resumo, o DOM é a ponte entre HTML e JavaScript, permitindo tornar a página interativa e dinâmica.

        // containerCards.parentNode - seleciona o elemento pai do container de cards
        // appendChild(cardDetalhes) - insere o card de detalhes como último filho do pai, fazendo ele aparecer na página
        // cardDetalhes.appendChild(containerInfo)
        containerProdutos.parentNode.appendChild(cardDetalhes)

        // Voltar
        btnVoltar.addEventListener('click', () => {
            cardDetalhes.remove()
            containerProdutos.classList.remove('hidden')
        })

    } catch (error) {
        return false
    }

}

//função para iniciar a pagina
export async function iniciarPagina() {

    try {

        const json = await getBebidas(true)
        
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

function modalTelaInicial(){

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
        const categoriaSelecionada = document.getElementById('categoria').value
        const tipoSelecionado = document.getElementById('tipo').value

        //percorre todas as bebidas e cria uma lista só com as que passam no filtro 
        const filtrados = todasBebidas.filter(b => {

            // b é um objeto dentro do foreach, "?" - significa "continua se existir", caso não exista retorna undefined
            const categoriaAPI = b.categorias?.[0]?.nome || ''

            const caregoria = !categoriaSelecionada || categoriaAPI == categoriaSelecionada

            const tipo = !tipoSelecionado || Number(b.id_tipo_bebida) == Number(tipoSelecionado)

            const pesquisa = caregoria && tipo

            return pesquisa
        })

        renderizarBebidas(filtrados)
    } catch (error) {
        return false
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
        option1.textContent = 'teste'
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


