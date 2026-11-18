import FieldNotesCore
import UIKit

@MainActor
final class NoteListViewController: UITableViewController, UISearchResultsUpdating {
    let library: NoteLibrary
    private var notes: [FieldNote] = []
    private var visibleNotes: [FieldNote] = []
    private let search = UISearchController(searchResultsController: nil)
    private var loadTask: Task<Void, Never>?
    private var isLoading = false

    init(library: NoteLibrary) {
        self.library = library
        super.init(style: .insetGrouped)
    }
    @available(*, unavailable)
    required init?(coder: NSCoder) { fatalError("Use init(library:).") }

    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Field Notes"
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "NoteCell")
        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "New Note", primaryAction: UIAction { [weak self] _ in self?.edit(nil) })
        search.searchResultsUpdater = self
        search.searchBar.placeholder = "Search notes"
        navigationItem.searchController = search
        loadTask = Task { [weak self] in await self?.load() }
    }

    deinit { loadTask?.cancel() }

    func load() async {
        guard !isLoading else { return }
        isLoading = true
        defer { isLoading = false }
        if notes.isEmpty { contentUnavailableConfiguration = UIContentUnavailableConfiguration.loading() }
        do {
            let result = try await library.notes()
            try Task.checkCancellation()
            notes = result
            updateSearchResults(for: search)
        } catch is CancellationError { return }
        catch {
            if !notes.isEmpty {
                let alert = UIAlertController(title: "Refresh Failed", message: "Your existing notes are still available. Try again later.", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default))
                present(alert, animated: true)
                return
            }
            var unavailable = UIContentUnavailableConfiguration.empty()
            unavailable.text = "Notes Unavailable"
            unavailable.secondaryText = "Notes could not be loaded. Your saved data was not changed."
            var retry = UIButton.Configuration.borderedProminent(); retry.title = "Try Again"
            unavailable.button = retry
            unavailable.buttonProperties.primaryAction = UIAction { [weak self] _ in Task { await self?.load() } }
            contentUnavailableConfiguration = unavailable
        }
    }

    func updateSearchResults(for searchController: UISearchController) {
        let key = (searchController.searchBar.text ?? "").trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        visibleNotes = key.isEmpty ? notes : notes.filter {
            $0.title.lowercased().contains(key) || $0.body.lowercased().contains(key)
                || $0.tags.contains { $0.lowercased().contains(key) }
        }
        tableView.reloadData()
        if visibleNotes.isEmpty {
            var empty = UIContentUnavailableConfiguration.empty()
            empty.text = key.isEmpty ? "No Notes Yet" : "No Matching Notes"
            empty.secondaryText = key.isEmpty ? "Create a note to record an observation." : "Change or clear your search."
            contentUnavailableConfiguration = empty
        } else { contentUnavailableConfiguration = nil }
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int { visibleNotes.count }
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "NoteCell", for: indexPath)
        let note = visibleNotes[indexPath.row]
        var content = cell.defaultContentConfiguration()
        content.text = note.title
        content.secondaryText = note.tags.joined(separator: ", ") + (note.isFavorite ? " Favorite" : "")
        cell.contentConfiguration = content
        cell.accessoryType = .disclosureIndicator
        return cell
    }
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let note = visibleNotes[indexPath.row]
        let detail = NoteDetailViewController(note: note, library: library)
        detail.onChanged = { [weak self] in await self?.load() }
        navigationController?.pushViewController(detail, animated: true)
    }

    private func edit(_ note: FieldNote?) {
        let editor = NoteEditorViewController(draft: note.map { NoteDraft(note: $0) } ?? NoteDraft(), library: library)
        editor.onSaved = { [weak self] _ in await self?.load() }
        present(UINavigationController(rootViewController: editor), animated: true)
    }
}

@MainActor
final class NoteDetailViewController: UIViewController {
    private var note: FieldNote
    private let library: NoteLibrary
    var onChanged: (() async -> Void)?
    private let bodyLabel = UILabel()
    private let favorite = UIButton(type: .system)

    init(note: FieldNote, library: NoteLibrary) { self.note = note; self.library = library; super.init(nibName: nil, bundle: nil) }
    @available(*, unavailable)
    required init?(coder: NSCoder) { fatalError("Use init(note:library:).") }

    override func viewDidLoad() {
        super.viewDidLoad(); view.backgroundColor = .systemBackground
        bodyLabel.numberOfLines = 0; bodyLabel.font = .preferredFont(forTextStyle: .body)
        bodyLabel.adjustsFontForContentSizeCategory = true
        favorite.addAction(UIAction { [weak self] _ in Task { await self?.toggleFavorite() } }, for: .touchUpInside)
        let edit = UIButton(type: .system); edit.setTitle("Edit Note", for: .normal)
        edit.addAction(UIAction { [weak self] _ in self?.edit() }, for: .touchUpInside)
        let delete = UIButton(type: .system); delete.setTitle("Delete Note", for: .normal)
        delete.addAction(UIAction { [weak self] _ in self?.confirmDelete() }, for: .touchUpInside)
        let stack = UIStackView(arrangedSubviews: [bodyLabel, favorite, edit, delete]); stack.axis = .vertical; stack.spacing = 16
        stack.translatesAutoresizingMaskIntoConstraints = false; view.addSubview(stack)
        NSLayoutConstraint.activate([
            stack.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
            stack.leadingAnchor.constraint(equalTo: view.layoutMarginsGuide.leadingAnchor),
            stack.trailingAnchor.constraint(equalTo: view.layoutMarginsGuide.trailingAnchor),
            stack.bottomAnchor.constraint(lessThanOrEqualTo: view.safeAreaLayoutGuide.bottomAnchor)
        ])
        render()
    }
    private func render() { title = note.title; bodyLabel.text = note.body + "\n" + note.tags.joined(separator: ", "); favorite.setTitle(note.isFavorite ? "Remove Favorite" : "Mark Favorite", for: .normal) }
    private func edit() {
        let editor = NoteEditorViewController(draft: NoteDraft(note: note), library: library)
        editor.onSaved = { [weak self] note in self?.note = note; self?.render(); await self?.onChanged?() }
        present(UINavigationController(rootViewController: editor), animated: true)
    }
    private func toggleFavorite() async {
        do { note = try await library.setFavorite(id: note.id, to: !note.isFavorite, at: Date()); render(); await onChanged?() }
        catch { showError("Favorite could not be changed. Try again.") }
    }
    private func confirmDelete() {
        let alert = UIAlertController(title: "Delete this note?", message: "The note will be removed from this library.", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Delete", style: .destructive) { [weak self] _ in
            Task {
                guard let self else { return }
                do { try await library.delete(id: note.id); await onChanged?(); navigationController?.popViewController(animated: true) }
                catch { showError("The note was not deleted. Try again.") }
            }
        })
        present(alert, animated: true)
    }
    private func showError(_ message: String) { let alert = UIAlertController(title: "Action Failed", message: message, preferredStyle: .alert); alert.addAction(UIAlertAction(title: "OK", style: .default)); present(alert, animated: true) }
}
