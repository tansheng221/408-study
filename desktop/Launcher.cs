using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Threading;
using System.Windows.Forms;

class Launcher {
    const string Url = "http://127.0.0.1:40808/";
    static Process server;
    static NotifyIcon tray;
    static void Open() { Process.Start(new ProcessStartInfo(Url) { UseShellExecute = true }); }
    static void Stop() { try { if(server != null && !server.HasExited) { server.Kill(); server.WaitForExit(3000); } } catch {} }
    [STAThread] static int Main(string[] args) {
        bool check = args.Length > 0 && args[0] == "--check";
        bool first;
        using (var mutex = new Mutex(true, "Local\\Study408DesktopV1", out first)) {
            if(!first) { if(!check) Open(); return 0; }
            try {
                string root = AppDomain.CurrentDomain.BaseDirectory;
                var info = new ProcessStartInfo(Path.Combine(root, "runtime", "node.exe"), "\"" + Path.Combine(root, "desktop-server.js") + "\"") {
                    WorkingDirectory = root, UseShellExecute = false, CreateNoWindow = true
                };
                info.EnvironmentVariables.Remove("NODE_OPTIONS");
                server = Process.Start(info);
                bool ready = false;
                for(int i=0; i<80; i++) {
                    if(server.HasExited) throw new Exception("本地服务无法启动，40808 端口可能已被其他程序占用。");
                    try {
                        var req = (HttpWebRequest)WebRequest.Create(Url + "health"); req.Timeout=300; req.Proxy=null;
                        using(var response=req.GetResponse()) using(var reader=new StreamReader(response.GetResponseStream()))
                            ready=reader.ReadToEnd()=="408-study-desktop-v1";
                    } catch { }
                    if(ready) break;
                    Thread.Sleep(100);
                }
                if(!ready) throw new Exception("学习器启动超时，请检查本机安全软件是否阻止本地服务。");
                if(check) return 0;
                Application.EnableVisualStyles();
                var menu = new ContextMenuStrip();
                menu.Items.Add("打开 408 学习器", null, delegate { Open(); });
                menu.Items.Add("退出学习器", null, delegate { Application.ExitThread(); });
                tray = new NotifyIcon { Icon=SystemIcons.Application, Text="408 智能挖空学习器", ContextMenuStrip=menu, Visible=true };
                tray.DoubleClick += delegate { Open(); };
                Open();
                Application.Run();
                return 0;
            } catch(Exception ex) {
                if(!check) MessageBox.Show(ex.Message, "408 学习器启动失败", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return 1;
            } finally {
                if(tray!=null) { tray.Visible=false; tray.Dispose(); }
                Stop();
            }
        }
    }
}
