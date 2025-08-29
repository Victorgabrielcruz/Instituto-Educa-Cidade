import React, { useEffect, useState } from "react";
import Select from "react-select";
import api from "../../services/api";

export const MultiSelect = ({ onChange }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users/summary");
        const formattedOptions = response.data.map((user) => ({
          value: user.id,
          label: user.name,
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Select
      options={options}
      isMulti
      placeholder="Selecione os usuários"
      onChange={(selected) => onChange(selected || [])}
    />
  );
};
