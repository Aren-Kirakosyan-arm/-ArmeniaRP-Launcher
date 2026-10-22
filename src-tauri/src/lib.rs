use std::{path::Path, process::Command};

#[tauri::command]
fn get_launcher_info() -> serde_json::Value {
    serde_json::json!({
        "name": "ArmeniaRP Launcher",
        "version": env!("CARGO_PKG_VERSION"),
        "platform": "windows"
    })
}

fn validate_launch_input(executable_path: &str, nickname: &str) -> Result<(), String> {
    if nickname.trim().is_empty() {
        return Err("Никнейм не может быть пустым.".into());
    }
    let path = Path::new(executable_path);
    if !path.is_absolute() {
        return Err("Путь к игре должен быть абсолютным.".into());
    }
    if !path.exists() || !path.is_file() {
        return Err("Файл игры не найден. Проверьте путь в настройках.".into());
    }
    if path.extension().and_then(|ext| ext.to_str()).map(|ext| ext.eq_ignore_ascii_case("exe")) != Some(true) {
        return Err("Указанный файл должен иметь расширение .exe".into());
    }
    Ok(())
}

#[tauri::command]
fn launch_game(executable_path: String, nickname: String) -> Result<(), String> {
    validate_launch_input(&executable_path, &nickname)?;
    Command::new(&executable_path)
        .arg(format!("nickname={}", nickname.trim()))
        .spawn()
        .map(|_| ())
        .map_err(|error| format!("Не удалось запустить игру: {error}"))
}

#[cfg(test)]
mod tests {
    use super::validate_launch_input;

    #[test]
    fn rejects_empty_nickname() {
        assert!(validate_launch_input("C:\\game.exe", "   ").is_err());
    }

    #[test]
    fn rejects_relative_path() {
        assert!(validate_launch_input("game.exe", "Player").is_err());
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_launcher_info, launch_game])
        .run(tauri::generate_context!())
        .expect("error while running ArmeniaRP Launcher");
}
