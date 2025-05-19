import React, { useState, useEffect } from "react";
import styles from "./TableVictims.module.css";
import { BiPencil, BiSearch, BiTrash } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { IoMdAddCircleOutline } from "react-icons/io";
import { jwtDecode } from "jwt-decode";
import ModalVictim from "./modalVictim";


const TableVictims = ({ victims }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [tableVictims, setTableVictims] = useState(victims);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedVictim, setSelectedVictim] = useState(null);
    const [showModalStepTwo, setShowModalStepTwo] = useState(false);
    const [stepTwoFormData, setStepTwoFormData] = useState(null);
    console.log('tabela de vitimas:', tableVictims)

    useEffect(() => {
        setTableVictims(victims);
    }, [victims]);








    const handleEdit = () => {
        setShowModal(true);
    };


    const handleNextStep = (formData) => {
        setShowModal(false); // fecha o primeiro modal
        setStepTwoFormData(formData); // salva os dados pra usar no segundo
        setShowModalStepTwo(true); // abre o segundo modal
    };



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
                            <td>{item.idCase?._id || 'Nao identificado'}</td>

                            <td>{new Date(item.createdAt
                            ).toLocaleDateString("pt-BR")}</td>
                            <td> <BiPencil
                                className={styles.icon}
                                title="Editar"
                                style={{ cursor: "pointer", marginRight: 10, color: "#012130" }}
                                onClick={() => {
                                    setSelectedVictim(item)
                                    setModalOpen(true)
                                }}
                            /></td>

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
                <h2>conteudo do modal</h2>
                <label htmlFor="nic">Nic</label>
                <input
                    type="text"
                    id="nic"
                    value={selectedVictim?.nic || ''}
                />
                <label htmlFor="nic">Nic</label>
                <input
                    type="text"
                    id="nic"
                    value={selectedVictim?.nic || ''}
                />
                <label htmlFor="nic">Nic</label>
                <input
                    type="text"
                    id="nic"
                    value={selectedVictim?.nic || ''}
                />
            </ModalVictim>
        </div >
    );
};

export default TableVictims;
