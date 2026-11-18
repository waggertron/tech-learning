public struct FlowSize: Equatable, Sendable {
    public let width: Double
    public let height: Double
    public init(width: Double, height: Double) { self.width = width; self.height = height }
}

public struct FlowPosition: Equatable, Sendable {
    public let x: Double
    public let y: Double
    public init(x: Double, y: Double) { self.x = x; self.y = y }
}

public struct FlowMeasurement: Equatable, Sendable {
    public let size: FlowSize
    public let positions: [FlowPosition]
}

/// Widths are measured by the interface before this pure row-packing step.
public enum TagFlow {
    public static func measure(sizes: [FlowSize], width: Double, spacing: Double = 8, rightToLeft: Bool = false) -> FlowMeasurement {
        let available = max(0, width.isFinite ? width : sizes.reduce(0) { $0 + $1.width + spacing })
        var positions: [FlowPosition] = []
        var x = 0.0
        var y = 0.0
        var rowHeight = 0.0
        var usedWidth = 0.0
        for size in sizes {
            let itemWidth = min(available, max(0, size.width))
            if x > 0, x + itemWidth > available {
                x = 0
                y += rowHeight + spacing
                rowHeight = 0
            }
            positions.append(FlowPosition(x: rightToLeft ? available - x - itemWidth : x, y: y))
            usedWidth = max(usedWidth, x + itemWidth)
            rowHeight = max(rowHeight, size.height)
            x += itemWidth + spacing
        }
        return FlowMeasurement(size: FlowSize(width: rightToLeft ? available : usedWidth, height: sizes.isEmpty ? 0 : y + rowHeight), positions: positions)
    }
}
