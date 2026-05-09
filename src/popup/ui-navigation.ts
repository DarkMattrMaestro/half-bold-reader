
let viewingSettings: boolean = false;

document.getElementById("settings-btn")?.addEventListener("click", function(evt) {
    viewingSettings = true;

    (document.getElementsByClassName("main-content")[0] as HTMLElement).hidden = viewingSettings;
    (document.getElementsByClassName("settings-content")[0] as HTMLElement).hidden = !viewingSettings;
})

document.getElementById("settings-back-btn")?.addEventListener("click", function(evt) {
    viewingSettings = false;

    (document.getElementsByClassName("main-content")[0] as HTMLElement).hidden = viewingSettings;
    (document.getElementsByClassName("settings-content")[0] as HTMLElement).hidden = !viewingSettings;
})


