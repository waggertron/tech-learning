import FieldNotesCore
import Observation
import SwiftUI

@main
struct FieldNotesSwiftUIApp: App {
    @State private var model = NoteListModel(library: AppComposition.library())

    var body: some Scene {
        WindowGroup { NoteListView(model: model) }
    }
}

@MainActor
@Observable
final class NoteListModel {
    let library: NoteLibrary
    private(set) var notes: [FieldNote] = []
    private(set) var isLoading = false
    private(set) var errorMessage: String?
    var query = ""

    init(library: NoteLibrary) { self.library = library }

    var visibleNotes: [FieldNote] {
        let key = query.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        return key.isEmpty ? notes : notes.filter {
            $0.title.lowercased().contains(key) || $0.body.lowercased().contains(key)
                || $0.tags.contains { $0.lowercased().contains(key) }
        }
    }

    func load() async {
        guard !isLoading else { return }
        isLoading = true
        defer { isLoading = false }
        do {
            let loaded = try await library.notes()
            try Task.checkCancellation()
            notes = loaded; errorMessage = nil
        }
        catch is CancellationError { return }
        catch { errorMessage = "Notes could not be loaded. Your saved data was not changed." }
    }

    func save(_ draft: NoteDraft) async throws {
        try await SaveNote(library: library)(draft)
        await load()
    }

    func favorite(_ note: FieldNote) async {
        do {
            try await library.setFavorite(id: note.id, to: !note.isFavorite, at: Date())
            await load()
        } catch { errorMessage = "Favorite could not be changed. Try again." }
    }

    func delete(_ note: FieldNote) async throws {
        try await library.delete(id: note.id)
        await load()
    }
}

struct NoteListView: View {
    @Bindable var model: NoteListModel
    @State private var newDraft: NoteDraft?

    var body: some View {
        NavigationStack {
            Group {
                if model.isLoading, model.notes.isEmpty { ProgressView("Loading notes") }
                else if let message = model.errorMessage, model.notes.isEmpty {
                    ContentUnavailableView {
                        Label("Notes Unavailable", systemImage: "exclamationmark.triangle")
                    } description: { Text(message) } actions: {
                        Button("Try Again") { Task { await model.load() } }
                    }
                } else if model.visibleNotes.isEmpty {
                    ContentUnavailableView(
                        model.query.isEmpty ? "No Notes Yet" : "No Matching Notes",
                        systemImage: "note.text",
                        description: Text(model.query.isEmpty ? "Create a note to record an observation." : "Change or clear your search.")
                    )
                } else {
                    List(model.visibleNotes) { note in
                        NavigationLink {
                            NoteDetailScreen(id: note.id, model: model)
                        } label: {
                            NoteRow(note: note)
                        }
                    }
                }
            }
            .safeAreaInset(edge: .top) {
                if let message = model.errorMessage, !model.notes.isEmpty {
                    VStack {
                        Text(message)
                        Button("Try Again") { Task { await model.load() } }
                    }.padding().background(.regularMaterial)
                }
            }
            .navigationTitle("Field Notes")
            .searchable(text: $model.query, prompt: "Search notes")
            .toolbar { Button("New Note", systemImage: "plus") { newDraft = NoteDraft() } }
            .sheet(item: $newDraft) { draft in NoteEditorScreen(draft: draft, save: model.save) }
            .refreshable { await model.load() }
        }
        .task { await model.load() }
    }
}

private struct NoteDetailScreen: View {
    let id: NoteID
    @Bindable var model: NoteListModel
    @Environment(\.dismiss) private var dismiss
    @State private var draft: NoteDraft?
    @Environment(\.layoutDirection) private var layoutDirection
    @State private var confirmDelete = false
    @State private var deleteError: String?

    var body: some View {
        if let note = model.notes.first(where: { $0.id == id }) {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text(note.body)
                    TagFlowLayout(rightToLeft: layoutDirection == .rightToLeft) {
                        ForEach(note.tags, id: \.self) { Text($0).padding(6).background(.quaternary, in: Capsule()) }
                    }
                    Button(note.isFavorite ? "Remove Favorite" : "Mark Favorite") { Task { await model.favorite(note) } }
                    Button("Edit Note") { draft = NoteDraft(note: note) }
                    Button("Delete Note", role: .destructive) { confirmDelete = true }
                    if let message = deleteError { Text(message).foregroundStyle(.red) }
                    if let message = model.errorMessage { Text(message).foregroundStyle(.red) }
                }.frame(maxWidth: .infinity, alignment: .leading).padding()
            }
            .navigationTitle(note.title)
            .sheet(item: $draft) { NoteEditorScreen(draft: $0, save: model.save) }
            .confirmationDialog("Delete this note?", isPresented: $confirmDelete, titleVisibility: .visible) {
                Button("Delete", role: .destructive) {
                    Task {
                        do { try await model.delete(note); dismiss() }
                        catch { deleteError = "The note was not deleted. Try again." }
                    }
                }
            }
        } else { ContentUnavailableView("Note Unavailable", systemImage: "note.text") }
    }
}

struct NoteEditorScreen: View {
    @State var draft: NoteDraft
    let save: (NoteDraft) async throws -> Void
    @Environment(\.dismiss) private var dismiss
    @State private var state = SaveState.idle
    @State private var attemptedSave = false
    @FocusState private var titleFocused: Bool

    var body: some View {
        NavigationStack {
            Form {
                TextField("Title", text: $draft.title).focused($titleFocused)
                if attemptedSave, let error = draft.titleError { Text(error).foregroundStyle(.red) }
                Section("Observation") {
                    TextEditor(text: $draft.body).frame(minHeight: 100).accessibilityLabel("Observation")
                }
                TextField("Tags, separated by commas", text: $draft.tags)
                if attemptedSave, let error = draft.tagsError { Text(error).foregroundStyle(.red) }
                Toggle("Favorite", isOn: $draft.isFavorite)
                if state == .saving { ProgressView("Saving note") }
                if state == .failed { Text("The note was not saved. Your draft is safe. Try Save again.").foregroundStyle(.red) }
            }
            .disabled(!state.acceptsInput)
            .navigationTitle(draft.createdAt == nil ? "New Note" : "Edit Note")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() }.disabled(!state.acceptsInput) }
                ToolbarItem(placement: .confirmationAction) { Button("Save", action: submit).disabled(!state.acceptsInput) }
            }
            .interactiveDismissDisabled(!state.acceptsInput)
        }
    }

    private func submit() {
        attemptedSave = true
        guard draft.canSave else { titleFocused = true; return }
        guard state.reduce(.requested) == .save else { return }
        let submitted = draft
        Task {
            do { try await save(submitted); _ = state.reduce(.succeeded); dismiss() }
            catch { _ = state.reduce(.failed) }
        }
    }
}
