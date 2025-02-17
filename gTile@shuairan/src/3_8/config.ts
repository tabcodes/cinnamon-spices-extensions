import { app } from "./extension";
import { GridSettingsButton } from "./ui/GridSettingsButton";


export interface Preferences {
    hotkey: string;
    lastGridRows: number;
    lastGridCols: number;
    animation: boolean;
    autoclose: boolean;
    gridbutton1x: number;
    gridbutton1y: number;
    gridbutton2x: number;
    gridbutton2y: number;
    gridbutton3x: number;
    gridbutton3y: number;
    gridbutton4x: number;
    gridbutton4y: number;
    nbRows: number;
    nbCols: number;
}

export const preferences: Preferences = {} as Preferences;

const Settings = imports.ui.settings;

let settings: imports.ui.settings.ExtensionSettings;
export let gridSettingsButton: GridSettingsButton[] = [];

/*****************************************************************
                            SETTINGS
*****************************************************************/
/*INIT SETTINGS HERE TO ADD OR REMOVE SETTINGS BUTTON*/
/*new GridSettingsButton(LABEL, NBCOL, NBROW) */
export const initSettings = () => {
    settings = new Settings.ExtensionSettings(preferences, 'gTile@shuairan');
    //hotkey
    settings.bindProperty(Settings.BindingDirection.IN, 'hotkey', 'hotkey', app.EnableHotkey, null);
    //grid (nbCols and nbRows)
    settings.bindProperty(Settings.BindingDirection.OUT, 'lastGridRows', 'nbCols');
    settings.bindProperty(Settings.BindingDirection.OUT, 'lastGridCols', 'nbRows');

    settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL, 'animation', 'animation', updateSettings, null);
    settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL, 'autoclose', 'autoclose', updateSettings, null);

    let basestr = 'gridbutton';

    initGridSettings();

    for (let i = 1; i <= 4; i++) {
        let sgbx = basestr + i + 'x';
        let sgby = basestr + i + 'y';
        settings.bindProperty(Settings.BindingDirection.IN, sgbx, sgbx, updateGridSettings, null);
        settings.bindProperty(Settings.BindingDirection.IN, sgby, sgby, updateGridSettings, null);
    }
}

const updateSettings = () => {
    app.Grid.UpdateSettingsButtons();
}

const initGridSettings = () => {
    let basestr = 'gridbutton';
    for (let i = 1; i <= 4; i++) {
        let sgbx = basestr + i + 'x';
        let sgby = basestr + i + 'y';
        let gbx = settings.getValue(sgbx);
        let gby = settings.getValue(sgby);
        gridSettingsButton.push(new GridSettingsButton(gbx + 'x' + gby, gbx, gby));
    }
}

const updateGridSettings = () => {
    gridSettingsButton = [];
    initGridSettings();
    app.Grid.RebuildGridSettingsButtons();
}