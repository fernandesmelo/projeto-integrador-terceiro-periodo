import React, { useEffect, useState } from "react";
import styles from "./TableUsers.module.css";
import { BiPencil, BiSearch } from "react-icons/bi";
import Button from "../button/Button";
import { HiOutlineExclamation } from "react-icons/hi";
import { TbFileReport } from "react-icons/tb";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";
import Swal from "sweetalert2";

const TableUsers = () => {
  const urlDelete = 'https://sistema-odonto-legal.onrender.com/api/user/delete'
  const urlEdit = 'https://sistema-odonto-legal.onrender.com/api/user/profile'
  const token = localStorage.getItem("token")

  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://sistema-odonto-legal.onrender.com/api/search/all', {
        headers: {
          Authorization: `bearer ${localStorage.getItem("token")}`
        }
      });
      setUsers(response.data); // Atualiza a lista
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    }
  };

  useEffect(() => {
    fetchUsers(); // Carrega a lista ao abrir o componente
  }, []);


  const deleteUser = async (id) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Essa ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(urlDelete, {
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`
          },
          params: {
            id: id
          }
        })
        console.log('usuario deletado com sucesso!', response.data)
        Swal.fire(
          'Deletado!',
          'O usuário foi removido com sucesso.',
          'success'
        );

        fetchUsers()

      } catch (err) {
        console.error(err)
      }
    }
  }




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
                    title="Editar"
                    onClick={() => openEditModal(e)} />

                  <RiDeleteBinLine
                    title="deletar"
                    onClick={() => deleteUser(e.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Editar Usuário</h2>
            <label htmlFor="name">Nome:</label>
            <input
              id="name"
              name="name"
              value={editingUser.name}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              placeholder="Nome"
            />

            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              placeholder="Email"
            />

            <label htmlFor="city">Cidade:</label>
            <input
              id="city"
              name="city"
              value={editingUser.address.city}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  address: { ...editingUser.address, city: e.target.value },
                })
              }
              placeholder="Cidade"
            />

            <label htmlFor="state">Estado:</label>
            <input
              id="state"
              name="state"
              value={editingUser.address.state}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  address: { ...editingUser.address, state: e.target.value },
                })
              }
              placeholder="Estado"
            />

            <label htmlFor="street">Rua:</label>
            <input
              id="street"
              name="street"
              value={editingUser.address.street}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  address: { ...editingUser.address, street: e.target.value },
                })
              }
              placeholder="Rua"
            />

            <label htmlFor="district">Bairro:</label>
            <input
              id="district"
              name="district"
              value={editingUser.address.district}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  address: { ...editingUser.address, district: e.target.value },
                })
              }
              placeholder="Bairro"
            />

            <label htmlFor="houseNumber">Número:</label>
            <input
              id="houseNumber"
              name="houseNumber"
              value={editingUser.address.houseNumber}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  address: {
                    ...editingUser.address,
                    houseNumber: e.target.value,
                  },
                })
              }
              placeholder="Número"
            />

            <div className={styles.modalButtons}>
              <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button onClick={async () => {
                console.log("Token:", token);

                if (!token) {
                  Swal.fire("Erro", "Token de autenticação não encontrado.", "error");
                  return;
                }

                try {
                  const formattedDateOfBirth = new Date(editingUser.dateOfBirth).toISOString().split('T')[0];
                  const updatedUser = {
                    ...editingUser,
                    dateOfBirth: formattedDateOfBirth,
                  };

                  console.log("Editando usuário com ID:", editingUser.id);

                  await axios.put(urlEdit, updatedUser, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                    params: {
                      id : editingUser.id
                    }
                  });

                  Swal.fire("Atualizado!", "O usuário foi editado com sucesso.", "success");
                  setIsModalOpen(false);
                  fetchUsers();
                } catch (err) {
                  Swal.fire("Erro", "Não foi possível atualizar o usuário", "error");
                  console.error(err);
                }
              }}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default TableUsers;
