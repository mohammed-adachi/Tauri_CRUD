import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import "./index.css";

function App() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    const result = await invoke("get_members");
    setMembers(result);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Titre principal */}
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Liste des Membres</h1>

      {/* Boutons de navigation */}
      <div className="flex space-x-4 mb-6">
        <Link
          to="/add_member"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-all"
        >
          Ajouter un membre
        </Link>
        <Link
          to="/delete"
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition-all"
        >
          Supprimer un membre
        </Link>
      </div>

      {/* Liste des membres */}
      <ul className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-4">
        {members.length > 0 ? (
          members.map((member) => (
            <li
              key={member.id}
              className="flex justify-between items-center p-3 border-b last:border-none"
            >
              <div className="text-gray-800">
                <span className="font-semibold">{member.name} {member.prenom}</span> -{" "}
                <span className="italic text-blue-500">{member.type_sport}</span>
              </div>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500 py-4">Aucun membre trouvé.</li>
        )}
      </ul>
    </div>
  );
}

export default App;
