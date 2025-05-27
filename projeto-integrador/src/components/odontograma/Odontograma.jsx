import React, { useState } from "react";
import Dente from "./Dente";
import styles from "./Odontograma.module.css";
import DenteSVG from "../../assets/dente.svg"
import LegendaOdontograma from "./LegendaOdontograma";

const dentesInfo = [
  // Quadrante superior direito
  { numero: 18, label: "Terceiro Mol. Sup. Direito" },
  { numero: 17, label: "Segundo Mol. Sup. Direito" },
  { numero: 16, label: "Primeiro Mol. Sup. Direito" },
  { numero: 15, label: "Segundo Pré-molar Sup. Direito" },
  { numero: 14, label: "Primeiro Pré-molar Sup. Direito" },
  { numero: 13, label: "Canino Sup. Direito" },
  { numero: 12, label: "Incisivo Lateral Sup. Direito" },
  { numero: 11, label: "Incisivo Central Sup. Direito" },

  // Quadrante superior esquerdo
  { numero: 21, label: "Incisivo Central Sup. Esquerdo" },
  { numero: 22, label: "Incisivo Lateral Sup. Esquerdo" },
  { numero: 23, label: "Canino Sup. Esquerdo" },
  { numero: 24, label: "Primeiro Pré-molar Sup. Esquerdo" },
  { numero: 25, label: "Segundo Pré-molar Sup. Esquerdo" },
  { numero: 26, label: "Primeiro Mol. Sup. Esquerdo" },
  { numero: 27, label: "Segundo Mol. Sup. Esquerdo" },
  { numero: 28, label: "Terceiro Mol. Sup. Esquerdo" },

  // Quadrante inferior esquerdo
  { numero: 48, label: "Terceiro Mol. Inf. Esquerdo" },
  { numero: 47, label: "Segundo Mol. Inf. Esquerdo" },
  { numero: 46, label: "Primeiro Mol. Inf. Esquerdo" },
  { numero: 45, label: "Segundo Pré-molar Inf. Esquerdo" },
  { numero: 44, label: "Primeiro Pré-molar Inf. Esquerdo" },
  { numero: 43, label: "Canino Inf. Esquerdo" },
  { numero: 42, label: "Incisivo Lateral Inf. Esquerdo" },
  { numero: 41, label: "Incisivo Central Inf. Esquerdo" },

  // Quadrante inferior direito
  { numero: 31, label: "Incisivo Central Inf. Direito" },
  { numero: 32, label: "Incisivo Lateral Inf. Direito" },
  { numero: 33, label: "Canino Inf. Direito" },
  { numero: 34, label: "Primeiro Pré-molar Inf. Direito" },
  { numero: 35, label: "Segundo Pré-molar Inf. Direito" },
  { numero: 36, label: "Primeiro Mol. Inf. Direito" },
  { numero: 37, label: "Segundo Mol. Inf. Direito" },
  { numero: 38, label: "Terceiro Mol. Inf. Direito" },
];

export default function Odontograma({ onChange }) {
  const estadoInicial = {};
  dentesInfo.forEach(({ numero }) => {
    estadoInicial[numero] = "saudável";
  });

  const [estados, setEstados] = useState(estadoInicial);

 const onUpdateEstado = (numero, novoEstado) => {
  const novoEstadoAtualizado = { ...estados, [numero]: novoEstado };
  setEstados(novoEstadoAtualizado);
  onChange(novoEstadoAtualizado); // <- Envia para o pai
};
 
  
  const supDireito = dentesInfo.slice(0, 8).reverse();  // 18->11 (da direita p/ esquerda)
  const supEsquerdo = dentesInfo.slice(8, 16);         // 21->28 (da esquerda p/ direita)
  const infEsquerdo = dentesInfo.slice(16, 24).reverse(); // 48->41 (da esquerda p/ direita, invertido)
  const infDireito = dentesInfo.slice(24, 32);         // 31->38 (da direita p/ esquerda)

  return (
    <div className={styles.odontogramaContainer}>
      <div className={styles.linhaDentes}>
        <div className={styles.dentes}>
          <h4 className={styles.toothPosition}>Superior direito</h4>
          <div className={styles.alignTooth}>
            {supDireito.map(({ numero, label }) => (
              <div key={numero} className={styles.denteWrapper} title={label}>
                <Dente numero={numero} estado={estados[numero]} onUpdate={onUpdateEstado} />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.dentes}>
          <h4 className={styles.toothPosition}>Superior Esquerdo</h4>
          <div className={styles.alignTooth}>
            {supEsquerdo.map(({ numero, label }) => (
              <div key={numero} className={styles.denteWrapper} title={label}>
                <Dente numero={numero} estado={estados[numero]} onUpdate={onUpdateEstado} />
              </div>
            ))}
          </div>
        </div>
      </div>




      <div className={styles.linhaDentes}>
        <div className={styles.dentes}>
          <h4 className={styles.toothPosition}>Inferior Esquerdo</h4>
          <div className={styles.alignTooth}>
            {infEsquerdo.map(({ numero, label }) => (
              <div key={numero} className={styles.denteWrapper} title={label}>
                <Dente numero={numero} estado={estados[numero]} onUpdate={onUpdateEstado} />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.dentes}>
          <h4 className={styles.toothPosition}>Inferior Direito</h4>
          <div className={styles.alignTooth}>
            {infDireito.map(({ numero, label }) => (
              <div key={numero} className={styles.denteWrapper} title={label}>
                <Dente numero={numero} estado={estados[numero]} onUpdate={onUpdateEstado} />
              </div>
            ))}
          </div>
          <LegendaOdontograma />
        </div>
      </div>
    </div>
  );
}