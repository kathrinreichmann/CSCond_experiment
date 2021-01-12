//functions required

export function isOdd(num) {return num%2;};



//check for repeating stimuli
export function noRepeats(array){
    var index = 0;
    var new_array = array;

    while (index < new_array.length - 1){
            if (new_array[index]["CS"] == new_array[index+1]["CS"]) {
                new_array = jsPsych.randomization.shuffle(new_array);
                index = 0;
            } else {
                index += 1;
            };
    };
    return new_array;
};

export function endbeg(array1, array2, original, condition_assignment){
    if (condition_assignment == "one_one"){
        while (array1[array1.length - 1]["CS"] == array2[0]["CS"]){
            array2 = noRepeats(original);
        };
        return array2;
    } else {
        while (array1[array1.length - 1]["CS"] == array2[0]["CS"]){
            array2 = jsPsych.randomization.sampleWithoutReplacement(original, original.length);
        };
        return array2;
    };
};
