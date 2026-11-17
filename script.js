$(function() { 

    // Called function to update the name, weight, happiness, and energy of our pet in the HTML
    checkAndUpdatePetInfoInHtml();

    // Button clicks call associated functions
    $('.treat-button').click(clickedTreatButton);
    $('.play-button').click(clickedPlayButton);
    $('.exercise-button').click(clickedExerciseButton);
    $('.nap-button').click(clickedNapButton);

});

// Added weight and energy limit bounds for an average crocodile, in pounds
const minWeight = 400;
const maxWeight = 1000;
const maxEnergy = 10;

// Defines pet's name, weight (number), happiness (number), and energy (number) for 
// the new Nap button. The weight starts in the middle of the min/max range.
var pet_info = {name: "Coco", weight: 700, happiness: 5, energy: 5};

function clickedTreatButton() {
    // Conditional to have pet refuse treats once he's at the maximum weight
    if (pet_info['weight'] >= maxWeight) {
        showPetComment("\"Coco is full! Cease your offerings, peasant!\"");
    } else {
        // Otherwise increase pet happiness
        pet_info['happiness'] += 2;
        // And also increase pet weight
        pet_info['weight'] += 20;
        checkAndUpdatePetInfoInHtml();
        showPetComment("\"Coco is pleased by your offering!\"");
    }
}

function clickedPlayButton() {
    // This is checked before the weight changes, so the hungry comment only shows
    // if Coco was already at the minimum weight
    const wasAtMinWeight = pet_info['weight'] <= minWeight;

    // Otherwise increase pet happiness
    pet_info['happiness'] += 1;
    // And decrease pet weight
    pet_info['weight'] -= 10;
    // Also, playing costs 1 energy
    pet_info['energy'] -= 1;
    checkAndUpdatePetInfoInHtml();

    if (wasAtMinWeight) {
        showPetComment("Coco is eyeing you hungrily.");
    } else {
        showPetComment("\"Coco will deign to play with you briefly.\"");
    }
}

// Mostly the same as clickedPlayButton function, main difference is the comment displayed
function clickedExerciseButton() {
    const wasAtMinWeight = pet_info['weight'] <= minWeight;

    pet_info['happiness'] -= 1;
    pet_info['weight'] -= 20;
    pet_info['energy'] -= 2;
    checkAndUpdatePetInfoInHtml();

    if (wasAtMinWeight) {
        showPetComment("Coco is eyeing you hungrily.");
    } else {
        showPetComment("Coco exercises for a while. He definitely isn't training to escape... right?");
    }
}

function clickedNapButton() {
    // Napping just restores 2 energy
    pet_info['energy'] += 2;
    checkAndUpdatePetInfoInHtml();
    showPetComment("Coco takes a brief nap and dreams of vengeance.");
}

function checkAndUpdatePetInfoInHtml() {
    checkStatsBeforeUpdating();
    updatePetInfoInHtml();
}

// Main purpose of this function is to ensure values are staying within
// set bounds before committing an update, to avoid escapes
function checkStatsBeforeUpdating() {
    // Keep weight between the minimum and maximum
    if (pet_info['weight'] < minWeight) {
        pet_info['weight'] = minWeight;
    } else if (pet_info['weight'] > maxWeight) {
        pet_info['weight'] = maxWeight;
    }

    // Keep happiness from going below zero
    if (pet_info['happiness'] < 0) {
        pet_info['happiness'] = 0;
    }

    // Keep energy between zero and the maximum
    if (pet_info['energy'] < 0) {
        pet_info['energy'] = 0;
    } else if (pet_info['energy'] > maxEnergy) {
        pet_info['energy'] = maxEnergy;
    }
}

// Updates HTML with the current values in pet_info object
function updatePetInfoInHtml() {
    $('.name').text(pet_info['name']);
    $('.weight').text(pet_info['weight']);
    $('.happiness').text(pet_info['happiness']);
    $('.energy').text(pet_info['energy']);


    // Each of these buttons are disabled when the croc doesn't have enough energy.
    // A disabled button doesn't fire its click event, so the click
    // functions don't need their own energy check
    $('.play-button').prop('disabled', pet_info['energy'] < 1);
    $('.exercise-button').prop('disabled', pet_info['energy'] < 2);
}

// This function shows the pet's comment for a moment after each button press
// using stop and delay methods with a named queue
function showPetComment(comment) {
	
    // .stop('comment', true, true) halts anything still running in the
    // "comment" queue. The first true clears the animations still waiting
    // in the queue, and the second true jumps the current animation straight
    // to its end. On a named queue this also cancels a .delay() mid-wait.
    // Without it, clicking buttons quickly stacks up fades and the
    // comment keeps flickering long after you stop clicking.
    $('.pet-comment').stop('comment', true, true)
        .text(comment)
        .fadeTo({duration: 200, queue: 'comment'}, 1)
		
        // .delay(2000, 'comment') here pauses the "comment" queue for 2
		// seconds before the next animation in it runs.
        // Its use here is to keep the comment fully visible for 2 seconds 
        // after it fades in, then lets the second .fadeTo() fade it back out.
        // .delay() only affects animations, which means it needs to 
        // sits between the two fades.
        .delay(2000, 'comment')
        .fadeTo({duration: 400, queue: 'comment'}, 0)
		
        // A named queue doesn't start on its own like the default one
        // does, so .dequeue() had to be added in to start it running
        .dequeue('comment');
}

