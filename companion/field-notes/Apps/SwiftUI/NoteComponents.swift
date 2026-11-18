import FieldNotesCore
import SwiftUI

struct NoteRow: View {
    let note: FieldNote
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(note.title).font(.headline)
            if note.isFavorite { Label("Favorite", systemImage: "star.fill").font(.caption) }
            Text(note.body).font(.subheadline).foregroundStyle(.secondary).lineLimit(2)
            TagStrip(tags: note.tags)
        }.padding(.vertical, 4)
    }
}

struct TagChip: View {
    let name: String
    var body: some View {
        Text(name).font(.caption).padding(.horizontal, 8).padding(.vertical, 4)
            .background(Color.accentColor.opacity(0.12), in: Capsule())
            .accessibilityLabel("Tag, \(name)")
    }
}

struct TagStrip: View {
    let tags: [String]
    var body: some View {
        HStack { ForEach(tags, id: \.self) { TagChip(name: $0) } }
    }
}

struct EmptyState<Action: View>: View {
    let title: String
    @ViewBuilder let action: () -> Action
    var body: some View { VStack(spacing: 12) { Text(title).font(.headline); action() } }
}
