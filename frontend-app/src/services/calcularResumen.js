export const obtenerDiferencia = (i) => {

  return (

    Number(i.conteo || 0) -

    Number(i.sistema || 0)
  );
};

export const calcularResumen = (
  captura
) => {

  const totalSKUs =
    captura.length;

  const totalDiferencias =
    captura.filter(
      i => obtenerDiferencia(i) !== 0
    ).length;

  const sobrantes = captura
    .filter(i =>
      (
        obtenerDiferencia(i) *
        Number(i.costo || 0)
      ) > 0
    )
    .reduce(
      (acc, i) =>
        acc +
        (
          obtenerDiferencia(i) *
          Number(i.costo || 0)
        ),
      0
    );

  const faltantes = captura
    .filter(i =>
      (
        obtenerDiferencia(i) *
        Number(i.costo || 0)
      ) < 0
    )
    .reduce(
      (acc, i) =>
        acc +
        (
          obtenerDiferencia(i) *
          Number(i.costo || 0)
        ),
      0
    );

  const ajusteTotal = captura
    .reduce(
      (acc, i) =>
        acc +
        (
          obtenerDiferencia(i) *
          Number(i.costo || 0)
        ),
      0
    );

  return {

    totalSKUs,
    totalDiferencias,
    sobrantes,
    faltantes,
    ajusteTotal
  };
};