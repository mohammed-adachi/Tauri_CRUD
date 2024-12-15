use std::fs::{self, OpenOptions};
use std::io::{self, Read, Write};
use std::path::Path;
use serde::{Serialize, Deserialize};
use tauri::{command, AppHandle, Manager};

#[derive(Serialize, Deserialize, Clone)]
struct Member {
    id: u32,
    name: String,
    prenom: String,
    date_inscription: String,
    type_sport: String,
    date_debut: String,
    date_fin: String,
    is_paid: bool,
}

// Utiliser un chemin relatif à la racine du projet
fn get_file_path() -> std::path::PathBuf {
    let app_dir = std::env::current_dir().expect("Impossible de trouver le répertoire courant");
    app_dir.join("members.json")
}

// Lire les membres avec gestion d'erreur
#[command]
fn get_members() -> Result<Vec<Member>, String> {
    let file_path = get_file_path();
    
    // Créer le fichier s'il n'existe pas
    if !file_path.exists() {
        fs::write(&file_path, "[]").map_err(|e| e.to_string())?;
    }

    let mut file = OpenOptions::new()
        .read(true)
        .open(&file_path)
        .map_err(|e| format!("Impossible d'ouvrir le fichier : {}", e))?;

    let mut content = String::new();
    file.read_to_string(&mut content)
        .map_err(|e| format!("Erreur de lecture : {}", e))?;

    serde_json::from_str(&content)
        .map_err(|e| format!("Erreur de désérialisation : {}", e))
}

// Ajouter un membre avec gestion d'erreur
#[command]
fn add_member(member: Member) -> Result<(), String> {
    let mut members = get_members()?;
    
    // Générer un nouvel ID unique si nécessaire
    let new_id = members.iter().map(|m| m.id).max().unwrap_or(0) + 1;
    let mut new_member = member;
    new_member.id = new_id;

    members.push(new_member);
    
    let content = serde_json::to_string_pretty(&members)
        .map_err(|e| format!("Erreur de sérialisation : {}", e))?;
    
    let file_path = get_file_path();
    fs::write(&file_path, content)
        .map_err(|e| format!("Erreur d'écriture : {}", e))
}

// Supprimer un membre par ID avec gestion d'erreur
#[command]
fn delete_member(id: u32) -> Result<(), String> {
    let mut members = get_members()?;
    
    members.retain(|member| member.id != id);
    
    let content = serde_json::to_string_pretty(&members)
        .map_err(|e| format!("Erreur de sérialisation : {}", e))?;
    
    let file_path = get_file_path();
    fs::write(&file_path, content)
        .map_err(|e| format!("Erreur d'écriture : {}", e))
}

// Mettre à jour un membre
#[command]
fn update_member(updated_member: Member) -> Result<(), String> {
    let mut members = get_members()?;
    
    if let Some(member) = members.iter_mut().find(|m| m.id == updated_member.id) {
        *member = updated_member;
    } else {
        return Err("Membre non trouvé".to_string());
    }
    
    let content = serde_json::to_string_pretty(&members)
        .map_err(|e| format!("Erreur de sérialisation : {}", e))?;
    
    let file_path = get_file_path();
    fs::write(&file_path, content)
        .map_err(|e| format!("Erreur d'écriture : {}", e))
}

#[command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet, 
            get_members, 
            add_member, 
            delete_member,
            update_member
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}