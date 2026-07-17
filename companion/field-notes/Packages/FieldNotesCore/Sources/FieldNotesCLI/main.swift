import FieldNotesCore
import FieldNotesTestSupport

@main
struct FieldNotesCLI {
    static func main() async throws {
        let library = NoteLibrary(repository: FieldNotesFixtures.repository())

        for note in try await library.notes() {
            let marker = note.isFavorite ? "*" : "-"
            print("\(marker) \(note.title)")
        }
    }
}
