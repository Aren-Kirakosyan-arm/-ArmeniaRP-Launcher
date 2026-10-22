using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Text.Json;
using System.Windows;
using Microsoft.Win32;

namespace ArmeniaRP.Launcher;

public partial class MainWindow : Window
{
    private const string ServerHost = "127.0.0.1";
    private const int ServerPort = 7777;
    private const string StatusUrl = "http://localhost:8080/api/server/status";
    private const string SettingsFile = "settings.json";
    private readonly HttpClient _http = new() { Timeout = TimeSpan.FromSeconds(4) };
    private string? _gamePath;

    public MainWindow()
    {
        InitializeComponent();
        LoadSettings();
        Loaded += async (_, _) => await RefreshStatusAsync();
    }

    private async Task RefreshStatusAsync()
    {
        try
        {
            var json = await _http.GetStringAsync(StatusUrl);
            var status = JsonSerializer.Deserialize<ServerStatus>(json);
            if (status is null) throw new InvalidOperationException();
            StatusText.Text = "ՕՆԼԱՅՆ";
            StatusText.Foreground = System.Windows.Media.Brushes.MediumSpringGreen;
            PlayersText.Text = $"{status.Players} / {status.MaxPlayers} խաղացող";
        }
        catch
        {
            StatusText.Text = "ՕՖԼԱՅՆ / ՉԻ ԿԱՊՎՈՒՄ";
            StatusText.Foreground = System.Windows.Media.Brushes.IndianRed;
            PlayersText.Text = "Սերվերի տվյալները հասանելի չեն";
        }
    }

    private void PlayButton_Click(object sender, RoutedEventArgs e)
    {
        var nickname = NicknameBox.Text.Trim();
        if (nickname.Length < 3 || nickname.Length > 24)
        {
            MessageBox.Show("Մականունը պետք է լինի 3-ից 24 նիշ։", "ArmeniaRP", MessageBoxButton.OK, MessageBoxImage.Warning);
            return;
        }

        if (string.IsNullOrWhiteSpace(_gamePath) || !File.Exists(_gamePath))
        {
            MessageBox.Show("Նախ ընտրեք խաղի executable ֆայլը։", "ArmeniaRP", MessageBoxButton.OK, MessageBoxImage.Warning);
            return;
        }

        try
        {
            SaveSettings();
            var psi = new ProcessStartInfo
            {
                FileName = _gamePath,
                UseShellExecute = true,
                Arguments = $"{ServerHost}:{ServerPort}"
            };
            Process.Start(psi);
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Չհաջողվեց գործարկել խաղը։\n\n{ex.Message}", "ArmeniaRP", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    private void SelectGame_Click(object sender, RoutedEventArgs e)
    {
        var dialog = new OpenFileDialog
        {
            Title = "Ընտրեք խաղի executable ֆայլը",
            Filter = "Executable (*.exe)|*.exe",
            CheckFileExists = true
        };
        if (dialog.ShowDialog() == true)
        {
            _gamePath = dialog.FileName;
            GamePathText.Text = _gamePath;
            SaveSettings();
        }
    }

    private void LoadSettings()
    {
        try
        {
            var path = Path.Combine(AppContext.BaseDirectory, SettingsFile);
            if (!File.Exists(path)) return;
            var data = JsonSerializer.Deserialize<Settings>(File.ReadAllText(path));
            if (data is null) return;
            NicknameBox.Text = data.Nickname ?? string.Empty;
            _gamePath = data.GamePath;
            GamePathText.Text = string.IsNullOrWhiteSpace(_gamePath) ? "Խաղի ֆայլը դեռ ընտրված չէ" : _gamePath;
        }
        catch { }
    }

    private void SaveSettings()
    {
        try
        {
            var data = new Settings { Nickname = NicknameBox.Text.Trim(), GamePath = _gamePath };
            var path = Path.Combine(AppContext.BaseDirectory, SettingsFile);
            File.WriteAllText(path, JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true }));
        }
        catch { }
    }

    private sealed class Settings
    {
        public string? Nickname { get; set; }
        public string? GamePath { get; set; }
    }

    private sealed class ServerStatus
    {
        public bool Online { get; set; }
        public int Players { get; set; }
        public int MaxPlayers { get; set; }
    }
}
