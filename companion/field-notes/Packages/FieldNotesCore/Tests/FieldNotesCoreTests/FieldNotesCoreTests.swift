import Foundation
import FieldNotesCore
import FieldNotesTestSupport
import Testing

@Test("Notes are ordered by update time")
func notesAreOrderedByUpdateTime() async throws {
    let library = NoteLibrary(repository: FieldNotesFixtures.repository())

    let notes = try await library.notes()

    #expect(notes.map(\.id) == [FieldNotesFixtures.redwood.id, FieldNotesFixtures.tidePools.id])
}

@Test("Search covers title, body, and tags", arguments: [
    ("redwood", FieldNotesFixtures.redwood.id),
    ("anemones", FieldNotesFixtures.tidePools.id),
    ("MORNING", FieldNotesFixtures.redwood.id),
])
func searchCoversVisibleFields(query: String, expectedID: NoteID) async throws {
    let library = NoteLibrary(repository: FieldNotesFixtures.repository())

    let notes = try await library.notes(matching: query)

    #expect(notes.map(\.id) == [expectedID])
}

@Test("Titles and tags are normalized")
func titlesAndTagsAreNormalized() throws {
    let note = try FieldNote(
        id: NoteID(rawValue: "note-normalized"),
        title: "  City garden  ",
        tags: [" city ", "CITY", "", "pollinators"],
        createdAt: FieldNotesFixtures.firstDate,
        updatedAt: FieldNotesFixtures.firstDate
    )

    #expect(note.title == "City garden")
    #expect(note.tags == ["city", "pollinators"])
}

@Test("Blank titles are rejected", arguments: ["", " ", "\n\t"])
func blankTitlesAreRejected(title: String) {
    #expect(throws: FieldNoteValidationError.blankTitle) {
        try FieldNote(
            id: NoteID(rawValue: "note-invalid"),
            title: title,
            createdAt: FieldNotesFixtures.firstDate,
            updatedAt: FieldNotesFixtures.firstDate
        )
    }
}

@Test("Favorite changes replace the stored note")
func favoriteChangesReplaceStoredNote() async throws {
    let repository = FieldNotesFixtures.repository()
    let library = NoteLibrary(repository: repository)

    let updated = try await library.setFavorite(
        id: FieldNotesFixtures.tidePools.id,
        to: true,
        at: FieldNotesFixtures.secondDate
    )
    let notes = try await library.notes()

    #expect(updated.isFavorite)
    #expect(notes.count == 2)
    #expect(notes.first(where: { $0.id == updated.id }) == updated)
}

@Test("Missing note mutation returns a domain error")
func missingNoteMutationReturnsDomainError() async {
    let missingID = NoteID(rawValue: "note-missing")
    let library = NoteLibrary(repository: InMemoryNoteRepository())

    await #expect(throws: NoteLibraryError.noteNotFound(missingID)) {
        try await library.setFavorite(
            id: missingID,
            to: true,
            at: FieldNotesFixtures.secondDate
        )
    }
}

@Test("Failure fixtures stay explicit")
func failureFixturesStayExplicit() async {
    let library = NoteLibrary(repository: FailingNoteRepository())

    await #expect(throws: FieldNotesFixtureFailure.requested) {
        try await library.notes()
    }
}
