export const generateTemporaryPassword = () => {
  const
    min = 1000,
    max = 9999,
    raw = Math.floor(Math.random() * (max - min + 1)) + min;

  return String(raw);
};

export const prepareUser = ({ nume, prenume, marca, grup }, temporaryPassword) => ({
  name  : `${nume} ${prenume}`,
  marca : Number(marca),
  group : grup,
  temporaryPassword,

  requireChange: true,
});
