import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function Delete() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    const result = await invoke("get_members");
    setMembers(result);
  }

  async function deleteMember(id) {
    try {
      // Appeler la commande delete_member dans le backend en lui passant l'id
      await invoke("delete_member", { id });
      // Mettre à jour la liste des membres après suppression
      setMembers(members.filter(member => member.id !== id));
      alert("Membre supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression du membre:", error);
      alert("Erreur lors de la suppression du membre.");
    }
  }

  return (
    <div>
      <h1>Liste des Membres</h1>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.name} {member.prenom} - {member.type_sport}
            <button onClick={() => deleteMember(member.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Delete;
