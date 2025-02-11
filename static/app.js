$(document).ready(function() {
    // Functionality to add a note
   $("#note-form").submit(function(e) {
        e.preventDefault();

        // Get the note text
        const note = $("#note").val();

        // Check if the note is empty
        if (note.trim() === "") {
            // Show an alert or provide feedback to the user
            alert("Please enter text before adding a note.");
            return;
        }

        // Disable the input field and the "Add" button
        $("#note, #add-btn").prop("disabled", true);

        // Make the AJAX request to add the note
        $.post("/add_note", { note: note }, function(data) {
            // Re-enable the input field and the "Add" button
            $("#note, #add-btn").prop("disabled", false);

            // Clear the input field
            $("#note").val("");

            // Prepend the new note to the list
            $("#notes").prepend(
                `<div class='note card mb-2' data-id='${data.id}'>
                    <div class='card-body'>
                        <p class='card-text'>${data.note}</p>
                        <button class='btn btn-primary edit-note'>Edit</button>
                        <button class='btn btn-danger delete-note'>Delete</button>
                    </div>
                </div>`
            );
        });
    });

    // Functionality to delete a note
    $("#notes").on("click", ".delete-note", function() {
        const noteElement = $(this).closest(".note");
        const noteId = noteElement.data("id");

        $.post("/delete_note", { id: noteId }, function(data) {
            noteElement.remove();
        });
    });

    // Functionality to edit a note
    $("#notes").on("click", ".edit-note", function() {
        const noteElement = $(this).closest(".note");
        const noteId = noteElement.data("id");
        const noteText = noteElement.find(".card-text").text();
        const newText = prompt("Edit the note:", noteText);

        if (newText !== null) {
            $.post("/edit_note", { id: noteId, note: newText }, function(data) {
                noteElement.find(".card-text").text(data.note);
            });
        }
    });

    // Load notes from the server
    $.get("/get_notes", function(data) {
        for (const note of data.notes) {
            $("#notes").append(
                `<div class='note card mb-2' data-id='${note.id}'>
                    <div class='card-body'>
                        <p class='card-text'>${note.note}</p>
                        <button class='btn btn-primary edit-note'>Edit</button>
                        <button class='btn btn-danger delete-note'>Delete</button>
                    </div>
                </div>`
            );
        }
    });
});