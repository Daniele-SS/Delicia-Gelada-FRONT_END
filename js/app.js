/************************************************************************
PROJETO: Delícia Gelada
ARQUIVO: app.js
AUTOR: Diego de Pádua Bezerra de Lemos e Mayara Martins de Andrade
VERSÃO: 1.0.1

CORREÇÕES v1.0.1:
  - BUG #6: Removida a chamada duplicada de popularCategorias().
            Ela já é chamada internamente dentro de iniciarPagina(),
            que por sua vez espera o modal de idade ser respondido primeiro.
            Chamar popularCategorias() aqui causava:
            (a) execução antes do modal de idade ser fechado
            (b) race condition sobrescrevendo o resultado de iniciarPagina()
************************************************************************/

import { iniciarPagina, menuHamburguer, popularCategorias } from './functions.js'

iniciarPagina()
popularCategorias()
menuHamburguer()

// popularCategorias() — REMOVIDO (BUG #6)
// já é chamado dentro de iniciarPagina() via carregarCategorias()