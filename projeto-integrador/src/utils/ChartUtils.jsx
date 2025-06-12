export const filtrarPorData = (casos, inicio, fim) => {
  if (!casos) return [];

  return casos.filter((caso) => {
    if (!caso.data_do_caso) return false;
    const data = new Date(caso.data_do_caso);
    const dataInicio = inicio ? new Date(inicio) : null;
    const dataFim = fim ? new Date(fim) : null;
    return (!dataInicio || data >= dataInicio) && (!dataFim || data <= dataFim);
  });
};

export const contarOcorrencias = (dados, chave) => {
  const contagem = {};
  if (!dados) return contagem;

  dados.forEach((item) => {
    try {
      const valor = chave.includes(".")
        ? chave.split(".").reduce((o, k) => o && o[k], item)
        : item[chave];
      if (valor !== undefined && valor !== null) {
        contagem[valor] = (contagem[valor] || 0) + 1;
      }
    } catch {
      console.error();
    }
  });
  return contagem;
};
