import FieldNotesCore
import SwiftUI

struct TagFlowLayout: Layout {
    var rightToLeft = false
    var spacing: CGFloat = 8

    private func measurement(proposal: ProposedViewSize, subviews: Subviews) -> (FlowMeasurement, [CGSize]) {
        let measured = subviews.map { $0.sizeThatFits(ProposedViewSize(width: proposal.width, height: nil)) }
        let width = proposal.width ?? measured.reduce(0) { $0 + $1.width + spacing }
        let result = TagFlow.measure(
            sizes: measured.map { FlowSize(width: $0.width, height: $0.height) },
            width: width, spacing: spacing, rightToLeft: rightToLeft
        )
        return (result, measured)
    }

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let result = measurement(proposal: proposal, subviews: subviews).0
        return CGSize(width: result.size.width, height: result.size.height)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let (result, sizes) = measurement(proposal: ProposedViewSize(width: bounds.width, height: nil), subviews: subviews)
        for index in subviews.indices {
            let point = result.positions[index]
            subviews[index].place(
                at: CGPoint(x: bounds.minX + point.x, y: bounds.minY + point.y),
                anchor: .topLeading,
                proposal: ProposedViewSize(width: min(bounds.width, sizes[index].width), height: sizes[index].height)
            )
        }
    }
}

#Preview("Narrow and large text") {
    TagFlowLayout() {
        Text("Coastal observation")
        Text("Long localized label")
        Text("Birds")
    }
    .frame(width: 180)
    .environment(\.dynamicTypeSize, .accessibility3)
}

#Preview("Right to left") {
    TagFlowLayout(rightToLeft: true) {
        Text("الماء")
        Text("أشجار")
    }.frame(width: 180).environment(\.layoutDirection, .rightToLeft)
}
