import FieldNotesCore
import Observation
import SwiftUI

@main
struct FieldNotesSwiftUIApp: App {
    @State private var model = NoteListModel(
        library: NoteLibrary(repository: InMemoryNoteRepository())
    )

    var body: some Scene {
        WindowGroup {
            NoteListView(model: model)
        }
    }
}

@MainActor
@Observable
final class NoteListModel {
    private let library: NoteLibrary

    private(set) var notes: [FieldNote] = []
    private(set) var isLoading = false
    private(set) var errorMessage: String?

    init(library: NoteLibrary) {
        self.library = library
    }

    func load() async {
        isLoading = true
        errorMessage = nil

        do {
            notes = try await library.notes()
        } catch {
            errorMessage = "Notes could not be loaded. Your saved data was not changed."
        }

        isLoading = false
    }
}

struct NoteListView: View {
    let model: NoteListModel

    var body: some View {
        NavigationStack {
            Group {
                if model.isLoading {
                    ProgressView("Loading notes")
                } else if let errorMessage = model.errorMessage {
                    ContentUnavailableView {
                        Label("Notes Unavailable", systemImage: "exclamationmark.triangle")
                    } description: {
                        Text(errorMessage)
                    } actions: {
                        Button("Try Again") {
                            Task { await model.load() }
                        }
                    }
                } else if model.notes.isEmpty {
                    ContentUnavailableView(
                        "No Notes Yet",
                        systemImage: "note.text",
                        description: Text("Your saved field notes will appear here.")
                    )
                } else {
                    List(model.notes) { note in
                        VStack(alignment: .leading) {
                            Text(note.title)
                            Text(note.tags.joined(separator: ", "))
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }
            .navigationTitle("Field Notes")
        }
        .task {
            await model.load()
        }
    }
}
