
let viewingSettings: boolean = false;

document.getElementById("settings-btn")?.addEventListener("click", function(evt) {
    if (!(document.getElementsByClassName("refresh-error-content")[0] as HTMLElement).hidden) { return; }

    viewingSettings = true;

    (document.getElementsByClassName("main-content")[0] as HTMLElement).hidden = viewingSettings;
    (document.getElementsByClassName("settings-content")[0] as HTMLElement).hidden = !viewingSettings;
})

document.getElementById("settings-back-btn")?.addEventListener("click", function(evt) {
    if (!(document.getElementsByClassName("refresh-error-content")[0] as HTMLElement).hidden) { return; }
    
    viewingSettings = false;

    (document.getElementsByClassName("main-content")[0] as HTMLElement).hidden = viewingSettings;
    (document.getElementsByClassName("settings-content")[0] as HTMLElement).hidden = !viewingSettings;
})


