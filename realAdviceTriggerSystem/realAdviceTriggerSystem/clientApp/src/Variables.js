export const variables = {
    //API_URL: "http://localhost:8082/api/"
    API_URL: "https://localhost:7139/api/"
    //API_URL: "http://localhost:54372/api/"
    //API_URL: "https://ray-api.net7.be/api/"
};

export const validEmail = new RegExp(
    '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
);

export const EnumobjTriggerType = {
    "1": "Email",
    "2": "SMS"
};

export const EnumobjDurationType = {
    "1": "Days",
    "2": "Hours",
    "3": "Minutes"
};

export const EnumobjKeyMoments = {
    "1": "Evaluation (to sale)",
    "2": "Evaluation (to rent)",
    "3": "After mandate (to sale)",
    "4": "After mandate (to rent)",
    "5": "Visits (to sale)",
    "6": "Visits (to rent)",
    "7": "Sale agreement",
    "8": "Rental agreement",
    "9": "Notarial deed",
    "10": "Entry inventory",
    "11": "Exit inventory",
};

export const EnumobjParticipentType = {
    "1": "Participant",
    "2": "No Participant"
};

export const EnumobjClientStatus = {
    "1": "Pending",
    "2": "Demo",
    "3": "Activate",
    "4": "Suspended",
    "5": "Deactivate"
};



export const editorButtons = [
    // default
    ['undo', 'redo'],
    ['font', 'fontSize', 'formatBlock', 'align', 'lineHeight'],
    ['paragraphStyle', 'blockquote'],
    ['bold', 'underline', 'italic', 'list', 'strike', 'subscript', 'superscript'],
    ['fontColor', 'hiliteColor', 'textStyle'],
    ['removeFormat'],
    ['outdent', 'indent'],
    ['horizontalRule'],
    ['table', 'link', 'image', 'video', 'audio'],
    ['imageGallery'],
    ['fullScreen', 'showBlocks', 'codeView'],
    ['preview', 'print']
]