import KeyManager from "../../scripts/appMenu/KeyManager";
import Vue from "vue";
import ContentWindow from "../../scripts/commonWindows/Content";
import Store from "../index";
import { ipcRenderer } from "electron";
import SettingsWindow from "../../windows/Settings";

const state = {
    file: {
        trusted: true,
        display_name: "File",
        elements: [
            {
                title: "New File",
                shortcut: "Ctrl + N"
            },
            {
                title: "Open File",
                shortcut: "Ctrl + O",
                action: () => ipcRenderer.send("openFileDialog")
            },
            {
                type: "divider"
            },
            {
                title: "Save",
                shortcut: "Ctrl + S",
                action: () => Store.commit("saveCurrentFile")
            },
            {
                title: "Save As...",
                shortcut: "Ctrl + Shift + S",
                action: () => Store.commit("saveCurrentFileAs")
            },
            {
                type: "divider"
            },
            {
                title: "Close Editor",
                shortcut: "Ctrl + W",
                action: () => Store.commit("closeCurrentTab")
            },
            {
                type: "divider"
            },
            {
                type: "submenu",
                title: "Preferences",
                elements: [
                    {
                        title: "Settings",
                        action: () => {
                            new SettingsWindow();
                        }
                    },
                    {
                        title: "Extensions",
                        action: () => Store.commit("setPluginMenuOpen")
                    }
                ]
            }
        ]
    },
    view: {
        trusted: true,
        display_name: "View",
        elements: [
            {
                title: "Dark Mode",
                shortcut: "Ctrl + D",
                action: () => Store.commit("toggleDarkMode")
            }
        ]
    }
}

const mutations = {
    /**
     * Data format:
     * id = key inside state
     * display_name = name to display
     * elements = elements to show in menu
     */
    addToAppMenu(state, data) {
        let menu = {
            display_name: data.display_name,
            elements: data.elements,
            trusted: data.trusted != undefined ? data.trusted : true
        };
        Vue.set(state, data.id, menu);

        KeyManager.bind(data.elements, menu);
    },

    removeFromAppMenu(state, data) {
        Vue.delete(state, data.id);
        KeyManager.unbind(data.elements);
    }
}

export default {
    state,
    mutations
}