import { addMonths, isAfter, isBefore, isEqual, subMonths } from 'date-fns';
import { Infracao } from '../entities/Infracao';
import { BadRequestError, NotFoundError } from '../helpers/api-errors';

//#region ENUMS
export enum Gravidade {
  BAIXA = 3,
  MEDIA = 5,
  GRAVE = 7,
  GRAVISSIMA = 12
}

const gravidades = {
  BAIXA: 3,
  MEDIA: 5,
  GRAVE: 7,
  GRAVISSIMA: 12
};
//#endregion
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//#region VERIFICAÇÃO DE DOCUMENTOS

export class VerificacaoPassaporte {
  // Formatar o número do passaporte brasileiro
  static validarPassaporte(numeroPassaporte: string): string {
    if (!numeroPassaporte || typeof numeroPassaporte !== 'string') {
      throw new BadRequestError('Número de passaporte vazio.');
    }

    // Remover caracteres não alfanuméricos
    const passaporteLimpo = numeroPassaporte.replace(/[^A-Za-z0-9]/g, '');

    // Verificar se o passaporte limpo tem o formato correto
    if (!/^[A-Za-z]{2}\d{6}$/.test(passaporteLimpo)) {
      throw new BadRequestError('Número de passaporte incorreto.');
    }

    // Formatar o passaporte para o padrão brasileiro (duas letras seguidas de seis números)
    const letras = passaporteLimpo.slice(0, 2).toUpperCase();
    const numeros = passaporteLimpo.slice(2, 8);

    return `${letras}${numeros}`;
  }
}

export class VerificacaoCPF {
  // Verificação: O número do CPF brasileiro deve seguir o formato padrão

  static validarCPF(cpf: string): string {
    if (!cpf || cpf !== String(cpf)) {
      throw new BadRequestError('Número de CPF vazio.');
    }

    // Remover caracteres não numéricos
    const cpfNumeros = cpf.replace(/\D/g, '');

    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpfNumeros)) {
      throw new BadRequestError('Número de CPF inválido: CPF digitado incorretamente');
    }

    // Calcular os dígitos verificadores
    const calcularDigito = (base: string) => {
      let soma = 0;
      for (let i = 0; i < base.length; i++) {
        soma += parseInt(base[i]) * (base.length + 1 - i);
      }
      const resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
    };

    const base = cpfNumeros.slice(0, 9);
    const digito1 = calcularDigito(base);
    const digito2 = calcularDigito(base + digito1);

    if (cpfNumeros === base + digito1.toString() + digito2.toString())
      return cpfNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    else throw new BadRequestError('Número de CPF inválido: Calculo de CPF retornou inválido.');
  }
}
//#endregion
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//#region REGRAS DE NEGÓCIO

// Para verificar se um viajante pode viajar para um dado período, existem as seguintes regras:

// Verificação 1: O viajante não pode viajar para antes de seu nascimento
export class VerificacaoNascimento {
  static verificar(dataNascimento: Date, dataViagem: Date): boolean {
    if (!dataNascimento || !dataViagem || !(dataNascimento instanceof Date) || !(dataViagem instanceof Date)) {
      throw new BadRequestError('Data de nascimento ou data de viagem inválida.');
    }

    const dataNascimentoUTC = new Date(dataNascimento.toISOString());
    const dataViagemUTC = new Date(dataViagem.toISOString());

    return isBefore(dataViagemUTC, dataNascimentoUTC) || isEqual(dataViagemUTC, dataNascimentoUTC);
  }
}

export class VerificacaoPontos {
  // Verificação 2: O viajante não pode viajar se houver mais de 12 pontos de infrações nos últimos 12 meses da data atual
  static verificarInfracaoUltimos12Meses(infracoes: Infracao[]): boolean {

    const dataAtual = new Date();
    const dozeMesesAntes = subMonths(dataAtual, 12);

    const pontosUltimos12Meses = infracoes
      .map(({ data, gravidade }) => {
        return { data: new Date(data), gravidade: gravidades[gravidade as keyof typeof Gravidade] }
      })
      .filter(({ data }) => isAfter(data, dozeMesesAntes) && isBefore(data, dataAtual))
      .reduce((total, { gravidade }) => total + gravidade, 0);

    return !(pontosUltimos12Meses <= 12);
  }

  // Verificação 3: O viajante não pode viajar se tiver cometido qualquer tipo de infração um ano antes ou depois do período desejado.
  static verificarInfracaoAnteriorDepois(infracoes: Infracao[], dataViagem: Date): boolean {
    if (!dataViagem || !(dataViagem instanceof Date) || isNaN(dataViagem.getTime())) {
      throw new BadRequestError('Data da viagem inválida.');
    }

    const dozeMesesAntes = subMonths(dataViagem, 12);
    const dozeMesesDepois = addMonths(dataViagem, 12);

    const temInfracaoNoPeriodo = infracoes.some(({ data }) => {
      if (!data || !(data instanceof Date) || isNaN(data.getTime())) {
        console.warn('Data da infração inválida:', data);
        return false;
      }

      return isAfter(data, dozeMesesAntes) && isBefore(data, dozeMesesDepois);
    });

    return temInfracaoNoPeriodo;
  }
}

//#endregion