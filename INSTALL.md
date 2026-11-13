# Windows 安装版

适用于 Windows 10 / 11 x64。安装包已内置 Node.js 24.22.3，无需安装开发工具、配置环境或联网使用。

1. 下载 `408-Study-Setup-1.0.0-win-x64.exe`，双击安装到当前用户目录。
2. 双击桌面的“408 智能挖空学习器”快捷方式，默认浏览器会自动打开学习界面。
3. 关闭浏览器页面后，学习器仍在系统托盘中运行；右键托盘图标可重新打开或退出。再次双击快捷方式不会重复启动服务。
4. 在 Windows“已安装的应用”或开始菜单中卸载。

这是“本地应用启动器 + 浏览器界面”的安装版，并非内嵌浏览器。界面、规则计算和课程数据均在本机。服务仅监听 `127.0.0.1:40808`。请固定使用同一个浏览器，学习进度存储在该浏览器中。卸载不会清理浏览器课程数据；清理浏览器数据会删除课程，建议定期导出 JSON。

从原先的 4080 网页版迁移：先在旧版导出全部 JSON，再在安装版导入。两个地址的浏览器存储互相独立。

安装程序尚无开发者代码签名，Windows 可能显示“未知发布者”。请核对下载来源及发布页的 SHA256 校验值。

## 从源码构建

Windows 10/11 自带 .NET Framework 编译器。另需官方 Node.js Windows x64 ZIP（解压）和 Inno Setup 6.7.4。执行：

```powershell
./desktop/build.ps1 -NodeDirectory 'C:/tools/node-v24.22.3-win-x64' -InnoCompiler 'C:/tools/Inno Setup 6/ISCC.exe'
```

安装文件输出到项目父目录，未压缩的应用文件在 `dist/windows`。运行 `dist/windows/408Study.exe --check` 可验证服务能正常启动并退出（退出码 0 表示成功）。

Node.js 的第三方许可包含在安装目录 `runtime/NODE-LICENSE.txt`。
