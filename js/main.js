var languageCode = localStorage.getItem("languageCode") || "1", // 0=en, 1=ch
    isInEditMode = false

document.addEventListener("DOMContentLoaded", () => {
    // shortcut
    document.querySelector("#shortcut-1").dataset.value = localStorage.getItem("shortcut-1") || "none"
    document.querySelector("#shortcut-2").dataset.value = localStorage.getItem("shortcut-2") || "none"
    document.querySelector("#shortcut-3").dataset.value = localStorage.getItem("shortcut-3") || "none"
    document.querySelector("#shortcut-4").dataset.value = localStorage.getItem("shortcut-4") || "none"

    createStationOptionList(languageCode)
    setMultiLanguageName(languageCode)

    const displayDataDiv = document.querySelector("#displayDataDiv"),
        getDataButton = document.querySelector("#getDataButton"),
        switchLanguageButton = document.querySelector("#switchLanguageButton"),
        editShortcutButton = document.querySelector("#editShortcutButton")

    getDataButton.addEventListener("click", async () => {
        if (isInEditMode)
            return
        let station_id = document.querySelector("#station_id").value
        await displayDataDivLoadResponse(languageCode, station_id)
    })

    switchLanguageButton.addEventListener("click", () => {
        languageCode = (languageCode === "0") ? "1" : "0"
        localStorage.setItem("languageCode", languageCode)
        setMultiLanguageName(languageCode)
    })

    editShortcutButton.addEventListener("click", () => {
        isInEditMode = !isInEditMode
        document.querySelectorAll(".shortcut")
            .forEach(shortcut => {
                shortcut.dataset.status = (isInEditMode) ? "inEditMode" : "normal"
            })
        if (!isInEditMode)
            setMultiLanguageName(languageCode)
    })
    
    document.querySelector("#shortcut-div-wrapper").addEventListener("click", async (event) => {
        if (event.target.className != "shortcut")
            return
        if (isInEditMode) {
            event.target.dataset.value = "none"
            localStorage.setItem(event.target.id, "none")
            setMultiLanguageName(languageCode)
            return
        }
        if (event.target.dataset.value == "none") {
            let station_id = document.querySelector("#station_id").value
            event.target.dataset.value = station_id
            localStorage.setItem(event.target.id, station_id)
            setMultiLanguageName(languageCode)
            return
        }
        let station_id = event.target.dataset.value
        await displayDataDivLoadResponse(languageCode, station_id)
        setMultiLanguageName(languageCode)
    })
})

function setMultiLanguageName(language) {
    document.querySelectorAll(".multi-language-element__uiName")
        .forEach(element => {
            let id = element.id
            if (isInEditMode && id == "editShortcutButton")
                return
            element.innerText = multi_lang_object.uiName[id][language]
        })
    document.querySelectorAll(".multi-language-element__station-name")
        .forEach(element => {
            let id = element.value
            element.innerText = multi_lang_object.station_id[id][language]
        })
    displayShortcutNames(language)
}

function createStationOptionList(language) {
    const station_id_div = document.querySelector("#station_id")
    for (const key in multi_lang_object.uiName) {
        const element = document.querySelector(`#${key}`)
        element.innerText = multi_lang_object.uiName[key][language]
    }
    for (const key in multi_lang_object.station_id) {
        station_id_div.insertAdjacentHTML("beforeend", `<option value="${key}" class="multi-language-element__station-name"></option>`)
    }
}

function displayShortcutNames(language) {
    document.querySelectorAll(".shortcut")
        .forEach(shortcut => {
            let dataValue = shortcut.dataset.value
            if (dataValue == "none")
                return shortcut.innerText = "＋"
            shortcut.innerText = multi_lang_object.station_id[dataValue][language]
        })
}