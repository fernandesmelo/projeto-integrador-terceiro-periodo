import React, { useEffect } from "react";
import styles from "./TableUsers.module.css";
import { BiPencil, BiSearch } from "react-icons/bi";
import Button from "../button/Button";
import { useNavigate } from "react-router-dom";
import { HiOutlineExclamation } from "react-icons/hi";
import { TbFileReport } from "react-icons/tb";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";

const TableUsers = ({ users }) => {
  const navigate = useNavigate();
  const url = 'https://sistema-odonto-legal.onrender.com/api/user/profile'
  useEffect(() => {
    const deleteUser = async () => {
      const response = await axios.delete(url, {

      })
    }
  }, [])

  const verDetalhes = (protocol) => {
    navigate(`/casos/detalhes/${protocol}`);
  };

  const addEvidence = (protocol) => {
    navigate(`/casos/evidencia/${protocol}`);
  };

  return (
    <div className={styles.container}>
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>nome</th>
            <th>data de nascimento</th>
            <th>cargo</th>
            <th>cpf</th>
            <th>email</th>
            <th>cidade</th>
            <th>estado</th>
            <th>açoes</th>
          </tr>
        </thead>
        <tbody>
          {users.map((e, i) => (
            <tr key={i}>
              <td>{e.name}</td>
              <td>{e.dateOfBirth}</td>
              <td>{e.role}</td>
              <td>{e.cpf}</td>
              <td>{e.email}</td>
              <td>{e.address.city}</td>
              <td>{e.address.state}</td>

              <td>
                <div style={{ cursor: 'pointer', display: 'flex', gap: 5 }}>
                  <BiSearch
                    className={styles.icon}
                    title="Ver detalhes"
                    style={{ cursor: "pointer" }}

                  />
                  <BiPencil
                    className={styles.icon}
                    title="Editar" />
                  <HiOutlineExclamation

                    className={styles.icon}
                    title="Adicionar Evidencia" />
                  <TbFileReport
                    title="relatorio"
                  />
                  <RiDeleteBinLine 
                    title="deletar"
                    onClick={deleteUser}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableUsers;
