import React from "react";
import styles from "./Table.module.css";
import { BiPencil, BiSearch } from "react-icons/bi";
import Button from "../button/Button";
import { useNavigate } from "react-router-dom";

const Table = ({ cases }) => {
  const navigate = useNavigate();

  const verDetalhes = (protocol) => {
    navigate(`/casos/detalhes/${protocol}`);
  };

  return (
    <div className={styles.container}>
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>protocolo</th>
            <th>titulo do caso</th>
            <th>tipo de caso</th>
            <th>nick paciente</th>
            <th>status caso</th>
            <th>Data</th>
            <th>Evidencia</th>
            <th>açoes</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((item, index) => (
            <tr key={index}>
              <td>{item.protocol}</td>
              <td>{item.title}</td>
              <td>{item.caseType}</td>
              <td>{item.patient.nic}</td>
              <td>{item.status}</td>
              <td>{item.openedAt}</td>
              <td>{item.evidence?.length || 0}</td>
              <td>
                <BiSearch
                  className={styles.icon}
                  title="Ver detalhes"
                  style={{ cursor: "pointer", marginRight: 10 }}
                  onClick={() => verDetalhes(item.protocol)}
                />
                <BiPencil className={styles.icon} title="Editar" />
                <Button>Adicionar evidencia</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
