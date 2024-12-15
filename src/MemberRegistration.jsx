import React, { useState } from 'react';
import { invoke } from "@tauri-apps/api/core";
import { v4 as uuidv4 } from "uuid"; 


const MemberRegistration = () => {
 const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMember = {
      id: 0,
      name,
      prenom,
      date_inscription: '2024-12-15',
      type_sport: 'Fitness',
      date_debut: '2024-12-15',
      date_fin: '2025-12-15',
      is_paid: isPaid
    };
console.log(newMember);
    try {
      const result = await invoke('add_member', { member: newMember });
      alert("Membre ajouté avec succès !");
      console.log(result); // Affiche le résultat dans la console
    } catch (error) {
      console.error('Erreur lors de l\'ajout du membre:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Prénom"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
      />
      <label>
        Est payé :
        <input
          type="checkbox"
          checked={isPaid}
          onChange={() => setIsPaid(!isPaid)}
        />
      </label>
      <button type="submit">Ajouter le Membre</button>
    </form>
  );
}
export default MemberRegistration;
