/************************************************************************
PROJETO: Delícia Gelada
ARQUIVO: app.js
AUTOR: Diego de Pádua Bezerra de Lemos

Descrição:
Responsável pela manipulação dos elementos da página e renderização
dos cards dos drinks.
************************************************************************/

// Lista de drinks
const drinks = [

    {
        nome: "Orange Paradise",
        categoria: "Tropicais",
        descricao: "Vodka, suco de laranja, limão e essência tropical.",
        preco: 28.90,
        imagem: "./img/orange-paradise.png"
    },

    {
        nome: "Negroni",
        categoria: "Clássico",
        descricao: "Gin, Campari e Vermute Rosso.",
        preco: 26.90,
        imagem: "./img/negroni.png"
    },

    {
        nome: "Frozen Morango",
        categoria: "Frozen",
        descricao: "Rum, morango, leite condensado e gelo batido.",
        preco: 29.90,
        imagem: "./img/frozen-morango.png"
    },

    {
        nome: "Yellow Limonade",
        categoria: "Não Alcoólico",
        descricao: "Suco de limão, suco de laranja e água com gás.",
        preco: 18.90,
        imagem: "./img/yellow-limonade.png"
    }

]

// Captura o container do HTML
const containerCards =
document.getElementById('container-cards')

// Função que cria os cards
function carregarCards() {

    containerCards.innerHTML = ''

    drinks.forEach(drink => {

        containerCards.innerHTML += `
        <div class="bg-white rounded-[10px] overflow-hidden shadow-xl border border-gray-100 min-h-[430px] flex flex-col">

            <img
                src="${drink.imagem}"
                alt="${drink.nome}"
                class="w-full h-[230px] object-cover"
            >

            <div class="p-5 flex flex-col flex-1">

                <h3 class="font-bold text-[18px]">
                    ${drink.nome}
                </h3>

                <span class="text-[#00b8d4] text-[14px] mt-1">
                    ${drink.categoria}
                </span>

                <p class="text-[14px] text-gray-500 mt-3 leading-[20px]">
                    ${drink.descricao}
                </p>

                <h4 class="font-bold mt-4 text-[18px]">
                    R$ ${drink.preco.toFixed(2)}
                </h4>

                <button
                    class="w-full mt-auto border border-[#00b8d4]
                    text-[#00b8d4] rounded-full py-3 text-[13px] font-semibold">

                    VER DETALHES

                </button>

            </div>

        </div>

        `
    })
}

// Executa a função
carregarCards()