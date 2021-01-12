// Experiment manipulating CS variability

import * as material from "./material.js";
import * as instructions from "./instructions.js";
import { isOdd, noRepeats, endbeg } from "./functions.js";

//********************************* define experimental variables */
var number_CS = 5;
var number_GS = 3;
var number_GSnew = 3;
var number_prototype = 1;
var rep_per_block = 1;
var number_categories= 4;


// *********************************** add experiment information

//generate random subject ID
var subject_id = jsPsych.randomization.randomID(10);
var version = 1;

//between-subjects factors: variability and rating 
var condition_assignment = jsPsych.randomization.sampleWithoutReplacement(['many_one', 'one_one'],1)[0];
if (condition_assignment == "one_one"){
    var condition_assignment_code = "1";
} else{
    var condition_assignment_code = "0";
};

var rating_assignment = jsPsych.randomization.sampleWithoutReplacement(['direct_first', 'indirect_first'],1)[0];
if (rating_assignment == "direct_first"){
    var rating_assignment_code = "1";
} else{
    var rating_assignment_code = "0";
};

jsPsych.data.addProperties({
    subject: subject_id,
    condition: condition_assignment,
    condition_code: condition_assignment_code,
    measure: rating_assignment,
    measure_code: rating_assignment_code
});

//************************************* use full screen
//enter fullscreen
var fullscreen_on = {
    type: "fullscreen",
    fullscreen_mode: true
};

//end fullscreen-mode
var fullscreen_off = {
    type: "fullscreen",
    fullscreen_mode: false
};

//************************************ information, consent, codeword, demographics */

//information sheet

var html_information = {
    type: "external-html",
    url: "text/information.html",
    cont_btn: "weiter",
};

//consent sheet
var element = document.createElement("div");

var check_consent = function(elem){
    if (document.getElementById('consent_checkbox').checked) {
        return true;
    } else {
        alert("Danke für Ihr Interesse an unserem Experiment. Wenn Sie teilnehmen möchten, geben Sie bitte Ihr Einverständnis.");
        return false;} 
    return false;
};

var html_consent = {
    type: "external-html",
    url: "text/consent.html",
    cont_btn: "weiter",
    check_fn: check_consent
};

//codeword
var codeword = {
    type: "survey-html-form",
    preamble: '<p> <b> Generieren Sie bitte Ihr persönliches Codeword. </b></p>',
    html:   '<html style="font-family:calibri"><head><style>.button {border: none;color: white; padding: 15px 32px;text-align: left;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;font-family: "calibri";}'+
            '.button1 {background-color: #6e7479;}</style>'+   
            '<p align="justify">' +
            'Das Codewort wird benötigt, damit Sie ggf. später die Löschung Ihrer Daten verlangen können. Um Ihre Daten richtig zuordnen zu können, ohne die Geheimhaltung zu verletzen, benötigen wir ein Kenn- oder Codewort. Das Codewort ist so aufgebaut, dass niemand von Ihrem Codewort auf Ihre Person rückschließen kann, auch wir nicht. Sie selbst können Ihr Codewort aber jederzeit rekonstruieren, wenn Sie danach gefragt werden und es vergessen haben sollten. Wir brauchen Ihnen nur die Regel zu verraten, nach der Sie es herstellen müssen.<br> <br>' +
            '1.	Die beiden letzten Buchstaben des Geburtsnamens Ihrer Mutter (z.B. Müll<b>er</b>) <br> 2.	Die Anzahl der Buchstaben des (ersten) Vornamens Ihrer Mutter (z.B. "Elke" <b>04</b>) <br>'+
            '3.	Die beiden letzten Buchstaben des (ersten) Vornamens Ihres Vaters (z.B. Pa<b>ul</b>) <br> 4.	Ihr eigener Geburtstag (nur der Tag, nicht Monat und/oder Jahr).(z.B. <b>09</b>) <br> <br></p>'+
            '<label for="codeword_enter">Geben Sie die 8 Zeichen Ihres persönlichen Codewortes ein: </label>' +
            '<input type="text" class = "button button1" id="codeword_enter" name="codeword_enter" required minlength="8" maxlength="8" size="8">'+
            '<p></p></html>',
    on_finish: function(data){
        var responses = JSON.parse(data.responses);
        var help_codeword = responses.codeword_enter;
        jsPsych.data.addProperties({codeword: help_codeword});
    },
    button_label: 'Weiter'
};

//demographische Angaben
var demographics = {
    type: "survey-html-form",
    preamble: '<p><b> Machen Sie bitte zunächst einige Angaben über sich selbst. </b></p>',
    html:   '<html style="font-family:calibri"><head><style>.button {border: none;color: white; padding: 15px 32px;text-align: left;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;font-family: "calibri";}'+
            '.button1 {background-color: #6e7479;}</style>'+
            '</head>'+   
            '<p><label for="age">Geben Sie Ihr Alter ein: </label>' +
            '<p><input type="text" class = "button button1" id="age" name="age" required minlength="2" maxlength="2" size="2"></p>' +    
            '</p><p>'+
            '<label for="education">Geben Sie Ihren aktuellen beruflichen Status an: </label>'+
            '<p><select name="education" id="education" class = "button button1"><option value="NA">---</option><option value="1">Studierende/r</option><option value="2">Berufstätig</option><option value="3">Arbeitssuchend</option>'+
            '<option value="4">keine Angabe</option></select></p>'+
            '</p><p>'+
            '<label for="subject">Geben Sie Ihr Studienfach an: </label>'+
            '<p><select name="subject" id="subject" class = "button button1"><option value="NA">---</option><option value="1">Psychologie</option><option value="2">Kognitionswissenschaften</option><option value="3">anderes Studienfach</option>'+
            '<option value="4">keine Angabe/ nicht zutreffend</option></select></p>'+
            '</p><p>'+
            '<label for="gender">Geben Sie Ihr Geschlecht an: </label>'+
            '<p><select name="gender" id="gender" class = "button button1"><option value="NA">---</option><option value="0">weiblich</option><option value="1">männlich</option><option value="2">divers</option>'+
            '<option value="3">keine Angabe</option></select></p>' +
            '<label for="handedness">Geben Sie Ihre Händigkeit an! </label>'+
            '<p><select name="handedness" id="handedness" class = "button button1"><option value="NA">---</option><option value="1">rechtshändig</option><option value="2">linkshändig</option>'+
            '<option value="3">keine Angabe</option></select></p>' +
            '</p></html>' +
            '<label for="chinese">Haben Sie Vorkenntnisse in chinesischer Schrift und Sprache? </label>'+
            '<p><select name="chinese" id="chinese" class = "button button1"><option value="NA">---</option><option value="0">Ja</option><option value="1">Nein</option>'+
            '<option value="2">keine Angabe</option></select></p>' +
            '</p></html>',
    on_finish: function(data){
        var responses = JSON.parse(data.responses);
        var help_age= responses.age;
        var help_gender = responses.gender;
        var help_education = responses.education;
        var help_chinese = responses.chinese;
        var help_subject = responses.subject;
        var help_handedness = responses.handedness;
        jsPsych.data.addProperties({gender: help_gender, age: help_age, education: help_education, chinese: help_chinese, fach: help_subject, handedness: help_handedness});
    },
    button_label: 'Weiter'
};

var comment = {
    type: 'survey-text',
    preamble: '<b>Wir würden uns jetzt noch über Ihr Feedback zur Studie freuen. Dieses Feedback ist freiwillig.</b>',
    questions: [
        {prompt: ' Wie war die Teilnahme für Sie? Ist Ihnen irgendetwas aufgefallen? Haben Sie sonst noch einen Kommentar?', rows: 10, columns: 150}
    ],
    button_label: 'Weiter'
};

// ********************** Instruktionen
//display instructions
var instructions01 = {
    type: "survey-html-form",
    html:   "<p> Liebe Versuchsperson, <br> <br>" +
            "Willkommen zu unserer Studie. Wir freuen uns, dass Sie dabei sind! <br> <br>" +
            "In der vorliegenden Studie geht es darum, wie Menschen auf verschiedene Bilder reagieren und ihre Umwelt wahrnehmen.<br> <br>" +
            "Zunächst werden Sie an einer einfachen Wahrnehmungsaufgabe teilnehmen. Dazu werden Ihnen am Bildschirm verschiedene chinesische Zeichen mit positiven oder negativen Bildern kurz gemeinsam dargeboten. " +
            "Bitte schauen Sie sich die Bilder und Zeichen aufmerksam an. Sie haben dreimal die Möglichkeit, eine kurze Pause zu machen. <br> <br>" +        
            "<br>Alles klar? Dann starten Sie die Wahrnehmungsphase!</p>",
    button_label: "Weiter",
    post_trial_gap: 2000
};

//display instructions direct rating phase
var instructions02 = {
    type: "survey-html-form",
    html:   "<p>" +
            "Nun möchten wir Sie darum bitten, auf einer stufenlosen Skala anzugeben, wie angenehm oder unangenehm Sie die chinesischen Zeichen finden. <br>Verlassen Sie sich dabei wieder ganz auf Ihren ersten Eindruck."+
             " Uns interessiert Ihre spontane Reaktion. <br> <br>" +
             "Benutzen Sie die Maus, um eine Stelle auf der Skala zu markieren, die Ihrer Einschätzung entspricht. Durch einen erneuten Klick auf die Skala können Sie Ihre Eingabe korrigieren.</p>",
    button_label: "Los geht's!",
    post_trial_gap: 2000
};

//display instructions indirect rating phase
var instructions03 = {
    type: "html-keyboard-response",
    stimulus:   "<p>Sie sehen nun die chinesischen Zeichen nur ganz kurz. Danach sehen Sie die jeweilige Aussprache der Zeichen als Silbe auf dem Bildschrim. Ihre Aufgabe ist es, für jede Silbe anzugeben, ob diese etwas angenehmes, oder unangenehmes bedeuten könnte. Verlassen Sie sich hier vor allem auf Ihre Intuition.<br>"+
            "<br>Die Zeichen werden nur zur Orientierung dargestellt, beachten Sie sie deshalb nicht. Konzentrieren Sie sich vor allem auf die Silben. <br>" +
            "Reagieren Sie mit folgenden zwei Tasten: <br><br>" +
            "<b>'D' </b> wenn die Silbe etwas <b>unangenehmes</b> bedeuten könnte. <br>" +
            "<b>'K'</b> wenn die Silbe etwas <b>angenehmes</b> bedeuten könnte. <br><br>" +
            "Bitte legen Sie nun den Zeigefinger der linken Hand auf die Taste 'D' und den Zeigefinger der rechten Hand auf die Taste 'K'. <br>" +
            "Reagieren Sie auf jede Silbe so schnell wie möglich. Uns interessiert Ihre spontane Reaktion. <br> <br> <br>" +
            "Drücken Sie 'D' oder 'K', um die nächste Aufgabe zu starten. </p>",
    choices: ['d', 'k'],
    post_trial_gap: 2000
};

//display instructions rating of all stimuli
var instructions04 = {
    type: "survey-html-form",
    html:   "<p> Als letztes möchten wir Sie darum bitten, auf einer stufenlosen Skala anzugeben, wie angenehm oder unangenehm Sie die verschiedenen Gruppen der chinesischen Zeichen finden. <br><br> Verlassen Sie sich dabei wieder ganz auf Ihren ersten Eindruck."+
             "<br>Uns interessiert Ihre spontane Reaktion. <br> <br>",
    button_label: "Los geht's!",
    post_trial_gap: 1000
};

//Instruktionen vor jedem Lernblock
var break_instruction = {
    type: "survey-html-form",
    html: "<p>Jetzt haben Sie kurz Zeit für eine Pause.</p>",
    button_label: "Weiter",
    post_trial_gap: 2000
};

//End Experiment
var end_instruction = {
    type: "survey-html-form",
    html: "<p>Bitte melden Sie sich jetzt bei der Versuchsleitung.</p>",
    button_label: "Ende",
    post_trial_gap: 2000
};

// ********************** select CS, select GS, select US, select targets

//select CS from CS pool
var CScat1 = jsPsych.randomization.sampleWithoutReplacement(material.CScat1_pool, material.CScat1_pool.length);
var CScat2 = jsPsych.randomization.sampleWithoutReplacement(material.CScat2_pool, material.CScat2_pool.length);
var CScat3 = jsPsych.randomization.sampleWithoutReplacement(material.CScat3_pool, material.CScat3_pool.length);
var CScat4 = jsPsych.randomization.sampleWithoutReplacement(material.CScat4_pool, material.CScat4_pool.length);

var USneg = jsPsych.randomization.sampleWithoutReplacement(material.usneg_pool, material.usneg_pool.length);
var USpos = jsPsych.randomization.sampleWithoutReplacement(material.uspos_pool, material.uspos_pool.length);

var categories_nr = jsPsych.randomization.repeat([1,2,3,4],1); //assignment of categories to position


var categories = []; //add stimuli to each category
var prototype_stimuli = []; //add abstract stmuli
var GSnew_stimuli = []; //add unsimilar CS stimuli
var Group_stimuli = []; //add pictures with groups of CSs

for (var index = 0; index < categories_nr.length; index++ ){
    if (categories_nr[index] == 1){
        categories[index] = CScat1;
        prototype_stimuli[index] = material.PTcat1;
        GSnew_stimuli[index] = material.GScat1_pool;
        Group_stimuli[index] = material.Allcat1;
    } else if (categories_nr[index] == 2){
        categories[index] = CScat2;
        prototype_stimuli[index] = material.PTcat2;
        GSnew_stimuli[index] = material.GScat2_pool;
        Group_stimuli[index] = material.Allcat2;
    } else if (categories_nr[index] == 3){
        categories[index] = CScat3;
        prototype_stimuli[index] = material.PTcat3;
        GSnew_stimuli[index] = material.GScat3_pool;
        Group_stimuli[index] = material.Allcat3;
    } else{
        categories[index] = CScat4;
        prototype_stimuli[index] = material.PTcat4;
        GSnew_stimuli[index] = material.GScat4_pool;
        Group_stimuli[index] = material.Allcat4;
    };
}

//select targets for all stimuli
var stimuliAll = (number_CS + number_GS + number_GSnew + number_prototype) * categories.length;
var targets_all = jsPsych.randomization.sampleWithoutReplacement(material.targets, stimuliAll);

//assign stimuli to conditionoing procedure
var conditioning_many = [];
var conditioning_one = [];

var cs = 0;

    for (var category = 0; category < categories.length; category ++){
        if (condition_assignment == "one_one"){ 
            //select 1 stimulus per category, and 1 specific US for each category
            //odd categoires 1 and 3: positive
            if (isOdd(category)){
                conditioning_one[cs] = {
                    CS: categories[category][0], 
                    US: USpos[cs], //assigns same US
                    data: {val: 'pos',type: 'CS', type_specific: 'CS', category: categories_nr[category], cs_selected: categories[category][0]}
                }; 
            //even categories 0 and 2: negative
            } else {
                conditioning_one[cs] = {
                    CS: categories[category][0], 
                    US: USneg[cs], //assigns same CS
                    data: {val: 'neg',type: 'CS',type_specific: 'CS', category: categories_nr[category], cs_selected: categories[category][0]}
                }; 
            };
            cs += 1;
        } else {
        //select 3 stimuli per category, each stimulus with one specific US

            for (var index = 0; index < number_CS; index++ ){
                if (isOdd(category)){
                    conditioning_many[cs] = {
                        CS: categories[category][index],
                        US: USpos[cs],
                        data: {val: 'pos',type: 'CS',type_specific: 'CS', category: categories_nr[category], cs_selected: categories[category][index]}
                    };
                } else {
                    conditioning_many[cs] = {
                        CS: categories[category][index],
                        US: USneg[cs],
                        data: {val: 'neg',type: 'CS',type_specific: 'CS', category: categories_nr[category], cs_selected: categories[category][index]}
                    };
                }; 
                cs += 1;
            };
        };
    };


//***********************************  assign stimuli to rating phase
var ratingStimuli = [];
var number = 0;

//add CS from conditioning phase
if(condition_assignment == "one_one"){
    for (var index = 0; index < conditioning_one.length; index++){
        ratingStimuli[number] = {
            CSrating: conditioning_one[index].CS,
            data: {val: conditioning_one[index].data.val, type: conditioning_one[index].data.type, type_specific: conditioning_one[index].data.type_specific, category: conditioning_one[index].data.category, cs_selected: conditioning_one[index].data.cs_selected, target: targets_all[number]},
            target: targets_all[number]
        };
        number += 1;
    };
} else {
    for (var index = 0; index < conditioning_many.length; index++){
        ratingStimuli[number] = {
            CSrating: conditioning_many[index].CS,
            data: {val: conditioning_many[index].data.val, type: conditioning_many[index].data.type, type_specific: conditioning_many[index].data.type_specific, category: conditioning_many[index].data.category, cs_selected: conditioning_many[index].data.cs_selected, target: targets_all[number]},
            target: targets_all[number]
        };
        number += 1;
    };
};

//add 3 similar generalization stimuli of each category to rating phase
for (var category = 0; category < categories.length; category ++){  
    for (var index = number_CS; index < number_CS+number_GS; index++ ){
        
        //odd categories (0/2): get positive valence
        if (isOdd(category)){   
            ratingStimuli[number] = {
                CSrating: categories[category][index],
                data: {val: 'pos', type: 'GS',type_specific: 'GSold', category: categories_nr[category], cs_selected: categories[category][index], target: targets_all[number]},
                target: targets_all[number]
            };
        } else {
            ratingStimuli[number] = {
                CSrating: categories[category][index],
                data: {val: 'neg', type: 'GS',type_specific: 'GSold', category: categories_nr[category], cs_selected: categories[category][index], target: targets_all[number]},
                target: targets_all[number]
            };
        };
        number += 1;
    };
};

//add 3 unsimilar generlaization stimuli of each category to rating phase
for (var category = 0; category < categories.length; category ++){  
    for (var index = 0; index < number_GSnew; index++ ){
        
        //odd categories (0/2): get positive valence
        if (isOdd(category)){   
            ratingStimuli[number] = {
                CSrating: GSnew_stimuli[category][index],
                data: {val: 'pos', type: 'GS', type_specific: 'GSnew', category: categories_nr[category], cs_selected: GSnew_stimuli[category][index], target: targets_all[number]},
                target: targets_all[number]
            };
        } else {
            ratingStimuli[number] = {
                CSrating: GSnew_stimuli[category][index],
                data: {val: 'neg', type: 'GS',type_specific: 'GSnew', category: categories_nr[category], cs_selected: GSnew_stimuli[category][index], target: targets_all[number]},
                target: targets_all[number]
            };
        };
        number += 1;
    };
};

//add abstract stimuli
for (var category = 0; category < categories.length; category ++){  
    for (var index = 0; index < number_prototype; index++ ){
        
        //odd categories (0/2): get positive valence
        if (isOdd(category)){   
            ratingStimuli[number] = {
                CSrating: prototype_stimuli[category][index],
                data: {val: 'pos', type: 'GS', type_specific: 'abstract', category: categories_nr[category], cs_selected: prototype_stimuli[category][index], target: targets_all[number]},
                target: targets_all[number]
            };
        } else {
            ratingStimuli[number] = {
                CSrating: prototype_stimuli[category][index],
                data: {val: 'neg', type: 'GS',type_specific: 'abstract', category: categories_nr[category], cs_selected: prototype_stimuli[category][index], target: targets_all[number]},
                target: targets_all[number]
            };
        };
        number += 1;
    };
};

//add stimuli_all pictures
var groupRating = [];
for (var category = 0; category < categories.length; category ++){  
    for (var index = 0; index < number_prototype; index++ ){   
        //odd categories (0/2): get positive valence
        if (isOdd(category)){   
            groupRating[category] = {
                CSrating: Group_stimuli[category][index],
                data: {val: 'pos', type: 'All', type_specific: 'all', category: categories_nr[category], cs_selected: Group_stimuli[category][index]},
            };
        } else {
            groupRating[category] = {
                CSrating: Group_stimuli[category][index],
                data: {val: 'neg', type: 'All',type_specific: 'all', category: categories_nr[category], cs_selected: Group_stimuli[category][index]},
            };
        };
    };
};

/************************************************* learning phase  */

//CS and US simultaneous presentation
var conditioning = {
    type: "html-keyboard-response",
    stimulus: function(){

        var positioning = jsPsych.randomization.sampleWithoutReplacement([1,2],1);

        if (positioning == "1"){
            var html = "<div class = 'row'>";
            html += "<div class = 'column'>";
            html += "<img src = '" + jsPsych.timelineVariable('CS', true) + "' width = '70%;'>";
            html +="</div>";
            html += "<div class = 'column'>";
            html += "<img src = '" + jsPsych.timelineVariable('US', true) + "' width = '100%;'>";
            html += "</div>";
            html += "</div>";
            return html;
        } else {
            var html = "<div class = 'row'>";
            html += "<div class = 'column'>";
            html += "<img src = '" + jsPsych.timelineVariable('US', true) + "' width = '100%;'>";
            html +="</div>";
            html += "<div class = 'column'>";
            html += "<img src = '" + jsPsych.timelineVariable('CS', true) + "' width = '70%;'>";
            html += "</div>";
            html += "</div>";
            return html;
        };
    }, 
    choices: jsPsych.NO_KEYS,
    trial_duration: 2000,
    post_trial_gap: 500,
    data: jsPsych.timelineVariable('data'),
    /*data: {
        selected_US: jsPsych.timelineVariable('US')
    }*/
};

//make sure there are no neighbouring CS stimuli
if (condition_assignment == "one_one"){
    var repeated_conditioning = jsPsych.randomization.repeat(conditioning_one, number_CS*rep_per_block); //repeat each CS 5 times (total 20)
} else {
    var repeated_conditioning = jsPsych.randomization.repeat(conditioning_many, rep_per_block); // repeat each CS 1 times (total 20)
};

//*******************  between subjects: see one vs. many CSs, see 3 blocks of learning, total 120 repetitions

//check for repeating stimuli

if (condition_assignment == "one_one"){
    var block1 = noRepeats(repeated_conditioning);
    var block2 = noRepeats(repeated_conditioning);
    var block3 = noRepeats(repeated_conditioning);
    var block4 = noRepeats(repeated_conditioning);
} else {
    var block1 = jsPsych.randomization.sampleWithoutReplacement(repeated_conditioning, repeated_conditioning.length);
    var block2 = jsPsych.randomization.sampleWithoutReplacement(repeated_conditioning, repeated_conditioning.length);
    var block3 = jsPsych.randomization.sampleWithoutReplacement(repeated_conditioning, repeated_conditioning.length);
    var block4 = jsPsych.randomization.sampleWithoutReplacement(repeated_conditioning, repeated_conditioning.length);
}


//check for block beginning and ending
var block2 = endbeg(block1, block2, repeated_conditioning, condition_assignment);
var block3 = endbeg(block2, block3, repeated_conditioning, condition_assignment);
var block4 = endbeg(block3, block4, repeated_conditioning, condition_assignment);

var learning_phase = {
    timeline: [
        {timeline: [conditioning],
        timeline_variables: block1 //contains 20 shuffled stimuli
        },
        break_instruction,
        {timeline: [conditioning],
            timeline_variables: block2, 
        },
        break_instruction,
        {timeline: [conditioning],
            timeline_variables: block3, 
        },
        break_instruction,
        {timeline: [conditioning],
            timeline_variables: block4, 
        }
    ],
    on_finish: function(data) {
        if(data.key_press == 69) { //press letter 'e' to skip this part
            jsPsych.endCurrentTimeline();
        }
      }
};



/* *********************************************** direct rating phase */

//rating phase - direct rating (slider)
var rating = {
    type: "image-slider-response",
    stimulus: jsPsych.timelineVariable('CSrating'),
    labels: ['unangenehm', 'angenehm'],
    prompt: "<p> Bitte geben Sie an, wie angenehm oder unangenehm Sie das dargestellte Zeichen finden.</p>",
    require_movement: true,
    button_label: 'Weiter',
    min: -100,
    max: 100,
    start: 0,
    data: jsPsych.timelineVariable('data'),
    stimulus_height: 200,
    stimulus_width: 200,
    on_finish: function(data){
        data.task = 'direct';
    }
};

//rating phase timeline
var rating_phase = {
    timeline:[rating],
    timeline_variables: ratingStimuli,
    randomize_order: true,
};

/* ********************************** indirect rating phase */

//fixation cross
var fixation = {
    type: 'html-keyboard-response',
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: jsPsych.NO_KEYS,
    trial_duration: 1000,
  }

//present prime
var prime = {
    type: "html-keyboard-response",
    stimulus: function(){
       var html = "<img src = '" + jsPsych.timelineVariable('CSrating', true) + "' width = '100%;'>";
       return html;
    },
    choices: jsPsych.NO_KEYS,
    trial_duration: 90,
    post_trial_gap: 125,
};

//present target
var target = {
    type: "html-keyboard-response",
    stimulus: function(){
        var html = "<img src = '" + jsPsych.timelineVariable('target', true) + "' width = '100%;'>";
        return html
    },
    choices: jsPsych.NO_KEYS,
    trial_duration: 125,
    post_trial_gap: 0
};

//present mask
var track_presentation = 0;

var answer = {
    type: "html-keyboard-response",
    stimulus: function(){
        var html = "<img src = 'targets/mask.png' width = '100%;'>";
        return html
    },
    choices: ['d', 'k'],
    prompt: "<p>'D' für unangenehm 'K' für angenehm </p>",
    post_trial_gap: 500,
    data: jsPsych.timelineVariable('data'),
    on_finish: function(data){
        if (jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(data.key_press) == 'd'){
            data.indirect = '0';
            data.task = 'indirect';
            data.nr_pres = track_presentation;
            track_presentation += 1;
        } else {
            data.indirect = '1';
            data.task = 'indirect';
            data.nr_pres = track_presentation;
            track_presentation += 1;
        };
    }
};

//indirect rating phase timeline
var indirect_phase1 = {
    timeline: [fixation, prime, target, answer],
    timeline_variables: ratingStimuli.slice(0, ratingStimuli.length/2),
    randomize_order: true
};

var indirect_phase2 = {
    timeline: [fixation, prime, target, answer],
    timeline_variables: ratingStimuli.slice(ratingStimuli.length/2, ratingStimuli.length),
    randomize_order: true
};

/* ***************************************** Rating Phase all */
var group_rating = {
    type: "image-slider-response",
    stimulus: jsPsych.timelineVariable('CSrating'),
    labels: ['unangenehm', 'angenehm'],
    prompt: "<p> Bitte geben Sie an, wie angenehm oder unangenehm Sie die Gruppe der Zeichen finden. </p>",
    require_movement: true,
    button_label: 'Weiter',
    min: -100,
    max: 100,
    start: 0,
    data: jsPsych.timelineVariable('data'),
    stimulus_height: 200,
    stimulus_width: 200,
    on_finish: function(data){
        data.task = 'all';
    }
};

//rating phase timeline
var all_rating = {
    timeline:[group_rating],
    timeline_variables: groupRating,
    randomize_order: true,
};

/* ******************************************* End Experiment */
//Debriefing & second consent
var check_debrief = function(elem){
    if (document.getElementById('debrief_checkbox').checked) {
        return true;
    } else {
        alert("Falls Sie Ihre Daten nicht für die Verwendung freigeben möchten, schließen Sie jetzt einfach das Browserfenster.");
        return false;} 
    return false;
};

var html_debrief = {
    type: "external-html",
    url: "text/debrief.html",
    cont_btn: "weiter",
    check_fn: check_debrief
};



/* *********************************************** Data Storage */
/* START: save data */
function saveData(name, data){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'write_data.php'); 
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({filename: name, filedata: data}));}
    
    var save_data_block = {
                            type: 'call-function',
                            func: function(){saveData("CS"+"_"+"Variability"+"_"+"CHINESE"+"_"+version+"_"+subject_id, jsPsych.data.get().csv());},
                            timing_post_trial: 200
                          };
/* END: save data */

/******************************** create experimental timeline */
var timeline = [];
timeline.push(fullscreen_on);

//starting phase
timeline.push(html_information, html_consent, codeword, demographics); 

//learning phase
timeline.push(instructions01, learning_phase);

//rating phase
if (rating_assignment == "direct_first"){
    timeline.push(instructions02, rating_phase);
    timeline.push(instructions03, indirect_phase1, break_instruction, indirect_phase2);
} else{
    timeline.push(instructions03, indirect_phase1, break_instruction, indirect_phase2);
    timeline.push(instructions02, rating_phase); 
};

timeline.push(instructions04, all_rating);
timeline.push(comment);

timeline.push(save_data_block);
timeline.push(html_debrief, end_instruction); 
timeline.push(fullscreen_off);

// pass the array
jsPsych.init({
    timeline: timeline,
    show_preload_progress_bar: true,
    preload_images: [material.usneg_pool, material.uspos_pool, material.CScat1_pool, material.CScat2_pool, material.CScat3_pool, material.CScat4_pool, 
                    material.targets, material.GScat1_pool, material.GScat2_pool, material.GScat3_pool, material.GScat4_pool],
    on_finish: function(){
            localStorage.setItem("parentPage", "1");
            },
})

