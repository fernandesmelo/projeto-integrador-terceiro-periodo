import React, { useState } from "react";
import styles from "./EditModal.module.css";
import axios from "axios";
import Button from "../button/Button";

const EditModalStepTwo = ({ formData, onClose, onUpdate }) => {
  const { protocol, ...formDataWithoutProtocol } = formData;
  const [location, setLocation] = useState(formData.location);
  const token = localStorage.getItem("token");
  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        "https://sistema-odonto-legal.onrender.com/api/cases/data/protocol",
        {
          ...formDataWithoutProtocol,
          location: location,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { protocol },
        }
      );
      console.log("Sucesso:", response.data);
      onUpdate();
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar:", err.response?.data || err.message);
    }
  };

  const handleLocationChange = (field, value) => {
    setLocation((prev) => ({
      ...prev,
      [field]: field === "houseNumber" ? Number(value) || 0 : value,
    }));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Editar Caso</h2>
        <label htmlFor="estado">Estado:</label>
        <select
          className={styles.input}
          id="state"
          type="text"
          placeholder="Digite o estado"
          value={location.state}
          onChange={(e) => handleLocationChange("state", e.target.value)}
        >
          <option value="">Selecione um estado:</option>
          <option value="AC">Acre</option>
          <option value="AL">Alagoas</option>
          <option value="AP">Amapá</option>
          <option value="AM">Amazonas</option>
          <option value="BA">Bahia</option>
          <option value="CE">Ceará</option>
          <option value="DF">Distrito Federal</option>
          <option value="ES">Espírito Santo</option>
          <option value="GO">Goiás</option>
          <option value="MA">Maranhão</option>
          <option value="MT">Mato Grosso</option>
          <option value="MS">Mato Grosso do Sul</option>
          <option value="MG">Minas Gerais</option>
          <option value="PA">Pará</option>
          <option value="PB">Paraíba</option>
          <option value="PR">Paraná</option>
          <option value="PE">Pernambuco</option>
          <option value="PI">Piauí</option>
          <option value="RJ">Rio de Janeiro</option>
          <option value="RN">Rio Grande do Norte</option>
          <option value="RS">Rio Grande do Sul</option>
          <option value="RO">Rondônia</option>
          <option value="RR">Roraima</option>
          <option value="SC">Santa Catarina</option>
          <option value="SP">São Paulo</option>
          <option value="SE">Sergipe</option>
          <option value="TO">Tocantins</option>
        </select>
        <label htmlFor="houseNumber">Número da casa:</label>
        <input
          id="houseNumber"
          type="text"
          placeholder="Digite o numero da casa"
          value={location.houseNumber}
          onChange={(e) => handleLocationChange("houseNumber", e.target.value)}
        />
        <label htmlFor="Rua">Rua:</label>
        <input
          className={styles.input}
          id="Rua"
          type="text"
          placeholder="Digite o nome da rua"
          value={location.street}
          onChange={(e) => handleLocationChange("street", e.target.value)}
        />
        <label htmlFor="Bairro">Bairro:</label>
        <input
          className={styles.input}
          id="Bairro"
          type="text"
          placeholder="Digite o bairro"
          value={location.district}
          onChange={(e) => handleLocationChange("district", e.target.value)}
        />
        <label htmlFor="CEP">CEP:</label>
        <input
          className={styles.input}
          id="CEP"
          type="text"
          placeholder="Digite o CEP"
          value={location.zipCode}
          onChange={(e) => handleLocationChange("zipCode", e.target.value)}
        />
        <label htmlFor="Complemento">Complemento:</label>
        <input
          className={styles.input}
          id="Complemento"
          type="text"
          placeholder="Digite o complemento"
          value={location.complement}
          onChange={(e) => handleLocationChange("complement", e.target.value)}
        />
        <div className={styles.modalButtons}>
          <Button variant="button-save" onClick={handleSubmit}>
            Salvar
          </Button>
          <Button variant="button-cancel" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditModalStepTwo;
