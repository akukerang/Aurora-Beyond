package main

import (
	"embed"
	"runtime"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	"github.com/wailsapp/wails/v2/pkg/options"
	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed all:frontend/dist
var assets embed.FS

// //go:embed build/appicon.png
// var icon []byte

func main() {
	// Create an instance of the app structure
	app := NewApp()

	AppMenu := menu.NewMenu()
	if runtime.GOOS == "darwin" {
		AppMenu.Append(menu.AppMenu()) // On macOS platform, this must be done right after `NewMenu()`
	}
	FileMenu := AppMenu.AddSubmenu("File")
	FileMenu.AddText("&Open", keys.CmdOrCtrl("o"), func(_ *menu.CallbackData) {
		selectedFile, err := rt.OpenFileDialog(app.ctx, rt.OpenDialogOptions{
			Title: "Select a File",
			Filters: []rt.FileFilter{
				{DisplayName: "Aurora Files (*.dnd5e)", Pattern: "*.dnd5e"},
			},
		})
		if err != nil {
			rt.LogError(app.ctx, "Error opening file dialog: "+err.Error())
			return
		}
		if selectedFile == "" {
			rt.LogInfo(app.ctx, "No file selected")
			return
		}
		rt.EventsEmit(app.ctx, "fileSelected", selectedFile)
	})
	FileMenu.AddSeparator()
	FileMenu.AddText("Quit", keys.CmdOrCtrl("q"), func(_ *menu.CallbackData) {
		// `rt` is an alias of "github.com/wailsapp/wails/v2/pkg/runtime" to prevent collision with standard package
		rt.Quit(app.ctx)
	})

	if runtime.GOOS == "darwin" {
		AppMenu.Append(menu.EditMenu()) // On macOS platform, EditMenu should be appended to enable Cmd+C, Cmd+V, Cmd+Z... shortcuts
	}

	// Create application with options
	err := wails.Run(&options.App{
		Title:            "Aurora Beyond",
		Menu:             AppMenu,
		Width:            1024,
		Height:           768,
		Assets:           assets,
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		LogLevel:         5,

		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
