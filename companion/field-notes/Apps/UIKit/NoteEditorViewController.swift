import FieldNotesCore
import UIKit

@MainActor
final class NoteEditorViewController: UIViewController {
    private var draft: NoteDraft
    private let library: NoteLibrary
    private var state = SaveState.idle
    private let titleField = UITextField()
    private let bodyField = UITextView()
    private let tagsField = UITextField()
    private let message = UILabel()
    var onSaved: ((FieldNote) async -> Void)?

    init(draft: NoteDraft, library: NoteLibrary) { self.draft = draft; self.library = library; super.init(nibName: nil, bundle: nil) }
    @available(*, unavailable)
    required init?(coder: NSCoder) { fatalError("Use init(draft:library:).") }

    override func viewDidLoad() {
        super.viewDidLoad(); view.backgroundColor = .systemBackground
        title = draft.createdAt == nil ? "New Note" : "Edit Note"
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Cancel", primaryAction: UIAction { [weak self] _ in self?.dismiss(animated: true) })
        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Save", primaryAction: UIAction { [weak self] _ in self?.submit() })
        titleField.placeholder = "Title"; titleField.accessibilityLabel = "Title"; titleField.text = draft.title
        bodyField.accessibilityLabel = "Observation"; bodyField.text = draft.body
        tagsField.placeholder = "Tags, separated by commas"; tagsField.accessibilityLabel = "Tags, separated by commas"; tagsField.text = draft.tags
        message.numberOfLines = 0; message.textColor = .systemRed
        bodyField.font = .preferredFont(forTextStyle: .body); bodyField.adjustsFontForContentSizeCategory = true
        bodyField.heightAnchor.constraint(greaterThanOrEqualToConstant: 100).isActive = true
        for field in [titleField, tagsField] {
            field.borderStyle = .roundedRect; field.font = .preferredFont(forTextStyle: .body); field.adjustsFontForContentSizeCategory = true
        }
        let stack = UIStackView(arrangedSubviews: [titleField, bodyField, tagsField, message]); stack.axis = .vertical; stack.spacing = 16
        stack.translatesAutoresizingMaskIntoConstraints = false; view.addSubview(stack)
        NSLayoutConstraint.activate([
            stack.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
            stack.leadingAnchor.constraint(equalTo: view.layoutMarginsGuide.leadingAnchor),
            stack.trailingAnchor.constraint(equalTo: view.layoutMarginsGuide.trailingAnchor),
            stack.bottomAnchor.constraint(lessThanOrEqualTo: view.keyboardLayoutGuide.topAnchor, constant: -12)
        ])
    }

    private func updateInteraction() {
        let acceptsInput = state.acceptsInput
        titleField.isEnabled = acceptsInput
        tagsField.isEnabled = acceptsInput
        bodyField.isEditable = acceptsInput
        bodyField.isUserInteractionEnabled = acceptsInput
        navigationItem.rightBarButtonItem?.isEnabled = acceptsInput
        navigationItem.leftBarButtonItem?.isEnabled = acceptsInput
        isModalInPresentation = !acceptsInput
    }

    private func submit() {
        draft.title = titleField.text ?? ""; draft.body = bodyField.text ?? ""; draft.tags = tagsField.text ?? ""
        guard draft.canSave else {
            message.text = draft.titleError ?? draft.tagsError
            if draft.titleError != nil { titleField.becomeFirstResponder() } else { tagsField.becomeFirstResponder() }
            return
        }
        guard state.reduce(.requested) == .save else { return }
        updateInteraction()
        let submitted = draft
        Task {
            do {
                let note = try await SaveNote(library: library)(submitted)
                _ = state.reduce(.succeeded)
                await onSaved?(note)
                dismiss(animated: true)
            } catch {
                _ = state.reduce(.failed)
                message.text = "The note was not saved. Your draft is safe. Try Save again."
                updateInteraction()
            }
        }
    }
}
