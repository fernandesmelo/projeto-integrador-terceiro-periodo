import { useState, useEffect } from "react";
import styles from "./TableVictims.module.css";
import { BiPencil, BiSearch, } from "react-icons/bi";
import Swal from "sweetalert2";
import axios from "axios";

import ModalVictim from "./modalVictim";
import Button from "../button/Button";


const TableVictims = ({ victims }) => {
    const token = localStorage.getItem("token");
    const [tableVictims, setTableVictims] = useState(victims);
    const [modalOpen, setModalOpen] = useState(false);
    const [, setSelectedVictim] = useState(null);
    const [editedVictim, setEditedVictim] = useState({});

    useEffect(() => {
        setTableVictims(victims);
    }, [victims]);











    const handleChange = (e) => {
        const { name, value } = e.target
        setEditedVictim((data) => ({
            ...data,
            [name]: name === "age" ? Number(value) : value
        }))
    }
    console.log('editar a vitima', editedVictim)


    const handleSave = async () => {
        try {
            await axios.put("https://sistema-odonto-legal.onrender.com/api/patient/update", editedVictim, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    nic: editedVictim.nic,
                }
            })
            Swal.fire(
                "Atualizado!",
                "A vitima foi editada com sucesso.",
                "success"
            );

            setTableVictims((data) =>
                data.map((victim) =>
                    victim.nic === editedVictim.nic ? { ...victim, ...editedVictim } : victim
                )
            )

            setModalOpen(false)

        } catch (err) {
            Swal.fire(
                "Erro",
                "Não foi possível atualizar o usuário",
                "error"
            );
            console.error(err);
        }
    }

    return (
        <div className={styles.container}>
            <table className={styles.tabela}>
                <thead>
                    <tr>
                        <th>Nic</th>
                        <th>Estados de indentificacao</th>
                        <th>Nome</th>
                        <th>Idade</th>
                        <th>Genero</th>
                        <th>CPF</th>
                        <th>Status do caso</th>
                        <th>Id do caso</th>
                        <th>Data</th>
                        <th>Acoes</th>
                    </tr>
                </thead>
                <tbody>
                    {tableVictims.map((item, index) => (
                        <tr key={index}>
                            <td>{item.nic}</td>
                            <td>{item.identificationStatus}</td>
                            <td>{item.name || 'N/A'}</td>
                            <td>{item.age || 'N/A'}</td>
                            <td>{item.gender || 'N/A'} </td>
                            <td>{item.cpf || 'N/A'}</td>
                            <td className={styles.status}>
                                <span

                                    className={
                                        item.idCase?.status === "ABERTO"
                                            ? styles["status-aberto"]
                                            : item.idCase?.status === "FINALIZADO"
                                                ? styles["status-finalizado"]
                                                : styles["status-arquivado"]
                                    }>

                                    {item.idCase?.status || 'N/A'}
                                </span>
                            </td>
                            <td>{item.idCase?._id || 'N/A'}</td>

                            <td>{new Date(item.createdAt
                            ).toLocaleDateString("pt-BR")}</td>
                            <td>
                                <BiPencil
                                    className={styles.icon}
                                    title="Editar"
                                    style={{ cursor: "pointer", marginRight: 10, color: "#012130" }}
                                    onClick={() => {
                                        setSelectedVictim(item)
                                        setModalOpen(true)
                                        setEditedVictim(item)
                                    }}
                                />
                                <BiSearch
                                    className={styles.icon}
                                    title="Ver detalhes"
                                    onClick={() => verDetalhes(item.protocol)}
                                />
                            </td>


                        </tr>
                    ))}
                    {tableVictims.length === 0 && (
                        <tr>
                            <td colSpan={8} style={{ textAlign: "center", padding: "1rem" }}>
                                Nenhum caso encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <ModalVictim isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <h2>Editar vitima</h2>
                <label htmlFor="nic">Nic</label>
                <input
                    type="text"
                    id="nic"
                    name="nic"
                    value={editedVictim?.nic || ''}
                    onChange={handleChange}

                />
                <label htmlFor="name">Nome</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={editedVictim?.name || ''}
                    onChange={handleChange}
                />
                <label htmlFor="age">Idade</label>
                <input
                    type="number"
                    id="age"
                    name="age"
                    max={120}
                    value={editedVictim?.age || ''}
                    onChange={handleChange}
                />
                <label htmlFor="gender">Gênero</label>
                <select
                    type="text"
                    name="gender"
                    id="gender"
                    value={editedVictim?.gender}
                    onChange={handleChange}
                >
                    <option value="">Selecione...</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMININO"> Feminino</option>
                    <option value="NAO-BINARIO">Não-Binario</option>
                    <option value="OUTRO">Outro</option>
                </select>
                <label htmlFor="cpf">CPF:</label>
                <input
                    type="text"
                    name="cpf"
                    id="cpf"
                    value={editedVictim?.cpf}
                    onChange={handleChange}
                />
                <div className={styles.button}>
                    <Button variant='button-cancel' onClick={() => setModalOpen(false)}>Cancelar</Button>
                    <Button variant='button-save' onClick={handleSave}>Salvar</Button>
                </div>
            </ModalVictim>
        </div >
    );
};

export default TableVictims;
