import styles from './LegendaOdontograma.module.css';

const LegendaOdontograma = () => {
  const estados = [
    { nome: 'Saudável', classe: 'saudavel' },
    { nome: 'Ausente', classe: 'ausente' },
    { nome: 'Restaurado', classe: 'restaurado' },
    { nome: 'Fraturado', classe: 'fraturado' },
    { nome: 'Cariado', classe: 'cariado' },
    { nome: 'Implante', classe: 'implante' },
    { nome: 'Outro', classe: 'outro' },
  ];

  return (
    <div className={styles.legendaOdontograma}>
      {estados.map((estado) => (
        <div className={styles.itemLegenda} key={estado.classe}>
          <span className={`${styles.corLegenda} ${styles[estado.classe]}`} />
          <span className={styles.name}>{estado.nome}</span>
        </div>
      ))}
    </div>
  );
};

export default LegendaOdontograma;