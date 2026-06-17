/************************************************************************
PROJETO: Delícia Gelada
ARQUIVO: app.js
AUTOR: Diego de Pádua Bezerra de Lemos e Mayara Martins de Andrade
VERSÃO: 1.0.2

Descrição:
Responsável pela manipulação dos elementos da página e renderização
dos cards dos drinks.
************************************************************************/

// // Lista de drinks
// const drinks = [

//     {
//         nome: "Orange Paradise",
//         categoria: "Tropicais",
//         descricao: "Vodka, suco de laranja, limão e essência tropical.",
//         preco: 28.90,
//         imagem: "./img/orange-paradise.png"
//     },

//     {
//         nome: "Negroni",
//         categoria: "Clássico",
//         descricao: "Gin, Campari e Vermute Rosso.",
//         preco: 26.90,
//         imagem: "./img/negroni.png"
//     },

//     {
//         nome: "Frozen Morango",
//         categoria: "Frozen",
//         descricao: "Rum, morango, leite condensado e gelo batido.",
//         preco: 29.90,
//         imagem: "./img/frozen-morango.png"
//     },

//     {
//         nome: "Yellow Limonade",
//         categoria: "Não Alcoólico",
//         descricao: "Suco de limão, suco de laranja e água com gás.",
//         preco: 18.90,
//         imagem: "./img/yellow-limonade.png"
//     }

// ]

// // Captura o container do HTML
// const containerCards =
//     document.getElementById('container-cards')

// // Função que cria os cards
// function carregarCards() {

//     containerCards.innerHTML = ''

//     drinks.forEach(drink => {

//         containerCards.innerHTML += `
//         <div class="bg-white rounded-[10px] overflow-hidden shadow-xl border border-gray-100 min-h-[430px] flex flex-col">

//             <img
//                 src="${drink.imagem}"
//                 alt="${drink.nome}"
//                 class="w-full h-[230px] object-cover"
//             >

//             <div class="p-5 flex flex-col flex-1">

//                 <h3 class="font-bold text-[18px]">
//                     ${drink.nome}
//                 </h3>

//                 <span class="text-[#00b8d4] text-[14px] mt-1">
//                     ${drink.categoria}
//                 </span>

//                 <p class="text-[14px] text-gray-500 mt-3 leading-[20px]">
//                     ${drink.descricao}
//                 </p>

//                 <h4 class="font-bold mt-4 text-[18px]">
//                     R$ ${drink.preco.toFixed(2)}
//                 </h4>

//                 <button
//                     class="w-full mt-auto border border-[#00b8d4]
//                     text-[#00b8d4] rounded-full py-3 text-[13px] font-semibold">

//                     VER DETALHES

//                 </button>

//             </div>

//         </div>

//         `
//     })
// }

// // Executa a função
// carregarCards()


//------------------------------menu hamburguer ------------------------------

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

//------------------------------------------------------------------------------------

//--------------------------fUNÇÃO PARA BOTÃO VER DETALHES ---------------------------

/// Seleciona container dos cards
const containerCards = document.getElementById('produtos')

// Função para criar o card de detalhes
function criarCardDetalhesBebida(dados) {
    // Oculta os cards
    containerCards.classList.add('hidden')

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
    img.src = dados.img
    img.alt = dados.titulo
    img.className = 'w-[244px] h-[241px] ml-12 sm:w-[244px] sm:h-[241px] lg:w-[244px] lg:h-[241px] xl:w-[449px] xl:h-[467px] rounded-[10px] object-cover'
    containerImgInfo.appendChild(img)
    cardDetalhes.appendChild(containerImgInfo)

    // Informações iniciais
    const containerInfo = document.createElement('div')
    containerInfo.className = "flex flex-col justify-between sm:pl-6 lg:pl-6 xl:pl-6"

    const nome = document.createElement('h3')
    nome.textContent = dados.titulo
    nome.className = 'font-bold text-[18px] xl:text-[48px]'
    containerInfo.appendChild(nome)
    // containerImgInfo.appendChild(containerInfo)
    // cardDetalhes.appendChild(containerImgInfo)

    const categoria = document.createElement('span')
    categoria.textContent = dados.categoria
    categoria.className = 'text-[#00C3D0] text-[18px] lg:text-[20px] xl:text-[36px] mt-1'
    containerInfo.appendChild(categoria)
    // containerImgInfo.appendChild(containerInfo)
    // cardDetalhes.appendChild(containerImgInfo)

    const descricao = document.createElement('p')
    descricao.textContent = dados.descricao
    descricao.className = 'text-[18px] lg:text-[20px] xl:text-[36px] mt-1 leading-[20px]'
    containerInfo.appendChild(descricao)
    // containerImgInfo.appendChild(containerInfo)
    // cardDetalhes.appendChild(containerImgInfo)

    const preco = document.createElement('h4')
    preco.textContent = dados.preco
    preco.className = 'font-bold mt-2 mb-4 xl:mb-0 xl:mt-6 text-[18px] lg:text-[24px] xl:text-[48px]'
    containerInfo.appendChild(preco)
    // containerImgInfo.appendChild(containerInfo)
    // cardDetalhes.appendChild(containerImgInfo)

    // Cards extras (volume, teor, perfil)
    const cardsExtras = document.createElement('div')
    cardsExtras.className = 'flex justify-between'
    dados.cards.forEach(c => {
        const cardDiv = document.createElement('div')
        cardDiv.className = 'bg-[#E4F3F4] w-[91px] h-[74px] xl:w-[168px] xl:h-[144px] rounded-[10px] xl:mt-14 flex flex-col items-center justify-center xl:gap-2'

        const imgCard = document.createElement('img')
        imgCard.src = c.img
        imgCard.alt = c.alt
        imgCard.className = 'w-[20px] h-[20px] xl:w-[50px] xl:h-[50px]'
        cardDiv.appendChild(imgCard)

        const titulo = document.createElement('h4')
        titulo.textContent = c.titulo
        titulo.className = 'font-bold text-[12px] xl:text-[20px]'
        cardDiv.appendChild(titulo)

        const descricaoCard = document.createElement('h4')
        descricaoCard.textContent = c.descricaoCard
        descricaoCard.className = 'text-[12px] xl:text-[20px]'
        cardDiv.appendChild(descricaoCard)

        cardsExtras.appendChild(cardDiv)
    })
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
    dados.ingredientes.forEach(i => {
        const p = document.createElement('p')
        p.textContent = i
        ingDiv.appendChild(p)
    })
    infoAdicional.appendChild(ingDiv)

    // Modo de preparo
    const prepDiv = document.createElement('div')
    prepDiv.className = 'flex flex-col items-center mb-4 md:mb-0 text-center'
    const preparo = document.createElement('h4')
    preparo.textContent = 'Modo de preparo'
    preparo.className = 'font-bold mb-2'
    prepDiv.appendChild(preparo)
    const prepP = document.createElement('p')
    prepP.textContent = dados.preparo
    prepDiv.appendChild(prepP)
    infoAdicional.appendChild(prepDiv)

    // Harmoniza com
    const harmDiv = document.createElement('div')
    harmDiv.className = 'flex flex-col items-center'
    const harmoniza = document.createElement('h4')
    harmoniza.textContent = 'Harmoniza com'
    harmoniza.className = 'font-bold mb-2'
    harmDiv.appendChild(harmoniza)
    dados.harmoniza.forEach(h => {
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
    dica.className = 'bg-[#E4F3F4] flex justify-start items-center w-fit gap- h-10 xl:gap-20 xl:w-[1274px] xl:h-[90px] xl:pl-8 rounded-[10px]'
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
    dicaText.textContent = dados.dica
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
    containerCards.parentNode.appendChild(cardDetalhes)

    // Voltar
    btnVoltar.addEventListener('click', () => {
        cardDetalhes.remove()
        containerCards.classList.remove('hidden')
    })
}

// Seleciona todos os botões "Ver Detalhes" e adiciona um evento de clique que:
// 1. Encontra o card correspondente ao botão clicado.
// 2. Coleta todas as informações do card (imagem, nome, categoria, descrição, preço, cards extras, ingredientes, preparo, harmonização, dica).
// 3. Chama a função criarCardDetalhesBebida passando esses dados para gerar dinamicamente o card de detalhes.
// Adiciona evento aos botões "Ver Detalhes"
document.querySelectorAll('#botao-card-ver-detalhes').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('#card-bebida')
        const dadosBebida = {
            img: card.querySelector('#img-bebida').src,
            titulo: card.querySelector('#nome-bebida').textContent,
            categoria: card.querySelector('#categoria-bebidda').textContent,
            descricao: card.querySelector('#descricao-bebida').textContent,
            preco: card.querySelector('#preco-bebida').textContent,
            cards: [
                { img: './img/Measuring Cup.png', alt: 'copo medidor', titulo: '350 ml', descricaoCard: 'Volume' },
                { img: './img/teor-alcoolico.png', alt: 'porcentagem', titulo: '18%', descricaoCard: 'Teor Alcoólico' },
                { img: './img/Winter.png', alt: 'perfil', titulo: 'Refrescante', descricaoCard: 'Perfil' }
            ],
            ingredientes: ['Vodka', 'Suco de laranja', 'Limão', 'Essência tropical', 'Gelo'],
            preparo: 'Em uma coqueteleira, adicione todos os ingredientes com gelo. Agite bem e coe em um copo com gelo. Finalize com rodelas de laranja.',
            harmoniza: ['Frutos do mar', 'Saladas frescas', 'Petiscos leves'],
            dica: 'Fica ainda melhor com gelo e servido em um copo alto!'
        }
        criarCardDetalhesBebida(dadosBebida)
    })
})

//------------------------------------------------------------------------------------
