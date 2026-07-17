import FieldNotesCore
import UIKit

@MainActor
final class NoteListViewController: UITableViewController {
    private let library: NoteLibrary
    private var notes: [FieldNote] = []

    init(library: NoteLibrary) {
        self.library = library
        super.init(style: .insetGrouped)
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("Use init(library:).")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Field Notes"
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "NoteCell")

        Task { await load() }
    }

    func load() async {
        var loading = UIContentUnavailableConfiguration.loading()
        loading.text = "Loading notes"
        contentUnavailableConfiguration = loading

        do {
            notes = try await library.notes()
            tableView.reloadData()
            showEmptyStateIfNeeded()
        } catch {
            var unavailable = UIContentUnavailableConfiguration.empty()
            unavailable.image = UIImage(systemName: "exclamationmark.triangle")
            unavailable.text = "Notes Unavailable"
            unavailable.secondaryText = "Notes could not be loaded. Your saved data was not changed."
            var retry = UIButton.Configuration.borderedProminent()
            retry.title = "Try Again"
            unavailable.button = retry
            unavailable.buttonProperties.primaryAction = UIAction { [weak self] _ in
                Task { await self?.load() }
            }
            contentUnavailableConfiguration = unavailable
        }
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        notes.count
    }

    override func tableView(
        _ tableView: UITableView,
        cellForRowAt indexPath: IndexPath
    ) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "NoteCell", for: indexPath)
        let note = notes[indexPath.row]
        var configuration = cell.defaultContentConfiguration()
        configuration.text = note.title
        configuration.secondaryText = note.tags.joined(separator: ", ")
        cell.contentConfiguration = configuration
        cell.accessoryType = .disclosureIndicator
        return cell
    }

    private func showEmptyStateIfNeeded() {
        guard notes.isEmpty else {
            contentUnavailableConfiguration = nil
            return
        }

        var empty = UIContentUnavailableConfiguration.empty()
        empty.image = UIImage(systemName: "note.text")
        empty.text = "No Notes Yet"
        empty.secondaryText = "Your saved field notes will appear here."
        contentUnavailableConfiguration = empty
    }
}
