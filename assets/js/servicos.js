servicos = (function ($) {
    var servicos = {};
    var fnErroDefault = function (e) {
        //if(e.status == 401){}
    };

    servicos.crm = {
        clickToCall: function (telefone, fnSucesso, fnErro) {
            telefone = telefone.replace("(", "").replace(")", "").replace("-", "").replace(" ", "");
            $.ajax({
                url: "https://api.unicesumar.edu.br/v1/ead/meligue/",
                type: 'POST',
                dataType: 'json',
                data: {
                    origem: "8867", destino: "0" + telefone
                },
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        }
    };

    servicos.token = {
        criarAccessToken: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'auth-server/oauth/token',
                type: 'POST',
                dataType: 'json',
                headers: {
                    'Authorization': tokenAccess
                },
                data: {
                    // utm: dados.utm,
                    grant_type: 'client_credentials'
                },
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
        criarUserToken: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/candidato/gerarToken',
                type: 'POST',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: JSON.stringify({
                    dsUtmCampaign: dados.utm.dsUtmCampaign,
                    dsUtmMedium: dados.utm.dsUtmMedium,
                    dsUtmSource: dados.utm.dsUtmSource,
                    dsUtmContent: dados.utm.dsUtmContent,
                    dsUtmTerm: dados.utm.dsUtmTerm,
                    cdGoogleId: dados.utm.cdGoogleId,
                    cdIp: dados.utm.cdIp
                })
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        }
    };

    servicos.pais = {
        listarPais: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/pais',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        }
    };

    servicos.curso = {
        listarPorPais: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/curso',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {
                    idPais: dados.idPais
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
        listarPorPaisNicho: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/curso',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {
                    idPais: dados.idPais,
                    idNicho: dados.idNicho
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
        listarPrecoPorCursoPolo: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/curso?idCurso=' + dados.idCurso + '&idPolo=' + dados.polo.idPolo,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {}
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
        listarMatrizCurricular: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/matriz-curricular',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {
                    idCurso: dados.idCurso
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        }

    };

    servicos.estado = {
        listarEstadoPorPaisECurso: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/estado',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {
                    idPais: dados.idPais,
                    idCurso: dados.idCurso
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
        listarEstadoPorPais: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/estado',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {
                    idPais: dados.idPais
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
        listarEstadoPorPaisCursoENicho: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/estado',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {
                    idPais: dados.idPais,
                    idCurso: dados.idCurso,
                    idNicho: dados.idNicho
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        }
    };

    servicos.endereco = {
        pegarDadosPorCep: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/cep/' + dados.cdCep,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                beforeSend: function () {
                    funcoes.habilitarCarregando();
                },
                complete: function () {
                    funcoes.desabilitarCarregando();
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
    };

    servicos.polo = {
        pegarDadosPorId: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/polo/' + dados.polo.idPolo,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
        listarPoloPorPaisCursoEstado: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/polo',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {
                    idPais: dados.idPais,
                    idCurso: dados.idCurso,
                    idEstado: dados.idEstado,
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
        listarPoloPorPaisCursoEstadoNicho: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/polo',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {
                    idPais: dados.idPais,
                    idCurso: dados.idCurso,
                    idEstado: dados.idEstado,
                    idNicho: dados.idNicho
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
        listarDataProva: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/prova-data/' + dados.polo.idPolo,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {
                    idPolo: dados.polo.idPolo
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
        listarHoraProva: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/prova-hora',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {
                    idPolo: dados.polo.idPolo,
                    dtProva: dados.dtProva
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
        listarDataEntrega: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/entrega-data/' + dados.polo.idPolo,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {}
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
        listarHoraEntrega: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/entrega-hora',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {
                    idPolo: dados.polo.idPolo,
                    dtEntrega: dados.dtEntrega
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },

    };

    servicos.primeiraHabilitacao = {
        listarCurso: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/curso-primeira-habilitacao/',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {}
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
        listarCursoPorTipo: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/curso-primeira-habilitacao/' + dados.cdHabilitacaoPrimeiraGraduacao,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        }
    };



    servicos.cidade = {
        listarCidadePorEstado: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/cidade',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {
                    idPais: dados.idPais,
                    idEstado: dados.idEstadoEndereco
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        }
    };

    servicos.pagamento = {
        listarFormaPagamento: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/candidato/' + dados.userToken + '/forma-pagamento',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {}
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        }
    };

    servicos.candidato = {
        salvarInteressado: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/candidato/' + dados.userToken + '/interessado',
                type: 'PUT',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: JSON.stringify({
                    'pais': {
                        'idPais': dados.idPais
                    },
                    'curso': {
                        'idCurso': dados.idCurso
                    },
                    'estado': {
                        'idEstado': dados.idEstado
                    },
                    'polo': {
                        'idPolo': dados.polo.idPolo
                    }
                }),
                beforeSend: function () {
                    funcoes.habilitarCarregando();
                },
                complete: function () {
                    funcoes.desabilitarCarregando();
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
        salvarPreContato: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/candidato/' + dados.userToken + '/pre-contato',
                type: 'PUT',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: JSON.stringify({
                })
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
        salvarContato: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/candidato/' + dados.userToken + '/contato',
                type: 'PUT',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: JSON.stringify({
                    'nmCandidato': dados.nmCandidato,
                    'dsEmail': dados.dsEmail,
                    'nrTelefone': dados.nrTelefone
                })
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
        salvarInscrito: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/candidato/' + dados.userToken + '/inscrito',
                type: 'PUT',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: JSON.stringify({
                    'nmCandidato': dados.nmCandidato,
                    'dsEmail': dados.dsEmail,
                    'nrTelefone': dados.nrTelefone,
                    'cdCpf': dados.cdCpf
                }),
                beforeSend: function () {
                    funcoes.habilitarCarregando();
                },
                complete: function () {
                    funcoes.desabilitarCarregando();
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);

        },
        salvarQualificado: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/candidato/' + dados.userToken + '/qualificado',
                type: 'PUT',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: JSON.stringify({
                    'cdTipoIngresso': dados.tipoIngresso,
                    'sgGenero': dados.sgGenero,
                    'dtNascimento': dados.dtNascimento,
                    'cdCep': dados.cdCep,
                    'dsEndereco': dados.dsEndereco,
                    'dsNumero': dados.dsNumero,
                    'dsComplemento': dados.dsComplemento,
                    'cidade': {
                        'idCidade': dados.idCidade
                    },
                    'dsBairro': dados.dsBairro,
                    'cdCupom': dados.cdCupom,
                    'dtProva': dados.dtProva,
                    'hrProva': dados.hrProva,
                    'dtEntrega': dados.dtEntrega,
                    'hrEntrega': dados.hrEntrega,
                    'cdHabilitacaoPrimeiraGraduacao': dados.cdHabilitacaoPrimeiraGraduacao,
                    'cursoPrimeiraHabilitacao': dados.idCursoPrimeiraHabilitacao ? {
                        'idCursoPrimeiraHabilitacao': dados.idCursoPrimeiraHabilitacao
                    } : null
                }),
                beforeSend: function () {
                    funcoes.habilitarCarregando();
                },
                complete: function () {
                    funcoes.desabilitarCarregando();
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
        salvarBoleto: function (dados, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/candidato/' + dados.userToken + '/forma-pagamento/' + dados.idFormaPagamento,
                type: 'PUT',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {},
                beforeSend: function () {
                    funcoes.habilitarCarregando();
                },
                complete: function () {
                    funcoes.desabilitarCarregando();
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
        listarBoletoPorCpf: function (cpf, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/reimpressao-boleto/' + cpf,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {
                    cdCpf: cpf
                },
                beforeSend: function () {
                    funcoes.habilitarCarregando();
                },
                complete: function () {
                    funcoes.desabilitarCarregando();
                }
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        },
    };

    servicos.cuponagem = {
        pegaDadosPorCupom: function (cupom, fnSucesso, fnErro) {
            $.ajax({
                url: baseUrl + 'central-captacao-api/cupom/' + cupom,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + dados.accessToken
                },
                data: {}
            }).done(fnSucesso).fail(fnErro || fnErroDefault);
        }
    };

    return servicos;
})(jQuery);

