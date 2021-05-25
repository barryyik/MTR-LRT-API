async function displayDataDivLoadResponse(language, station_id) {
    displayLoadingAnimation()
    const response = await fetch(`https://rt.data.gov.hk/v1/transport/mtr/lrt/getSchedule?station_id=${station_id}`),
        errorStatusResponse = {
            status599: multi_lang_object.dataText.networkError[language],
            status500: multi_lang_object.dataText.internalServerError[language],
            status429: multi_lang_object.dataText.tooManyRequests[language],
            status999: multi_lang_object.dataText.unknownError[language]
        }
    if (response.status != 200) {
        return displayResponse(createElementNode({
            nodeType: "div", 
            nodeClassNameArray: ["errorMsg"], 
            nodeInnerText: errorStatusResponse[`status${response.status}`] || errorStatusResponse['status999']
        }))
    }
    const data = await response.json()
    let langCode = (language === "0") ? "en-US" : "zh",
        timeFormat = new Date(data.system_time.replaceAll('-', '/'))
            .toLocaleTimeString(langCode, 
                {
                    year: 'numeric', 
                    month: 'numeric', 
                    day: 'numeric', 
                    hour: 'numeric', 
                    minute:'2-digit', 
                    second: '2-digit', 
                    hour12: true
                }
            ),
        newDiv = document.createElement("div"),
        stationNameTextNode = createElementNode({
            nodeType: "p", 
            nodeId: "displayDataDiv__station-name",
            nodeInnerText: `${" " + multi_lang_object.station_id[station_id][language]}`
        }),
        stationNameIconTag = createElementNode({
            nodeType: "i", 
            nodeClassNameArray: ["fa", "fa-train"],
            nodeAttribute: {name: "aria-hidden", value: "true"}
        }),
        lastUpdateTextNode = createElementNode({
            nodeType: "p", 
            nodeInnerText: `${multi_lang_object.dataText.lastUpdate[language]}: ${timeFormat}`
        })
    stationNameTextNode.prepend(stationNameIconTag)
    newDiv.appendChild(stationNameTextNode)
    newDiv.appendChild(lastUpdateTextNode)
    if (data.status != 1) {
        let statusTextNode = createElementNode({nodeType: "p"}),
            statusTextStrongNode = createElementNode({
                nodeType: "strong",
                nodeInnerText: multi_lang_object.dataText.statusString[language]
            })
        statusTextNode.appendChild(statusTextStrongNode)
        newDiv.appendChild(statusTextNode)
    }
    data.platform_list?.forEach(platform => {
        let platformH3TextNode = createElementNode({
                nodeType: "h3", 
                nodeClassNameArray: ["platformH3"], 
                nodeInnerText: (language === "0") ? `Platform ${platform.platform_id}` : `${platform.platform_id}號月台`
            }),
            tableNode = createElementNode({nodeType: "table"}),
            tableHeaderRow = createElementNode({nodeType: "tr"})
        tableHeaderRow.innerHTML = `
                <th>${multi_lang_object.dataText.route_no[language]}</th>
                <th>${multi_lang_object.dataText.dest[language]}</th>
                <th>${multi_lang_object.dataText.train_length[language]}</th>
                <th>${multi_lang_object.dataText.time[language]}</th>
                <th>${multi_lang_object.dataText.isInService[language]}</th>`
        newDiv.appendChild(platformH3TextNode)
        tableNode.appendChild(tableHeaderRow)
        if (platform.end_service_status && platform.end_service_status == 1) {
            let tableRowNone = createElementNode({nodeType: "tr"})
            tableRowNone.innerHTML = `
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>${((language === "0") ? "No" : "否")}</td>`
            tableNode.appendChild(tableRowNone)
        }
        platform.route_list?.forEach(route => {
            let tableRowInfo = createElementNode({nodeType: "tr"}),
                tabeRowTd1 = createElementNode({nodeType: "td", nodeInnerText: `${route.route_no || "-"}`}),
                tabeRowTd2 = createElementNode({nodeType: "td", nodeInnerText: `${(language === "0") ? (route.dest_en || "-") : (route.dest_ch || "-")}`}),
                tabeRowTd3 = createElementNode({nodeType: "td", nodeInnerText: `${route.train_length || "-"}`}),
                tabeRowTd4 = createElementNode({nodeType: "td", nodeInnerText: `${(language === "0") ? (route.time_en || "-") : (route.time_ch || "-")}`}),
                tabeRowTd5 = createElementNode({nodeType: "td", nodeInnerText: `${route.stop == 0 ? ((language === "0") ? "Yes" : "是") : ((language === "0") ? "No" : "否")}`})
            tableRowInfo.appendChild(tabeRowTd1)
            tableRowInfo.appendChild(tabeRowTd2)
            tableRowInfo.appendChild(tabeRowTd3)
            tableRowInfo.appendChild(tabeRowTd4)
            tableRowInfo.appendChild(tabeRowTd5)
            tableNode.appendChild(tableRowInfo)
        })
        newDiv.appendChild(tableNode)
    })
    return displayResponse(newDiv)
}

// create sanitized elements
function createElementNode({nodeType, nodeId, nodeClassNameArray, nodeAttribute, nodeInnerText}) {
    let nodeCreated = document.createElement(nodeType)
    if (nodeId)
        nodeCreated.id = nodeId
    if (nodeClassNameArray) {
        nodeClassNameArray.forEach(nodeClass => {
            nodeCreated.classList.add(nodeClass)
        })
    }
    if (nodeAttribute)
        nodeCreated.setAttribute(nodeAttribute.name, nodeAttribute.value)
    if (nodeInnerText)
        nodeCreated.innerText = nodeInnerText
    return nodeCreated
}

function displayLoadingAnimation() {
    const displayDataDiv = document.querySelector("#displayDataDiv")
    displayDataDiv.innerHTML = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>'
}

function displayResponse(node) {
    const displayDataDiv = document.querySelector("#displayDataDiv")
    displayDataDiv.innerHTML = ""
    displayDataDiv.appendChild(node)
}